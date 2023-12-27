const assert = require("assert");
const {
  shapeIntoMongooseObjectId,
  lookup_auth_member_liked,
} = require("../lib/config");
const {
  product_collection_enums,
  product_size_enums,
  product_color_enums,
  product_type_enums,
} = require("../lib/config");
const ProductModel = require("../schema/product.model");
const Definer = require("../lib/mistake");
const Member = require("./Member");

class Product {
  constructor() {
    this.productModel = ProductModel;
  }

  async getAllProductsData(member, data) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);

      let match = { product_status: "PROCESS" };

      if (data.order === "discount.value") {
        match["$expr"] = {
          $and: [
            { $ifNull: ["$discount", false] },
            { $lte: ["$discount.startDate", new Date()] },
            { $gte: ["$discount.endDate", new Date()] },
          ],
        };
      }

      if (data.brand_mb_id !== "all") {
        match["brand_mb_id"] = shapeIntoMongooseObjectId(data.brand_mb_id);
      }

      if (data.product_name !== "all") {
        match["product_name"] = {
          $regex: new RegExp(data.product_name, "i"),
        };
      }

      if (data.product_collection === "all") {
        match["product_collection"] = { $in: product_collection_enums };
      } else {
        match["product_collection"] = data.product_collection;
      }

      const sort = {};

      if (data.order === "product_price") {
        sort[data.order] = 1;
      } else if (data.order === "discount.value") {
        sort["sortDiscountValue"] = -1;
      } else {
        sort[data.order] = -1;
      }

      const pipeline = [
        { $match: match },
        {
          $addFields: {
            discountedPrice: {
              $cond: [
                {
                  $and: [
                    { $ifNull: ["$discount", false] },
                    { $lte: ["$discount.startDate", new Date()] },
                    { $gte: ["$discount.endDate", new Date()] },
                    { $ne: ["$discount.value", 0] },
                  ],
                },
                {
                  $cond: [
                    { $eq: ["$discount.type", "percentage"] },
                    {
                      $multiply: [
                        {
                          $subtract: [1, { $divide: ["$discount.value", 100] }],
                        },
                        "$product_price",
                      ],
                    },
                    { $subtract: ["$product_price", "$discount.value"] },
                  ],
                },
                {
                  $cond: [{ $eq: ["$discount.value", 0] }, 0, 0],
                },
              ],
            },
          },
        },
        {
          $addFields: {
            discountedPrice: {
              $cond: [{ $eq: ["$discount.value", 0] }, 0, "$discountedPrice"],
            },
          },
        },
        {
          $addFields: {
            sortDiscountValue: {
              $cond: [
                {
                  $and: [
                    { $ifNull: ["$discount", false] },
                    { $lte: ["$discount.startDate", new Date()] },
                    { $gte: ["$discount.endDate", new Date()] },
                  ],
                },
                "$discount.value",
                null,
              ],
            },
          },
        },
        {
          $addFields: {
            sortDiscountValue: {
              $cond: [
                { $eq: ["$sortDiscountValue", null] },
                -Infinity,
                "$sortDiscountValue",
              ],
            },
          },
        },
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "comment_ref_product_id",
            as: "product_comments",
          },
        },
        {
          $addFields: {
            total_rating_count: { $size: "$product_comments" },
          },
        },
        {
          $unwind: {
            path: "$product_comments",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: {
              _id: "$_id",
              product_rating: "$product_comments.product_rating",
            },
            product: { $first: "$$ROOT" },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id._id",
            product: { $first: "$product" },
            product_ratings: {
              $push: {
                product_rating: "$_id.product_rating",
                count: "$count",
                percentage: {
                  $cond: [
                    { $ne: ["$product.total_rating_count", 0] },
                    {
                      $multiply: [
                        { $divide: ["$count", "$product.total_rating_count"] },
                        100,
                      ],
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                "$product",
                { product_ratings: "$product_ratings" },
              ],
            },
          },
        },
        {
          $unwind: {
            path: "$product_ratings",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: { "product_ratings.product_rating": -1 },
        },
        {
          $group: {
            _id: "$_id",
            product: { $first: "$$ROOT" },
            product_ratings: { $push: "$product_ratings" },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                "$product",
                { product_ratings: "$product_ratings" },
              ],
            },
          },
        },
        {
          $addFields: {
            product_ratings: {
              $map: {
                input: "$product_ratings",
                as: "rating",
                in: {
                  product_rating: { $round: ["$$rating.product_rating", 1] },
                  count: "$$rating.count",
                  percentage: { $round: ["$$rating.percentage", 1] },
                },
              },
            },
            product_rating: { $round: ["$product_rating", 1] },
            // Round the top-level product_rating field
          },
        },
        { $project: { product_comments: 0, total_rating_count: 0 } },
        { $sort: sort },
        { $skip: (data.page * 1 - 1) * data.limit },
        { $limit: data.limit * 1 },
        lookup_auth_member_liked(auth_mb_id),
      ];

      const result = await this.productModel.aggregate(pipeline).exec();
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenProductData(member, id) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      id = shapeIntoMongooseObjectId(id);

      if (member) {
        const member_obj = new Member();
        await member_obj.viewChosenItemByMember(member, id, "product");
      }
      let match = { _id: id, product_status: "PROCESS" };

      const pipeline = [
        { $match: match },
        {
          $addFields: {
            discountedPrice: {
              $cond: [
                {
                  $and: [
                    { $ifNull: ["$discount", false] },
                    { $lte: ["$discount.startDate", new Date()] },
                    { $gte: ["$discount.endDate", new Date()] },
                    { $ne: ["$discount.value", 0] },
                  ],
                },
                {
                  $cond: [
                    { $eq: ["$discount.type", "percentage"] },
                    {
                      $multiply: [
                        {
                          $subtract: [1, { $divide: ["$discount.value", 100] }],
                        },
                        "$product_price",
                      ],
                    },
                    { $subtract: ["$product_price", "$discount.value"] },
                  ],
                },
                {
                  $cond: [{ $eq: ["$discount.value", 0] }, 0, 0],
                },
              ],
            },
          },
        },
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "comment_ref_product_id",
            as: "product_comments",
          },
        },
        {
          $addFields: {
            total_rating_count: { $size: "$product_comments" },
          },
        },
        {
          $unwind: {
            path: "$product_comments",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: {
              _id: "$_id",
              product_rating: "$product_comments.product_rating",
            },
            product: { $first: "$$ROOT" },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id._id",
            product: { $first: "$product" },
            product_ratings: {
              $push: {
                product_rating: "$_id.product_rating",
                count: "$count",
                percentage: {
                  $cond: [
                    { $ne: ["$product.total_rating_count", 0] },
                    {
                      $multiply: [
                        { $divide: ["$count", "$product.total_rating_count"] },
                        100,
                      ],
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                "$product",
                { product_ratings: "$product_ratings" },
              ],
            },
          },
        },
        {
          $unwind: {
            path: "$product_ratings",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: { "product_ratings.product_rating": -1 },
        },
        {
          $group: {
            _id: "$_id",
            product: { $first: "$$ROOT" },
            product_ratings: { $push: "$product_ratings" },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                "$product",
                { product_ratings: "$product_ratings" },
              ],
            },
          },
        },
        {
          $addFields: {
            product_ratings: {
              $map: {
                input: "$product_ratings",
                as: "rating",
                in: {
                  product_rating: { $round: ["$$rating.product_rating", 1] },
                  count: "$$rating.count",
                  percentage: { $round: ["$$rating.percentage", 1] },
                },
              },
            },
            product_rating: { $round: ["$product_rating", 1] },
          },
        },
        { $project: { product_comments: 0, total_rating_count: 0 } },
        lookup_auth_member_liked(auth_mb_id),
      ];

      const result = await this.productModel.aggregate(pipeline).exec();

      assert.ok(result, Definer.general_err1);
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  async getAllProductsDataBrand(member) {
    try {
      member._id = shapeIntoMongooseObjectId(member._id);
      const result = await this.productModel.find({
        brand_mb_id: member._id,
      });
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async addNewProductData(data, member) {
    try {
      /* mb_id ni MongoDB objectga aylantirilyapti String bo'msligi kk */
      data.brand_mb_id = shapeIntoMongooseObjectId(member._id);
      console.log(data);

      const new_product = new this.productModel(data);
      const result = await new_product.save();

      assert.ok(result, Definer.product_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateChosenProductData(id, updated_data, mb_id) {
    try {
      id = shapeIntoMongooseObjectId(id);
      mb_id = shapeIntoMongooseObjectId(mb_id);

      const result = await this.productModel
        .findOneAndUpdate({ _id: id, brand_mb_id: mb_id }, updated_data, {
          runValidators: true,
          lean: true,
          returnDocument: "after",
        })
        .exec();

      assert.ok(result, Definer.general_err1);
      console.log(result);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateChosenDiscountProductData(productId, update) {
    try {
      productId = shapeIntoMongooseObjectId(productId);

      const result = await this.productModel
        .findByIdAndUpdate(
          { _id: productId },
          {
            $set: {
              "discount.type": update.discount.type,
              "discount.value": update.discount.value,
              "discount.startDate": update.discount.startDate,
              "discount.endDate": update.discount.endDate,
            },
          },
          { runValidators: true, lean: true, returnDocument: "after" }
        )
        .exec();

      assert.ok(result, Definer.product_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateChosenProductDiscountDataAll() {
    try {
      const result = await this.productModel
        .updateMany(
          { product_discount: { $exists: true } },
          {
            $set: {
              discount: {
                type: "percentage",
                value: 0,
                startDate: null,
                endDate: null,
              },
            },
            $unset: { product_discount: "" },
          }
        )
        .exec();

      assert.ok(result, Definer.product_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Product;
