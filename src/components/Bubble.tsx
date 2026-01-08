import React from "react";
import { motion } from "framer-motion";
import type { BubbleData } from "../types/game";

interface BubbleProps {
  data: BubbleData;
  selectionOrder: number; // 0 = unselected, 1 = first, 2 = second, 3 = third
  onClick: (id: string) => void;
  disabled?: boolean;
}

export const Bubble = React.memo(
  ({ data, selectionOrder, onClick, disabled }: BubbleProps) => {
    // Determine scale based on selection order
    // Order 1 -> Default size (scale 1)
    // Order 2 -> Little big (scale 1.15)
    // Order 3 -> Biggest (scale 1.3)
    // Unselected -> scale 1

    let scale = 1;
    const isSelected = selectionOrder > 0;

    if (selectionOrder === 2) scale = 1.15;
    if (selectionOrder === 3) scale = 1.3;

    return (
      <motion.div
        layout
        whileHover={{ scale: disabled || isSelected ? scale : 1.05 }}
        whileTap={{ scale: disabled ? scale : 0.95 }}
        animate={{
          scale: scale,
          backgroundColor: isSelected ? "#4b5563" : "#d1d5db", // gray-600 (selected) vs gray-300 (default)
          borderColor: isSelected ? "#000" : "transparent",
          color: isSelected ? "white" : "black",
        }}
        className={`
        relative flex items-center justify-center
        w-28 h-28 md:w-36 md:h-36 rounded-full
        cursor-pointer select-none
        border-4 shadow-xl
        transition-colors duration-300
        ${isSelected ? "z-20" : "z-10"}
      `}
        onClick={() => !disabled && onClick(data.id)}
      >
        <span className="text-xl md:text-2xl font-bold tracking-wider">
          {data.expression}
        </span>
      </motion.div>
    );
  }
);

Bubble.displayName = "Bubble";
