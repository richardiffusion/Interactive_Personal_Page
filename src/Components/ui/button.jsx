import React from 'react';

export const Button = ({ 
  children, 
  className = '', 
  size = 'default',
  variant = 'default',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background transform hover:scale-105 active:scale-95';
  
  const variantClasses = {
    default: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 bg-white hover:bg-blue-50',
    ghost: 'text-gray-600 hover:text-blue-600 hover:bg-blue-50',
    destructive: 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
  };

  const sizeClasses = {
    default: 'h-11 px-6 py-3',
    sm: 'h-9 px-4 py-2 text-sm rounded-md',
    lg: 'h-12 px-8 py-4 text-base',
    icon: 'h-10 w-10'
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};