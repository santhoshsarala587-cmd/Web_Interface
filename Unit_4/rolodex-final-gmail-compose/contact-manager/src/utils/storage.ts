const KEY = "contact-manager.contacts.v1";

export const storage = {
  available(): boolean {
    return typeof window !== "undefined" && !!window.localStorage;
  },
  read<T>(fallback: T): T {
    if (!storage.available()) return fallback;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as T) : fallback;
    } catch {
      return fallback;
    }
  },
  write(value: unknown) {
    if (!storage.available()) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(value));
    } catch {
      /* quota or private mode — ignore */
    }
  },
  hasData(): boolean {
    if (!storage.available()) return false;
    return window.localStorage.getItem(KEY) !== null;
  },
  clear() {
    if (!storage.available()) return;
    window.localStorage.removeItem(KEY);
  },
};

export const STORAGE_KEY = KEY;
