const { Post, PostComment } = require("../models");

exports.getTotals = async () => {
  const [totalPosts, totalComments] = await Promise.all([
    Post.countDocuments(),
    PostComment.countDocuments()
  ]);
  return { totalPosts, totalComments };
};
