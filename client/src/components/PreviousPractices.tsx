import { useQuery } from '@apollo/client';
import { QUERY_PRACTICES_FOR_COACH } from '../utils/queries';
import auth from '../utils/auth';

const PreviousPractices = () => {

    const {loading, data}=useQuery(QUERY_PRACTICES_FOR_COACH, {
        variables:{
            "coach": auth.getId()
        }
    })

    const Practices=data?.QueryForCoaches || []
    if (loading){
        return <h2>Loading, please wait...</h2>
    }
    
    return (
        <div>
            <h3>Previous Practices</h3>
            <ul>
                {Practices?.map((practice:any) => {
                    return (
                        <li>
                            <div key={Practices.id}>
                                <h4>
                                    {Practices.coach.name} held this practice on {new Date(Number(Practices.date)).toLocaleDateString()}.
                                </h4>
                                <p>Players:</p>
                                <ul>
                                    {Practices.players.map(() => {
                                        return (
                                            <li>
                                                <div key={Practices.players._playerId}>
                                                    <p>{Practices.player.name}</p>
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