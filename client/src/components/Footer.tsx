import { useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <footer
      className="
        bg-hunter-green 
        text-moss-green 
        border 
        border-gray-200 
        dark:border-gray-700 
        px-2 
        sm:px-4 
        py-8 
        rounded 
        dark:bg-gray-800 
        shadow 
        flex 
        flex-col 
        justify-center 
        items-center
      "
    >
      <div className="space-y-4 w-full">
        {location.pathname !== '/' && (
          <button
            onClick={() => navigate(-1)}
            className="
              block 
              mx-auto
              rounded 
              px-4 
              py-2 
              shadow-md 
              border-b-4 
              border-fern-green 
              bg-fern-green 
              text-white 
              hover:bg-hunter-green 
              hover:border-hunter-green 
              transition-colors 
              duration-200
            "
          >
            &larr; Go Back
          </button>
        )}

        <h4 className="text-center">
          Made with{' '}
          <span
            className="emoji"
            role="img"
            aria-label="heart"
            aria-hidden="false"
          >
            ❤️
          </span>{' '}
          by Shannon, Shuki, &amp; James.
        </h4>
      </div>
    </footer>
  );
};

export default Footer;
