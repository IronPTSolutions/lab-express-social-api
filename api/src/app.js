const express = require("express");
const loggerHttp = require("pino-http");
const logger = require("./lib/logger");
const { errors } = require("./middlewares");
const session = require("./lib/session");
const apiRouter = require("./controllers");
const cors = require("./lib/cors");
const app = express();

app.use(loggerHttp({ logger }));
app.use(cors);
app.use(express.json());
app.use(session);
app.use("/api/v0", apiRouter);
app.use(errors.notFound);
app.use(errors.globalHandler);

module.exports = app;
