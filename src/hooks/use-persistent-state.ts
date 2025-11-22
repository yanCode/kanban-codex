"use client";

import { startTransition, useEffect, useState } from "react";
import { storage } from "@/lib/storage";

export function usePersistentState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = storage.load<T>(key, initialValue);
    startTransition(() => {
      setState(stored);
      setHydrated(true);
    });
  }, [initialValue, key]);

  useEffect(() => {
    if (!hydrated) return;
    storage.save<T>(key, state);
  }, [hydrated, key, state]);

  return { state, setState, hydrated };
}
