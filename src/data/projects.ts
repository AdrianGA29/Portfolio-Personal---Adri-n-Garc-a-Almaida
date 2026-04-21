// ── Types ────────────────────────────────────────────────

export type ProjectCategory = "web" | "tool" | "ai" | "other";
export type ProjectStatus = "live" | "wip" | "archived";

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  category: ProjectCategory;
  tags: string[];
  accent: "primary" | "secondary" | "tertiary";
  status: ProjectStatus;
  featured: boolean;
  thumbnail?: string;
  links?: {
    github?: string;
    demo?: string;
    external?: string;
  };
  preview?: {
    type: "iframe" | "component" | "image";
    src: string;
  };
  codeSnippets?: {
    filename: string;
    language: string;
    code: string;
  }[];
  features?: string[];
  year: number;
}

// ── Project Categories ───────────────────────────────────

export const categories: { key: ProjectCategory | "all"; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "ai", label: "IA & Chatbots" },
  { key: "web", label: "Web" },
  { key: "tool", label: "Herramientas" },
  { key: "other", label: "Otro" },
];

// ── Projects Data ────────────────────────────────────────

export const projects: Project[] = [
  {
    id: "rag-chatbot-telefonica",
    title: "RAG Architecture: Telefónica KB",
    subtitle: "Enterprise Knowledge Assistant",
    description:
      "Chatbot corporativo diseñado para la consulta inteligente de bases de conocimiento técnicas con control estricto de alucinaciones.",
    longDescription:
      "Implementación de una arquitectura RAG (Retrieval-Augmented Generation) avanzada para Telefónica Empresas. El sistema permite la consulta de documentación técnica vigente, garantizando respuestas precisas mediante el uso de guardarraíles semánticos y verificación de fuentes en tiempo real, optimizando el soporte técnico nivel 1.",
    category: "ai",
    tags: ["RAG", "Gemini API", "Vector Search", "Enterprise AI"],
    accent: "primary",
    status: "live",
    featured: false,
    thumbnail: "/projects/rag-chatbot.png",
    preview: {
      type: "image",
      src: "/projects/rag-chatbot.png",
    },
    links: { demo: "https://ai.studio/apps/80f45748-e51f-4393-9e5d-0fc6ca4822fb" },
    features: [
      "Arquitectura RAG (Retrieval-Augmented Generation)",
      "Control estricto de alucinaciones mediante guardarraíles",
      "Consulta de documentación técnica en tiempo real",
      "Interfaz corporativa personalizada para Telefónica KB",
    ],
    year: 2025,
  },
  {
    id: "portfolio-personal",
    title: "Portfolio Personal Premium",
    subtitle: "React + Three.js + Motion",
    description:
      "Portfolio inmersivo con animaciones WebGL, motion design de alto nivel y chatbot IA integrado.",
    longDescription:
      "Mi portfolio personal, concebido como una experiencia digital premium. Desarrollado con React 19 y Three.js, implementa un sistema de diseño propio basado en motion design editorial, bento grids inteligentes y una integración nativa de IA conversacional.",
    category: "web",
    tags: ["React", "Three.js", "TypeScript", "Tailwind", "Gemini"],
    accent: "secondary",
    status: "live",
    featured: true,
    links: { github: "#" },
    features: [
      "Animaciones WebGL con shaders TSL",
      "Chatbot IA 'Adrian.ai' integrado",
      "Layout editorial cinematic",
      "Bento Grid interactivo en sección About",
    ],
    year: 2025,
  },
  {
    id: "correos-express-chatbot",
    title: "Logística IA: Correos Express",
    subtitle: "Automated Return Management",
    description:
      "Chatbot especializado en la gestión de devoluciones, siguiendo flujos de diseño conversacional validados.",
    longDescription:
      "Asistente virtual enfocado en la automatización del proceso de logística inversa para Correos Express. Utiliza la API de Gemini con guardarraíles específicos para guiar al usuario a través del flujo de devoluciones, reduciendo la carga operativa del soporte humano.",
    category: "ai",
    tags: ["Conversational UX", "Gemini API", "Logistics", "Guardrails"],
    accent: "secondary",
    status: "wip",
    featured: false,
    thumbnail: "/projects/correos-chatbot.png",
    preview: {
      type: "image",
      src: "/projects/correos-chatbot.png",
    },
    links: { demo: "https://ai.studio/apps/5a63ac5b-0c33-4293-9561-a98bea9268fa" },
    features: [
      "Flujo de diseño conversacional optimizado",
      "Integración con API de Gemini",
      "Sistema de gestión de devoluciones automatizado",
      "Control de contexto y guardarraíles operativos",
    ],
    year: 2025,
  },
  {
    id: "asistente-virtual-sanitas",
    title: "HealthTech: Mi Sanitas Virtual",
    subtitle: "Smart Healthcare Assistant",
    description:
      "Asistente inteligente para la gestión de citas y consultas frecuentes con arquitectura RAG y búsqueda en internet.",
    longDescription:
      "Diseño experimental de un asistente virtual para Mi Sanitas y Sanitas Dental. El sistema combina búsqueda en internet en tiempo real con una arquitectura RAG para ofrecer información actualizada sobre servicios médicos y gestión autónoma de citas.",
    category: "ai",
    tags: ["Healthcare AI", "Internet Search", "RAG", "UX Design"],
    accent: "tertiary",
    status: "wip",
    featured: false,
    thumbnail: "/projects/sanitas-chatbot.png",
    preview: {
      type: "image",
      src: "/projects/sanitas-chatbot.png",
    },
    links: { demo: "https://ai.studio/apps/aa56318a-d575-48bf-8b29-0fc8e4e841eb" },
    features: [
      "Búsqueda en internet integrada (Search capability)",
      "Arquitectura RAG para base de conocimiento médica",
      "Gestión automatizada de citas de Sanitas Dental",
      "Interfaz intuitiva orientada a pacientes",
    ],
    year: 2025,
  },
];
