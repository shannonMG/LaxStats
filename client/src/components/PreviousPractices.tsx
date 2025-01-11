import { useQuery } from '@apollo/client';
import { QUERY_PRACTICES_FOR_COACH } from '../utils/queries';
import auth from '../utils/auth';
// import {useState} from 'react';
// import React from 'react';

// interface PreviousPracticesProps {
//   coachId: string; // We expect a coachId prop
// }

// const PreviousPractices: React.FC<PreviousPracticesProps> = ({ coachId }) => {
//   // Use the passed-in coachId in the query
//   const { loading, error, data } = useQuery(QUERY_PRACTICES_FOR_COACH, {
//     variables: { coachId },
//   });
const PreviousPractices = () => {
   
    const {loading, error, data}=useQuery(QUERY_PRACTICES_FOR_COACH, {
        variables:{"coachId": auth.getId()}
    });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const practices = data?.getPracticesByCoach || [];

  return (
    <div>
      <h2>Previous Practices</h2>
      {practices.length === 0 ? (
        <p>No practices found.</p>
      ) : (
        practices.map((practice: any) => (
          <div
            key={practice.id}
            style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}
          >
            <p>
              <strong>Practice ID:</strong> {practice.id}
            </p>
            <p>
              <strong>Date:</strong>{' '}
              {isNaN(new Date(practice.date).getTime())
                ? 'Invalid Date'
                : new Date(practice.date).toLocaleDateString()}
            </p>

            <h3>Players:</h3>
            {practice.players.map((player: any) => (
              <div key={player.player.id} style={{ marginLeft: '20px' }}>
                <p>
                  <strong>Name:</strong> {player.player.name}
                </p>
                <p>
                  <strong>Completed Passes:</strong> {player.completedPasses}
                </p>
                <p>
                  <strong>Dropped Balls:</strong> {player.droppedBalls}
                </p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};
//     return (
//         <div>
//           <h2>Previous Practices</h2>
//           {practices.length === 0 ? (
//             <p>No practices found.</p>
//           ) : (
//                 practices.map((practice: any) => (
//                     <div key={practice.id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
//                         <p><strong>Practice ID:</strong> {practice.id}</p>
//                         <p><strong>Date: </strong>
//                             {new Date(Number(practice.date)).toLocaleDateString()}
//                         </p>
//                         {/* <button onClick={toggleMinimize}>
//                             {minimized? 'Maximize' : "Minimize"}
//                         </button>
//                         {!minimized && (
//                             <div> */}
//                                 <h3>Players:</h3>
//                                 {practice.players.map((player: any) => (
//                                 <div key={player.player.id} style={{ marginLeft: '20px' }}>
//                                     <p><strong>Name:</strong> {player.player.name}</p>
//                                     <p><strong>Completed Passes:</strong> {player.completedPasses}</p>
//                                     <p><strong>Dropped Balls:</strong> {player.droppedBalls}</p>
//                                 </div>
//                                 ))}
//                             {/* </div>
//                         )} */}
//                     </div>
//                 ))
//             )}
//         </div>
//      );
// };

export default PreviousPractices;
