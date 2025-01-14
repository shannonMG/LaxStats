import React from 'react';
import StatButton from './StatButton';

interface PlayerStats {
  completedPasses: number;
  droppedBalls: number;
}

interface PlayerCardProps {
  playerId: string;
  playerName: string;
  practiceId: string;
  stats: PlayerStats;
  onStatUpdated: (updatedStats: PlayerStats) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  playerId,
  playerName,
  practiceId,
  stats,
  onStatUpdated,
}) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col justify-center items-center p-6">
      {/* Player Name */}
      <h3 className="text-2xl font-bold mb-4">{playerName}</h3>

      {/* Completed Passes */}
      <div className="flex items-center mb-4">
        <StatButton
          practiceId={practiceId}
          playerId={playerId}
          statName="completedPasses"
          increment={1}
          onStatUpdated={onStatUpdated}
          
        />
        <p className="mx-2 text-lg">Completed Passes: {stats.completedPasses}</p>
        <StatButton
          practiceId={practiceId}
          playerId={playerId}
          statName="completedPasses"
          increment={-1}
          onStatUpdated={onStatUpdated}
          
        />
      </div>

      {/* Dropped Balls */}
      <div className="flex items-center">
        <StatButton
          practiceId={practiceId}
          playerId={playerId}
          statName="droppedBalls"
          increment={1}
          onStatUpdated={onStatUpdated}
          
        />
        <p className="mx-2 text-lg">Dropped Balls: {stats.droppedBalls}</p>
        <StatButton
          practiceId={practiceId}
          playerId={playerId}
          statName="droppedBalls"
          increment={-1}
          onStatUpdated={onStatUpdated}
          
        />
      </div>
    </div>
  );
};

export default PlayerCard;
