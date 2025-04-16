import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import aiRoutes from './routes/aiRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import cleanupRoutes from './routes/cleanupRoutes.js';
import { connectDB } from './lib/mongoose.js';
import { startAgenda } from './lib/agenda.js';
import { ensureDbConnection } from './middleware/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(ensureDbConnection);

app.use('/api/sessions', sessionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/cleanup', cleanupRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
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
        });

        await startAgenda();
        console.log('Agenda scheduler started');
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer(); 