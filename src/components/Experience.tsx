import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

// ── Types ─────────────────────────────────────────────

type Accent = "primary" | "secondary" | "tertiary";

interface ExperienceEntry {
  role: string;
  company: string;
  location: string;
  period: string;
  periodCompact: string;
  stage: string;
  summary: string;
  highlights: string[];
  focus: string[];
  accent: Accent;
}

// ── Data ──────────────────────────────────────────────

const experienceEntries: ExperienceEntry[] = [
  {
    role: "Trainee Developer",
    company: "Prácticas · Indra",
    location: "Ciudad Real",
    period: "2024 — 2025",
    periodCompact: "01",
    stage: "Desarrollo y evolución",
    summary:
      "Primera etapa orientada a desarrollo dentro de un entorno profesional real, participando en mantenimiento, mejora y validación de aplicaciones internas con foco en aprender rápido y aportar con criterio.",
    highlights: [
      "Colaboración en desarrollo y mantenimiento de funcionalidades para aplicaciones internas.",
      "Apoyo en corrección de incidencias y mejora progresiva del rendimiento de distintas piezas.",
      "Participación en pruebas, validación de cambios y seguimiento técnico antes de despliegue.",
    ],
    focus: ["Código", "Testing", "Mantenimiento", "Trabajo en equipo"],
    accent: "primary",
  },
  {
    role: "Gestión de instalaciones de fibra",
    company: "Prácticas · Servicomtel",
    location: "Toledo",
    period: "2022 — 2023",
    periodCompact: "02",
    stage: "Coordinación técnica",
    summary:
      "Etapa centrada en organización operativa, control de estados e interlocución con técnicos, reforzando orden, seguimiento y comprensión del trabajo técnico sobre terreno.",
    highlights: [
      "Apoyo en planificación y control de instalaciones de fibra óptica.",
      "Gestión de partes de trabajo y actualización de estados con seguimiento continuo.",
      "Coordinación con técnicos y revisión de incidencias y documentación de cierre.",
    ],
    focus: ["Operaciones", "Seguimiento", "Coordinación", "Documentación"],
    accent: "secondary",
  },
  {
    role: "Auxiliar de informática",
    company: "Prácticas · Ayuntamiento de Olías del Rey",
    location: "Toledo",
    period: "2020 — 2021",
    periodCompact: "03",
    stage: "Base técnica",
    summary:
      "Base práctica en soporte, hardware, redes y puestos de trabajo. Una etapa clave para desarrollar criterio técnico, cercanía con el usuario y resolución ordenada de problemas.",
    highlights: [
      "Soporte a usuarios en incidencias de hardware y software del día a día.",
      "Instalación y configuración de equipos, periféricos y puestos de trabajo.",
      "Mantenimiento básico de red, impresoras, inventario y actualización de sistemas.",
    ],
    focus: ["Soporte", "Hardware", "Redes", "Resolución"],
    accent: "tertiary",
  },
];

const accentColors: Record<Accent, { hex: string; glow: string; text: string; soft: string }> = {
  primary: { hex: "#39FF14", glow: "rgba(57,255,20,0.45)", text: "text-primary", soft: "bg-primary/10" },
  secondary: { hex: "#00eefc", glow: "rgba(0,238,252,0.4)", text: "text-secondary", soft: "bg-secondary/10" },
  tertiary: { hex: "#ac89ff", glow: "rgba(172,137,255,0.36)", text: "text-tertiary", soft: "bg-tertiary/10" },
};

// ── Animation helpers ─────────────────────────────────

const revealUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const blurReveal = {
  hidden: { opacity: 0, filter: "blur(6px)" },
  visible: (delay: number = 0) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

// ── Chapter Entry ─────────────────────────────────────

function ChapterEntry({
  entry,
  index,
  reduceMotion,
}: {
  entry: ExperienceEntry;
  index: number;
  reduceMotion: boolean;
}) {
  const chapterRef = useRef<HTMLElement | null>(null);
  const accent = accentColors[entry.accent];

  const { scrollYProgress } = useScroll({
    target: chapterRef,
    offset: ["start end", "end start"],
  });

  const ghostY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [40, -40]);
  const contentY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [14, -14]);

  return (
    <article ref={chapterRef} className="relative py-20 md:py-28">
      {/* ── Ghost chapter number ── */}
      <motion.span
        aria-hidden="true"
        style={{ y: ghostY }}
        animate={reduceMotion ? undefined : { opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-2 top-12 select-none font-headline text-[7rem] font-black leading-none tracking-[-0.06em] text-white/[0.06] md:-left-6 md:top-16 md:text-[11rem]"
      >
        {entry.periodCompact}
      </motion.span>

      {/* ── Content ── */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 ml-0 md:ml-20 lg:ml-32"
      >
        {/* Stage + Period line */}
        <motion.div
          className="mb-5 flex flex-wrap items-center gap-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.span
            variants={revealUp}
            custom={0}
            className={`font-label text-[10px] font-bold uppercase tracking-[0.28em] ${accent.text}`}
          >
            {entry.stage}
          </motion.span>
          <motion.span
            variants={revealUp}
            custom={0.05}
            className="text-white/20"
          >
            ·
          </motion.span>
          <motion.span
            variants={revealUp}
            custom={0.08}
            className="font-label text-[10px] uppercase tracking-[0.24em] text-on-surface-variant"
          >
            {entry.period}
          </motion.span>
        </motion.div>

        {/* Company + Location */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={revealUp}
          custom={0.06}
          className="mb-4 font-label text-[10px] uppercase tracking-[0.24em] text-on-surface-variant"
        >
          {entry.company} · {entry.location}
        </motion.p>

        {/* Role headline */}
        <motion.h3
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={revealUp}
          custom={0.1}
          className="mb-7 max-w-3xl text-balance text-[2rem] font-black leading-[0.95] tracking-tight text-on-surface md:text-[3.2rem] lg:text-[3.8rem]"
        >
          {entry.role}
        </motion.h3>

        {/* Summary — blur-to-focus reveal */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={reduceMotion ? revealUp : blurReveal}
          custom={0.18}
          className="mb-10 max-w-2xl text-pretty text-[0.95rem] leading-relaxed text-on-surface-variant md:text-base"
        >
          {entry.summary}
        </motion.p>

        {/* Accent horizontal rule */}
        <motion.div
          className="mb-10 h-px max-w-2xl"
          style={{ backgroundColor: accent.hex, transformOrigin: "left", opacity: 0.4 }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Highlights */}
        <ul className="mb-10 max-w-2xl space-y-5">
          {entry.highlights.map((highlight, i) => (
            <motion.li
              key={highlight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="group/hl flex items-start gap-4"
            >
              {/* Accent bar */}
              <motion.span
                className="mt-1.5 h-5 w-[3px] shrink-0 rounded-full transition-all duration-300 group-hover/hl:h-7"
                style={{
                  backgroundColor: accent.hex,
                  transformOrigin: "top",
                  boxShadow: `0 0 8px ${accent.glow}`,
                }}
                initial={{ scaleY: 0, opacity: 0 }}
                whileInView={{ scaleY: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
              <motion.span
                variants={revealUp}
                custom={0.12 + i * 0.1}
                className="text-sm leading-relaxed text-on-surface/90 transition-colors duration-300 group-hover/hl:text-white"
              >
                {highlight}
              </motion.span>
            </motion.li>
          ))}
        </ul>

        {/* Focus pills */}
        <div className="flex flex-wrap gap-2.5">
          {entry.focus.map((item, i) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              whileHover={
                reduceMotion
                  ? undefined
                  : { scale: 1.06, boxShadow: `0 0 16px ${accent.hex}30` }
              }
              transition={{
                duration: 0.4,
                delay: 0.2 + i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-flex cursor-default items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 transition-all duration-300 hover:border-white/20 hover:text-white/90"
            >
              <span
                className="h-1 w-1 rounded-full"
                style={{ backgroundColor: accent.hex }}
              />
              {item}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </article>
  );
}

// ── Progress Spine ────────────────────────────────────

function ProgressSpine({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="pointer-events-none absolute bottom-28 left-6 top-[22rem] hidden w-px md:block lg:left-10">
      {/* Background line */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/8 to-white/0" />

      {/* Nodes */}
      {experienceEntries.map((entry, i) => {
        const accent = accentColors[entry.accent];
        const topPercent = `${15 + i * 33}%`;
        return (
          <motion.div
            key={entry.company}
            className="absolute -left-[5px] flex flex-col items-center"
            style={{ top: topPercent }}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
          >
            {/* Pulse ring */}
            <motion.span
              className="absolute h-[11px] w-[11px] rounded-full"
              style={{ backgroundColor: accent.hex, opacity: 0.2 }}
              animate={
                reduceMotion
                  ? undefined
                  : { scale: [1, 2.2, 1], opacity: [0.3, 0.05, 0.3] }
              }
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
            />
            {/* Core dot */}
            <span
              className="relative h-[11px] w-[11px] rounded-full"
              style={{
                backgroundColor: accent.hex,
                boxShadow: `0 0 12px ${accent.glow}`,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Main Component ────────────────────────────────────

export default function Experience() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const glowLeftY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [30, -40]);
  const glowRightY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-20, 50]);
  const glowBottomY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [18, -24]);
  const headerY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -18]);
  const summaryY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 16]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative overflow-hidden bg-surface px-6 py-32"
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1800px" }}
    >
      {/* ── Ambient Glow ── */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div style={{ y: glowLeftY }} className="absolute left-[-12%] top-10 h-80 w-80 rounded-full bg-primary/7 blur-[130px]" />
        <motion.div style={{ y: glowRightY }} className="absolute right-[-10%] top-1/3 h-[28rem] w-[28rem] rounded-full bg-secondary/7 blur-[160px]" />
        <motion.div style={{ y: glowBottomY }} className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-tertiary/6 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* ═══════════════════════════════════════════
            SECTION HEADER
        ═══════════════════════════════════════════ */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: headerY }}
          className="pb-12"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-3">
                <span className="h-px w-10 bg-gradient-to-r from-secondary to-transparent" />
                <span className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">
                  Trayectoria
                </span>
              </div>

              <h2 className="max-w-5xl text-balance text-5xl font-black leading-none tracking-tighter text-on-surface md:text-7xl">
                Experiencia con narrativa, criterio y{" "}
                <span className="gradient-text-animate">dirección</span>
              </h2>
            </div>

            <motion.div style={{ y: summaryY }} className="space-y-5">
              <p className="text-pretty text-sm leading-relaxed text-on-surface-variant">
                Mi recorrido no se entiende como una lista de prácticas, sino como una progresión:
                base técnica, coordinación operativa y entrada en desarrollo dentro de un entorno
                profesional.
              </p>

              <div className="flex flex-wrap gap-x-7 gap-y-3">
                {[
                  { label: "3", caption: "Etapas clave" },
                  { label: "Soporte + sistemas", caption: "Base real" },
                  { label: "Desarrollo e IA", caption: "Dirección actual" },
                ].map((item) => (
                  <div key={item.caption}>
                    <p className="text-sm font-semibold tracking-tight text-on-surface">{item.label}</p>
                    <p className="font-label text-[10px] uppercase tracking-[0.24em] text-on-surface-variant">
                      {item.caption}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.header>

        {/* ── Expanding divider ── */}
        <motion.div
          className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* ═══════════════════════════════════════════
            PROGRESS SPINE + CHAPTERS
        ═══════════════════════════════════════════ */}
        <div className="relative">
          <ProgressSpine reduceMotion={Boolean(reduceMotion)} />

          {experienceEntries.map((entry, index) => (
            <div key={`${entry.company}-${entry.period}`}>
              <ChapterEntry
                entry={entry}
                index={index}
                reduceMotion={Boolean(reduceMotion)}
              />
              {/* Chapter divider */}
              {index < experienceEntries.length - 1 && (
                <motion.div
                  className="mx-auto h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-white/12 to-transparent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════
            CLOSING — "Lectura Final"
        ═══════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 pt-8"
        >
          <motion.div
            className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-white/16 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
                Lectura final
              </p>
              <h3 className="mt-3 max-w-4xl text-balance text-2xl font-black tracking-tight text-on-surface md:text-3xl">
                Un perfil que entiende la tecnología desde la operativa y hoy avanza hacia
                desarrollo con una base más transversal, práctica y útil de lo habitual.
              </h3>
            </div>

            <div className="flex flex-wrap gap-2.5 lg:justify-end">
              {["Visión transversal", "Aprendizaje rápido", "Base técnica real"].map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 font-label text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant transition-all duration-300 hover:border-primary/30 hover:text-white"
                >
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  {item}
                </motion.span>
              ))}
            </div>
          </div>

          <motion.div
            className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/16 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      </div>
    </section>
  );
}
