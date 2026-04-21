"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Menu } from "lucide-react";
import { cn } from "@/src/lib/utils";

const navItems = [
  { name: "Inicio", href: "#home" },
  { name: "Sobre Mí", href: "#about" },
  { name: "Experiencia", href: "#experience" },
  { name: "Proyectos", href: "#projects" },
  { name: "Contacto", href: "#contact" },
];

const EXPAND_SCROLL_THRESHOLD = 80;
const COLLAPSE_SCROLL_START = 180;
const HERO_SHOW_OFFSET = 120;
const HERO_HIDE_OFFSET = 32;

const containerVariants = {
  expanded: {
    width: "auto",
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 300,
      staggerChildren: 0.07,
      delayChildren: 0.12,
    },
  },
  collapsed: {
    width: "3.25rem",
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 300,
      when: "afterChildren" as const,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const logoVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { type: "spring" as const, damping: 15 },
  },
  collapsed: {
    opacity: 0,
    x: -24,
    rotate: -180,
    transition: { duration: 0.25 },
  },
};

const itemVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring" as const, damping: 15 },
  },
  collapsed: {
    opacity: 0,
    x: -18,
    scale: 0.95,
    transition: { duration: 0.18 },
  },
};

const collapsedIconVariants = {
  expanded: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.18 },
  },
  collapsed: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 15,
      stiffness: 300,
      delay: 0.12,
    },
  },
};

function MinimalLogoMark() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="navbarLogoGradient" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#00ff88" />
          <stop offset="100%" stopColor="#00d4ff" />
        </linearGradient>
      </defs>
      <path d="M50 15 L18 85 L30 85 L50 40 L70 85 L82 85 Z" fill="url(#navbarLogoGradient)" />
    </svg>
  );
}

export default function Navbar() {
  const [isExpanded, setExpanded] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);
  const isExpandedRef = React.useRef(isExpanded);
  const isVisibleRef = React.useRef(isVisible);

  React.useEffect(() => {
    isExpandedRef.current = isExpanded;
  }, [isExpanded]);

  React.useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  React.useEffect(() => {
    let ticking = false;

    const syncNavbar = () => {
      const latest = window.scrollY;
      const previous = lastScrollY.current;
      const heroSection = document.getElementById("home");

      let nextVisible = isVisibleRef.current;

      if (!heroSection) {
        nextVisible = true;
      } else {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        const showThreshold = window.innerHeight - HERO_SHOW_OFFSET;
        const hideThreshold = window.innerHeight - HERO_HIDE_OFFSET;

        if (!isVisibleRef.current && heroBottom <= showThreshold) {
          nextVisible = true;
        } else if (isVisibleRef.current && heroBottom >= hideThreshold) {
          nextVisible = false;
        }
      }

      if (nextVisible !== isVisibleRef.current) {
        isVisibleRef.current = nextVisible;
        setIsVisible(nextVisible);
      }

      if (!nextVisible) {
        scrollPositionOnCollapse.current = 0;
        lastScrollY.current = latest;
        return;
      }

      if (isExpandedRef.current && latest > previous && latest > COLLAPSE_SCROLL_START) {
        isExpandedRef.current = false;
        setExpanded(false);
        scrollPositionOnCollapse.current = latest;
      } else if (
        !isExpandedRef.current &&
        latest < previous &&
        scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD
      ) {
        isExpandedRef.current = true;
        setExpanded(true);
      }

      lastScrollY.current = latest;
    };

    const requestSync = () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        syncNavbar();
        ticking = false;
      });
    };

    syncNavbar();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);

    return () => {
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
    };
  }, []);

  const handleNavClick = (event: React.MouseEvent) => {
    if (!isExpanded) {
      event.preventDefault();
      isExpandedRef.current = true;
      setExpanded(true);
    }
  };

  return (
    <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2">
      <motion.div
        initial={false}
        animate={{
          y: isVisible ? 0 : -96,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className={cn(!isVisible && "pointer-events-none")}
      >
        <motion.nav
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={containerVariants}
          whileHover={!isExpanded ? { scale: 1.08 } : {}}
          whileTap={!isExpanded ? { scale: 0.96 } : {}}
          onClick={handleNavClick}
          className={cn(
            "relative flex h-12 items-center overflow-hidden rounded-full border border-outline-variant/30 bg-neutral-950/85 shadow-lg backdrop-blur-md",
            !isExpanded && "cursor-pointer justify-center",
          )}
        >
          <motion.div
            variants={logoVariants}
            className="flex shrink-0 items-center pl-4 pr-2 font-semibold text-primary"
          >
            <MinimalLogoMark />
          </motion.div>

          <motion.div
            className={cn(
              "flex items-center gap-1 pr-4 sm:gap-2",
              !isExpanded && "pointer-events-none",
            )}
          >
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                variants={itemVariants}
                onClick={(event) => event.stopPropagation()}
                className="rounded-full px-3 py-2 font-label text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-400 transition-colors hover:bg-white/5 hover:text-primary"
              >
                {item.name}
              </motion.a>
            ))}
          </motion.div>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.div
              variants={collapsedIconVariants}
              animate={isExpanded ? "expanded" : "collapsed"}
              className="text-primary"
            >
              <Menu className="h-5 w-5" />
            </motion.div>
          </div>
        </motion.nav>
      </motion.div>
    </div>
  );
}
