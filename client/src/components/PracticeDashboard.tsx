import React from 'react';
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

  return (
    <div>
      <h1>Practice Dashboard</h1>
      <p>Practice ID: {practice.id}</p>
      <hr />

      {/* Render a PlayerCard for each player */}
      {practice.players.map((playerObj) => (
        <PlayerCard
          key={playerObj.player._id}
          playerId={playerObj.player._id}
          playerName={playerObj.player.name}
          practiceId={practice.id}
          stats={{
            completedPasses: playerObj.completedPasses,
            droppedBalls: playerObj.droppedBalls,
          }}
        />
      ))}
    </div>
  );
};

export default PracticeDashboard;
