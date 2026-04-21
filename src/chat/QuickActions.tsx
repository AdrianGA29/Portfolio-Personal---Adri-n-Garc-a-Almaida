import { motion } from "motion/react";
import { scrollToSection } from "./chat-utils";

interface QuickAction {
  label: string;
  type: "navigate" | "query";
  target: string;
  accent: "primary" | "secondary";
}

const quickActions: QuickAction[] = [
  { label: "Sobre mí", type: "navigate", target: "about", accent: "primary" },
  { label: "Experiencia", type: "navigate", target: "experience", accent: "primary" },
  { label: "Contacto", type: "navigate", target: "contact", accent: "primary" },
  { label: "LinkedIn", type: "query", target: "Dame tu LinkedIn", accent: "secondary" },
  { label: "Email", type: "query", target: "Dame tu email", accent: "secondary" },
  { label: "Teléfono", type: "query", target: "Dame tu teléfono", accent: "secondary" },
];

interface QuickActionsProps {
  onSendMessage: (message: string) => void;
  onClose?: () => void;
}

export function QuickActions({ onSendMessage, onClose }: QuickActionsProps) {
  const handleAction = (action: QuickAction) => {
    if (action.type === "navigate") {
      onClose?.();
      setTimeout(() => scrollToSection(action.target), 350);
    } else {
      onSendMessage(action.target);
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 px-4 py-2">
      {quickActions.map((action, i) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            delay: 0.05 + i * 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.06)" }}
          onClick={() => handleAction(action)}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 font-label text-[9px] font-bold uppercase tracking-[0.18em] text-white/60 transition-colors hover:border-white/20 hover:text-white/90"
        >
          <span
            className="h-1 w-1 rounded-full"
            style={{
              backgroundColor: action.accent === "primary" ? "#39FF14" : "#00eefc",
            }}
          />
          {action.label}
        </motion.button>
      ))}
    </div>
  );
}
