import React from 'react';

export const Avatar = ({ name = '', src = '', size = 'md', className = '' }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-200 font-bold overflow-hidden shrink-0 border border-brand-200 dark:border-brand-800 ${sizes[size]} ${className}`}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initials || 'U'}</span>
      )}
    </div>
  );
};
