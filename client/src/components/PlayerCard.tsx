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
    <div style={{ border: '1px solid #ccc', padding: '8px', margin: '8px' }}>
      <h3>{playerName}</h3>
      <div>
        <StatButton
          practiceId={practiceId}
          playerId={playerId}
          statName="completedPasses"
          increment={1}
          onStatUpdated={onStatUpdated}
        />
        <p>Completed Passes: {stats.completedPasses}</p>
        <StatButton
          practiceId={practiceId}
          playerId={playerId}
          statName="completedPasses"
          increment={-1}
          onStatUpdated={onStatUpdated}
        />
        <br />
        <StatButton
          practiceId={practiceId}
          playerId={playerId}
          statName="droppedBalls"
          increment={1}
          onStatUpdated={onStatUpdated}
        />
        <p>Dropped Balls: {stats.droppedBalls}</p>
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
