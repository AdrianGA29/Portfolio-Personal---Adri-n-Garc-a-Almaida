import { AnimatePresence, motion } from "motion/react";
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";

const ShaderAnimation = lazy(async () => {
  const module = await import("./ui/shader-lines");
  return { default: module.ShaderAnimation };
});

interface IntroAnimationProps {
  onComplete: () => void;
}

type IntroPhase = "powerOn" | "booting" | "loading" | "welcome" | "ready" | "zoom" | "complete";

const ELECTRIC_GREEN = "#00ff88";
const ELECTRIC_BLUE = "#00d4ff";

function MinimalLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dimensions = {
    sm: { width: 24, height: 24 },
    md: { width: 44, height: 44 },
    lg: { width: 56, height: 56 },
  };

  const { width, height } = dimensions[size];

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width, height }}
      animate={{
        filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"],
      }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="introLogoGradient" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor={ELECTRIC_GREEN} />
            <stop offset="100%" stopColor={ELECTRIC_BLUE} />
          </linearGradient>
        </defs>
        <path d="M50 15 L18 85 L30 85 L50 40 L70 85 L82 85 Z" fill="url(#introLogoGradient)" />
      </svg>
    </motion.div>
  );
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [phase, setPhase] = useState<IntroPhase>("powerOn");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [screenOn, setScreenOn] = useState(false);
  const [bootMessages, setBootMessages] = useState<string[]>([]);

  const allBootMessages = useMemo(
    () => [
      "[  0.000000] Initializing Adrian O.S. Kernel v1.0...",
      "[  0.124512] CPU: 16 Cores detected, optimizing threads...",
      "[  0.452183] MEM: 64GB Virtual RAM initialized.",
      "[  0.892110] NET: Establishing secure connection...",
      "[  1.231092] DRV: Loading high-performance GPU drivers...",
      "[  1.562183] FS: Mounting encrypted user data partition...",
      "[  1.892110] SYS: Starting core services and UI engine...",
      "[  2.124512] OK: System integrity check passed.",
      "Portfolio ready for deployment.",
    ],
    [],
  );

  const handleComplete = useCallback(() => {
    setPhase("complete");
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    const timer1 = window.setTimeout(() => setScreenOn(true), 550);
    const timer2 = window.setTimeout(() => setPhase("booting"), 1050);
    return () => {
      window.clearTimeout(timer1);
      window.clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    if (phase !== "booting") {
      return;
    }

    let index = 0;
    const interval = window.setInterval(() => {
      if (index < allBootMessages.length) {
        setBootMessages((current) => [...current, allBootMessages[index]]);
        index += 1;
        return;
      }

      window.clearInterval(interval);
      window.setTimeout(() => setPhase("loading"), 400);
    }, 180);

    return () => window.clearInterval(interval);
  }, [allBootMessages, phase]);

  useEffect(() => {
    if (phase !== "loading") {
      return;
    }

    let progress = 0;
    let frameId = 0;
    let lastTick = performance.now();

    const animate = (now: number) => {
      if (now - lastTick >= 40) {
        lastTick = now;
        progress = Math.min(progress + Math.random() * 1.4 + 1.05, 100);
        setLoadingProgress(progress);

        if (progress >= 100) {
          window.setTimeout(() => setPhase("welcome"), 600);
          return;
        }
      }

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [phase]);

  useEffect(() => {
    if (phase !== "welcome") {
      return;
    }

    const timer = window.setTimeout(() => setPhase("ready"), 2500);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "ready") {
      return;
    }

    const timer = window.setTimeout(() => setPhase("zoom"), 800);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "zoom") {
      return;
    }

    const timer = window.setTimeout(() => handleComplete(), 1500);
    return () => window.clearTimeout(timer);
  }, [handleComplete, phase]);

  const isTransitioning = phase === "ready" || phase === "zoom";

  return (
    <AnimatePresence>
      {phase !== "complete" && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{ background: "#020806" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        >
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{ opacity: isTransitioning ? 0 : 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 opacity-85">
              <Suspense fallback={null}>
                <ShaderAnimation />
              </Suspense>
            </div>
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse 34% 22% at 50% 50%, rgba(0,255,136,0.14) 0%, transparent 58%),
                  radial-gradient(ellipse 56% 34% at 50% 50%, rgba(0,212,255,0.08) 0%, transparent 68%)
                `,
              }}
            />
          </motion.div>

          {phase === "zoom" && (
            <>
              <motion.div
                className="pointer-events-none absolute rounded-full"
                style={{
                  width: 100,
                  height: 100,
                  background: `radial-gradient(circle, ${ELECTRIC_GREEN}22 0%, ${ELECTRIC_BLUE}12 40%, transparent 70%)`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 38], opacity: [0, 0.8, 0.5, 0] }}
                transition={{ duration: 1.3, times: [0, 0.3, 0.7, 1], ease: [0.25, 0.1, 0.25, 1] }}
              />
              <motion.div
                className="pointer-events-none absolute inset-0"
                style={{ background: "#fff" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, 0.92, 0] }}
                transition={{ duration: 1.3, times: [0, 0.62, 0.82, 1], ease: "easeInOut" }}
              />
            </>
          )}

          <div className="relative flex min-h-screen w-full items-center justify-center px-4 sm:px-6">
            <motion.div
              className="relative will-change-transform"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={
                phase === "zoom"
                  ? { scale: [1, 0.95, 0.84], opacity: [1, 0.8, 0], y: [0, 0, -20] }
                  : phase === "ready"
                    ? { scale: 1.01, opacity: 1 }
                    : { scale: 1, opacity: 1 }
              }
              transition={{
                duration: phase === "zoom" ? 1.1 : 0.45,
                ease: phase === "zoom" ? [0.4, 0, 0.2, 1] : "easeOut",
              }}
            >
              <div className="relative flex flex-col items-center">
                <motion.div
                  className="absolute -inset-10 rounded-[2rem] blur-3xl"
                  style={{
                    background: `radial-gradient(ellipse at center, ${ELECTRIC_GREEN}14, ${ELECTRIC_BLUE}10, transparent 72%)`,
                  }}
                  animate={{
                    opacity: screenOn ? (phase === "ready" ? 0.92 : [0.32, 0.5, 0.32]) : 0.1,
                  }}
                  transition={{ duration: phase === "ready" ? 0.4 : 3.2, repeat: phase === "ready" ? 0 : Infinity }}
                />

                <motion.div
                  className="relative rounded-[1rem] p-2.5 sm:p-3 max-w-full"
                  style={{
                    background: "linear-gradient(175deg, #0a0f0d 0%, #040706 100%)",
                    boxShadow:
                      "0 0 0 1px rgba(255,255,255,0.03), 0 20px 70px -16px rgba(0,0,0,0.92), inset 0 1px 0 rgba(255,255,255,0.02)",
                  }}
                  animate={phase === "zoom" ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className="relative h-[200px] w-[320px] overflow-hidden rounded-[0.45rem] sm:h-[260px] sm:w-[430px] md:h-[332px] md:w-[560px] lg:h-[392px] lg:w-[660px] max-w-[90vw] max-h-[70vh]"
                    style={{ background: "#010302", boxShadow: "inset 0 0 90px rgba(0,0,0,0.82)" }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: screenOn ? 1 : 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {phase === "powerOn" && screenOn && (
                        <motion.div
                          className="absolute inset-0"
                          style={{
                            background: `radial-gradient(circle at center, ${ELECTRIC_GREEN}28 0%, transparent 55%)`,
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 0.6, 0.12] }}
                          transition={{ duration: 0.35 }}
                        />
                      )}

                      {phase === "booting" && (
                        <motion.div
                          className="absolute inset-0 overflow-hidden p-4 font-mono text-[8px] sm:p-5 sm:text-[9px] md:p-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className="mb-3 flex items-center gap-2">
                            <MinimalLogo size="sm" />
                            <span className="text-[10px] tracking-wider sm:text-xs" style={{ color: ELECTRIC_GREEN }}>
                              Adrian O.S.
                            </span>
                            <span className="text-[8px] opacity-25" style={{ color: ELECTRIC_GREEN }}>
                              v1.0
                            </span>
                          </div>

                          <div className="space-y-0.5">
                            {bootMessages.map((message, index) => (
                              <motion.div
                                key={index}
                                className="flex items-center gap-1"
                                initial={{ opacity: 0, x: -4 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.08 }}
                              >
                                <span className="opacity-40" style={{ color: ELECTRIC_GREEN }}>
                                  &gt;
                                </span>
                                <span className="opacity-40" style={{ color: ELECTRIC_GREEN }}>
                                  {message}
                                </span>
                              </motion.div>
                            ))}
                          </div>

                          <motion.span
                            className="mt-1.5 inline-block h-2.5 w-1.5"
                            style={{ background: ELECTRIC_GREEN }}
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.45, repeat: Infinity }}
                          />
                        </motion.div>
                      )}

                      {(phase === "loading" || phase === "welcome" || phase === "ready") && (
                        <motion.div
                          className="absolute inset-0 flex flex-col items-center justify-center px-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.25 }}
                        >
                          <AnimatePresence mode="wait">
                            {phase === "welcome" ? (
                              <motion.div
                                key="welcome-msg"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col items-center text-center"
                              >
                                <motion.div
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                >
                                  <MinimalLogo size="md" />
                                </motion.div>
                                <motion.p
                                  className="mt-4 font-mono text-xs font-medium tracking-widest sm:text-sm"
                                  style={{ color: ELECTRIC_GREEN }}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.5 }}
                                >
                                  BIENVENIDO AL PORTFOLIO DE
                                </motion.p>
                                <motion.h2
                                  className="mt-2 font-mono text-lg font-bold tracking-tighter sm:text-xl md:text-2xl"
                                  style={{
                                    background: `linear-gradient(90deg, ${ELECTRIC_GREEN}, ${ELECTRIC_BLUE})`,
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                  }}
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.8 }}
                                >
                                  ADRIAN GARCÍA ALMAIDA
                                </motion.h2>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="loading-ui"
                                className="flex flex-col items-center"
                                animate={phase === "ready" ? { scale: 1.08, filter: "brightness(1.3)" } : {}}
                                transition={{ duration: 0.45, ease: "easeOut" }}
                                exit={{ opacity: 0, y: -10 }}
                              >
                                <MinimalLogo size="lg" />
                                <div className="mt-3 text-center">
                                  <h1
                                    className="font-mono text-base font-medium tracking-[0.2em] sm:text-lg md:text-xl"
                                    style={{
                                      background: `linear-gradient(90deg, ${ELECTRIC_GREEN}, ${ELECTRIC_BLUE})`,
                                      WebkitBackgroundClip: "text",
                                      WebkitTextFillColor: "transparent",
                                    }}
                                  >
                                    ADRIAN O.S.
                                  </h1>
                                </div>

                                <motion.div
                                  className="mt-5 w-40 sm:w-48 md:w-56"
                                  animate={phase === "ready" ? { opacity: 0, y: 8 } : {}}
                                  transition={{ duration: 0.25 }}
                                >
                                  <div className="relative h-[2px] overflow-hidden rounded-full" style={{ background: `${ELECTRIC_GREEN}08` }}>
                                    <motion.div
                                      className="absolute left-0 top-0 h-full rounded-full"
                                      style={{
                                        width: `${loadingProgress}%`,
                                        background: `linear-gradient(90deg, ${ELECTRIC_GREEN}, ${ELECTRIC_BLUE})`,
                                        boxShadow: `0 0 18px ${ELECTRIC_GREEN}45`,
                                      }}
                                    />
                                  </div>

                                  <div className="mt-1.5 flex items-center justify-between">
                                    <span className="font-mono text-[7px] opacity-25 sm:text-[8px]" style={{ color: ELECTRIC_GREEN }}>
                                      {loadingProgress < 100 ? "Loading" : "Ready"}
                                    </span>
                                    <span className="font-mono text-[8px] opacity-60 sm:text-[9px]" style={{ color: ELECTRIC_GREEN }}>
                                      {Math.round(loadingProgress)}%
                                    </span>
                                  </div>
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </motion.div>

                    <motion.div
                      className="pointer-events-none absolute left-0 right-0 h-px opacity-[0.035]"
                      style={{ background: ELECTRIC_GREEN }}
                      animate={{ top: ["0%", "100%"] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    />
                  </div>

                  <motion.div
                    className="mt-1.5 flex items-center justify-center"
                    animate={phase === "zoom" ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        background: screenOn ? ELECTRIC_GREEN : "#080c0a",
                        boxShadow: screenOn ? `0 0 8px ${ELECTRIC_GREEN}80` : "none",
                      }}
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  className="flex flex-col items-center"
                  animate={phase === "zoom" ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="h-4 w-2.5 sm:h-5 sm:w-3" style={{ background: "linear-gradient(90deg, #040706, #080c0a, #040706)" }} />
                  <div className="h-1.5 w-16 rounded-sm sm:w-20" style={{ background: "linear-gradient(180deg, #080c0a, #040706)" }} />
                </motion.div>
              </div>
            </motion.div>
          </div>

          <motion.button
            type="button"
            onClick={handleComplete}
            className="absolute bottom-6 right-6 cursor-pointer font-mono text-[10px] tracking-wider opacity-25 transition-opacity hover:opacity-50 sm:bottom-8 sm:right-8"
            style={{ color: ELECTRIC_GREEN }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            whileHover={{ opacity: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            SKIP
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
