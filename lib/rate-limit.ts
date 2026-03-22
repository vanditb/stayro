const requestMap = new Map<string, { count: number; resetAt: number }>();

export function limitByKey(key: string, max = 10, windowMs = 60_000) {
  const now = Date.now();
  const current = requestMap.get(key);

  if (!current || current.resetAt < now) {
    requestMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= max) {
    return false;
  }

  current.count += 1;
  requestMap.set(key, current);
  return true;
}
