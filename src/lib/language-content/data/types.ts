import type { Difficulty } from "../types";

export interface ConceptTerm {
  term: string;
  example: string;
  partOfSpeech?: string;
}

export interface ConceptEntry {
  concept: string;
  en: ConceptTerm;
  es: ConceptTerm;
  pt: ConceptTerm;
  difficulty: Difficulty;
}
