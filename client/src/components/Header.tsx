import { Link } from 'react-router-dom';
import { type MouseEvent } from 'react';
import Auth from '../utils/auth';
import { useState, useEffect } from 'react';


const Header = () => {

    const [currentPage, setCurrentPage] = useState("");

    useEffect(() => {
        setCurrentPage(window.location.href.split("/")[3])
    }, [])

    const logout = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        Auth.logout();
    };

    return (
        <nav className="bg-hunter-green text-white border border-gray-200 dark:border-gray-700 px-2 sm:px-4 py-8 rounded dark:bg-gray-800 shadow">
            <div className="container flex flex-wrap justify-between items-center mx-auto">
                <a href="/" className="flex items-center">
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                    <div>
                     <Link to='/'>
                         <h1>LaxStats</h1>
                     </Link>
                     <p className="text-xs">Track. Analyze. Dominate.</p>
                 </div>
                    </span>
                </a>

                <div className="flex items-center">
                    <button
                        id="menu-toggle"
                        type="button"
                        className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
                    >
                        <span className="sr-only">Open main menu</span>

                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                </div>

                <div
                    className="w-full md:block md:w-auto hidden"
                    id="mobile-menu"
                >
                    <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
                        {Auth.loggedIn() ? (
                            <>
                                <Link to='/me'>
                                    {Auth.getDashboard().data.username}'s profile
                                </Link>
                                <button onClick={logout}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to='/login'>
                                    <p
                                        className={currentPage == "login" ? "activeLink" : "headerLink"}
                                        onClick={() => {
                                            setCurrentPage("login")
                                        }}
                                    >Login</p>
                                </Link>
                                <Link to='/signup'>
                                    <p
                                        className={currentPage == "signup" ? "activeLink" : "headerLink"}
                                        onClick={() => {
                                            setCurrentPage("signup")
                                        }}
                                    >Signup</p>
                                </Link>
                            </>
                        )}
                    </ul>
                </div>

            </div>
        </nav>

        /* <script>
          const menuToggle = document.getElementById('menu-toggle');
          const mobileMenu = document.getElementById('mobile-menu');
        
          menuToggle.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
          });
        </script> */
        // <header>
        //     <div>
        //         <div>
        //             <Link to='/'>
        //                 <h1>LaxStats</h1>
        //             </Link>
        //             <p>Track your teams stats here! Or something idk...</p>
        //         </div>
        //         <div>
        // {Auth.loggedIn()? (
        //     <>
        //         <Link to='/me'>
        //             {Auth.getDashboard().data.username}'s profile
        //         </Link>
        //         <button onClick={logout}>
        //             Logout
        //         </button>
        //     </>
        // ):(
        //     <>
        //         <Link to='/login'>
        //             Login
        //         </Link>
        //         <Link to='/signup'>
        //             Signup
        //         </Link>
        //     </>
        // )}
        //         </div>
        //     </div>
        // </header>
    );
};

export default Header;