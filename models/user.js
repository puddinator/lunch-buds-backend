const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  // image: { type: String },
  // places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
  number: { type: String, required: true },
  interests: [{ type: String }],

  apples: { type: Number, required: true },
  trees: [{ type: String }],
  vouchers: [{ type: String }],

  openToMatch: { type: Boolean, required: true },
  matchDateTime: { start: { type: String }, end: { type: String } },
  pastMatches: [
    { type: mongoose.Types.ObjectId, required: true, ref: "Match" },
  ],
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
