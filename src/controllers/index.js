const { Router } = require("express");
const auth = require("../middlewares/auth.mid");

// TODO: Descomenta las importaciones a medida que implementes cada controlador
const users = require("./users.controller");
const posts = require("./posts.controller");
const comments = require("./comments.controller");

const router = Router();

// TODO Iteracion 3: Rutas de usuarios y sesiones
router.post("/users", users.create);
router.post("/sessions", users.login);
router.delete("/sessions", auth, users.logout);
router.get("/users/me", auth, users.profile);

// TODO Iteracion 4: Rutas de posts
router.get("/posts", auth, posts.list);
router.post("/posts", auth, posts.create);
router.get("/posts/:id", auth, posts.detail);
router.patch("/posts/:id", auth, posts.update);
router.delete("/posts/:id", auth, posts.remove);

// TODO Iteracion 5 [Bonus]: Rutas de comments
router.post("/posts/:id/comments", auth, comments.create);
router.delete("/posts/:id/comments/:commentId", auth, comments.remove);

module.exports = router;
