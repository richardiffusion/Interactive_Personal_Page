import React from 'react';

export const Select = ({ className = '', children, ...props }) => {
  return (
    <select
      className={`flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-gradient-to-r from-white to-gray-50 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

export const SelectTrigger = ({ className = '', children, ...props }) => {
  return (
    <div
      className={`flex h-12 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 hover:border-gray-300 ${className}`}
      {...props}
    >
      {children}
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
};

export const SelectValue = ({ placeholder = "Select...", ...props }) => {
  return (
    <span className="text-gray-700" {...props}>
      {placeholder}
    </span>
  );
};

export const SelectContent = ({ className = '', children, ...props }) => {
  return (
    <div className={`absolute z-50 min-w-[12rem] overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-xl ${className}`} {...props}>
      {children}
    </div>
  );
};

export const SelectItem = ({ className = '', children, ...props }) => {
  return (
    <div
      className={`relative flex w-full cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const SelectGroup = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export const SelectLabel = ({ children, ...props }) => {
  return (
    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide" {...props}>
      {children}
    </div>
  );
};