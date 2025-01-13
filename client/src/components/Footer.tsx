import { useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <footer className="p-4 bg-white rounded-lg shadow md:px-6 md:py-8 dark:bg-gray-800 overflow-hidden flex flex-col justify-center items-center">
            <div>
            {location.pathname !== '/' && (
                <button
                onClick={() => navigate(-1)}
                >
                &larr; Go Back
                </button>
            )}
                <h4 >
                    Made with{' '}
                    <span
                    className="emoji"
                    role="img"
                    aria-label="heart"
                    aria-hidden="false"
                    >
                    ❤️
                    </span>{' '}
                    by Shannon, Shuki, & James.
                </h4>
            </div>
        </footer>
    );
};

export default Footer;