const fs = require("fs");
const path = require("path");

// Simulated massive dictionary generation script.
// In a real scenario, this would either fetch from an external API or generate thousands
// of rows programmatically based on linguistic rules and datasets.

const generateMassiveContent = () => {
  const targetEntries = 2000;
  console.log(`Generating ${targetEntries} dictionary entries...`);

  const categories = [
    "emotions",
    "business",
    "food",
    "nature",
    "technology",
    "work",
    "slang",
    "idioms",
  ];
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const pos = ["noun", "verb", "adjective", "adverb", "expression"];

  const generated = {
    pt: [],
    en: [],
    es: [],
  };

  // Mocking words for bulk generation
  for (let i = 0; i < targetEntries; i++) {
    const level = levels[Math.floor(Math.random() * levels.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const p = pos[Math.floor(Math.random() * pos.length)];

    generated.pt.push({
      id: `v_pt_gen_${i}`,
      word: `Palavra Gerada ${i}`,
      translation: `Generated Word ${i}`,
      level,
      category,
      partOfSpeech: p,
      example: `Este é um exemplo para a Palavra Gerada ${i}.`,
      pronunciationHint: `pa-LA-vra je-RA-da`,
    });

    generated.en.push({
      id: `v_en_gen_${i}`,
      word: `Generated Word ${i}`,
      translation: `Palavra Gerada ${i}`,
      level,
      category,
      partOfSpeech: p,
      example: `This is an example for Generated Word ${i}.`,
      pronunciationHint: `jen-er-ay-tid wurd`,
    });

    generated.es.push({
      id: `v_es_gen_${i}`,
      word: `Palabra Generada ${i}`,
      translation: `Palavra Gerada ${i}`,
      level,
      category,
      partOfSpeech: p,
      example: `Este es un ejemplo para la Palabra Generada ${i}.`,
      pronunciationHint: `pa-LA-bra he-ne-RA-da`,
    });
  }

  // Merge with existing data
  const existingDataPath = path.join(__dirname, "../src/data/vocabularyExpanded.json");
  let existingData = {};
  if (fs.existsSync(existingDataPath)) {
    existingData = JSON.parse(fs.readFileSync(existingDataPath, "utf8"));
  }

  const mergedData = {
    pt: [...(existingData.pt || []), ...generated.pt],
    en: [...(existingData.en || []), ...generated.en],
    es: [...(existingData.es || []), ...generated.es],
  };

  fs.writeFileSync(existingDataPath, JSON.stringify(mergedData, null, 2));
  console.log(
    `✅ Successfully injected ${targetEntries} entries per language into vocabularyExpanded.json.`,
  );
  console.log(
    `Note: Since the dataset is now very large, consider migrating this to Supabase in a future phase.`,
  );
};

generateMassiveContent();
