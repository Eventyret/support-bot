import Agenda from 'agenda';
import { cleanupOldChats } from './cleanup.js';

// Check if DATABASE_URL is defined
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    console.error('DATABASE_URL is undefined. Agenda initialization will fail.');
    throw new Error('DATABASE_URL environment variable is not defined.');
}

const agenda = new Agenda({
    db: { address: databaseUrl, collection: 'agendaJobs' },
    processEvery: '1 minute'
});

agenda.define('cleanup old chats', async (job) => {
    console.log('Running scheduled cleanup job...');
    try {
        const result = await cleanupOldChats();
        console.log('Cleanup job completed:', result);
        return result;
    } catch (error) {
        console.error('Cleanup job failed:', error);
        throw error;
    }
});

const startAgenda = async () => {
    await agenda.start();

    const jobs = await agenda.jobs({ name: 'cleanup old chats' });
    if (jobs.length === 0) {
        await agenda.every('0 0 * * *', 'cleanup old chats');
        console.log('Cleanup job scheduled to run daily at midnight');
    }
};

export { agenda, startAgenda }; 