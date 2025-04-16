import Message from '../models/Message.js';
import Session from '../models/Session.js';
import { config } from '../config/env.js';

/**
 * Preview what would be cleaned up without actually deleting anything
 * @returns {Promise<{messagesToDelete: number, sessionsToDelete: number, oldestMessage: Date, oldestSession: Date}>}
 */
export const previewCleanup = async () => {
    try {
        const cutoffDate = new Date(Date.now() - config.chatCleanupAge);

        // Find messages that would be deleted
        const messagesToDelete = await Message.find({
            createdAt: { $lt: cutoffDate }
        }).countDocuments();

        // Find old sessions
        const oldSessions = await Session.find({
            updatedAt: { $lt: cutoffDate }
        });

        // Get the oldest message and session dates for context
        const oldestMessage = await Message.findOne({}, { createdAt: 1 }).sort({ createdAt: 1 });
        const oldestSession = await Session.findOne({}, { createdAt: 1 }).sort({ createdAt: 1 });

        // Count sessions that would be deleted (those with no messages)
        let sessionsToDelete = 0;
        for (const session of oldSessions) {
            const messageCount = await Message.countDocuments({ sessionId: session._id });
            if (messageCount === 0) {
                sessionsToDelete++;
            }
        }

        return {
            messagesToDelete,
            sessionsToDelete,
            oldestMessage: oldestMessage?.createdAt,
            oldestSession: oldestSession?.createdAt,
            cutoffDate,
            cleanupAge: config.chatCleanupAge
        };
    } catch (error) {
        console.error('Error during cleanup preview:', error);
        throw error;
    }
};

/**
 * Cleanup old chat messages and sessions based on configured age
 * @returns {Promise<{messages: number, sessions: number}>} - Number of deleted messages and sessions
 */
export const cleanupOldChats = async () => {
    try {
        const cutoffDate = new Date(Date.now() - config.chatCleanupAge);

        // Delete messages older than the cutoff date
        const messagesResult = await Message.deleteMany({
            createdAt: { $lt: cutoffDate }
        });

        // Find sessions that don't have any messages and are older than the cutoff
        const sessionsWithoutMessages = await Session.find({
            updatedAt: { $lt: cutoffDate }
        });

        const sessionIds = sessionsWithoutMessages.map(session => session._id);

        // For each session, check if it has any messages
        let deletedSessionsCount = 0;

        for (const sessionId of sessionIds) {
            const messageCount = await Message.countDocuments({ sessionId });

            if (messageCount === 0) {
                // If no messages, delete the session
                await Session.deleteOne({ _id: sessionId });
                deletedSessionsCount++;
            }
        }

        console.log(`Cleanup completed: Removed ${messagesResult.deletedCount} messages and ${deletedSessionsCount} sessions older than ${config.chatCleanupAge / 1000 / 60 / 60 / 24} days`);

        return {
            messages: messagesResult.deletedCount,
            sessions: deletedSessionsCount
        };
    } catch (error) {
        console.error('Error during chat cleanup:', error);
        throw error;
    }
}; 