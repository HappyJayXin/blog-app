const Post = require("../models/Post");
const Comment = require("../models/Comment");

exports.list = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    const postsWithComments = await Promise.all(
      posts.map(async post => {
        const comments = await Comment.find({ post: post._id })
          .sort({ createdAt: -1 })
          .lean();
        return { ...post, comments };
      })
    ); // attach comments
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();
    res.render("posts", {
      title: "文章列表",
      posts: postsWithComments,
      totalPosts,
      totalComments
    });
  } catch (err) {
    res.status(500).send("server error");
  }
};

exports.create = async (req, res) => {
  try {
    const { title, content } = req.body;
    await Post.create({ title, content });
    res.redirect("/posts");
  } catch (err) {
    res.status(500).send("server error");
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    await Comment.create({ content, post: req.params.id });
    res.redirect("/posts");
  } catch (err) {
    res.status(500).send("server error");
  }
};

