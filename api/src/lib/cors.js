const cors = require("cors");
const config = require("./config");

module.exports = cors({
  origin: config.get("cors.origin"),
  credentials: true,
});
