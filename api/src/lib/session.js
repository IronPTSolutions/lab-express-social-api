const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const config = require("./config");

module.exports = session({
  secret: config.get("session.secret"),
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    secure: config.get("session.secure"),
  },
});
