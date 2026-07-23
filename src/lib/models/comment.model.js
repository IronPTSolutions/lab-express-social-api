const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 500,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

module.exports = mongoose.model("Comment", commentSchema);
