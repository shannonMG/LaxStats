import { Schema, model } from 'mongoose';
// Define the schema for the Practice document
const practiceSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    coach: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    players: [
        {
            playerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            droppedBalls: { type: Number, default: 0 },
            completedPasses: { type: Number, default: 0 },
        },
    ],
}, {
    timestamps: true, // Add `createdAt` and `updatedAt` automatically
});
// Export the Practice model
const Practice = model('Practice', practiceSchema);
export default Practice;
