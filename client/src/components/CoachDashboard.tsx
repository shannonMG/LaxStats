import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import PreviousPractices from './PreviousPractices';
import PracticeDashboard from './PracticeDashboard';

const CoachDashboard = () => {
    return (
        <div >
            <h1>Coach Dashboard</h1>
            <p>Welcome, Coach!</p>
            <p>
                This is your dashboard where you can:
                <ul>
                    <li>Start a new practice</li>
                    <li>View previous practices</li>
                </ul>
            </p>
        </div>
    );
};

export default CoachDashboard;
