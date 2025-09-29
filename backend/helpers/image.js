const { Image, Comment } = require("../models");

const buildImagesWithCommentCounts = async (images) => {
  const imageIds = images.map((image) => image._id);
  const commentCounts = imageIds.length
    ? await Comment.aggregate([
        { $match: { image_id: { $in: imageIds } } },
        { $group: { _id: "$image_id", total: { $sum: 1 } } },
      ])
    : [];
  const commentMap = commentCounts.reduce((acc, item) => {
    acc[item._id.toString()] = item.total;
    return acc;
  }, {});
  return images.map((image) => ({
    ...image,
    id: image.uniqueId,
    commentsCount: commentMap[image._id.toString()] || 0,
  }));
};

const loadLatestImages = async () => {
  const images = await Image.find().sort({ timestamp: -1 }).lean({ virtuals: true });
  return buildImagesWithCommentCounts(images);
};

module.exports = loadLatestImages;
