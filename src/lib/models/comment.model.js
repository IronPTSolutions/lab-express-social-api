const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    // TODO Iteracion 5 [Bonus]: Definir los campos del esquema
    // body:   String, required, minLength: 1, maxLength: 500
    body: {
      type: String,
      required: "Need some text to comment",
      minLength: 1,
      maxLength: 500,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  },
  {
    timestamps: true,
    toJSON: {
      // TODO Iteracion 5 [Bonus]: Anadir transform para:
      //   - Exponer id (ret.id = ret._id.toString())
      //   - Eliminar _id y __v
      transform: (doc, ret) => {
        ret.id = ret._id.toString();

        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

module.exports = mongoose.model("Comment", commentSchema);
