import { useQuery } from '@apollo/client';
import { QUERY_PRACTICES_FOR_COACH } from '../utils/queries';
import auth from '../utils/auth';

const PreviousPractices = () => {

    const {loading, data}=useQuery(QUERY_PRACTICES_FOR_COACH, {
        variables:{
            "coach": auth.getId()
        }
    })

    const Practices=data?.Practices || []
    if (loading){
        return <h2>Loading, please wait...</h2>
    }
    
    return (
        <div>
            <h3>Previous Practices</h3>
            <ul>
                {Practices.map((practice:any) => {
                    return (
                        <li>
                            <div key={practice.id}>
                                <h4>
                                    {practice.coach} held this practice on {new Date(Number(practice.date)).toLocaleDateString()}.
                                </h4>
                                <p>Players:</p>
                                <ul>
                                    {practice.players.map(() => {
                                        return (
                                            <li>
                                                <div key={practice.players.player._id}>
                                                    <p>{practice.players.player._id}</p>
                                                </div>
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