const mongoose = require("mongoose");
const { event_status_enums } = require("../lib/config");
const Schema = mongoose.Schema;

const eventSchema = new mongoose.Schema(
  {
    brand_mb_id: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    brand_mb_nick: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    event_name: {
      type: String,
      required: true,
    },
    event_status: {
      type: String,
      required: true,
      default: "PAUSED",
      enum: {
        values: event_status_enums,
        message: "{VALUE} is not among permitted values",
      },
    },
    event_description: { type: String, required: true },
    event_image: {
      type: String,
      required: true,
    },
    event_address: {
      type: String,
      required: false
    },
    event_date: {
      type: Number,
      required: false
    },
  },
  { timestamps: true }
);
eventSchema.index(
  { brand_mb_id: 1, event_name: 1, event_description: 1, event_date: 1 },
  { unique: true }
);

module.exports = mongoose.model("Event", eventSchema);
