import { useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <footer>
            <div>
            {location.pathname !== '/' && (
                <button
                onClick={() => navigate(-1)}
                >
                &larr; Go Back
                </button>
            )}
                <h4>
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