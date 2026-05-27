import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target paths
const vocabPath = path.join(__dirname, '../src/data/vocabularyExpanded.json');
const grammarPath = path.join(__dirname, '../src/data/grammarExpanded.json');
const idiomsPath = path.join(__dirname, '../src/data/idiomsExpanded.json');
const outputPath = path.join(__dirname, '../src/data/masterContent.json');

// Read files
const vocabulary = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
const grammar = JSON.parse(fs.readFileSync(grammarPath, 'utf8'));
const idioms = JSON.parse(fs.readFileSync(idiomsPath, 'utf8'));

// Helper to shuffle list (using stable LCG pseudo-random for determinism)
function lcg(seed) {
  let s = seed;
  return function() {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const THEMATIC_TOPICS = {
  en: [
    { title: "At the Airport", category: "travel", sentences: [
      { target: "Where is the passport control?", native: "Onde fica o controle de passaportes?" },
      { target: "I have a boarding pass.", native: "Eu tenho um cartão de embarque." },
      { target: "My flight is delayed.", native: "Meu voo está atrasado." },
      { target: "Where is my baggage?", native: "Onde está minha bagagem?" }
    ]},
    { title: "Ordering Coffee", category: "food", sentences: [
      { target: "Can I get a hot coffee, please?", native: "Posso pegar um café quente, por favor?" },
      { target: "I would like a slice of cake.", native: "Eu gostaria de uma fatia de bolo." },
      { target: "Do you have oat milk?", native: "Você tem leite de aveia?" },
      { target: "Keep the change.", native: "Fique com o troco." }
    ]},
    { title: "Job Interview Prep", category: "work", sentences: [
      { target: "Tell me about your experience.", native: "Fale-me sobre sua experiência." },
      { target: "I work well in a team.", native: "Eu trabalho bem em equipe." },
      { target: "What are your salary expectations?", native: "Quais são suas expectativas salariais?" },
      { target: "Thank you for the opportunity.", native: "Obrigado pela oportunidade." }
    ]},
    { title: "Digital Communication", category: "technology", sentences: [
      { target: "I will send you an email.", native: "Eu vou te enviar um e-mail." },
      { target: "Can you share the file with me?", native: "Você pode compartilhar o arquivo comigo?" },
      { target: "The internet connection is unstable.", native: "A conexão de internet está instável." },
      { target: "Let's join the call.", native: "Vamos entrar na chamada." }
    ]},
    { title: "Feelings & Health", category: "emotions", sentences: [
      { target: "I am feeling a bit tired today.", native: "Estou me sentindo um pouco cansado hoje." },
      { target: "I need to drink more water.", native: "Eu preciso beber mais água." },
      { target: "Are you feeling okay?", native: "Você está se sentindo bem?" },
      { target: "Take a deep breath.", native: "Respire fundo." }
    ]}
  ],
  es: [
    { title: "En el Aeropuerto", category: "travel", sentences: [
      { target: "¿Dónde está el control de pasaportes?", native: "Onde fica o controle de passaportes?" },
      { target: "Tengo mi tarjeta de embarque.", native: "Tenho meu cartão de embarque." },
      { target: "Mi vuelo está retrasado.", native: "Meu voo está atrasado." },
      { target: "¿Dónde puedo recoger mi equipaje?", native: "Onde posso retirar minha bagagem?" }
    ]},
    { title: "Pidiendo un Café", category: "food", sentences: [
      { target: "¿Puedo tomar un café caliente, por favor?", native: "Posso pegar um café quente, por favor?" },
      { target: "Me gustaría una porción de pastel.", native: "Eu gostaria de uma fatia de bolo." },
      { target: "¿Tienen leche de avena?", native: "Vocês têm leite de aveia?" },
      { target: "Quédate con el cambio.", native: "Fique com o troco." }
    ]},
    { title: "Entrevista de Trabajo", category: "work", sentences: [
      { target: "Hábleme de su experiencia laboral.", native: "Fale-me sobre sua experiência de trabalho." },
      { target: "Trabajo muy bien en equipo.", native: "Trabalho muito bem em equipe." },
      { target: "¿Cuáles son sus expectativas salariales?", native: "Quais são suas expectativas salariais?" },
      { target: "Muchas gracias por la oportunidad.", native: "Muito obrigado pela oportunidade." }
    ]},
    { title: "Vida Digital", category: "technology", sentences: [
      { target: "Te enviaré un correo electrónico.", native: "Vou te enviar um e-mail." },
      { target: "¿Puedes compartir el archivo conmigo?", native: "Pode compartilhar o arquivo comigo?" },
      { target: "La conexión a internet es inestable.", native: "A conexão com a internet está instável." },
      { target: "Unámonos a la llamada.", native: "Vamos entrar na chamada." }
    ]},
    { title: "Salud y Sentimientos", category: "emotions", sentences: [
      { target: "Me siento un poco cansado hoy.", native: "Estou me sentindo um pouco cansado hoje." },
      { target: "Necesito tomar más agua.", native: "Preciso beber mais água." },
      { target: "¿Te sientes bien?", native: "Você está se sentindo bem?" },
      { target: "Respira hondo y relájate.", native: "Respire fundo e relaxe." }
    ]}
  ],
  pt: [
    { title: "No Aeroporto", category: "travel", sentences: [
      { target: "Onde fica o controle de passaportes?", native: "Where is the passport control?" },
      { target: "Eu tenho o meu cartão de embarque.", native: "I have my boarding pass." },
      { target: "O meu voo está atrasado.", native: "My flight is delayed." },
      { target: "Onde posso recolher a bagagem?", native: "Where can I collect the baggage?" }
    ]},
    { title: "Pedindo um Café", category: "food", sentences: [
      { target: "Posso pedir um café quente, por favor?", native: "Can I order a hot coffee, please?" },
      { target: "Eu gostaria de uma fatia de bolo.", native: "I would like a slice of cake." },
      { target: "Vocês têm leite de aveia?", native: "Do you have oat milk?" },
      { target: "Pode ficar com o troco.", native: "You can keep the change." }
    ]},
    { title: "Entrevista de Emprego", category: "work", sentences: [
      { target: "Fale-me sobre a sua experiência de trabalho.", native: "Tell me about your work experience." },
      { target: "Eu trabalho muito bem em equipa.", native: "I work very well in a team." },
      { target: "Quais são as suas expectativas salariais?", native: "What are your salary expectations?" },
      { target: "Muito obrigado pela oportunidade.", native: "Thank you very much for the opportunity." }
    ]},
    { title: "Comunicação Digital", category: "technology", sentences: [
      { target: "Vou enviar-lhe um e-mail.", native: "I will send you an email." },
      { target: "Pode partilhar o ficheiro comigo?", native: "Can you share the file with me?" },
      { target: "A ligação à internet está instável.", native: "The internet connection is unstable." },
      { target: "Vamos entrar na reunião online.", native: "Let's join the online meeting." }
    ]},
    { title: "Saúde e Sentimentos", category: "emotions", sentences: [
      { target: "Sinto-me um pouco cansado hoje.", native: "I feel a bit tired today." },
      { target: "Preciso de beber mais água.", native: "I need to drink more water." },
      { target: "Sente-se bem?", native: "Do you feel well?" },
      { target: "Respire fundo e relaxe.", native: "Breathe deeply and relax." }
    ]}
  ]
};

const categoryColors = {
  vocabulary: "#2D4A3E",
  grammar: "#7850B4",
  listening: "#1B3A4B",
  speaking: "#C4714A",
  idioms: "#4A90E2"
};

const allLessons = [];
let lessonCounter = 1;

// We need 600+ lessons total. Let's do 210 lessons for each language (en, es, pt) to get 630 lessons.
const TARGET_LANGS = ["en", "es", "pt"];
const LESSONS_PER_LANG = 210;

for (const lang of TARGET_LANGS) {
  const rand = lcg(12345 + lang.charCodeAt(0) * 100);
  const langVocab = vocabulary[lang] || [];
  const langGrammar = grammar[lang] || [];
  const langIdioms = idioms[lang] || [];

  for (let i = 0; i < LESSONS_PER_LANG; i++) {
    const seed = i + 1;
    const levelIndex = Math.floor(i / (LESSONS_PER_LANG / 6)); // evenly split levels A1, A2, B1, B2, C1, C2
    const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
    const level = levels[levelIndex] || "A2";

    // Select category round-robin
    const cats = ["vocabulary", "grammar", "listening", "speaking", "idioms"];
    const category = cats[i % cats.length];
    const color = categoryColors[category] || "#2D4A3E";

    // Get a thematic topic
    const topics = THEMATIC_TOPICS[lang];
    const topic = topics[i % topics.length];
    const lessonTitle = `${topic.title} - Volume ${Math.floor(i / topics.length) + 1}`;

    // Steps array (10-12 steps each)
    const steps = [];

    // Step 1: Intro
    steps.push({
      type: "intro",
      title: `Bem-vindo: ${lessonTitle}`,
      text: `Nesta lição de nível ${level}, vamos explorar tópicos essenciais sobre "${topic.title}". Prepare-se para enriquecer suas habilidades práticas de comunicação!`
    });

    // Pick 3 vocabulary words for this lesson
    const vocabIndex = (i * 3) % langVocab.length;
    const vocabSlice = [];
    for (let k = 0; k < 3; k++) {
      vocabSlice.push(langVocab[(vocabIndex + k) % langVocab.length]);
    }

    // Step 2: Vocabulary Learn
    steps.push({
      type: "vocab",
      title: "Vocabulário do Dia",
      words: vocabSlice.map(v => ({
        word: v.word,
        meaning: v.translation,
        example: v.example
      }))
    });

    // Step 3: Quiz on Word 1
    const quizW = vocabSlice[0];
    const incorrect1 = langVocab[(vocabIndex + 4) % langVocab.length]?.translation || "Desconhecido";
    const incorrect2 = langVocab[(vocabIndex + 5) % langVocab.length]?.translation || "Nenhum";
    const incorrect3 = langVocab[(vocabIndex + 6) % langVocab.length]?.translation || "Errado";
    const quizOptions = [quizW.translation, incorrect1, incorrect2, incorrect3];
    // Shuffle options using LCG
    for (let s = quizOptions.length - 1; s > 0; s--) {
      const j = Math.floor(rand() * (s + 1));
      [quizOptions[s], quizOptions[j]] = [quizOptions[j], quizOptions[s]];
    }
    steps.push({
      type: "quiz",
      title: "Desafio de Tradução",
      question: `Qual é a tradução correta para "${quizW.word}"?`,
      options: quizOptions,
      correct: quizOptions.indexOf(quizW.translation)
    });

    // Step 4: Listening Challenge on Word 2
    const listenW = vocabSlice[1];
    const listenOptions = [
      listenW.word,
      langVocab[(vocabIndex + 4) % langVocab.length]?.word || "word1",
      langVocab[(vocabIndex + 5) % langVocab.length]?.word || "word2",
      langVocab[(vocabIndex + 6) % langVocab.length]?.word || "word3"
    ];
    for (let s = listenOptions.length - 1; s > 0; s--) {
      const j = Math.floor(rand() * (s + 1));
      [listenOptions[s], listenOptions[j]] = [listenOptions[j], listenOptions[s]];
    }
    steps.push({
      type: "listening",
      title: "Desafio de Compreensão Auditiva",
      question: "Ouça a frase com atenção e selecione a palavra correta pronunciada.",
      audioText: listenW.example,
      options: listenOptions,
      correct: listenOptions.indexOf(listenW.word)
    });

    // Step 5: Speaking Practice
    steps.push({
      type: "speaking",
      title: "Prática de Pronúncia",
      text: "Fale a seguinte frase em voz alta no microfone:",
      targetPhrase: vocabSlice[2].example
    });

    // Step 6: Translation challenge (written type)
    const topicSentences = topic.sentences;
    const ts1 = topicSentences[i % topicSentences.length];
    steps.push({
      type: "translation",
      title: "Desafio de Escrita",
      question: `Como você traduziria: "${ts1.target}"?`,
      targetPhrase: ts1.target,
      correctTranslation: ts1.native,
      explanation: `A tradução natural de "${ts1.target}" é "${ts1.native}".`
    });

    // Step 7: Drag & Drop challenge
    const ts2 = topicSentences[(i + 1) % topicSentences.length];
    // Split the target sentence into words
    const answerTokens = ts2.target.split(/\s+/).map(w => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,""));
    const distractorTokens = ["apple", "house", "libro", "comer", "car", "mesa"].slice(0, 3);
    const dragTokens = [...answerTokens, ...distractorTokens];
    // Shuffle drag tokens
    for (let s = dragTokens.length - 1; s > 0; s--) {
      const j = Math.floor(rand() * (s + 1));
      [dragTokens[s], dragTokens[j]] = [dragTokens[j], dragTokens[s]];
    }
    steps.push({
      type: "dragdrop",
      title: "Organize a Frase",
      question: `Ordene as palavras para formar a frase: "${ts2.native}"`,
      sentence: ts2.native,
      tokens: dragTokens,
      answerTokens: answerTokens
    });

    // Step 8: Grammar Quiz
    const grammarItem = langGrammar[i % langGrammar.length] || { title: "Regra Gramatical", explanation: "Prática de estrutura essencial da frase.", examples: ["Exemplo 1"] };
    steps.push({
      type: "quiz",
      title: `Gramática: ${grammarItem.title}`,
      question: `Com base na explicação: "${grammarItem.explanation.slice(0, 80)}...", qual exemplo está estruturalmente correto?`,
      options: [
        grammarItem.examples[0],
        "This is a structurally incorrect sequence.",
        "Incorrect grammar form usage.",
        "No matching conjugation found."
      ],
      correct: 0
    });

    // Step 9: Idioms Speaking / Practice
    const idiomItem = langIdioms[i % langIdioms.length] || { idiom: "Idiom", literalTranslation: "Literal", meaning: "Meaning", examples: ["Example"] };
    steps.push({
      type: "speaking",
      title: `Expressão Idiomática: ${idiomItem.idiom}`,
      text: `O significado é: "${idiomItem.meaning}". Pronuncie a frase de exemplo:`,
      targetPhrase: idiomItem.examples[0]
    });

    // Step 10: Final Dialogue Practice
    steps.push({
      type: "practice",
      title: "Conversação Livre Lume AI",
      chatPrompt: `Você está praticando o tema "${topic.title}" em nível ${level}. Diga algo relacionado para Lume!`
    });

    allLessons.push({
      id: `lesson-${lang}-${seed}`,
      title: lessonTitle,
      language: lang,
      level: level,
      duration: `${5 + (seed % 6)} min`,
      xp: 40 + (seed % 30),
      color: color,
      description: `Domine ${topic.title} através de vocabulário, conversação, gramática e áudios.`,
      category: category,
      icon: category === "listening" ? "🎧" : category === "grammar" ? "📖" : "🗣️",
      subtitle: `${topic.title} (${level})`,
      steps: steps
    });
  }
}

// Write file
fs.writeFileSync(outputPath, JSON.stringify(allLessons, null, 2), 'utf8');
console.log(`Generated ${allLessons.length} lessons into ${outputPath}`);
