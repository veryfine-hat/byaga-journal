export function normalizePropertyName(propertyName:string) :string {
  return propertyName
    .replace(/[A-Z]/g, (c, idx, str) => {
      if (idx === 0) return c; // First character
      if (str[idx - 1] === '.')  return c // Next level
      if (/[A-Z]/.test(str[idx - 1])) return c // Acronyms
      if (str[idx - 1] === '_') return c; // no __

      return '_' + c
    })
    .replace(/-/g, "_")
    .toLowerCase()
}