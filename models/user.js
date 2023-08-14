const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, minLength: 3, maxLength: 100 },
  last_name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  username: { type: String, required: true, maxLength: 100 },
  password: { type: String, required: true, minLength: 8, maxLength: 100 },
  status: {
    type: String,
    required: true,
    enum: ["Basic", "Admin"],
    default: "Basic",
  },
});

// Export model
module.exports = mongoose.model("User", UserSchema);
