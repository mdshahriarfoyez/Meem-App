import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * State mirrored into localStorage. Reads are lazy and defensive — a corrupt or
 * unavailable store (private mode, disabled cookies) falls back to the initial
 * value instead of crashing the app.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? initial : (JSON.parse(raw) as T);
    } catch {
      return initial;
    }
  });

  // Keep the latest value in a ref so `reset` never needs to be re-created.
  const keyRef = useRef(key);
  keyRef.current = key;

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or blocked — the app still works, just without memory.
    }
  }, [key, value]);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(keyRef.current);
    } catch {
      // ignore
    }
    setValue(initial);
    // `initial` is a literal in every call site, so this is stable in practice.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [value, setValue, reset] as const;
}
