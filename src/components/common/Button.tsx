import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
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
    gradient: cn(
      'relative overflow-hidden',
      'bg-gradient-to-r from-primary-500 to-secondary-500',
      'hover:from-primary-600 hover:to-secondary-600',
      'text-white font-medium',
      'shadow-lg shadow-primary-500/20',
      'border border-white/20',
      'hover:scale-[1.02] active:scale-[0.98]',
      'group'
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
      {variant === 'gradient' && (
        <div className={cn(
          "absolute inset-0",
          "bg-gradient-to-r from-transparent via-white/20 to-transparent",
          "translate-x-[-100%] group-hover:translate-x-[100%]",
          "transition-transform duration-1000"
        )} />
      )}
    </button>
  );
};

export default Button;