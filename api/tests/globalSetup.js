const { MongoMemoryServer } = require("mongodb-memory-server");

module.exports = async () => {
  const mongod = await MongoMemoryServer.create();
  global.__MONGOD__ = mongod;
  // Workers are forked after globalSetup completes and inherit this env var
  process.env.MONGODB_URI = mongod.getUri();
};
