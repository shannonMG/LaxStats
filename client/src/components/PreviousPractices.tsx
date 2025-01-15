import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_PRACTICES_FOR_COACH } from '../utils/queries';
import auth from '../utils/auth';


const PreviousPractices = () => {
   
  const {loading, error, data}=useQuery(QUERY_PRACTICES_FOR_COACH, {
      variables:{"coachId": auth.getId()}
  });

  const [openPracticeId, setOpenPracticeId] = useState<string|null>(null);
  // const [accordionOpen, setAccordionOpen] = useState(true);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const practices = data?.getPracticesByCoach || [];

  const togglePractice = (practiceId: string) => {
    setOpenPracticeId((prevId) => (prevId === practiceId? null:practiceId));
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-100 via-teal-300 to-teal-500">
      <div className="w-full max-w-lg px-10 py-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Previous Practices</h2>
        {practices.length === 0 ? (
          <p className="text-gray-500">No practices found.</p>
        ) : (
          practices.map((practice:any) => {
            const isOpen = openPracticeId === practice.id;
            return (
              <div
                key={practice.id}
                className="p-4 mb-4 border rounded-lg bg-gray-50"
              >
                <div
                  onClick={() => togglePractice(practice.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span className="text-gray-600 font-medium">
                    <strong>Practice Date: </strong>
                    {new Date(Number(practice.date)).toLocaleDateString()}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className={`w-6 h-6 transform transition-transform duration-300 ${
                      isOpen ? 'rotate-90' : ''
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </div>
                {isOpen && (
                  <div className="mt-4">
                    <div className="mt-2">
                      <h3 className="font-medium">Players:</h3>
                      {practice.players.map((player: any) => (
                        <div key={player.player.id} className="ml-4 mt-2">
                          <p>
                            <strong>Name:</strong> {player.player.name}
                          </p>
                          <p>
                            <strong>Completed Passes:</strong>{' '}
                            {player.completedPasses}
                          </p>
                          <p>
                            <strong>Dropped Balls:</strong>{' '}
                            {player.droppedBalls}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PreviousPractices;