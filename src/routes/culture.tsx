import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useStore } from "@/hooks/useStore";
import { toast } from "sonner";
import {
  MapPin,
  Utensils,
  Landmark,
  Sparkles,
  Volume2,
  Globe,
  Volume1,
  ArrowRight,
  HelpCircle,
  Compass,
} from "@/components/lume/CustomIcons";
import { IlluMapPin, IlluGlobe } from "@/components/lume/Illustrations";

export const Route = createFileRoute("/culture")({
  component: CultureHubPage,
});

import { COUNTRIES, CountryData, CityInfo, Slang } from "@/lib/cultureData";
import { WorldGlobe3D } from "@/components/WorldGlobe3D";

const DEPRECATED_COUNTRIES: CountryData[] = [
  {
    id: "usa",
    nameEN: "United States",
    namePT: "Estados Unidos",
    nameES: "Estados Unidos",
    flag: "🇺🇸",
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
        accentTechEN:
          "Drops the 'r' sounds at the end of words unless followed by a vowel (e.g., 'car' becomes 'cah').",
        accentTechPT:
          "Omite o som do 'r' no final das palavras, a menos que seja seguido por vogal (ex: 'car' vira 'cah').",
        accentTechES:
          "Omite el sonido de la 'r' al final de las palabras a menos que vaya seguida de vocal (ej: 'car' suena como 'cah').",
      },
      {
        id: "tx",
        name: "Texas",
        namePT: "Texas",
        nameES: "Texas",
        coords: { x: 195, y: 220 },
        slangs: [
          {
            expression: "Y'all",
            meaningEN: "You all (plural you)",
            meaningPT: "Vocês todos",
            meaningES: "Todos ustedes",
          },
          {
            expression: "Howdy!",
            meaningEN: "Friendly greeting / Hello",
            meaningPT: "Saudação amigável / Olá!",
            meaningES: "Saludo amistoso / ¡Hola!",
          },
        ],
        landmarkEN: "The Alamo",
        landmarkPT: "O Alvo",
        landmarkES: "El Álamo",
        landmarkDescEN: "Historic Spanish mission and fortress representing Texas independence.",
        landmarkDescPT:
          "Histórica missão espanhola e fortaleza que simboliza a independência texana.",
        landmarkDescES:
          "Histórica misión española y fortaleza que representa la independencia de Texas.",
        foodEN: "Texas Barbecue (Brisket)",
        foodPT: "Churrasco Texano (Brisket)",
        foodES: "Barbacoa Texana (Brisket)",
        foodDescEN: "Slow-smoked beef brisket seasoned with dry rubs.",
        foodDescPT: "Peito de boi defumado lentamente temperado com dry rub.",
        foodDescES: "Pecho de ternera ahumado lentamente con condimentos secos.",
        cultureEN: "Known for cowboy history, massive state pride, and football obsession.",
        culturePT:
          "Conhecido pela história dos cowboys, orgulho estadual massivo e obsessão por futebol americano.",
        cultureES:
          "Conocido por la historia de los vaqueros, gran orgullo estatal y obsesión por el fútbol americano.",
        accentNameEN: "Southern Drawl",
        accentNamePT: "Sotaque do Sul (Drawl)",
        accentNameES: "Acento Sureño (Drawl)",
        accentTechEN:
          "Characterized by vowel breaking or triphthongization (e.g., 'yes' spoken as 'yeh-us').",
        accentTechPT:
          "Caracterizado pelo prolongamento das vogais e ditongação (ex: 'yes' soa como 'yeh-us').",
        accentTechES:
          "Caracterizado por el alargamiento de las vocales y la diptongación (ej: 'yes' suena como 'yeh-us').",
      },
      {
        id: "ca",
        name: "California",
        namePT: "Califórnia",
        nameES: "California",
        coords: { x: 120, y: 190 },
        slangs: [
          {
            expression: "Hella",
            meaningEN: "Very / Extremely",
            meaningPT: "Muito / Extremamente",
            meaningES: "Muy / Extremamente",
          },
          {
            expression: "Out of pocket",
            meaningEN: "Inappropriate or out of line",
            meaningPT: "Inapropriado ou fora dos limites",
            meaningES: "Inapropiado o fuera de lugar",
          },
        ],
        landmarkEN: "Golden Gate Bridge",
        landmarkPT: "Ponte Golden Gate",
        landmarkES: "Puente Golden Gate",
        landmarkDescEN: "The iconic orange suspension bridge spanning the entrance to the SF Bay.",
        landmarkDescPT:
          "A icônica ponte pênsil laranja que cruza a entrada da Baía de São Francisco.",
        landmarkDescES:
          "El icónico puente colgante naranja que cruza la entrada de la Bahía de San Francisco.",
        foodEN: "California Roll & Avocado Toast",
        foodPT: "California Roll & Torrada de Abacate",
        foodES: "California Roll & Tostada de Aguacate",
        foodDescEN: "Sushi made with avocado, cucumber, and crab.",
        foodDescPT: "Sushi feito com abacate, pepino e caranguejo.",
        foodDescES: "Sushi elaborado con aguacate, pepino y cangrejo.",
        cultureEN:
          "Bustling movie industry in Hollywood and cutting-edge tech innovations in Silicon Valley.",
        culturePT:
          "Indústria de cinema vibrante em Hollywood e inovações tecnológicas no Vale do Silício.",
        cultureES:
          "Próspera industria del cine en Hollywood e innovación tecnológica en Silicon Valley.",
        accentNameEN: "West Coast / California English",
        accentNamePT: "Inglês da Costa Oeste",
        accentNameES: "Inglés de la Costa Oeste",
        accentTechEN:
          "Vowel shift where back vowels move forward (e.g., 'dude' pronounced with a central vowel).",
        accentTechPT:
          "Mudança vocálica onde as vogais posteriores avançam (ex: o som de 'u' fica mais frontal).",
        accentTechES:
          "Cambio vocálico donde las vocales posteriores se adelantan (ej: el sonido de la 'u' se vuelve más frontal).",
      },
    ],
  },
  {
    id: "uk",
    nameEN: "United Kingdom",
    namePT: "Reino Unido",
    nameES: "Reino Unido",
    flag: "🇬🇧",
    accent: "en-GB",
    cities: [
      {
        id: "lon",
        name: "London",
        namePT: "Londres",
        nameES: "Londres",
        coords: { x: 480, y: 135 },
        slangs: [
          {
            expression: "Fancy a cuppa?",
            meaningEN: "Would you like a cup of tea?",
            meaningPT: "Gostaria de uma xícara de chá?",
            meaningES: "¿Te apetece una taza de té?",
          },
          {
            expression: "Knackered",
            meaningEN: "Extremely tired / Exhausted",
            meaningPT: "Completamente exausto / Cansado",
            meaningES: "Extremadamente cansado / Agotado",
          },
        ],
        landmarkEN: "Big Ben & London Eye",
        landmarkPT: "Big Ben & London Eye",
        landmarkES: "Big Ben & London Eye",
        landmarkDescEN:
          "The iconic clock tower and the giant observation wheel over the River Thames.",
        landmarkDescPT:
          "A icônica torre do relógio e a gigante roda de observação sobre o Rio Tâmisa.",
        landmarkDescES:
          "La icónica torre del reloj y la gigante rueda de observación sobre el río Támesis.",
        foodEN: "Fish & Chips",
        foodPT: "Peixe com Batatas Fritas",
        foodES: "Pescado con Patatas Fritas",
        foodDescEN: "Battered white fish deep-fried and served with thick chips.",
        foodDescPT: "Peixe branco empanado e frito servido com batatas fritas grossas.",
        foodDescES: "Pescado blanco rebozado y frito servido con patatas fritas gruesas.",
        cultureEN: "Rich pub tradition, royal ceremonies, and beautiful historic architecture.",
        culturePT: "Rica tradição de pubs, cerimônias reais e bela arquitetura histórica.",
        cultureES:
          "Rica tradición de pubs, ceremonias reales y una hermosa arquitectura histórica.",
        accentNameEN: "Received Pronunciation (RP) / Cockney",
        accentNamePT: "Pronúncia Recebida (RP) / Cockney",
        accentNameES: "Pronunciación Recibida (RP) / Cockney",
        accentTechEN:
          "RP features crisp t-articulation and high non-rhoticity; Cockney drops 'h' and swaps 'th' for 'f'/'v'.",
        accentTechPT:
          "RP apresenta articulação nítida do 't' e não-roticidade; Cockney omite o 'h' inicial e troca 'th' por 'f'/'v'.",
        accentTechES:
          "RP presenta una articulación clara de la 't' y no es rótico; Cockney omite la 'h' inicial y cambia 'th' por 'f'/'v'.",
      },
      {
        id: "sco",
        name: "Scotland",
        namePT: "Escócia",
        nameES: "Escocia",
        coords: { x: 470, y: 105 },
        slangs: [
          {
            expression: "Wee bairn",
            meaningEN: "A small child",
            meaningPT: "Uma criança pequena",
            meaningES: "Un niño pequeño",
          },
          {
            expression: "Bonnie",
            meaningEN: "Beautiful / Pretty",
            meaningPT: "Lindo / Bonito",
            meaningES: "Hermoso / Bonito",
          },
        ],
        landmarkEN: "Edinburgh Castle",
        landmarkPT: "Castelo de Edimburgo",
        landmarkES: "Castillo de Edimburgo",
        landmarkDescEN: "Historic fortress dominating the skyline from its volcanic rock position.",
        landmarkDescPT:
          "Fortaleza histórica que domina o horizonte no topo de uma rocha vulcânica.",
        landmarkDescES: "Fortaleza histórica que domina el horizonte sobre una roca volcánica.",
        foodEN: "Haggis",
        foodPT: "Haggis",
        foodES: "Haggis",
        foodDescEN: "Savory pudding containing sheep's pluck mixed with oats.",
        foodDescPT: "Pudim salgado contendo miúdos de carneiro misturados com aveia.",
        foodDescES: "Pudín salado que contiene vísceras de oveja mezcladas con avena.",
        cultureEN: "Bagpipes, highland games, tartans, and historic castles.",
        culturePT: "Gaitas de foles, jogos das Highlands, tartãs e castelos medievais.",
        cultureES: "Gaitas de fuelle, juegos de las Highlands, tartanes y castillos medievales.",
        accentNameEN: "Scottish English",
        accentNamePT: "Inglês Escocês",
        accentNameES: "Inglés Escocés",
        accentTechEN:
          "Rhotic accent where 'r' is tapped (rolled); vowels are shorter and more clipped.",
        accentTechPT:
          "Sotaque rótico onde o 'r' é vibrado curto; as vogais são mais curtas e cortadas.",
        accentTechES:
          "Acento rótico donde la 'r' se vibra ligeramente; las vocales son más cortas y secas.",
      },
    ],
  },
  {
    id: "spain",
    nameEN: "Spain",
    namePT: "Espanha",
    nameES: "España",
    flag: "🇪🇸",
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
            meaningES: "¡Mola un montón! / ¡Es genial!",
          },
          {
            expression: "Tío / Tía",
            meaningEN: "Guy / Girl (colloquial 'bro')",
            meaningPT: "Cara / Moça (coloquial 'mano')",
            meaningES: "Tío / Tía (coloquial)",
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
        accentTechEN:
          "Uses distinction (distinción) where 'z' and 'c' (before e/i) represent the 'th' sound (/θ/).",
        accentTechPT:
          "Usa distinção (distinción) onde 'z' e 'c' (antes de e/i) representam o som de 'th' em inglês (/θ/).",
        accentTechES:
          "Usa distinción donde la 'z' y la 'c' (antes de e/i) se pronuncian con el sonido '/θ/' (como la 'th' inglesa).",
      },
      {
        id: "and",
        name: "Andalucia",
        namePT: "Andaluzia",
        nameES: "Andalucía",
        coords: { x: 468, y: 195 },
        slangs: [
          {
            expression: "¡Ojú!",
            meaningEN: "Wow! / Good grief! (expression of surprise)",
            meaningPT: "Nossa! / Caramba! (expressão de surpresa)",
            meaningES: "¡Caramba! / ¡Madre mía! (expresión de sorpresa)",
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
          "Caracterizado por seseo/ceceo, queda do 's' final e suavização de consoantes intervocalicas.",
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
    flag: "🇲🇽",
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
    flag: "🇦🇷",
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
        cultureEN:
          "Tango dancing in the streets, football passion (Boca/River), and European editorial style.",
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
    flag: "🇨🇴",
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
            expression: "¡Qué bacano!",
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
    flag: "🇧🇷",
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
        foodEN: "Coxinha & Mortadella Sandwich",
        foodPT: "Coxinha & Sanduíche de Mortadela",
        foodES: "Coxinha & Sándwich de Mortadela",
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
        foodEN: "Feijoada & Pastel com Garapa",
        foodPT: "Feijoada & Pastel com Caldo de Cana",
        foodES: "Feijoada & Pastel con Caldo de Caña",
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
    flag: "🇵🇹",
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
            expression: "Gajo / Gaja",
            meaningEN: "Guy / Girl",
            meaningPT: "Gajo / Gaja (rapaz / rapariga)",
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
        cultureEN: "Melancholic Fado music, historic yellow trams, and tiled walls (azulejos).",
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
    flag: "🇨🇦",
    accent: "en-US",
    cities: [
      {
        id: "tor",
        name: "Toronto",
        namePT: "Toronto",
        nameES: "Toronto",
        coords: { x: 230, y: 155 },
        slangs: [
          {
            expression: "Loonie",
            meaningEN: "One-dollar coin",
            meaningPT: "Moeda de um dólar",
            meaningES: "Moneda de un dólar",
          },
          {
            expression: "Double-double",
            meaningEN: "Coffee with two creams and two sugars",
            meaningPT: "Café com dois cremes e dois açúcares",
            meaningES: "Café con dos cremas y dos de azúcar",
          },
        ],
        landmarkEN: "CN Tower",
        landmarkPT: "Torre CN",
        landmarkES: "Torre CN",
        landmarkDescEN:
          "The monumental 553-meter concrete observation tower dominating Toronto's skyline.",
        landmarkDescPT:
          "A monumental torre de observação de concreto com 553 metros dominando o horizonte de Toronto.",
        landmarkDescES:
          "La monumental torre de observación de hormigón de 553 metros que domina el horizonte de Toronto.",
        foodEN: "Poutine",
        foodPT: "Poutine",
        foodES: "Poutine",
        foodDescEN: "Crispy french fries topped with squeaky cheese curds and rich brown gravy.",
        foodDescPT:
          "Batatas fritas crocantes cobertas com queijo coalho fresco e molho de carne quente.",
        foodDescES:
          "Patatas fritas crujientes cubiertas con queso en grano y salsa de carne caliente.",
        cultureEN:
          "An extremely clean, diverse metropolis hosting one of the world's biggest film festivals.",
        culturePT:
          "Uma metrópole extremamente limpa e diversa que sedia um dos maiores festivais de cinema do mundo.",
        cultureES:
          "Una metrópolis sumamente limpia y diversa que alberga uno de los mayores festivales de cine.",
        accentNameEN: "Canadian English",
        accentNamePT: "Inglês Canadense",
        accentNameES: "Inglés Canadiense",
        accentTechEN:
          "Features Canadian Raising, where diphthongs raise before voiceless consonants (e.g., 'about' sounding like 'abeaut').",
        accentTechPT:
          "Apresenta o Canadian Raising, onde ditongos sobem antes de consoantes surdas (ex: 'about' soa ligeiramente mais alto).",
        accentTechES:
          "Presenta el Canadian Raising, donde los diptongos se elevan ante consonantes sordas (ej: 'about' se eleva a 'abeaut').",
      },
      {
        id: "van",
        name: "Vancouver",
        namePT: "Vancouver",
        nameES: "Vancouver",
        coords: { x: 130, y: 145 },
        slangs: [
          {
            expression: "Raincouver",
            meaningEN: "Nickname for Vancouver due to heavy rainfall",
            meaningPT: "Apelido devido às chuvas intensas",
            meaningES: "Apodo debido a las lluvias frecuentes",
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
    flag: "🇦🇺",
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
            meaningEN: "Don't mention it / You are welcome",
            meaningPT: "Sem problemas! / De nada!",
            meaningES: "No te preocupes / De nada",
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
];
function FlagSvg({ countryId, size = 20 }: { countryId: string; size?: number }) {
  const width = size * 1.33; // 4:3 aspect ratio
  const height = size;
  const borderRadius = "4px";

  if (countryId === "usa") {
    return (
      <svg width={width} height={height} viewBox="0 0 640 480" style={{ borderRadius }}>
        <rect width="640" height="480" fill="#3c3b6e" />
        <path
          d="M0 37h640M0 111h640M0 185h640M0 258h640M0 332h640M0 406h640"
          stroke="#fff"
          strokeWidth="37"
        />
        <rect width="256" height="258" fill="#3c3b6e" />
        <path d="M0 0l256 258" stroke="#fff" strokeWidth="2" opacity="0.3" />
        <circle cx="128" cy="129" r="60" fill="#fff" opacity="0.8" />
      </svg>
    );
  }
  if (countryId === "uk") {
    return (
      <svg width={width} height={height} viewBox="0 0 640 480" style={{ borderRadius }}>
        <rect width="640" height="480" fill="#012169" />
        <path d="M0 0l640 480M640 0L0 480" stroke="#fff" strokeWidth="80" />
        <path d="M0 0l640 480M640 0L0 480" stroke="#C8102E" strokeWidth="48" />
        <path d="M320 0v480M0 240h640" stroke="#fff" strokeWidth="120" />
        <path d="M320 0v480M0 240h640" stroke="#C8102E" strokeWidth="80" />
      </svg>
    );
  }
  if (countryId === "spain") {
    return (
      <svg width={width} height={height} viewBox="0 0 640 480" style={{ borderRadius }}>
        <rect width="640" height="480" fill="#c60b1e" />
        <rect y="120" width="640" height="240" fill="#ffc400" />
        <circle cx="160" cy="240" r="40" fill="#c60b1e" opacity="0.85" />
      </svg>
    );
  }
  if (countryId === "mexico") {
    return (
      <svg width={width} height={height} viewBox="0 0 640 480" style={{ borderRadius }}>
        <rect width="213" height="480" fill="#006847" />
        <rect x="213" width="214" height="480" fill="#fff" />
        <rect x="427" width="213" height="480" fill="#ce1126" />
        <circle cx="320" cy="240" r="35" fill="#006847" opacity="0.85" />
      </svg>
    );
  }
  if (countryId === "argentina") {
    return (
      <svg width={width} height={height} viewBox="0 0 640 480" style={{ borderRadius }}>
        <rect width="640" height="480" fill="#74acdf" />
        <rect y="160" width="640" height="160" fill="#fff" />
        <circle cx="320" cy="240" r="30" fill="#f6b426" />
      </svg>
    );
  }
  if (countryId === "colombia") {
    return (
      <svg width={width} height={height} viewBox="0 0 640 480" style={{ borderRadius }}>
        <rect width="640" height="240" fill="#fcd116" />
        <rect y="240" width="640" height="120" fill="#003893" />
        <rect y="360" width="640" height="120" fill="#ce1126" />
      </svg>
    );
  }
  if (countryId === "brazil") {
    return (
      <svg width={width} height={height} viewBox="0 0 640 480" style={{ borderRadius }}>
        <rect width="640" height="480" fill="#009c3b" />
        <path d="M320 40L600 240L320 440L40 240Z" fill="#fedf00" />
        <circle cx="320" cy="240" r="85" fill="#002776" />
      </svg>
    );
  }
  if (countryId === "portugal") {
    return (
      <svg width={width} height={height} viewBox="0 0 640 480" style={{ borderRadius }}>
        <rect width="256" height="480" fill="#00662f" />
        <rect x="256" width="384" height="480" fill="#ff0000" />
        <circle cx="256" cy="240" r="50" fill="#fedf00" opacity="0.9" />
      </svg>
    );
  }
  if (countryId === "canada") {
    return (
      <svg width={width} height={height} viewBox="0 0 640 480" style={{ borderRadius }}>
        <rect width="160" height="480" fill="#ff0000" />
        <rect x="160" width="320" height="480" fill="#fff" />
        <rect x="480" width="160" height="480" fill="#ff0000" />
        <polygon
          points="320,160 340,220 400,220 350,260 370,320 320,280 270,320 290,260 240,220 300,220"
          fill="#ff0000"
        />
      </svg>
    );
  }
  if (countryId === "australia") {
    return (
      <svg width={width} height={height} viewBox="0 0 640 480" style={{ borderRadius }}>
        <rect width="640" height="480" fill="#00008b" />
        <path d="M0 0l320 240M320 0L0 240" stroke="#fff" strokeWidth="40" />
        <path d="M160 0v240M0 120h320" stroke="#fff" strokeWidth="60" />
        <path d="M160 0v240M0 120h320" stroke="#ff0000" strokeWidth="40" />
        <polygon
          points="480,280 490,310 520,310 495,330 505,360 480,340 455,360 465,330 440,310 470,310"
          fill="#fff"
        />
      </svg>
    );
  }
  if (countryId === "france") {
    return (
      <svg width={width} height={height} viewBox="0 0 640 480" style={{ borderRadius }}>
        <rect width="213" height="480" fill="#002395" />
        <rect x="213" width="214" height="480" fill="#fff" />
        <rect x="427" width="213" height="480" fill="#ed2939" />
      </svg>
    );
  }
  if (countryId === "germany") {
    return (
      <svg width={width} height={height} viewBox="0 0 640 480" style={{ borderRadius }}>
        <rect width="640" height="160" fill="#000" />
        <rect y="160" width="640" height="160" fill="#dd0000" />
        <rect y="320" width="640" height="160" fill="#ffce00" />
      </svg>
    );
  }
  if (countryId === "italy") {
    return (
      <svg width={width} height={height} viewBox="0 0 640 480" style={{ borderRadius }}>
        <rect width="213" height="480" fill="#009246" />
        <rect x="213" width="214" height="480" fill="#fff" />
        <rect x="427" width="213" height="480" fill="#ce2b37" />
      </svg>
    );
  }
  if (countryId === "japan") {
    return (
      <svg width={width} height={height} viewBox="0 0 640 480" style={{ borderRadius }}>
        <rect width="640" height="480" fill="#fff" />
        <circle cx="320" cy="240" r="120" fill="#bc002d" />
      </svg>
    );
  }
  if (countryId === "china") {
    return (
      <svg width={width} height={height} viewBox="0 0 640 480" style={{ borderRadius }}>
        <rect width="640" height="480" fill="#de2910" />
        <polygon points="100,80 120,130 80,100 120,100 80,130" fill="#ffde00" />
      </svg>
    );
  }
  if (countryId === "india") {
    return (
      <svg width={width} height={height} viewBox="0 0 640 480" style={{ borderRadius }}>
        <rect width="640" height="160" fill="#ff9933" />
        <rect y="160" width="640" height="160" fill="#fff" />
        <rect y="320" width="640" height="160" fill="#128807" />
        <circle cx="320" cy="240" r="40" fill="none" stroke="#000080" strokeWidth="6" />
      </svg>
    );
  }
  if (countryId === "southafrica") {
    return (
      <svg width={width} height={height} viewBox="0 0 640 480" style={{ borderRadius }}>
        <rect width="640" height="160" fill="#e23d28" />
        <rect y="160" width="640" height="160" fill="#007a4d" />
        <rect y="320" width="640" height="160" fill="#002395" />
        <polygon points="0,0 200,240 0,480" fill="#000" />
      </svg>
    );
  }

  return (
    <svg width={width} height={height} viewBox="0 0 640 480" style={{ borderRadius }}>
      <rect width="640" height="480" fill="var(--border)" />
    </svg>
  );
}

const CITY_LANDMARK_IMAGES: Record<string, string> = {
  ny: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80",
  boston:
    "https://images.unsplash.com/photo-1506551902872-65f241a4a086?auto=format&fit=crop&w=600&q=80",
  miami:
    "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80",
  lon: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80",
  sco: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80",
  mad: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=600&q=80",
  and: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=600&q=80",
  cdmx: "https://images.unsplash.com/photo-1512813583145-baaa340ef29f?auto=format&fit=crop&w=600&q=80",
  ba: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=600&q=80",
  bog: "https://images.unsplash.com/photo-1583997052301-0042b33fc596?auto=format&fit=crop&w=600&q=80",
  sp: "https://images.unsplash.com/photo-1543059344-234a49c5588f?auto=format&fit=crop&w=600&q=80",
  rio: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=600&q=80",
  lis: "https://images.unsplash.com/photo-1509840144525-4c690c8a4fca?auto=format&fit=crop&w=600&q=80",
  tor: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80",
  van: "https://images.unsplash.com/photo-1559511259-66e6c4e9c2ec?auto=format&fit=crop&w=600&q=80",
  syd: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80",
  mel: "https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=600&q=80",
  par: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
  ber: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=600&q=80",
  rom: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80",
  tok: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
  bei: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80",
  del: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80",
  cpt: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80",
};

const CITY_FOOD_IMAGES: Record<string, string> = {
  ny: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80",
  boston:
    "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
  miami:
    "https://images.unsplash.com/photo-1588168333986-5078647a5c7e?auto=format&fit=crop&w=600&q=80",
  lon: "https://images.unsplash.com/photo-1524351199679-46cddf530c04?auto=format&fit=crop&w=600&q=80",
  sco: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=600&q=80",
  mad: "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=600&q=80",
  and: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80",
  cdmx: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80",
  ba: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
  bog: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80",
  sp: "https://images.unsplash.com/photo-1579631542720-3a87824ff8c9?auto=format&fit=crop&w=600&q=80",
  rio: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
  lis: "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=600&q=80",
  tor: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80",
  van: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",
  syd: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
  mel: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
  par: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
  ber: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80",
  rom: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=600&q=80",
  tok: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",
  bei: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=600&q=80",
  del: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80",
  cpt: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
};

function CultureHubPage() {
  const { interfaceLanguage } = useStore();
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(COUNTRIES[0]);
  const [selectedCity, setSelectedCity] = useState<CityInfo | null>(COUNTRIES[0].cities[0] ?? null);
  const [activeTab, setActiveTab] = useState<"slangs" | "culture" | "accents">("slangs");

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-select first city when country changes, unless already in the country
  useEffect(() => {
    if (selectedCity && selectedCountry.cities.some((c) => c.id === selectedCity.id)) {
      return;
    }
    setSelectedCity(selectedCountry.cities[0] ?? null);
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCity && isMobile) {
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }, 100);
    }
  }, [selectedCity, isMobile]);

  const isPT = interfaceLanguage === "pt";
  const isES = interfaceLanguage === "es";

  const getTranslation = (item: any, keyBase: string) => {
    if (isPT) return item[`${keyBase}PT`] || item[keyBase];
    if (isES) return item[`${keyBase}ES`] || item[keyBase];
    return item[`${keyBase}EN`] || item[keyBase];
  };

  const speakText = (text: string, accentCode: string) => {
    if (!window.speechSynthesis) {
      toast.error(
        isPT
          ? "Síntese de voz não suportada."
          : isES
            ? "La síntesis de voz no es compatible."
            : "Voice synthesis not supported.",
      );
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = accentCode;
    utter.rate = 0.85;
    window.speechSynthesis.speak(utter);
    toast.success(
      isPT
        ? "Tocando pronúncia regional... 🎧"
        : isES
          ? "Reproduciendo pronunciación regional... 🎧"
          : "Playing regional accent pronunciation... 🎧",
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "transparent", position: "relative" }}>
      <AppHeader />

      <main
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "40px 16px 40px",
          animation: "pageEnter 0.4s ease forwards",
        }}
      >
        {/* Back Link */}
        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "24px" }}>
          <Link
            to="/skills"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 700,
              padding: "8px 16px",
              borderRadius: "12px",
              background: "var(--surface-raised)",
              border: "1px solid var(--border)",
              transition: "all 0.2s",
            }}
            className="hover:scale-95"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {isPT ? "Voltar para Habilidades" : isES ? "Volver a Habilidades" : "Back to Skills"}
          </Link>
        </div>

        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              color: "var(--accent-terra)",
              fontSize: "11px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "12px",
            }}
          >
            <IlluGlobe size={20} primary="var(--accent-terra)" secondary="var(--accent-gold)" />
            <span>
              {isPT
                ? "Cultura & Imersão Lume"
                : isES
                  ? "Cultura e Inmersión Lume"
                  : "Lume Culture & Immersion"}
            </span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(32px, 5vw, 48px)",
              color: "var(--text-primary)",
              marginBottom: "12px",
              fontWeight: 800,
            }}
          >
            {isPT
              ? "Sotaques & Culturas Regionais"
              : isES
                ? "Acentos y Culturas Regionales"
                : "Regional Accents & Cultures"}
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "16px",
              maxWidth: "600px",
              margin: "0 auto",
              opacity: 0.8,
              lineHeight: 1.6,
            }}
          >
            {isPT
              ? "Navegue pelo mapa-mundi interativo. Clique nos pins para explorar a culinária típica, pontos turísticos, segredos históricos e ouvir gírias locais com a pronúncia regional exata!"
              : isES
                ? "Navegue por el mapa mundial interactivo. ¡Haga clic en los pins para explorar la cocina típica, los monumentos y escuchar jerga con la pronunciación regional exacta!"
                : "Navigate the interactive world map. Click regional pins to explore typical cuisine, landmarks, custom insights, and play local slang words in authentic regional accent audio!"}
          </p>
        </header>

        {/* Country selector tabs */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "32px",
          }}
        >
          {COUNTRIES.map((country) => {
            const isSelected = selectedCountry.id === country.id;
            return (
              <motion.button
                key={country.id}
                whileHover={{ y: -2 }}
                onClick={() => {
                  setSelectedCountry(country);
                  setSelectedCity(null);
                }}
                style={{
                  padding: "12px 20px",
                  borderRadius: "16px",
                  background: isSelected ? "var(--accent-green)" : "var(--surface-raised)",
                  color: isSelected ? "white" : "var(--text-primary)",
                  border: "1.5px solid var(--border)",
                  fontSize: "14.5px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: isSelected ? "0 8px 24px rgba(45,74,62,0.15)" : "none",
                  transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    flexShrink: 0,
                    overflow: "hidden",
                    borderRadius: "4px",
                  }}
                >
                  <FlagSvg countryId={country.id} size={18} />
                </span>
                <span>{getTranslation(country, "name")}</span>
              </motion.button>
            );
          })}
        </div>

        {/* World Map Wrapper */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: selectedCity ? (isMobile ? "1fr" : "1.3fr 1fr") : "1fr",
            gap: isMobile ? "20px" : "32px",
            alignItems: "start",
          }}
          className="grid-cols-1 lg:grid-cols-2"
        >
          {/* Interactive World Map Canvas */}
          <div
            className="glass premium-shadow"
            style={{
              borderRadius: "32px",
              padding: isMobile ? "16px" : "32px",
              border: "1px solid var(--border)",
              background: "var(--surface-raised)",
              position: "relative",
              overflow: "hidden",
              minHeight: isMobile ? "320px" : "480px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--accent-green)",
                }}
              >
                {isPT
                  ? "MAPA INTERATIVO MULTICULTURAL"
                  : isES
                    ? "MAPA INTERACTIVO MULTICULTURAL"
                    : "MULTICULTURAL INTERACTIVE WORLD MAP"}
              </span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)" }}>
                {getTranslation(selectedCountry, "name")}
              </span>
            </div>

            {/* Interactive World Globe */}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <WorldGlobe3D
                selectedCountryId={selectedCountry.id}
                selectedCityId={selectedCity?.id ?? null}
                onSelectCountryCity={(countryId, cityId) => {
                  const country = COUNTRIES.find((c) => c.id === countryId);
                  if (country) {
                    setSelectedCountry(country);
                    const city = country.cities.find((c) => c.id === cityId);
                    if (city) {
                      setSelectedCity(city);
                    }
                  }
                }}
              />
            </div>

            {/* Quick picker pins at the bottom */}
            <div
              style={{
                marginTop: "24px",
                borderTop: "1px solid var(--border)",
                paddingTop: "20px",
              }}
            >
              <div
                style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}
              >
                {selectedCountry.cities.map((city) => {
                  const isCitySelected = selectedCity?.id === city.id;
                  return (
                    <button
                      key={city.id}
                      onClick={() => setSelectedCity(city)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "12px",
                        background: isCitySelected
                          ? "var(--accent-terra)"
                          : "var(--surface-raised)",
                        color: isCitySelected ? "white" : "var(--text-primary)",
                        border: "1px solid var(--border)",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "all 0.2s",
                      }}
                    >
                      <MapPin size={14} color={isCitySelected ? "white" : "var(--accent-terra)"} />
                      {getTranslation(city, "name")}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Details slide in sidebar */}
          <AnimatePresence mode="wait">
            {selectedCity ? (
              <motion.div
                key={selectedCity.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="glass premium-shadow"
                style={{
                  borderRadius: "32px",
                  padding: isMobile ? "20px 16px" : "32px",
                  border: "1px solid var(--border)",
                  background: "var(--surface-raised)",
                  display: "flex",
                  flexDirection: "column",
                  gap: isMobile ? "16px" : "24px",
                }}
              >
                {/* Header title */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid var(--border)",
                    paddingBottom: "16px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        color: "var(--accent-terra)",
                      }}
                    >
                      {isPT
                        ? "IMERSÃO REGIONAL"
                        : isES
                          ? "INMERSIÓN REGIONAL"
                          : "REGIONAL IMMERSION"}
                    </span>
                    <h2
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "28px",
                        color: "var(--text-primary)",
                        fontWeight: 800,
                        marginTop: "2px",
                      }}
                    >
                      {getTranslation(selectedCity, "name")}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedCity(null)}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "var(--surface)",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-secondary)",
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Advanced Premium Tab Selector */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "6px",
                    background: "var(--surface)",
                    padding: "4px",
                    borderRadius: "14px",
                    border: "1px solid var(--border)",
                  }}
                >
                  {[
                    { id: "slangs", label: isPT ? "Gírias" : isES ? "Jerga" : "Slangs" },
                    { id: "culture", label: isPT ? "Cultura" : isES ? "Cultura" : "Culture" },
                    { id: "accents", label: isPT ? "Fonética" : isES ? "Acento" : "Accents" },
                  ].map((tab) => {
                    const isTabActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        style={{
                          padding: "10px",
                          borderRadius: "10px",
                          border: "none",
                          background: isTabActive ? "var(--surface-raised)" : "transparent",
                          color: isTabActive ? "var(--text-primary)" : "var(--text-secondary)",
                          fontWeight: 700,
                          fontSize: "13px",
                          cursor: "pointer",
                          boxShadow: isTabActive ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                          transition: "all 0.2s",
                        }}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab content panel */}
                <div style={{ minHeight: "280px" }}>
                  {/* TAB 1: SLANGS */}
                  {activeTab === "slangs" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          color: "var(--accent-terra)",
                          marginBottom: "8px",
                        }}
                      >
                        <Volume2 size={18} />
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {isPT
                            ? "Toque para ouvir gírias nativas"
                            : isES
                              ? "Toque para escuchar jerga nativa"
                              : "Tap to hear local accents"}
                        </span>
                      </div>

                      {selectedCity.slangs.map((s, idx) => (
                        <div
                          key={idx}
                          className="glass"
                          style={{
                            padding: "18px",
                            borderRadius: "18px",
                            background: "var(--surface)",
                            border: "1px solid var(--border)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            transition: "all 0.2s",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: "16.5px",
                                fontWeight: 800,
                                color: "var(--accent-terra)",
                              }}
                            >
                              "{s.expression}"
                            </div>
                            <div
                              style={{
                                fontSize: "13px",
                                color: "var(--text-secondary)",
                                marginTop: "4px",
                                fontStyle: "italic",
                              }}
                            >
                              {getTranslation(s, "meaning")}
                            </div>
                          </div>

                          <button
                            onClick={() => speakText(s.expression, selectedCountry.accent)}
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "50%",
                              background: "var(--accent-terra)15",
                              color: "var(--accent-terra)",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "transform 0.2s",
                            }}
                            className="hover:scale-110 active:scale-95"
                          >
                            <Volume1 size={18} />
                          </button>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* TAB 2: CULTURE */}
                  {activeTab === "culture" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ display: "flex", flexDirection: "column", gap: "24px" }}
                    >
                      {/* Landmark Card */}
                      <motion.div
                        whileHover={{ y: -4 }}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: "20px",
                          overflow: "hidden",
                          border: "1.5px solid var(--border)",
                          background: "var(--surface)",
                          boxShadow: "var(--shadow-soft)",
                        }}
                      >
                        <div
                          style={{
                            height: "150px",
                            width: "100%",
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <img
                            src={
                              CITY_LANDMARK_IMAGES[selectedCity.id] ||
                              "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80"
                            }
                            alt={getTranslation(selectedCity, "landmark")}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.4s ease",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: "12px",
                              left: "12px",
                              background: "rgba(45,74,62,0.9)",
                              color: "white",
                              padding: "4px 10px",
                              borderRadius: "20px",
                              fontSize: "11px",
                              fontWeight: 800,
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              backdropFilter: "blur(4px)",
                            }}
                          >
                            <Landmark size={12} color="white" />
                            {isPT
                              ? "Ponto de Destaque"
                              : isES
                                ? "Punto de Interés"
                                : "Key Landmark"}
                          </div>
                        </div>
                        <div style={{ padding: "16px" }}>
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: 800,
                              color: "var(--text-primary)",
                              display: "block",
                              marginBottom: "6px",
                            }}
                          >
                            {getTranslation(selectedCity, "landmark")}
                          </span>
                          <p
                            style={{
                              fontSize: "13px",
                              color: "var(--text-secondary)",
                              lineHeight: 1.5,
                              margin: 0,
                            }}
                          >
                            {getTranslation(selectedCity, "landmarkDesc")}
                          </p>
                        </div>
                      </motion.div>

                      {/* Food Card */}
                      <motion.div
                        whileHover={{ y: -4 }}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: "20px",
                          overflow: "hidden",
                          border: "1.5px solid var(--border)",
                          background: "var(--surface)",
                          boxShadow: "var(--shadow-soft)",
                        }}
                      >
                        <div
                          style={{
                            height: "150px",
                            width: "100%",
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <img
                            src={
                              CITY_FOOD_IMAGES[selectedCity.id] ||
                              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
                            }
                            alt={getTranslation(selectedCity, "food")}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.4s ease",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: "12px",
                              left: "12px",
                              background: "rgba(196,113,74,0.9)",
                              color: "white",
                              padding: "4px 10px",
                              borderRadius: "20px",
                              fontSize: "11px",
                              fontWeight: 800,
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              backdropFilter: "blur(4px)",
                            }}
                          >
                            <Utensils size={12} color="white" />
                            {isPT
                              ? "Gastronomia Local"
                              : isES
                                ? "Gastronomía Local"
                                : "Local Gastronomy"}
                          </div>
                        </div>
                        <div style={{ padding: "16px" }}>
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: 800,
                              color: "var(--text-primary)",
                              display: "block",
                              marginBottom: "6px",
                            }}
                          >
                            {getTranslation(selectedCity, "food")}
                          </span>
                          <p
                            style={{
                              fontSize: "13px",
                              color: "var(--text-secondary)",
                              lineHeight: 1.5,
                              margin: 0,
                            }}
                          >
                            {getTranslation(selectedCity, "foodDesc")}
                          </p>
                        </div>
                      </motion.div>

                      {/* Custom/Identity Card */}
                      <motion.div
                        whileHover={{ y: -4 }}
                        style={{
                          display: "flex",
                          gap: "16px",
                          alignItems: "start",
                          padding: "16px",
                          borderRadius: "20px",
                          border: "1.5px solid var(--border)",
                          background: "var(--surface)",
                          boxShadow: "var(--shadow-soft)",
                        }}
                      >
                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "14px",
                            background: "rgba(78,143,183,0.08)",
                            color: "var(--accent-teal)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Sparkles size={20} />
                        </div>
                        <div>
                          <h4
                            style={{
                              fontSize: "14px",
                              fontWeight: 800,
                              color: "var(--text-primary)",
                              marginBottom: "4px",
                              marginTop: 0,
                            }}
                          >
                            {isPT
                              ? "Costumes & Identidade"
                              : isES
                                ? "Costumbres e Identidad"
                                : "Customs & Identity"}
                          </h4>
                          <p
                            style={{
                              fontSize: "13px",
                              color: "var(--text-secondary)",
                              lineHeight: 1.5,
                              margin: 0,
                            }}
                          >
                            {getTranslation(selectedCity, "culture")}
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* TAB 3: ACCENTS */}
                  {activeTab === "accents" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          color: "var(--accent-green)",
                          marginBottom: "4px",
                        }}
                      >
                        <HelpCircle size={18} />
                        <h4
                          style={{
                            fontSize: "14px",
                            fontWeight: 800,
                            color: "var(--text-primary)",
                            margin: 0,
                          }}
                        >
                          {getTranslation(selectedCity, "accentName")}
                        </h4>
                      </div>

                      <div
                        className="glass"
                        style={{
                          padding: "20px",
                          borderRadius: "20px",
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "var(--accent-green)",
                            marginBottom: "8px",
                          }}
                        >
                          {isPT
                            ? "Peculiaridades Fonéticas"
                            : isES
                              ? "Rasgos Fonéticos"
                              : "Phonetic Traits"}
                        </div>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "var(--text-primary)",
                            lineHeight: 1.6,
                            margin: 0,
                            fontStyle: "italic",
                          }}
                        >
                          {getTranslation(selectedCity, "accentTech")}
                        </p>
                      </div>

                      {/* active speech helper */}
                      <button
                        onClick={() =>
                          speakText(
                            getTranslation(selectedCity, "accentTech"),
                            selectedCountry.accent,
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "12px",
                          background: "var(--accent-green)10",
                          color: "var(--accent-green)",
                          border: "1.5px solid var(--accent-green)30",
                          fontWeight: 700,
                          fontSize: "13.5px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          transition: "all 0.2s",
                        }}
                      >
                        <Volume2 size={16} />
                        {isPT
                          ? "Ouvir Análise por Voz"
                          : isES
                            ? "Escuchar Análisis de Voz"
                            : "Hear Speech Analysis"}
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div
                className="glass"
                style={{
                  borderRadius: "32px",
                  padding: "48px 32px",
                  border: "1px solid var(--border)",
                  background: "var(--surface-raised)",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "400px",
                }}
              >
                <div style={{ color: "var(--accent-gold)", marginBottom: "16px" }}>
                  <Compass size={48} className="animate-spin-slow" />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    marginBottom: "8px",
                  }}
                >
                  {isPT
                    ? "Nenhum pin selecionado"
                    : isES
                      ? "Ningún pin seleccionado"
                      : "No pin selected"}
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "14.5px",
                    maxWidth: "300px",
                    margin: "0 auto",
                    lineHeight: 1.5,
                  }}
                >
                  {isPT
                    ? "Escolha um país e clique nos pins brilhantes no mapa para começar a explorar a imersão cultural!"
                    : isES
                      ? "¡Elija un país y haga clic en los pins brillantes del mapa para comenzar a explorar la inmersión cultural!"
                      : "Choose a country and click the glowing map pins to start exploring regional immersion details!"}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
