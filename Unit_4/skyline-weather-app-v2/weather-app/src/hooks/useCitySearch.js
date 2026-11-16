import { useEffect, useState } from 'react'
import { searchCities } from '../api/openMeteo.js'
import { isAbort } from '../api/http.js'
import { useDebounce } from './useDebounce.js'

/** Debounced autocomplete. Each keystroke aborts the previous request so stale results never win. */
export function useCitySearch(query) {
  const q = query.trim()
  const debounced = useDebounce(q, 300)
  const [state, setState] = useState({ results: [], status: 'idle', error: null })

  useEffect(() => {
    if (debounced.length < 2) { setState({ results: [], status: 'idle', error: null }); return }
    const ctrl = new AbortController()
    setState((s) => ({ ...s, status: 'loading', error: null }))
    searchCities(debounced, { signal: ctrl.signal })
      .then((results) => setState({ results, status: results.length ? 'ready' : 'empty', error: null }))
      .catch((e) => { if (!isAbort(e)) setState({ results: [], status: 'error', error: e.message }) })
    return () => ctrl.abort()
  }, [debounced])

  // While the user is still typing, don't show results for an older query as if they matched.
  const typing = q.length >= 2 && q !== debounced
  return { ...state, status: typing && state.status !== 'loading' ? 'loading' : state.status }
}
