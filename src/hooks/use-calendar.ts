"use client";

import { defaultEvents } from "@/lib/default-data";
import { CalendarEvent } from "@/lib/types";
import { usePersistentState } from "./use-persistent-state";

export const CALENDAR_STORAGE_KEY = "calendar_events_v1";

export function useCalendarEvents() {
  return usePersistentState<CalendarEvent[]>(
    CALENDAR_STORAGE_KEY,
    defaultEvents,
  );
}
