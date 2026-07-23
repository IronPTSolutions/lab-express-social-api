const { Router } = require("express");
const createError = require("http-errors");
const User = require("../lib/models/user.model");
const auth = require("../middlewares/auth.mid");

const router = Router();

router.post("/users", async (req, res, next) => {
  try {
    const exists = await User.findOne({ username: req.body.username });
    if (exists) return next(createError(409, "Username already taken"));
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/sessions", async (req, res, next) => {
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
});

router.delete("/sessions", auth, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.sendStatus(204);
  });
});

router.get("/users/me", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("posts");
    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
