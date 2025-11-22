"use client";

import { FormEvent, useMemo, useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useKanbanTasks } from "@/hooks/use-kanban";
import { kanbanColumns } from "@/lib/default-data";
import { cn, generateId, formatDate } from "@/lib/utils";
import { KanbanTask } from "@/lib/types";

const priorities: KanbanTask["priority"][] = ["low", "medium", "high"];

export default function KanbanPage() {
  const { state: tasks, setState: setTasks, hydrated } = useKanbanTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<KanbanTask["priority"]>("medium");
  const [dueDate, setDueDate] = useState("");
  const [targetColumn, setTargetColumn] = useState<KanbanTask["status"]>(
    kanbanColumns[1].id,
  );
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<KanbanTask["status"] | null>(
    null,
  );

  const grouped = useMemo(() => {
    const map = new Map<string, KanbanTask[]>();
    kanbanColumns.forEach((column) => map.set(column.id, []));
    tasks.forEach((task) => {
      const list = map.get(task.status);
      if (list) list.push(task);
    });
    return map;
  }, [tasks]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;

    const newTask: KanbanTask = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      status: targetColumn,
      priority,
      dueDate: dueDate || undefined,
    };
    setTasks((prev) => [newTask, ...prev]);
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
  };

  const moveTask = (id: string, status: KanbanTask["status"]) => {
    setTasks((prev) => {
      const task = prev.find((item) => item.id === id);
      if (!task) return prev;

      if (task.status === status) return prev;

      const updatedTask = { ...task, status };
      const targetTasks: KanbanTask[] = [];
      const remaining: KanbanTask[] = [];

      prev.forEach((item) => {
        if (item.id === id) return;
        if (item.status === status) {
          targetTasks.push(item);
        } else {
          remaining.push(item);
        }
      });

      return [updatedTask, ...targetTasks, ...remaining];
    });
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <PageShell
      title="Kanban board"
      description="Track progress by swimlane. Keep everything moving with light structure."
      actions={
        <Button variant="secondary" size="sm" onClick={() => setTargetColumn("backlog")}>
          Add to backlog
        </Button>
      }
    >
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="grid gap-4 md:grid-cols-4">
          <Input
            placeholder="Task title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="md:col-span-2"
          />
          <select
            value={targetColumn}
            onChange={(event) => setTargetColumn(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-600 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {kanbanColumns.map((column) => (
              <option key={column.id} value={column.id}>
                {column.title}
              </option>
            ))}
          </select>
          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as KanbanTask["priority"])
            }
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-600 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {priorities.map((item) => (
              <option key={item} value={item}>
                Priority: {item}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Textarea
            placeholder="Quick context (optional)"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="md:col-span-2"
          />
          <Input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit" disabled={!title.trim()}>
            Capture task
          </Button>
        </div>
      </form>

      <div className="soft-scrollbar flex gap-4 overflow-x-auto pb-3 pt-2">
        {kanbanColumns.map((column) => {
          const items = grouped.get(column.id) ?? [];
          const isActiveColumn = !!draggingId && hoveredColumn === column.id;
          return (
            <div
              key={column.id}
              onDragOver={(event) => {
                event.preventDefault();
                setHoveredColumn(column.id);
              }}
              onDragLeave={() => setHoveredColumn(null)}
              onDrop={() => {
                if (draggingId) moveTask(draggingId, column.id as KanbanTask["status"]);
                setHoveredColumn(null);
                setDraggingId(null);
              }}
              className={cn(
                "flex w-72 flex-shrink-0 flex-col rounded-3xl border p-4 shadow-subtle backdrop-blur transition",
                "border-slate-100 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70",
                isActiveColumn &&
                  "border-brand-200 bg-white/70 shadow-xl ring-1 ring-brand-200/60 backdrop-blur-md dark:border-brand-300/40",
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {column.title}
                  </p>
                  <span className="text-xs text-slate-500">{items.length} items</span>
                </div>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: column.accent }}
                />
              </div>

              <div className="mt-4 flex-1 space-y-3">
                {items.map((task) => (
                  <article
                    key={task.id}
                    draggable
                    onDragStart={() => setDraggingId(task.id)}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setHoveredColumn(null);
                    }}
              className={cn(
                      "rounded-2xl border border-transparent bg-white p-4 shadow-card transition duration-300",
                      "hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900",
                      draggingId === task.id &&
                        "-rotate-2 scale-[1.02] shadow-2xl ring-2 ring-brand-200/80 backdrop-blur-sm",
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="mt-1 text-sm text-slate-500">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTask(task.id)}
                        className="text-xs text-slate-400 transition hover:text-rose-500"
                      >
                        Close
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge tone={task.priority === "high" ? "warning" : "default"}>
                        {task.priority} priority
                      </Badge>
                      {task.dueDate && (
                        <Badge tone="default">Due {formatDate(task.dueDate)}</Badge>
                      )}
                    </div>
                    <div className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-400">
                      Drag to move
                    </div>
                  </article>
                ))}
                {items.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-400 dark:border-slate-700">
                    Nothing here yet.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!hydrated && (
        <p className="text-sm text-slate-400">Syncing data with local storage…</p>
      )}
    </PageShell>
  );
}
