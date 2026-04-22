import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { MagicText } from "./ui/magic-text";
import { SkillsOrbit } from "./ui/skills-orbit";

// ── Data ──────────────────────────────────────────────

const valuePillars = [
  {
    index: "01",
    title: "Vision tecnica global",
    description:
      "Soporte, sistemas, hardware y desarrollo me han dado una base mas completa para entender la tecnologia en contexto.",
    accent: "text-primary",
    barColor: "#39FF14",
    glow: "rgba(57,255,20,0.12)",
  },
  {
    index: "02",
    title: "Experiencia practica",
    description:
      "He trabajado con incidencias, entornos reales y tareas tecnicas que exigen criterio, adaptacion y orden.",
    accent: "text-secondary",
    barColor: "#00eefc",
    glow: "rgba(0,238,252,0.12)",
  },
  {
    index: "03",
    title: "IA aplicada",
    description:
      "Estoy ampliando mi formacion en inteligencia artificial con interes en su uso practico para mejorar procesos y construir soluciones utiles.",
    accent: "text-tertiary",
    barColor: "#ac89ff",
    glow: "rgba(172,137,255,0.12)",
  },
] as const;

const aboutParagraphs = [
  "Mi perfil une formacion en informatica, experiencia tecnica practica y una evolucion firme hacia desarrollo. Haber pasado por soporte, hardware, redes y entornos profesionales me ha dado una vision mas completa de la tecnologia: entender el contexto, detectar el problema y construir soluciones con criterio.",
  "Actualmente estoy reforzando mi camino como desarrollador mientras amplio mi formacion en inteligencia artificial, explorando su potencial desde una perspectiva practica y aplicada. Busco participar en proyectos donde pueda aportar base tecnica, capacidad de adaptacion y una mentalidad orientada a seguir aprendiendo, mejorar procesos y crear soluciones con impacto real.",
] as const;

const metricsData = [
  { label: "Base", value: "Informatica practica y soporte en entornos reales.", accent: "text-primary", barColor: "#39FF14" },
  { label: "Aporte", value: "Entendimiento tecnico, resolucion e independencia.", accent: "text-secondary", barColor: "#00eefc" },
  { label: "Direccion", value: "Desarrollo de software e inteligencia artificial.", accent: "text-tertiary", barColor: "#ac89ff" },
] as const;

// ── Education Data ───────────────────────────────────

const educationData = [
  {
    level: "FP Básica",
    title: "Sistemas y Comunicaciones",
    period: "2018 - 2020",
    accent: "text-primary",
    barColor: "#39FF14",
  },
  {
    level: "FP Medio",
    title: "Microsistemas y Redes",
    period: "2020 - 2022",
    accent: "text-secondary",
    barColor: "#00eefc",
  },
  {
    level: "Grado Superior",
    title: "Desarrollo de Aplicaciones Multiplataforma (DAM)",
    period: "2022 - 2024",
    accent: "text-tertiary",
    barColor: "#ac89ff",
  },
] as const;

// ── Animation Variants ────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const revealUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// ── Typing Status Hook ────────────────────────────────

function useTypingStatus(texts: string[], interval = 3000) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const target = texts[index];
    if (isTyping) {
      if (displayed.length < target.length) {
        const timer = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 45);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => setIsTyping(false), interval);
        return () => clearTimeout(timer);
      }
    } else {
      setDisplayed("");
      setIndex((i) => (i + 1) % texts.length);
      setIsTyping(true);
    }
  }, [displayed, isTyping, index, texts, interval]);

  return displayed;
}

// ── Component ─────────────────────────────────────────

export default function About() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: imageProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(imageProgress, [0, 1], reduceMotion ? [0, 0] : [25, -25]);
  const imageScale = useTransform(imageProgress, [0, 1], reduceMotion ? [1, 1] : [1.02, 1.1]);

  const glowLeftY = useTransform(sectionProgress, [0, 1], reduceMotion ? [0, 0] : [30, -40]);
  const glowRightY = useTransform(sectionProgress, [0, 1], reduceMotion ? [0, 0] : [-20, 50]);
  const glowBottomY = useTransform(sectionProgress, [0, 1], reduceMotion ? [0, 0] : [18, -24]);

  const terminalStatus = useTypingStatus([
    "profile_loaded",
    "status: active",
    "formandose_en_IA",
    "disponible",
  ]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 py-32"
      id="about"
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1400px" }}
    >
      {/* ── Ambient Glow Background ── */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          style={{ y: glowLeftY }}
          className="absolute left-[-12%] top-10 h-80 w-80 rounded-full bg-primary/7 blur-[130px]"
        />
        <motion.div
          style={{ y: glowRightY }}
          className="absolute right-[-10%] top-1/3 h-[28rem] w-[28rem] rounded-full bg-secondary/7 blur-[160px]"
        />
        <motion.div
          style={{ y: glowBottomY }}
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-tertiary/6 blur-[120px]"
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* ═══════════════════════════════════════════
            BLOCK 1 — Section Header
        ═══════════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <motion.div variants={revealUp} className="max-w-4xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-label text-[10px] font-bold uppercase tracking-[0.28em] text-primary backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
              Sobre mi
            </span>
            <h2 className="max-w-5xl text-balance text-5xl font-black leading-none tracking-tighter text-on-surface md:text-7xl">
              De la informatica practica al{" "}
              <span className="gradient-text-animate">
                desarrollo con vision de futuro
              </span>
            </h2>
          </motion.div>

          <motion.div variants={revealUp} className="max-w-md border-l border-white/10 pl-6">
            <p className="text-pretty text-sm leading-relaxed text-on-surface-variant">
              Perfil tecnico en evolucion constante, con base real en sistemas, soporte y
              desarrollo, y una mirada actual hacia inteligencia artificial aplicada.
            </p>
          </motion.div>
        </motion.div>

        {/* ── Expanding divider line ── */}
        <motion.div
          className="mb-12 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* ═══════════════════════════════════════════
            BENTO GRID
        ═══════════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={containerVariants}
          className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 auto-rows-[auto]"
        >
          {/* ─── Card 1: Profile Photo ─── */}
          <motion.div
            variants={revealUp}
            whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl transition-[border-color,box-shadow] duration-300 hover:border-primary/25 hover:shadow-[0_0_40px_-8px_rgba(57,255,20,0.12)] md:col-span-1 lg:col-span-1 md:row-span-2"
          >
            {/* Terminal header */}
            <div className="absolute inset-x-0 top-0 z-20 flex h-10 items-center border-b border-white/10 bg-black/50 px-4 backdrop-blur-md">
              <div className="mr-4 flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                {terminalStatus}
                <span className="ml-0.5 inline-block h-3 w-[2px] animate-[borderShimmer_1s_ease-in-out_infinite] bg-primary align-middle" />
              </span>
            </div>

            {/* Image with scan line */}
            <div ref={imageRef} className="relative mt-10 h-[460px] w-full overflow-hidden md:h-[500px]">
              {/* Scan line effect */}
              {!reduceMotion && <div className="scan-line" />}

              {/* CRT grid scan overlay */}
              {!reduceMotion && (
                <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden opacity-30">
                  <div
                    className="absolute inset-x-0 h-[200%]"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(57,255,20,0.04) 3px, rgba(57,255,20,0.04) 4px)',
                      animation: 'gridScan 15s linear infinite',
                    }}
                  />
                </div>
              )}

              <motion.div
                style={{ y: imageY, scale: imageScale }}
                className="absolute inset-0 h-full w-full overflow-hidden"
              >
                {/* Placeholder gradient (replace src with real photo) */}
                <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <div className="h-20 w-20 rounded-full border-2 border-white/20 flex items-center justify-center">
                      <svg className="h-10 w-10 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <span className="font-label text-[9px] uppercase tracking-[0.3em] text-white/30">profile_photo</span>
                  </div>
                </div>
              </motion.div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

              {/* Glitch RGB hover effect via CSS */}
              <div className="absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-200 group-hover:opacity-100"
                style={{
                  background: "linear-gradient(180deg, rgba(255,0,0,0.03) 0%, rgba(0,255,0,0.02) 50%, rgba(0,0,255,0.03) 100%)",
                }}
              />

              {/* Status overlay */}
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="rounded-xl border border-white/10 bg-black/60 p-4 backdrop-blur-md">
                  <p className="font-label text-xs font-bold uppercase tracking-widest text-primary">Status</p>
                  <div className="mt-1 flex items-center gap-2 text-sm font-medium text-white">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-45" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                    Formandome en IA
                  </div>
                  <div className="mt-3 flex gap-4">
                    <div>
                      <p className="font-label text-[8px] uppercase tracking-[0.2em] text-white/30">Location</p>
                      <p className="text-[11px] font-medium text-white/70">España</p>
                    </div>
                    <div>
                      <p className="font-label text-[8px] uppercase tracking-[0.2em] text-white/30">Stack</p>
                      <p className="text-[11px] font-medium text-white/70">Dev + IA</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── Card 2: Narrative ─── */}
          <motion.div
            variants={revealUp}
            whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-2xl transition-[border-color,box-shadow] duration-300 hover:border-secondary/25 hover:shadow-[0_0_40px_-8px_rgba(0,238,252,0.1)] md:col-span-2 lg:col-span-2"
          >
            <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-primary/10 blur-[100px] transition-opacity duration-500 group-hover:bg-primary/20" />

            {/* Decorative quote mark */}
            <div className="pointer-events-none absolute -left-2 -top-4 font-headline text-[8rem] font-black leading-none text-white/[0.06] animate-[quoteBreath_5s_ease-in-out_infinite]">
              &ldquo;
            </div>

            <p className="mb-6 font-label text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
              Narrativa profesional
            </p>

            <div className="relative z-10 space-y-6">
              {aboutParagraphs.map((paragraph, index) => (
                <MagicText
                  key={index}
                  text={paragraph}
                  className={`flex flex-wrap text-on-surface ${index === 0 ? "leading-[1.4]" : "leading-[1.5]"}`}
                  wordClassName={
                    index === 0
                      ? "text-[1.1rem] font-semibold tracking-tight md:text-[1.35rem]"
                      : "text-[0.95rem] font-medium tracking-tight text-on-surface/80 md:text-[1.05rem]"
                  }
                  ghostClassName="text-on-surface"
                  wordWrapperClassName={index === 0 ? "mr-[0.3em] mt-[0.2em]" : "mr-[0.3em] mt-[0.12em]"}
                />
              ))}
            </div>
          </motion.div>

          {/* ─── Card 3: Value Pillars ─── */}
          <motion.div
            variants={revealUp}
            whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-2xl transition-[border-color,box-shadow] duration-300 hover:border-tertiary/25 hover:shadow-[0_0_40px_-8px_rgba(172,137,255,0.1)] md:col-span-3 lg:col-span-1 lg:row-span-2"
          >
            <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-tertiary/10 blur-[100px] transition-opacity duration-500 group-hover:bg-tertiary/20" />

            <p className="mb-8 font-label text-[10px] font-bold uppercase tracking-[0.24em] text-tertiary">
              Enfoque
            </p>

            <div className="relative z-10 flex h-full flex-col justify-between gap-8">
              {valuePillars.map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  className="group/item"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.55,
                    delay: 0.15 * i,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {/* Ghost index */}
                  <span className="pointer-events-none absolute right-4 font-headline text-[2.5rem] font-black leading-none text-white/[0.03]">
                    {pillar.index}
                  </span>

                  <div className="mb-2 flex items-center gap-3">
                    {/* Animated accent bar */}
                    <motion.div
                      className="w-1 rounded-full"
                      style={{ backgroundColor: pillar.barColor, transformOrigin: "bottom" }}
                      initial={{ scaleY: 0, height: 16 }}
                      whileInView={{ scaleY: 1, height: 16 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.2 + i * 0.15,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                    <h3 className="font-label text-sm font-bold uppercase tracking-widest text-white transition-colors group-hover/item:text-white/80">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="pl-4 text-sm leading-relaxed text-on-surface-variant">
                    {pillar.description}
                  </p>

                  {/* Connector line */}
                  {i < valuePillars.length - 1 && (
                    <motion.div
                      className="ml-[3px] mt-4 h-6 w-px bg-gradient-to-b from-white/10 to-transparent"
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
                      style={{ transformOrigin: "top" }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ─── Card 4: Metrics "Data Readout" ─── */}
          <motion.div
            variants={revealUp}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-2xl md:col-span-2 lg:col-span-2"
          >
            <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-secondary/10 blur-[100px] transition-opacity duration-500 group-hover:bg-secondary/20" />

            {/* Light sweep on hover */}
            <div className="light-sweep group-hover:opacity-100" />

            <div className="relative z-10 grid gap-8 md:grid-cols-3">
              {metricsData.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="group/metric flex flex-col"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Accent top bar */}
                  <motion.div
                    className="mb-4 h-[2px] w-full rounded-full"
                    style={{ backgroundColor: item.barColor, transformOrigin: "left" }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <p className={`mb-3 font-label text-[10px] font-bold uppercase tracking-[0.28em] transition-all duration-300 group-hover/metric:tracking-[0.35em] ${item.accent}`}>
                    {item.label}
                  </p>
                  <p
                    className="text-sm leading-relaxed text-on-surface-variant transition-colors duration-300 group-hover/metric:text-white"
                    style={{
                      backgroundImage: 'linear-gradient(90deg, currentColor 40%, rgba(255,255,255,0.6) 50%, currentColor 60%)',
                      backgroundSize: '200% 100%',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                    }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.animation = 'textShimmer 1.5s ease-in-out'; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.animation = 'none'; }}
                  >
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ─── Card 5: Capabilities Banner ─── */}
          <motion.div
            variants={revealUp}
            whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            className="group relative flex flex-col justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 backdrop-blur-2xl transition-[border-color,box-shadow] duration-300 hover:border-primary/25 hover:shadow-[0_0_40px_-8px_rgba(57,255,20,0.1)] md:col-span-3 lg:col-span-1"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <span className="relative z-10 font-label text-[10px] font-bold uppercase tracking-[0.24em] text-secondary">
              Capacidades
            </span>
            <h3 className="relative z-10 mt-3 text-balance text-2xl font-black tracking-tight text-white">
              Base operativa lista para aportar
            </h3>
            <p className="relative z-10 mt-4 text-pretty text-sm leading-relaxed text-on-surface-variant lg:hidden xl:block">
              Mentalidad orientada a la adaptacion y a seguir creciendo hacia el desarrollo.
            </p>
          </motion.div>

          {/* ─── Card 6: Education Timeline ─── */}
          <motion.div
            variants={revealUp}
            whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-2xl transition-[border-color,box-shadow] duration-300 hover:border-primary/25 hover:shadow-[0_0_40px_-8px_rgba(57,255,20,0.1)] md:col-span-3 lg:col-span-3"
          >
            <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-primary/10 blur-[100px] transition-opacity duration-500 group-hover:bg-primary/20" />

            <div className="relative z-10">
              <p className="mb-6 font-label text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                Formacion academica
              </p>

              <div className="relative space-y-6 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:bg-gradient-to-b before:from-primary/30 before:via-secondary/30 before:to-tertiary/30 before:content-['']">
                {educationData.map((edu, i) => (
                  <motion.div
                    key={edu.level}
                    className="relative pl-8"
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Timeline dot */}
                    <motion.div
                      className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2"
                      style={{ borderColor: edu.barColor, backgroundColor: "rgba(0,0,0,0.5)" }}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: edu.barColor }}
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      />
                    </motion.div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className={`font-label text-[9px] font-bold uppercase tracking-[0.2em] ${edu.accent}`}>
                          {edu.level}
                        </span>
                        <span className="text-[10px] text-white/30">•</span>
                        <span className="font-label text-[9px] uppercase tracking-[0.15em] text-white/50">
                          {edu.period}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white">
                        {edu.title}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ─── Card 7: Skills Orbit ─── */}
          <motion.div
            variants={revealUp}
            whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-2xl transition-[border-color,box-shadow] duration-300 hover:border-secondary/20 hover:shadow-[0_0_40px_-8px_rgba(0,238,252,0.08)] md:col-span-3 lg:col-span-3"
          >
            {/* Animated border lines */}
            <motion.div
              className="absolute right-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            />

            <div className="relative z-10">
              <div className="mb-6 flex items-center justify-between">
                <p className="font-label text-[10px] font-bold uppercase tracking-[0.24em] text-white/50">
                  Mapa de capacidades
                </p>
                <div className="flex items-center gap-4">
                  {[
                    { label: "Sistemas", color: "#39FF14" },
                    { label: "Base técnica", color: "#00eefc" },
                    { label: "Crecimiento", color: "#ac89ff" },
                  ].map((l) => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full animate-[pulseGlow_3s_ease-in-out_infinite]" style={{ backgroundColor: l.color, animationDelay: `${['0s','1s','2s'][['#39FF14','#00eefc','#ac89ff'].indexOf(l.color)] || '0s'}` }} />
                      <span className="font-label text-[8px] uppercase tracking-[0.2em] text-white/30">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <SkillsOrbit />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
