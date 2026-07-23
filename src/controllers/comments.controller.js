const createError = require("http-errors");
const Comment = require("../lib/models/comment.model");

const create = async (req, res, next) => {
  try {
    const comment = await Comment.create({
      body: req.body.body,
      author: req.user._id,
      post: req.params.id,
    });
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!comment) {
      return next(createError(404, "Comment not found"));
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { create, remove };
