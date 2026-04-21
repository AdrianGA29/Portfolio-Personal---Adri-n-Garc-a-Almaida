import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import type { Project } from "@/src/data/projects";
import { ProjectPreview } from "./ProjectPreview";
import { ProjectCodeSnippet } from "./ProjectCodeSnippet";

type Tab = "overview" | "preview" | "code";

const accentHex: Record<string, string> = {
  primary: "#39FF14",
  secondary: "#00eefc",
  tertiary: "#ac89ff",
};

interface ProjectOverlayProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectOverlay({ project, onClose }: ProjectOverlayProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  useEffect(() => {
    setActiveTab("overview");
  }, [project?.id]);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [project]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const tabs: { key: Tab; label: string; show: boolean }[] = [
    { key: "overview", label: "Overview", show: true },
    { key: "preview", label: "Preview", show: !!project?.preview },
    { key: "code", label: "Código", show: !!(project?.codeSnippets && project.codeSnippets.length > 0) },
  ];

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="overlay-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/92 backdrop-blur-xl"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12"
          >
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={onClose}
                className="group/back inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 transition-all hover:bg-white/5 hover:text-white"
              >
                <span className="transition-transform duration-200 group-hover/back:-translate-x-1">←</span>
                Volver
              </button>

              <div className="flex gap-1 rounded-full border border-white/8 bg-white/[0.02] p-1">
                {tabs.filter((t) => t.show).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative rounded-full px-4 py-1.5 font-label text-[9px] font-bold uppercase tracking-[0.2em] transition-colors ${
                      activeTab === tab.key ? "text-white" : "text-white/40 hover:text-white/60"
                    }`}
                  >
                    {activeTab === tab.key && (
                      <motion.span
                        layoutId="overlay-tab"
                        className="absolute inset-0 rounded-full border border-white/10 bg-white/10"
                        transition={{ type: "spring", damping: 25, stiffness: 350 }}
                      />
                    )}
                    <span className="relative">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p
                className="mb-2 font-label text-[10px] font-bold uppercase tracking-[0.28em]"
                style={{ color: accentHex[project.accent] }}
              >
                {project.subtitle} · {project.year}
              </p>
              <h2 className="text-3xl font-black tracking-tight text-on-surface sm:text-4xl md:text-5xl">
                {project.title}
              </h2>
              <motion.div
                className="mt-4 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "overview" && <OverviewTab key="overview" project={project} />}

              {activeTab === "preview" && project.preview && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProjectPreview
                    src={project.preview.src}
                    title={project.title}
                    type={project.preview.type}
                  />
                </motion.div>
              )}

              {activeTab === "code" && project.codeSnippets && (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {project.codeSnippets.map((snippet) => (
                    <ProjectCodeSnippet key={snippet.filename} {...snippet} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function OverviewTab({ project }: { project: Project }) {
  const accent = accentHex[project.accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      <div
        className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/8"
        style={{
          background: `linear-gradient(135deg, ${accent}06 0%, ${accent}12 50%, ${accent}04 100%)`,
        }}
      >
        {project.thumbnail && (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        )}

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(${accent}40 1px, transparent 1px), linear-gradient(90deg, ${accent}40 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-headline text-[10rem] font-black leading-none opacity-[0.03]"
            style={{ color: accent }}
          >
            {project.title.charAt(0)}
          </span>
        </div>
      </div>

      <div className="max-w-3xl">
        <p className="text-base leading-relaxed text-on-surface-variant">{project.longDescription}</p>
      </div>

      <div>
        <p className="mb-4 font-label text-[10px] font-bold uppercase tracking-[0.28em] text-on-surface-variant">
          Stack tecnológico
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 font-label text-[9px] font-bold uppercase tracking-[0.2em] text-white/70"
            >
              <span className="h-1 w-1 rounded-full" style={{ backgroundColor: accent }} />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {project.features && project.features.length > 0 && (
        <div>
          <p className="mb-4 font-label text-[10px] font-bold uppercase tracking-[0.28em] text-on-surface-variant">
            Características
          </p>
          <ul className="space-y-3">
            {project.features.map((feature, i) => (
              <motion.li
                key={feature}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="flex items-start gap-3 text-sm text-on-surface/90"
              >
                <span
                  className="mt-1.5 h-4 w-[3px] shrink-0 rounded-full"
                  style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}50` }}
                />
                {feature}
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {project.links && (
        <div className="flex flex-wrap gap-3">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/12 px-5 py-2.5 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 transition-all hover:border-white/24 hover:text-white"
            >
              GitHub ↗
            </a>
          )}
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 font-label text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:border-white/24"
              style={{ borderColor: `${accent}30`, color: accent }}
            >
              Demo en vivo ↗
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}
