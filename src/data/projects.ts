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

export const categories: { key: ProjectCategory | "all"; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "ai", label: "IA & Chatbots" },
  { key: "web", label: "Web" },
  { key: "tool", label: "Herramientas" },
  { key: "other", label: "Otro" },
];

export const projects: Project[] = [
  {
    id: "rag-chatbot-telefonica",
    title: "RAG Architecture: Telefónica KB",
    subtitle: "Enterprise Knowledge Assistant",
    description:
      "Chatbot corporativo diseñado para la consulta inteligente de bases de conocimiento técnicas con control estricto de alucinaciones.",
    longDescription:
      "Implementación de una arquitectura RAG (Retrieval-Augmented Generation) avanzada para Telefónica Empresas. El sistema permite la consulta de documentación técnica vigente, garantizando respuestas precisas mediante guardarraíles semánticos y verificación de fuentes en tiempo real, optimizando el soporte técnico de nivel 1.",
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
    links: {
      demo: "https://ai.studio/apps/80f45748-e51f-4393-9e5d-0fc6ca4822fb",
    },
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
      "Mi portfolio personal, concebido como una experiencia digital premium. Está desarrollado con React 19 y Three.js, e integra un sistema visual propio, animaciones WebGL, una narrativa editorial y un chatbot conversacional conectado a Gemini mediante una función serverless desplegada en Vercel.",
    category: "web",
    tags: ["React", "Three.js", "TypeScript", "Tailwind", "Gemini", "Vercel"],
    accent: "secondary",
    status: "live",
    featured: true,
    thumbnail: "/projects/portfolio-personal.png",
    preview: {
      type: "image",
      src: "/projects/portfolio-personal.png",
    },
    links: {
      github: "https://github.com/AdrianGA29/Portfolio-Personal---Adri-n-Garc-a-Almaida",
    },
    features: [
      "Animaciones WebGL con shaders TSL",
      "Chatbot IA `adrian.ai` integrado",
      "Dirección visual editorial con hero 3D",
      "Arquitectura frontend en React + Vite + TypeScript",
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
    links: {
      demo: "https://ai.studio/apps/5a63ac5b-0c33-4293-9561-a98bea9268fa",
    },
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
    links: {
      demo: "https://ai.studio/apps/aa56318a-d575-48bf-8b29-0fc8e4e841eb",
    },
    features: [
      "Búsqueda en internet integrada",
      "Arquitectura RAG para base de conocimiento médica",
      "Gestión automatizada de citas de Sanitas Dental",
      "Interfaz intuitiva orientada a pacientes",
    ],
    year: 2025,
  },
  {
    id: "gestoria-json-validator",
    title: "Gestoría JSON Validator",
    subtitle: "Data Contract Validation Tool",
    description:
      "Herramienta de validación de contratos de datos JSON para solicitudes de gestoría administrativa.",
    longDescription:
      "Experimento funcional orientado a validar contratos de datos JSON dentro de flujos de gestoría administrativa. La herramienta está preparada para comprobar estructura, consistencia y reglas de negocio en peticiones, y sirve como base para automatizar tareas repetitivas en una gestoría.",
    category: "tool",
    tags: ["HTML", "CSS", "JavaScript", "JSON Validation", "Automation"],
    accent: "primary",
    status: "wip",
    featured: false,
    thumbnail: "/projects/gestoria-json-validator.png",
    preview: {
      type: "image",
      src: "/projects/gestoria-json-validator.png",
    },
    links: {
      demo: "https://ai.studio/apps/d71e806e-b9be-4abe-9a48-96b18a70a60b",
    },
    features: [
      "Validación de contratos de datos JSON",
      "Detección de estructuras incompletas o sensibles",
      "Base lista para automatización en gestoría administrativa",
      "Interfaz clara para revisión manual y flujos automáticos",
    ],
    year: 2025,
  },
  {
    id: "zalando-auto-incident-pro",
    title: "Zalando: Auto-Incident Pro",
    subtitle: "Smart Delivery Incident Automation",
    description:
      "Automatización inteligente para la gestión de incidencias de entrega con clasificación y enrutamiento en tiempo real.",
    longDescription:
      "Sistema experimental para atención al cliente orientado a incidencias de entrega en Zalando. Automatiza la clasificación inicial, la extracción de entidades relevantes y el enrutamiento operativo, reduciendo tiempos de respuesta y mejorando la consistencia del flujo de resolución.",
    category: "ai",
    tags: ["HTML", "CSS", "JavaScript", "Incident Routing", "Customer Ops"],
    accent: "tertiary",
    status: "wip",
    featured: false,
    thumbnail: "/projects/zalando-auto-incident-pro.png",
    preview: {
      type: "image",
      src: "/projects/zalando-auto-incident-pro.png",
    },
    links: {
      demo: "https://ai.studio/apps/3bbeee70-b34a-4ab3-bb27-f66405c48e62",
    },
    features: [
      "Clasificación de incidencias en tiempo real",
      "Extracción automática de entidades operativas",
      "Enrutamiento inteligente para atención al cliente",
      "Diseño enfocado en operaciones y métricas",
    ],
    year: 2025,
  },
];
