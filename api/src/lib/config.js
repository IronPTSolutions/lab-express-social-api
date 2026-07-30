require("dotenv").config();
const convict = require("convict");

const config = convict({
  build: {
    service: {
      doc: "Service name",
      format: String,
      default: "lab-express-social-api",
      env: "npm_package_name",
    },
    version: {
      doc: "Service version",
      format: String,
      default: "1.0.0",
      env: "npm_package_version",
    },
  },
  port: {
    doc: "Port the API listens on",
    format: "port",
    default: 3000,
    env: "PORT",
  },
  db: {
    uri: {
      doc: "MongoDB connection string",
      format: String,
      default: "",
      env: "MONGODB_URI",
    },
  },
  cors: {
    origin: {
      doc: "Allowed CORS origin",
      format: String,
      default: "http://localhost:5173",
      env: "CORS_ORIGIN",
    },
  },
  session: {
    secret: {
      doc: "Session signing secret",
      format: String,
      default: "super secret",
      env: "SESSION_SECRET",
    },
    secure: {
      doc: "Secure flag on session cookie",
      format: Boolean,
      default: false,
      env: "SESSION_SECURE",
    },
  },
});

config.validate({ allowed: "strict" });

module.exports = config;
