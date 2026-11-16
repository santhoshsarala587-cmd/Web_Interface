/**
 * Tiny fetch layer shared by every API module:
 *  - short-lived in-memory cache (keyed by URL)
 *  - de-duplication of identical in-flight requests
 *  - AbortSignal support so stale searches never overwrite newer ones
 *  - friendly, typed errors (network / rate-limit / http)
 */
export class ApiError extends Error {
  constructor(message, { status = 0, kind = 'http' } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.kind = kind
  }
}

const cache = new Map() // url -> { at, data }
const inflight = new Map() // url -> Promise

export function clearHttpCache() {
  cache.clear()
}

export async function getJson(url, { ttl = 0, signal, force = false } = {}) {
  const hit = cache.get(url)
  if (!force && ttl > 0 && hit && Date.now() - hit.at < ttl) {
    return { data: hit.data, fetchedAt: hit.at, fromCache: true }
  }

  // Share one network request between identical concurrent callers.
  let promise = !force && inflight.get(url)
  if (!promise) {
    promise = fetch(url)
      .then(async (res) => {
        if (res.status === 429) {
          throw new ApiError('The weather service is rate-limiting requests. Please wait a minute and try again.', { status: 429, kind: 'rate-limit' })
        }
        if (!res.ok) {
          throw new ApiError(`The data service returned an error (${res.status}).`, { status: res.status })
        }
        return res.json()
      })
      .catch((err) => {
        if (err instanceof ApiError) throw err
        throw new ApiError('Network problem — check your connection and try again.', { kind: 'network' })
      })
      .then((data) => {
        const at = Date.now()
        if (ttl > 0) cache.set(url, { at, data })
        return { data, fetchedAt: at, fromCache: false }
      })
      .finally(() => inflight.delete(url))
    inflight.set(url, promise)
  }

  if (!signal) return promise
  // Callers can abandon the result without cancelling a shared request.
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(new DOMException('Aborted', 'AbortError'))
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true })
    promise.then(resolve, reject)
  })
}

export const isAbort = (e) => e?.name === 'AbortError'
