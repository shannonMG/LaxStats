
import { useQuery} from '@apollo/client';
import{GET_PRACTICES} from '../utils/queries'

const PreviousPractices = () => {
    const { loading, error, data } = useQuery(GET_PRACTICES);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    return (
      <div>
        <h2>Previous Practices</h2>
        {data.practices.map((practice: any) => (
          <div key={practice.id}>
            <h3>Practice Date: {new Date(practice.date).toLocaleDateString()}</h3>
            <ul>
              {practice.players.map((playerStat: any, index: number) => (
                <li key={index}>
                  {playerStat.player.name} - Dropped Balls: {playerStat.droppedBalls}, Completed Passes: {playerStat.completedPasses}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

export default PreviousPractices;