import { lazy, startTransition, Suspense, useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import IntroAnimation from "./components/IntroAnimation";

const Projects = lazy(() => import("./components/projects/Projects"));
const ChatBot = lazy(() => import("./chat/ChatBot"));

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const handleIntroComplete = useCallback(() => {
    startTransition(() => {
      setShowIntro(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-background">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroAnimation key="intro" onComplete={handleIntroComplete} />
        ) : (
          <>
            <Navbar />
            <motion.div
              key="main-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <main>
                <Hero />
                <About />
                <Experience />
                <Suspense fallback={null}>
                  <Projects />
                </Suspense>
                <Contact />
              </main>
              <Footer />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <Suspense fallback={null}>
        <ChatBot showIntro={showIntro} />
      </Suspense>
    </div>
  );
}
