const express = require("express");
const router = express.Router();
const imageController = require("../controllers/image");

router.get("/:image_id", imageController.index);
router.post("/", imageController.create);
router.post("/:image_id/like", imageController.like);
router.post("/:image_id/comment", imageController.comment);

module.exports = router;
