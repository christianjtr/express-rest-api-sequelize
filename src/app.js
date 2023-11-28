const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger_output.json');

const { sequelize } = require('./model');
const apiRouter = require('./routers');

const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);
app.use('/api', apiRouter);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = app;
