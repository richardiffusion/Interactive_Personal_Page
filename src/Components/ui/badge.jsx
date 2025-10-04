import React from 'react';

export const Badge = ({ variant = 'default', className = '', ...props }) => {
  const variantClasses = {
    default: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    secondary: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
    destructive: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
    outline: 'border-2 border-gray-300 text-gray-700 bg-white',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
};