export type Difficulty = 'Medium' | 'Hard';

export type GameModeType = 'MAIN_30' | 'PRACTICE_15' | 'PRACTICE_20';

export interface BubbleData {
  id: string;
  expression: string;
  value: number;
}

export interface RoundResult {
  roundNumber: number;
  isCorrect: boolean;
  userSequence: string[]; // IDs of bubbles in order clicked
  correctSequence: string[]; // IDs of bubbles in correct order
  expressions: { [id: string]: string }; // Map ID to expression for display
  values: { [id: string]: number }; // Map ID to value for verification
}

export interface GameState {
  currentRound: number;
  totalRounds: number;
  score: number;
  results: RoundResult[];
  gameMode: GameModeType;
  difficulty: Difficulty;
  bubbles: BubbleData[];
  isPlaying: boolean;
  isFinished: boolean;
}
