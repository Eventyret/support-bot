import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import ms from 'ms';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the .env file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Default to 30 days if CHAT_CLEANUP_AGE is not set
const defaultCleanupAge = '30d';

export const config = {
    port: process.env.PORT || 3000,
    databaseUrl: process.env.DATABASE_URL,
    n8nWebhookUrl: process.env.N8N_WEBHOOK_URL,
    n8nWebhookUrlDev: process.env.N8N_WEBHOOK_URL_DEV,
    chatCleanupAge: ms(process.env.CHAT_CLEANUP_AGE || defaultCleanupAge),
    cleanupApiKey: process.env.CLEANUP_API_KEY
}; 