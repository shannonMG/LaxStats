import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App.jsx';
import Signup from './pages/Signup.js';
import Login from './pages/Login.js';
import Dashboard from './pages/Dashboard.js';
import ErrorPage from './pages/Error.js';
import StatButton from './components/StatButton.js';
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Dashboard />
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
                path: '/stat-button',
                element: <StatButton 
                    practiceId="675c1b6d675639cd504cffe9"
                    playerId="675ae85d361a7d58527cec9b"
                    statName="completedPasses"
                    increment={1}
                    onStatUpdated={(data) => console.log("Stat Updated:", data)}
                />
            },
            
        ]
    },
]);

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}