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
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});



// Create the model if it doesn't exist, otherwise use the existing one
const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);

export default Session; 