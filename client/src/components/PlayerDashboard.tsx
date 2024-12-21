import { useQuery } from "@apollo/client";
import { QUERY_PRACTICES } from "../utils/queries";
import auth from "../utils/auth";

const PlayerDashboard = () => {

    const {loading,data}=useQuery(QUERY_PRACTICES, {
        variables:{
            "playerId": auth.getId()
        }
    })
    const Practices=data?.getPracticesForPlayer || []
    if(loading){
        return <h2>'Loading please wait'</h2>
    }
    return (
        <div>
            <h1>Player Dashboard</h1>
            <p>Welcome, Player!</p>
            <p>
                These are your practices, hover over to see stats:
                <ul>
                    {/* <li>View a list of all practices you participated in</li>
                    <li>Hover over a practice to see your stats</li> */}
                    {
                        Practices.map((practice:any) => {
                            return (
                                <li>
                                    <div>{practice.practiceId}</div>
                                    <div>
                                        {/* this is the part that we need to hide eventually */}
                                        <h4>Completed Passes: {practice.completedPasses}</h4>
                                        <h4>Dropped Balls: {practice.droppedBalls}</h4>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </p>
        </div>
    );
};

export default PlayerDashboard;