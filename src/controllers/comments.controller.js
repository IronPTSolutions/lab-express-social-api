const createError = require("http-errors");
const Comment = require("../lib/models/comment.model");

// TODO Iteracion 5 [Bonus]: Implementar cada funcion y exportarlas al final del archivo

const create = async (req, res, next) => {
  // TODO: Crear comentario (author = req.user._id, post = req.params.id) → 201
  try {
    const { body } = req.body;
    const postId = req.params.id;

    const comment = await Comment.create({
      body,
      author: req.user.id,
      post: postId,
    });

    return res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  // TODO: Eliminar comentario por req.params.commentId
  // TODO: Si no existe → 404, si existe → 204
  try {
    const commentDeleted = await Comment.findByIdAndDelete(
      req.params.commentId,
    );

    if (!commentDeleted) {
      return next(createError(404, "Comment not found"));
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { create, remove };
