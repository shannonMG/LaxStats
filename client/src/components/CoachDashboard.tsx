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
  const [practice, setPractice] = useState<any | null>(null);

  // Local state for toggling the PreviousPractices panel
  const [isPreviousOpen, setIsPreviousOpen] = useState(false);

  // Apollo mutation hook
  const [addPractice] = useMutation(ADD_PRACTICE);

  // Toggle "Start new practice" button
  const handleClickNewPractice = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!isPracticeOpen) {
      setIsPracticeOpen(true);
      try {
        const { data } = await addPractice();
        const newPractice = data?.addPractice;
        if (newPractice) {
          setPractice(newPractice);
        }
      } catch (err) {
        console.error('Error creating practice:', err);
      }
    } else {
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
    <div
    className="flex h-screen w-full items-center justify-center bg-gray-900 bg-cover bg-center"
    style={{
      backgroundImage:
        "url('https://chapelboromedia.s3.amazonaws.com/uploads/2018/08/03221432/katrina-dowd.jpg')",
    }}
  >
    <div
      className="
      p-8
        max-w-full
        m-6
        mx-auto 
        flex flex-col items-center
        bg-moss-green 
        bg-opacity-50 
        text-dark-green 
        rounded-xl 
        shadow-lg 
        overflow-hidden 
        flex 
        flex-col 
        items-center
        backdrop-blur-md 
        max-sm:px-8
        
      "
    >
      <h1 className="text-2xl font-bold">Welcome, Coach!</h1>
      <p className="text-base mb-4">This is your dashboard where you can:</p>
  
      {/* Button to create/close a new practice */}
      {!isPreviousOpen && (
        <button
          id="startPractice"
          onClick={handleClickNewPractice}
          className="
            rounded 
            px-4 
            py-2 
            m-2 
            border-b-4 
            border-fern-green 
            bg-fern-green 
            text-white
            hover:bg-hunter-green 
            hover:border-hunter-green 
            shadow-lg 
            transition-colors 
            duration-200
          "
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
          className="
            rounded 
            px-4 
            py-2 
            m-2 
            border-b-4 
            border-fern-green 
            bg-fern-green 
            text-white 
            hover:bg-hunter-green 
            hover:border-hunter-green 
            shadow-lg 
            transition-colors 
            duration-200
          "
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
    </div>
  );
}  
export default CoachDashboard;
