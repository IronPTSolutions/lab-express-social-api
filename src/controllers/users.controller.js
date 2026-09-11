const createError = require("http-errors");
const User = require("../lib/models/user.model");
require("../lib/models/post.model");

// TODO Iteracion 3: Implementar cada funcion y exportarlas al final del archivo

const create = async (req, res, next) => {
  // TODO: Comprobar si ya existe un usuario con el mismo username → 409
  // TODO: Si no existe, crear el usuario → 201
  try {
    const { name, username, email, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return next(createError(409, "Username already exists"));
    }

    const user = await User.create({
      name,
      username,
      email,
      password,
    });

    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  // TODO: Buscar el usuario por email
  // TODO: Verificar la password con user.checkPassword(password)
  // TODO: Si las credenciales son incorrectas → 401
  // TODO: Si son correctas, guardar req.session.userId = user._id → 200
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(createError(401, "Invalid credentials"));
    }

    const match = await user.checkPassword(password);

    if (!match) {
      return next(createError(401, "Invalid credentials"));
    }

    req.session.userId = user.id;
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const logout = (req, res, next) => {
  // TODO: Destruir la sesion con req.session.destroy() → 204

  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie("connect.sid");
    res.status(204).send();
  });
};

const profile = async (req, res, next) => {
  // TODO: Buscar el usuario por req.user._id con .populate("posts") → 200
  try {
    const user = await User.findById(req.user.id).populate("posts");

    if (!user) {
      return next(createError(404, "User not found"));
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { create, login, logout, profile };
