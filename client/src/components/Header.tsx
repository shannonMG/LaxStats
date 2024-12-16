import { Link } from 'react-router-dom';
import { type MouseEvent } from 'react';
import Auth from '../utils/auth';

const Header = () => {
    const logout = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        Auth.logout();
    };
    return (
        <header>
            <div>
                <div>
                    <Link to='/'>
                        <h1>LaxStats</h1>
                    </Link>
                    <p>Track your teams stats here! Or something idk...</p>
                </div>
                <div>
                    {Auth.loggedIn()? (
                        <>
                            <Link to='/me'>
                                {Auth.getDashboard().data.username}'s profile
                            </Link>
                            <button onClick={logout}>
                                Logout
                            </button>
                        </>
                    ):(
                        <>
                            <Link to='/login'>
                                Login
                            </Link>
                            <Link to='/signup'>
                                Signup
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;