import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TimerProps {
  duration: number; // in seconds
  onComplete: () => void;
  isRunning: boolean;
  resetKey: number; // Increment to reset timer
}

export const Timer: React.FC<TimerProps> = ({
  duration,
  onComplete,
  isRunning,
  resetKey,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, resetKey]);

  useEffect(() => {
    if (!isRunning) return;

    // If already at 0, don't set interval, just ensure we handled completion if needed (handled by effect below)
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]); // Removed onComplete from dependency to avoid loop if it changes

  // Separate effect to trigger completion only when hitting 0 exactly
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      onComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isRunning]); // Only trigger when timeLeft hits 0. Ignore onComplete changes.

  // Calculate generic progress for circle if we wanted, but simple text is fine too.
  // Let's do a simple SVG circle countdown similar to the image (icon w/ number).

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / duration;
  const dashoffset = circumference * (1 - progress);

  return (
    <div className="relative flex items-center justify-center w-16 h-16">
      {/* Background Circle */}
      <svg className="absolute w-full h-full transform -rotate-90">
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="#e5e7eb" // gray-200
          strokeWidth="4"
          fill="transparent"
        />
        {/* Progress Circle */}
        <motion.circle
          cx="32"
          cy="32"
          r={radius}
          stroke="#000000" // Black for light mode visibility
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: dashoffset }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </svg>
      <span className="text-xl font-bold text-black">{timeLeft}</span>
    </div>
  );
};
