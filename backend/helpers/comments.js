const { getRecentComments } = require("../models/ImageStore");

module.exports = {
  async getLatestComments(limit = 5) {
    return getRecentComments(limit);
  }
};
