"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChangeEvent } from "react";

const routes = [
  { value: "/", label: "Dashboard" },
  { value: "/kanban", label: "Kanban" },
  { value: "/todo", label: "Todo" },
  { value: "/calendar", label: "Calendar" },
  { value: "/settings", label: "Settings" },
];

export function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    router.push(event.target.value);
  };

  return (
    <div className="lg:hidden">
      <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
        Navigate
      </label>
      <select
        value={
          routes.find((route) => pathname.startsWith(route.value))?.value || "/"
        }
        onChange={handleSelect}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      >
        {routes.map((route) => (
          <option key={route.value} value={route.value}>
            {route.label}
          </option>
        ))}
      </select>
    </div>
  );
}
