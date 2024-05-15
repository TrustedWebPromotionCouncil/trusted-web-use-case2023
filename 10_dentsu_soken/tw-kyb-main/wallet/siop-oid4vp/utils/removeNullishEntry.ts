const removeNullishEntry = (obj: unknown): unknown => {
  if (!obj) {
    return obj;
  }

  const entries = Object.entries(obj).filter(([_, v]) => v != null);
  const entries2 = entries.map(([k, v]) => {
    const value =
      typeof v === 'object' && !Array.isArray(v) ? removeNullishEntry(v) : v;

    return [k, value];
  });

  return Object.fromEntries(entries2);
};

export default removeNullishEntry;
