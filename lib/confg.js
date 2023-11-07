const mongoose = require("mongoose");

exports.member_type_enums = ["USER", "ADMIN", "PEDAL", "BRAND"];
exports.member_status_enums = ["ONPAUSE", "ACTIVE", "DELETED"];
exports.ordernary_enums = ["Y", "N"];

exports.product_collection_enums = ["formal", "running", "training", "sports"];
exports.product_size_enums = ["all", "270", "275", "280", "285"];
exports.product_color_enums = ["white", "green", "blue", "red", "black"];
exports.product_type_enums = ["men", "women"];

exports.product_collection_enums = [
  "clothing",
  "shoes",
  "baby care",
  "toy",
  "book",
  "ride-ons",
  "gifts",
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

exports.event_status_enums = ["PAUSED", "ACTIVE", "DELETED"];

/************************************
 *     MONGODB RELATED COMMANDS     *
 ***********************************/

exports.shapeIntoMongooseObjectId = (target) => {
  if (typeof target === "string") {
    return new mongoose.Types.ObjectId(target);
  } else return target;
};
