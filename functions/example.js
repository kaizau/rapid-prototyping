const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('*', (req, res) => {
  res.send(process.env.EXAMPLE_FUNCTION_VAR);
});

app.use((err, req, res, next) => {
  console.error('ERROR', err.status, err.message);
  res.sendStatus(err.status);
});

module.exports = app;
