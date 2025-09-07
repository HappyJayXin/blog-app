const Post = require("../models/Post");
const Comment = require("../models/Comment");

exports.getTotals = async () => {
  const [totalPosts, totalComments] = await Promise.all([
    Post.countDocuments(),
    Comment.countDocuments()
  ]);
  return { totalPosts, totalComments };
};
