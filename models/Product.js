const assert = require("assert");
const { shapeIntoMongooseObjectId, lookup_auth_member_liked, } = require("../lib/config");
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

      let match = {
        product_status: "PROCESS",
        product_collection: data.product_collection,
      };
      if (data.brand_mb_id) {
        match["brand_mb_id"] = shapeIntoMongooseObjectId(data.brand_mb_id);
      }

      const sort =
        data.order === "product_price"
          ? { [data.order]: 1 }
          : { [data.order]: -1 };

      const result = await this.productModel
        .aggregate([
          { $match: match },
          { $sort: sort },
          { $skip: (data.page * 1 - 1) * data.limit },
          { $limit: data.limit * 1 },
          // check auth member product likes
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();

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

      const result = await this.productModel
        .aggregate([
          { $match: { _id: id, product_status: "PROCESS" } },
          // check auth member product likes
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();

      assert.ok(result, Definer.general_err1);
      return result;
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
      console.log("1");
      productId = shapeIntoMongooseObjectId(productId);
      // mb_id = shapeIntoMongooseObjectId(mb_id);

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

      console.log("3", result);
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
