import { motion, useScroll, useTransform, useReducedMotion, LayoutGroup } from "motion/react";
import { useRef, useState, useMemo, useCallback } from "react";
import { projects, categories, type ProjectCategory, type Project } from "@/src/data/projects";
import { ProjectFeatured } from "./ProjectFeatured";
import { ProjectCard } from "./ProjectCard";
import { ProjectFilters } from "./ProjectFilters";
import { ProjectOverlay } from "./ProjectOverlay";

export default function Projects() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | "all">("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const glowY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [30, -30]);
  const glow2Y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-20, 40]);

  const featuredProject = useMemo(() => projects.find((p) => p.featured), []);

  const filteredProjects = useMemo(() => {
    const nonFeatured = projects.filter((p) => !p.featured);
    if (activeFilter === "all") return nonFeatured;
    return nonFeatured.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  const handleClose = useCallback(() => setSelectedProject(null), []);

  return (
    <>
      <section
        ref={sectionRef}
        id="projects"
        className="relative overflow-hidden bg-surface px-6 py-32"
        style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1400px" }}
      >
        {/* ── Ambient Glow ── */}
        <div className="pointer-events-none absolute inset-0">
          <motion.div style={{ y: glowY }} className="absolute -right-[10%] top-20 h-[26rem] w-[26rem] rounded-full bg-primary/6 blur-[150px]" />
          <motion.div style={{ y: glow2Y }} className="absolute -left-[8%] bottom-20 h-80 w-80 rounded-full bg-tertiary/6 blur-[130px]" />
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
            className="mb-16"
          >
            <div className="mb-5 inline-flex items-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-tertiary to-transparent" />
              <span className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-tertiary">
                Showcase
              </span>
            </div>

            <h2 className="mb-6 max-w-4xl text-balance text-5xl font-black leading-none tracking-tighter text-on-surface md:text-7xl">
              Proyectos con intención,{" "}
              <span className="gradient-text-animate">criterio</span> y ejecución
            </h2>

            <p className="max-w-2xl text-pretty text-sm leading-relaxed text-on-surface-variant">
              Cada proyecto refleja una etapa, un reto técnico o una exploración con propósito.
              No son ejercicios aislados: son piezas que demuestran evolución, criterio y capacidad
              de ejecución real.
            </p>
          </motion.header>

          {/* ── Expanding divider ── */}
          <motion.div
            className="mb-14 h-px w-full bg-gradient-to-r from-transparent via-white/16 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* ═══════════════════════════════════════════
              FEATURED PROJECT
          ═══════════════════════════════════════════ */}
          {featuredProject && (
            <ProjectFeatured
              project={featuredProject}
              onClick={() => setSelectedProject(featuredProject)}
            />
          )}

          {/* ═══════════════════════════════════════════
              FILTERS + GRID
          ═══════════════════════════════════════════ */}
          <LayoutGroup>
            <ProjectFilters
              active={activeFilter}
              onChange={setActiveFilter}
              categories={categories}
            />

            <motion.div
              layout
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredProjects.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </motion.div>

            {/* Empty state */}
            {filteredProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <p className="font-label text-[10px] uppercase tracking-[0.24em] text-on-surface-variant">
                  No hay proyectos en esta categoría todavía
                </p>
              </motion.div>
            )}
          </LayoutGroup>

          {/* ═══════════════════════════════════════════
              CLOSING CTA
          ═══════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20"
          >
            <motion.div
              className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.28em] text-tertiary">
                En evolución
              </p>
              <p className="max-w-lg text-sm text-on-surface-variant">
                Más proyectos en desarrollo. Cada uno refleja un paso adelante en técnica,
                criterio y nivel de exigencia.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Project Overlay (portal-level, above everything) ── */}
      <ProjectOverlay project={selectedProject} onClose={handleClose} />
    </>
  );
}
