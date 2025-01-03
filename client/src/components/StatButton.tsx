import { useMutation } from "@apollo/client"; // Import the useMutation hook from Apollo Client to execute GraphQL mutations.
import { StatButtonProps } from "../interfaces/StatButton"; // Import the TypeScript interface defining the props for the StatButton component.
import { UPDATE_PLAYER_STAT } from "../utils/mutations";
import { GET_PLAYER_STATS } from "../utils/queries"; // Import the GraphQL mutation to update a player's stat.

// Define the StatButton component as a functional React component with props typed using StatButtonProps (in interfaces)
const StatButton: React.FC<StatButtonProps> = ({
  practiceId,     
  playerId,       
  statName,       
  increment,      
  onStatUpdated,  
}) => {
  // Initialize the mutation hook with the UPDATE_PLAYER_STAT mutation.
  // Apollo's useMutation returns a function to trigger the mutation and an object with status details.
  const [updatePlayerStat, { loading, error }] = useMutation(UPDATE_PLAYER_STAT, {
    // Add refetchQueries to update the stats globally
    refetchQueries: [
      {
        query: GET_PLAYER_STATS,
        variables: { practiceId, playerId }, // Ensure the correct practice stats are refetched
      },
    ],
    awaitRefetchQueries: true, // Ensures refetch completes before continuing
  }); 
  

  // Function to handle button clicks and trigger the mutation.
  const handleClick = async () => {
    try {
      console.log("Sending Variables:", { practiceId, playerId, statName, increment });
      const { data } = await updatePlayerStat({
        variables: { practiceId, playerId, statName, increment },
      });
      console.log("Mutation Response:", data);
      if (onStatUpdated) {
        onStatUpdated(data.updatePlayerStat);
      }
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "message" in err) {
        console.error("Failed to update stat:", (err as Error).message);
      } else {
        console.error("An unknown error occurred:", err);
      }
    }
    
  };
  

  return (
    // Render a button that triggers handleClick when clicked.
    // The button is disabled while the mutation is loading to prevent multiple clicks.
    <button onClick={handleClick} disabled={loading}>
      {/* Dynamically display the button label: "+" or "-" based on the increment value */}
      {increment > 0 ? `+` : `-`}
      
      {/* Show a loading message while the mutation is in progress */}
      {loading && " (Updating...)"}

      {/* Display an error message if the mutation fails */}
      {error && <span style={{ color: "red" }}>Error!</span>}
    </button>
  );
};

export default StatButton