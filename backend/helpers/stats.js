const { getTotals } = require("../models/ImageStore");

module.exports = {
  async getStats() {
    const totals = getTotals();
    return {
      totalImages: totals.images,
      totalComments: totals.comments,
      totalViews: totals.views,
      totalLikes: totals.likes
    };
  }
};
