interface PracticeData {
    id: string;
    players: {
      player: {
        _id: string;
        name: string;
      };
      droppedBalls: number;
      completedPasses: number;
    }[];
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
}