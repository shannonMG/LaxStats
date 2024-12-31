import { useState } from 'react';
import { useMutation } from '@apollo/client';

import { ADD_PRACTICE } from '../utils/mutations';
import PreviousPractices from './PreviousPractices';
import PracticeDashboard from './PracticeDashboard';

const CoachDashboard = () => {
    const [addPractice] = useMutation(ADD_PRACTICE);
    const [isEnabled1, setIsEnabled1] = useState(false);
    const [isEnabled2, setIsEnabled2] = useState(false);
    const handleClick = async (event: any) => {
        event.preventDefault();
        setIsEnabled1(true);
        try {
            await addPractice();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Coach Dashboard</h1>
            <p>Welcome, Coach!</p>
            <p>This is your dashboard where you can:</p>
            <button onClick={(handleClick)}>Start a new practice</button>
            {isEnabled1 && (
                <div>
                    <PracticeDashboard />
                </div>
            )}
            <button onClick={() => setIsEnabled2(true)}>See previous practices</button>
            {isEnabled2 && (
                <div>
                    <PreviousPractices />
                </div>
            )}
        </div>
    );
};

export default CoachDashboard;

