import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-crm p-5 shadow-card transition-shadow hover:shadow-subtle',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
