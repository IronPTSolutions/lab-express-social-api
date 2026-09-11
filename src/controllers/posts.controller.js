const createError = require("http-errors");
const Post = require("../lib/models/post.model");
require("../lib/models/comment.model");

// TODO Iteracion 4: Implementar cada funcion y exportarlas al final del archivo

const list = async (req, res, next) => {
  // TODO: Devolver todos los posts con author populado → 200
  try {
    const posts = await Post.find().populate("author");

    return res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  // TODO: Crear post (author = req.user._id, no viene del body)
  // TODO: Poblar author en la respuesta → 201

  try {
    const { title, body } = req.body;
    const post = await Post.create({
      title,
      body,
      author: req.user.id,
    });

    await post.populate("author");

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

const detail = async (req, res, next) => {
  // TODO: Devolver post con author y virtual "comments" populados (populate anidado para author de cada comment)
  // TODO: Si no existe → 404

  try {
    const postDetail = await Post.findById(req.params.id)
      .populate("author")
      .populate({ path: "comments", populate: { path: "author" } });

    if (!postDetail) {
      return next(createError(404, "Post not found"));
    }

    res.status(200).json(postDetail);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  // TODO: Actualizar con findByIdAndUpdate({ runValidators: true, returnDocument: "after" })
  // TODO: Si no existe → 404
  try {
    const { id } = req.params;
    const { title, body } = req.body;

    const postUpdated = await Post.findByIdAndUpdate(
      id,
      { title, body },
      { runValidators: true, returnDocument: "after" },
    );

    if (!postUpdated) {
      return next(createError(404, "Post not found"));
    }

    return res.status(200).json(postUpdated);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  // TODO: Eliminar post con findByIdAndDelete
  // TODO: Si no existe → 404, si existe → 204

  try {
    const postDeleted = await Post.findByIdAndDelete(req.params.id);

    if (!postDeleted) {
      return next(createError(404, "Post not found"));
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { list, create, detail, update, remove };
