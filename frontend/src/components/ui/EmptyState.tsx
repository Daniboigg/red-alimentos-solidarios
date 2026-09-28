import type { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full mb-4 text-slate-400 dark:text-slate-500">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      {description && <p className="text-slate-500 dark:text-slate-400 mt-2">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}