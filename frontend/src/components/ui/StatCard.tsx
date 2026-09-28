import type { ReactNode } from 'react';

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

const COLORES = {
  primary: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
  success: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  danger: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
};

export function StatCard({ title, value, icon, color = 'primary' }: Props) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${COLORES[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}