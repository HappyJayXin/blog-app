const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

PostSchema.virtual("comments", {
  ref: "PostComment",
  localField: "_id",
  foreignField: "post"
});

PostSchema.pre("findOneAndDelete", async function(next) {
  const postId = this.getQuery()._id;
  await mongoose.model("PostComment").deleteMany({ post: postId });
  next();
});

module.exports = mongoose.model("Post", PostSchema);
