import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Linkedin, Mail, Phone, ArrowUp } from "lucide-react";

// ── Data ──────────────────────────────────────────────

const navItems = [
  { label: "Inicio", href: "#home" },
  { label: "Sobre mí", href: "#about" },
  { label: "Experiencia", href: "#experience" },
  { label: "Contacto", href: "#contact" },
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://es.linkedin.com/in/adrián-garcia-almaida-a0891738a",
    Icon: Linkedin,
    accentHex: "#ac89ff",
  },
  {
    label: "Email",
    href: "mailto:adriangarciafp29@gmail.com",
    Icon: Mail,
    accentHex: "#00eefc",
  },
  {
    label: "Teléfono",
    href: "tel:+34608608581",
    Icon: Phone,
    accentHex: "#39FF14",
  },
];

const marqueeItems = [
  "Desarrollo",
  "IA aplicada",
  "Visión técnica",
  "Base real",
  "Criterio propio",
  "Aprendizaje rápido",
  "Soporte y sistemas",
];

// ── Animation helpers ─────────────────────────────────

const revealUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

// ── Marquee Ticker ────────────────────────────────────

function FooterMarquee() {
  const content = marqueeItems
    .map((item) => `${item} ✦`)
    .join("  ");

  return (
    <div className="relative -rotate-2 scale-105 overflow-hidden border-y border-white/[0.06] bg-surface-container-lowest/60 py-3.5 backdrop-blur-md">
      <div
        className="flex w-max whitespace-nowrap font-label text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/30"
        style={{ animation: "footerMarquee 35s linear infinite" }}
      >
        <span className="flex items-center gap-6 px-6">
          {content} &nbsp;&nbsp; {content}
        </span>
        <span className="flex items-center gap-6 px-6" aria-hidden="true">
          {content} &nbsp;&nbsp; {content}
        </span>
      </div>
    </div>
  );
}

// ── Nav Pill ──────────────────────────────────────────

function NavPill({ label, href }: { label: string; href: string }) {
  return (
    <motion.a
      href={href}
      whileHover={{
        scale: 1.06,
        boxShadow: "0 0 24px rgba(57,255,20,0.12), inset 0 1px 1px rgba(255,255,255,0.08)",
      }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", damping: 18, stiffness: 300 }}
      className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.02] px-6 py-2.5 font-label text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant backdrop-blur-md transition-colors duration-300 hover:border-white/15 hover:text-white"
    >
      {label}
    </motion.a>
  );
}

// ── Social Link ───────────────────────────────────────

function SocialLink({
  label,
  href,
  Icon,
  accentHex,
}: (typeof socialLinks)[number]) {
  return (
    <motion.a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", damping: 18, stiffness: 300 }}
      className="group flex items-center gap-2.5 rounded-full border border-white/[0.06] bg-white/[0.015] px-5 py-2.5 backdrop-blur-md transition-all duration-300 hover:border-white/12"
      aria-label={label}
    >
      <Icon
        size={14}
        style={{ color: accentHex }}
        className="transition-transform duration-300 group-hover:scale-110"
      />
      <span className="font-label text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant transition-colors duration-300 group-hover:text-white">
        {label}
      </span>
    </motion.a>
  );
}

// ── Scroll to Top ─────────────────────────────────────

function ScrollToTop() {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{
        scale: 1.1,
        boxShadow: "0 0 20px rgba(57,255,20,0.15)",
      }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", damping: 18, stiffness: 300 }}
      className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02] text-on-surface-variant backdrop-blur-md transition-colors duration-300 hover:border-primary/20 hover:text-primary"
      aria-label="Volver arriba"
    >
      <ArrowUp
        size={16}
        className="transition-transform duration-300 group-hover:-translate-y-1"
      />
    </motion.button>
  );
}

// ── Main Component ────────────────────────────────────

export default function Footer() {
  const reduceMotion = useReducedMotion();
  const footerRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end start"],
  });

  const giantTextY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [60, -30],
  );
  const giantTextOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7], [0, 1, 0.6]);
  const glowY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [20, -20]);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-surface-container-lowest"
    >
      {/* ── Ambient Glow ── */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          style={{ y: glowY }}
          className="absolute left-1/2 top-1/2 h-[50vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-primary/[0.04] blur-[100px]"
        />
        <div className="absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-secondary/[0.03] blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-tertiary/[0.03] blur-[80px]" />
      </div>

      {/* ── Giant Background Text ── */}
      <motion.div
        style={{ y: giantTextY, opacity: giantTextOpacity }}
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="whitespace-nowrap font-headline font-black leading-none tracking-[-0.06em] text-white/[0.02]"
          style={{ fontSize: "clamp(10rem, 22vw, 28rem)" }}
        >
          AGA
        </span>
      </motion.div>

      {/* ── Marquee Ticker ── */}
      <div className="relative z-10 pt-8">
        <FooterMarquee />
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pb-6 pt-20">
        {/* Heading */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={revealUp}
          custom={0}
          className="mb-4 text-center text-4xl font-black tracking-tighter text-on-surface md:text-6xl"
        >
          El portfolio no termina{" "}
          <span className="gradient-text-animate">aquí.</span>
        </motion.h2>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={revealUp}
          custom={0.08}
          className="mb-12 max-w-md text-center text-sm leading-relaxed text-on-surface-variant/60"
        >
          Explora de nuevo, contacta directamente, o vuelve a empezar.
        </motion.p>

        {/* Nav Pills */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-16 flex flex-wrap justify-center gap-3"
        >
          {navItems.map((item, i) => (
            <motion.div key={item.label} variants={revealUp} custom={0.1 + i * 0.06}>
              <NavPill label={item.label} href={item.href} />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Divider ── */}
        <motion.div
          className="mb-10 h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-white/12 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Social Links + Scroll to top */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-14 flex flex-wrap items-center justify-center gap-3"
        >
          {socialLinks.map((link, i) => (
            <motion.div key={link.label} variants={revealUp} custom={0.05 + i * 0.06}>
              <SocialLink {...link} />
            </motion.div>
          ))}
          <motion.div variants={revealUp} custom={0.25}>
            <ScrollToTop />
          </motion.div>
        </motion.div>

        {/* ── Bottom Bar ── */}
        <div className="flex w-full flex-col items-center gap-5 md:flex-row md:justify-between">
          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-label text-[9px] font-bold uppercase tracking-[0.24em] text-on-surface-variant/30 md:order-1"
          >
            © {new Date().getFullYear()} Adrián García Almaida
          </motion.p>

          {/* Made by badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 rounded-full border border-white/[0.05] bg-white/[0.015] px-5 py-2 backdrop-blur-md md:order-2"
          >
            <span className="font-label text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">
              Hecho por
            </span>
            <span
              className="text-sm text-[#ff5f56]"
              style={{ animation: "footerHeartbeat 2.5s cubic-bezier(0.25,1,0.5,1) infinite" }}
            >
              ❤
            </span>
            <span className="font-label text-[10px] font-black tracking-tight text-on-surface/80">
              Adrián García Almaida
            </span>
          </motion.div>

          {/* System tag */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="font-label text-[9px] font-bold uppercase tracking-[0.2em] text-primary/30 md:order-3"
          >
            AGA // SYSTEM_ACTIVE
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
