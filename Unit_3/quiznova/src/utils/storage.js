const PREFIX = 'quiznova_';

export function getData(key, fallback = []) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setData(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
  return value;
}

export function updateData(key, updaterFn) {
  const current = getData(key, []);
  const updated = updaterFn(current);
  setData(key, updated);
  return updated;
}

export function deleteFromData(key, predicate) {
  const current = getData(key, []);
  const updated = current.filter((item) => !predicate(item));
  setData(key, updated);
  return updated;
}

export function upsertOne(key, item, idField = 'id') {
  const current = getData(key, []);
  const idx = current.findIndex((x) => x[idField] === item[idField]);
  let updated;
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = { ...updated[idx], ...item };
  } else {
    updated = [...current, item];
  }
  setData(key, updated);
  return updated;
}

export function uid(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}
