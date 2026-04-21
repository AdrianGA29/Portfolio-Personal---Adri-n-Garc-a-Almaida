import { motion } from "motion/react";
import type { Project } from "@/src/data/projects";

const accentHex: Record<string, string> = {
  primary: "#39FF14",
  secondary: "#00eefc",
  tertiary: "#ac89ff",
};

interface ProjectFeaturedProps {
  project: Project;
  onClick: () => void;
}

export function ProjectFeatured({ project, onClick }: ProjectFeaturedProps) {
  const accent = accentHex[project.accent];

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="group/feat relative mb-14 cursor-pointer overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] transition-all duration-500 hover:border-white/16"
    >
      <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative aspect-[16/10] w-full overflow-hidden lg:aspect-auto lg:min-h-[340px]">
          {project.thumbnail && (
            <img
              src={project.thumbnail}
              alt={project.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover/feat:scale-[1.05]"
              loading="lazy"
            />
          )}

          <div
            className="absolute inset-0 transition-transform duration-1000 ease-out group-hover/feat:scale-[1.05]"
            style={{
              background: project.thumbnail
                ? "linear-gradient(135deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.32) 100%)"
                : `linear-gradient(135deg, ${accent}06 0%, ${accent}15 40%, ${accent}08 100%)`,
            }}
          />

          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(${accent}50 1px, transparent 1px), linear-gradient(90deg, ${accent}50 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />

          <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover/feat:opacity-100">
            <div className="scan-line absolute inset-0" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-headline text-[8rem] font-black leading-none opacity-[0.04] transition-opacity duration-700 group-hover/feat:opacity-[0.08] md:text-[12rem]"
              style={{ color: accent }}
            >
              {project.title.charAt(0)}
            </span>
          </div>

          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="font-label text-[9px] font-bold uppercase tracking-[0.24em] text-primary">
              Destacado
            </span>
          </div>
        </div>

        <div className="relative flex flex-col justify-center p-8 lg:p-10">
          <div
            className="absolute left-0 top-8 hidden h-20 w-[3px] origin-top rounded-full opacity-0 transition-all duration-700 group-hover/feat:opacity-100 lg:block"
            style={{
              backgroundColor: accent,
              boxShadow: `0 0 12px ${accent}60`,
            }}
          />

          <p className="mb-3 font-label text-[10px] font-bold uppercase tracking-[0.28em] text-on-surface-variant">
            {project.subtitle}
          </p>

          <h3 className="mb-4 text-2xl font-black tracking-tight text-on-surface md:text-3xl">
            {project.title}
          </h3>

          <p className="mb-6 max-w-lg text-sm leading-relaxed text-on-surface-variant/80">
            {project.description}
          </p>

          <div className="mb-8 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 font-label text-[9px] font-bold uppercase tracking-[0.18em] text-white/60 transition-all duration-300 group-hover/feat:text-white/80"
              >
                <span className="h-1 w-1 rounded-full" style={{ backgroundColor: accent }} />
                {tag}
              </span>
            ))}
          </div>

          <motion.div
            className="inline-flex items-center gap-2 self-start rounded-lg border border-white/12 px-5 py-2.5 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 transition-all duration-300 group-hover/feat:border-white/24 group-hover/feat:text-white"
            whileHover={{ x: 4 }}
          >
            Explorar proyecto
            <span className="text-xs transition-transform duration-300 group-hover/feat:translate-x-1">
              →
            </span>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}
