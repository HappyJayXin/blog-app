const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");

const imageController = require("../controllers/image");

const router = express.Router();

const uploadTempDir = path.join(__dirname, "..", "public", "upload", "temp");

if (!fs.existsSync(uploadTempDir)) {
  fs.mkdirSync(uploadTempDir, { recursive: true });
}

const upload = multer({
  dest: uploadTempDir,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file || !file.mimetype) {
      cb(null, false);
      return;
    }
    const isImage = file.mimetype.startsWith("image/");
    cb(null, isImage);
  }
});

router.get("/:image_id", imageController.index);
router.post("/", upload.single("image"), imageController.create);
router.post("/:image_id/like", imageController.like);
router.post("/:image_id/comment", imageController.comment);

module.exports = router;
