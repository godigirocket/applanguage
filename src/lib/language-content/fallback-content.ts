import type { LessonTopic } from "./types";
import type { ConceptEntry } from "./data/types";
import { TRAVEL_VOCAB } from "./data/travel";
import { FOOD_VOCAB } from "./data/food";
import { BUSINESS_VOCAB } from "./data/business";
import { TECHNOLOGY_VOCAB } from "./data/technology";
import { HEALTH_VOCAB } from "./data/health";
import { DAILY_VOCAB } from "./data/daily";
import { SPORTS_VOCAB } from "./data/sports";
import { FITNESS_VOCAB } from "./data/fitness";
import { CULTURE_VOCAB } from "./data/culture";
import { GRAMMAR_VOCAB } from "./data/grammar";
import { PRONUNCIATION_VOCAB } from "./data/pronunciation";
import { LISTENING_VOCAB } from "./data/listening";
import { SHOPPING_VOCAB } from "./data/shopping";
import { FAMILY_VOCAB } from "./data/family";
import { WORK_VOCAB } from "./data/work";

export const CONCEPTS_BY_TOPIC: Record<LessonTopic, ConceptEntry[]> = {
  daily: DAILY_VOCAB,
  travel: TRAVEL_VOCAB,
  food: FOOD_VOCAB,
  business: BUSINESS_VOCAB,
  sports: SPORTS_VOCAB,
  fitness: FITNESS_VOCAB,
  culture: CULTURE_VOCAB,
  grammar: GRAMMAR_VOCAB,
  pronunciation: PRONUNCIATION_VOCAB,
  listening: LISTENING_VOCAB,
  shopping: SHOPPING_VOCAB,
  health: HEALTH_VOCAB,
  technology: TECHNOLOGY_VOCAB,
  family: FAMILY_VOCAB,
  work: WORK_VOCAB,
};
