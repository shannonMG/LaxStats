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

        <div className="flex flex-col justify-center items-center h-[100vh] bg-gradient-to-r from-amber-100 to-fuchsia-400">
        <div className="relative flex flex-col items-center rounded-[20px] w-[700px] max-w-[95%] mx-auto bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:!shadow-none p-3">
            <div className="mt-2 mb-8 w-full">
                <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
                Player Dashboard
                </h4>
                <h3 className="px-2 text-m font-bold text-navy-700 dark:text-white">
                Welcome, Player!
                </h3>
                <p className="mt-2 px-2 text-base text-gray-600">
                These are your practices, hover over to see stats:
                </p>
            </div> 
            <div className="grid grid-cols-2 gap-4 px-2 w-full">
                <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                <p className="text-sm text-gray-600"></p>
                <p className="text-base font-medium text-navy-700 dark:text-white">
                <ul className="list-none">
                {
                        Practices.map((practice:any) => {
                            return (
                                <li key={practice.practiceId} className="mb-4 border border-blue-500 py-6 min-w-[300px] rounded-lg shadow-md group">
                                {/* // <li className="playerPractice"> */}
                                    <div>{practice.date}</div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
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

            
            </div>
        </div>  
      
    </div>



        // <div>
             
        //     <h1>Player Dashboard</h1>
        //     <p>Welcome, Player!</p>
        //     <p>
        //         These are your practices, hover over to see stats:
        //         <ul>
        //             {/* <li>View a list of all practices you participated in</li>
        //             <li>Hover over a practice to see your stats</li> */}
                    // {
                    //     Practices.map((practice:any) => {
                    //         return (
                    //             <li className="playerPractice">
                    //                 <div>{practice.practiceId}</div>
                    //                 <div>
                    //                     {/* this is the part that we need to hide eventually */}
                    //                     <h4>Completed Passes: {practice.completedPasses}</h4>
                    //                     <h4>Dropped Balls: {practice.droppedBalls}</h4>
                    //                 </div>
                    //             </li>
                    //         )
                    //     })
                    // }
        //         </ul>
        //     </p>
        // </div>
    );
};

export default PlayerDashboard;