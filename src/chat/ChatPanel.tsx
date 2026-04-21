import { motion } from "motion/react";
import { useRef, useEffect, useState, useCallback } from "react";
import { ChatMessageBubble } from "./ChatMessage";
import { QuickActions } from "./QuickActions";
import { TypingIndicator } from "./TypingIndicator";
import { sendMessage, createMessage, type ChatMessage } from "./chat-utils";

const WELCOME_MESSAGE =
  "¡Hola! Soy el asistente del portfolio de Adrián.\n\nPuedo ayudarte a explorar su perfil, experiencia y proyectos, o facilitarte sus datos de contacto.\n\n¿Qué te gustaría saber?";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("assistant", WELCOME_MESSAGE),
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleSend = useCallback(
    async (text?: string) => {
      const message = text || inputValue.trim();
      if (!message || isTyping) return;

      setInputValue("");
      const userMsg = createMessage("user", message);
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      try {
        const response = await sendMessage([...messages, userMsg], message);
        const botMsg = createMessage("assistant", response);
        setMessages((prev) => [...prev, botMsg]);
      } catch {
        const errorMsg = createMessage(
          "assistant",
          "Ha ocurrido un error. Por favor, inténtalo de nuevo.",
        );
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsTyping(false);
      }
    },
    [inputValue, isTyping, messages],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      role="dialog"
      aria-label="Chat con el asistente del portfolio"
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-24 right-5 z-[60] flex w-[calc(100vw-2.5rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-white/8 bg-black/90 shadow-[0_8px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:right-6 sm:bottom-24 sm:w-[400px] max-sm:left-5 max-sm:bottom-20"
      style={{ maxHeight: "min(560px, calc(100vh - 140px))" }}
    >
      {/* ── Header ── */}
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/8 px-4">
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <button
              onClick={onClose}
              className="h-2.5 w-2.5 rounded-full bg-[#ff5f56] transition-opacity hover:opacity-80"
              aria-label="Cerrar chat"
            />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <span className="font-label text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
            adrian.ai
          </span>
        </div>
        <span className="flex items-center gap-1.5 font-label text-[8px] uppercase tracking-[0.2em] text-white/30">
          <span className="h-1 w-1 rounded-full bg-primary animate-[pulseGlow_3s_ease-in-out_infinite]" />
          Online
        </span>
      </div>

      {/* ── Gradient separator ── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        className="relative flex-1 space-y-3 overflow-y-auto px-4 py-4"
        aria-live="polite"
      >
        {/* Top fade */}
        <div className="pointer-events-none sticky -top-4 left-0 right-0 -mt-4 h-6 bg-gradient-to-b from-black/90 to-transparent" />

        {messages.map((msg) => (
          <ChatMessageBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
            actions={msg.actions}
            onNavigate={onClose}
          />
        ))}

        {/* Quick actions after welcome or after out-of-scope */}
        {messages.length <= 1 && !isTyping && (
          <QuickActions onSendMessage={(m) => handleSend(m)} onClose={onClose} />
        )}

        {isTyping && <TypingIndicator />}
      </div>

      {/* ── Input ── */}
      <div className="shrink-0 border-t border-white/8 px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe algo..."
            className="flex-1 bg-transparent text-[13px] text-white placeholder:text-white/25 focus:outline-none"
          />
          {inputValue.trim() && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => handleSend()}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary transition-colors hover:bg-primary/25"
              aria-label="Enviar mensaje"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.button>
          )}
        </div>
        {/* Focus glow line */}
        <div className="mt-2 h-px w-full bg-gradient-to-r from-transparent via-white/6 to-transparent transition-all duration-300 focus-within:via-primary/30" />
      </div>
    </motion.div>
  );
}
