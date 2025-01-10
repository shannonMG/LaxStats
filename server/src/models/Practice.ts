import { Schema, model, Document, Types } from 'mongoose';

// Define the interface for Player stats
interface IPlayerStats {
  playerId: Types.ObjectId | {_id: string; name: string};
  droppedBalls: number;
  completedPasses: number;
}

// Define an interface for the Practice document
interface IPractice extends Document {
  date: Date;
  coach: Schema.Types.ObjectId;
  players: IPlayerStats[];
}

// Define the schema for the Practice document
const practiceSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  coach: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  players: [
    {
      playerId: {
        type: Types.ObjectId,
        ref: 'User', // Reference the User model
        required: true,
      },
      droppedBalls: {
        type: Number,
        required: true,
      },
      completedPasses: {
        type: Number,
        required: true,
      },
    },
  ],
});


// Export the Practice model
const Practice = model<IPractice>('Practice', practiceSchema);

export default Practice;
