const createError = require("http-errors");
const User = require("../lib/models/user.model");

module.exports = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return next(createError(401, "session not found"));
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return next(createError(401, "session user not found"));
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
