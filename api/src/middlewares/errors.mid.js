const createError = require("http-errors");
const mongoose = require("mongoose");

const notFound = (req, res, next) => {
  next(createError(404, "Route not found"));
};

const globalHandler = (error, req, res, next) => {
  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.fromEntries(
      Object.entries(error.errors).map(([key, val]) => [key, val.message]),
    );
    return res.status(400).json({ message: "Validation error", errors });
  }

  if (error instanceof mongoose.Error.CastError && error.path === "_id") {
    return res.status(404).json({ message: "Resource not found" });
  }

  const status = error.status || 500;
  req.log.error(error);
  res.status(status).json({ message: error.message });
};

module.exports = { notFound, globalHandler };
