const { Router } = require("express");
const auth = require("../middlewares/auth.mid");
const users = require("./users.controller");
const posts = require("./posts.controller");
const comments = require("./comments.controller");

const router = Router();

router.post("/users", users.create);
router.post("/sessions", users.login);
router.delete("/sessions", auth, users.logout);
router.get("/users/me", auth, users.profile);

router.get("/posts", auth, posts.list);
router.post("/posts", auth, posts.create);
router.get("/posts/:id", auth, posts.detail);
router.patch("/posts/:id", auth, posts.update);
router.delete("/posts/:id", auth, posts.remove);

router.post("/posts/:id/comments", auth, comments.create);
router.delete("/posts/:id/comments/:commentId", auth, comments.remove);

module.exports = router;
