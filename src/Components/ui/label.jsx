import React from 'react';

export const Label = ({ className = '', ...props }) => {
  return (
    <label
      className={`text-sm font-semibold text-gray-700 mb-2 block transition-colors duration-200 ${className}`}
      {...props}
    />
  );
};