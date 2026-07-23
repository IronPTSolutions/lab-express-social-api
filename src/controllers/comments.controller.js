const createError = require("http-errors");
const Comment = require("../lib/models/comment.model");

// POST /posts/:id/comments - Crear comentario (Auth: Sí)
const create = async (req, res, next) => {
  try {
    // 1. Asignar author desde la sesión y post desde los parámetros de la URL
    const commentData = {
      ...req.body,
      author: req.user._id,
      post: req.params.id,
    };

    // 2. Crear el comentario y poblar el author para la respuesta
    const comment = await Comment.create(commentData);
    await comment.populate("author");

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

// DELETE /posts/:id/comments/:commentId - Eliminar comentario (Auth: Sí)
const remove = async (req, res, next) => {
  try {
    // Buscar y eliminar utilizando el param commentId
    const comment = await Comment.findByIdAndDelete(req.params.commentId);

    if (!comment) {
      return next(createError(404, "Comment not found"));
    }

    // 204 No Content (eliminado con éxito)
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { create, remove };