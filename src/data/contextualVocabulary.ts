/**
 * CONTEXTUAL VOCABULARY ENGINE
 * Generates topic-relevant vocabulary based on lesson title/category
 * Fixes the issue of repeated non-contextual words across all lessons
 */

interface VocabWord {
  word: string;
  meaning: string;
  example: string;
}

// Topic-specific vocabulary databases
const VOCABULARY_BY_TOPIC: Record<string, VocabWord[]> = {
  // AIRPORT & TRAVEL
  airport: [
    { word: "Boarding pass", meaning: "Cartão de embarque", example: "Please show your boarding pass at the gate." },
    { word: "Baggage claim", meaning: "Retirada de bagagem", example: "Meet me at the baggage claim area." },
    { word: "Gate", meaning: "Portão de embarque", example: "Flight 302 departs from gate B12." },
    { word: "Passport", meaning: "Passaporte", example: "Don't forget to bring your passport." },
    { word: "Security check", meaning: "Controle de segurança", example: "The security check might take a while." },
    { word: "Departure", meaning: "Partida", example: "Check the departure time on your ticket." },
    { word: "Arrival", meaning: "Chegada", example: "The arrival hall is on the ground floor." },
    { word: "Customs", meaning: "Alfândega", example: "You must go through customs when entering the country." },
  ],

  // COFFEE & CAFE
  coffee: [
    { word: "Espresso", meaning: "Café expresso", example: "I'll have a double espresso, please." },
    { word: "Latte", meaning: "Café com leite", example: "A large latte with extra foam." },
    { word: "Cappuccino", meaning: "Capuccino", example: "One cappuccino to go." },
    { word: "Barista", meaning: "Barista", example: "The barista makes excellent coffee." },
    { word: "Decaf", meaning: "Descafeinado", example: "Do you have decaf coffee?" },
    { word: "To-go cup", meaning: "Copo para viagem", example: "Can I get that in a to-go cup?" },
    { word: "Milk foam", meaning: "Espuma de leite", example: "I love the milk foam on cappuccinos." },
    { word: "Sugar", meaning: "Açúcar", example: "Would you like sugar with that?" },
  ],

  // JOB & INTERVIEW
  job: [
    { word: "Resume", meaning: "Currículo", example: "Please send your resume by email." },
    { word: "Interview", meaning: "Entrevista", example: "I have a job interview tomorrow." },
    { word: "Candidate", meaning: "Candidato", example: "We interviewed three candidates today." },
    { word: "Skills", meaning: "Habilidades", example: "List your main skills on your resume." },
    { word: "Experience", meaning: "Experiência", example: "Do you have previous experience in sales?" },
    { word: "Salary", meaning: "Salário", example: "What are your salary expectations?" },
    { word: "Benefits", meaning: "Benefícios", example: "The company offers great benefits." },
    { word: "Position", meaning: "Posição/Cargo", example: "We have an open position for a manager." },
  ],

  // RESTAURANT & FOOD
  restaurant: [
    { word: "Menu", meaning: "Cardápio", example: "Can I see the menu, please?" },
    { word: "Waiter", meaning: "Garçom", example: "The waiter will take your order." },
    { word: "Appetizer", meaning: "Entrada", example: "Would you like an appetizer before the main course?" },
    { word: "Main course", meaning: "Prato principal", example: "What's the main course today?" },
    { word: "Dessert", meaning: "Sobremesa", example: "Save some room for dessert!" },
    { word: "Bill", meaning: "Conta", example: "Can we have the bill, please?" },
    { word: "Tip", meaning: "Gorjeta", example: "Don't forget to leave a tip." },
    { word: "Reservation", meaning: "Reserva", example: "I'd like to make a reservation for two." },
  ],

  // SHOPPING
  shopping: [
    { word: "Price", meaning: "Preço", example: "What's the price of this shirt?" },
    { word: "Discount", meaning: "Desconto", example: "Is there a discount on sale items?" },
    { word: "Receipt", meaning: "Recibo", example: "Keep your receipt for returns." },
    { word: "Fitting room", meaning: "Provador", example: "The fitting rooms are in the back." },
    { word: "Size", meaning: "Tamanho", example: "Do you have this in a larger size?" },
    { word: "Cash", meaning: "Dinheiro", example: "Do you accept cash?" },
    { word: "Credit card", meaning: "Cartão de crédito", example: "Can I pay by credit card?" },
    { word: "Return", meaning: "Devolução", example: "What's your return policy?" },
  ],

  // HOTEL
  hotel: [
    { word: "Check-in", meaning: "Check-in", example: "Check-in time is at 3 PM." },
    { word: "Check-out", meaning: "Check-out", example: "Check-out is at 11 AM." },
    { word: "Room service", meaning: "Serviço de quarto", example: "You can order room service 24/7." },
    { word: "Reservation", meaning: "Reserva", example: "I have a reservation under Smith." },
    { word: "Key card", meaning: "Cartão-chave", example: "Here's your key card for room 305." },
    { word: "Lobby", meaning: "Lobby/Saguão", example: "Meet me in the hotel lobby." },
    { word: "Breakfast", meaning: "Café da manhã", example: "Breakfast is included in the rate." },
    { word: "Wi-Fi", meaning: "Wi-Fi", example: "What's the Wi-Fi password?" },
  ],

  // HEALTH & DOCTOR
  health: [
    { word: "Appointment", meaning: "Consulta", example: "I need to schedule an appointment." },
    { word: "Symptoms", meaning: "Sintomas", example: "What are your symptoms?" },
    { word: "Prescription", meaning: "Receita médica", example: "The doctor gave me a prescription." },
    { word: "Pharmacy", meaning: "Farmácia", example: "You can buy it at any pharmacy." },
    { word: "Pain", meaning: "Dor", example: "I have a pain in my chest." },
    { word: "Fever", meaning: "Febre", example: "Do you have a fever?" },
    { word: "Medicine", meaning: "Remédio", example: "Take this medicine twice a day." },
    { word: "Insurance", meaning: "Seguro", example: "Do you have health insurance?" },
  ],

  // TECHNOLOGY
  technology: [
    { word: "Computer", meaning: "Computador", example: "My computer crashed." },
    { word: "Software", meaning: "Software", example: "We need to update the software." },
    { word: "Password", meaning: "Senha", example: "Enter your password to login." },
    { word: "Download", meaning: "Baixar", example: "Click here to download the file." },
    { word: "Wi-Fi", meaning: "Wi-Fi", example: "Connect to the Wi-Fi network." },
    { word: "Email", meaning: "E-mail", example: "Send me an email with the details." },
    { word: "App", meaning: "Aplicativo", example: "Download our mobile app." },
    { word: "Backup", meaning: "Backup", example: "Always make a backup of your files." },
  ],

  // WEATHER
  weather: [
    { word: "Sunny", meaning: "Ensolarado", example: "It's a sunny day today." },
    { word: "Rainy", meaning: "Chuvoso", example: "It's rainy outside." },
    { word: "Cloudy", meaning: "Nublado", example: "The sky is cloudy." },
    { word: "Temperature", meaning: "Temperatura", example: "What's the temperature today?" },
    { word: "Forecast", meaning: "Previsão", example: "Check the weather forecast." },
    { word: "Umbrella", meaning: "Guarda-chuva", example: "Don't forget your umbrella." },
    { word: "Hot", meaning: "Quente", example: "It's very hot today." },
    { word: "Cold", meaning: "Frio", example: "It's cold outside." },
  ],

  // TRANSPORTATION
  transportation: [
    { word: "Bus", meaning: "Ônibus", example: "Take the bus to downtown." },
    { word: "Train", meaning: "Trem", example: "The train arrives at 3 PM." },
    { word: "Taxi", meaning: "Táxi", example: "Let's take a taxi." },
    { word: "Ticket", meaning: "Bilhete", example: "Buy your ticket at the machine." },
    { word: "Station", meaning: "Estação", example: "Where is the train station?" },
    { word: "Schedule", meaning: "Horário", example: "Check the bus schedule." },
    { word: "Platform", meaning: "Plataforma", example: "The train leaves from platform 5." },
    { word: "Fare", meaning: "Tarifa", example: "What's the fare to the airport?" },
  ],
};

// Fallback generic vocabulary for unmatched topics
const GENERIC_VOCABULARY: VocabWord[] = [
  { word: "Hello", meaning: "Olá", example: "Hello! How are you?" },
  { word: "Thank you", meaning: "Obrigado", example: "Thank you for your help." },
  { word: "Please", meaning: "Por favor", example: "Can you help me, please?" },
  { word: "Excuse me", meaning: "Com licença", example: "Excuse me, where is the bathroom?" },
  { word: "Sorry", meaning: "Desculpe", example: "Sorry, I didn't understand." },
  { word: "Help", meaning: "Ajuda", example: "I need help with this." },
  { word: "Today", meaning: "Hoje", example: "What are we doing today?" },
  { word: "Tomorrow", meaning: "Amanhã", example: "See you tomorrow!" },
];

/**
 * Extract topic keywords from lesson title
 */
function extractTopicKeywords(title: string): string[] {
  const normalized = title.toLowerCase();
  const keywords: string[] = [];

  // Check for known topics
  const topicMap: Record<string, string[]> = {
    airport: ['airport', 'flight', 'travel', 'boarding', 'passport', 'baggage'],
    coffee: ['coffee', 'cafe', 'latte', 'espresso', 'barista'],
    job: ['job', 'interview', 'work', 'career', 'resume', 'cv'],
    restaurant: ['restaurant', 'food', 'dining', 'meal', 'eat'],
    shopping: ['shop', 'store', 'buy', 'purchase', 'mall'],
    hotel: ['hotel', 'accommodation', 'stay', 'room', 'lodge'],
    health: ['health', 'doctor', 'medical', 'hospital', 'clinic'],
    technology: ['tech', 'computer', 'software', 'digital', 'online'],
    weather: ['weather', 'climate', 'temperature', 'rain', 'sun'],
    transportation: ['transport', 'bus', 'train', 'metro', 'subway'],
  };

  for (const [topic, terms] of Object.entries(topicMap)) {
    if (terms.some(term => normalized.includes(term))) {
      keywords.push(topic);
    }
  }

  return keywords;
}

/**
 * Generate contextual vocabulary for a lesson
 * @param lessonTitle - The title of the lesson
 * @param count - Number of words to generate (default: 3)
 * @param seed - Optional seed for deterministic randomness (use lesson ID)
 * @returns Array of vocabulary words relevant to the lesson topic
 */
export function generateContextualVocabulary(
  lessonTitle: string,
  count: number = 3,
  seed?: string
): VocabWord[] {
  // Extract topic keywords from title
  const topics = extractTopicKeywords(lessonTitle);

  // Collect vocabulary from matching topics
  let availableWords: VocabWord[] = [];
  for (const topic of topics) {
    if (VOCABULARY_BY_TOPIC[topic]) {
      availableWords.push(...VOCABULARY_BY_TOPIC[topic]);
    }
  }

  // Fallback to generic if no matching topic
  if (availableWords.length === 0) {
    availableWords = GENERIC_VOCABULARY;
  }

  // Use seed for deterministic selection (same lesson = same words)
  let startIndex = 0;
  if (seed) {
    startIndex = Math.abs(seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % availableWords.length;
  }

  // Select words (circular selection if not enough words)
  const selected: VocabWord[] = [];
  for (let i = 0; i < count; i++) {
    const index = (startIndex + i) % availableWords.length;
    selected.push(availableWords[index]);
  }

  return selected;
}

/**
 * Replace vocab step in lesson with contextual vocabulary
 */
export function injectContextualVocabulary(lesson: any): any {
  if (!lesson.steps) return lesson;

  const newSteps = lesson.steps.map((step: any) => {
    if (step.type === 'vocab') {
      // Generate contextual vocabulary based on lesson title
      const contextualWords = generateContextualVocabulary(
        lesson.title,
        3,
        lesson.id // Use lesson ID as seed for consistency
      );

      return {
        ...step,
        words: contextualWords,
      };
    }
    return step;
  });

  return {
    ...lesson,
    steps: newSteps,
  };
}
