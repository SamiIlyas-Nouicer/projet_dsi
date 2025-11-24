import PropTypes from 'prop-types';

const LoadingSpinner = ({ size = 'md', color = 'primary', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  };

  const colorClasses = {
    primary: 'border-blue-600',
    white: 'border-white',
    accent: 'border-purple-600',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-4 ${colorClasses[color]}`}></div>
      {fullScreen && <p className="mt-4 text-gray-600 font-semibold">Loading...</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['primary', 'white', 'accent']),
  fullScreen: PropTypes.bool,
};

export default LoadingSpinner;
