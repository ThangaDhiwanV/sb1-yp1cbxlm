import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'gradient';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  variant = 'default',
  hover = false,
}) => {
  return (
    <div
      className={cn(
        'overflow-hidden',
        variant === 'default' ? 'bg-white' : 'bg-gradient-primary',
        'border border-gray-200/60 shadow-sm rounded-xl',
        hover && 'transform transition-all duration-200 hover:scale-[1.02] hover:shadow-md hover:border-gray-300/60',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <div className={cn(
      'px-6 py-4',
      'border-b border-gray-200/60',
      'bg-gradient-to-b from-gray-50 to-white',
      className
    )}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return <div className={cn('px-6 py-5', className)}>{children}</div>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <div className={cn(
      'px-6 py-4',
      'border-t border-gray-200/60',
      'bg-gray-50/50',
      className
    )}>
      {children}
    </div>
  );
};

export default Card;