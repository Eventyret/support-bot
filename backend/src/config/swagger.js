import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Support Bot API',
        version: '1.0.0',
        description: 'API documentation for the Support Bot application',
        license: {
            name: 'ISC',
            url: 'https://opensource.org/licenses/ISC',
        },
        contact: {
            name: 'Support Team',
        },
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server',
        },
    ],
};

// Options for the swagger docs
const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: [
        path.resolve(__dirname, '../docs/**/*.js'),
        path.resolve(__dirname, '../docs/**/*.yaml'),
        path.resolve(__dirname, '../models/*.js'),
        path.resolve(__dirname, '../routes/*.js'),
    ],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
    // Serve swagger docs
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Serve swagger spec as JSON
    app.get('/swagger.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    console.log('Swagger documentation available at /api-docs');
}; 