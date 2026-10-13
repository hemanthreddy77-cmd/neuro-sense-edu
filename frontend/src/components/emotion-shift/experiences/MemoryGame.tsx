import { useState, useEffect } from "react";
import {
  Brain,
  Heart,
  Sparkles,
  Zap,
  Sun,
  Compass,
  Star,
  Eye,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { GradientButton } from "@/components/common/GradientButton";

interface MemoryGameProps {
  onComplete?: () => void;
}

const CARD_ICONS = [
  { id: "brain", Icon: Brain, color: "text-purple-400" },
  { id: "heart", Icon: Heart, color: "text-rose-400" },
  { id: "sparkles", Icon: Sparkles, color: "text-amber-400" },
  { id: "zap", Icon: Zap, color: "text-yellow-400" },
  { id: "sun", Icon: Sun, color: "text-orange-400" },
  { id: "compass", Icon: Compass, color: "text-cyan-400" },
  { id: "star", Icon: Star, color: "text-emerald-400" },
  { id: "eye", Icon: Eye, color: "text-blue-400" },
];

type CardItem = {
  instanceId: number;
  iconId: string;
  Icon: typeof Brain;
  color: string;
};

export function MemoryGame({ onComplete }: MemoryGameProps) {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const initGame = () => {
    const paired = [...CARD_ICONS, ...CARD_ICONS].map((item, idx) => ({
      instanceId: idx,
      iconId: item.id,
      Icon: item.Icon,
      color: item.color,
    }));
    // Shuffle
    const shuffled = paired.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setIsPlaying(true);
    setIsWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && !isWon) {
      timer = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isWon]);

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      if (cards[firstIdx].iconId === cards[secondIdx].iconId) {
        // Matched!
        const newMatched = [...matched, firstIdx, secondIdx];
        setMatched(newMatched);
        setFlipped([]);
        if (newMatched.length === cards.length) {
          setIsWon(true);
          setIsPlaying(false);
          onComplete?.();
        }
      } else {
        // Not matched - flip back
        setTimeout(() => {
          setFlipped([]);
        }, 900);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-lg mx-auto py-2">
      {/* Status Bar */}
      <div className="flex items-center justify-between w-full mb-6 px-2">
        <div className="flex items-center gap-4 text-xs">
          <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5">
            Moves: <span className="font-bold text-foreground">{moves}</span>
          </div>
          <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5">
            Matches: <span className="font-bold text-emerald-400">{matched.length / 2} / 8</span>
          </div>
          <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5">
            Time: <span className="font-bold text-foreground">{seconds}s</span>
          </div>
        </div>

        <button
          onClick={initGame}
          className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
          title="Restart Game"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-4 gap-3 w-full aspect-square max-w-100">
        {cards.map((card, idx) => {
          const isCardFlipped = flipped.includes(idx) || matched.includes(idx);
          const isCardMatched = matched.includes(idx);
          const Icon = card.Icon;

          return (
            <button
              key={card.instanceId}
              onClick={() => handleCardClick(idx)}
              disabled={isCardFlipped}
              className={`relative flex items-center justify-center rounded-2xl border text-xl font-bold transition-all duration-300 transform perspective-1000 ${
                isCardMatched
                  ? "border-emerald-500/40 bg-emerald-500/10 opacity-90 scale-95"
                  : isCardFlipped
                    ? "border-brand/40 bg-brand/10 shadow-lg shadow-brand/20 scale-100"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 hover:scale-105 active:scale-95"
              }`}
            >
              {isCardFlipped ? (
                <div className="animate-scale-in">
                  <Icon className={`h-8 w-8 ${card.color}`} />
                </div>
              ) : (
                <span className="text-white/20 text-xs font-mono select-none">✦</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Win Banner */}
      {isWon && (
        <div className="mt-6 flex flex-col items-center p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center animate-fade-in w-full">
          <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
            <Trophy className="h-5 w-5" />
          </div>
          <h4 className="text-lg font-bold text-foreground">Memory Match Complete!</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Solved in {moves} moves and {seconds} seconds. Excellent focus!
          </p>
          <GradientButton onClick={initGame} className="mt-4">
            Play Again
          </GradientButton>
        </div>
      )}
    </div>
  );
}
