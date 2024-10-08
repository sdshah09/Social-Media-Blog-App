const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: "Content is required",
    text: true,
  },
  image: {
    url: {
      type: String,
      default: "https://placehold.co/200x200.png?text=Post",
    },
    public_id: {
      type: String,
      default: Date.now,
    },
  },
  postedBy: {
    type: ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model('Post', postSchema);
