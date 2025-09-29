const mongoose = require("mongoose");

const PostCommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PostComment", PostCommentSchema);
