const express = require('express');
const bodyParser = require('body-parser');

const { sequelize } = require('./model');
const apiRouter = require('./routers');

const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);
app.use('/api', apiRouter);

module.exports = app;
