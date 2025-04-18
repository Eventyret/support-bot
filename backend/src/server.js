import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

// Use the direct absolute path to the .env file in the project root
dotenv.config({ path: '/Users/eventyret/Development/support-bot/.env' });

import { setupSwagger } from './config/swagger.js';
import { startAgenda } from './lib/agenda.js';
import { connectDB } from './lib/mongoose.js';
import { ensureDbConnection } from './middleware/db.js';
import aiRoutes from './routes/aiRoutes.js';
import cleanupRoutes from './routes/cleanupRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Get allowed origins from environment
const getAllowedOrigins = () => {
    // Add debugging for CORS configuration
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

    const frontendDomain = 'http://support-bot-frontend-prod.s3-website.eu-west-2.amazonaws.com';

    if (process.env.NODE_ENV === 'production') {
        // Always include the S3 website domain plus any configured domains
        const origins = [frontendDomain];

        if (process.env.FRONTEND_URL) {
            const url = process.env.FRONTEND_URL.startsWith('http')
                ? process.env.FRONTEND_URL
                : `http://${process.env.FRONTEND_URL}`;

            if (!origins.includes(url)) {
                origins.push(url);
            }
        }

        console.log('CORS origins configured:', origins);
        return origins;
    }

    // In development, allow all origins
    console.log('CORS origins in development: *');
    return '*';
};

const corsOptions = {
    origin: getAllowedOrigins(),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Debug the final CORS configuration
console.log('Final CORS config:', corsOptions);

app.use(cors(corsOptions));
app.use(express.json());
app.use(ensureDbConnection);

// Add explicit handling for OPTIONS preflight requests
app.options('*', cors(corsOptions));

app.use('/api/sessions', sessionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/cleanup', cleanupRoutes);

// Setup Swagger documentation
setupSwagger(app);

app.get('/health', (req, res) => {
    // Log the request headers for debugging
    console.log('Health check request headers:', req.headers);
    console.log('Health check request origin:', req.headers.origin);

    // Log what CORS is allowing
    const allowedOrigins = Array.isArray(corsOptions.origin) ? corsOptions.origin : [corsOptions.origin];
    console.log('Current allowed origins:', allowedOrigins);

    // Include CORS debug info in response
    res.json({
        status: 'ok',
        cors: {
            allowedOrigins: allowedOrigins,
            requestOrigin: req.headers.origin
        },
        env: {
            NODE_ENV: process.env.NODE_ENV,
            FRONTEND_URL: process.env.FRONTEND_URL ? '(set)' : '(not set)'
        }
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
        });

        await startAgenda();
        console.log('Agenda scheduler started');
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer(); 