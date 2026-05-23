export interface Slang {
  expression: string;
  meaningEN: string;
  meaningPT: string;
  meaningES: string;
}

export interface CityInfo {
  id: string;
  name: string;
  namePT: string;
  nameES: string;
  coords: { x: number; y: number };

  slangs: Slang[];

  landmarkEN: string;
  landmarkPT: string;
  landmarkES: string;
  landmarkDescEN: string;
  landmarkDescPT: string;
  landmarkDescES: string;

  foodEN: string;
  foodPT: string;
  foodES: string;
  foodDescEN: string;
  foodDescPT: string;
  foodDescES: string;

  cultureEN: string;
  culturePT: string;
  cultureES: string;

  accentNameEN: string;
  accentNamePT: string;
  accentNameES: string;
  accentTechEN: string;
  accentTechPT: string;
  accentTechES: string;
}

export interface CountryData {
  id: string;
  nameEN: string;
  namePT: string;
  nameES: string;
  flag: string;
  accent: string;
  cities: CityInfo[];
}

export const COUNTRIES: CountryData[] = [
  {
    id: "usa",
    nameEN: "United States",
    namePT: "Estados Unidos",
    nameES: "Estados Unidos",
    flag: "usa",
    accent: "en-US",
    cities: [
      {
        id: "ny",
        name: "New York",
        namePT: "Nova York",
        nameES: "Nueva York",
        coords: { x: 235, y: 175 },
        slangs: [
          {
            expression: "Fuggedaboutit!",
            meaningEN: "Forget about it / No way",
            meaningPT: "Esqueça isso / De jeito nenhum",
            meaningES: "Olvídate de eso / De ninguna manera",
          },
          {
            expression: "Deadass",
            meaningEN: "Seriously / I am not lying",
            meaningPT: "Sério mesmo / Não estou mentindo",
            meaningES: "En serio / No estoy mintiendo",
          },
          {
            expression: "Brick",
            meaningEN: "Very cold outside",
            meaningPT: "Muito frio lá fora",
            meaningES: "Hace mucho frío afuera",
          },
          {
            expression: "Bodega",
            meaningEN: "Corner grocery store",
            meaningPT: "Mercearia de esquina",
            meaningES: "Tienda de conveniencia",
          },
        ],
        landmarkEN: "Statue of Liberty & Times Square",
        landmarkPT: "Estátua da Liberdade & Times Square",
        landmarkES: "Estatua de la Libertad & Times Square",
        landmarkDescEN:
          "The global symbol of freedom and the glowing, energetic heart of Manhattan.",
        landmarkDescPT:
          "O símbolo global da liberdade e o coração brilhante e enérgico de Manhattan.",
        landmarkDescES:
          "El símbolo global de la libertad y el corazón brillante y enérgico de Manhattan.",
        foodEN: "New York Style Pizza",
        foodPT: "Pizza Estilo Nova York",
        foodES: "Pizza Estilo Nueva York",
        foodDescEN: "Wide, thin-crust slices eaten folded on the go.",
        foodDescPT: "Fatias largas de massa fina comíveis dobradas na correria.",
        foodDescES: "Fatias anchas y finas que se comen dobladas sobre la marcha.",
        cultureEN: "The cultural capital where Broadway rules and over 800 languages are spoken.",
        culturePT:
          "A capital cultural onde a Broadway dita o ritmo e mais de 800 idiomas são falados.",
        cultureES:
          "La capital cultural donde Broadway dicta el ritmo y se hablan más de 800 idiomas.",
        accentNameEN: "New York Accent (Non-rhotic)",
        accentNamePT: "Sotaque de Nova York (Não-rótico)",
        accentNameES: "Acento de Nueva York (No rótico)",
        accentTechEN: "Drops the 'r' sounds at the end of words unless followed by a vowel.",
        accentTechPT:
          "Omite o som do 'r' no final das palavras, a menos que seja seguido por vogal.",
        accentTechES:
          "Omite el sonido de la 'r' al final de las palabras a menos que vaya seguida de vocal.",
      },
      {
        id: "boston",
        name: "Boston",
        namePT: "Boston",
        nameES: "Boston",
        coords: { x: 250, y: 160 },
        slangs: [
          {
            expression: "Wicked",
            meaningEN: "Very / Extremely",
            meaningPT: "Muito / Extremamente",
            meaningES: "Muy / Extremadamente",
          },
          {
            expression: "Packie",
            meaningEN: "Liquor store",
            meaningPT: "Loja de bebidas",
            meaningES: "Tienda de licores",
          },
          {
            expression: "Dunks",
            meaningEN: "Dunkin' Donuts",
            meaningPT: "Dunkin' Donuts",
            meaningES: "Dunkin' Donuts",
          },
        ],
        landmarkEN: "Fenway Park",
        landmarkPT: "Fenway Park",
        landmarkES: "Fenway Park",
        landmarkDescEN: "The oldest and most historic baseball stadium in Major League Baseball.",
        landmarkDescPT: "O estádio de beisebol mais antigo e histórico da Major League Baseball.",
        landmarkDescES: "El estadio de béisbol más antiguo e histórico de las Grandes Ligas.",
        foodEN: "New England Clam Chowder",
        foodPT: "Clam Chowder da Nova Inglaterra",
        foodES: "Clam Chowder de Nueva Inglaterra",
        foodDescEN: "A thick cream-based soup with clams, potatoes, and onions.",
        foodDescPT: "Uma sopa espessa à base de creme com mariscos, batatas e cebolas.",
        foodDescES: "Una sopa espesa a base de crema con almejas, papas y cebollas.",
        cultureEN:
          "A city deeply rooted in American history, academic excellence, and sports passion.",
        culturePT:
          "Uma cidade profundamente enraizada na história americana, excelência acadêmica e paixão por esportes.",
        cultureES:
          "Una ciudad profundamente arraigada en la historia estadounidense, la excelencia académica y la pasión por los deportes.",
        accentNameEN: "Boston Accent",
        accentNamePT: "Sotaque de Boston",
        accentNameES: "Acento de Boston",
        accentTechEN:
          "Famous for dropping the 'r' (Pahk the cah in Hahvahd Yahd) and distinct broad 'a' sounds.",
        accentTechPT:
          "Famoso por omitir o 'r' (Pahk the cah) e ter sons distintos e abertos para o 'a'.",
        accentTechES:
          "Famoso por omitir la 'r' (Pahk the cah) y por sus característicos sonidos abiertos de la 'a'.",
      },
      {
        id: "miami",
        name: "Miami",
        namePT: "Miami",
        nameES: "Miami",
        coords: { x: 230, y: 260 },
        slangs: [
          {
            expression: "Bro",
            meaningEN: "Friend / Guy",
            meaningPT: "Amigo / Cara",
            meaningES: "Hermano / Tío",
          },
          {
            expression: "Dale",
            meaningEN: "Go ahead / Do it",
            meaningPT: "Vai em frente / Faça isso",
            meaningES: "Dale / Hazlo",
          },
        ],
        landmarkEN: "South Beach & Art Deco District",
        landmarkPT: "South Beach & Distrito Art Déco",
        landmarkES: "South Beach & Distrito Art Deco",
        landmarkDescEN: "Famous neon-lit ocean drive with historic pastel-colored architecture.",
        landmarkDescPT:
          "Famosa avenida à beira-mar iluminada por neon com histórica arquitetura em tons pastéis.",
        landmarkDescES:
          "Famosa avenida frente al mar iluminada con neón y con histórica arquitectura en tonos pastel.",
        foodEN: "Cuban Sandwich",
        foodPT: "Sanduíche Cubano",
        foodES: "Sándwich Cubano",
        foodDescEN: "Ham, roasted pork, Swiss cheese, pickles, and mustard pressed to perfection.",
        foodDescPT:
          "Presunto, porco assado, queijo suíço, picles e mostarda, perfeitamente prensados.",
        foodDescES:
          "Jamón, cerdo asado, queso suizo, pepinillos y mostaza, perfectamente prensados.",
        cultureEN: "A vibrant, bilingual melting pot of Latin American and Caribbean cultures.",
        culturePT: "Um vibrante caldeirão bilíngue de culturas latino-americanas e caribenhas.",
        cultureES: "Un vibrante crisol bilingüe de culturas latinoamericanas y caribeñas.",
        accentNameEN: "Miami Accent",
        accentNamePT: "Sotaque de Miami",
        accentNameES: "Acento de Miami",
        accentTechEN:
          "Heavily influenced by Spanish, featuring rhythm and vowel lengths of Latin American Spanish.",
        accentTechPT:
          "Fortemente influenciado pelo espanhol, apresentando ritmo e duração de vogais do espanhol latino.",
        accentTechES:
          "Fuertemente influenciado por el español, con el ritmo y la longitud de vocales del español latino.",
      },
    ],
  },
  {
    id: "uk",
    nameEN: "United Kingdom",
    namePT: "Reino Unido",
    nameES: "Reino Unido",
    flag: "uk",
    accent: "en-GB",
    cities: [
      {
        id: "lon",
        name: "London",
        namePT: "Londres",
        nameES: "Londres",
        coords: { x: 480, y: 135 },
        slangs: [
          { expression: "Mate", meaningEN: "Friend", meaningPT: "Amigo", meaningES: "Amigo" },
          {
            expression: "Cheeky",
            meaningEN: "Playfully impudent or irreverent",
            meaningPT: "Atrevidinho / Engraçadinho",
            meaningES: "Descarado / Atrevido",
          },
          {
            expression: "Knackered",
            meaningEN: "Exhausted / Very tired",
            meaningPT: "Exausto",
            meaningES: "Exhausto",
          },
        ],
        landmarkEN: "Big Ben & The Eye",
        landmarkPT: "Big Ben e a London Eye",
        landmarkES: "Big Ben y el London Eye",
        landmarkDescEN:
          "The iconic clock tower standing next to the massive observation wheel over the Thames.",
        landmarkDescPT:
          "A icônica torre do relógio próxima à gigante roda gigante sobre o rio Tâmisa.",
        landmarkDescES:
          "La icónica torre del reloj junto a la enorme noria de observación sobre el río Támesis.",
        foodEN: "Fish and Chips",
        foodPT: "Fish and Chips (Peixe com Fritas)",
        foodES: "Pescado con Patatas",
        foodDescEN: "Deep-fried battered fish served with thick-cut chips and malt vinegar.",
        foodDescPT: "Peixe frito empanado servido com batatas fritas grossas e vinagre de malte.",
        foodDescES: "Pescado frito rebozado servido con patatas fritas gruesas y vinagre de malta.",
        cultureEN: "A sprawling history of royalty, pub culture, and global financial hubs.",
        culturePT: "Uma vasta história de realeza, cultura de pubs e um centro financeiro global.",
        cultureES: "Una vasta historia de realeza, cultura de pubs y un centro financiero global.",
        accentNameEN: "Multicultural London English (MLE)",
        accentNamePT: "Inglês Multicultural de Londres",
        accentNameES: "Inglés Multicultural de Londres",
        accentTechEN: "A blend of traditional Cockney with Caribbean and South Asian influences.",
        accentTechPT:
          "Uma mistura do tradicional Cockney com influências caribenhas e do sul da Ásia.",
        accentTechES:
          "Una mezcla del Cockney tradicional con influencias caribeñas y del sur de Asia.",
      },
      {
        id: "sco",
        name: "Edinburgh",
        namePT: "Edimburgo",
        nameES: "Edimburgo",
        coords: { x: 470, y: 105 },
        slangs: [
          { expression: "Wee", meaningEN: "Small", meaningPT: "Pequeno", meaningES: "Pequeño" },
          {
            expression: "Lass",
            meaningEN: "Girl / Young woman",
            meaningPT: "Garota",
            meaningES: "Chica",
          },
        ],
        landmarkEN: "Edinburgh Castle",
        landmarkPT: "Castelo de Edimburgo",
        landmarkES: "Castillo de Edimburgo",
        landmarkDescEN:
          "A historic fortress dominating the skyline from its volcanic rock position.",
        landmarkDescPT:
          "Fortaleza histórica que domina o horizonte no topo de uma rocha vulcânica.",
        landmarkDescES: "Fortaleza histórica que domina el horizonte sobre una roca volcánica.",
        foodEN: "Haggis",
        foodPT: "Haggis",
        foodES: "Haggis",
        foodDescEN: "A savory pudding containing sheep's pluck, minced with onion and spices.",
        foodDescPT:
          "Um pudim salgado tradicional com carne picada de carneiro, aveia e especiarias.",
        foodDescES: "Un pudín salado tradicional con carne picada de cordero, avena y especias.",
        cultureEN: "Historic castles, bagpipes, dramatic landscapes, and legendary folklore.",
        culturePT: "Castelos históricos, gaitas de fole, paisagens dramáticas e folclore lendário.",
        cultureES:
          "Castillos históricos, gaitas de fuelle, paisajes dramáticos y folclore legendario.",
        accentNameEN: "Scottish English",
        accentNamePT: "Inglês Escocês",
        accentNameES: "Inglés Escocés",
        accentTechEN:
          "Rhotic accent featuring rolled or tapped 'r' sounds and shorter, clipped vowels.",
        accentTechPT:
          "Sotaque rótico caracterizado pelo som vibrante do 'r' e vogais curtas e marcadas.",
        accentTechES:
          "Acento rótico caracterizado por el sonido vibrante de la 'r' y vocales cortas y marcadas.",
      },
    ],
  },
  {
    id: "spain",
    nameEN: "Spain",
    namePT: "Espanha",
    nameES: "España",
    flag: "spain",
    accent: "es-ES",
    cities: [
      {
        id: "mad",
        name: "Madrid",
        namePT: "Madri",
        nameES: "Madrid",
        coords: { x: 470, y: 180 },
        slangs: [
          {
            expression: "Mola mazo!",
            meaningEN: "It is extremely cool!",
            meaningPT: "É super maneiro!",
            meaningES: "¡Mola un montón!",
          },
          {
            expression: "Tío",
            meaningEN: "Guy / Friend (colloquial 'bro')",
            meaningPT: "Cara / Mano",
            meaningES: "Tío / Colega",
          },
        ],
        landmarkEN: "Royal Palace of Madrid",
        landmarkPT: "Palácio Real de Madri",
        landmarkES: "Palacio Real de Madrid",
        landmarkDescEN:
          "The official residence of the Spanish royal family, filled with stunning baroque art.",
        landmarkDescPT:
          "A residência oficial da família real espanhola, repleta de arte barroca impressionante.",
        landmarkDescES:
          "La residencia oficial de la familia real española, llena de impresionante arte barroco.",
        foodEN: "Bocadillo de calamares",
        foodPT: "Sanduíche de Lula",
        foodES: "Bocadillo de calamares",
        foodDescEN: "Crispy fried squid rings served inside crusty Spanish bread.",
        foodDescPT: "Anéis de lula fritos e crocantes servidos dentro de pão espanhol rústico.",
        foodDescES:
          "Anillos de calamar fritos y crujientes servidos dentro de pan español rústico.",
        cultureEN:
          "Vibrant tapas culture, grand plazas, and afternoon siestas in historic neighborhoods.",
        culturePT:
          "Cultura vibrante de tapas, grandes praças e siestas da tarde em bairros históricos.",
        cultureES:
          "Vibrante cultura de tapas, grandes plazas y siestas por la tarde en barrios históricos.",
        accentNameEN: "Castilian Spanish (Madrileño)",
        accentNamePT: "Espanhol Castelhano (Madrileño)",
        accentNameES: "Español Castellano (Madrileño)",
        accentTechEN: "Uses distinction (distinción) where 'z' and 'c' represent the 'th' sound.",
        accentTechPT:
          "Usa distinção (distinción) onde 'z' e 'c' representam o som de 'th' em inglês (/θ/).",
        accentTechES:
          "Usa distinción donde la 'z' y la 'c' se pronuncian con el sonido '/θ/' (como la 'th' inglesa).",
      },
      {
        id: "and",
        name: "Andalucia",
        namePT: "Andaluzia",
        nameES: "Andalucía",
        coords: { x: 468, y: 195 },
        slangs: [
          {
            expression: "Ojú!",
            meaningEN: "Wow! / Good grief!",
            meaningPT: "Nossa! / Caramba!",
            meaningES: "¡Caramba! / ¡Madre mía!",
          },
          {
            expression: "Guiri",
            meaningEN: "Foreigner / Tourist",
            meaningPT: "Estrangeiro / Turista",
            meaningES: "Extranjero / Turista",
          },
        ],
        landmarkEN: "Alhambra of Granada",
        landmarkPT: "Alhambra de Granada",
        landmarkES: "Alhambra de Granada",
        landmarkDescEN:
          "A magnificent Moorish palace complex showcasing breathtaking Islamic architecture.",
        landmarkDescPT:
          "Um magnífico palácio de origem moura exibindo arquitetura islâmica deslumbrante.",
        landmarkDescES:
          "Un magnífico palacio de origen morisco que exhibe una deslumbrante arquitectura islámica.",
        foodEN: "Gazpacho & Salmorejo",
        foodPT: "Gazpacho & Salmorejo",
        foodES: "Gazpacho & Salmorejo",
        foodDescEN: "Chilled, refreshing raw tomato-based vegetable soups.",
        foodDescPT: "Sopas frias e refrescantes de vegetais à base de tomate cru.",
        foodDescES: "Sopas frías y refrescantes de vegetales a base de tomate crudo.",
        cultureEN: "The birthplace of Flamenco, white villages, and beautiful olive tree fields.",
        culturePT: "O berço do Flamenco, charmosos vilarejos brancos e belos olivais.",
        cultureES: "La cuna del Flamenco, pueblos blancos y hermosos campos de olivos.",
        accentNameEN: "Andalusian Spanish",
        accentNamePT: "Espanhol Andaluz",
        accentNameES: "Español Andaluz",
        accentTechEN:
          "Characterized by seseo/ceceo, dropping of final 's', and softening of consonants.",
        accentTechPT:
          "Caracterizado por seseo/ceceo, queda do 's' final e suavização de consoantes.",
        accentTechES:
          "Caracterizado por seseo/ceceo, aspiración o pérdida de la 's' final y debilitamiento consonántico.",
      },
    ],
  },
  {
    id: "mexico",
    nameEN: "Mexico",
    namePT: "México",
    nameES: "México",
    flag: "mexico",
    accent: "es-MX",
    cities: [
      {
        id: "cdmx",
        name: "Mexico City",
        namePT: "Cidade do México",
        nameES: "Ciudad de México",
        coords: { x: 175, y: 260 },
        slangs: [
          {
            expression: "¿Qué onda?",
            meaningEN: "What's up? / How is it going?",
            meaningPT: "E aí? / Como vão as coisas?",
            meaningES: "¿Qué pasa? / ¿Cómo va todo?",
          },
          {
            expression: "Chido",
            meaningEN: "Cool / Great",
            meaningPT: "Legal / Maneiro",
            meaningES: "Chulo / Genial",
          },
        ],
        landmarkEN: "Palacio de Bellas Artes",
        landmarkPT: "Palácio de Belas Artes",
        landmarkES: "Palacio de Bellas Artes",
        landmarkDescEN:
          "A stunning art nouveau cultural center showcasing monumental Mexican murals.",
        landmarkDescPT:
          "Um deslumbrante centro cultural art nouveau exibindo murais monumentais mexicanos.",
        landmarkDescES:
          "Un deslumbrante centro cultural art nouveau que alberga monumentales murales mexicanos.",
        foodEN: "Tacos al Pastor",
        foodPT: "Tacos al Pastor",
        foodES: "Tacos al Pastor",
        foodDescEN: "Pork marinated in chiles and pineapple, served in corn tortillas.",
        foodDescPT: "Carne de porco marinada em pimentas e abacaxi, servida em tortilhas de milho.",
        foodDescES: "Cerdo marinado con chiles y piña, servido en tortillas de maíz.",
        cultureEN: "Mariachi music, Day of the Dead traditions, and deep Aztec history.",
        culturePT: "Música Mariachi, tradições do Dia dos Mortos e profunda história asteca.",
        cultureES:
          "Música de mariachis, tradiciones del Día de los Muertos y una profunda historia azteca.",
        accentNameEN: "Central Mexican Spanish",
        accentNamePT: "Espanhol Mexicano Central",
        accentNameES: "Español Mexicano Central",
        accentTechEN:
          "Vowels are slightly reduced while consonants remain crisp; singsong intonation.",
        accentTechPT:
          "As vogais são ligeiramente reduzidas enquanto as consoantes continuam nítidas; entonação cantada.",
        accentTechES:
          "Las vocales tienden a reducirse mientras las consonantes son muy claras; entonación cantarina.",
      },
    ],
  },
  {
    id: "argentina",
    nameEN: "Argentina",
    namePT: "Argentina",
    nameES: "Argentina",
    flag: "argentina",
    accent: "es-AR",
    cities: [
      {
        id: "ba",
        name: "Buenos Aires",
        namePT: "Buenos Aires",
        nameES: "Buenos Aires",
        coords: { x: 340, y: 430 },
        slangs: [
          {
            expression: "¿Qué hacés, che?",
            meaningEN: "What are you doing, friend?",
            meaningPT: "O que você está fazendo, cara?",
            meaningES: "¿Qué haces, amigo?",
          },
          {
            expression: "Mina / Pibe",
            meaningEN: "Woman / Boy",
            meaningPT: "Mina / Garoto",
            meaningES: "Chica / Chico",
          },
        ],
        landmarkEN: "Obelisco & La Boca",
        landmarkPT: "Obelisco & La Boca",
        landmarkES: "Obelisco & La Boca",
        landmarkDescEN:
          "The central white monument and the colorful corrugated metal homes of Caminito.",
        landmarkDescPT:
          "O monumento branco central e as coloridas casas de chapa ondulada do Caminito.",
        landmarkDescES:
          "El monumento blanco central y las coloridas casas de chapa ondulada de Caminito.",
        foodEN: "Asado & Empanadas",
        foodPT: "Asado & Empanadas",
        foodES: "Asado & Empanadas",
        foodDescEN: "Traditional grilled beef cuts prepared over hot coals.",
        foodDescPT: "Cortes tradicionais de carne de boi grelhados na brasa.",
        foodDescES: "Cortes tradicionales de carne vacuna asados sobre brasas de carbón.",
        cultureEN: "Tango dancing in the streets, football passion, and European editorial style.",
        culturePT:
          "Dança de Tango nas ruas, paixão futebolística e estilo editorial de inspiração europeia.",
        cultureES:
          "Tango en las calles, pasión por el fútbol y un estilo editorial de inspiración europea.",
        accentNameEN: "Rioplatense Spanish",
        accentNamePT: "Espanhol Rioplatense",
        accentNameES: "Español Rioplatense",
        accentTechEN:
          "Features voseo (using 'vos' instead of 'tú') and sheísmo (pronouncing 'll' and 'y' as 'sh').",
        accentTechPT:
          "Apresenta o voseo (uso de 'vos' em vez de 'tú') e sheísmo (som de 'll' e 'y' pronunciados como 'ch').",
        accentTechES:
          "Presenta voseo (uso de 'vos' en lugar de 'tú') y sheísmo (pronunciación de 'll' e 'y' como 'sh').",
      },
    ],
  },
  {
    id: "colombia",
    nameEN: "Colombia",
    namePT: "Colômbia",
    nameES: "Colombia",
    flag: "colombia",
    accent: "es-CO",
    cities: [
      {
        id: "bog",
        name: "Bogota",
        namePT: "Bogotá",
        nameES: "Bogotá",
        coords: { x: 280, y: 310 },
        slangs: [
          {
            expression: "Qué bacano!",
            meaningEN: "How cool! / Great!",
            meaningPT: "Que bacana! / Muito legal!",
            meaningES: "¡Qué chulo! / ¡Excelente!",
          },
          {
            expression: "Parce / Parcero",
            meaningEN: "Friend / Buddy",
            meaningPT: "Parceiro / Amigo",
            meaningES: "Colega / Amigo",
          },
        ],
        landmarkEN: "Monserrate Sanctuary",
        landmarkPT: "Santuário de Monserrate",
        landmarkES: "Santuario de Monserrate",
        landmarkDescEN:
          "A historic church sitting 3,152 meters above sea level overlooking Bogota.",
        landmarkDescPT:
          "Uma igreja histórica localizada a 3.152m de altitude com vista panorâmica de Bogotá.",
        landmarkDescES:
          "Una iglesia histórica a 3.152 metros de altura sobre el nivel del mar con vistas de Bogotá.",
        foodEN: "Bandeja Paisa",
        foodPT: "Bandeja Paisa",
        foodES: "Bandeja Paisa",
        foodDescEN: "Generous platter with beans, rice, ground beef, chorizo, and avocado.",
        foodDescPT: "Prato generoso com feijão, arroz, carne moída, chouriço e abacate.",
        foodDescES: "Plato abundante con frijoles, arroz, carne molida, chorizo y aguacate.",
        cultureEN: "Rich coffee landscape, Cumbia rhythm, and extreme warmth of its people.",
        culturePT: "Rica paisagem cafeeira, ritmo de Cumbia e extrema gentileza de seu povo.",
        cultureES: "Rico paisaje cafetero, ritmo de Cumbia y la inmensa amabilidad de su gente.",
        accentNameEN: "Bogotano / Rolo Accent",
        accentNamePT: "Sotaque Bogotano (Rolo)",
        accentNameES: "Acento Bogotano (Rolo)",
        accentTechEN:
          "Known for its clarity, pronoun 'usted' usage even among friends, and slow tempo.",
        accentTechPT:
          "Conhecido pela clareza, uso frequente de 'usted' mesmo entre amigos próximos, e andamento pausado.",
        accentTechES:
          "Conocido por su gran claridad, el uso de 'usted' incluso entre amigos y un ritmo pausado.",
      },
    ],
  },
  {
    id: "brazil",
    nameEN: "Brazil",
    namePT: "Brasil",
    nameES: "Brasil",
    flag: "brazil",
    accent: "pt-BR",
    cities: [
      {
        id: "sp",
        name: "São Paulo",
        namePT: "São Paulo",
        nameES: "São Paulo",
        coords: { x: 380, y: 380 },
        slangs: [
          {
            expression: "Mano / Meu",
            meaningEN: "Bro / Dude",
            meaningPT: "Mano / Meu",
            meaningES: "Tío / Hermano",
          },
          {
            expression: "Rolê",
            meaningEN: "Going out / Stroll",
            meaningPT: "Rolê / Passeio",
            meaningES: "Vuelta / Salida",
          },
        ],
        landmarkEN: "Avenida Paulista & MASP",
        landmarkPT: "Avenida Paulista & MASP",
        landmarkES: "Avenida Paulista & MASP",
        landmarkDescEN:
          "The bustling financial artery and the iconic floating red museum of modern art.",
        landmarkDescPT:
          "A movimentada artéria financeira e o icônico museu vermelho suspenso de arte moderna.",
        landmarkDescES:
          "La bulliciosa arteria financiera y el icónico museo rojo flotante de arte moderno.",
        foodEN: "Coxinha",
        foodPT: "Coxinha",
        foodES: "Coxinha",
        foodDescEN: "Tear-shaped fried dough filled with shredded chicken.",
        foodDescPT: "Salgado frito em formato de gota recheado com frango desfiado.",
        foodDescES: "Masa frita en forma de gota rellena de pollo desmenuzado.",
        cultureEN: "Huge business hub, heavy immigrant influence, and endless culinary options.",
        culturePT:
          "Gigantesco polo de negócios, forte influência de imigrantes e gastronomia infinita.",
        cultureES:
          "Enorme centro de negocios, gran influencia de inmigrantes y gastronomía infinita.",
        accentNameEN: "Paulistano Accent",
        accentNamePT: "Sotaque Paulistano",
        accentNameES: "Acento Paulistano",
        accentTechEN:
          "Features flat 'r' sounds at the end of words and fronted vowels compared to Rio.",
        accentTechPT:
          "Apresenta o 'r' fricativo (porta) e vogais médias ligeiramente mais fechadas.",
        accentTechES:
          "Presenta la 'r' fricativa al final de las sílabas y vocales más cerradas en comparación con Río.",
      },
      {
        id: "rio",
        name: "Rio de Janeiro",
        namePT: "Rio de Janeiro",
        nameES: "Río de Janeiro",
        coords: { x: 395, y: 370 },
        slangs: [
          {
            expression: "Mermão",
            meaningEN: "My brother (intense 'bro')",
            meaningPT: "Meu irmão (mermão)",
            meaningES: "Hermano mío",
          },
          {
            expression: "Caraca!",
            meaningEN: "Wow! / Awesome! (expression of shock)",
            meaningPT: "Caraca! / Caramba!",
            meaningES: "¡Caramba! / ¡Guau!",
          },
        ],
        landmarkEN: "Christ the Redeemer & Sugarloaf",
        landmarkPT: "Cristo Redentor & Pão de Açúcar",
        landmarkES: "Cristo Redentor & Pan de Azúcar",
        landmarkDescEN:
          "The massive Art Deco statue overlooking the ocean and the iconic granite peaks.",
        landmarkDescPT:
          "A gigantesca estátua Art Déco com vista para o oceano e os icônicos morros de granito.",
        landmarkDescES:
          "La gigantesca estatua Art Déco con vistas al océano y los icónicos morros de granito.",
        foodEN: "Feijoada",
        foodPT: "Feijoada",
        foodES: "Feijoada",
        foodDescEN: "Rich black bean stew simmered with pork cuts, served with orange slices.",
        foodDescPT:
          "Gisado rico de feijão preto cozido com carnes suínas, servido com couve e laranja.",
        foodDescES:
          "Guisado de frijoles negros cocido con carne de cerdo, servido con col y naranja.",
        cultureEN: "Bossa Nova birthplace, beach footvolley, and the grandest Carnival on Earth.",
        culturePT:
          "Berço da Bossa Nova, futevôlei nas praias de Copacabana e o maior Carnaval da Terra.",
        cultureES: "Cuna de la Bossa Nova, futvóley en la playa y el mayor Carnaval del planeta.",
        accentNameEN: "Carioca Accent",
        accentNamePT: "Sotaque Carioca",
        accentNameES: "Acento Carioca",
        accentTechEN:
          "Characterized by palatalization (sh-sound for 's' before consonants and at the end of words).",
        accentTechPT:
          "Caracterizado pelo 'chiado' (som de 'x' ou 'sh' para a letra 's' final ou antes de consoantes).",
        accentTechES:
          "Caracterizado por el 'chiado' (pronunciación de la 's' como el sonido 'sh' antes de consonantes).",
      },
    ],
  },
  {
    id: "portugal",
    nameEN: "Portugal",
    namePT: "Portugal",
    nameES: "Portugal",
    flag: "portugal",
    accent: "pt-PT",
    cities: [
      {
        id: "lis",
        name: "Lisboa",
        namePT: "Lisboa",
        nameES: "Lisboa",
        coords: { x: 450, y: 180 },
        slangs: [
          {
            expression: "Bué da fixe!",
            meaningEN: "Super cool! / Awesome!",
            meaningPT: "Bué da fixe! / Muito legal!",
            meaningES: "¡Buenísimo! / ¡Muy guay!",
          },
          {
            expression: "Gajo",
            meaningEN: "Guy / Girl",
            meaningPT: "Gajo / Gaja",
            meaningES: "Chico / Chica",
          },
        ],
        landmarkEN: "Belém Tower",
        landmarkPT: "Torre de Belém",
        landmarkES: "Torre de Belém",
        landmarkDescEN:
          "The beautiful fortified medieval tower sitting on the banks of the Tagus River.",
        landmarkDescPT: "A bela torre medieval fortificada localizada às margens do Rio Tejo.",
        landmarkDescES: "La hermosa torre medieval fortificada ubicada a orillas del río Tajo.",
        foodEN: "Pastel de Nata",
        foodPT: "Pastel de Nata",
        foodES: "Pastel de Nata",
        foodDescEN: "Crispy puff pastry tart filled with rich, caramelized egg custard.",
        foodDescPT: "Torta de massa folhada crocante recheada com creme de ovos caramelizado.",
        foodDescES: "Cesta de hojaldre crujiente rellena con crema de yemas caramelizada.",
        cultureEN: "Melancholic Fado music, historic yellow trams, and tiled walls.",
        culturePT:
          "Música melancólica de Fado, bondes amarelos históricos e paredes revestidas de azulejos.",
        cultureES: "Música melancólica de Fado, tranvías históricos y fachadas de azulejos.",
        accentNameEN: "European Portuguese (Lisboeta)",
        accentNamePT: "Português Europeu (Lisboeta)",
        accentNameES: "Portugués Europeo (Lisboeta)",
        accentTechEN:
          "Features stress-timed rhythm (vowel reduction) causing it to sound slightly Slavic to untrained ears.",
        accentTechPT:
          "Apresenta ritmo acentual forte (redução extrema de vogais átonas), gerando uma sonoridade semifechada.",
        accentTechES:
          "Presenta un ritmo acentual fuerte (reducción de vocales átonas) que le da una sonoridad más cerrada.",
      },
    ],
  },
  {
    id: "canada",
    nameEN: "Canada",
    namePT: "Canadá",
    nameES: "Canadá",
    flag: "canada",
    accent: "en-CA",
    cities: [
      {
        id: "tor",
        name: "Toronto",
        namePT: "Toronto",
        nameES: "Toronto",
        coords: { x: 230, y: 155 },
        slangs: [
          {
            expression: "Toque",
            meaningEN: "A warm winter beanie hat",
            meaningPT: "Gorro de inverno",
            meaningES: "Gorro de invierno",
          },
          {
            expression: "Two-four",
            meaningEN: "A case of 24 beers",
            meaningPT: "Engradado com 24 cervejas",
            meaningES: "Caja de 24 cervezas",
          },
        ],
        landmarkEN: "CN Tower",
        landmarkPT: "Torre CN",
        landmarkES: "Torre CN",
        landmarkDescEN:
          "The massive communications tower dominating the diverse skyline above Lake Ontario.",
        landmarkDescPT:
          "A gigantesca torre de comunicações que domina a paisagem diversificada sobre o Lago Ontário.",
        landmarkDescES:
          "La gigantesca torre de comunicaciones que domina el diverso horizonte sobre el lago Ontario.",
        foodEN: "Poutine",
        foodPT: "Poutine",
        foodES: "Poutine",
        foodDescEN: "Crispy fries smothered in rich brown gravy and fresh cheese curds.",
        foodDescPT:
          "Batatas fritas crocantes cobertas com molho de carne escuro e pedaços de queijo fresco.",
        foodDescES:
          "Papas fritas crujientes cubiertas con salsa de carne oscura y trozos de queso fresco.",
        cultureEN:
          "One of the most multicultural cities globally, blending American pace with British courtesy.",
        culturePT:
          "Uma das cidades mais multiculturais do mundo, misturando o ritmo americano com a cortesia britânica.",
        cultureES:
          "Una de las ciudades más multiculturales del mundo, que combina el ritmo americano con la cortesía británica.",
        accentNameEN: "Canadian English (Central)",
        accentNamePT: "Inglês Canadense (Central)",
        accentNameES: "Inglés Canadiense (Central)",
        accentTechEN:
          "Features 'Canadian raising' (e.g., 'about' sounding slightly like 'a-boot') and distinct cot-caught merger.",
        accentTechPT:
          "Apresenta o 'Canadian raising' (ex: 'about' soa levemente como 'a-boot') e fusão de vogais.",
        accentTechES:
          "Presenta el 'Canadian raising' (ej: 'about' suena ligeramente como 'a-boot') y fusión de vocales.",
      },
      {
        id: "van",
        name: "Vancouver",
        namePT: "Vancouver",
        nameES: "Vancouver",
        coords: { x: 130, y: 145 },
        slangs: [
          {
            expression: "Skookum",
            meaningEN: "Strong / excellent",
            meaningPT: "Forte / Excelente",
            meaningES: "Fuerte / Excelente",
          },
          {
            expression: "Raincouver",
            meaningEN: "Nickname due to constant rain",
            meaningPT: "Apelido devido à chuva constante",
            meaningES: "Apodo debido a la lluvia constante",
          },
        ],
        landmarkEN: "Stanley Park",
        landmarkPT: "Parque Stanley",
        landmarkES: "Parque Stanley",
        landmarkDescEN:
          "A massive, lush evergreen urban forest park almost entirely surrounded by the Pacific Ocean.",
        landmarkDescPT:
          "Um gigantesco parque urbano de floresta temperada quase totalmente cercado pelo Oceano Pacífico.",
        landmarkDescES:
          "Un gigantesco parque urbano de bosque templado casi rodeado por el Océano Pacífico.",
        foodEN: "Wild Pacific Salmon",
        foodPT: "Salmão Selvagem do Pacífico",
        foodES: "Salmón Salvaje del Pacífico",
        foodDescEN: "Fresh salmon grilled over aromatic cedar wood planks.",
        foodDescPT: "Salmão fresco grelhado sobre tábuas de madeira de cedro aromático.",
        foodDescES: "Salmón fresco asado sobre tablas de madera de cedro aromático.",
        cultureEN:
          "Deep passion for outdoor wellness, coastal hiking, winter sports, and rain aesthetic.",
        culturePT:
          "Paixão pelo bem-estar ao livre, trilhas costeiras, esportes de neve e a estética da chuva.",
        cultureES:
          "Pasión por el bienestar al aire libre, senderismo costero, deportes de nieve y la lluvia.",
        accentNameEN: "Pacific Northwest Accent",
        accentNamePT: "Sotaque do Noroeste Pacífico",
        accentNameES: "Acento del Noroeste del Pacífico",
        accentTechEN: "Highly standardized and neutral, with cot-caught merger fully complete.",
        accentTechPT:
          "Altamente padronizado e neutro, com a fusão de vogais 'cot' e 'caught' totalmente concluída.",
        accentTechES:
          "Sumamente estandarizado y neutro, con la fusión de las vocales 'cot' y 'caught' completada.",
      },
    ],
  },
  {
    id: "australia",
    nameEN: "Australia",
    namePT: "Austrália",
    nameES: "Australia",
    flag: "australia",
    accent: "en-AU",
    cities: [
      {
        id: "syd",
        name: "Sydney",
        namePT: "Sydney",
        nameES: "Sydney",
        coords: { x: 880, y: 410 },
        slangs: [
          {
            expression: "G'day mate!",
            meaningEN: "Hello friend!",
            meaningPT: "Olá, amigo!",
            meaningES: "¡Hola, amigo!",
          },
          {
            expression: "Fair dinkum",
            meaningEN: "True, genuine, or honest",
            meaningPT: "Verdadeiro / Genuíno / Honesto",
            meaningES: "Verdadero / Genuino / Honesto",
          },
        ],
        landmarkEN: "Sydney Opera House",
        landmarkPT: "Ópera de Sydney",
        landmarkES: "Ópera de Sydney",
        landmarkDescEN:
          "The expressionist masterpiece with white sail-like shells defining the harbor.",
        landmarkDescPT:
          "A obra-prima expressionista com telhados em forma de conchas brancas que define o porto.",
        landmarkDescES:
          "La obra maestra expresionista con cubiertas en forma de conchas blancas que define el puerto.",
        foodEN: "Vegemite on Toast",
        foodPT: "Vegemite na Torrada",
        foodES: "Vegemite en Tostada",
        foodDescEN: "A thick, salty, dark brown yeast extract spread thinly on buttered toast.",
        foodDescPT:
          "Uma pasta escura e salgada de levedura, passada finamente sobre torrada quente com manteiga.",
        foodDescES:
          "Pasta oscura y salada de extracto de levadura, untada finamente sobre tostada con mantequilla.",
        cultureEN:
          "Surf culture, outdoor harbor living, beach volleyball, and early-riser coffee runs.",
        culturePT:
          "Cultura do surfe, lazer à beira-mar no porto e rotina matinal ativa focada em bem-estar.",
        cultureES:
          "Cultura del surf, vida al aire libre en el puerto y una rutina activa por las mañanas.",
        accentNameEN: "General Australian Accent",
        accentNamePT: "Sotaque Australiano Geral",
        accentNameES: "Acento Australiano General",
        accentTechEN:
          "Non-rhotic, vowel shifting towards front closed space (e.g., 'day' sounds closer to 'dye').",
        accentTechPT:
          "Não-rótico, com vogais alongadas e modificadas (ex: 'day' soa mais próximo a 'dye').",
        accentTechES:
          "No es rótico y presenta vocales alargadas y modificadas (ej: 'day' suena casi como 'dye').",
      },
      {
        id: "mel",
        name: "Melbourne",
        namePT: "Melbourne",
        nameES: "Melbourne",
        coords: { x: 860, y: 425 },
        slangs: [
          {
            expression: "No worries!",
            meaningEN: "Don't mention it",
            meaningPT: "Sem problemas!",
            meaningES: "No te preocupes",
          },
          {
            expression: "Choccy biccy",
            meaningEN: "Chocolate biscuit",
            meaningPT: "Biscoito de chocolate",
            meaningES: "Galleta de chocolate",
          },
        ],
        landmarkEN: "Flinders Street Station & Laneways",
        landmarkPT: "Estação Flinders Street & Becos de Arte",
        landmarkES: "Estación de Flinders Street & Callejones",
        landmarkDescEN:
          "The historic golden railway hub next to narrow lanes filled with world-class graffiti murals.",
        landmarkDescPT:
          "O histórico terminal ferroviário dourado ao lado de becos estreitos repletos de grafites artísticos.",
        landmarkDescES:
          "La histórica terminal ferroviaria dorada junto a callejones estrechos llenos de murales artísticos.",
        foodEN: "Flat White Coffee",
        foodPT: "Café Flat White",
        foodES: "Café Flat White",
        foodDescEN: "Velvety microfoam poured over double shots of espresso.",
        foodDescPT: "Microespuma aveludada despejada sobre um espresso duplo.",
        foodDescES: "Microespuma aterciopelada vertida sobre un espresso doble.",
        cultureEN:
          "The world capital of specialty coffee, indie music venues, and vintage art galleries.",
        culturePT:
          "A capital mundial do café especial, espaços de música independente e galerias de arte vintage.",
        cultureES:
          "La capital mundial del café de especialidad, espacios de música independiente y arte retro.",
        accentNameEN: "Cultivated Australian",
        accentNamePT: "Australiano Cultivado",
        accentNameES: "Australiano Cultivado",
        accentTechEN:
          "Strongly influenced by British RP, maintaining crisp consonants and high vowel rounding.",
        accentTechPT:
          "Fortemente influenciado pela RP britânica, mantendo consoantes nítidas e vogais bem arredondadas.",
        accentTechES:
          "Fuertemente influenciado por la RP británica, manteniendo consonantes claras y vocales redondeadas.",
      },
    ],
  },
  {
    id: "france",
    nameEN: "France",
    namePT: "França",
    nameES: "Francia",
    flag: "france",
    accent: "fr-FR",
    cities: [
      {
        id: "par",
        name: "Paris",
        namePT: "Paris",
        nameES: "París",
        coords: { x: 485, y: 150 },
        slangs: [
          {
            expression: "C'est la vie!",
            meaningEN: "That's life!",
            meaningPT: "É a vida!",
            meaningES: "¡Así es la vida!",
          },
          {
            expression: "Chouette",
            meaningEN: "Cool / Great",
            meaningPT: "Legal / Bacana",
            meaningES: "Guay / Genial",
          },
        ],
        landmarkEN: "Eiffel Tower & Louvre",
        landmarkPT: "Torre Eiffel & Museu do Louvre",
        landmarkES: "Torre Eiffel & Museo del Louvre",
        landmarkDescEN: "The romantic iron lattice tower and the world's largest art museum.",
        landmarkDescPT: "A romântica torre de ferro e o maior museu de arte do mundo.",
        landmarkDescES: "La romántica torre de hierro y el museo de arte más grande del mundo.",
        foodEN: "Croissant & Baguette",
        foodPT: "Croissant & Baguette",
        foodES: "Cruasán & Baguette",
        foodDescEN: "Buttery, flaky pastries and long crusty French bread.",
        foodDescPT: "Folhados amanteigados crocantes e pão francês clássico alongado.",
        foodDescES: "Hojaldre de mantequilla crujiente y pan francés clásico alargado.",
        cultureEN: "High fashion, cafe philosophy, and rich literary history.",
        culturePT: "Alta costura, filosofia de cafés e uma rica história literária.",
        cultureES: "Alta costura, filosofía de cafés y una rica historia literaria.",
        accentNameEN: "French Accent",
        accentNamePT: "Sotaque Francês",
        accentNameES: "Acento Francés",
        accentTechEN: "Soft, guttural 'r' sounds and even syllable stress.",
        accentTechPT: "Sons de 'r' suaves e guturais, com acentuação silábica regular.",
        accentTechES: "Sonidos de 'r' suaves y guturales, con acentuación silábica regular.",
      },
    ],
  },
  {
    id: "germany",
    nameEN: "Germany",
    namePT: "Alemanha",
    nameES: "Alemania",
    flag: "germany",
    accent: "de-DE",
    cities: [
      {
        id: "ber",
        name: "Berlin",
        namePT: "Berlim",
        nameES: "Berlín",
        coords: { x: 510, y: 140 },
        slangs: [
          {
            expression: "Alles klar?",
            meaningEN: "Everything cool / clear?",
            meaningPT: "Tudo certo?",
            meaningES: "¿Todo bien?",
          },
          {
            expression: "Geil",
            meaningEN: "Awesome / Cool",
            meaningPT: "Maneiro / Excelente",
            meaningES: "Genial / Increíble",
          },
        ],
        landmarkEN: "Brandenburg Gate",
        landmarkPT: "Portão de Brandemburgo",
        landmarkES: "Puerta de Brandeburgo",
        landmarkDescEN:
          "An 18th-century neoclassical monument representing peace and national unity.",
        landmarkDescPT:
          "Monumento neoclássico do século XVIII representando a paz e unidade nacional.",
        landmarkDescES:
          "Monumento neoclásico del siglo XVIII que representa la paz y la unidad nacional.",
        foodEN: "Currywurst & Pretzel",
        foodPT: "Currywurst & Pretzel",
        foodES: "Currywurst & Pretzel",
        foodDescEN:
          "Steamed, then fried pork sausage seasoned with curry ketchup and baked pastry.",
        foodDescPT: "Salsicha grelhada temperada com ketchup de curry, acompanhada por pretzel.",
        foodDescES: "Salchicha a la parrilla sazonada con kétchup de curry, acompañada de pretzel.",
        cultureEN: "Rich philosophy, classical music heritage, and industrial design innovation.",
        culturePT: "Rica filosofia, legado de música clássica e inovação em design industrial.",
        cultureES: "Rica filosofía, legado de música clásica e innovación en diseño industrial.",
        accentNameEN: "German Accent",
        accentNamePT: "Sotaque Alemão",
        accentNameES: "Acento Alemán",
        accentTechEN: "Distinct devoicing of final consonants and glottal stops.",
        accentTechPT: "Dessonsorização distinta de consoantes finais e pausas glotais nítidas.",
        accentTechES: "Desonorización distinta de consonantes finales y oclusivas glotales claras.",
      },
    ],
  },
  {
    id: "italy",
    nameEN: "Italy",
    namePT: "Itália",
    nameES: "Italia",
    flag: "italy",
    accent: "it-IT",
    cities: [
      {
        id: "rom",
        name: "Rome",
        namePT: "Roma",
        nameES: "Roma",
        coords: { x: 510, y: 170 },
        slangs: [
          {
            expression: "Mamma mia!",
            meaningEN: "Oh my goodness!",
            meaningPT: "Minha nossa!",
            meaningES: "¡Madre mía!",
          },
          {
            expression: "Allora",
            meaningEN: "So / Well",
            meaningPT: "Então / Bem",
            meaningES: "Entonces / Bueno",
          },
        ],
        landmarkEN: "Colosseum & Trevi Fountain",
        landmarkPT: "Coliseu & Fontana di Trevi",
        landmarkES: "Coliseo & Fontana di Trevi",
        landmarkDescEN:
          "The ancient amphitheater of gladiators and the breathtaking baroque wishing fountain.",
        landmarkDescPT:
          "O antigo anfiteatro de gladiadores e a deslumbrante fonte barroca dos desejos.",
        landmarkDescES:
          "El antiguo anfiteatro de gladiadores y la impresionante fuente barroca de los deseos.",
        foodEN: "Carbonara & Gelato",
        foodPT: "Carbonara & Gelato",
        foodES: "Carbonara & Gelato",
        foodDescEN: "Creamy egg and guanciale pasta, followed by dense Italian ice cream.",
        foodDescPT: "Massa cremosa com ovos e guanciale, acompanhada por gelato italiano.",
        foodDescES: "Pasta cremosa con huevos y guanciale, acompañada de gelato italiano.",
        cultureEN: "Art history, operatic traditions, and deep family-centered social life.",
        culturePT:
          "História da arte, tradições operísticas e forte convívio social centrado na família.",
        cultureES:
          "Historia del arte, tradiciones operísticas y una fuerte vida social centrada en la familia.",
        accentNameEN: "Italian Accent",
        accentNamePT: "Sotaque Italiano",
        accentNameES: "Acento Italiano",
        accentTechEN:
          "Vowel addition at the end of consonant-ending English words; melodic rhythm.",
        accentTechPT:
          "Adição sutil de vogais ao final de palavras terminadas em consoante; ritmo melódico.",
        accentTechES:
          "Adición sutil de vocales al final de palabras que terminan en consonante; ritmo melódico.",
      },
    ],
  },
  {
    id: "japan",
    nameEN: "Japan",
    namePT: "Japão",
    nameES: "Japón",
    flag: "japan",
    accent: "ja-JP",
    cities: [
      {
        id: "tok",
        name: "Tokyo",
        namePT: "Tóquio",
        nameES: "Tokio",
        coords: { x: 850, y: 200 },
        slangs: [
          {
            expression: "Sugoi!",
            meaningEN: "Amazing! / Great!",
            meaningPT: "Incrível! / Sensacional!",
            meaningES: "¡Increíble! / ¡Genial!",
          },
          {
            expression: "Otsukaresama",
            meaningEN: "Thank you for your hard work",
            meaningPT: "Bom trabalho / Obrigado pelo esforço",
            meaningES: "Gracias por tu esfuerzo",
          },
        ],
        landmarkEN: "Shibuya Crossing & Senso-ji",
        landmarkPT: "Cruzamento de Shibuya & Templo Senso-ji",
        landmarkES: "Cruce de Shibuya & Templo Senso-ji",
        landmarkDescEN:
          "The busiest pedestrian crossing in the world next to Tokyo's oldest temple.",
        landmarkDescPT:
          "O cruzamento de pedestres mais movimentado do mundo ao lado do templo mais antigo de Tóquio.",
        landmarkDescES:
          "El cruce de peatones más concurrido del mundo junto al templo más antiguo de Tokio.",
        foodEN: "Sushi & Ramen",
        foodPT: "Sushi & Lámen",
        foodES: "Sushi & Ramen",
        foodDescEN: "Fresh raw fish on seasoned rice and rich broth noodle soup.",
        foodDescPT:
          "Peixe fresco cru sobre arroz temperado e sopa quente de macarrão com caldo rico.",
        foodDescES: "Pescado fresco crudo sobre arroz sazonado y sopa de fideos con caldo espeso.",
        cultureEN: "The harmony of ancient shrines, futuristic technology, and extreme respect.",
        culturePT: "A harmonia de templos antigos, tecnologia futurista e respeito extremo.",
        cultureES: "La armonía de templos antiguos, tecnología futurista y un respeto extremo.",
        accentNameEN: "Japanese Accent",
        accentNamePT: "Sotaque Japonês",
        accentNameES: "Acento Japonés",
        accentTechEN: "Flat syllable timing and syllable-final vowel insertions.",
        accentTechPT: "Tempo silábico uniforme e inserção de vogais finais em consoantes.",
        accentTechES: "Ritmo silábico uniforme e inserción de vocales al final de consonantes.",
      },
    ],
  },
  {
    id: "china",
    nameEN: "China",
    namePT: "China",
    nameES: "China",
    flag: "china",
    accent: "zh-CN",
    cities: [
      {
        id: "bei",
        name: "Beijing",
        namePT: "Pequim",
        nameES: "Pekín",
        coords: { x: 770, y: 200 },
        slangs: [
          {
            expression: "Taikaila!",
            meaningEN: "Super cool!",
            meaningPT: "Muito maneiro!",
            meaningES: "¡Buenísimo!",
          },
          {
            expression: "Jiayou!",
            meaningEN: "Go for it! / Let's go!",
            meaningPT: "Força! / Vá em frente!",
            meaningES: "¡Ánimo! / ¡Adelante!",
          },
        ],
        landmarkEN: "Great Wall of China",
        landmarkPT: "Grande Muralha da China",
        landmarkES: "Gran Muralla China",
        landmarkDescEN:
          "The ancient defensive military fortifications spanning thousands of miles.",
        landmarkDescPT:
          "As antigas fortificações defensivas militares que se estendem por milhares de quilômetros.",
        landmarkDescES:
          "Las antiguas fortificaciones militares defensivas que se extienden a lo largo de miles de kilómetros.",
        foodEN: "Peking Duck & Dumplings",
        foodPT: "Pato de Pequim & Dumplings",
        foodES: "Pato de Pekín & Dumplings",
        foodDescEN: "Thin-skinned roasted duck served with pancakes and filled dough pockets.",
        foodDescPT: "Pato assado de pele crocante servido com panquecas e massas recheadas.",
        foodDescES: "Pato asado de piel crujiente servido con panqueques y masas rellenas.",
        cultureEN: "Deep ancient heritage, tea ceremonies, and fast modern development.",
        culturePT:
          "Profundo patrimônio histórico, cerimônias de chá e rápido desenvolvimento tecnológico.",
        cultureES:
          "Profundo patrimonio histórico, ceremonias de té y rápido desarrollo tecnológico.",
        accentNameEN: "Mandarin Chinese Accent",
        accentNamePT: "Sotaque Mandarim",
        accentNameES: "Acento Mandarín",
        accentTechEN: "Tonal language influences on pitch, vowel length, and final consonants.",
        accentTechPT:
          "Influências de linguagem tonal na afinação, duração de vogais e consoantes finais.",
        accentTechES:
          "Influencias de lenguaje tonal en la afinación, longitud de vocales y consonantes finales.",
      },
    ],
  },
  {
    id: "india",
    nameEN: "India",
    namePT: "Índia",
    nameES: "India",
    flag: "india",
    accent: "en-IN",
    cities: [
      {
        id: "del",
        name: "New Delhi",
        namePT: "Nova Déli",
        nameES: "Nueva Delhi",
        coords: { x: 690, y: 250 },
        slangs: [
          {
            expression: "Jugaad",
            meaningEN: "Creative work-around / Hack",
            meaningPT: "Jeitinho / Solução improvisada",
            meaningES: "Solución improvisada / Truco",
          },
          {
            expression: "Achha",
            meaningEN: "I see / Good / Okay",
            meaningPT: "Entendi / Sim / Certo",
            meaningES: "Entiendo / Vale / De acuerdo",
          },
        ],
        landmarkEN: "Taj Mahal",
        landmarkPT: "Taj Mahal",
        landmarkES: "Taj Mahal",
        landmarkDescEN: "The ivory-white marble mausoleum on the south bank of the Yamuna river.",
        landmarkDescPT: "O mausoléu de mármore branco-marfim na margem sul do rio Yamuna.",
        landmarkDescES: "El mausoleo de mármore blanco en la orilla sur del río Yamuna.",
        foodEN: "Butter Chicken & Naan",
        foodPT: "Butter Chicken & Naan",
        foodES: "Butter Chicken & Naan",
        foodDescEN: "Spiced tomato and butter curry sauce chicken served with flatbread.",
        foodDescPT: "Frango com molho curry cremoso de tomate e manteiga servido com pão naan.",
        foodDescES:
          "Pollo con salsa de curry cremosa de tomate y mantequilla servido con pan naan.",
        cultureEN: "Bollywood cinema, rich spice bazaars, and colorful festivals of light.",
        culturePT:
          "Cinema de Bollywood, bazares ricos em especiarias e festivais coloridos de luzes.",
        cultureES: "Cine de Bollywood, bazares ricos en especias y coloridos festivales de luces.",
        accentNameEN: "Indian English Accent",
        accentNamePT: "Sotaque Indiano",
        accentNameES: "Acento Indiano",
        accentTechEN: "Retroflex consonant production and syllable-timed pronunciation.",
        accentTechPT: "Produção de consoantes retroflexas e pronúncia cronometrada por sílabas.",
        accentTechES:
          "Producción de consonantes retroflexas y pronunciación cronometrada por sílabas.",
      },
    ],
  },
  {
    id: "southafrica",
    nameEN: "South Africa",
    namePT: "África do Sul",
    nameES: "Sudáfrica",
    flag: "southafrica",
    accent: "en-ZA",
    cities: [
      {
        id: "cpt",
        name: "Cape Town",
        namePT: "Cidade do Cabo",
        nameES: "Ciudad del Cabo",
        coords: { x: 560, y: 430 },
        slangs: [
          {
            expression: "Lekker",
            meaningEN: "Great / Delicious / Nice",
            meaningPT: "Ótimo / Delicioso / Legal",
            meaningES: "Genial / Delicioso / Lindo",
          },
          {
            expression: "Howzit",
            meaningEN: "How is it going? / Hello",
            meaningPT: "Como vai? / E aí?",
            meaningES: "¿Cómo va todo? / Hola",
          },
        ],
        landmarkEN: "Table Mountain",
        landmarkPT: "Table Mountain (Montanha da Mesa)",
        landmarkES: "Table Mountain",
        landmarkDescEN:
          "The flat-topped mountain forming a prominent landmark overlooking the city.",
        landmarkDescPT:
          "A montanha de topo plano que forma um marco proeminente com vista para a cidade.",
        landmarkDescES:
          "La montaña de cima plana que forma un hito prominente con vistas a la ciudad.",
        foodEN: "Biltong & Bobotie",
        foodPT: "Biltong & Bobotie",
        foodES: "Biltong & Bobotie",
        foodDescEN: "Cured dried meat and spiced minced meat baked with an egg-based topping.",
        foodDescPT: "Carne seca curada e carne moída temperada cozida com cobertura à base de ovo.",
        foodDescES:
          "Carne seca curada y carne picada sazonada horneada con cobertura a base de huevo.",
        cultureEN:
          "The Rainbow Nation with 11 official languages, wildlife reserves, and vineyards.",
        culturePT: "A Nação Arco-Íris com 11 idiomas oficiais, reservas ecológicas e vinhedos.",
        cultureES: "La Nación Arcoíris con 11 idiomas oficiales, reservas ecológicas y viñedos.",
        accentNameEN: "South African Accent",
        accentNamePT: "Sotaque Sul-Africano",
        accentNameES: "Acento Sudafricano",
        accentTechEN: "Monophthongal vowels and clear Afrikaans and British English blending.",
        accentTechPT: "Vogais monotongadas e mistura clara de africâner e inglês britânico.",
        accentTechES: "Vocales monoptongadas y mezcla clara de afrikáans e inglés británico.",
      },
    ],
  },
];
