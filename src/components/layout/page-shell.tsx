import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PageShell({
  title,
  description,
  actions,
  children,
  className,
}: PageShellProps) {
  return (
    <section className={cn("space-y-8", className)}>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Workspace
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-base text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </header>
      {children}
    </section>
  );
}
