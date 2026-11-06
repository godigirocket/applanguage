export function parseCourse(value: unknown): "en" | "es" | "pt" | undefined {
  return value === "en" || value === "es" || value === "pt" ? value : undefined;
}

export function courseEntrySearch(search: Record<string, unknown>): { course?: "en" | "es" | "pt" } {
  return { course: parseCourse(search.course) };
}
