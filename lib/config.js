const mongoose = require("mongoose");

exports.member_type_enums = ["USER", "ADMIN", "PEDAL", "BRAND"];
exports.member_status_enums = ["ONPAUSE", "ACTIVE", "DELETED"];
exports.ordernary_enums = ["Y", "N"];

exports.product_collection_enums = [
  "clothing",
  "shoes",
  "baby care",
  "toy",
  "ride-ons",
  "gift",
];
exports.product_status_enums = ["PAUSED", "PROCESS", "DELETED"];
exports.product_color_enums = [
  "brown",
  "green",
  "blue",
  "red",
  "orange",
  "yellow",
  "white",
  "etc",
];
exports.product_type_enums = ["boy", "girl", "unisex"];
exports.product_size_enums = ["1-6 months", "6-12 months", "12-18 months", "18-24 months"];
exports.product_volume_enums = [110, 120, 130, 140];

exports.order_status_enums = ["PAUSED", "PROCESS", "FINISHED", "DELETED"];

exports.like_view_group_list = ["product", "member", "community", "comment"];
exports.board_id_enum_list = ["celebrity", "evaluation", "story"];
exports.board_article_status_enum_list = ["active", "deleted"];

exports.comment_status_enum_list = ["active", "deleted", "blocked"];

/************************************
 *     MONGODB RELATED COMMANDS     *
 ***********************************/

exports.shapeIntoMongooseObjectId = (target) => {
  if (typeof target === "string") {
    return new mongoose.Types.ObjectId(target);
  } else return target;
};


// user o'zini followeriga follow back qilgan yoki followni cancel qilishini ko'rsatishda ishlatilyapti
// user o'zini followeriga follow back qilgan yoki followni cancel qilishini ko'rsatishda ishlatilyapti
exports.lookup_auth_member_following = (mb_id, origin) => {
  const follow_id = origin === "follows" ? "$subscriber_id" : "$_id";
  return {
    $lookup: {
      from: "follows",
      let: {
        lc_follow_id: follow_id,
        lc_subscriber_id: mb_id, //follow_idga teng bo'lyapti
        nw_my_following:  true
      },
      pipeline: [ //bir necha (joined) collection bn ishlagani un ham pipeline kk
        {
          $match: {
            $expr: {
              $and: [
                {$eq: ["$follow_id", "$$lc_follow_id"]},
                {$eq: ["$subscriber_id", "$$lc_subscriber_id"]},
              ],
            },
          },
        },
        {
          $project: {
            _id: 0, //nullish qiymatlarni bersak obkeb bermaydi
            subscriber_id: 1,
            follow_id: 1,
            my_following: "$$nw_my_following"
          },
        },
      ],
      as: "me_followed",
    },
  };
};

exports.lookup_auth_member_liked = (mb_id) => {
  return {
    $lookup: {
      from: "likes",
      let: {
        lc_liken_item_id: "$_id",
        lc_mb_id: mb_id,
        nw_my_favorite:  true
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {$eq: ["$like_ref_id", "$$lc_liken_item_id"]},
                {$eq: ["$mb_id", "$$lc_mb_id"]},
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            mb_id: 1,
            like_ref_id: 1,
            my_favorite: "$$nw_my_favorite",
          },
        },
      ],
      as: "me_liked",
    },
  };
};

exports.look_up_member_viewed = (mb_id) => {
  return {
    $lookup: {
      from: "views",
      let: {
        lc_item_id: "$_id",
        lc_mb_id: mb_id,
        nw_my_view: true,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$view_ref_id", "$$lc_item_id"] },
                { $eq: ["$mb_id", "$$lc_mb_id"] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            mb_id: 1,
            view_ref_id: 1,
            my_view: "$$nw_my_view",
          },
        },
      ],
      as: "me_viewed",
    },
  };
};

exports.look_up_product_rating = (mb_id) => {
  return {
    pipeline: [
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "comment_ref_product_id",
          as: "ratings",
        },
      },
      {
        $unwind: "$ratings",
      },
      {
        $group: {
          _id: {
            product_id: "$ratings.comment_ref_product_id",
            avgRating: {
              $avg: "$ratings.product_rating",
            },
          },
        },
      },
      { $project: { category: "$_id", avgRating: 1 } },
    ],
    as: "me_vieweratid",
  };
};

exports.look_up_product_price = (mb_id) => {
  return {
    pipeline: [
      {
        $project: {
          _id: 1,
          name: 1,
          product_price: 1,
          product_discount: 1,
          discountedPrice: {
            $subtract: [
              "$product_price",
              {
                $multiply: [
                  "$product_price",
                  { $divide: ["$product_discount", 100] },
                ],
              },
            ],
          },
        },
      },
    ],
  };
};