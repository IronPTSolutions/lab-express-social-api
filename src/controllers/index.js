const { Router } = require("express");
const usersRouter = require("./users.controller");
const postsRouter = require("./posts.controller");
const commentsRouter = require("./comments.controller");

const router = Router();

router.use(usersRouter);
router.use(postsRouter);
router.use(commentsRouter);

module.exports = router;
