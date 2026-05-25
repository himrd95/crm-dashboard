const cache = new Map<string, unknown>();

async function fetchJson<T>(url: string): Promise<T> {
  if (cache.has(url)) {
    return cache.get(url) as T;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }

  const data = (await response.json()) as T;
  cache.set(url, data);
  return data;
}

export function clearApiCache(): void {
  cache.clear();
}

export { fetchJson };
