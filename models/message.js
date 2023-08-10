const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    title: { type: String, required: true, minLength: 3, maxLength: 200 },
    text: { type: String, required: true, minLength: 3, maxLength: 400 },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Export model
module.exports = mongoose.model("Message", MessageSchema);
