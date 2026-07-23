const createError = require("http-errors");
const Post = require("../lib/models/post.model");

// TODO Iteracion 4: Implementar cada funcion y exportarlas al final del archivo

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
    // 1. Asignamos author desde req.user._id por seguridad
    const postData = {
      ...req.body,
      author: req.user._id,
    };

    // 2. Creamos el post y populamos el author en la respuesta
    const post = await Post.create(postData);
    await post.populate("author");

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

const detail = async (req, res, next) => {
  try {
    // Busca por ID y realiza el populate anidado para los comentarios y sus autores
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
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      returnDocument: "after", // Devuelve el documento ya actualizado
    }).populate("author");

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

    // 204 No Content (operación exitosa sin cuerpo de respuesta)
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { list, create, detail, update, remove };
