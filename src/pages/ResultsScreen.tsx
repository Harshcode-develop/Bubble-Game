import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import { GameLayout } from "../components/GameLayout";
import { Check, X, RefreshCw, Home } from "lucide-react";
import { motion } from "framer-motion";

export const ResultsScreen: React.FC = () => {
  const {
    results,
    score,
    totalRounds,
    resetGame,
    startGame,
    gameMode,
    difficulty,
  } = useGame();

  // Show "Pass" or "Fail" based on criteria
  // Main: 25/30
  // Practice 15: 12/15
  // Practice 20: 15/20

  let passThreshold = 0;
  if (totalRounds === 30) passThreshold = 25;
  if (totalRounds === 15) passThreshold = 12;
  if (totalRounds === 20) passThreshold = 15;

  const passed = score >= passThreshold;

  const [showDetails, setShowDetails] = useState(false);

  return (
    <GameLayout layoutMode="responsive">
      <div className="flex flex-col items-center w-full max-w-2xl h-full space-y-4 md:space-y-8 py-2 md:py-8">
        <motion.div
          layout
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-1 md:space-y-4 shrink-0"
        >
          <div className="text-4xl md:text-6xl mb-1">
            {passed ? "🏆" : "❌"}
          </div>
          <h2 className="text-2xl md:text-5xl font-extrabold text-black leading-tight">
            {passed ? "Assessment Passed!" : "Failed"}
          </h2>
          <div className="text-base md:text-xl text-gray-600">
            You cleared{" "}
            <span className="text-black font-bold">
              {score}/{totalRounds}
            </span>{" "}
            rounds.
          </div>
        </motion.div>

        <div className="flex space-x-3 w-full justify-center shrink-0">
          <button
            onClick={resetGame}
            className="flex items-center px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 transition text-black text-sm md:text-base"
          >
            <Home className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Main Menu
          </button>
          <button
            onClick={() => {
              resetGame();
              setTimeout(() => startGame(gameMode, difficulty), 100);
            }}
            className="flex items-center px-4 py-3 bg-blue-600 rounded-xl hover:bg-blue-500 transition shadow-lg shadow-blue-900/20 text-white text-sm md:text-base font-semibold"
          >
            <RefreshCw className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Play Again
          </button>
        </div>

        <div className="flex-1 w-full bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-4 md:p-6 shadow-lg flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h3 className="text-lg md:text-xl font-bold text-gray-700">
              Round History
            </h3>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-blue-600 hover:text-blue-500 underline"
            >
              {showDetails ? "Hide Details" : "View Wrong Answers"}
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {results.map((res) => (
              <div
                key={res.roundNumber}
                className={`flex flex-col p-3 rounded-lg border ${
                  res.isCorrect
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-mono text-sm md:text-base">
                    Round {res.roundNumber}
                  </span>
                  {res.isCorrect ? (
                    <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                  )}
                </div>

                {/* Detailed View for Wrong Answers */}
                {!res.isCorrect && showDetails && (
                  <div className="mt-2 pt-2 border-t border-gray-200 text-xs md:text-sm">
                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                      <div>
                        <div className="text-gray-500 mb-1">Your Order:</div>
                        <div className="flex flex-col space-y-1">
                          {res.userSequence.map((id, idx) => (
                            <span key={`u-${idx}`} className="text-red-400">
                              {res.expressions[id]}
                            </span>
                          ))}
                          {res.userSequence.length === 0 && (
                            <span className="text-gray-600">No selection</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Correct Order:</div>
                        <div className="flex flex-col space-y-1">
                          {res.correctSequence.map((id, idx) => (
                            <span key={`c-${idx}`} className="text-green-400">
                              {res.expressions[id]} (
                              {Number(res.values[id].toFixed(3))})
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </GameLayout>
  );
};
