import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppHeader } from "@/components/lume/AppHeader";
import { useStore } from "@/hooks/useStore";
import vocabulary from "@/data/vocabulary.json";

export const Route = createFileRoute("/memory")({
  component: MemoryGamePage,
});

type Card = {
  id: number;
  text: string;
  matchId: number;
  isFlipped: boolean;
  isMatched: boolean;
};

function MemoryGamePage() {
  const { targetLanguage, addXP, addLumes } = useStore();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    initializeGame();
  }, [targetLanguage]);

  const initializeGame = () => {
    const words = vocabulary[targetLanguage as keyof typeof vocabulary]?.slice(0, 6) || [];
    let initialCards: Card[] = [];
    
    words.forEach((w, idx) => {
      initialCards.push({ id: idx * 2, text: w.word, matchId: idx, isFlipped: false, isMatched: false });
      initialCards.push({ id: idx * 2 + 1, text: w.translation, matchId: idx, isFlipped: false, isMatched: false });
    });

    // Shuffle
    initialCards.sort(() => Math.random() - 0.5);
    setCards(initialCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      if (cards[firstIdx].matchId === cards[secondIdx].matchId) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIdx].isMatched = true;
          matchedCards[secondIdx].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          setMatches(m => m + 1);
          
          if (matches + 1 === 6) {
            addXP(50);
            addLumes(15);
            alert("Você venceu! +50 XP e +15 Lumes");
          }
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIdx].isFlipped = false;
          resetCards[secondIdx].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <AppHeader />
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px', animation: 'pageEnter 0.5s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '32px', color: 'var(--text-primary)', fontWeight: 800 }}>Jogo da Memória</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>Encontre os pares de tradução. Movimentos: {moves}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {cards.map((card, idx) => (
            <div 
              key={card.id}
              onClick={() => handleCardClick(idx)}
              style={{
                height: '100px',
                background: card.isFlipped || card.isMatched ? 'white' : 'var(--accent-green)',
                color: card.isFlipped || card.isMatched ? 'var(--text-primary)' : 'transparent',
                borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: card.isMatched ? '2px solid #4A7A5A' : 'none',
                transition: 'all 0.3s transform',
                transform: card.isFlipped ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              {(card.isFlipped || card.isMatched) ? card.text : '?'}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button onClick={initializeGame} style={{ padding: '12px 24px', borderRadius: '12px', background: 'var(--text-primary)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
            Reiniciar Jogo
          </button>
        </div>
      </div>
    </div>
  );
}
