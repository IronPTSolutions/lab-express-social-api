const { Router } = require("express");
const createError = require("http-errors");
const Comment = require("../lib/models/comment.model");
const auth = require("../middlewares/auth.mid");

const router = Router();

router.post("/posts/:id/comments", auth, async (req, res, next) => {
  try {
    const comment = await Comment.create({
      ...req.body,
      author: req.user._id,
      post: req.params.id,
    });
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
});

router.delete("/posts/:id/comments/:commentId", auth, async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!comment) return next(createError(404, "Comment not found"));
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
