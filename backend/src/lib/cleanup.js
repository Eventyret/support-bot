import Message from '../models/Message.js';
import Session from '../models/Session.js';
import ms from 'ms';

const chatCleanupAge = ms(process.env.CHAT_CLEANUP_AGE || '30d');

/**
 * Preview what would be cleaned up without actually deleting anything
 * @returns {Promise<{messagesToDelete: number, sessionsToDelete: number, oldestMessage: Date, oldestSession: Date}>}
 */
export const previewCleanup = async () => {
    try {
        const cutoffDate = new Date(Date.now() - chatCleanupAge);

        const messagesToDelete = await Message.find({
            createdAt: { $lt: cutoffDate }
        }).countDocuments();

        const oldSessions = await Session.find({
            updatedAt: { $lt: cutoffDate }
        });

        const oldestMessage = await Message.findOne({}, { createdAt: 1 }).sort({ createdAt: 1 });
        const oldestSession = await Session.findOne({}, { createdAt: 1 }).sort({ createdAt: 1 });

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
            cleanupAge: chatCleanupAge
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
        const cutoffDate = new Date(Date.now() - chatCleanupAge);

        const messagesResult = await Message.deleteMany({
            createdAt: { $lt: cutoffDate }
        });

        const sessionsWithoutMessages = await Session.find({
            updatedAt: { $lt: cutoffDate }
        });

        const sessionIds = sessionsWithoutMessages.map(session => session._id);

        let deletedSessionsCount = 0;

        for (const sessionId of sessionIds) {
            const messageCount = await Message.countDocuments({ sessionId });

            if (messageCount === 0) {
                await Session.deleteOne({ _id: sessionId });
                deletedSessionsCount++;
            }
        }

        console.log(`Cleanup completed: Removed ${messagesResult.deletedCount} messages and ${deletedSessionsCount} sessions older than ${chatCleanupAge / 1000 / 60 / 60 / 24} days`);

        return {
            messages: messagesResult.deletedCount,
            sessions: deletedSessionsCount
        };
    } catch (error) {
        console.error('Error during chat cleanup:', error);
        throw error;
    }
}; 