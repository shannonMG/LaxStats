import React, { useState } from 'react';
import StatButton from './StatButton'; // Import the StatButton component for incrementing/decrementing stats.
import { PlayerCardProps } from '../interfaces/PlayerCard';



// Define the PlayerCard component, accepting props based on the PlayerCardProps interface.
const PlayerCard: React.FC<PlayerCardProps> = ({ playerId, playerName, practiceId, stats }) => {
  // Local state to manage the stats displayed on the card.
  // This allows immediate updates to the UI when stats are changed.
  const [playerStats, setPlayerStats] = useState(stats);

  /**
   * Callback function to handle stat updates.
   * This function is passed to the StatButton component.
   * It updates the local playerStats state with the new stats returned from the mutation.
   *
   * @param updatedStats - The updated stats object returned after a GraphQL mutation.
   */
  const handleStatUpdated = (updatedStats: any) => {
    setPlayerStats((prevStats) => ({
      ...prevStats,
      [updatedStats.statName]: updatedStats.newValue, // Use the stat name dynamically
    }));
  };
  

  return (
    <div>
      {/* Display the player's name at the top of the card */}
      <h2>{playerName}</h2>
      
      {/* Section for Completed Passes */}
      <div>
        <span>Completed Passes: {playerStats.completedPasses}</span>
        {/* Buttons to increment and decrement the "completedPasses" stat */}
        <StatButton
          practiceId={practiceId} // Pass the current practice ID
          playerId={playerId} // Pass the current player ID
          statName="completedPasses" // Stat to update: "completedPasses"
          increment={1} // Increment by +1
          onStatUpdated={handleStatUpdated} // Callback to handle updated stats
        />
        <StatButton
          practiceId={practiceId}
          playerId={playerId}
          statName="completedPasses"
          increment={-1} // Decrement by -1
          onStatUpdated={handleStatUpdated}
        />
      </div>

      {/* Section for Dropped Balls */}
      <div>
        <span>Dropped Balls: {playerStats.droppedBalls}</span>
        {/* Buttons to increment and decrement the "droppedBalls" stat */}
        <StatButton
          practiceId={practiceId}
          playerId={playerId}
          statName="droppedBalls"
          increment={1} // Increment by +1
          onStatUpdated={handleStatUpdated}
        />
        <StatButton
          practiceId={practiceId}
          playerId={playerId}
          statName="droppedBalls"
          increment={-1} // Decrement by -1
          onStatUpdated={handleStatUpdated}
        />
      </div>
      
    </div>
  );
};

export default PlayerCard;
