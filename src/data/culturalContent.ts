/**
 * CULTURAL CONTENT - Real City Data
 * 8 cities with complete information for cultural exploration
 */

export interface CityContent {
  slug: string;
  name: string;
  country: string;
  flag: string;
  language: string;
  shortDescription: string;
  fullDescription: string;
  curiosities: string[];
  usefulPhrases: Array<{ phrase: string; translation: string }>;
  vocabulary: Array<{ word: string; meaning: string; example: string }>;
  culturalTip: string;
  gradient: string;
  relatedLessonIds: string[];
}

export const CULTURAL_CITIES: CityContent[] = [
  {
    slug: "london",
    name: "London",
    country: "United Kingdom",
    flag: "🇬🇧",
    language: "English",
    shortDescription: "Explore British culture and London's iconic landmarks",
    fullDescription: "London is the capital of England and the United Kingdom. With over 2000 years of history, it's a global hub for culture, finance, and tourism. From Buckingham Palace to the Tower of London, the city offers a unique blend of historical monuments and modern architecture.",
    curiosities: [
      "Big Ben's official name is actually the Elizabeth Tower. The bell inside is called Big Ben.",
      "London has over 170 museums, including the British Museum which houses over 8 million works.",
      "The London Underground, opened in 1863, is the world's oldest underground railway system."
    ],
    usefulPhrases: [
      { phrase: "Excuse me, where is the Tube station?", translation: "Com licença, onde fica a estação do metrô?" },
      { phrase: "Could I have a cup of tea, please?", translation: "Poderia me trazer uma xícara de chá, por favor?" },
      { phrase: "How much is a ticket to the Tower of London?", translation: "Quanto custa um ingresso para a Torre de Londres?" },
      { phrase: "Which way to Buckingham Palace?", translation: "Qual o caminho para o Palácio de Buckingham?" },
      { phrase: "Mind the gap!", translation: "Cuidado com o vão! (aviso do metrô)" }
    ],
    vocabulary: [
      { word: "Underground", meaning: "Metrô", example: "Take the Underground to Piccadilly Circus." },
      { word: "Queue", meaning: "Fila", example: "Please join the queue at the back." },
      { word: "Lift", meaning: "Elevador", example: "Take the lift to the fifth floor." },
      { word: "Cheers", meaning: "Obrigado/Saúde", example: "Cheers for helping me out!" },
      { word: "Pub", meaning: "Bar/Taverna", example: "Let's meet at the pub tonight." }
    ],
    culturalTip: "British people value queuing (forming lines) - always wait your turn! Also, saying 'please' and 'thank you' frequently is essential in British culture.",
    gradient: "linear-gradient(135deg, #1B3A4B 0%, #2D4A3E 100%)",
    relatedLessonIds: ["lesson-en-1", "lesson-en-5", "lesson-en-10"]
  },
  {
    slug: "new-york",
    name: "New York City",
    country: "United States",
    flag: "🇺🇸",
    language: "English",
    shortDescription: "Experience the energy of the city that never sleeps",
    fullDescription: "New York City, often called NYC or simply New York, is the most populous city in the United States. Known for its iconic skyline featuring the Empire State Building and One World Trade Center, NYC is a global center for finance, culture, media, and entertainment.",
    curiosities: [
      "New York City has over 800 languages spoken, making it the most linguistically diverse city in the world.",
      "The Statue of Liberty was a gift from France in 1886 and stands 305 feet tall including its pedestal.",
      "Central Park, completed in 1876, is visited by approximately 42 million people annually."
    ],
    usefulPhrases: [
      { phrase: "How do I get to Times Square?", translation: "Como chego à Times Square?" },
      { phrase: "Can I get a slice of pizza?", translation: "Posso pedir uma fatia de pizza?" },
      { phrase: "Where's the nearest subway station?", translation: "Onde fica a estação de metrô mais próxima?" },
      { phrase: "I'd like a bagel with cream cheese", translation: "Quero um bagel com cream cheese" },
      { phrase: "What time does the show start?", translation: "Que horas começa o show?" }
    ],
    vocabulary: [
      { word: "Subway", meaning: "Metrô", example: "I take the subway to work every day." },
      { word: "Block", meaning: "Quarteirão", example: "Walk three blocks and turn left." },
      { word: "Bodega", meaning: "Mercearia pequena", example: "I'll grab some coffee at the bodega." },
      { word: "Manhattan", meaning: "Manhattan (distrito)", example: "I work in Manhattan." },
      { word: "Yellow cab", meaning: "Táxi amarelo", example: "Let's catch a yellow cab." }
    ],
    culturalTip: "New Yorkers walk fast! Keep pace and don't stop suddenly on the sidewalk. Tipping 15-20% is expected in restaurants.",
    gradient: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
    relatedLessonIds: ["lesson-en-2", "lesson-en-6", "lesson-en-15"]
  },
  {
    slug: "sydney",
    name: "Sydney",
    country: "Australia",
    flag: "🇦🇺",
    language: "English",
    shortDescription: "Discover Australian culture and stunning beaches",
    fullDescription: "Sydney is Australia's largest city and the capital of New South Wales. Famous for its harbourfront Sydney Opera House and the iconic Harbour Bridge, Sydney offers beautiful beaches, world-class dining, and a vibrant outdoor lifestyle.",
    curiosities: [
      "The Sydney Opera House took 14 years to build and was completed in 1973. It hosts over 1,500 performances annually.",
      "Sydney Harbour is one of the deepest natural harbours in the world.",
      "Bondi Beach is one of the most famous beaches globally and is only 7km from the city center."
    ],
    usefulPhrases: [
      { phrase: "G'day mate!", translation: "Oi, amigo!" },
      { phrase: "Where's the best beach nearby?", translation: "Qual é a melhor praia por aqui?" },
      { phrase: "Can I get a flat white?", translation: "Posso pedir um flat white?" },
      { phrase: "No worries!", translation: "Sem problemas!/De boa!" },
      { phrase: "How do I get to the Opera House?", translation: "Como chego à Ópera?" }
    ],
    vocabulary: [
      { word: "Arvo", meaning: "Tarde", example: "See you this arvo!" },
      { word: "Brekkie", meaning: "Café da manhã", example: "Let's grab brekkie at the cafe." },
      { word: "Servo", meaning: "Posto de gasolina", example: "Stop at the servo for petrol." },
      { word: "Sunnies", meaning: "Óculos de sol", example: "Don't forget your sunnies!" },
      { word: "Thongs", meaning: "Chinelos", example: "I'll wear my thongs to the beach." }
    ],
    culturalTip: "Australians are very laid-back and informal. Don't be surprised if strangers call you 'mate'. Sun protection is crucial - always wear sunscreen!",
    gradient: "linear-gradient(135deg, #0A4D68 0%, #088395 100%)",
    relatedLessonIds: ["lesson-en-20", "lesson-en-25"]
  },
  {
    slug: "toronto",
    name: "Toronto",
    country: "Canada",
    flag: "🇨🇦",
    language: "English",
    shortDescription: "Experience multicultural Canada in its largest city",
    fullDescription: "Toronto is Canada's largest city and a vibrant multicultural metropolis. Home to the iconic CN Tower, diverse neighborhoods, and world-class museums, Toronto offers a unique blend of cultures, cuisines, and experiences.",
    curiosities: [
      "The CN Tower was the world's tallest free-standing structure for 32 years (1975-2007).",
      "Toronto is one of the most multicultural cities in the world, with over 200 ethnic groups.",
      "The PATH is an underground pedestrian walkway system spanning over 30 km, perfect for avoiding cold winters."
    ],
    usefulPhrases: [
      { phrase: "Sorry, eh?", translation: "Desculpa, hein?" },
      { phrase: "How do I get to the CN Tower?", translation: "Como chego à Torre CN?" },
      { phrase: "It's really cold out, eh?", translation: "Está muito frio lá fora, né?" },
      { phrase: "Can I get a double-double?", translation: "Posso pedir um double-double?" },
      { phrase: "Where's the nearest Tim Hortons?", translation: "Onde fica o Tim Hortons mais próximo?" }
    ],
    vocabulary: [
      { word: "Toque", meaning: "Gorro de lã", example: "Wear a toque when it's cold." },
      { word: "Loonie", meaning: "Moeda de 1 dólar", example: "That costs five loonies." },
      { word: "Timmies", meaning: "Tim Hortons (rede de café)", example: "Let's grab coffee at Timmies." },
      { word: "Washroom", meaning: "Banheiro", example: "Where's the washroom?" },
      { word: "Hydro", meaning: "Eletricidade", example: "The hydro bill is due." }
    ],
    culturalTip: "Canadians are known for being polite and saying 'sorry' frequently. Don't be offended - it's just cultural! Tipping 15-20% is standard.",
    gradient: "linear-gradient(135deg, #8B0000 0%, #DC143C 100%)",
    relatedLessonIds: ["lesson-en-30"]
  },
  {
    slug: "dublin",
    name: "Dublin",
    country: "Ireland",
    flag: "🇮🇪",
    language: "English",
    shortDescription: "Explore Irish culture, history, and the warmth of Dublin",
    fullDescription: "Dublin is the capital and largest city of Ireland. Known for its rich literary history, vibrant pub culture, and friendly locals, Dublin offers historic castles, beautiful Georgian architecture, and the famous Guinness Storehouse.",
    curiosities: [
      "Dublin is a UNESCO City of Literature - it's the birthplace of literary giants like James Joyce, Oscar Wilde, and Samuel Beckett.",
      "The Guinness Storehouse is Ireland's most popular tourist attraction, welcoming over 1.7 million visitors annually.",
      "Dublin's St. Patrick's Cathedral dates back to 1191 and is the tallest church in Ireland."
    ],
    usefulPhrases: [
      { phrase: "What's the craic?", translation: "Como você está?/Quais as novidades?" },
      { phrase: "I'll have a pint of Guinness", translation: "Vou querer uma caneca de Guinness" },
      { phrase: "Where's Temple Bar?", translation: "Onde fica Temple Bar?" },
      { phrase: "Cheers!", translation: "Saúde!" },
      { phrase: "Grand, so!", translation: "Ótimo, então!" }
    ],
    vocabulary: [
      { word: "Craic", meaning: "Diversão/Novidades", example: "We had great craic last night!" },
      { word: "Grand", meaning: "Bom/OK", example: "Everything's grand, thanks." },
      { word: "Deadly", meaning: "Ótimo/Legal", example: "That concert was deadly!" },
      { word: "Feck", meaning: "Versão leve de palavrão", example: "Ah feck, I forgot my keys!" },
      { word: "Gaff", meaning: "Casa", example: "Come over to my gaff later." }
    ],
    culturalTip: "Irish people love conversation and storytelling. Don't be surprised if strangers strike up friendly chats. Pub culture is central - buying rounds is customary.",
    gradient: "linear-gradient(135deg, #006400 0%, #228B22 100%)",
    relatedLessonIds: []
  },
  {
    slug: "madrid",
    name: "Madrid",
    country: "Spain",
    flag: "🇪🇸",
    language: "Spanish",
    shortDescription: "Discover Spanish culture in the heart of Spain",
    fullDescription: "Madrid is the capital and most populous city of Spain. Known for its rich royal history, world-class art museums like the Prado, vibrant nightlife, and delicious tapas culture, Madrid embodies the passion and energy of Spanish culture.",
    curiosities: [
      "Madrid is the highest capital city in Europe at 667 meters above sea level.",
      "The Prado Museum houses one of the world's finest collections of European art, with works by Velázquez, Goya, and El Greco.",
      "Madrid has more bars per capita than any other city in Europe!"
    ],
    usefulPhrases: [
      { phrase: "¿Dónde está la Plaza Mayor?", translation: "Onde fica a Plaza Mayor?" },
      { phrase: "Una caña, por favor", translation: "Um chope, por favor" },
      { phrase: "¿A qué hora se cena aquí?", translation: "A que horas se janta aqui?" },
      { phrase: "¿Cuánto cuesta?", translation: "Quanto custa?" },
      { phrase: "¡Buen provecho!", translation: "Bom apetite!" }
    ],
    vocabulary: [
      { word: "Tapas", meaning: "Petiscos", example: "Vamos a tomar unas tapas." },
      { word: "Caña", meaning: "Chope pequeno", example: "Una caña bien fría, por favor." },
      { word: "Terraza", meaning: "Terraço/Esplanada", example: "Sentémonos en la terraza." },
      { word: "Madrileño", meaning: "Pessoa de Madrid", example: "Soy madrileño de toda la vida." },
      { word: "Sobremesa", meaning: "Conversa após refeição", example: "Hagamos sobremesa con un café." }
    ],
    culturalTip: "Spaniards eat late - lunch around 2-3pm and dinner after 9pm. Siesta is still practiced by some. Don't be surprised by loud, animated conversations - it's normal!",
    gradient: "linear-gradient(135deg, #C60B1E 0%, #FFC400 100%)",
    relatedLessonIds: ["lesson-es-1", "lesson-es-5", "lesson-es-10"]
  },
  {
    slug: "barcelona",
    name: "Barcelona",
    country: "Spain",
    flag: "🇪🇸",
    language: "Spanish/Catalan",
    shortDescription: "Experience Gaudí's architecture and Mediterranean culture",
    fullDescription: "Barcelona is the capital of Catalonia and Spain's second-largest city. Famous for Antoni Gaudí's architectural masterpieces including the Sagrada Família, beautiful Mediterranean beaches, and a unique Catalan culture, Barcelona offers art, history, and vibrant street life.",
    curiosities: [
      "The Sagrada Família has been under construction since 1882 and is expected to be completed in 2026.",
      "Las Ramblas, Barcelona's famous street, stretches 1.2 km and is visited by thousands daily.",
      "FC Barcelona's Camp Nou stadium is the largest in Europe, with a capacity of 99,354."
    ],
    usefulPhrases: [
      { phrase: "¿Dónde está la Sagrada Família?", translation: "Onde fica a Sagrada Família?" },
      { phrase: "¿Habla catalán?", translation: "Você fala catalão?" },
      { phrase: "Una cerveza, por favor", translation: "Uma cerveja, por favor" },
      { phrase: "¿Cuánto vale un billete de metro?", translation: "Quanto custa um bilhete de metrô?" },
      { phrase: "¡Visca el Barça!", translation: "Viva o Barça!" }
    ],
    vocabulary: [
      { word: "Playa", meaning: "Praia", example: "Vamos a la playa este fin de semana." },
      { word: "Barrio", meaning: "Bairro", example: "El Barrio Gótico es muy antiguo." },
      { word: "Paella", meaning: "Paella (prato típico)", example: "Prueba la paella de mariscos." },
      { word: "Modernismo", meaning: "Modernismo (estilo arquitetônico)", example: "Gaudí fue un maestro del modernismo." },
      { word: "Churros", meaning: "Churros", example: "Desayunemos churros con chocolate." }
    ],
    culturalTip: "Barcelona is bilingual - Spanish and Catalan are both official languages. Many locals prefer Catalan. Beach culture is strong - enjoy the Mediterranean lifestyle!",
    gradient: "linear-gradient(135deg, #004D98 0%, #FCBF49 100%)",
    relatedLessonIds: ["lesson-es-15", "lesson-es-20"]
  },
  {
    slug: "mexico-city",
    name: "Mexico City",
    country: "Mexico",
    flag: "🇲🇽",
    language: "Spanish",
    shortDescription: "Explore ancient Aztec heritage and vibrant Mexican culture",
    fullDescription: "Mexico City is the capital and largest city of Mexico. Built on the ruins of the ancient Aztec city of Tenochtitlan, it's one of the oldest capitals in the Americas. With incredible museums, delicious street food, colorful markets, and warm hospitality, it's a cultural powerhouse.",
    curiosities: [
      "Mexico City is sinking at a rate of about 50cm per year due to groundwater extraction.",
      "The city has over 150 museums - more than any other city in the world!",
      "Chapultepec Park is one of the largest city parks in the Western Hemisphere, twice the size of New York's Central Park."
    ],
    usefulPhrases: [
      { phrase: "¿Dónde está el Zócalo?", translation: "Onde fica o Zócalo (praça principal)?" },
      { phrase: "Unos tacos al pastor, por favor", translation: "Uns tacos al pastor, por favor" },
      { phrase: "¿Cuánto cuesta?", translation: "Quanto custa?" },
      { phrase: "¡Qué padre!", translation: "Que legal! (expressão mexicana)" },
      { phrase: "¿Me puede llevar a Coyoacán?", translation: "Pode me levar a Coyoacán?" }
    ],
    vocabulary: [
      { word: "Chilango", meaning: "Pessoa da Cidade do México", example: "Soy chilango de corazón." },
      { word: "Antojito", meaning: "Petisco mexicano", example: "Vamos a comer unos antojitos." },
      { word: "Camión", meaning: "Ônibus (México)", example: "Tomo el camión para ir al trabajo." },
      { word: "Chido", meaning: "Legal/Bacana", example: "¡Esa película estuvo muy chida!" },
      { word: "Ahorita", meaning: "Daqui a pouco/Agora", example: "Voy ahorita, espérame." }
    ],
    culturalTip: "Mexican hospitality is legendary - people are warm and welcoming. Street food is delicious and safe in popular spots. Traffic can be intense - plan extra travel time!",
    gradient: "linear-gradient(135deg, #006847 0%, #CE1126 100%)",
    relatedLessonIds: ["lesson-es-25", "lesson-es-30"]
  }
];

/**
 * Get city by slug
 */
export function getCityBySlug(slug: string): CityContent | undefined {
  return CULTURAL_CITIES.find(city => city.slug === slug);
}

/**
 * Get all available cities
 */
export function getAllCities(): CityContent[] {
  return CULTURAL_CITIES;
}

/**
 * Get cities by language
 */
export function getCitiesByLanguage(language: string): CityContent[] {
  return CULTURAL_CITIES.filter(city => 
    city.language.toLowerCase().includes(language.toLowerCase())
  );
}
