import { useState, useEffect, useCallback } from 'react'

export function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

/** useState persisted to localStorage; tolerates blocked/full storage. */
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => readJson(key, initial))
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage unavailable */ }
  }, [key, value])
  const reset = useCallback(() => setValue(initial), [initial])
  return [value, setValue, reset]
}
