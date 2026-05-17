import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Configuração básica do i18n (Pode ser expandida carregando de arquivos JSON depois)
const resources = {
  pt: {
    translation: {
      "home": "Início",
      "practice": "Praticar",
      "lessons": "Lições",
      "play": "Jogar",
      "skills": "Habilidades",
      "progress": "Progresso",
      "guide": "Como Usar",
      "shop": "Loja",
      "welcome": "Bem-vindo de volta",
      "daily_challenges": "Desafios Diários",
      "lumes": "Lumes",
    }
  },
  en: {
    translation: {
      "home": "Home",
      "practice": "Practice",
      "lessons": "Lessons",
      "play": "Play",
      "skills": "Skills",
      "progress": "Progress",
      "guide": "Guide",
      "shop": "Shop",
      "welcome": "Welcome back",
      "daily_challenges": "Daily Challenges",
      "lumes": "Lumes",
    }
  },
  es: {
    translation: {
      "home": "Inicio",
      "practice": "Practicar",
      "lessons": "Lecciones",
      "play": "Jugar",
      "skills": "Habilidades",
      "progress": "Progreso",
      "guide": "Guía",
      "shop": "Tienda",
      "welcome": "Bienvenido de nuevo",
      "daily_challenges": "Retos Diarios",
      "lumes": "Lumes",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "pt", // idioma padrão
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
