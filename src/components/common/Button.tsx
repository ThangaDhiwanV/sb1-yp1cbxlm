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
  loading?: boolean;
  isCreationButton?: boolean;
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
  loading = false,
  isCreationButton = false,
}) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium relative overflow-hidden',
    'transition-all duration-300 ease-out transform',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'active:scale-95',
    'before:absolute before:inset-0 before:transition-transform before:duration-300',
    'before:origin-left before:scale-x-0 hover:before:scale-x-100',
    'before:bg-gradient-to-r before:opacity-10',
    'after:absolute after:inset-0 after:transition-transform after:duration-500',
    'after:origin-right after:scale-x-0 hover:after:scale-x-100',
    'after:bg-gradient-to-l after:opacity-5',
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    loading && 'cursor-wait',
    isCreationButton && [
      'animate-float',
      'hover:animate-none',
      'hover:scale-105',
      'active:scale-95',
      'transition-all duration-300'
    ]
  );

  const variantClasses = {
    primary: cn(
      'bg-gradient-to-r from-primary-500 to-primary-600 text-white',
      'hover:from-primary-600 hover:to-primary-700',
      'focus:ring-primary-500',
      'before:from-white before:to-transparent',
      'after:from-white/50 after:to-transparent',
      'shadow-md shadow-primary-500/10 hover:shadow-lg hover:shadow-primary-500/20',
      'rounded-lg',
      isCreationButton && [
        'animate-pulse-glow',
        'bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500',
        'bg-[length:200%_100%]',
        'hover:bg-[length:100%_100%]',
        'transition-all duration-500'
      ]
    ),
    secondary: cn(
      'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white',
      'hover:from-secondary-600 hover:to-secondary-700',
      'focus:ring-secondary-500',
      'before:from-white before:to-transparent',
      'after:from-white/50 after:to-transparent',
      'shadow-md shadow-secondary-500/10 hover:shadow-lg hover:shadow-secondary-500/20',
      'rounded-lg'
    ),
    outline: cn(
      'border-2 border-gray-200 bg-white text-gray-700',
      'hover:border-primary-500/50 hover:text-primary-600',
      'focus:ring-primary-500',
      'before:from-primary-50 before:to-transparent',
      'after:from-primary-100 after:to-transparent',
      'shadow-sm hover:shadow-md hover:shadow-primary-500/10',
      'rounded-lg'
    ),
    ghost: cn(
      'bg-transparent text-gray-700',
      'hover:bg-gray-100',
      'focus:ring-gray-500',
      'before:from-primary-50 before:to-transparent',
      'after:from-primary-100 after:to-transparent',
      'rounded-lg'
    ),
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const loadingSpinner = (
    <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-lg">
      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    </div>
  );

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
      disabled={disabled || loading}
    >
      {loading && loadingSpinner}
      <span className={cn(
        'flex items-center gap-2 relative z-10',
        'transition-transform duration-300 ease-out',
        loading && 'opacity-0',
        isCreationButton && [
          'group',
          'hover:scale-105',
          'transition-all duration-300'
        ]
      )}>
        {Icon && (
          <Icon className={cn(
            'h-4 w-4 transition-all duration-300',
            isCreationButton ? [
              'group-hover:rotate-180',
              'group-hover:scale-110',
              'transition-all duration-500'
            ] : [
              'group-hover:scale-110',
              'group-hover:rotate-3'
            ]
          )} />
        )}
        {children}
      </span>
    </button>
  );
};

export default Button;