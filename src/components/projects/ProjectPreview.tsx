import { useState } from "react";

interface ProjectPreviewProps {
  src: string;
  title: string;
  type?: "iframe" | "component" | "image";
}

export function ProjectPreview({ src, title, type = "iframe" }: ProjectPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setImageError(false);
    const iframe = document.getElementById("project-preview-iframe") as HTMLIFrameElement;
    if (iframe) {
      iframe.src = src;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.02] px-4 py-2">
        <span className="font-label text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
          Preview en vivo
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="rounded px-3 py-1 font-label text-[9px] font-bold uppercase tracking-[0.18em] text-white/40 transition-all hover:bg-white/5 hover:text-white/70"
          >
            ↻ Refresh
          </button>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded px-3 py-1 font-label text-[9px] font-bold uppercase tracking-[0.18em] text-white/40 transition-all hover:bg-white/5 hover:text-white/70"
          >
            ↗ Abrir
          </a>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-white/10">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80">
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/60"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {type === "image" && !imageError ? (
          <img
            src={src}
            alt={`Preview de ${title}`}
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setImageError(true);
              setIsLoading(false);
            }}
            className="h-[400px] w-full object-contain bg-[#050505] p-4 sm:h-[500px]"
          />
        ) : type === "image" ? (
          <div className="flex h-[400px] w-full items-center justify-center bg-[#050505] p-6 text-center sm:h-[500px]">
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
              No se pudo cargar la imagen de preview
            </p>
          </div>
        ) : (
          <iframe
            id="project-preview-iframe"
            src={src}
            title={`Preview de ${title}`}
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            className="h-[400px] w-full bg-black sm:h-[500px]"
          />
        )}

        <div className="pointer-events-none absolute inset-0 rounded-xl border border-primary/10" />
      </div>
    </div>
  );
}
