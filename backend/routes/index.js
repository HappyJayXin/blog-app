const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  let totalPosts = 0;
  let totalComments = 0;
  if (mongoose.connection.readyState === 1) {
    try {
      totalPosts = await Post.countDocuments();
      totalComments = await Comment.countDocuments();
    } catch (err) {
      // ignore db error
    }
  }
  res.render("index", {
    title: "Blog App",
    message: "歡迎來到我的 Blog !",
    totalPosts,
    totalComments
  });
});

module.exports = router;

