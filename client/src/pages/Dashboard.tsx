import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../utils/auth';

import CoachDashboard from '../components/CoachDashboard';
import PlayerDashboard from '../components/PlayerDashboard';

const Dashboard = () => {
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!AuthService.loggedIn()) {
            navigate('/login'); // Redirect to login if not authenticated
            return;
        }

        // Retrieve user role from the token
        const userRole = AuthService.getRole();
        if (userRole) {
            setRole(userRole);
        } else {
            AuthService.logout(); // If no role, log out
        }
    }, [navigate]);

    if (!role) {
        return <div>Loading...</div>; // Placeholder while role is fetched
    }

    return (
        <div>
            {role === 'coach' && <CoachDashboard />}
            {role === 'player' && <PlayerDashboard />}
        </div>
    );
};

export default Dashboard;
