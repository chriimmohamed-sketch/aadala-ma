export interface ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export function getProviderConfig(): ProviderConfig {
  return {
    apiKey: process.env.AI_PROVIDER_API_KEY,
    baseUrl: process.env.AI_PROVIDER_BASE_URL || "https://api.openai.com/v1",
    model: process.env.AI_PROVIDER_MODEL || "gpt-4o-mini",
  };
}

export async function callProvider(prompt: string): Promise<string | null> {
  const cfg = getProviderConfig();
  if (!cfg.apiKey) return null;
  try {
    const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.apiKey}` },
      body: JSON.stringify({
        model: cfg.model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}