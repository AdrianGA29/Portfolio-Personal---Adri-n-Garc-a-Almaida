import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { MatrixText } from "./MatrixText";
import HeroVisual from "./HeroVisual";

const TITLE_WORDS = "ADRIÁN GARCÍA ALMAIDA".split(" ");
const FALLBACK_GRADIENT = {
  background:
    "radial-gradient(circle at 50% 45%, rgba(57,255,20,0.14) 0%, rgba(0,238,252,0.08) 24%, rgba(0,0,0,0) 58%)",
};

export default function Hero() {
  const [visibleWords, setVisibleWords] = useState(0);
  const delays = useMemo(
    () => TITLE_WORDS.map(() => Math.random() * 0.07),
    [],
  );

  useEffect(() => {
    if (visibleWords < TITLE_WORDS.length) {
      const timeout = window.setTimeout(() => setVisibleWords((current) => current + 1), 200);
      return () => window.clearTimeout(timeout);
    }
  }, [visibleWords]);

  return (
    <section id="home" className="relative h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="group relative mb-10 inline-flex items-center gap-3 rounded-full border border-white/10 bg-neutral-950/40 px-4 py-2 shadow-2xl backdrop-blur-md transition-all hover:border-primary/30 hover:bg-neutral-900/60"
        >
          <div className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_#39FF14]" />
          </div>
          <span className="font-label text-[10px] font-bold uppercase tracking-[0.25em] text-white/80">
            Disponible para proyectos
          </span>
          <div className="absolute inset-0 -z-10 rounded-full bg-primary/10 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-8 flex flex-col items-center text-center font-headline text-5xl font-black uppercase leading-[0.85] tracking-tighter md:text-8xl lg:text-9xl"
        >
          <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-8">
            {TITLE_WORDS.slice(0, 2).map((word, index) => (
              <div
                key={index}
                className={`${index < visibleWords ? "fade-in" : ""} text-white`}
                style={{
                  animationDelay: `${index * 0.1 + (delays[index] || 0)}s`,
                  opacity: index < visibleWords ? 1 : 0,
                }}
              >
                {word}
              </div>
            ))}
          </div>
          {TITLE_WORDS[2] && (
            <div
              className={`${2 < visibleWords ? "fade-in" : ""} bg-gradient-to-r from-primary via-secondary to-primary-dim bg-clip-text text-transparent`}
              style={{
                animationDelay: `${2 * 0.1 + (delays[2] || 0)}s`,
                opacity: 2 < visibleWords ? 1 : 0,
              }}
            >
              {TITLE_WORDS[2]}
            </div>
          )}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-6 flex min-h-[2rem] items-center justify-center"
        >
          <MatrixText
            text="Técnico Informático & Trainee Developer"
            initialDelay={500}
            letterInterval={80}
            letterAnimationDuration={400}
          />
        </motion.div>
      </div>

      <div className="scroll-indicator pointer-events-none z-20">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={FALLBACK_GRADIENT} />
        <HeroVisual />
      </div>
    </section>
  );
}
