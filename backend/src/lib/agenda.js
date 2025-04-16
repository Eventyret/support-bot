import Agenda from 'agenda';
import { config } from '../config/env.js';
import { cleanupOldChats } from './cleanup.js';

// Create agenda instance
const agenda = new Agenda({
    db: { address: config.databaseUrl, collection: 'agendaJobs' },
    processEvery: '1 minute'
});

// Define cleanup job
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

// Start agenda
const startAgenda = async () => {
    await agenda.start();

    // Schedule the cleanup job to run daily at midnight if it's not already scheduled
    const jobs = await agenda.jobs({ name: 'cleanup old chats' });
    if (jobs.length === 0) {
        await agenda.every('0 0 * * *', 'cleanup old chats');
        console.log('Cleanup job scheduled to run daily at midnight');
    }
};

export { agenda, startAgenda }; 