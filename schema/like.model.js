const mongoose = require("mongoose");
const { like_view_group_list, board_id_enum_list } = require("../lib/config");
const Schema = mongoose.Schema;

const likeSchema = new mongoose.Schema({
  mb_id: { type: Schema.Types.ObjectId, required: true },
  like_ref_id: { type: Schema.Types.ObjectId, required: true },
  like_group: {
    type: String,
    required: true,
    enum: {
      //bu enum value umumiy yozilgan ham like ham view uchun
      values: like_view_group_list
    }
  },
  // article larni like qilganda board id (bo_id) kerak bo'ladi
  bo_id: {
    type: String,
    required: false,
    enum: {
      values: board_id_enum_list
    },
  },
}, {timestamps: {createdAt: true}});

module.exports = mongoose.model("Like", likeSchema);