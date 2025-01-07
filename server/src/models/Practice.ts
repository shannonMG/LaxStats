import { Schema, model, Document, Types } from 'mongoose';

// Define the interface for Player stats
interface IPlayerStats {
  player: Types.ObjectId;
  droppedBalls: number;
  completedPasses: number;
}

// Define an interface for the Practice document
interface IPractice extends Document {
  _id: string;
  date: Date;
  coach: Types.ObjectId;
  players: IPlayerStats[];
}

// Define the schema for the Practice document
const playerStatsSchema = new Schema({
  player: { type: Schema.Types.ObjectId, ref: 'User' }, 
  droppedBalls: Number,
  completedPasses: Number,
});

const practiceSchema = new Schema({
  date: Date,
  coach: { type: Schema.Types.ObjectId, ref: 'User' },
  players: [playerStatsSchema],
});



// Export the Practice model
const Practice = model<IPractice>('Practice', practiceSchema);

export default Practice;
