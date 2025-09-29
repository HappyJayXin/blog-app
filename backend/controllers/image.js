const fs = require("fs/promises");
const path = require("path");
const { randomBytes } = require("crypto");

const sidebar = require("../helpers/sidebar");
const { Image, Comment } = require("../models");
const loadLatestImages = require("../helpers/image");

const UPLOAD_DIR = path.join(__dirname, "..", "public", "upload");

const allowedExtensions = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp"]);

const ensureUploadDir = async () => {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
};

const removeFileIfExists = async filePath => {
  if (!filePath) {
    return;
  }
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("removeFileIfExists error", error);
    }
  }
};

exports.index = async (req, res) => {
  const { image_id: imageId } = req.params;
  try {
    const image = await Image.findOneAndUpdate(
      { uniqueId: imageId },
      { $inc: { views: 1 } },
      { new: true }
    ).lean({ virtuals: true });
    if (!image) {
      const images = await loadLatestImages();
      const viewModel = await sidebar({
        title: "ImageSpace｜找不到圖片",
        images,
        formError: null
      });
      return res.status(404).render("index", viewModel);
    }
    const dbComments = await Comment.find({ image_id: image._id })
      .sort({ timestamp: -1 })
      .lean();
    const comments = dbComments.map(item => ({
      ...item,
      text: item.comment,
      createdAt: item.timestamp
    }));
    const viewModel = await sidebar({
      title: `ImageSpace｜${image.title}`,
      image: {
        ...image,
        id: image.uniqueId
      },
      comments
    });
    return res.render("image", viewModel);
  } catch (error) {
    console.error("image.index error", error);
    return res.status(500).redirect("/");
  }
};

exports.create = async (req, res) => {
  const { title, description } = req.body;
  const trimmedTitle = title ? title.trim() : "";
  const uploadFile = req.file;
  let finalPath;

  const handleValidationError = async message => {
    await removeFileIfExists(uploadFile && uploadFile.path);
    await removeFileIfExists(finalPath);
    const images = await loadLatestImages().catch(() => []);
    const viewModel = await sidebar({
      title: "ImageSpace｜新增圖片失敗",
      images,
      formError: message
    });
    return res.status(400).render("index", viewModel);
  };

  if (!trimmedTitle) {
    return handleValidationError("請輸入完整的圖片標題");
  }
  if (!uploadFile) {
    return handleValidationError("請選擇要上傳的圖片檔案");
  }

  const extension = path.extname(uploadFile.originalname || "").toLowerCase();
  if (!allowedExtensions.has(extension)) {
    return handleValidationError("僅接受 png、jpg、jpeg、gif、webp 檔案");
  }

  try {
    await ensureUploadDir();
    const uniqueId = randomBytes(12).toString("hex");
    const filename = `${uniqueId}${extension}`;
    finalPath = path.join(UPLOAD_DIR, filename);
    await fs.rename(uploadFile.path, finalPath);
    const image = await Image.create({
      uniqueId,
      title: trimmedTitle,
      description: description ? description.trim() : "",
      filename
    });
    return res.redirect(`/images/${image.uniqueId}`);
  } catch (error) {
    console.error("image.create error", error);
    await removeFileIfExists(uploadFile && uploadFile.path);
    await removeFileIfExists(finalPath);
    const images = await loadLatestImages().catch(() => []);
    const viewModel = await sidebar({
      title: "ImageSpace｜新增圖片失敗",
      images,
      formError: "上傳圖片時發生錯誤，請稍後再試"
    });
    return res.status(500).render("index", viewModel);
  }
};

exports.like = async (req, res) => {
  const { image_id: imageId } = req.params;
  try {
    const image = await Image.findOneAndUpdate(
      { uniqueId: imageId },
      { $inc: { likes: 1 } },
      { new: true }
    ).lean();
    if (!image) {
      return res.status(404).json({ success: false, message: "image not found" });
    }
    return res.json({ success: true, likes: image.likes });
  } catch (error) {
    console.error("image.like error", error);
    return res.status(500).json({ success: false, message: "internal error" });
  }
};

exports.comment = async (req, res) => {
  const { image_id: imageId } = req.params;
  const { name, email, text } = req.body;
  const trimmedText = text ? text.trim() : "";
  if (!trimmedText) {
    return res.status(400).redirect(`/images/${imageId}`);
  }
  try {
    const image = await Image.findOne({ uniqueId: imageId }).lean();
    if (!image) {
      return res.status(404).redirect("/");
    }
    await Comment.create({
      image_id: image._id,
      email: email && email.trim() ? email.trim() : "",
      name: name && name.trim() ? name.trim() : "訪客",
      comment: trimmedText
    });
    return res.redirect(`/images/${imageId}`);
  } catch (error) {
    console.error("image.comment error", error);
    return res.status(500).redirect(`/images/${imageId}`);
  }
};
