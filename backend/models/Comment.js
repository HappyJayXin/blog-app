const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    image_id: { type: mongoose.Schema.Types.ObjectId, ref: "Image", required: true, index: true },
    email: { type: String, trim: true },
    name: { type: String, trim: true },
    comment: { type: String, required: true, trim: true },
    timestamp: { type: Date, default: Date.now }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Comment", CommentSchema);
