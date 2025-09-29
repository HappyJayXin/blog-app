const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    uniqueId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    filename: { type: String, required: true, unique: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ImageSchema.virtual("fileUrl").get(function fileUrlGetter() {
  if (!this.filename) {
    return "";
  }
  return `/upload/${this.filename}`;
});

ImageSchema.index({ timestamp: -1 });
ImageSchema.index({ likes: -1 });

module.exports = mongoose.model("Image", ImageSchema);
