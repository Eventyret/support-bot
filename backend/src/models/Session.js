import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sessionID: { type: String, required: true, unique: true },
    issueType: {
        type: String,
        enum: ['primary', 'additional'],
        default: 'primary'
    },
    emailMessageId: { type: String, default: "" },
    resolved: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
}, {
    timestamps: true
});

const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);

export default Session;