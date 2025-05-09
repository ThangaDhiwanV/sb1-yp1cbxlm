import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ElementType;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  icon: Icon,
}) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium transition-all duration-200',
    'rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2',
    disabled && 'opacity-50 cursor-not-allowed'
  );

  const variantClasses = {
    primary: cn(
      'bg-primary-500 text-white',
      'hover:bg-primary-600 focus:ring-primary-500',
      'shadow-sm'
    ),
    secondary: cn(
      'bg-secondary-500 text-white',
      'hover:bg-secondary-600 focus:ring-secondary-500',
      'shadow-sm'
    ),
    outline: cn(
      'border border-gray-200 bg-white text-gray-700',
      'hover:bg-gray-50 hover:border-gray-300 focus:ring-primary-500',
      'shadow-sm'
    ),
    ghost: cn(
      'bg-transparent text-gray-700',
      'hover:bg-gray-100 focus:ring-gray-500',
      'shadow-none'
    ),
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        Icon && 'gap-2',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
};

export default Button;