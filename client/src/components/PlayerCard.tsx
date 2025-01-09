import React from 'react';
import StatButton from './StatButton';
import { PlayerCardProps } from '../interfaces/PlayerCard';

const PlayerCard: React.FC<PlayerCardProps> = ({ playerId, playerName, practiceId, stats, onStatUpdated }) => {
  
  
  return (
    <div>
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
