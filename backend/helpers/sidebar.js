const { getStats } = require("./stats");
const { getLatestComments } = require("./comments");

module.exports = async viewModel => {
  const [stats, comments] = await Promise.all([getStats(), getLatestComments()]);
  return {
    ...viewModel,
    sidebar: {
      stats,
      comments
    }
  };
};
