const { Comment } = require("../models");

module.exports = {
  async getLatestComments(limit = 5) {
    const comments = await Comment.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate("image_id", "title uniqueId")
      .lean();
    return comments
      .filter(item => Boolean(item.image_id))
      .map(item => ({
        ...item,
        text: item.comment,
        createdAt: item.timestamp,
        imageTitle: item.image_id.title,
        imageId: item.image_id.uniqueId
      }));
  }
};
