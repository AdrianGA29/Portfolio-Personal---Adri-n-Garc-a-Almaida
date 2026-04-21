import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

interface SkillNode {
  label: string;
  accent: string;
  glowColor: string;
  angle: number;
  radius: number;
  orbitIndex: number;
}

const skillNodes: SkillNode[] = [
  // Orbit 1 — Sistemas y soporte (primary)
  { label: "Incidencias", accent: "#39FF14", glowColor: "rgba(57,255,20,0.5)", angle: 0, radius: 32, orbitIndex: 0 },
  { label: "Soporte", accent: "#39FF14", glowColor: "rgba(57,255,20,0.5)", angle: 120, radius: 32, orbitIndex: 0 },
  { label: "Redes", accent: "#39FF14", glowColor: "rgba(57,255,20,0.5)", angle: 240, radius: 32, orbitIndex: 0 },
  // Orbit 2 — Base técnica (secondary)
  { label: "Hardware", accent: "#00eefc", glowColor: "rgba(0,238,252,0.5)", angle: 0, radius: 52, orbitIndex: 1 },
  { label: "Electrónica", accent: "#00eefc", glowColor: "rgba(0,238,252,0.5)", angle: 120, radius: 52, orbitIndex: 1 },
  { label: "Software", accent: "#00eefc", glowColor: "rgba(0,238,252,0.5)", angle: 240, radius: 52, orbitIndex: 1 },
  // Orbit 3 — Crecimiento (tertiary)
  { label: "Desarrollo", accent: "#ac89ff", glowColor: "rgba(172,137,255,0.5)", angle: 90, radius: 72, orbitIndex: 2 },
  { label: "IA", accent: "#ac89ff", glowColor: "rgba(172,137,255,0.5)", angle: 300, radius: 72, orbitIndex: 2 },
];

const orbitColors = ["rgba(57,255,20,0.12)", "rgba(0,238,252,0.10)", "rgba(172,137,255,0.08)"];
const orbitRadii = [32, 52, 72];
const orbitLabels = ["Sistemas y soporte", "Base técnica", "Crecimiento actual"];

function OrbitRing({ radius, color, index, reduceMotion }: { radius: number; color: string; index: number; reduceMotion: boolean }) {
  const pxRadius = (radius / 100) * 280;
  return (
    <motion.div
      className="absolute rounded-full border"
      style={{
        width: pxRadius * 2,
        height: pxRadius * 2,
        top: `calc(50% - ${pxRadius}px)`,
        left: `calc(50% - ${pxRadius}px)`,
        borderColor: color,
        boxShadow: `inset 0 0 20px ${color}, 0 0 12px ${color}`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: 0.2 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

function SkillNodeDot({ node, reduceMotion }: { node: SkillNode; reduceMotion: boolean }) {
  const [hovered, setHovered] = useState(false);
  const pxRadius = (node.radius / 100) * 280;
  const rad = (node.angle * Math.PI) / 180;
  const x = Math.cos(rad) * pxRadius;
  const y = Math.sin(rad) * pxRadius;

  return (
    <motion.div
      className="absolute z-10 flex items-center justify-center"
      style={{
        top: `calc(50% + ${y}px - 18px)`,
        left: `calc(50% + ${x}px - 18px)`,
        width: 36,
        height: 36,
      }}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.5,
        delay: 0.5 + node.orbitIndex * 0.15 + (node.angle / 360) * 0.2,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Pulse glow */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 36, height: 36, background: node.glowColor }}
        animate={
          reduceMotion
            ? {}
            : hovered
              ? { scale: 1.8, opacity: 0.5 }
              : { scale: [1, 1.5, 1], opacity: [0.2, 0.05, 0.2] }
        }
        transition={
          hovered
            ? { duration: 0.3 }
            : { duration: 3, repeat: Infinity, ease: "easeInOut", delay: node.angle * 0.005 }
        }
      />
      {/* Core dot */}
      <div
        className="relative h-3 w-3 rounded-full transition-transform duration-300"
        style={{
          backgroundColor: node.accent,
          boxShadow: `0 0 ${hovered ? 20 : 10}px ${node.glowColor}`,
          transform: hovered ? "scale(1.4)" : "scale(1)",
        }}
      />
      {/* Label */}
      <motion.div
        className="absolute z-50 whitespace-nowrap rounded-md border border-white/10 bg-black/80 px-2.5 py-1 backdrop-blur-md"
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4, scale: hovered ? 1 : 0.9 }}
        transition={{ duration: 0.2 }}
        style={{ 
          pointerEvents: "none",
          // Posicionar según cuadrante para evitar solapamiento
          left: '50%',
          transform: 'translateX(-50%)',
          top: node.angle >= 180 ? 'auto' : '100%',
          bottom: node.angle >= 180 ? '100%' : 'auto',
          marginTop: node.angle >= 180 ? 0 : '8px',
          marginBottom: node.angle >= 180 ? '8px' : 0,
        }}
      >
        <span className="font-label text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: node.accent }}>
          {node.label}
        </span>
      </motion.div>
    </motion.div>
  );
}

export function SkillsOrbit() {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <div className="relative flex h-full min-h-[380px] items-center justify-center overflow-visible lg:min-h-[460px] px-8 py-4">
      {/* Orbit rings */}
      {orbitRadii.map((r, i) => (
        <OrbitRing key={i} radius={r} color={orbitColors[i]} index={i} reduceMotion={reduceMotion} />
      ))}

      {/* Center node */}
      <motion.div
        className="relative z-20 flex flex-col items-center justify-center"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/60 backdrop-blur-xl">
          <div className="h-3 w-3 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.6)]" />
        </div>
        <span className="mt-2 font-label text-[9px] font-bold uppercase tracking-[0.28em] text-white/50">
          Core
        </span>
      </motion.div>

      {/* Skill nodes */}
      {skillNodes.map((node) => (
        <SkillNodeDot key={node.label} node={node} reduceMotion={reduceMotion} />
      ))}

      {/* Orbit labels */}
      {orbitLabels.map((label, i) => {
        const pxR = (orbitRadii[i] / 100) * 280;
        return (
          <motion.span
            key={label}
            className="absolute z-10 font-label text-[8px] font-bold uppercase tracking-[0.22em] text-white/20"
            style={{ top: `calc(50% - ${pxR}px - 14px)`, left: "50%", transform: "translateX(-50%)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
          >
            {label}
          </motion.span>
        );
      })}
    </div>
  );
}
