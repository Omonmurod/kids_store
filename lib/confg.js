const mongoose = require("mongoose");

exports.member_type_enums = ["USER", "ADMIN", "PEDAL", "BRAND"];
exports.member_status_enums = ["ONPAUSE", "ACTIVE", "DELETED"];
exports.ordernary_enums = ["Y", "N"];

exports.product_collection_enums = [
  "clothing",
  "shoes",
  "baby care",
  "toy",
  "book",
  "game",
  "ride-ons",
];
exports.product_status_enums = ["PAUSED", "PROCESS", "DELETED"];
exports.product_color_enums = [
  "brown",
  "green",
  "blue",
  "red",
  "black",
  "orange",
  "yellow",
  "etc",
];
exports.product_type_enums = ["boy", "girl", "uni"];
exports.product_size_enums = ["small", "normal", "large", "set"];
exports.product_volume_enums = [0.5, 1, 1.2, 1.5, 2];

/************************************
 *     MONGODB RELATED COMMANDS     *
 ***********************************/

exports.shapeIntoMongooseObjectId = (target) => {
  if (typeof target === "string") {
    return new mongoose.Types.ObjectId(target);
  } else return target;
};
