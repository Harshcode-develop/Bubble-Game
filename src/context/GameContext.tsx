import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
} from "react";
import type {
  GameModeType,
  GameState,
  Difficulty,
  RoundResult,
} from "../types/game";
import { generateRoundBubbles } from "../utils/mathLogic";

interface GameContextType extends GameState {
  startGame: (mode: GameModeType, difficulty: Difficulty) => void;
  submitRound: (userSequence: string[]) => void;
  nextRound: () => void;
  resetGame: () => void;
  shuffleCurrentBubbles: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>({
    currentRound: 0,
    totalRounds: 30,
    score: 0,
    results: [],
    gameMode: "MAIN_30",
    difficulty: "Medium",
    bubbles: [],
    isPlaying: false,
    isFinished: false,
  });

  const startGame = useCallback(
    (mode: GameModeType, difficulty: Difficulty) => {
      let total = 30;
      if (mode === "PRACTICE_15") total = 15;
      if (mode === "PRACTICE_20") total = 20;

      setState({
        currentRound: 1,
        totalRounds: total,
        score: 0,
        results: [],
        gameMode: mode,
        difficulty,
        bubbles: generateRoundBubbles(difficulty),
        isPlaying: true,
        isFinished: false,
      });
    },
    []
  );

  const submitRound = useCallback((userSequence: string[]) => {
    setState((prev) => {
      // Calculate correctness
      const { bubbles } = prev;
      // Filter bubbles to match the sequence (handled by caller usually, but let's be safe)
      // Correct order is sorting bubbles by value
      const sortedBubbles = [...bubbles].sort((a, b) => a.value - b.value);
      const correctSequence = sortedBubbles.map((b) => b.id);

      const isCorrect =
        JSON.stringify(userSequence) === JSON.stringify(correctSequence);

      const newScore = isCorrect ? prev.score + 1 : prev.score;

      const roundResult: RoundResult = {
        roundNumber: prev.currentRound,
        isCorrect,
        userSequence,
        correctSequence,
        expressions: bubbles.reduce(
          (acc, b) => ({ ...acc, [b.id]: b.expression }),
          {}
        ),
        values: bubbles.reduce((acc, b) => ({ ...acc, [b.id]: b.value }), {}),
      };

      return {
        ...prev,
        score: newScore,
        results: [...prev.results, roundResult],
      };
    });
  }, []);

  const nextRound = useCallback(() => {
    setState((prev) => {
      if (prev.currentRound >= prev.totalRounds) {
        return { ...prev, isPlaying: false, isFinished: true };
      }
      return {
        ...prev,
        currentRound: prev.currentRound + 1,
        bubbles: generateRoundBubbles(prev.difficulty),
      };
    });
  }, []);

  const shuffleCurrentBubbles = useCallback(() => {
    setState((prev) => ({
      ...prev,
      // Actually, user said "shuffle at start... change expressions of all 30 rounds".
      // But also said "shuffle button to create new expressions in all rounds...".
      // And "refresh new expressions must appear".
      // This implies we re-generate the current round's bubbles.
      bubbles: generateRoundBubbles(prev.difficulty),
    }));
  }, []);

  const resetGame = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      isFinished: false,
      currentRound: 0,
      score: 0,
      results: [],
    }));
  }, []);

  return (
    <GameContext.Provider
      value={{
        ...state,
        startGame,
        submitRound,
        nextRound,
        resetGame,
        shuffleCurrentBubbles,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};
