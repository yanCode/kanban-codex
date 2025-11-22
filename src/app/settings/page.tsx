"use client";

import { ChangeEvent, useRef } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import {
  KANBAN_STORAGE_KEY,
  useKanbanTasks,
} from "@/hooks/use-kanban";
import { TODO_STORAGE_KEY, useTodos } from "@/hooks/use-todos";
import {
  CALENDAR_STORAGE_KEY,
  useCalendarEvents,
} from "@/hooks/use-calendar";
import { clearStorageKeys } from "@/lib/storage";
import {
  defaultEvents,
  defaultKanbanTasks,
  defaultTodos,
} from "@/lib/default-data";

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();
  const {
    state: tasks,
    setState: setTasks,
  } = useKanbanTasks();
  const {
    state: todos,
    setState: setTodos,
  } = useTodos();
  const {
    state: events,
    setState: setEvents,
  } = useCalendarEvents();

  const handleReset = () => {
    clearStorageKeys([
      KANBAN_STORAGE_KEY,
      TODO_STORAGE_KEY,
      CALENDAR_STORAGE_KEY,
    ]);
    setTasks(defaultKanbanTasks);
    setTodos(defaultTodos);
    setEvents(defaultEvents);
  };

  const handleExport = () => {
    const payload = {
      tasks,
      todos,
      events,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "flow-suite-backup.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.todos) setTodos(parsed.todos);
        if (parsed.events) setEvents(parsed.events);
      } catch {
        alert("Unable to import file. Please check the format.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <PageShell
      title="Settings"
      description="Tweak the look, keep data safe, and start fresh at any moment."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Theme
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
            Appearance
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Switch between light and dark to match your desk or the time of day.
          </p>
          <div className="mt-4 flex gap-3">
            <Button
              variant={theme === "light" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setTheme("light")}
            >
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setTheme("dark")}
            >
              Dark
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Data
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
            Backup & reset
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Everything lives in your browser. Export a snapshot or wipe the
            workspace clean.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary" size="sm" onClick={handleExport}>
              Download backup
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Import backup
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
            >
              Reset workspace
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleImport}
              hidden
            />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
