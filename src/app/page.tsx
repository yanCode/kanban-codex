"use client";

import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useKanbanTasks } from "@/hooks/use-kanban";
import { useTodos } from "@/hooks/use-todos";
import { useCalendarEvents } from "@/hooks/use-calendar";
import { kanbanColumns } from "@/lib/default-data";
import { formatDate, todayISO } from "@/lib/utils";

const quickLinks = [
  { title: "Add kanban task", href: "/kanban" },
  { title: "Capture todo", href: "/todo" },
  { title: "Schedule event", href: "/calendar" },
];

export default function DashboardPage() {
  const { state: tasks } = useKanbanTasks();
  const { state: todos } = useTodos();
  const { state: events } = useCalendarEvents();

  const openTasks = tasks.filter((task) => task.status !== "done").length;
  const progressTasks = tasks.filter((task) => task.status === "progress").length;
  const todayTodos = todos.filter(
    (todo) => todo.dueDate === todayISO() && !todo.completed,
  );

  const nextEvent = [...events]
    .sort((a, b) => a.date.localeCompare(b.date))
    .find((event) => event.date >= todayISO());

  return (
    <PageShell
      title="Command center"
      description="See everything in one glance. Review commitments, ship work, and protect your focus."
      actions={
        <Link href="/kanban" className={buttonClasses()}>
          New task
        </Link>
      }
    >
      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Open tasks
          </p>
          <p className="mt-5 text-4xl font-semibold text-slate-900 dark:text-white">
            {openTasks}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {progressTasks} actively moving forward
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Today&apos;s focus
          </p>
          <p className="mt-5 text-4xl font-semibold text-slate-900 dark:text-white">
            {todayTodos.length}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            high-impact todos scheduled for today
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Next event
          </p>
          {nextEvent ? (
            <>
              <p className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">
                {nextEvent.title}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {formatDate(nextEvent.date)} · {nextEvent.time || "All day"}
              </p>
            </>
          ) : (
            <p className="mt-4 text-sm text-slate-500">Nothing booked yet.</p>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Kanban
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                Flow overview
              </h2>
            </div>
            <Link
              href="/kanban"
              className={buttonClasses({ size: "sm", variant: "secondary" })}
            >
              Open board
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {kanbanColumns.map((column) => {
              const columnTasks = tasks.filter(
                (task) => task.status === column.id,
              );
              return (
                <div
                  key={column.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/70"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {column.title}
                    </p>
                    <span className="text-xs text-slate-500">
                      {columnTasks.length}
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {columnTasks.slice(0, 2).map((task) => (
                      <div key={task.id}>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                          {task.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {task.dueDate ? formatDate(task.dueDate) : "Flexible"}
                        </p>
                      </div>
                    ))}
                    {columnTasks.length === 0 && (
                      <p className="text-sm text-slate-400">No entries</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Quick actions
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                Capture anything fast
              </h2>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={buttonClasses({ size: "sm", variant: "secondary" })}
              >
                {link.title}
              </Link>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Upcoming
            </p>
            <div className="space-y-3">
              {events.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 text-sm dark:border-slate-800"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {event.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(event.date)} · {event.time || "All day"}
                    </p>
                  </div>
                  <Badge tone="default">Event</Badge>
                </div>
              ))}
              {events.length === 0 && (
                <p className="text-sm text-slate-400">
                  No events scheduled yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
