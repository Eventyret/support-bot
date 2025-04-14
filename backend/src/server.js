import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import aiRoutes from './routes/aiRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 