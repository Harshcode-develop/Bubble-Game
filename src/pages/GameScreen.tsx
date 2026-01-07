import React, { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import { GameLayout } from "../components/GameLayout";
import { Bubble } from "../components/Bubble";
import { Timer } from "../components/Timer";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export const GameScreen: React.FC = () => {
  const {
    currentRound,
    totalRounds,
    bubbles,
    submitRound,
    nextRound,
    resetGame,
    shuffleCurrentBubbles,
    gameMode,
  } = useGame();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [timerKey, setTimerKey] = useState(0);

  // Reset selection when round changes
  useEffect(() => {
    setSelectedIds([]);
    setTimerKey((prev) => prev + 1); // Reset timer
  }, [currentRound, bubbles]); // bubbles change means new round or shuffle

  // Auto-advance logic handled by Timer onComplete
  // Wrap in useCallback to prevent infinite effect triggers in Timer
  const handleTimeout = React.useCallback(() => {
    // Timeout means failure for this round if not already submitted?
    // User requirement: "after 15 secs timer is over it will automatically advanced to next round"
    submitRound(selectedIds);
    setTimeout(() => {
      nextRound();
    }, 500);
  }, [selectedIds, submitRound, nextRound]);

  const handleBubbleClick = React.useCallback(
    (id: string) => {
      if (selectedIds.includes(id)) {
        // Deselect if already selected
        setSelectedIds((prev) => prev.filter((bubbleId) => bubbleId !== id));
      } else {
        if (selectedIds.length < 3) {
          // Must use functional update based on current selection from state?
          // Actually selectedIds is in dependency.
          const newSelection = [...selectedIds, id];
          setSelectedIds(newSelection);
        }
      }
    },
    [selectedIds]
  );

  return (
    <GameLayout
      header={
        <div className="flex items-center justify-between w-full px-2 md:px-4 text-gray-600">
          <button
            onClick={resetGame}
            className="hover:text-black transition-colors flex items-center bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap"
          >
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 mr-1" />
            Main Menu
          </button>
          <div className="font-mono text-base md:text-xl font-bold whitespace-nowrap">
            ROUND {currentRound} / {totalRounds}
          </div>
          <div className="w-20 md:w-24" /> {/* Spacer to balance header */}
        </div>
      }
      footer={
        <div className="flex flex-col items-center space-y-2 md:space-y-4 pb-4">
          <div className="text-gray-500 text-[10px] md:text-sm uppercase tracking-widest font-semibold">
            Select Lowest to Highest
          </div>
          {/* Shuffle Button */}
          {gameMode !== "MAIN_30" && (
            <button
              onClick={shuffleCurrentBubbles}
              className="flex items-center space-x-2 text-gray-500 hover:text-black transition-colors px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 rounded-full hover:bg-gray-100 text-xs md:text-base"
            >
              <RefreshCw className="w-3 h-3 md:w-4 md:h-4" />
              <span>Shuffle</span>
            </button>
          )}
        </div>
      }
    >
      <div className="flex flex-col items-center justify-start pt-8 md:pt-0 md:justify-center h-full w-full space-y-6 md:space-y-12">
        {/* Timer */}
        <div className="mb-2 md:mb-4">
          <Timer
            duration={15}
            onComplete={handleTimeout}
            isRunning={true}
            resetKey={timerKey}
          />
        </div>

        {/* Bubbles Grid */}
        <div className="relative w-full max-w-lg h-72 md:h-96 flex items-center justify-center bg-gray-50/50 rounded-3xl">
          {/* Positioning 3 bubbles in a triangle: Top center, Bottom Left, Bottom Right */}
          {bubbles.map((bubble, index) => {
            // Determine selection order (1, 2, 3)
            const orderIndex = selectedIds.indexOf(bubble.id);
            const selectionOrder = orderIndex === -1 ? 0 : orderIndex + 1;

            // Updated Layout: Top one higher up, others equally spaced below
            // Using Tailwind classes for responsive positioning
            const mobileClasses = [
              "top-[5%] left-1/2 -translate-x-1/2", // Top Center - moved up to 5%
              "bottom-[10%] left-[10%]", // Bottom Left
              "bottom-[10%] right-[10%]", // Bottom Right
            ];

            return (
              <motion.div
                key={bubble.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`absolute ${mobileClasses[index]}`}
              >
                <Bubble
                  data={bubble}
                  selectionOrder={selectionOrder}
                  onClick={handleBubbleClick}
                  disabled={
                    selectedIds.length >= 3 && !selectedIds.includes(bubble.id)
                  }
                  // We disable clicking unselected bubbles if 3 are already selected.
                  // But user can click selected ones to deselect.
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </GameLayout>
  );
};
