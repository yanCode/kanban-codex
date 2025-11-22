"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", emoji: "🏁" },
  { href: "/kanban", label: "Kanban", emoji: "📋" },
  { href: "/todo", label: "Todo List", emoji: "✅" },
  { href: "/calendar", label: "Calendar", emoji: "📅" },
  { href: "/settings", label: "Settings", emoji: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 border-r border-slate-100 bg-white/90 px-6 py-10 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/50 lg:flex">
      <div className="flex w-full flex-col justify-between gap-6">
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                ✦
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Flow Suite
                </p>
                <p className="text-base font-semibold text-slate-900 dark:text-white">
                  Productivity
                </p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-slate-100 dark:hover:bg-slate-800/70",
                    active
                      ? "bg-slate-900 text-white shadow-card dark:bg-white dark:text-slate-900"
                      : "text-slate-600 dark:text-slate-300",
                  )}
                >
                  <span className="text-lg">{item.emoji}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          <p className="font-semibold text-slate-800 dark:text-white">
            Weekly focus
          </p>
          <p className="mt-1 text-sm">
            Ship one small improvement every day. Keep momentum steady.
          </p>
        </div>
      </div>
    </aside>
  );
}
