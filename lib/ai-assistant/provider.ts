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
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

/** Embedding for a single text (used by pgvector similarity search; falls back when unconfigured). */
export async function embed(text: string): Promise<number[] | null> {
  const cfg = getProviderConfig();
  if (!cfg.apiKey) return null;
  try {
    const res = await fetch(`${cfg.baseUrl}/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.apiKey}` },
      body: JSON.stringify({ model: cfg.model, input: text }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const vec = data?.data?.[0]?.embedding;
    if (!Array.isArray(vec) || !vec.length) return null;
    return vec as number[];
  } catch {
    return null;
  }
}