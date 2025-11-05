import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Clock, Trophy, Star, Zap, Target, Brain, 
  RefreshCw, CheckCircle, XCircle, Gamepad2 
} from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';
import confetti from 'canvas-confetti';

interface GameBreakProps {
  onGameComplete: () => void;
  onBackToLearning: () => void;
  duration?: number; // in minutes
  childAge: number;
}

interface GameScore {
  correct: number;
  total: number;
  timeBonus: number;
  finalScore: number;
}

// Memory Card Game Component
const MemoryGame: React.FC<{
  onComplete: (score: GameScore) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}> = ({ onComplete, difficulty }) => {
  const cardCounts = { easy: 8, medium: 12, hard: 16 };
  const cardCount = cardCounts[difficulty];
  
  const [cards, setCards] = useState<Array<{ id: number; emoji: string; isFlipped: boolean; isMatched: boolean }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [startTime] = useState(Date.now());

  const emojis = ['🎈', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺', '🚀', '🌟', '🦄', '🐱', '🐶', '🦋', '🌈', '⚡'];

  useEffect(() => {
    const gameEmojis = emojis.slice(0, cardCount / 2);
    const gameCards = [...gameEmojis, ...gameEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(gameCards);
  }, [cardCount]);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return;
    if (cards[cardId].isFlipped || cards[cardId].isMatched) return;

    const newCards = [...cards];
    newCards[cardId].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      setTimeout(() => {
        const [first, second] = newFlippedCards;
        if (cards[first].emoji === cards[second].emoji) {
          // Match found
          const updatedCards = [...newCards];
          updatedCards[first].isMatched = true;
          updatedCards[second].isMatched = true;
          setCards(updatedCards);
          setMatches(matches + 1);
          
          if (matches + 1 === cardCount / 2) {
            // Game complete
            const timeSpent = (Date.now() - startTime) / 1000;
            const timeBonus = Math.max(0, 100 - timeSpent);
            const accuracy = (matches + 1) / moves;
            const finalScore = Math.round(accuracy * 100 + timeBonus);
            
            confetti();
            onComplete({
              correct: matches + 1,
              total: cardCount / 2,
              timeBonus: Math.round(timeBonus),
              finalScore,
            });
          }
        } else {
          // No match
          const updatedCards = [...newCards];
          updatedCards[first].isFlipped = false;
          updatedCards[second].isFlipped = false;
          setCards(updatedCards);
        }
        setFlippedCards([]);
      }, 1000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Matches: {matches}/{cardCount / 2}
        </div>
        <div className="text-sm text-gray-600">
          Moves: {moves}
        </div>
      </div>
      
      <div className={`grid gap-3 ${cardCount === 8 ? 'grid-cols-4' : cardCount === 12 ? 'grid-cols-4' : 'grid-cols-4'}`}>
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className={`aspect-square rounded-xl cursor-pointer relative ${
              card.isMatched 
                ? 'bg-green-100 border-2 border-green-300' 
                : 'bg-gradient-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500'
            }`}
            onClick={() => handleCardClick(card.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              rotateY: card.isFlipped || card.isMatched ? 180 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 rounded-xl backface-hidden flex items-center justify-center">
              {card.isFlipped || card.isMatched ? (
                <span className="text-2xl">{card.emoji}</span>
              ) : (
                <div className="w-8 h-8 bg-white/30 rounded-lg" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Reaction Time Game Component
const ReactionGame: React.FC<{
  onComplete: (score: GameScore) => void;
}> = ({ onComplete }) => {
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'go' | 'clicked' | 'complete'>('waiting');
  const [startTime, setStartTime] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const totalRounds = 5;

  const startRound = () => {
    setGameState('ready');
    const delay = Math.random() * 3000 + 1000; // 1-4 seconds
    setTimeout(() => {
      setGameState('go');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'go') {
      const reactionTime = Date.now() - startTime;
      setReactionTimes([...reactionTimes, reactionTime]);
      setGameState('clicked');
      
      setTimeout(() => {
        if (currentRound + 1 < totalRounds) {
          setCurrentRound(currentRound + 1);
          setGameState('waiting');
        } else {
          // Game complete
          const avgReaction = [...reactionTimes, reactionTime].reduce((a, b) => a + b) / totalRounds;
          const score = Math.max(0, 100 - (avgReaction - 200) / 10); // Score based on reaction time
          
          confetti();
          onComplete({
            correct: totalRounds,
            total: totalRounds,
            timeBonus: Math.round(Math.max(0, 500 - avgReaction) / 5),
            finalScore: Math.round(score),
          });
        }
      }, 1500);
    } else if (gameState === 'ready') {
      setGameState('waiting');
      // Too early - penalty
    }
  };

  useEffect(() => {
    if (gameState === 'waiting' && currentRound === 0) {
      startRound();
    }
  }, [gameState, currentRound]);

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'ready': return 'bg-red-500';
      case 'go': return 'bg-green-500';
      case 'clicked': return 'bg-blue-500';
      default: return 'bg-gray-300';
    }
  };

  const getMessage = () => {
    switch (gameState) {
      case 'waiting': return 'Get ready...';
      case 'ready': return 'Wait for green...';
      case 'go': return 'CLICK NOW!';
      case 'clicked': return `${Date.now() - startTime}ms - Great!`;
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-sm text-gray-600 mb-2">
          Round {currentRound + 1} of {totalRounds}
        </div>
        {reactionTimes.length > 0 && (
          <div className="text-xs text-gray-500">
            Avg: {Math.round(reactionTimes.reduce((a, b) => a + b) / reactionTimes.length)}ms
          </div>
        )}
      </div>

      <motion.div
        className={`h-64 rounded-2xl cursor-pointer flex items-center justify-center ${getBackgroundColor()}`}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={{
          scale: gameState === 'go' ? [1, 1.05, 1] : 1,
        }}
        transition={{
          scale: {
            duration: 0.5,
            repeat: gameState === 'go' ? Infinity : 0,
          }
        }}
      >
        <div className="text-center text-white">
          <div className="text-2xl font-bold mb-2">{getMessage()}</div>
          {gameState === 'waiting' && currentRound > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                startRound();
              }}
              className="px-4 py-2 bg-white/20 rounded-lg text-sm"
            >
              Next Round
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Color Pattern Game Component
const PatternGame: React.FC<{
  onComplete: (score: GameScore) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}> = ({ onComplete, difficulty }) => {
  const sequenceLengths = { easy: 4, medium: 6, hard: 8 };
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gamePhase, setGamePhase] = useState<'start' | 'show' | 'input' | 'complete'>('start');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const generateSequence = useCallback(() => {
    const newSequence = Array.from({ length: sequenceLengths[difficulty] }, () =>
      colors[Math.floor(Math.random() * colors.length)]
    );
    setSequence(newSequence);
  }, [difficulty]);

  const showSequence = useCallback(() => {
    setGamePhase('show');
    setShowingSequence(true);
    setCurrentIndex(0);
    
    const showNext = (index: number) => {
      if (index < sequence.length) {
        setCurrentIndex(index);
        setTimeout(() => {
          setCurrentIndex(-1);
          setTimeout(() => showNext(index + 1), 300);
        }, 600);
      } else {
        setShowingSequence(false);
        setGamePhase('input');
      }
    };
    
    setTimeout(() => showNext(0), 500);
  }, [sequence]);

  const handleColorClick = (color: string) => {
    if (gamePhase !== 'input') return;
    
    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);
    
    if (newPlayerSequence.length === sequence.length) {
      // Check if correct
      const isCorrect = newPlayerSequence.every((color, index) => color === sequence[index]);
      
      if (isCorrect) {
        setScore(score + 10);
        confetti();
        
        setTimeout(() => {
          onComplete({
            correct: 1,
            total: 1,
            timeBonus: 20,
            finalScore: score + 30,
          });
        }, 1000);
      } else {
        // Wrong sequence
        setTimeout(() => {
          onComplete({
            correct: 0,
            total: 1,
            timeBonus: 0,
            finalScore: score,
          });
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (gamePhase === 'start') {
      generateSequence();
    }
  }, [gamePhase, generateSequence]);

  useEffect(() => {
    if (sequence.length > 0 && gamePhase === 'start') {
      showSequence();
    }
  }, [sequence, gamePhase, showSequence]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-lg font-semibold text-gray-800 mb-2">
          {gamePhase === 'show' && 'Watch the sequence!'}
          {gamePhase === 'input' && 'Repeat the pattern!'}
          {gamePhase === 'start' && 'Get ready...'}
        </div>
        <div className="text-sm text-gray-600">
          Score: {score} | Round: {round}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {colors.slice(0, 6).map((color, index) => (
          <motion.button
            key={color}
            className={`aspect-square rounded-2xl transition-all duration-200 ${
              currentIndex === sequence.indexOf(color) && showingSequence
                ? 'scale-110 brightness-150 shadow-lg'
                : 'hover:scale-105'
            }`}
            style={{
              backgroundColor: color,
              opacity: gamePhase === 'input' ? 1 : 0.7,
            }}
            onClick={() => handleColorClick(color)}
            disabled={gamePhase !== 'input'}
            whileHover={gamePhase === 'input' ? { scale: 1.05 } : {}}
            whileTap={gamePhase === 'input' ? { scale: 0.95 } : {}}
          />
        ))}
      </div>

      {playerSequence.length > 0 && (
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">Your sequence:</div>
          <div className="flex justify-center gap-2">
            {playerSequence.map((color, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const GameBreak: React.FC<GameBreakProps> = ({
  onGameComplete,
  onBackToLearning,
  duration = 3,
  childAge,
}) => {
  const { theme } = useTheme();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [gameScore, setGameScore] = useState<GameScore | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const games = [
    {
      id: 'memory',
      name: 'Memory Match',
      icon: Brain,
      description: 'Match pairs of cards to boost your memory!',
      difficulty: childAge < 8 ? 'easy' : childAge < 12 ? 'medium' : 'hard',
      color: 'from-purple-400 to-pink-400',
    },
    {
      id: 'reaction',
      name: 'Quick Click',
      icon: Zap,
      description: 'Test your reaction time and focus!',
      difficulty: 'medium',
      color: 'from-green-400 to-blue-400',
    },
    {
      id: 'pattern',
      name: 'Color Pattern',
      icon: Target,
      description: 'Remember and repeat the color sequence!',
      difficulty: childAge < 8 ? 'easy' : childAge < 12 ? 'medium' : 'hard',
      color: 'from-orange-400 to-red-400',
    },
  ];

  // Timer countdown
  useEffect(() => {
    if (selectedGame && !isComplete) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleGameComplete({ correct: 0, total: 1, timeBonus: 0, finalScore: 0 });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [selectedGame, isComplete]);

  const handleGameComplete = (score: GameScore) => {
    setGameScore(score);
    setIsComplete(true);
    
    // Auto-return to learning after showing results
    setTimeout(() => {
      onGameComplete();
      onBackToLearning();
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isComplete && gameScore) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-4">
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Great Job!</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Score:</span>
              <span className="font-bold text-2xl text-green-600">{gameScore.finalScore}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Accuracy:</span>
              <span className="font-semibold">{gameScore.correct}/{gameScore.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Time Bonus:</span>
              <span className="font-semibold">+{gameScore.timeBonus}</span>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Your brain is refreshed and ready to learn! Returning to your lessons...
          </p>

          <div className="flex gap-3 justify-center">
            <motion.button
              onClick={onBackToLearning}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Learning
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (selectedGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <motion.button
              onClick={() => setSelectedGame(null)}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-xl text-gray-700 hover:bg-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-xl">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-blue-600">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {/* Game Content */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {games.find(g => g.id === selectedGame)?.name}
              </h2>
              <p className="text-gray-600">
                {games.find(g => g.id === selectedGame)?.description}
              </p>
            </div>

            {selectedGame === 'memory' && (
              <MemoryGame
                onComplete={handleGameComplete}
                difficulty={games.find(g => g.id === selectedGame)?.difficulty as 'easy' | 'medium' | 'hard'}
              />
            )}
            {selectedGame === 'reaction' && (
              <ReactionGame onComplete={handleGameComplete} />
            )}
            {selectedGame === 'pattern' && (
              <PatternGame
                onComplete={handleGameComplete}
                difficulty={games.find(g => g.id === selectedGame)?.difficulty as 'easy' | 'medium' | 'hard'}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Brain Break Time!</h1>
          <p className="text-gray-600 mb-4">
            Choose a fun game to refresh your mind and boost your focus!
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{duration} minute break</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {games.map((game) => {
            const IconComponent = game.icon;
            return (
              <motion.button
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                className={`p-6 rounded-2xl bg-gradient-to-br ${game.color} text-white text-center hover:shadow-lg transition-all duration-200`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconComponent className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">{game.name}</h3>
                <p className="text-sm opacity-90">{game.description}</p>
              </motion.button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <motion.button
            onClick={onBackToLearning}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Skip Break & Continue Learning
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};