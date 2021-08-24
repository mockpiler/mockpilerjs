export function cacheFirst<T extends (...args: any[]) => any>(fn: T): T {
  let cachedResult: any
  let alreadyCached = false

  return ((...args: any[]) => {
    if (!alreadyCached) {
      cachedResult = fn(...args)
      alreadyCached = true
    }

    return cachedResult
  }) as T
}
