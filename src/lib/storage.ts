import { isBrowser } from "./utils";

export const storage = {
  load<T>(key: string, fallback: T): T {
    if (!isBrowser) return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  save<T>(key: string, value: T) {
    if (!isBrowser) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // fail silently – localStorage may be unavailable
    }
  },
  remove(key: string) {
    if (!isBrowser) return;
    window.localStorage.removeItem(key);
  },
};

export function clearStorageKeys(keys: string[]) {
  if (!isBrowser) return;
  keys.forEach((key) => storage.remove(key));
}
