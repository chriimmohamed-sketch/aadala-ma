import index from "@/data/legal-index.json";
import { legalSources } from "@/data/legal-sources";

export interface Flashcard {
  id: string;
  sourceSlug: string;
  sourceTitle: string;
  location?: string;
  front: string;
  back: string;
}

export interface QuizQuestion {
  id: string;
  cardId: string;
  excerpt: string;
  options: string[];
  correctIndex: number;
}

type Raw = { s: string; x: string; l?: string };

/** Deterministic shuffle (LCG) — stable across runs/tests. */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  let s = seed >>> 0 || 1;
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) % 4294967296;
    const j = Math.floor((s / 4294967296) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Build flashcards from existing excerpts only (no invented law).
 * Picks up to `perSource` excerpts per source, skipping very short ones.
 */
export function buildFlashcards(perSource = 2, max = 12): Flashcard[] {
  const titles = new Map(legalSources.map((s) => [s.slug, s.title]));
  const bySlug = new Map<string, Raw[]>();
  for (const c of index as Raw[]) {
    if (!c.x || c.x.trim().length < 120) continue;
    const list = bySlug.get(c.s) ?? [];
    list.push(c);
    bySlug.set(c.s, list);
  }
  const cards: Flashcard[] = [];
  const slugs = [...bySlug.keys()].sort();
  for (const slug of slugs) {
    const list = bySlug.get(slug)!;
    const step = Math.max(1, Math.floor(list.length / perSource) || 1);
    for (let i = 0; i < perSource && cards.length < max; i++) {
      const c = list[(i * step) % list.length];
      cards.push({
        id: `${slug}-${i}-${c.l ?? cards.length}`,
        sourceSlug: slug,
        sourceTitle: titles.get(slug) ?? slug,
        location: c.l,
        front: `ما المصدر؟${c.l ? ` — ${c.l}` : ""}`,
        back: c.x.slice(0, 600),
      });
    }
    if (cards.length >= max) break;
  }
  return cards.slice(0, max);
}

/** Source-attribution MCQ: «من أين هذا المقطع؟» — always answerable from the cards. */
export function buildQuiz(cards: Flashcard[], count = 5, seed = 42): QuizQuestion[] {
  const titles = [...new Set(cards.map((c) => c.sourceTitle))];
  const chosen = seededShuffle(cards, seed).slice(0, count);
  return chosen.map((card, qi) => {
    const distractors = titles.filter((t) => t !== card.sourceTitle);
    const picks = seededShuffle(distractors, seed + qi + 1).slice(0, 3);
    const options = seededShuffle([card.sourceTitle, ...picks], seed + qi + 100);
    return {
      id: `q${qi}-${card.id}`,
      cardId: card.id,
      excerpt: card.back.slice(0, 240),
      options,
      correctIndex: options.indexOf(card.sourceTitle),
    };
  });
}
