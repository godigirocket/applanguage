
export interface Question {
  id: string;
  language: 'en' | 'pt';
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'listen_choose' | 'translate';
  question: string;
  options?: string[];
  correct: string;
  explanation: string;
  xp: number; 
}

export const QUESTIONS: Question[] = [
  // --- ENGLISH QUESTIONS ---
  // Category: Grammar - Beginner
  { id:'en-gr-001', language:'en', level:'beginner', category:'grammar', type:'multiple_choice',
    question: "Which is correct?", options:["I am go to school","I go to school","I goes to school","I going to school"], correct:"I go to school", explanation:"Use base verb form with I/you/we/they in simple present.", xp:5 },
  { id:'en-gr-002', language:'en', level:'beginner', category:'grammar', type:'multiple_choice',
    question: "She ___ a doctor.", options:["am","are","is","be"], correct:"is", explanation:"Use 'is' with he/she/it.", xp:5 },
  { id:'en-gr-003', language:'en', level:'beginner', category:'grammar', type:'true_false',
    question: "'They plays football' is correct.", options:["True","False"], correct:"False", explanation:"With they, use 'play' not 'plays'.", xp:5 },
  { id:'en-gr-004', language:'en', level:'beginner', category:'grammar', type:'multiple_choice',
    question: "I ___ coffee every morning.", options:["drink","drinks","drinking","drank"], correct:"drink", explanation:"Simple present with I uses base form.", xp:5 },
  { id:'en-gr-005', language:'en', level:'beginner', category:'grammar', type:'multiple_choice',
    question: "There ___ many students in the class.", options:["is","am","are","be"], correct:"are", explanation:"Use 'are' with plural nouns.", xp:5 },
  { id:'en-gr-006', language:'en', level:'beginner', category:'grammar', type:'multiple_choice',
    question: "What ___ you doing right now?", options:["is","am","are","do"], correct:"are", explanation:"Present continuous with you uses 'are'.", xp:5 },
  { id:'en-gr-007', language:'en', level:'beginner', category:'grammar', type:'multiple_choice',
    question: "She ___ to music every night.", options:["listen","listens","listening","listened"], correct:"listens", explanation:"Add -s with he/she/it in simple present.", xp:5 },
  { id:'en-gr-008', language:'en', level:'beginner', category:'grammar', type:'true_false',
    question: "'He don't like pizza' is correct.", options:["True","False"], correct:"False", explanation:"With he/she/it use 'doesn't', not 'don't'.", xp:5 },
  { id:'en-gr-009', language:'en', level:'beginner', category:'grammar', type:'multiple_choice',
    question: "We ___ at home yesterday.", options:["was","were","are","be"], correct:"were", explanation:"Use 'were' with we/you/they in past.", xp:5 },
  { id:'en-gr-010', language:'en', level:'beginner', category:'grammar', type:'multiple_choice',
    question: "___ you speak English?", options:["Do","Does","Are","Is"], correct:"Do", explanation:"Use 'Do' for questions with I/you/we/they.", xp:5 },
  // Adding more beginner grammar to reach 30...
  { id:'en-gr-011', language:'en', level:'beginner', category:'grammar', type:'multiple_choice',
    question: "This is ___ apple.", options:["a","an","the","some"], correct:"an", explanation:"Use 'an' before words starting with vowel sounds.", xp:5 },
  { id:'en-gr-012', language:'en', level:'beginner', category:'grammar', type:'multiple_choice',
    question: "Where ___ they from?", options:["is","am","are","be"], correct:"are", explanation:"Use 'are' with 'they'.", xp:5 },
  { id:'en-gr-013', language:'en', level:'beginner', category:'grammar', type:'multiple_choice',
    question: "He ___ breakfast at 8 AM.", options:["have","has","having","had"], correct:"has", explanation:"He/she/it uses 'has'.", xp:5 },
  { id:'en-gr-014', language:'en', level:'beginner', category:'grammar', type:'multiple_choice',
    question: "Do you like ___?", options:["swim","swimming","swims","swam"], correct:"swimming", explanation:"Use gerund after 'like'.", xp:5 },
  { id:'en-gr-015', language:'en', level:'beginner', category:'grammar', type:'multiple_choice',
    question: "___ color is your car?", options:["Who","Where","What","When"], correct:"What", explanation:"Use 'What' to ask about objects/colors.", xp:5 },

  // Grammar - Intermediate
  { id:'en-gr-031', language:'en', level:'intermediate', category:'grammar', type:'multiple_choice',
    question: "By the time she arrived, we ___ dinner.", options:["finished","had finished","have finished","finish"], correct:"had finished", explanation:"Past perfect shows action completed before another past action.", xp:10 },
  { id:'en-gr-032', language:'en', level:'intermediate', category:'grammar', type:'multiple_choice',
    question: "If I ___ rich, I would travel the world.", options:["am","was","were","be"], correct:"were", explanation:"Second conditional uses 'were' for all persons.", xp:10 },
  { id:'en-gr-033', language:'en', level:'intermediate', category:'grammar', type:'fill_blank',
    question: "She suggested ___ (go) to the cinema.", options:["to go","going","go","gone"], correct:"going", explanation:"After 'suggest', use verb+ing.", xp:10 },
  { id:'en-gr-034', language:'en', level:'intermediate', category:'grammar', type:'multiple_choice',
    question: "The report ___ by tomorrow.", options:["will finish","will be finished","is finishing","finishes"], correct:"will be finished", explanation:"Future passive: will be + past participle.", xp:10 },
  { id:'en-gr-035', language:'en', level:'intermediate', category:'grammar', type:'multiple_choice',
    question: "I ___ here for three years.", options:["work","worked","have worked","am working"], correct:"have worked", explanation:"Present perfect for duration up to now.", xp:10 },

  // Grammar - Advanced
  { id:'en-gr-061', language:'en', level:'advanced', category:'grammar', type:'multiple_choice',
    question: "Rarely ___ such dedication.", options:["I have seen","have I seen","I saw","saw I"], correct:"have I seen", explanation:"Inversion after negative adverbs like 'rarely'.", xp:15 },
  { id:'en-gr-062', language:'en', level:'advanced', category:'grammar', type:'multiple_choice',
    question: "She ___ have called — it wasn't necessary.", options:["needn't","mustn't","couldn't","shouldn't"], correct:"needn't", explanation:"'Needn't have' = it was unnecessary (but they did it).", xp:15 },

  // Category: Vocabulary
  { id:'en-vo-001', language:'en', level:'beginner', category:'vocabulary', type:'multiple_choice',
    question: "What does 'grateful' mean?", options:["angry","thankful","sad","confused"], correct:"thankful", explanation:"Grateful means feeling thankful for something.", xp:5 },
  { id:'en-vo-002', language:'en', level:'beginner', category:'vocabulary', type:'multiple_choice',
    question: "The opposite of 'ancient' is:", options:["old","modern","big","slow"], correct:"modern", explanation:"Ancient means very old; modern means current/new.", xp:5 },
  { id:'en-vo-003', language:'en', level:'intermediate', category:'vocabulary', type:'multiple_choice',
    question: "She was ___ by the complexity of the problem.", options:["baffled","delighted","energized","satisfied"], correct:"baffled", explanation:"Baffled means completely confused or puzzled.", xp:10 },
  { id:'en-vo-004', language:'en', level:'intermediate', category:'vocabulary', type:'multiple_choice',
    question: "'Ubiquitous' means:", options:["rare","everywhere","underground","silent"], correct:"everywhere", explanation:"Ubiquitous = present, appearing, or found everywhere.", xp:10 },
  { id:'en-vo-005', language:'en', level:'advanced', category:'vocabulary', type:'multiple_choice',
    question: "A 'ephemeral' trend is one that:", options:["lasts forever","is very popular","lasts a short time","is controversial"], correct:"lasts a short time", explanation:"Ephemeral = lasting for a very short time.", xp:15 },

  // Category: Idioms
  { id:'en-id-001', language:'en', level:'intermediate', category:'idioms', type:'multiple_choice',
    question: "'Break a leg' means:", options:["get injured","good luck","run fast","be careful"], correct:"good luck", explanation:"'Break a leg' is a theatrical way to wish someone good luck.", xp:10 },
  { id:'en-id-002', language:'en', level:'intermediate', category:'idioms', type:'multiple_choice',
    question: "'Hit the sack' means:", options:["go to bed","punch something","go shopping","start working"], correct:"go to bed", explanation:"'Hit the sack' is informal for going to sleep.", xp:10 },
  { id:'en-id-003', language:'en', level:'intermediate', category:'idioms', type:'multiple_choice',
    question: "'Under the weather' means:", options:["outdoors","feeling sick","very hot","working hard"], correct:"feeling sick", explanation:"Feeling under the weather = feeling ill or unwell.", xp:10 },
  { id:'en-id-004', language:'en', level:'intermediate', category:'idioms', type:'multiple_choice',
    question: "'Bite the bullet' means:", options:["eat fast","endure something painful","shoot a gun","be very hungry"], correct:"endure something painful", explanation:"To bite the bullet = to endure a painful situation bravely.", xp:10 },
  { id:'en-id-005', language:'en', level:'advanced', category:'idioms', type:'multiple_choice',
    question: "'Burn the midnight oil' means:", options:["start a fire","work late into the night","waste energy","cook dinner late"], correct:"work late into the night", explanation:"To burn the midnight oil = to work or study late at night.", xp:15 },

  // Category: Culture
  { id:'en-cu-001', language:'en', level:'beginner', category:'culture', type:'multiple_choice',
    question: "In the US, what do you say when someone sneezes?", options:["Good luck","Bless you","Thank you","Sorry"], correct:"Bless you", explanation:"'Bless you' or 'gesundheit' is said after someone sneezes.", xp:5 },
  { id:'en-cu-002', language:'en', level:'beginner', category:'culture', type:'multiple_choice',
    question: "What is 'small talk'?", options:["Speaking quietly","Casual conversation about unimportant things","Talking to children","A short speech"], correct:"Casual conversation about unimportant things", explanation:"Small talk = light, informal conversation about everyday topics.", xp:5 },
  { id:'en-cu-003', language:'en', level:'intermediate', category:'culture', type:'multiple_choice',
    question: "In a job interview in English-speaking countries, it's normal to:", options:["Bring your parents","Arrive 5-10 minutes early","Negotiate salary immediately","Call the interviewer by nickname"], correct:"Arrive 5-10 minutes early", explanation:"Punctuality is important; arriving slightly early shows respect.", xp:10 },

  // --- PORTUGUESE QUESTIONS ---
  // Category: Gramática
  { id:'pt-gr-001', language:'pt', level:'beginner', category:'grammar', type:'multiple_choice',
    question: "Qual é o plural de 'animal'?", options:["animals","animais","animales","animáis"], correct:"animais", explanation:"Palavras terminadas em -al formam o plural em -ais.", xp:5 },
  { id:'pt-gr-002', language:'pt', level:'beginner', category:'grammar', type:'multiple_choice',
    question: "Eu ___ no Brasil.", options:["moro","mora","moram","morei"], correct:"moro", explanation:"Com 'eu', use a primeira pessoa do singular: moro.", xp:5 },
  { id:'pt-gr-003', language:'pt', level:'beginner', category:'grammar', type:'multiple_choice',
    question: "Ela ___ muito inteligente.", options:["é","são","somos","sou"], correct:"é", explanation:"Com ela/ele, use 'é' (terceira pessoa do singular de 'ser').", xp:5 },
  { id:'pt-gr-004', language:'pt', level:'beginner', category:'grammar', type:'true_false',
    question: "'Nós vai ao mercado' está correto.", options:["Verdadeiro","Falso"], correct:"Falso", explanation:"Com 'nós', use 'vamos': Nós vamos ao mercado.", xp:5 },
  { id:'pt-gr-005', language:'pt', level:'intermediate', category:'grammar', type:'multiple_choice',
    question: "Se eu ___ tempo, viajaria.", options:["tenho","tiver","tivesse","tinha"], correct:"tivesse", explanation:"Conjuntivo imperfeito no período condicional: Se + imperfeito do subjuntivo.", xp:10 },
  
  // Category: Vocabulário
  { id:'pt-vo-001', language:'pt', level:'beginner', category:'vocabulary', type:'multiple_choice',
    question: "O que significa 'saudade'?", options:["alegria","raiva","nostalgia/longing","surpresa"], correct:"nostalgia/longing", explanation:"Saudade é uma palavra portuguesa única: nostalgia por algo ou alguém amado.", xp:5 },
  { id:'pt-vo-002', language:'pt', level:'beginner', category:'vocabulary', type:'multiple_choice',
    question: "Qual é o sinônimo de 'bonito'?", options:["feio","lindo","triste","rápido"], correct:"lindo", explanation:"Bonito e lindo são sinônimos que significam beautiful/handsome.", xp:5 },
  
  // Category: Expressões
  { id:'pt-ex-001', language:'pt', level:'intermediate', category:'expressions', type:'multiple_choice',
    question: "'Que saudade!' significa:", options:["Que raiva!","Que medo!","I miss this so much!","Que surpresa!"], correct:"I miss this so much!", explanation:"Saudade expressa um profundo sentimento de falta/nostalgia.", xp:10 },
  { id:'pt-ex-002', language:'pt', level:'intermediate', category:'expressions', type:'multiple_choice',
    question: "'Tá bom' significa:", options:["Está ruim","Está ótimo","Okay / alright","Não sei"], correct:"Okay / alright", explanation:"'Tá bom' é uma forma coloquial de dizer 'okay' ou 'está bem'.", xp:10 },

  // Category: Professional English
  { id:'en-pr-001', language:'en', level:'intermediate', category:'professional', type:'multiple_choice',
    question: "In a formal email, which opening is correct?", options:["Hey!","Yo,","Dear Mr. Smith,","Wassup,"], correct:"Dear Mr. Smith,", explanation:"Formal emails begin with 'Dear [Title] [Last name],'", xp:10 },
  { id:'en-pr-002', language:'en', level:'intermediate', category:'professional', type:'multiple_choice',
    question: "To 'cc' someone on an email means:", options:["Delete them","Send them a copy","Block them","Reply to them only"], correct:"Send them a copy", explanation:"CC = Carbon Copy. They receive the email but aren't the main recipient.", xp:10 },
  { id:'en-pr-003', language:'en', level:'intermediate', category:'professional', type:'multiple_choice',
    question: "'Let's circle back on this' means:", options:["Go in circles","Return to this topic later","Disagree","Cancel the meeting"], correct:"Return to this topic later", explanation:"Common business expression meaning to revisit a topic.", xp:10 },
  { id:'en-pr-004', language:'en', level:'advanced', category:'professional', type:'multiple_choice',
    question: "'We need to move the needle on this' means:", options:["Fix the sewing machine","Make significant progress","Change direction","Be more careful"], correct:"Make significant progress", explanation:"Business idiom meaning to make meaningful progress on something.", xp:15 },

  // Category: Daily Conversations
  { id:'en-dc-001', language:'en', level:'beginner', category:'daily', type:'multiple_choice',
    question: "Someone asks 'How are you?' The most natural reply is:", options:["I am fine, and you?","Yes, I am.","Good, thanks! You?","Fine. Goodbye."], correct:"Good, thanks! You?", explanation:"Natural responses are brief and return the question.", xp:5 },
  { id:'en-dc-002', language:'en', level:'beginner', category:'daily', type:'multiple_choice',
    question: "You didn't hear what someone said. You say:", options:["What?!","I don't understand your language.","Sorry, could you repeat that?","Speak louder!"], correct:"Sorry, could you repeat that?", explanation:"Polite way to ask someone to repeat themselves.", xp:5 },

  // --- PORTUGUESE QUESTIONS EXPANSION ---
  // Category: Expressões Brasileiras
  { id:'pt-ex-003', language:'pt', level:'beginner', category:'expressions', type:'multiple_choice',
    question: "Como se diz 'you're welcome' em português brasileiro?", options:["Com licença","De nada","Por favor","Obrigado"], correct:"De nada", explanation:"'De nada' é a resposta a 'obrigado/a'.", xp:5 },
  { id:'pt-ex-004', language:'pt', level:'intermediate', category:'expressions', type:'multiple_choice',
    question: "'Dar um jeito' significa:", options:["Desistir","Encontrar uma solução","Fazer bagunça","Ir embora"], correct:"Encontrar uma solução", explanation:"'Dar um jeito' = to find a way, to sort it out. Very Brazilian!", xp:10 },
  { id:'pt-ex-005', language:'pt', level:'intermediate', category:'expressions', type:'multiple_choice',
    question: "'Ficar' em contexto romântico significa:", options:["ficar parado","namorar sério","kissing/making out casually","ir embora"], correct:"kissing/making out casually", explanation:"'Ficar' in Brazilian culture = casual romantic encounter without commitment.", xp:10 },
  
  // Category: Cultura Brasileira
  { id:'pt-cu-003', language:'pt', level:'intermediate', category:'culture', type:'multiple_choice',
    question: "O 'jeitinho brasileiro' se refere a:", options:["Uma dança","A criatividade para resolver problemas","Um prato típico","Uma lei"], correct:"A criatividade para resolver problemas", explanation:"'Jeitinho brasileiro' = the Brazilian way of finding creative solutions.", xp:10 },
  { id:'pt-cu-004', language:'pt', level:'beginner', category:'culture', type:'multiple_choice',
    question: "Qual é a língua oficial do Brasil?", options:["Espanhol","Inglês","Português","Francês"], correct:"Português", explanation:"Brazil is the only Portuguese-speaking country in South America.", xp:5 },
];
