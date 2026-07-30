const createError = require("http-errors");
const User = require("../lib/models/user.model");

const create = async (req, res, next) => {
  try {
    const exists = await User.findOne({ username: req.body.username });
    if (exists) return next(createError(409, "Username already taken"));
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
    if (!user || !(await user.checkPassword(password))) {
      return next(createError(401, "Invalid credentials"));
    }
    req.session.userId = user._id;
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.sendStatus(204);
  });
};

const profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("posts");
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { create, login, logout, profile };
