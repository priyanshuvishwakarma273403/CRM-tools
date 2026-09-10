import React from 'react';

export const PageHeader = ({ title, subtitle, actions, breadcrumbs }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
      <div>
        {breadcrumbs && (
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span>/</span>}
                <span className={idx === breadcrumbs.length - 1 ? 'text-brand-600 dark:text-brand-400 font-semibold' : ''}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
      </div>

      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
};
