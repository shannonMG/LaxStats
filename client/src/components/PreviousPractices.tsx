import { useQuery } from '@apollo/client';
import { QUERY_PRACTICES_FOR_COACH } from '../utils/queries';

const PreviousPractices = () => {

    const {loading, error, data}=useQuery(QUERY_PRACTICES_FOR_COACH);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>
    
    return (
        <div>
            <h2>Previous Practices</h2>
            <ul>
                {data.practices.map((practice:any) => {
                    return (
                        <li>
                            <div key={practice.id}>
                                <h3>
                                    {practice.coach} held this practice on {new Date((practice.date)).toLocaleDateString()}.
                                </h3>
                                <p>Players:</p>
                                <ul>
                                    {practice.players.map((player: any) => {
                                        return (
                                            <li key={player._id}>
                                                <h4>{player.name}</h4><br/>
                                                <p>Dropped Balls: {player.droppedBalls}</p>
                                                <p>Completed Passes: {player.completedPasses}</p>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
};

export default PreviousPractices;