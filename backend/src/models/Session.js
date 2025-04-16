import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    sessionID: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);

export default Session; 