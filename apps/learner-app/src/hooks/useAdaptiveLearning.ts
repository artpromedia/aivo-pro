import React from 'react';

type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface AdaptiveLearningState {
  streak: number;
  lastDifficulty: DifficultyLevel;
  accuracy: number;
}

interface AdaptiveLearningHook {
  state: AdaptiveLearningState;
  registerResult: (correct: boolean) => DifficultyLevel;
  reset: () => void;
}

const difficultyOrder: DifficultyLevel[] = ['easy', 'medium', 'hard'];

export const useAdaptiveLearning = (): AdaptiveLearningHook => {
  const [state, setState] = React.useState<AdaptiveLearningState>({
    streak: 0,
    lastDifficulty: 'easy',
    accuracy: 1,
  });
  const [history, setHistory] = React.useState<boolean[]>([]);

  const registerResult = React.useCallback((correct: boolean) => {
    let computedDifficulty: DifficultyLevel = state.lastDifficulty;

    setHistory((prev) => {
      const updated = [...prev, correct].slice(-10);
      const accuracy = updated.reduce((acc, value) => acc + (value ? 1 : 0), 0) / updated.length || 0;

      setState((prevState) => {
        const streak = correct ? prevState.streak + 1 : 0;
        const currentIndex = difficultyOrder.indexOf(prevState.lastDifficulty);
        computedDifficulty = prevState.lastDifficulty;

        if (streak >= 3 && currentIndex < difficultyOrder.length - 1) {
          computedDifficulty = difficultyOrder[currentIndex + 1];
        } else if (!correct && currentIndex > 0) {
          computedDifficulty = difficultyOrder[currentIndex - 1];
        }

        return {
          streak,
          lastDifficulty: computedDifficulty,
          accuracy,
        };
      });

      return updated;
    });

    return computedDifficulty;
  }, [state.lastDifficulty]);

  const reset = React.useCallback(() => {
    setHistory([]);
    setState({ streak: 0, lastDifficulty: 'easy', accuracy: 1 });
  }, []);

  return { state, registerResult, reset };
};
