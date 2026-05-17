export interface DailyWord {
  word: string;
  type: string;
  meaning: string;
  example: string;
}

export const DAILY_WORDS_EN: DailyWord[] = [
  { word: "Serendipity", type: "noun", meaning: "Finding something good without looking for it", example: "Moving to that city was pure serendipity." },
  { word: "Loquacious", type: "adj", meaning: "Tending to talk a great deal", example: "My loquacious neighbor talks for hours." },
  { word: "Ephemeral", type: "adj", meaning: "Lasting for a very short time", example: "Fame can be ephemeral." },
  { word: "Resilience", type: "noun", meaning: "The ability to recover quickly from difficulties", example: "She showed incredible resilience." },
  { word: "Melancholy", type: "noun/adj", meaning: "A feeling of pensive sadness", example: "There was a melancholy in his eyes." },
  { word: "Wanderlust", type: "noun", meaning: "A strong desire to travel", example: "Her wanderlust took her around the world." },
  { word: "Eloquent", type: "adj", meaning: "Fluent or persuasive in speaking", example: "She gave an eloquent speech." },
  { word: "Whimsical", type: "adj", meaning: "Playfully quaint or fanciful", example: "The café had a whimsical decor." },
  { word: "Ubiquitous", type: "adj", meaning: "Present, appearing, or found everywhere", example: "Smartphones are ubiquitous these days." },
  { word: "Quintessential", type: "adj", meaning: "Representing the most perfect example", example: "She's the quintessential leader." },
  { word: "Nostalgia", type: "noun", meaning: "A sentimental longing for the past", example: "Old photos filled her with nostalgia." },
  { word: "Pragmatic", type: "adj", meaning: "Dealing with things realistically", example: "He took a pragmatic approach to solving the problem." },
  { word: "Empathy", type: "noun", meaning: "The ability to understand another's feelings", example: "Good leaders have deep empathy." },
  { word: "Serene", type: "adj", meaning: "Calm, peaceful, and untroubled", example: "The lake was serene at dawn." },
  { word: "Ambiguous", type: "adj", meaning: "Open to more than one interpretation", example: "His reply was ambiguous." },
  { word: "Tenacious", type: "adj", meaning: "Holding firmly to something", example: "She's tenacious in pursuing her goals." },
  { word: "Nuance", type: "noun", meaning: "A subtle difference in meaning", example: "He appreciated the nuance in her argument." },
  { word: "Vivacious", type: "adj", meaning: "Attractively lively and animated", example: "She has a vivacious personality." },
  { word: "Candid", type: "adj", meaning: "Truthful and straightforward", example: "I appreciate your candid feedback." },
  { word: "Benevolent", type: "adj", meaning: "Well-meaning and kindly", example: "The benevolent teacher helped every student." },
  { word: "Inevitable", type: "adj", meaning: "Certain to happen; unavoidable", example: "Change is inevitable." },
  { word: "Gratitude", type: "noun", meaning: "The quality of being thankful", example: "She expressed her gratitude with tears." },
  { word: "Integrity", type: "noun", meaning: "The quality of being honest and moral", example: "He's a man of great integrity." },
  { word: "Subtle", type: "adj", meaning: "Fine or delicate to a degree hard to notice", example: "There was a subtle hint of cinnamon." },
  { word: "Paradigm", type: "noun", meaning: "A typical example or pattern", example: "This shifts the paradigm of education." },
  { word: "Gregarious", type: "adj", meaning: "Fond of company; sociable", example: "He's gregarious and makes friends easily." },
  { word: "Audacious", type: "adj", meaning: "Showing willingness to take bold risks", example: "Her audacious plan worked perfectly." },
  { word: "Flourish", type: "verb", meaning: "To grow or develop successfully", example: "The business began to flourish." },
  { word: "Catalyst", type: "noun", meaning: "Something that triggers change", example: "The meeting was a catalyst for reform." },
  { word: "Pristine", type: "adj", meaning: "In its original condition; unspoiled", example: "The beach was pristine and untouched." },
];

export const DAILY_WORDS_PT: DailyWord[] = [
  { word: "Saudade", type: "substantivo", meaning: "Nostalgia profunda por algo ou alguém amado", example: "Sinto saudade do Brasil." },
  { word: "Desenrascanço", type: "substantivo", meaning: "Arte de resolver problemas criativamente", example: "Foi puro desenrascanço." },
  { word: "Madrugada", type: "substantivo", meaning: "Early hours of the morning (midnight–dawn)", example: "Chegou de madrugada." },
  { word: "Cafuné", type: "substantivo", meaning: "Carinho nos cabelos de alguém", example: "Ela adorava fazer cafuné." },
  { word: "Gambiarra", type: "substantivo", meaning: "Solução improvisada e criativa", example: "Fiz uma gambiarra pra consertar." },
  { word: "Malandro", type: "substantivo/adj", meaning: "Pessoa esperta e astuta", example: "Ele é um malandro, sempre escapa." },
  { word: "Gingado", type: "substantivo", meaning: "Movimento ritmado do corpo", example: "Ela tem um gingado lindo ao dançar." },
  { word: "Xodó", type: "substantivo", meaning: "Pessoa querida, favorita", example: "Meu xodó, fico feliz em te ver." },
  { word: "Dengo", type: "substantivo", meaning: "Carinho, manha, meiguice", example: "Ela veio cheia de dengo." },
  { word: "Sacanagem", type: "substantivo", meaning: "Ato de má-fé ou brincadeira pesada", example: "Isso foi sacanagem!" },
  { word: "Perrengue", type: "substantivo", meaning: "Situação difícil ou complicada", example: "Passei um perrengue na viagem." },
  { word: "Buteco", type: "substantivo", meaning: "Bar simples e acolhedor", example: "Vamos tomar uma no buteco." },
  { word: "Moleque", type: "substantivo", meaning: "Garoto, menino (às vezes travesso)", example: "Aquele moleque é muito esperto." },
  { word: "Rolê", type: "substantivo", meaning: "Passeio, saída com amigos", example: "Vamos dar um rolê no sábado?" },
  { word: "Puxadinho", type: "substantivo", meaning: "Extensão improvisada de uma construção", example: "Fizeram um puxadinho na casa." },
  { word: "Jeitinho", type: "substantivo", meaning: "Maneira criativa de resolver algo", example: "Sempre dá um jeitinho." },
  { word: "Frescura", type: "substantivo", meaning: "Atitude exagerada ou mimada", example: "Deixa de frescura!" },
  { word: "Bacana", type: "adj", meaning: "Legal, interessante, agradável", example: "Que lugar bacana!" },
  { word: "Marra", type: "substantivo", meaning: "Atitude de valentia ou ousadia", example: "Ele chegou com muita marra." },
  { word: "Trampo", type: "substantivo", meaning: "Trabalho (gíria)", example: "Tenho que ir pro trampo." },
  { word: "Responsa", type: "substantivo", meaning: "Responsabilidade (abreviado)", example: "Isso é responsa sua." },
  { word: "Corujão", type: "substantivo", meaning: "Sessão de cinema de madrugada", example: "Vamos ao corujão?" },
  { word: "Paia", type: "adj", meaning: "Ruim, sem graça", example: "A festa tava paia." },
  { word: "Sossego", type: "substantivo", meaning: "Tranquilidade, paz", example: "Preciso de sossego." },
  { word: "Firme", type: "adj", meaning: "Seguro, forte, confiável", example: "Fica firme, vai dar certo." },
  { word: "Arretado", type: "adj", meaning: "Muito bom, incrível (nordeste)", example: "Esse show foi arretado!" },
  { word: "Vacilar", type: "verbo", meaning: "Errar, falhar, titubear", example: "Não vacila comigo não." },
  { word: "Embaçar", type: "verbo", meaning: "Causar problema ou confusão", example: "Ele ficou embaçando a gente." },
  { word: "Zoeira", type: "substantivo", meaning: "Bagunça, brincadeira", example: "Foi só zoeira!" },
  { word: "Pega leve", type: "expressão", meaning: "Tenha calma, não exagere", example: "Pega leve aí, mano." },
];

export function getDailyWord(language: 'en' | 'pt'): DailyWord {
  const words = language === 'pt' ? DAILY_WORDS_PT : DAILY_WORDS_EN;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return words[dayOfYear % words.length];
}
