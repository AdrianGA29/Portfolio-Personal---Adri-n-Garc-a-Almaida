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
      className="fixed bottom-6 right-5 z-[60] flex h-[64px] w-[64px] items-center justify-center rounded-full border border-white/10 bg-surface-container-high/90 shadow-lg backdrop-blur-xl transition-colors hover:border-primary/30 sm:right-6"
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
      <span className="absolute -right-0.5 -top-0.5 z-10 flex h-2.5 w-2.5 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-30" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
      </span>

      {/* Avatar Orbit */}
      <div className="relative h-14 w-14">
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
