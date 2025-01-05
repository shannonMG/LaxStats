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
  practiceData: {
    id: string;
    players: {
      player: {
        _id: string;
        name: string;
      };
      droppedBalls: number;
      completedPasses: number;
    }[];
  };
  userId?: string; // Make `userId` optional
}
