// Local role-play curriculum. No network, model downloads, secrets or quotas.
export type PracticeLanguage = "en" | "pt" | "es";
type Message = { role: "user" | "assistant"; content: string };
type Step = { question: string; example: string };
type Scenario = Record<PracticeLanguage, Step[]>;
const steps = (pairs: string[][]): Step[] =>
  pairs.map(([question, example]) => ({ question, example }));
export const SCENARIOS: Record<string, Scenario> = {
  travel: {
    en: steps([
      ["Where would you like to travel?", "I'd like to visit Lisbon."],
      ["At reception, ask for a room for two nights.", "I'd like a room for two nights, please."],
      ["Ask how to get to the station.", "Excuse me, how do I get to the station?"],
      ["At the café, order a drink and ask the price.", "A coffee, please. How much is it?"],
      ["Your train is late. Ask for the next departure.", "When does the next train leave?"],
      [
        "Describe one thing you would like to do there.",
        "I'd like to explore the old town because I love history.",
      ],
    ]),
    pt: steps([
      ["Para onde você gostaria de viajar?", "Eu gostaria de visitar Lisboa."],
      [
        "Na recepção, peça um quarto por duas noites.",
        "Gostaria de um quarto por duas noites, por favor.",
      ],
      ["Pergunte como chegar à estação.", "Com licença, como chego à estação?"],
      ["No café, peça uma bebida e pergunte o preço.", "Um café, por favor. Quanto custa?"],
      ["Seu trem atrasou. Pergunte o horário da próxima saída.", "A que horas sai o próximo trem?"],
      [
        "Conte algo que gostaria de fazer no destino.",
        "Gostaria de explorar o centro porque adoro história.",
      ],
    ]),
    es: steps([
      ["¿Adónde te gustaría viajar?", "Me gustaría visitar Lisboa."],
      [
        "En recepción, pide una habitación para dos noches.",
        "Quisiera una habitación para dos noches, por favor.",
      ],
      ["Pregunta cómo llegar a la estación.", "Disculpe, ¿cómo llego a la estación?"],
      [
        "En la cafetería, pide una bebida y pregunta el precio.",
        "Un café, por favor. ¿Cuánto cuesta?",
      ],
      [
        "Tu tren se ha retrasado. Pregunta por la próxima salida.",
        "¿A qué hora sale el próximo tren?",
      ],
      [
        "Cuenta algo que te gustaría hacer allí.",
        "Me gustaría explorar el centro porque me encanta la historia.",
      ],
    ]),
  },
  "daily-life": {
    en: steps([
      ["What do you usually do in the morning?", "I usually have breakfast at seven."],
      ["Tell a neighbor about your day.", "Today I'm working from home."],
      ["Ask a shop assistant where the bread is.", "Excuse me, where can I find the bread?"],
      ["Make a plan for tomorrow.", "Tomorrow I'm going to visit a friend."],
      ["Describe your favorite part of the day.", "I like the evening because I can relax."],
      ["Ask your neighbor about their weekend.", "What do you like to do at the weekend?"],
    ]),
    pt: steps([
      ["O que você costuma fazer de manhã?", "Costumo tomar café às sete."],
      ["Conte a um vizinho como está seu dia.", "Hoje estou trabalhando de casa."],
      ["Pergunte ao atendente onde fica o pão.", "Com licença, onde encontro o pão?"],
      ["Faça um plano para amanhã.", "Amanhã vou visitar um amigo."],
      ["Descreva sua parte favorita do dia.", "Gosto da noite porque posso descansar."],
      ["Pergunte ao vizinho sobre o fim de semana.", "O que você gosta de fazer no fim de semana?"],
    ]),
    es: steps([
      ["¿Qué sueles hacer por la mañana?", "Suelo desayunar a las siete."],
      ["Cuéntale a un vecino cómo va tu día.", "Hoy estoy trabajando desde casa."],
      ["Pregunta dónde está el pan en una tienda.", "Disculpe, ¿dónde puedo encontrar el pan?"],
      ["Haz un plan para mañana.", "Mañana voy a visitar a un amigo."],
      ["Describe tu parte favorita del día.", "Me gusta la noche porque puedo descansar."],
      ["Pregunta a tu vecino por el fin de semana.", "¿Qué te gusta hacer los fines de semana?"],
    ]),
  },
  professional: {
    en: steps([
      ["Introduce yourself in a job interview.", "I'm a designer and I enjoy solving problems."],
      ["Describe a project you are proud of.", "I helped my team launch a new website."],
      ["Ask a colleague for an update.", "Could you give me an update on the project?"],
      ["Politely ask to change a deadline.", "Could we move the deadline to Friday?"],
      ["Explain how you dealt with a challenge.", "I asked for feedback and improved the design."],
      ["Ask the interviewer a question.", "What does a typical day in this role look like?"],
    ]),
    pt: steps([
      ["Apresente-se em uma entrevista de emprego.", "Sou designer e gosto de resolver problemas."],
      ["Descreva um projeto do qual se orgulha.", "Ajudei minha equipe a lançar um site."],
      ["Peça uma atualização a um colega.", "Você poderia me atualizar sobre o projeto?"],
      ["Peça educadamente para mudar um prazo.", "Podemos mudar o prazo para sexta-feira?"],
      ["Explique como lidou com um desafio.", "Pedi feedback e melhorei o projeto."],
      ["Faça uma pergunta ao entrevistador.", "Como é um dia típico nessa função?"],
    ]),
    es: steps([
      ["Preséntate en una entrevista de trabajo.", "Soy diseñador y me gusta resolver problemas."],
      [
        "Describe un proyecto del que estés orgulloso.",
        "Ayudé a mi equipo a lanzar una página web.",
      ],
      [
        "Pide a un compañero información sobre un proyecto.",
        "¿Podrías ponerme al día sobre el proyecto?",
      ],
      ["Pide con cortesía cambiar un plazo.", "¿Podemos cambiar el plazo al viernes?"],
      ["Explica cómo resolviste un reto.", "Pedí comentarios y mejoré el diseño."],
      ["Haz una pregunta al entrevistador.", "¿Cómo es un día típico en este puesto?"],
    ]),
  },
  "art-culture": {
    en: steps([
      [
        "Which film or artwork would you recommend?",
        "I'd recommend a film with a great soundtrack.",
      ],
      [
        "Describe what happens without revealing the ending.",
        "The story follows two friends on a journey.",
      ],
      ["Explain why you like it.", "I like it because the characters feel real."],
      ["Invite a friend to an exhibition.", "Would you like to visit an exhibition this weekend?"],
      ["Compare two kinds of art.", "I enjoy films, but paintings leave more to the imagination."],
      ["Ask someone about their favorite artist.", "Who is your favorite artist, and why?"],
    ]),
    pt: steps([
      ["Que filme ou obra você recomendaria?", "Recomendo um filme com uma ótima trilha sonora."],
      ["Conte o enredo sem revelar o final.", "A história acompanha dois amigos em uma viagem."],
      ["Explique por que você gosta da obra.", "Gosto dela porque os personagens parecem reais."],
      ["Convide alguém para uma exposição.", "Quer visitar uma exposição neste fim de semana?"],
      [
        "Compare dois tipos de arte.",
        "Gosto de filmes, mas pinturas deixam mais espaço à imaginação.",
      ],
      ["Pergunte sobre o artista favorito de alguém.", "Quem é seu artista favorito e por quê?"],
    ]),
    es: steps([
      ["¿Qué película u obra recomendarías?", "Recomiendo una película con una gran banda sonora."],
      ["Cuenta la trama sin revelar el final.", "La historia sigue a dos amigos en un viaje."],
      ["Explica por qué te gusta.", "Me gusta porque los personajes parecen reales."],
      ["Invita a alguien a una exposición.", "¿Quieres visitar una exposición este fin de semana?"],
      [
        "Compara dos tipos de arte.",
        "Me gustan las películas, pero la pintura deja más a la imaginación.",
      ],
      ["Pregunta por el artista favorito de alguien.", "¿Quién es tu artista favorito y por qué?"],
    ]),
  },
  "music-expression": {
    en: steps([
      ["What kind of music do you enjoy?", "I enjoy jazz because it helps me relax."],
      ["Describe how a song makes you feel.", "This song makes me feel hopeful."],
      ["Invite a friend to a concert.", "Would you like to go to a concert on Saturday?"],
      ["Talk about an instrument you would like to learn.", "I'd like to learn the piano."],
      ["Compare live music and recorded music.", "Live music feels more energetic to me."],
      ["Ask a friend for a recommendation.", "What song would you recommend for a long journey?"],
    ]),
    pt: steps([
      ["De que tipo de música você gosta?", "Gosto de jazz porque me ajuda a relaxar."],
      ["Descreva como uma música faz você se sentir.", "Essa música me dá esperança."],
      ["Convide alguém para um show.", "Quer ir a um show no sábado?"],
      ["Fale de um instrumento que gostaria de aprender.", "Gostaria de aprender a tocar piano."],
      ["Compare música ao vivo e gravada.", "Para mim, a música ao vivo tem mais energia."],
      ["Peça uma recomendação a um amigo.", "Que música você recomenda para uma viagem longa?"],
    ]),
    es: steps([
      ["¿Qué tipo de música te gusta?", "Me gusta el jazz porque me ayuda a relajarme."],
      ["Describe cómo te hace sentir una canción.", "Esta canción me hace sentir esperanza."],
      ["Invita a alguien a un concierto.", "¿Quieres ir a un concierto el sábado?"],
      [
        "Habla de un instrumento que te gustaría aprender.",
        "Me gustaría aprender a tocar el piano.",
      ],
      ["Compara música en vivo y grabada.", "Para mí, la música en vivo tiene más energía."],
      ["Pide una recomendación a un amigo.", "¿Qué canción recomiendas para un viaje largo?"],
    ]),
  },
  relationships: {
    en: steps([
      ["Tell me about a good friend.", "My friend is kind and has a great sense of humor."],
      ["Invite your friend to do something.", "Would you like to have lunch together?"],
      ["Politely decline an invitation.", "Thanks for inviting me, but I'm busy that day."],
      ["Suggest another day to meet.", "Could we meet on Sunday instead?"],
      ["Describe something you enjoy doing together.", "We enjoy cooking and trying new recipes."],
      ["Ask a new friend about their interests.", "What do you like to do in your free time?"],
    ]),
    pt: steps([
      ["Conte algo sobre um bom amigo.", "Meu amigo é gentil e tem muito bom humor."],
      ["Convide seu amigo para fazer algo.", "Quer almoçar comigo?"],
      ["Recuse um convite com educação.", "Obrigado pelo convite, mas estou ocupado nesse dia."],
      ["Sugira outro dia para o encontro.", "Podemos nos encontrar no domingo?"],
      [
        "Descreva algo que gostam de fazer juntos.",
        "Gostamos de cozinhar e experimentar receitas.",
      ],
      [
        "Pergunte a um novo amigo sobre seus interesses.",
        "O que você gosta de fazer no tempo livre?",
      ],
    ]),
    es: steps([
      ["Cuéntame algo sobre un buen amigo.", "Mi amigo es amable y tiene buen sentido del humor."],
      ["Invita a tu amigo a hacer algo.", "¿Quieres almorzar conmigo?"],
      [
        "Rechaza una invitación con cortesía.",
        "Gracias por invitarme, pero estoy ocupado ese día.",
      ],
      ["Sugiere otro día para quedar.", "¿Podemos vernos el domingo?"],
      ["Describe algo que disfrutan haciendo juntos.", "Nos gusta cocinar y probar recetas."],
      ["Pregunta a un nuevo amigo por sus intereses.", "¿Qué te gusta hacer en tu tiempo libre?"],
    ]),
  },
  "speaking-confidence": {
    en: steps([
      ["Introduce yourself in one short sentence.", "Hi, I'm Alex and I'm learning English."],
      ["Share one thing you enjoy.", "I enjoy walking in the park."],
      ["Ask someone to speak more slowly.", "Could you speak more slowly, please?"],
      ["Ask how to say a word.", "How do you say this in English?"],
      ["Give yourself time to think.", "Let me think for a moment."],
      ["Say what you would like to practice next.", "I'd like to practice ordering food."],
    ]),
    pt: steps([
      ["Apresente-se em uma frase curta.", "Olá, sou Alex e estou aprendendo português."],
      ["Conte algo de que você gosta.", "Gosto de caminhar no parque."],
      ["Peça para alguém falar mais devagar.", "Pode falar mais devagar, por favor?"],
      ["Pergunte como se diz uma palavra.", "Como se diz isso em português?"],
      ["Ganhe tempo para pensar.", "Deixe-me pensar um pouco."],
      ["Diga o que gostaria de praticar agora.", "Gostaria de praticar como pedir comida."],
    ]),
    es: steps([
      ["Preséntate con una frase corta.", "Hola, soy Alex y estoy aprendiendo español."],
      ["Cuenta algo que disfrutas.", "Me gusta pasear por el parque."],
      ["Pide que alguien hable más despacio.", "¿Puedes hablar más despacio, por favor?"],
      ["Pregunta cómo se dice una palabra.", "¿Cómo se dice esto en español?"],
      ["Gana tiempo para pensar.", "Déjame pensar un momento."],
      ["Di qué te gustaría practicar ahora.", "Me gustaría practicar cómo pedir comida."],
    ]),
  },
};
SCENARIOS["free-talk"] = {
  en: steps([
    ["What would you like to talk about today?", "I'd like to talk about my hobbies."],
    ["Tell me one thing you enjoy about it.", "I enjoy it because it helps me relax."],
    ["Describe the last time you did that.", "Last weekend I practiced with a friend."],
    ["Ask a question about the same subject.", "What do you enjoy doing in your free time?"],
    ["Share a plan for next week.", "Next week I'd like to try something new."],
    ["Give an opinion and a reason.", "I think practice is useful because it builds confidence."],
  ]),
  pt: steps([
    ["Sobre o que você gostaria de conversar hoje?", "Gostaria de falar sobre meus passatempos."],
    ["Conte algo que você gosta nesse assunto.", "Gosto disso porque me ajuda a relaxar."],
    ["Descreva a última vez que fez isso.", "No fim de semana pratiquei com um amigo."],
    ["Faça uma pergunta sobre o mesmo assunto.", "O que você gosta de fazer no tempo livre?"],
    [
      "Conte um plano para a próxima semana.",
      "Na próxima semana gostaria de experimentar algo novo.",
    ],
    ["Dê uma opinião e um motivo.", "Acho que praticar é útil porque traz confiança."],
  ]),
  es: steps([
    ["¿De qué te gustaría hablar hoy?", "Me gustaría hablar de mis aficiones."],
    ["Cuenta algo que te gusta de ese tema.", "Me gusta porque me ayuda a relajarme."],
    ["Describe la última vez que lo hiciste.", "El fin de semana practiqué con un amigo."],
    ["Haz una pregunta sobre el mismo tema.", "¿Qué te gusta hacer en tu tiempo libre?"],
    ["Cuenta un plan para la próxima semana.", "La próxima semana me gustaría probar algo nuevo."],
    ["Da una opinión y una razón.", "Creo que practicar es útil porque da confianza."],
  ]),
};

const TEXT = {
  en: {
    hello: "Welcome to guided practice",
    example: "Try",
    next: "Next step",
    correction: "One useful adjustment",
    help: "Use this model and change one detail",
    challenge: "Add a reason and ask a follow-up question.",
    done: "You completed this scenario. You can save the session or restart with different details.",
    restart: "Start again",
    thanks: "You're welcome. Let's keep practicing.",
    bye: "Practice complete. Save your session whenever you're ready.",
    short: "Try a complete sentence. You can adapt this example",
    unknown: "This is a guided scenario. Use the example as a starting point",
    yes: "Try agreeing in a full sentence",
    no: "Try declining politely",
  },
  pt: {
    hello: "Boas-vindas à prática guiada",
    example: "Experimente",
    next: "Próximo passo",
    correction: "Um ajuste útil",
    help: "Use este modelo e mude um detalhe",
    challenge: "Acrescente um motivo e faça uma pergunta relacionada.",
    done: "Você concluiu este cenário. Pode salvar a sessão ou recomeçar com outros detalhes.",
    restart: "Recomeçar",
    thanks: "De nada. Vamos continuar praticando.",
    bye: "Prática concluída. Salve sua sessão quando quiser.",
    short: "Tente uma frase completa. Você pode adaptar este exemplo",
    unknown: "Este é um cenário guiado. Use o exemplo como ponto de partida",
    yes: "Experimente concordar com uma frase completa",
    no: "Experimente recusar com educação",
  },
  es: {
    hello: "Bienvenido a la práctica guiada",
    example: "Prueba",
    next: "Siguiente paso",
    correction: "Un ajuste útil",
    help: "Usa este modelo y cambia un detalle",
    challenge: "Añade una razón y haz una pregunta relacionada.",
    done: "Has completado este escenario. Puedes guardar la sesión o empezar de nuevo con otros detalles.",
    restart: "Empezar de nuevo",
    thanks: "De nada. Sigamos practicando.",
    bye: "Práctica terminada. Guarda tu sesión cuando quieras.",
    short: "Intenta una frase completa. Puedes adaptar este ejemplo",
    unknown: "Este es un escenario guiado. Usa el ejemplo como punto de partida",
    yes: "Intenta responder afirmativamente con una frase completa",
    no: "Intenta rechazar con cortesía",
  },
};
const HELP =
  /^(help|hint|ajuda|dica|ayuda|pista|não sei|nao sei|no sé|no se|i don'?t know|explain|explique|explica)[.!?\s]*$/i;
const RESET = /^(start again|restart|recomeçar|recomecar|empezar de nuevo)[.!?\s]*$/i;
const CORRECTIONS: Record<PracticeLanguage, Array<[RegExp, string]>> = {
  en: [
    [/\bi am agree\b/i, "I agree"],
    [/\bi have (\d+) years old\b/i, "I am $1 years old"],
    [/\bi am go\b/i, "I am going"],
    [/\bshe don't\b/i, "she doesn't"],
    [/\bhe don't\b/i, "he doesn't"],
    [/\bi want go\b/i, "I want to go"],
    [/\bi like very much it\b/i, "I like it very much"],
  ],
  pt: [
    [/\ba gente vamos\b/i, "a gente vai"],
    [/\beu gosta\b/i, "eu gosto"],
    [/\bmim quero\b/i, "eu quero"],
  ],
  es: [
    [/\byo gusta\b/i, "me gusta"],
    [/\byo es\b/i, "yo soy"],
    [/\byo tengo (\d+) años viejo\b/i, "tengo $1 años"],
  ],
};
export function guidedTurn(input: {
  topic: string;
  language: PracticeLanguage;
  studentName?: string;
  level?: "beginner" | "intermediate" | "advanced";
  mood?: string;
  messages: Message[];
  prompt?: string;
}) {
  const language = TEXT[input.language] ? input.language : "en";
  const text = TEXT[language];
  const curriculum = (SCENARIOS[input.topic] || SCENARIOS["free-talk"])[language];
  const users = input.messages.filter((m) => m.role === "user");
  const resetIndex = users.map((m) => RESET.test(m.content.trim())).lastIndexOf(true);
  const current = users.slice(resetIndex + 1);
  const last = current.at(-1)?.content.trim().slice(0, 4000) || "";
  const answers = current.filter(
    (m) => !HELP.test(m.content.trim()) && m.content.trim().split(/\s+/).length >= 2,
  );
  const index = Math.min(answers.length, curriculum.length - 1);
  const step = curriculum[index];
  const suggestions = [
    step.example,
    language === "pt" ? "Ajuda" : language === "es" ? "Ayuda" : "Help",
  ];
  if (!last) {
    const name = input.studentName?.replace(/[\r\n<>]/g, "").slice(0, 40);
    const prompt = input.prompt?.trim().slice(0, 180);
    return {
      reply: `${text.hello}${name ? `, ${name}` : ""}! ${prompt ? `${prompt}\n\n` : ""}${step.question}\n${text.example}: ${step.example}`,
      suggestions,
      earnsXP: false,
      complete: false,
    };
  }
  if (HELP.test(last))
    return {
      reply: `${text.help}: “${step.example}”\n${step.question}`,
      suggestions,
      earnsXP: false,
      complete: false,
    };
  if (/^(bye|goodbye|tchau|até logo|adiós|adios)[.!?\s]*$/i.test(last))
    return { reply: text.bye, suggestions: [text.restart], earnsXP: false, complete: true };
  if (answers.length >= curriculum.length)
    return { reply: text.done, suggestions: [text.restart], earnsXP: true, complete: true };
  if (last.split(/\s+/).length < 2) {
    const intent = /^(yes|sim|sí|si)[.!?]*$/i.test(last)
      ? text.yes
      : /^(no|não|nao)[.!?]*$/i.test(last)
        ? text.no
        : text.short;
    return { reply: `${intent}: “${step.example}”`, suggestions, earnsXP: false, complete: false };
  }
  const correction =
    input.mood === "confidence"
      ? null
      : CORRECTIONS[language].find(([pattern]) => pattern.test(last));
  const feedback = correction
    ? `${text.correction}: “${last.replace(correction[0], correction[1])}”.\n\n`
    : "";
  const challenge = input.level === "advanced" ? `\n${text.challenge}` : "";
  return {
    reply: `${feedback}${text.next}: ${step.question}\n${text.example}: ${step.example}${challenge}`,
    suggestions,
    earnsXP: true,
    complete: false,
  };
}
