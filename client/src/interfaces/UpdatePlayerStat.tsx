export interface UpdatePlayerStatArgs {
    practiceId: string; // The ID of the practice document
    playerId: string;   // The ID of the player to update
    statName: "droppedBalls" | "completedPasses"; // Restrict to known stats
    increment: number;  // The increment value
  }

  