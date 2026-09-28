import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function Card({ children, className = '', title, subtitle }: Props) {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}