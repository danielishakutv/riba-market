import { useState, useCallback, useEffect } from "react";

/**
 * Offline-first localStorage cache hook.
 * Data persists across sessions and works without network.
 */
export function useLocalCache<T>(key: string, initialValue: T) {
  const [data, setData] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn("Failed to save to localStorage:", e);
    }
  }, [key, data]);

  const update = useCallback((updater: T | ((prev: T) => T)) => {
    setData(updater);
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(key);
    setData(initialValue);
  }, [key, initialValue]);

  return { data, update, clear } as const;
}
