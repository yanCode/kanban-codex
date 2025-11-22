"use client";

import { defaultKanbanTasks } from "@/lib/default-data";
import { KanbanTask } from "@/lib/types";
import { usePersistentState } from "./use-persistent-state";

export const KANBAN_STORAGE_KEY = "kanban_board_v1";

export function useKanbanTasks() {
  return usePersistentState<KanbanTask[]>(KANBAN_STORAGE_KEY, defaultKanbanTasks);
}
