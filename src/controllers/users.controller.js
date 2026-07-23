const createError = require("http-errors");
const User = require("../lib/models/user.model");

// TODO Iteracion 3: Implementar cada funcion y exportarlas al final del archivo

const create = async (req, res, next) => {
  try {
    const { username } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(createError(409, "Username already exists"));
    }

    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(401, "Invalid credentials"));
    }

    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      return next(createError(401, "Invalid credentials"));
    }

    req.session.userId = user._id;
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.status(204).send();
  });
};

const profile = async (req, res, next) => {
  try {
    // Buscar el usuario autenticado por ID e incluir sus publicaciones
    const user = await User.findById(req.user._id).populate("posts");
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { create, login, logout, profile };
