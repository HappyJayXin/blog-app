const sidebar = require("../helpers/sidebar");
const { getLatestImages } = require("../models/ImageStore");

exports.index = async (req, res) => {
  const images = getLatestImages();
  const viewModel = await sidebar({
    title: "ImageSpace｜最新圖片",
    images,
    formError: null
  });
  res.render("index", viewModel);
};
