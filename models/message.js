const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    title: { type: String, required: true, minLength: 1, maxLength: 200 },
    text: { type: String, required: true, minLength: 3, maxLength: 400 },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Virtual for message creation date
MessageSchema.virtual("created_date_formatted").get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED);
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);
