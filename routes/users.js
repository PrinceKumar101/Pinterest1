var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URL);
const schema = mongoose.Schema;
const plm = require("passport-local-mongoose");

const UserSchema = new schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  profilePicture: { type: String },
  bio: { type: String },
  date: { type: Date, default: Date.now },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

UserSchema.plugin(plm);

module.exports = mongoose.model("user", UserSchema);
