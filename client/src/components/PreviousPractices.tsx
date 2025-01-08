import { useQuery } from '@apollo/client';
import { QUERY_PRACTICES_FOR_COACH } from '../utils/queries';


const PreviousPractices = ({ coachId }: { coachId: string }) => {
    const { loading, data, error } = useQuery(QUERY_PRACTICES_FOR_COACH, {
      variables: { coachId },
      skip: !coachId, // Skip the query if coachId is not available
    });
  
    if (loading) return <p>Loading practices...</p>;
    if (error) return <p>Error fetching practices: {error.message}</p>;
  
    const practices = data?.getPracticesByCoach || [];
  
    return (
        <div>
          <h2>Previous Practices</h2>
          {practices.length === 0 ? (
            <p>No practices found.</p>
          ) : (
            practices.map((practice: any) => (
              <div key={practice.id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
                <p><strong>Practice ID:</strong> {practice.id}</p>
                <p><strong>Date:</strong> {new Date(practice.date).toLocaleDateString()}</p>

                
                <h3>Players:</h3>
                {practice.players.map((player: any) => (
                  <div key={player.player.id} style={{ marginLeft: '20px' }}>
                    <p><strong>Name:</strong> {player.player.name}</p>
                    <p><strong>Completed Passes:</strong> {player.completedPasses}</p>
                    <p><strong>Dropped Balls:</strong> {player.droppedBalls}</p>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
    );
  };
  
  export default PreviousPractices;