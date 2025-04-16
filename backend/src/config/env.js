import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import ms from 'ms';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Only load .env file in development environments
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
}

const defaultCleanupAge = '30d';

export const config = {
    port: process.env.PORT || 3000,
    databaseUrl: process.env.DATABASE_URL,
    n8nWebhookUrl: process.env.N8N_WEBHOOK_URL,
    n8nWebhookUrlDev: process.env.N8N_WEBHOOK_URL_DEV,
    chatCleanupAge: ms(process.env.CHAT_CLEANUP_AGE || defaultCleanupAge),
    cleanupApiKey: process.env.CLEANUP_API_KEY
}; 