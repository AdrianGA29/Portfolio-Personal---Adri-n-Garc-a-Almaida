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
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  // Observe Hero section to toggle launcher visibility
  useEffect(() => {
    if (showIntro) {
      setIsVisible(false);
      setIsHeroVisible(true);
      return;
    }

    const heroEl = document.getElementById("home");
    if (!heroEl) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const heroVisible = entry.isIntersecting && entry.intersectionRatio > 0.3;
        setIsHeroVisible(heroVisible);
        setIsVisible(!heroVisible);
      },
      { threshold: [0, 0.3, 0.5, 1] },
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [showIntro]);

  useEffect(() => {
    if (isHeroVisible) {
      setIsOpen(false);
    }
  }, [isHeroVisible]);

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
