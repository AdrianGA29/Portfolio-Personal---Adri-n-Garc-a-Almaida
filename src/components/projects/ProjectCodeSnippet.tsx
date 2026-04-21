interface ProjectCodeSnippetProps {
  filename: string;
  language: string;
  code: string;
}

export function ProjectCodeSnippet({ filename, code }: ProjectCodeSnippetProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/8 bg-black/40">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]/70" />
          </div>
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-white/40">
            {filename}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="rounded px-2.5 py-1 font-label text-[9px] font-bold uppercase tracking-[0.18em] text-white/30 transition-all hover:bg-white/5 hover:text-white/60"
        >
          Copiar
        </button>
      </div>
      {/* Code */}
      <pre className="overflow-x-auto p-5 text-[12px] leading-relaxed text-white/70">
        <code>{code}</code>
      </pre>
    </div>
  );
}
