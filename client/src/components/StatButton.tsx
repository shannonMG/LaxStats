import React from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_PLAYER_STAT } from '../utils/mutations';

interface StatButtonProps {
  practiceId: string;
  playerId: string;
  statName: 'completedPasses' | 'droppedBalls';
  increment: number;
  onStatUpdated: (updatedStats: { completedPasses: number; droppedBalls: number }) => void;
}

const StatButton: React.FC<StatButtonProps> = ({ practiceId, playerId, statName, increment, onStatUpdated }) => {
  const [updatePlayerStat] = useMutation(UPDATE_PLAYER_STAT);

  const handleClick = async () => {
    try {
      const { data } = await updatePlayerStat({
        variables: { practiceId, playerId, statName, increment },
      });

      // Extract the updated player stats from the mutation response
      const updatedPlayer = data?.updatePlayerStat.players.find((player: any) => player.player._id === playerId);

      if (updatedPlayer) {
        // Call onStatUpdated with the updated stats
        onStatUpdated({
          completedPasses: updatedPlayer.completedPasses,
          droppedBalls: updatedPlayer.droppedBalls,
        });
      }
    } catch (err) {
      console.error('Error updating player stat:', err);
    }
  };

  return <button onClick={handleClick}>{increment > 0 ? '+' : '-'}</button>;
};

export default StatButton;
