import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import type { ChatAction } from "./chat-utils";
import { scrollToSection } from "./chat-utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  actions?: ChatAction[];
  onNavigate?: () => void;
}

export function ChatMessageBubble({ role, content, actions, onNavigate }: ChatMessageProps) {
  const isBot = role === "assistant";

  const handleAction = (action: ChatAction) => {
    if (action.type === "navigate") {
      onNavigate?.();
      setTimeout(() => scrollToSection(action.target), 350);
    } else if (action.type === "link") {
      if (action.target.startsWith("mailto:") || action.target.startsWith("tel:")) {
        window.location.href = action.target;
      } else {
        window.open(action.target, "_blank", "noopener,noreferrer");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${isBot ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[85%] rounded-xl px-4 py-3 text-[13px] leading-relaxed ${
          isBot
            ? "border-l-2 border-primary/40 bg-white/[0.04] text-white/90"
            : "bg-primary/10 text-white"
        }`}
      >
        {/* Message text */}
        <div className="prose prose-sm md:prose-base prose-invert max-w-none prose-p:leading-relaxed prose-p:my-1 prose-a:text-primary prose-strong:text-white prose-ul:my-1 prose-li:my-0 prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 prose-pre:m-0">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {actions.map((action) => (
              <button
                key={`${action.type}-${action.target}`}
                onClick={() => handleAction(action)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-label text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-200 ${
                  action.type === "navigate"
                    ? "border border-primary/30 text-primary hover:bg-primary/10"
                    : "border border-secondary/30 text-secondary hover:bg-secondary/10"
                }`}
              >
                {action.type === "navigate" ? (
                  <span className="text-[11px]">→</span>
                ) : (
                  <span className="text-[11px]">↗</span>
                )}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
