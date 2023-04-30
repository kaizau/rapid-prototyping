const serverless = require("serverless-http");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("*", (req, res) => {
  res.set("Cache-control", "public, max-age=60");
  res.json({ data: process.env.EXAMPLE_VAR });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error("ERROR", err.status, err.message);
  res.sendStatus(err.status);
});

module.exports.handler = serverless(app);
