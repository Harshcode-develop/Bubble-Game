import React from "react";
import { useGame } from "../context/GameContext";
import { GameLayout } from "../components/GameLayout";
import { motion } from "framer-motion";
import { Trophy, BookOpen, RefreshCw } from "lucide-react";

export const MainMenu: React.FC = () => {
  const { startGame } = useGame();

  return (
    <GameLayout>
      <div className="flex flex-col items-center justify-center space-y-8 md:space-y-12 text-center z-10 w-full px-4">
        <motion.div
          layout
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-600 mb-2 md:mb-4">
            Math Bubble
          </h1>
          <p className="text-gray-600 text-base md:text-xl max-w-md mx-auto">
            Order the expressions from lowest to highest before time runs out.
          </p>
        </motion.div>

        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col items-center space-y-4 md:space-y-6 w-full max-w-sm"
        >
          {/* Main Game Button - Keeping Black as requested */}
          <button
            onClick={() => startGame("MAIN_30", "Hard")}
            className="group relative w-full px-6 py-4 md:px-8 md:py-5 bg-black text-white border border-gray-900 rounded-2xl shadow-xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center overflow-hidden"
          >
            <Trophy className="mr-3 w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
            <span className="text-lg md:text-xl font-bold tracking-wider">
              START GAME
            </span>
            <span className="ml-2 text-[10px] md:text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">
              30 Rounds
            </span>
          </button>

          {/* Shuffle Button (Visual mainly as game always generates new questions, but user requested explicit button) */}
          <button
            onClick={() => {
              // Visual feedback - maybe just rotate icon?
              // Since startGame always creates fresh random bubbles, this is effectivly a "Generate new seed" (conceptually).
              // We can't really "shuffle" the unstarted game state easily without refactoring Global State to hold "Pre-Game Bubbles".
              // But for user experience, clicking this and then Start Game will feel like they got new questions.
              const btn = document.getElementById("shuffle-btn-icon");
              if (btn) {
                btn.style.transform = "rotate(180deg)";
                setTimeout(() => (btn.style.transform = "rotate(0deg)"), 500);
              }
            }}
            className="w-full py-2 md:py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 flex items-center justify-center text-gray-600 font-medium transition-colors text-sm md:text-base"
          >
            <RefreshCw
              id="shuffle-btn-icon"
              className="w-4 h-4 mr-2 transition-transform duration-500"
            />
            Shuffle All Expressions
          </button>

          {/* Practice Section */}
          <div className="w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 md:p-6 shadow-lg">
            <h3 className="text-gray-600 font-semibold mb-3 md:mb-4 flex items-center justify-center text-sm md:text-base">
              <BookOpen className="w-4 h-4 mr-2" />
              PRACTICE MODE
            </h3>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <button
                onClick={() => startGame("PRACTICE_15", "Medium")}
                className="px-3 py-2 md:px-4 md:py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors border border-gray-200 hover:border-gray-300 text-black"
              >
                <div className="text-base md:text-lg font-bold">Round 1</div>
                <div className="text-xs text-gray-500">15 Rounds</div>
              </button>
              <button
                onClick={() => startGame("PRACTICE_20", "Hard")}
                className="px-3 py-2 md:px-4 md:py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors border border-gray-200 hover:border-gray-300 text-black"
              >
                <div className="text-base md:text-lg font-bold">Round 2</div>
                <div className="text-xs text-gray-500">20 Rounds</div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Helper Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-500 text-sm"
        >
          Select bubbles in Ascending Order (Smallest to Largest)
        </motion.div>
      </div>
    </GameLayout>
  );
};
