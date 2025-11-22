"use client";

import { defaultTodos } from "@/lib/default-data";
import { TodoItem } from "@/lib/types";
import { usePersistentState } from "./use-persistent-state";

export const TODO_STORAGE_KEY = "todos_v1";

export function useTodos() {
  return usePersistentState<TodoItem[]>(TODO_STORAGE_KEY, defaultTodos);
}
