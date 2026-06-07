export function filterMatches(values: string[], filter: string[]) {
  if (values.length === 0) return true;
  for (let i = 0; i < filter.length; i++) {
    const f = filter[i];
    const v = values[i];
    if (!v || !f) continue;
    if (v.toLowerCase().includes(f)) continue;
    return false;
  }
  return true;
}

export function hasFilter(filter: string[]) {
  for (const f of filter) {
    if (f.trim() !== '') return true;
  }
  return false;
}
