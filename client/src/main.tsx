import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App.jsx';
import Home from './pages/Home.js';
import Signup from './pages/Signup.js';
import Login from './pages/Login.js';
import Dashboard from './pages/Dashboard.js';
import ErrorPage from './pages/Error.js';
import CoachDashboard from './components/CoachDashboard.js';
import PlayerDashboard from './components/PlayerDashboard.js';
import StatButton from './components/StatButton.js';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />
            }, {
                path: '/login',
                element: <Login />
            }, {
                path: '/signup',
                element: <Signup />
            }, {
                path: '/dashboard/:username',
                element: <Dashboard />
            }, {
                path: '/me',
                element: <Dashboard />
            },
            {
                path: '/coach-dashboard',
                element: <CoachDashboard />
            },
            {
                path: '/player-dashboard',
                element: <PlayerDashboard />
            },
            {
                path: '/stat-button',
                element: <StatButton 
                    practiceId="67633f3c0601b58728666542"
                    playerId="675e29cd81f3c738784728d7"
                    statName="completedPasses"
                    increment={1}
                    onStatUpdated={(data) => console.log("Stat Updated:", data)}
                />
            }
        ]
    },
]);

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}