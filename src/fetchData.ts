export function fetchData(
  url: string,
  options: RequestInit = {}
): Promise<Object> {
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      ...options.headers
    }
  }).then(response => response.json());
}
