export type KanbanColumn = {
  id: string;
  title: string;
  accent: string;
};

export type KanbanTask = {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  tags?: string[];
};

export type TodoItem = {
  id: string;
  title: string;
  dueDate?: string;
  completed: boolean;
  notes?: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: string; // ISO date string (yyyy-mm-dd)
  time?: string; // HH:mm
  description?: string;
};

export type AppTheme = "light" | "dark";
