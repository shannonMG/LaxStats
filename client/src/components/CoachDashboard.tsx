import { useState } from 'react';
import { useMutation } from '@apollo/client';

import { ADD_PRACTICE } from '../utils/mutations';
import PreviousPractices from './PreviousPractices';

const CoachDashboard = () => {
    const [addPractice] = useMutation(ADD_PRACTICE);
    const [isEnabled, setIsEnabled] = useState(false);
    const handleClick = async (event: any) => {
        event.preventDefault();
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
            <button onClick={() => setIsEnabled(true)}>See previous practices</button>
            {isEnabled && (
                <div>
                    <PreviousPractices />
                </div>
            )}
        </div>
    );
};

export default CoachDashboard;

