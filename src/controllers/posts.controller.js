const createError = require("http-errors");
const Post = require("../lib/models/post.model");

const list = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("author");
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const post = await Post.create({ ...req.body, author: req.user._id });
    await post.populate("author");
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

const detail = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author")
      .populate({ path: "comments", populate: { path: "author" } });
    if (!post) return next(createError(404, "Post not found"));
    res.json(post);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      returnDocument: "after",
    }).populate("author");
    if (!post) return next(createError(404, "Post not found"));
    res.json(post);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return next(createError(404, "Post not found"));
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = { list, create, detail, update, remove };
