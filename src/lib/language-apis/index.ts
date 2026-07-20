export { fetchDictionaryEntry, type DictionaryResult } from "./dictionaryApi";
export { getSynonyms, getAntonyms, getMeansLike, getWordsForTopic, type RelatedWord } from "./datamuseApi";
export { fetchTatoebaSentences, type TatoebaSentence } from "./tatoebaApi";
export { translateText } from "./libreTranslateApi";
export { checkGrammar, type GrammarSuggestion } from "./languageToolApi";
export { isTTSSupported, speak, stopSpeaking, isSTTSupported, listenOnce } from "./webSpeech";
