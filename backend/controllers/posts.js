const Post = require("../models/Post");
const Comment = require("../models/Comment");
const mongoose = require("mongoose");
const { getTotals } = require("../services/stats");

exports.list = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "comments", options: { sort: { createdAt: -1 } } })
      .lean({ virtuals: true });
    const { totalPosts, totalComments } = await getTotals();
    res.render("posts", {
      title: "文章列表",
      posts,
      totalPosts,
      totalComments
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.create = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).send("Invalid input");
    }
    await Post.create({ title, content });
    res.redirect("/posts");
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;
    if (!content || !mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).send("Invalid input");
    }
    await Comment.create({ content, post: postId });
    res.redirect("/posts");
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

