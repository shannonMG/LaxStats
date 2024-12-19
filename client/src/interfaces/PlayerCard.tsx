export interface PlayerCardProps {
  playerId: string; // Unique ID of the player.
  playerName: string; // Name of the player.
  practiceId: string; // Unique ID of the practice session.
  stats: {
    completedPasses: number; // Initial value for completed passes.
    droppedBalls: number; // Initial value for dropped balls.
    thrownAwayPasses: number; // Initial value for thrown away passes.
  };
}