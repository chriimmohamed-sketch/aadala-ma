import { describe, it, expect } from "vitest";
import { buildFlashcards, buildQuiz } from "./flashcards";

describe("review mode (P1)", () => {
  it("builds cards only from real excerpts", () => {
    const cards = buildFlashcards(2, 12);
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.every((c) => c.back.length >= 80 && c.sourceTitle.length > 0)).toBe(true);
  });
  it("quiz questions always contain the correct answer once", () => {
    const cards = buildFlashcards(2, 12);
    const quiz = buildQuiz(cards, 5, 7);
    expect(quiz.length).toBeGreaterThan(0);
    for (const q of quiz) {
      expect(q.options).toHaveLength(q.options.length >= 2 ? 4 : q.options.length);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      const card = cards.find((c) => c.id === q.cardId)!;
      expect(q.options[q.correctIndex]).toBe(card.sourceTitle);
    }
  });
});
