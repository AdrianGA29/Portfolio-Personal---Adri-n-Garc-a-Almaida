import { motion } from "motion/react";
import type { Project } from "@/src/data/projects";

const accentHex: Record<string, string> = {
  primary: "#39FF14",
  secondary: "#00eefc",
  tertiary: "#ac89ff",
};

const statusConfig: Record<string, { label: string; color: string }> = {
  live: { label: "Live", color: "#39FF14" },
  wip: { label: "En desarrollo", color: "#ffbd2e" },
  archived: { label: "Archivado", color: "#888" },
};

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

export function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  const accent = accentHex[project.accent];
  const status = statusConfig[project.status];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="group/card relative cursor-pointer overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] transition-all duration-500 hover:border-white/16 hover:bg-white/[0.04]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {project.thumbnail && (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.04]"
            loading="lazy"
          />
        )}

        <div
          className="absolute inset-0 transition-transform duration-700 ease-out group-hover/card:scale-[1.04]"
          style={{
            background: project.thumbnail
              ? "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.18) 100%)"
              : `linear-gradient(135deg, ${accent}08 0%, ${accent}18 50%, ${accent}05 100%)`,
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(${accent}40 1px, transparent 1px), linear-gradient(90deg, ${accent}40 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100">
          <div className="scan-line absolute inset-0" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-headline text-4xl font-black opacity-[0.06] transition-opacity duration-500 group-hover/card:opacity-[0.12]"
            style={{ color: accent }}
          >
            {project.title.charAt(0)}
          </span>
        </div>

        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-md">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: status.color,
              boxShadow: project.status === "live" ? `0 0 6px ${status.color}` : "none",
            }}
          />
          <span className="font-label text-[8px] font-bold uppercase tracking-[0.2em] text-white/70">
            {status.label}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="mb-1 text-base font-bold tracking-tight text-on-surface transition-transform duration-300 group-hover/card:-translate-y-px">
          {project.title}
        </h3>
        <p className="mb-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
          {project.subtitle}
        </p>
        <p className="mb-5 line-clamp-2 text-[13px] leading-relaxed text-on-surface-variant/80">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-white/8 px-2.5 py-0.5 font-label text-[8px] font-bold uppercase tracking-[0.18em] text-white/50 transition-all duration-300 group-hover/card:border-white/14 group-hover/card:text-white/70"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="inline-flex items-center px-1 font-label text-[8px] text-white/30">
              +{project.tags.length - 4}
            </span>
          )}
        </div>
      </div>

      <div
        className="h-px w-full origin-left scale-x-0 transition-transform duration-700 group-hover/card:scale-x-100"
        style={{ backgroundColor: accent }}
      />
    </motion.article>
  );
}
