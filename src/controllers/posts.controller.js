const createError = require("http-errors");
const Post = require("../lib/models/post.model");

const list = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("author");
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      body: req.body.body,
      author: req.user._id,
    });
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
      .populate({
        path: "comments",
        populate: { path: "author" },
      });

    if (!post) {
      return next(createError(404, "Post not found"));
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, body: req.body.body },
      { runValidators: true, returnDocument: "after" },
    );

    if (!post) {
      return next(createError(404, "Post not found"));
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return next(createError(404, "Post not found"));
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { list, create, detail, update, remove };
