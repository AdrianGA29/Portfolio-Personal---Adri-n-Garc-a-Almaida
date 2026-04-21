import { motion } from "motion/react";
import type { ProjectCategory } from "@/src/data/projects";

interface ProjectFiltersProps {
  active: ProjectCategory | "all";
  onChange: (cat: ProjectCategory | "all") => void;
  categories: { key: ProjectCategory | "all"; label: string }[];
}

export function ProjectFilters({ active, onChange, categories }: ProjectFiltersProps) {
  return (
    <div className="relative mb-12 flex flex-wrap gap-1 rounded-full border border-white/8 bg-white/[0.02] p-1">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onChange(cat.key)}
          className={`relative z-10 rounded-full px-5 py-2 font-label text-[10px] font-bold uppercase tracking-[0.22em] transition-colors duration-300 ${
            active === cat.key
              ? "text-white"
              : "text-white/40 hover:text-white/70"
          }`}
        >
          {/* Animated background pill */}
          {active === cat.key && (
            <motion.span
              layoutId="filter-pill"
              className="absolute inset-0 rounded-full bg-white/10 border border-white/10"
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
            />
          )}
          <span className="relative">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
