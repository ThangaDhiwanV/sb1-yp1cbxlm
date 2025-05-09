import React from 'react';
import { cn } from '../../utils/cn';

interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = 'Processing...', 
  className 
}) => {
  return (
    <div className={cn(
      'absolute inset-0 bg-white/80 backdrop-blur-sm',
      'flex flex-col items-center justify-center',
      'z-50',
      className
    )}>
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent mb-4" />
      <p className="text-gray-700 font-medium">{message}</p>
    </div>
  );
};

export default LoadingOverlay;