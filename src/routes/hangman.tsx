import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppHeader } from "@/components/lume/AppHeader";
import { useStore } from "@/hooks/useStore";
import vocabulary from "@/data/vocabulary.json";

export const Route = createFileRoute("/hangman")({
  component: HangmanGamePage,
});

function HangmanGamePage() {
  const { targetLanguage, addXP, addLumes } = useStore();
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const maxMistakes = 6;

  useEffect(() => {
    startNewGame();
  }, [targetLanguage]);

  const startNewGame = () => {
    const words = vocabulary[targetLanguage as keyof typeof vocabulary] || [];
    if (words.length > 0) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setWord(randomWord.word.toUpperCase());
      setTranslation(randomWord.translation);
      setGuessedLetters(new Set());
      setMistakes(0);
    }
  };

  const guessLetter = (letter: string) => {
    if (guessedLetters.has(letter) || mistakes >= maxMistakes || isWinner) return;
    
    const newGuessed = new Set(guessedLetters).add(letter);
    setGuessedLetters(newGuessed);

    if (!word.includes(letter)) {
      setMistakes(m => m + 1);
    }
  };

  const isWinner = word.split('').every(l => guessedLetters.has(l) || l === ' ');
  const isLoser = mistakes >= maxMistakes;

  useEffect(() => {
    if (isWinner) {
      setTimeout(() => {
        alert("Parabéns! Você acertou! +30 XP");
        addXP(30);
        addLumes(10);
        startNewGame();
      }, 500);
    } else if (isLoser) {
      setTimeout(() => {
        alert(`Fim de jogo! A palavra era: ${word}`);
        startNewGame();
      }, 500);
    }
  }, [isWinner, isLoser]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EF' }}>
      <AppHeader />
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px', animation: 'pageEnter 0.5s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: Nunito, fontSize: '32px', color: '#1C1C1A', fontWeight: 800 }}>Forca do Vocabulário</h1>
          <p style={{ color: '#6B6B63', fontSize: '16px' }}>Tradução: <strong>{translation}</strong></p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '40px', fontSize: '24px', fontWeight: 800, color: '#C4714A' }}>
          Erros: {mistakes} / {maxMistakes}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {word.split('').map((letter, idx) => (
            <div key={idx} style={{
              width: '40px', height: '50px', borderBottom: letter === ' ' ? 'none' : '3px solid #1C1C1A',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
              fontSize: '28px', fontWeight: 800, color: '#2D4A3E'
            }}>
              {(guessedLetters.has(letter) || isLoser) ? letter : ''}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          {alphabet.map(letter => (
            <button
              key={letter}
              onClick={() => guessLetter(letter)}
              disabled={guessedLetters.has(letter) || isWinner || isLoser}
              style={{
                width: '40px', height: '40px', borderRadius: '8px',
                border: '1px solid #E0DDD6',
                background: guessedLetters.has(letter) ? '#E0DDD6' : 'white',
                color: guessedLetters.has(letter) ? '#A8A8A0' : '#1C1C1A',
                fontWeight: 700, cursor: guessedLetters.has(letter) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
