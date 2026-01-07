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
        <div className="flex items-center justify-between w-full px-4 text-gray-600">
          <button
            onClick={resetGame}
            className="hover:text-black transition-colors flex items-center bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Main Menu
          </button>
          <div className="font-mono text-xl font-bold">
            ROUND {currentRound} / {totalRounds}
          </div>
          <div className="w-24" /> {/* Spacer to balance header */}
        </div>
      }
      footer={
        <div className="flex flex-col items-center space-y-4">
          <div className="text-gray-500 text-sm uppercase tracking-widest font-semibold">
            Select Lowest to Highest
          </div>
          {/* Shuffle Button */}
          {gameMode !== "MAIN_30" && (
            <button
              onClick={shuffleCurrentBubbles}
              className="flex items-center space-x-2 text-gray-500 hover:text-black transition-colors px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Shuffle/Refresh</span>
            </button>
          )}
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center h-full w-full space-y-12">
        {/* Timer */}
        <div className="mb-4">
          <Timer
            duration={15}
            onComplete={handleTimeout}
            isRunning={true}
            resetKey={timerKey}
          />
        </div>

        {/* Bubbles Grid */}
        <div className="relative w-full max-w-lg h-96 flex items-center justify-center bg-gray-50/50 rounded-3xl">
          {/* Positioning 3 bubbles in a triangle: Top center, Bottom Left, Bottom Right */}
          {bubbles.map((bubble, index) => {
            // Determine selection order (1, 2, 3)
            const orderIndex = selectedIds.indexOf(bubble.id);
            const selectionOrder = orderIndex === -1 ? 0 : orderIndex + 1;

            // Updated Layout: Top one higher up, others equally spaced below
            // Using Tailwind classes for responsive positioning
            const mobileClasses = [
              "top-[10%] left-1/2 -translate-x-1/2", // Top Center
              "bottom-[15%] left-[10%]", // Bottom Left
              "bottom-[15%] right-[10%]", // Bottom Right
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
