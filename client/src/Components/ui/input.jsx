import React from 'react';

export const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm ${className}`}
      {...props}
    />
  );
};