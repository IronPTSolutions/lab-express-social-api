const pino = require("pino");
const config = require("./config");

module.exports = pino({
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  transport: process.env.NODE_ENV === "development"
    ? { target: "pino-pretty", options: { colorize: true } }
    : undefined,
}).child({
  service: config.get("build.service"),
  version: config.get("build.version"),
});
