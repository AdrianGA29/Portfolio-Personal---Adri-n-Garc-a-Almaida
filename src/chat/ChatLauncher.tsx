import { motion } from "motion/react";

interface ChatLauncherProps {
  onClick: () => void;
  isOpen: boolean;
}

export function ChatLauncher({ onClick, isOpen }: ChatLauncherProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", damping: 18, stiffness: 300 }}
      className="fixed bottom-6 right-5 z-[60] flex h-[90px] w-[90px] items-center justify-center rounded-full border border-white/10 bg-surface-container-high/90 shadow-lg backdrop-blur-xl transition-colors hover:border-primary/30 sm:right-6 sm:h-[90px] sm:w-[90px]"
      aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      aria-expanded={isOpen}
    >
      {/* Pulse glow ring */}
      <motion.span
        className="absolute inset-0 rounded-full border border-primary/20"
        animate={{
          scale: [1, 1.35, 1],
          opacity: [0.4, 0, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Active badge dot */}
      <span className="absolute right-1.5 top-1.5 z-10 flex h-3.5 w-3.5 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-30" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
      </span>

      {/* Avatar Orbit */}
      <div className="relative h-[78px] w-[78px] sm:h-[78px] sm:w-[78px]">
        <motion.img
          src="/chat/orbit_idle.png"
          alt="Orbit Idle"
          animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0.9 : 1.15 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-contain"
        />
        <motion.img
          src="/chat/orbit_happy.png"
          alt="Orbit Happy"
          animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1.15 : 0.9 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
    </motion.button>
  );
}
