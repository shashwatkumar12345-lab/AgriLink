
import React from 'react';

interface SpinnerProps {
  appMode?: 'crops' | 'animals';
}

const Spinner: React.FC<SpinnerProps> = ({ appMode = 'crops' }) => {
  const colorClass = appMode === 'animals' ? 'border-pink-600' : 'border-green-600';
  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${colorClass}`}></div>
    </div>
  );
};

export default Spinner;
