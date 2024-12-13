import { Schema, model, Document, Types } from 'mongoose';

// Define the interface for Player stats
interface IPlayerStats {
  playerId: Types.ObjectId;
  droppedBalls: number;
  completedPasses: number;
}

// Define an interface for the Practice document
interface IPractice extends Document {
  date: Date;
  coach: Types.ObjectId;
  players: IPlayerStats[];
}

// Define the schema for the Practice document
const practiceSchema = new Schema<IPractice>(
  {
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
  },
  {
    timestamps: true, // Add `createdAt` and `updatedAt` automatically
  }
);


// Export the Practice model
const Practice = model<IPractice>('Practice', practiceSchema);

export default Practice;
