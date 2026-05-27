import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export function startTutorial() {
  const driverObj = driver({
    showProgress: true,
    steps: [
      {
        element: 'a[href="/home"]',
        popover: {
          title: "Início",
          description: "Acompanhe seu progresso diário, streak e missões.",
        },
      },
      {
        element: 'a[href="/lessons"]',
        popover: {
          title: "Lições",
          description:
            "Aqui estão todas as aulas organizadas por nível e categoria. Comece pelo básico!",
        },
      },
      {
        element: 'a[href="/games"]',
        popover: {
          title: "Jogos & Quizzes",
          description:
            "Divirta-se aprendendo com 18 modos de jogo, incluindo novos: Sobrevivência, Contra o Relógio e Flashcards.",
        },
      },
      {
        element: 'a[href="/culture"]',
        popover: {
          title: "Mapa Cultural",
          description: "Explore o mundo, aprenda gírias locais e marcos históricos.",
        },
      },
      {
        element: 'a[href="/profile"]',
        popover: {
          title: "Perfil",
          description: "Veja suas conquistas, edite idiomas e configure o app.",
        },
      },
    ],
    doneBtnText: "Começar!",
    nextBtnText: "Próximo",
    prevBtnText: "Anterior",
  });

  // Atrasar levemente o início para garantir que o DOM foi totalmente renderizado
  setTimeout(() => {
    driverObj.drive();
  }, 100);
}
