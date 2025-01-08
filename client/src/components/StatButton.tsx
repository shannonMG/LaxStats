import { useMutation } from "@apollo/client"; // Import the useMutation hook from Apollo Client to execute GraphQL mutations.
import { StatButtonProps } from "../interfaces/StatButton"; // Import the TypeScript interface defining the props for the StatButton component.
import { UPDATE_PLAYER_STAT } from "../utils/mutations";

// Define the StatButton component as a functional React component with props typed using StatButtonProps (in interfaces)
const StatButton: React.FC<StatButtonProps> = ({
  practiceId,
  playerId,
  statName,
  increment,
  onStatUpdated,
}) => {
  const [updatePlayerStat, { loading, error }] = useMutation(UPDATE_PLAYER_STAT);

  const handleClick = async () => {
    try {
      const { data } = await updatePlayerStat({
        variables: { practiceId, playerId, statName, increment },
      });

      // Extract the specific player's updated stats from the response
      const updatedPlayerStats = data.updatePlayerStat.players.find(
        (player: any) => player.player._id === playerId
      );

      if (updatedPlayerStats && onStatUpdated) {
        onStatUpdated({
          completedPasses: updatedPlayerStats.completedPasses,
          droppedBalls: updatedPlayerStats.droppedBalls,
        });
      }
    } catch (err) {
      console.error('Failed to update stat:', err);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {increment > 0 ? '+' : '-'}
      {loading && ' (Updating...)'}
      {error && <span style={{ color: 'red' }}>Error!</span>}
    </button>
  );
};


export default StatButton