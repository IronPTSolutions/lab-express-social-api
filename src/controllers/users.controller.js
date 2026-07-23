const createError = require("http-errors");
const User = require("../lib/models/user.model");

const create = async (req, res, next) => {
  try {
    const existing = await User.findOne({ username: req.body.username });
    if (existing) {
      return next(createError(409, "username already exists"));
    }

    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(createError(401, "invalid credentials"));
    }

    const valid = await user.checkPassword(req.body.password);
    if (!valid) {
      return next(createError(401, "invalid credentials"));
    }

    req.session.userId = user._id;
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const logout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }
    res.status(204).send();
  });
};

const profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("posts");
    if (!user) {
      return next(createError(401, "session user not found"));
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { create, login, logout, profile };
