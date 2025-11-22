import { CalendarEvent, KanbanColumn, KanbanTask, TodoItem } from "./types";
import { todayISO } from "./utils";

export const kanbanColumns: KanbanColumn[] = [
  { id: "backlog", title: "Backlog", accent: "#c7d2fe" },
  { id: "todo", title: "To Do", accent: "#fde68a" },
  { id: "progress", title: "In Progress", accent: "#bae6fd" },
  { id: "review", title: "Review", accent: "#fecdd3" },
  { id: "done", title: "Done", accent: "#bbf7d0" },
];

export const defaultKanbanTasks: KanbanTask[] = [
  {
    id: "task-1",
    title: "Wireframe dashboard widgets",
    description: "Sketch quick variations for overview cards",
    status: "progress",
    priority: "medium",
    dueDate: todayISO(),
    tags: ["Design"],
  },
  {
    id: "task-2",
    title: "Integrate calendar view",
    description: "Sync events list to grid component",
    status: "todo",
    priority: "high",
    dueDate: todayISO(),
    tags: ["Product"],
  },
  {
    id: "task-3",
    title: "QA checklist",
    description: "Define manual smoke test for launch",
    status: "backlog",
    priority: "low",
    tags: ["Ops"],
  },
  {
    id: "task-4",
    title: "Prepare launch comms",
    description: "Outline email + social copy drafts",
    status: "review",
    priority: "medium",
    dueDate: todayISO(),
    tags: ["Marketing"],
  },
];

export const defaultTodos: TodoItem[] = [
  {
    id: "todo-1",
    title: "Inbox zero",
    completed: false,
    notes: "Schedule 30 minute block",
  },
  {
    id: "todo-2",
    title: "Plan next sprint",
    completed: true,
    dueDate: todayISO(),
  },
];

export const defaultEvents: CalendarEvent[] = [
  {
    id: "event-1",
    title: "Planning standup",
    date: todayISO(),
    time: "09:30",
    description: "Quick sync with product + design",
  },
  {
    id: "event-2",
    title: "Research interviews",
    date: todayISO(),
    time: "14:00",
    description: "Round two of discovery calls",
  },
];
