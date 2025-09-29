const sidebar = require("../helpers/sidebar");
const loadLatestImages = require("../helpers/image");

exports.index = async (req, res) => {
  try {
    const normalizedImages = await loadLatestImages();
    const viewModel = await sidebar({
      title: "ImageSpace｜最新圖片",
      images: normalizedImages,
      formError: null,
    });
    res.render("index", viewModel);
  } catch (error) {
    console.error("home.index error", error);
    const fallbackImages = await loadLatestImages().catch(() => []);
    const fallbackViewModel = await sidebar({
      title: "ImageSpace｜最新圖片",
      images: Array.isArray(fallbackImages) ? fallbackImages : [],
      formError: "載入資料時發生錯誤，請稍後再試",
    });
    res.status(500).render("index", fallbackViewModel);
  }
};
