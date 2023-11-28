const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointFiles = [
    './src/routers/index.js',
];

const docDetails = {
    info: {
        title: 'My Home Test API',
        description: 'Sample ::: Here you can find the app API documentation ::: Sample'
    },
    host: 'localhost:3001',
    basePath: '/api'
};

swaggerAutogen(outputFile, endpointFiles, docDetails);
