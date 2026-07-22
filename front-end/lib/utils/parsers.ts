export function parseSearchParams<T extends Record<string, string | string[] | undefined>>(
  searchParams: T
) {
  const params = new Map<string, string>()

  Object.entries(searchParams).forEach(([key, value]) => {
    if (!value) return
    if (Array.isArray(value)) {
      params.set(key, value[0])
      return
    }
    params.set(key, value)
  })

  return params
}
