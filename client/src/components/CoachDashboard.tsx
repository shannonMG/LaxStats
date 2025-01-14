import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_PRACTICE } from '../utils/mutations';
import PreviousPractices from './PreviousPractices';
import PracticeDashboard from './PracticeDashboard';
import AuthService from '../utils/auth';

const CoachDashboard = () => {
  const coachId = AuthService.getId();

  // Local state for toggling and storing the full practice object
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [practice, setPractice] = useState<any | null>(null); // Store the full practice object

  // Local state for toggling the PreviousPractices panel
  const [isPreviousOpen, setIsPreviousOpen] = useState(false);

  // Apollo mutation hook
  const [addPractice] = useMutation(ADD_PRACTICE);

  // Toggle "Start new practice" button
  const handleClickNewPractice = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // If the practice panel is currently closed, open it and create a new practice
    if (!isPracticeOpen) {
      setIsPracticeOpen(true);

      try {
        const { data } = await addPractice();

        // Capture the full practice object
        const newPractice = data?.addPractice;
        if (newPractice) {
          setPractice(newPractice); // Store the full practice object
        }
      } catch (err) {
        console.error('Error creating practice:', err);
      }
    } else {
      // If the practice is already open, close it (and reset the practice state)
      setIsPracticeOpen(false);
      setPractice(null);
    }
  };

  // Toggle "Previous Practices" button
  const handleClickPreviousPractices = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsPreviousOpen((prev) => !prev);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col justify-center items-center p-6">
      <h1 className="text-xl font-semibold mb-2">Welcome, Coach!</h1>
      <p>This is your dashboard where you can:</p>

      {/* Button to create/close a new practice */}
      {!isPreviousOpen && (
        <button
          id="startPractice"
          onClick={handleClickNewPractice}
          className="rounded px-3 py-2 m-1 border-b-4 border-l-2 shadow-lg bg-blue-700 border-blue-800 text-white"
        >
          {isPracticeOpen ? 'Close new practice' : 'Start a new practice'}
        </button>
      )}

      {/* Render the PracticeDashboard if open AND we have a valid practice object */}
      {isPracticeOpen && practice && (
        <div>
          <PracticeDashboard practice={practice} />
        </div>
      )}

      {/* Button to show/close previous practices */}
      {!isPracticeOpen && (
        <button
          id="previousPractices"
          onClick={handleClickPreviousPractices}
          className="rounded px-3 py-2 m-1 border-b-4 border-l-2 shadow-lg bg-blue-700 border-blue-800 text-white"
        >
          {isPreviousOpen ? 'Close previous practices' : 'See previous practices'}
        </button>
      )}

      {/* Render the previous practices if toggled on */}
      {isPreviousOpen && coachId && (
        <div>
          <PreviousPractices />
        </div>
      )}
    </div>
  );
};

export default CoachDashboard;
