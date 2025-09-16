const sidebar = require("../helpers/sidebar");
const {
  addComment,
  addImage,
  increaseViews,
  likeImage,
  getLatestImages
} = require("../models/ImageStore");

exports.index = async (req, res) => {
  const imageId = req.params.image_id;
  const image = increaseViews(imageId);
  if (!image) {
    return res.status(404).render("index", await sidebar({
      title: "ImageSpace｜找不到圖片",
      images: getLatestImages()
    }));
  }
  const viewModel = await sidebar({
    title: `ImageSpace｜${image.title}`,
    image,
    comments: image.comments
  });
  return res.render("image", viewModel);
};

exports.create = async (req, res) => {
  const { title, description, url } = req.body;
  if (!title || !title.trim() || !url || !url.trim()) {
    return res.status(400).render("index", await sidebar({
      title: "ImageSpace｜新增圖片失敗",
      images: getLatestImages(),
      formError: "請輸入完整的圖片標題與網址"
    }));
  }
  const image = addImage({ title, description, url });
  return res.redirect(`/images/${image.id}`);
};

exports.like = (req, res) => {
  const imageId = req.params.image_id;
  const image = likeImage(imageId);
  if (!image) {
    return res.status(404).json({ success: false, message: "image not found" });
  }
  return res.json({ success: true, likes: image.likes });
};

exports.comment = async (req, res) => {
  const imageId = req.params.image_id;
  const { name, email, text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).redirect(`/images/${imageId}`);
  }
  const comment = addComment(imageId, { name, email, text });
  if (!comment) {
    return res.status(404).redirect("/");
  }
  return res.redirect(`/images/${imageId}`);
};
