module.exports = {
  // Boots a single in-memory MongoDB instance shared by every test suite
  globalSetup: "./tests/globalSetup.js",
  // Stops that in-memory MongoDB instance once all suites have finished
  globalTeardown: "./tests/globalTeardown.js",
  // Runs after the test framework is installed: connects Mongoose and clears
  // the collections before each test so suites never leak data into each other
  setupFilesAfterEnv: ["./tests/setup.js"],
  testEnvironment: "node",
};
