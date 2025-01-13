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
  // Guard in case `practice` is undefined
  if (!practice) {
    return <p>No practice found with the provided data.</p>;
  }

  // 1) Maintain state for each player’s stats in an array.
  //    This state is the "single source of truth."
  const [playerStats, setPlayerStats] = useState(
    practice.players.map((player) => ({
      playerId: player.player._id,
      name: player.player.name,
      completedPasses: player.completedPasses,
      droppedBalls: player.droppedBalls,
    }))
  );

  // 2) Callback to handle any stat update from children
  const handleStatUpdated = (
    playerId: string,
    updatedStats: {
      completedPasses: number;
      droppedBalls: number;
    }
  ) => {
    setPlayerStats((prevStats) =>
      prevStats.map((player) =>
        player.playerId === playerId
          ? { ...player, ...updatedStats }
          : player
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Practice Dashboard</h1>
      <p className="text-gray-700 mb-4">Practice ID: {practice.id}</p>
      <hr className="mb-6" />
  
      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            onStatUpdated={(updatedStats) =>
              handleStatUpdated(player.playerId, updatedStats)
            }
            // Pass additional Tailwind classes if PlayerCard accepts the
          />
        ))}
      </div>
    </div>
  );
  
};

export default PracticeDashboard;
