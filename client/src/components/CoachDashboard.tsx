import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_PRACTICE } from '../utils/mutations';
// import PreviousPractices from './PreviousPractices';
import PracticeDashboard from './PracticeDashboard';
import AuthService from '../utils/auth';



const CoachDashboard = () => {
  const coachId = AuthService.getId();
  // 1) Local state for toggling and storing the full practice object
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [practice, setPractice] = useState<any | null>(null); // Store the full practice object

  // 2) Local state for toggling the PreviousPractices panel
  const [isPreviousOpen, setIsPreviousOpen] = useState(false);

  // 3) Apollo mutation hook
  const [addPractice] = useMutation(ADD_PRACTICE);

  // 4) Toggle "Start new practice" button
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

  // 5) Toggle "Previous Practices" button
  const handleClickPreviousPractices = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsPreviousOpen((prev) => !prev);
  };

  return (
    <div>
      <h1>Coach Dashboard</h1>
      <p>Welcome, Coach!</p>
      <p>This is your dashboard where you can:</p>

      {/* 6) Button to create / close a new practice */}
      <button id="startPractice" onClick={handleClickNewPractice}>
        {isPracticeOpen ? 'Close new practice' : 'Start a new practice'}
      </button>

      {/* 7) Render the PracticeDashboard if open AND we have a valid practice object */}
      {isPracticeOpen && practice && (
        <div>
          <PracticeDashboard practice={practice} />
        </div>
      )}

      {/* 8) Button to show previous practices */}
      <button id="previousPractices" onClick={handleClickPreviousPractices}>
        {isPreviousOpen ? 'Close previous practices' : 'See previous practices'}
      </button>

      {/* 9) Render the previous practices if toggled on */}
      {isPreviousOpen && coachId && (
        <div>
          {/* <PreviousPractices/> */}
        </div>
      )}
    </div>
  );
};

export default CoachDashboard;
