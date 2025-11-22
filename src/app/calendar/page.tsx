"use client";

import { FormEvent, useMemo, useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCalendarEvents } from "@/hooks/use-calendar";
import { CalendarEvent } from "@/lib/types";
import {
  formatDate,
  formatFullDate,
  generateId,
  todayISO,
  toISODate,
} from "@/lib/utils";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type DayCell = {
  iso: string;
  inMonth: boolean;
  label: number;
};

function buildGrid(anchor: Date): DayCell[] {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const totalCells = 42;
  const grid: DayCell[] = [];

  for (let index = 0; index < totalCells; index += 1) {
    const dayNumber = index - startOffset + 1;
    const date = new Date(year, month, dayNumber);
    grid.push({
      iso: toISODate(date),
      inMonth: date.getMonth() === month,
      label: date.getDate(),
    });
  }
  return grid;
}

export default function CalendarPage() {
  const { state: events, setState: setEvents, hydrated } = useCalendarEvents();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const grid = useMemo(() => buildGrid(currentMonth), [currentMonth]);

  const selectedEvents = events
    .filter((event) => event.date === selectedDate)
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  const addEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;

    const newEvent: CalendarEvent = {
      id: generateId(),
      title: title.trim(),
      date: selectedDate,
      time: time || undefined,
      description: notes.trim() || undefined,
    };
    setEvents([newEvent, ...events]);
    setTitle("");
    setTime("");
    setNotes("");
  };

  const removeEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  return (
    <PageShell
      title="Calendar"
      description="Map your week visually. Protect deep work and show up for the right moments."
      actions={
        <Button size="sm" variant="secondary" onClick={() => setSelectedDate(todayISO())}>
          Jump to today
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Month
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                {currentMonth.toLocaleDateString(undefined, {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={goToPreviousMonth}>
                ←
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={goToNextMonth}>
                →
              </Button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            {weekdayLabels.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-7 gap-2">
            {grid.map((day) => {
              const dayEvents = events.filter((event) => event.date === day.iso);
              const isSelected = day.iso === selectedDate;

              return (
                <button
                  type="button"
                  key={day.iso}
                  onClick={() => setSelectedDate(day.iso)}
                  className={`min-h-[92px] rounded-2xl border px-3 py-2 text-left transition ${
                    isSelected
                      ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                      : day.inMonth
                        ? "border-slate-100 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
                        : "border-transparent bg-transparent text-slate-300 dark:text-slate-600"
                  }`}
                >
                  <span className="text-sm font-semibold">{day.label}</span>
                  <div className="mt-2 space-y-1 text-xs">
                    {dayEvents.slice(0, 2).map((event) => (
                      <p key={event.id} className="truncate">
                        {event.time || "•"} {event.title}
                      </p>
                    ))}
                    {dayEvents.length > 2 && (
                      <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                        +{dayEvents.length - 2} more
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <form
            onSubmit={addEvent}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Add event
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
              {formatFullDate(selectedDate)}
            </h3>

            <div className="mt-4 space-y-3">
              <Input
                placeholder="Event title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
              <Input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
              />
              <Textarea
                placeholder="Notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>
            <Button type="submit" className="mt-4 w-full" disabled={!title.trim()}>
              Save event
            </Button>
          </form>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {selectedEvents.length} events
            </p>
            <div className="mt-4 space-y-3">
              {selectedEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-slate-100 px-4 py-3 text-sm dark:border-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {event.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(event.date)} · {event.time || "All day"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEvent(event.id)}
                      className="text-xs text-slate-400 transition hover:text-rose-500"
                    >
                      Remove
                    </button>
                  </div>
                  {event.description && (
                    <p className="mt-2 text-xs text-slate-500">{event.description}</p>
                  )}
                </div>
              ))}
              {selectedEvents.length === 0 && (
                <p className="text-sm text-slate-500">No events for this date yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {!hydrated && (
        <p className="text-sm text-slate-400">Syncing calendar with local storage…</p>
      )}
    </PageShell>
  );
}
