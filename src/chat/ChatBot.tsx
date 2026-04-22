import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "motion/react";
import { ChatLauncher } from "./ChatLauncher";
import { ChatPanel } from "./ChatPanel";

interface ChatBotProps {
  showIntro: boolean;
}

export default function ChatBot({ showIntro }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showIntro) {
      setIsVisible(false);
      return;
    }

    let ticking = false;

    const syncVisibility = () => {
      const heroEl = document.getElementById("home");
      if (!heroEl) {
        setIsVisible(true);
        return;
      }

      const rect = heroEl.getBoundingClientRect();
      const heroVisible = rect.top < window.innerHeight && rect.bottom > 0;

      setIsVisible(isOpen || !heroVisible);
    };

    const requestSync = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        syncVisibility();
        ticking = false;
      });
    };

    syncVisibility();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);

    return () => {
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
    };
  }, [showIntro, isOpen]);

  const handleClose = useCallback(() => setIsOpen(false), []);
  const handleToggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // Don't render anything during intro
  if (showIntro) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <ChatLauncher
            key="launcher"
            onClick={handleToggle}
            isOpen={isOpen}
          />
          {isOpen && (
            <ChatPanel
              key="panel"
              isOpen={isOpen}
              onClose={handleClose}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}
