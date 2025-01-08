import React, { useState } from 'react';
import StatButton from './StatButton'; // Import the StatButton component for incrementing/decrementing stats.
import { PlayerCardProps } from '../interfaces/PlayerCard';



// Define the PlayerCard component, accepting props based on the PlayerCardProps interface.
const PlayerCard: React.FC<PlayerCardProps> = ({ playerId, playerName, practiceId, stats }) => {
  // 1. Initialize stats as local state
  const [playerStats, setPlayerStats] = useState(stats);

  // 2. Handle stat updates
  const handleStatUpdated = (updatedStats: { completedPasses: number; droppedBalls: number }) => {
    console.log('Updated stats received:', updatedStats); // Debugging log
    if (
      typeof updatedStats.completedPasses === 'number' &&
      typeof updatedStats.droppedBalls === 'number'
    ) {
      setPlayerStats({
        ...playerStats, // Keep any other stats unchanged (optional, if you add more stats in the future)
        completedPasses: updatedStats.completedPasses,
        droppedBalls: updatedStats.droppedBalls,
      });
    } else {
      console.error('Invalid stats received:', updatedStats); // Debugging log
    }
  };
  

  return (
    <div>
      <h3>{playerName}</h3>
     
      

      {/* Stat buttons for incrementing and decrementing stats */}
      <div>
        <StatButton
          practiceId={practiceId}
          playerId={playerId}
          statName="completedPasses"
          increment={1}
          onStatUpdated={handleStatUpdated}
        />
        <p>Completed Passes: {playerStats.completedPasses}</p>
        
        <StatButton
          practiceId={practiceId}
          playerId={playerId}
          statName="completedPasses"
          increment={-1}
          onStatUpdated={handleStatUpdated}
        />
        <br></br>
        <StatButton
          practiceId={practiceId}
          playerId={playerId}
          statName="droppedBalls"
          increment={1}
          onStatUpdated={handleStatUpdated}
        />
        <p>Dropped Balls: {playerStats.droppedBalls}</p>
        <StatButton
          practiceId={practiceId}
          playerId={playerId}
          statName="droppedBalls"
          increment={-1}
          onStatUpdated={handleStatUpdated}
        />
      </div>
    </div>
  );
};

export default PlayerCard;