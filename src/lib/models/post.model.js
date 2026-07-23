const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minLength: [3, "Title must be at least 3 characters"],
      maxLength: [200, "Title cannot exceed 200 characters"],
    },
    body: {
      type: String,
      required: [true, "Body is required"],
      minLength: [1, "Body must be at least 1 character"],
      maxLength: [1000, "Body cannot exceed 1000 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ((ret.id = ret._id.toString()), delete ret._id);
        delete ret.__v;
        return ret;
      },
    },
  },
);

postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

// TODO Iteracion 4: Virtual "comments"
//   Devuelve todos los Comment cuyo post sea igual al _id de este post
// postSchema.virtual("comments", {
//   ref: "Comment",
//   localField: "_id",
//   foreignField: "post",
// });

module.exports = mongoose.model("Post", postSchema);
