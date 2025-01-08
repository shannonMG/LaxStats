import React, { useState } from 'react';
import PlayerCard from './PlayerCard';

interface PracticeDashboardProps {
  practice: {
    id: string;
    players: Array<{
      completedPasses: number;
      droppedBalls: number;
      player: {
        _id: string;
        name: string;
      };
    }>;
  };
}

const PracticeDashboard: React.FC<PracticeDashboardProps> = ({ practice }) => {
  if (!practice) {
    return <p>No practice found with the provided data.</p>;
  }

  // Maintain state for player stats
  const [playerStats, setPlayerStats] = useState(
    practice.players.map((player) => ({
      playerId: player.player._id,
      name: player.player.name,
      completedPasses: player.completedPasses,
      droppedBalls: player.droppedBalls,
    }))
  );

  // Function to handle stat updates
  const handleStatUpdated = (playerId: string, updatedStats: { completedPasses: number; droppedBalls: number }) => {
    setPlayerStats((prevStats) =>
      prevStats.map((player) =>
        player.playerId === playerId
          ? { ...player, ...updatedStats }
          : player
      )
    );
  };

  return (
    <div>
      <h1>Practice Dashboard</h1>
      <p>Practice ID: {practice.id}</p>
      <hr />

      {/* Render a PlayerCard for each player */}
      {playerStats.map((player) => (
        <PlayerCard
          key={player.playerId}
          playerId={player.playerId}
          playerName={player.name}
          practiceId={practice.id}
          stats={{
            completedPasses: player.completedPasses,
            droppedBalls: player.droppedBalls,
          }}
          onStatUpdated={(updatedStats) => handleStatUpdated(player.playerId, updatedStats)}
        />
      ))}
    </div>
  );
};

export default PracticeDashboard;
