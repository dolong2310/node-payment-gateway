/**
 * Gửi request POST application/x-www-form-urlencoded tới ZaloPay
 * @en Send a POST application/x-www-form-urlencoded request to ZaloPay
 */
export async function postForm<T>(url: string, body: Record<string, string | number | undefined>): Promise<T> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(body)) {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`ZaloPay request failed: HTTP ${response.status}`);
  }

  return (await response.json()) as T;
}
