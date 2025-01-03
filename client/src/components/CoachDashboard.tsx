import { useState } from 'react';
import { useMutation } from '@apollo/client';

import { ADD_PRACTICE } from '../utils/mutations';
import PreviousPractices from './PreviousPractices';
import PracticeDashboard from './PracticeDashboard';

const CoachDashboard = () => {
  const [addPractice] = useMutation(ADD_PRACTICE);
  const [isEnabled1, setIsEnabled1] = useState(false);
  const [isEnabled2, setIsEnabled2] = useState(false);
  const [practiceData, setPracticeData] = useState<any>(null); // State to hold practice data

  const handleClick1 = async (event: any) => {
    event.preventDefault();
    const startPractice: any = document.getElementById("startPractice");

    if (!isEnabled1) {
      setIsEnabled1(true);
      startPractice.textContent = "Close new practice";

      try {
        // Call the `addPractice` mutation and store the response
        const { data } = await addPractice();

        // Update the `practiceData` state with the mutation response
        setPracticeData({
          id: data.addPractice.id,
          players: data.addPractice.players.map((playerStat: any) => ({
            player: {
              _id: playerStat.player._id,
              name: playerStat.player.name,
            },
            droppedBalls: playerStat.droppedBalls,
            completedPasses: playerStat.completedPasses,
          })),
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      setIsEnabled1(false);
      startPractice.textContent = "Start a new practice";
    }
  };

  const handleClick2 = async (event: any) => {
    event.preventDefault();
    const previousPractices: any = document.getElementById("previousPractices");

    if (!isEnabled2) {
      setIsEnabled2(true);
      previousPractices.textContent = "Close previous practices";
    } else {
      setIsEnabled2(false);
      previousPractices.textContent = "See previous practices";
    }
  };

  return (
    <div>
      <h1>Coach Dashboard</h1>
      <p>Welcome, Coach!</p>
      <p>This is your dashboard where you can:</p>
      <button id="startPractice" onClick={handleClick1}>Start a new practice</button>
      {isEnabled1 && practiceData && (
        <PracticeDashboard practiceData={practiceData} />
      )}
      <button id="previousPractices" onClick={handleClick2}>See previous practices</button>
      {isEnabled2 && (
        <div>
          <PreviousPractices />
        </div>
      )}
    </div>
  );
};

export default CoachDashboard;
