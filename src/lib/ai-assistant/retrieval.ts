import fs from "fs";
import path from "path";
import { legalSources } from "@/data/legal-sources";

export interface RetrievedChunk {
  slug: string;
  title: string;
  excerpt: string;
  score: number;
}

function tokenize(s: string): string[] {
  return s.toLowerCase().split(/[^a-z\u0600-\u06ff]+/).filter((t) => t.length > 2);
}

export function retrieve(question: string, topK = 5): RetrievedChunk[] {
  const qTokens = new Set(tokenize(question));
  const results: RetrievedChunk[] = [];
  for (const src of legalSources) {
    const filePath = path.join(process.cwd(), "public", src.file.replace(/^\//, ""));
    let text = "";
    try { text = fs.readFileSync(filePath, "utf8"); } catch { continue; }
    // chunk by paragraphs
    const chunks = text.split(/\n{2,}/).map((c) => c.trim()).filter((c) => c.length > 40);
    for (const chunk of chunks) {
      const cTokens = tokenize(chunk);
      let score = 0;
      for (const t of cTokens) if (qTokens.has(t)) score++;
      if (score > 0) {
        results.push({ slug: src.slug, title: src.title, excerpt: chunk.slice(0, 600), score });
      }
    }
  }
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topK);
}