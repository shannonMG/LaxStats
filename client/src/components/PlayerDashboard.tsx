import { useQuery } from "@apollo/client";
import { QUERY_PRACTICES } from "../utils/queries";
import auth from "../utils/auth";

const PlayerDashboard = () => {
  const { loading, data } = useQuery(QUERY_PRACTICES, {
    variables: {
      playerId: auth.getId(),
    },
  });

  const Practices = data?.getPracticesForPlayer || [];

  if (loading) {
    return <h2>'Loading please wait'</h2>;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-[100vh] bg-gradient-to-r from-amber-100 to-fuchsia-400">
        <div className="relative flex flex-col items-center rounded-[20px] w-[700px] max-w-[95%] mx-auto bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:!shadow-none p-3 mt-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-2 w-full">
            {Practices.map((practice: any) => (
                <div
                key={practice.practiceId}
                className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none border border-blue-500 group"
                >
                    <div className="text-base font-medium text-navy-700 dark:text-white">
                        {practice.date}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                        <h4>Completed Passes: {practice.completedPasses}</h4>
                        <h4>Dropped Balls: {practice.droppedBalls}</h4>
                    </div>
                </div>
            ))}
            </div>
        </div>
    </div>
  );
};

export default PlayerDashboard;
