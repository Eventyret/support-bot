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
    // In production, use our hosted backend
    if (process.env.NODE_ENV === 'production') {
        return ['https://cognito-backend.fairytales.dev'];
    }

    // In development, allow all origins
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

app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        env: {
            NODE_ENV: process.env.NODE_ENV
        }
    });
});

app.use((err, _req, res, _next) => {
    console.error('❌ Error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const startServer = async () => {
    try {
        await connectDB();
        console.log('🔌 Connected to database successfully');

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📚 Swagger documentation available at http://localhost:${PORT}/api-docs`);
        });

        await startAgenda();
        console.log('⏰ Agenda scheduler started');
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer(); 