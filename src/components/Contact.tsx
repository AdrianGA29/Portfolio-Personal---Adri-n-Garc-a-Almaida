import { motion, useReducedMotion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useState, useCallback } from "react";
import { Mail, Phone, Linkedin, Check, ArrowRight, Loader2 } from "lucide-react";

// ── Types ─────────────────────────────────────────────

type FormStatus = "idle" | "sending" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

// ── Constants ─────────────────────────────────────────

const MAX_MESSAGE_LENGTH = 500;

const channels = [
  {
    label: "Email",
    value: "adriangarciafp29@gmail.com",
    Icon: Mail,
    accentHex: "#00eefc",
    copyValue: "adriangarciafp29@gmail.com",
    href: "mailto:adriangarciafp29@gmail.com",
    copyable: true,
  },
  {
    label: "Teléfono",
    value: "+34 608 60 85 81",
    Icon: Phone,
    accentHex: "#39FF14",
    copyValue: "+34608608581",
    href: "tel:+34608608581",
    copyable: true,
  },
  {
    label: "LinkedIn",
    value: "Adrián García Almaida",
    Icon: Linkedin,
    accentHex: "#ac89ff",
    copyValue: "",
    href: "https://es.linkedin.com/in/adrián-garcia-almaida-a0891738a",
    copyable: false,
  },
] as const;

// ── Validation ────────────────────────────────────────

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Nombre requerido";
  if (!data.email.trim()) {
    errors.email = "Email requerido";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Email no válido";
  }
  if (!data.message.trim()) errors.message = "Mensaje requerido";
  return errors;
}

// ── Web3Forms Submit ──────────────────────────────────

async function submitToWeb3Forms(data: FormData): Promise<void> {
  const key = process.env.WEB3FORMS_KEY;
  if (!key) {
    console.warn("[Contact] WEB3FORMS_KEY not set — simulating send");
    await new Promise((r) => setTimeout(r, 1800));
    return;
  }

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_key: key,
      name: data.name,
      email: data.email,
      subject: data.subject || `Portfolio — ${data.name}`,
      message: data.message,
      from_name: "Portfolio Adrián García",
    }),
  });

  if (!res.ok) throw new Error("Network error");
  const result = await res.json();
  if (!result.success) throw new Error(result.message || "Submit failed");
}

// ── Animation Variants ────────────────────────────────

const revealUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

// ── Floating Field ────────────────────────────────────

function FloatingField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  maxLength,
  isTextarea = false,
  rows = 4,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  maxLength?: number;
  isTextarea?: boolean;
  rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  const showValid = value.length > 0 && !error;
  const Tag = isTextarea ? "textarea" : "input";

  const borderColor = error
    ? "#ff5f56"
    : focused
      ? "#39FF14"
      : "rgba(255,255,255,0.08)";

  return (
    <div className="relative pt-5">
      {/* Label */}
      <motion.label
        htmlFor={id}
        className="pointer-events-none absolute left-1 font-label text-[10px] font-bold uppercase tracking-[0.22em]"
        animate={{
          y: active ? -4 : 16,
          scale: active ? 0.88 : 1,
          color: error ? "#ff5f56" : focused ? "#39FF14" : "rgba(255,255,255,0.3)",
        }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: 0 }}
      >
        {label}
        {required && <span className="ml-0.5 text-primary/40">*</span>}
      </motion.label>

      {/* Input */}
      <Tag
        id={id}
        type={isTextarea ? undefined : type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={isTextarea ? rows : undefined}
        maxLength={maxLength}
        autoComplete={type === "email" ? "email" : id === "name" ? "name" : undefined}
        className={`w-full border-x-0 border-t-0 border-b-2 bg-transparent px-1 py-3 text-[15px] text-on-surface outline-none transition-all duration-300 placeholder:text-transparent ${
          isTextarea ? "resize-none" : ""
        }`}
        style={{
          borderBottomColor: borderColor,
          boxShadow: focused ? `0 4px 16px -6px rgba(57,255,20,0.18)` : "none",
        }}
      />

      {/* Bottom row: error / valid / char count */}
      <div className="mt-1.5 flex min-h-[16px] items-center justify-between">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.span
              key="error"
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              className="text-[11px] text-[#ff5f56]"
            >
              {error}
            </motion.span>
          ) : showValid ? (
            <motion.span
              key="valid"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-[11px] text-primary/50"
            >
              ✓
            </motion.span>
          ) : (
            <span key="empty" />
          )}
        </AnimatePresence>

        {maxLength && (
          <span
            className="font-label text-[9px] uppercase tracking-[0.18em] transition-colors duration-300"
            style={{
              color:
                value.length > maxLength * 0.9
                  ? "#ff5f56"
                  : value.length > maxLength * 0.7
                    ? "#ffbd2e"
                    : "rgba(255,255,255,0.18)",
            }}
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Contact Channel ───────────────────────────────────

function ContactChannel({
  label,
  value,
  Icon,
  accentHex,
  copyValue,
  href,
  copyable,
  index,
}: (typeof channels)[number] & { index: number }) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    if (copyable) {
      try {
        await navigator.clipboard.writeText(copyValue);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch {
        window.open(href);
      }
    } else {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={revealUp}
      custom={0.1 + index * 0.1}
      className="group relative flex w-full items-center gap-4 rounded-xl border border-white/[0.05] px-5 py-4 text-left transition-all duration-300 hover:border-white/10 hover:bg-white/[0.02]"
    >
      {/* Icon container */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 transition-all duration-300 group-hover:border-transparent"
        style={{
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}
      >
        <Icon
          size={17}
          style={{ color: accentHex }}
          className="transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-label text-[9px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
          {label}
        </p>
        <p className="truncate text-sm font-semibold text-on-surface/90 transition-colors duration-300 group-hover:text-white">
          {value}
        </p>
      </div>

      {/* Copy / open indicator */}
      <div className="ml-auto shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="copied"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="flex items-center gap-1 font-label text-[9px] font-bold uppercase tracking-[0.18em]"
              style={{ color: accentHex }}
            >
              <Check size={10} /> Copiado
            </motion.span>
          ) : (
            <motion.span
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-label text-[9px] uppercase tracking-[0.18em] text-white/25"
            >
              {copyable ? "Copiar" : "Abrir ↗"}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Hover accent line */}
      <span
        className="absolute bottom-0 left-4 right-4 h-px origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
        style={{ backgroundColor: accentHex, opacity: 0.5 }}
      />
    </motion.button>
  );
}

// ── Submit Button ─────────────────────────────────────

function SubmitButton({ status }: { status: FormStatus }) {
  return (
    <motion.button
      type="submit"
      disabled={status === "sending" || status === "success"}
      className="relative mt-2 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl py-4 font-label text-[11px] font-bold uppercase tracking-[0.22em] transition-all duration-300 disabled:cursor-not-allowed"
      style={{
        background:
          status === "success"
            ? "rgba(57,255,20,0.15)"
            : status === "error"
              ? "rgba(255,95,86,0.12)"
              : "rgba(57,255,20,0.10)",
        color:
          status === "success"
            ? "#39FF14"
            : status === "error"
              ? "#ff5f56"
              : "#39FF14",
        boxShadow:
          status === "success"
            ? "0 0 30px rgba(57,255,20,0.2)"
            : "0 0 20px rgba(57,255,20,0.08)",
        animation:
          status === "error" ? "shakeError 0.5s ease-in-out" : undefined,
      }}
      whileHover={
        status === "idle"
          ? { boxShadow: "0 0 36px rgba(57,255,20,0.25)", scale: 1.01 }
          : undefined
      }
      whileTap={status === "idle" ? { scale: 0.985 } : undefined}
    >
      {/* Scan line across button */}
      {status === "sending" && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(57,255,20,0.08), transparent)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["-200% 0", "200% 0"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      )}

      <AnimatePresence mode="wait">
        {status === "sending" ? (
          <motion.span
            key="sending"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2"
          >
            <Loader2 size={14} className="animate-spin" />
            Transmitiendo…
          </motion.span>
        ) : status === "success" ? (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
            style={{ animation: "transmitPulse 1s ease-out" }}
          >
            <Check size={14} />
            Señal enviada
          </motion.span>
        ) : status === "error" ? (
          <motion.span
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Error — Reintentar
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2"
          >
            Enviar señal
            <ArrowRight size={14} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ── Main Component ────────────────────────────────────

export default function Contact() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const glowLeftY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [30, -30]);
  const glowRightY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-20, 40]);

  // ── Form State ──
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [honeypot, setHoneypot] = useState("");

  const updateField = useCallback(
    (field: keyof FormData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error on change
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field as keyof FormErrors];
          return next;
        });
      }
    },
    [errors],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (honeypot) return; // bot detected

      const validationErrors = validateForm(formData);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) return;

      setStatus("sending");

      try {
        await submitToWeb3Forms(formData);
        setStatus("success");
        setTimeout(() => {
          setFormData({ name: "", email: "", subject: "", message: "" });
          setErrors({});
          setStatus("idle");
        }, 4000);
      } catch {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3500);
      }
    },
    [formData, honeypot],
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden bg-surface px-6 py-32"
    >
      {/* ── Ambient Glow ── */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          style={{ y: glowLeftY }}
          className="absolute -left-[8%] top-20 h-80 w-80 rounded-full bg-secondary/6 blur-[130px]"
        />
        <motion.div
          style={{ y: glowRightY }}
          className="absolute -right-[6%] bottom-20 h-96 w-96 rounded-full bg-primary/5 blur-[160px]"
        />
        <div className="absolute bottom-0 left-1/2 h-72 w-[28rem] -translate-x-1/2 rounded-full bg-tertiary/4 blur-[140px]" />
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
          className="pb-12"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:items-end">
            <div>
              {/* Badge */}
              <div className="mb-5 inline-flex items-center gap-3">
                <span className="h-px w-10 bg-gradient-to-r from-secondary to-transparent" />
                <span className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">
                  Contacto
                </span>
              </div>

              {/* Headline */}
              <h2 className="max-w-4xl text-balance text-5xl font-black leading-none tracking-tighter text-on-surface md:text-7xl">
                Envíame una{" "}
                <span className="gradient-text-animate">señal</span>
              </h2>
            </div>

            {/* Subtitle column */}
            <div className="space-y-4 border-l border-white/10 pl-6">
              <p className="text-pretty text-sm leading-relaxed text-on-surface-variant">
                ¿Buscas un perfil técnico con base real, criterio propio y capacidad de
                aprendizaje rápido? Escríbeme directamente o usa el formulario.
              </p>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-[pulseGlow_3s_ease-in-out_infinite] rounded-full bg-primary" />
                <span className="font-label text-[9px] font-bold uppercase tracking-[0.24em] text-primary/70">
                  Disponible para nuevas oportunidades
                </span>
              </div>
            </div>
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
            MAIN CONTENT — 2 COLUMNS
        ═══════════════════════════════════════════ */}
        <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-20">
          {/* ── LEFT: Contact Channels ── */}
          <div>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealUp}
              custom={0}
              className="mb-6 font-label text-[10px] font-bold uppercase tracking-[0.28em] text-on-surface-variant"
            >
              Canales directos
            </motion.p>

            <div className="space-y-3">
              {channels.map((channel, i) => (
                <ContactChannel key={channel.label} {...channel} index={i} />
              ))}
            </div>

            {/* Closing note */}
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealUp}
              custom={0.5}
              className="mt-10 max-w-xs text-pretty text-[13px] leading-relaxed text-on-surface-variant/60"
            >
              Respondo normalmente en menos de 24 horas. Si es urgente, el
              teléfono es la vía más rápida.
            </motion.p>
          </div>

          {/* ── RIGHT: Transmission Panel ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 sm:p-8"
            style={{
              animation: "panelBreathe 4s ease-in-out infinite",
            }}
          >
            {/* Terminal header */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#ff5f56]/80" />
                  <span className="h-2 w-2 rounded-full bg-[#ffbd2e]/80" />
                  <span className="h-2 w-2 rounded-full bg-[#27c93f]/80" />
                </div>
                <span className="font-label text-[9px] font-bold uppercase tracking-[0.22em] text-white/25">
                  transmission_panel
                </span>
              </div>
              <span className="flex items-center gap-1.5 font-label text-[8px] uppercase tracking-[0.18em] text-white/20">
                <span className="h-1 w-1 rounded-full bg-primary animate-[pulseGlow_3s_ease-in-out_infinite]" />
                Seguro
              </span>
            </div>

            {/* Gradient separator */}
            <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Honeypot — hidden from real users */}
              <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
                <input
                  type="text"
                  name="bot_field"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <FloatingField
                id="contact-name"
                label="Nombre"
                value={formData.name}
                onChange={updateField("name")}
                error={errors.name}
                required
              />

              <FloatingField
                id="contact-email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={updateField("email")}
                error={errors.email}
                required
              />

              <FloatingField
                id="contact-subject"
                label="Asunto"
                value={formData.subject}
                onChange={updateField("subject")}
              />

              <FloatingField
                id="contact-message"
                label="Mensaje"
                value={formData.message}
                onChange={updateField("message")}
                error={errors.message}
                required
                isTextarea
                rows={4}
                maxLength={MAX_MESSAGE_LENGTH}
              />

              <SubmitButton status={status} />

              {/* Success overlay message */}
              <AnimatePresence>
                {status === "success" && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 text-center text-[12px] text-primary/60"
                  >
                    Tu mensaje ha sido transmitido. Responderé lo antes posible.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════
            CLOSING DIVIDER
        ═══════════════════════════════════════════ */}
        <motion.div
          className="mt-20 h-px w-full bg-gradient-to-r from-transparent via-white/16 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </section>
  );
}
