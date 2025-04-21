'use client';

import React from 'react';

type ProgressBarProps = {
  progress: number;
  className?: string;
  progressClassName?: string;
  height?: number;
  color?: string;
  backgroundColor?: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = '',
  progressClassName = '',
  height = 4,
  color = 'bg-blue-600',
  backgroundColor = 'bg-gray-200'
}) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div
      className={`w-full ${backgroundColor} rounded-full overflow-hidden ${className}`}
      style={{ height: `${height}px` }}
    >
      <div
        className={`${color} ${progressClassName} transition-all duration-300 ease-in-out`}
        style={{ width: `${clampedProgress}%`, height: '100%' }}
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};

export default ProgressBar;
