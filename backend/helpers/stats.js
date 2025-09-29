const { Image, Comment } = require("../models");

module.exports = {
  async getStats() {
    const [totalImages, totalComments, metrics] = await Promise.all([
      Image.countDocuments(),
      Comment.countDocuments(),
      Image.aggregate([
        {
          $group: {
            _id: null,
            totalViews: { $sum: "$views" },
            totalLikes: { $sum: "$likes" }
          }
        }
      ])
    ]);
    const totals = metrics[0] || { totalViews: 0, totalLikes: 0 };
    return {
      totalImages,
      totalComments,
      totalViews: totals.totalViews || 0,
      totalLikes: totals.totalLikes || 0
    };
  }
};
