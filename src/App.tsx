import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/projects/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import IntroAnimation from "./components/IntroAnimation";
import ChatBot from "./chat/ChatBot";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="min-h-screen bg-background text-on-background">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroAnimation key="intro" onComplete={() => setShowIntro(false)} />
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
                <Projects />
                <Contact />
              </main>
              <Footer />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <ChatBot showIntro={showIntro} />
    </div>
  );
}
