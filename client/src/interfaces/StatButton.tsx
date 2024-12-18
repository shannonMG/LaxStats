export interface StatButtonProps {
    practiceId: string;
    playerId: string;
    statName: "droppedBalls" | "completedPasses";
    increment: number; // +1 for increment, -1 for decrement
    onStatUpdated?: (updatedData: any) => void; // Optional callback for state update
  }