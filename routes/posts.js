const mongoose = require("mongoose");

// Define the Post schema
const postSchema = new mongoose.Schema({
  
  image: {
    type: String,
  },
  title:{
    type: String,
  },
  description:{
    type: String,
  },
  users: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    
    
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Array,
    default: [],
  },
});

// Create the Post model


module.exports =  mongoose.model("post", postSchema);
