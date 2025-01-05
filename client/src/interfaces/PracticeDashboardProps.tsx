interface PlayerStats {
  player: {
    id: string;
    name: string;
  };
  droppedBalls: number;
  completedPasses: number;
}

interface Practice {
  id: string;
  date: string;
  players: PlayerStats[];
}

interface PracticeDashboardProps {
  practiceData: Practice[]; // Expecting an array of practices
  userId: string; // User ID for filtering players
}