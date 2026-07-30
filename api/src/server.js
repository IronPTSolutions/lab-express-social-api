const app = require("./app");
require("./lib/db");
const config = require("./lib/config");
const logger = require("./lib/logger");

app.listen(config.get("port"), () => {
  logger.info(`Server listening at port ${config.get("port")}`);
});
