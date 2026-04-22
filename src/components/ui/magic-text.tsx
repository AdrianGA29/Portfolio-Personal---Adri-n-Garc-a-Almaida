import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  wordClassName?: string;
  ghostClassName?: string;
  wordWrapperClassName?: string;
}

export interface MagicTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  ghostClassName?: string;
  wordWrapperClassName?: string;
}

function Word({
  children,
  progress,
  range,
  wordClassName,
  ghostClassName,
  wordWrapperClassName,
}: WordProps) {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span
      className={`relative inline-flex ${wordWrapperClassName ?? "mr-[0.34em] mt-[0.18em]"}`}
    >
      <span className={`absolute inset-0 opacity-15 ${ghostClassName ?? ""}`}>{children}</span>
      <motion.span style={{ opacity }} className="relative">
        {children}
      </motion.span>
    </span>
  );
}

export function MagicText({
  text,
  className,
  wordClassName,
  ghostClassName,
  wordWrapperClassName,
}: MagicTextProps) {
  const containerRef = useRef<HTMLParagraphElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.25"],
  });

  const words = text.split(" ");

  return (
    <p ref={containerRef} className={className}>
      {words.map((word, index) => {
        const start = index / words.length;
        const end = start + 1 / words.length;

        return (
          <Word
            key={`${word}-${index}`}
            progress={scrollYProgress}
            range={[start, end]}
            wordClassName={wordClassName}
            ghostClassName={ghostClassName}
            wordWrapperClassName={wordWrapperClassName}
          >
            {word}
          </Word>
        );
      })}
    </p>
  );
}
