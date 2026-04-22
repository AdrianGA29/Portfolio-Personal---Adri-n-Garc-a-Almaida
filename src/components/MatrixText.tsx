"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

interface LetterState {
  char: string;
  isMatrix: boolean;
  isSpace: boolean;
}

interface MatrixTextProps {
  text?: string;
  className?: string;
  initialDelay?: number;
  letterAnimationDuration?: number;
  letterInterval?: number;
  readDelay?: number;
  isActive?: boolean;
  loop?: boolean;
}

const createLetters = (text: string): LetterState[] =>
  text.split("").map((char) => ({
    char,
    isMatrix: false,
    isSpace: char === " ",
  }));

export const MatrixText = ({
  text = "HelloWorld!",
  className,
  initialDelay = 200,
  letterAnimationDuration = 400,
  letterInterval = 80,
  readDelay = 3000,
  isActive = true,
  loop = true,
}: MatrixTextProps) => {
  const [letters, setLetters] = useState<LetterState[]>(() => createLetters(text));
  
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const getRandomChar = useCallback(
    () => (Math.random() > 0.5 ? "1" : "0"),
    []
  );

  const animateLetter = useCallback(
    (index: number) => {
      if (index >= text.length) return;

      setLetters((prev) => {
        const newLetters = [...prev];
        if (!newLetters[index].isSpace) {
          newLetters[index] = {
            ...newLetters[index],
            char: getRandomChar(),
            isMatrix: true,
          };
        }
        return newLetters;
      });

      const resolveTimeout = setTimeout(() => {
        setLetters((prev) => {
          const newLetters = [...prev];
          newLetters[index] = {
            ...newLetters[index],
            char: text[index],
            isMatrix: false,
          };
          return newLetters;
        });
      }, letterAnimationDuration);
      
      timeoutsRef.current.push(resolveTimeout);
    },
    [getRandomChar, text, letterAnimationDuration]
  );

  const startAnimation = useCallback(() => {
    if (!isActive) {
      setLetters(createLetters(text));
      return;
    }

    clearAllTimeouts();
    
    setLetters(createLetters(text));

    let currentIndex = 0;

    const animate = () => {
      if (currentIndex >= text.length) {
        if (loop) {
          const restartTimeout = setTimeout(startAnimation, readDelay);
          timeoutsRef.current.push(restartTimeout);
        }
        return;
      }

      animateLetter(currentIndex);
      currentIndex++;
      const nextTimeout = setTimeout(animate, letterInterval);
      timeoutsRef.current.push(nextTimeout);
    };

    animate();
  }, [animateLetter, text, letterInterval, readDelay, clearAllTimeouts, isActive, loop]);

  useEffect(() => {
    if (!isActive) {
      clearAllTimeouts();
      setLetters(createLetters(text));
      return;
    }

    const initialTimer = setTimeout(startAnimation, initialDelay);
    timeoutsRef.current.push(initialTimer);
    return () => clearAllTimeouts();
  }, [startAnimation, initialDelay, clearAllTimeouts, isActive, text]);

  const motionVariants = useMemo(
    () => ({
      matrix: {
        color: "#39FF14",
        textShadow: "0 0 8px rgba(57, 255, 20, 0.8)",
      },
      normal: {
        color: "#ffffff",
        textShadow: "0 2px 10px rgba(0,0,0,0.9), 0 0 5px rgba(0,0,0,0.5)",
      }
    }),
    []
  );

  return (
    <div
      className={cn(
        "flex items-center justify-center text-white",
        className
      )}
      aria-label={text}
    >
      <div className="flex flex-wrap items-center justify-center">
        {letters.map((letter, index) => (
          <motion.div
            key={`${index}-${letter.isMatrix}`}
            className="font-mono text-lg md:text-2xl lg:text-3xl w-[1ch] text-center overflow-hidden"
            initial="normal"
            animate={letter.isMatrix ? "matrix" : "normal"}
            variants={motionVariants}
            transition={{
              duration: 0.1,
              ease: "easeInOut",
            }}
            style={{
              display: "inline-block",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {letter.isSpace ? "\u00A0" : letter.char}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
