const dns = require("node:dns");
dns.setDefaultResultOrder("ipv4first");

const mongoose = require("mongoose");
const config = require("./config");
const logger = require("./logger");

mongoose.connect(config.get("db.uri")).catch((error) => {
  logger.error(error);
  process.exit(0);
});
