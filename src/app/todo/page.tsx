"use client";

import { FormEvent, useMemo, useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTodos } from "@/hooks/use-todos";
import { formatDate, generateId, todayISO } from "@/lib/utils";
import { TodoItem } from "@/lib/types";

type Filter = "all" | "today" | "upcoming";

export default function TodoPage() {
  const { state: todos, setState: setTodos, hydrated } = useTodos();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filteredTodos = useMemo(() => {
    return todos
      .slice()
      .sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""))
      .filter((todo) => {
        if (filter === "today") return todo.dueDate === todayISO();
        if (filter === "upcoming")
          return Boolean(todo.dueDate && todo.dueDate > todayISO());
        return true;
      });
  }, [filter, todos]);

  const addTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;

    const newTodo: TodoItem = {
      id: generateId(),
      title: title.trim(),
      dueDate: dueDate || undefined,
      notes: notes.trim() || undefined,
      completed: false,
    };
    setTodos([newTodo, ...todos]);
    setTitle("");
    setNotes("");
    setDueDate("");
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  return (
    <PageShell
      title="Todo list"
      description="Capture lighter tasks in one clean list. Stay nimble with due dates and notes."
      actions={
        <Button
          variant="ghost"
          size="sm"
          onClick={clearCompleted}
          disabled={!todos.some((todo) => todo.completed)}
        >
          Clear completed
        </Button>
      }
    >
      <form
        onSubmit={addTodo}
        className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            placeholder="What needs to happen?"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="md:col-span-2"
          />
          <Input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Textarea
            placeholder="Optional notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="md:col-span-2"
          />
          <Button type="submit" disabled={!title.trim()}>
            Add todo
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap gap-3">
        {(["all", "today", "upcoming"] as Filter[]).map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === item
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "bg-white text-slate-500 shadow-subtle dark:bg-slate-900"
            }`}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredTodos.map((todo) => (
          <article
            key={todo.id}
            className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-subtle transition hover:shadow-card dark:border-slate-800 dark:bg-slate-900"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="size-5 rounded-lg border-slate-300 text-slate-900 transition focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800"
            />
            <div className="flex-1">
              <p
                className={`text-base font-medium ${
                  todo.completed
                    ? "text-slate-400 line-through"
                    : "text-slate-900 dark:text-white"
                }`}
              >
                {todo.title}
              </p>
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
                {todo.dueDate && (
                  <span className="text-slate-500">
                    Due {formatDate(todo.dueDate)}
                  </span>
                )}
                {todo.notes && <span>{todo.notes}</span>}
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeTodo(todo.id)}
              className="text-xs text-slate-400 transition hover:text-rose-500"
            >
              Remove
            </button>
          </article>
        ))}
        {filteredTodos.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-400 dark:border-slate-700">
            Nothing in this view yet.
          </div>
        )}
      </div>
      {!hydrated && (
        <p className="text-sm text-slate-400">Loading your saved todos…</p>
      )}
    </PageShell>
  );
}
