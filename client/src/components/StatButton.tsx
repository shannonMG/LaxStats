import React from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_PLAYER_STAT } from '../utils/mutations';
import { GET_PLAYER_STATS } from '../utils/queries';

interface StatButtonProps {
  practiceId: string;
  playerId: string;
  statName: 'completedPasses' | 'droppedBalls';
  increment: number;
  onStatUpdated: (updatedStats: {
    completedPasses: number;
    droppedBalls: number;
  }) => void;
}

const StatButton: React.FC<StatButtonProps> = ({
  practiceId,
  playerId,
  statName,
  increment,
  onStatUpdated,
}) => {
  const [updatePlayerStat] = useMutation(UPDATE_PLAYER_STAT, {
    refetchQueries: [
      {
        query: GET_PLAYER_STATS,
        variables: { practiceId, playerId },
      },
    ],
    awaitRefetchQueries: true,
  });

  const handleClick = async () => {
    try {
      // 1) Run the GraphQL mutation to update the stat.
      const { data } = await updatePlayerStat({
        variables: { practiceId, playerId, statName, increment },
      });

      // 2) The mutation result should contain updated stats in data.updatePlayerStat.players
      const updatedPlayer = data?.updatePlayerStat.players.find(
        (p: any) => p.player._id === playerId
      );

      // 3) Pass new stats back up to the parent via onStatUpdated
      if (updatedPlayer) {
        onStatUpdated({
          completedPasses: updatedPlayer.completedPasses,
          droppedBalls: updatedPlayer.droppedBalls,
        });
      }
    } catch (err) {
      console.error('Error updating player stat:', err);
    }
  };

  return (
    <button onClick={handleClick} className="rounded px-3 py-2 m-1 border-b-4 border-l-2 shadow-lg bg-blue-700 border-blue-800 text-white">
      {increment > 0 ? '+' : '-'}
    </button>
  );
};

export default StatButton;
