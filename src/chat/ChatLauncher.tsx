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
      className="fixed bottom-6 right-5 z-[60] flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/10 bg-surface-container-high/90 shadow-lg backdrop-blur-xl transition-colors hover:border-primary/30 sm:right-6"
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

      {/* Icon: terminal cursor >_ */}
      <motion.span
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.25 }}
        className="relative font-label text-sm font-bold text-primary"
      >
        {isOpen ? "✕" : ">_"}
      </motion.span>
    </motion.button>
  );
}
