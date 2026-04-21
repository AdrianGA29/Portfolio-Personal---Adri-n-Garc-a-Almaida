import { GoogleGenAI } from "@google/genai";

// ── System Prompt ──────────────────────────────────────

export const SYSTEM_PROMPT = `Eres el asistente del portfolio personal de Adrián García. Tu rol es EXCLUSIVAMENTE:

1. Responder preguntas sobre Adrián, su perfil profesional, experiencia y formación
2. Ayudar a navegar por las secciones del portfolio (Inicio, Sobre Mí, Experiencia, Contacto)
3. Facilitar datos de contacto cuando se soliciten

DATOS DE CONTACTO (compartir SOLO cuando se pidan):
- LinkedIn: https://es.linkedin.com/in/adrián-garcia-almaida-a0891738a
- Email: adriangarciafp29@gmail.com
- Teléfono: +34 608 60 85 81

PERFIL PROFESIONAL DE ADRIÁN:
Adrián García es un perfil técnico en evolución constante con base real en informática, soporte, hardware, redes y desarrollo. Actualmente refuerza su camino como desarrollador y amplía su formación en inteligencia artificial con perspectiva práctica y aplicada.

EXPERIENCIA PROFESIONAL:
1. Trainee Developer en Indra (Ciudad Real, 2024-2025): Primera etapa orientada a desarrollo en entorno profesional real. Colaboración en desarrollo y mantenimiento de aplicaciones internas, corrección de incidencias, pruebas y validación.
2. Prácticas en Servicomtel (Toledo, 2022-2023): Gestión de instalaciones de fibra óptica. Planificación, control de estados, coordinación con técnicos y documentación.
3. Prácticas como Auxiliar de informática en Ayuntamiento de Olías del Rey (Toledo, 2020-2021): Soporte a usuarios, instalación de equipos, mantenimiento de red e inventario.

PILARES DE VALOR:
- Visión técnica global: soporte, sistemas, hardware y desarrollo
- Experiencia práctica: incidencias, entornos reales, criterio y adaptación
- IA aplicada: formación en inteligencia artificial con enfoque práctico

SECCIONES DEL PORTFOLIO:
- Inicio (#home): Hero principal con animación 3D
- Sobre Mí (#about): Perfil, narrativa profesional, pilares de valor, skills
- Experiencia (#experience): Trayectoria profesional en 3 etapas
- Contacto (#contact): Formulario de contacto, email y teléfono

REGLAS ESTRICTAS:
- NO respondas preguntas sobre temas ajenos al portfolio o a Adrián
- NO actúes como asistente generalista, de código, o de conocimiento general
- Si te preguntan algo fuera de alcance, redirige con elegancia al portfolio
- Responde siempre en español
- Sé conciso: 1-3 frases máximo por respuesta
- Usa un tono profesional pero cercano
- Cuando tenga sentido, sugiere navegar a una sección con [NAV:section_id:texto_botón]
- Cuando compartas contacto, usa [LINK:url:texto] para hacer links clickables
- Para email usa [LINK:mailto:adriangarciafp29@gmail.com:adriangarciafp29@gmail.com]
- Para teléfono usa [LINK:tel:+34608608581:+34 608 60 85 81]
- Para LinkedIn usa [LINK:https://es.linkedin.com/in/adrián-garcia-almaida-a0891738a:LinkedIn de Adrián]`;

// ── Types ──────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  actions?: ChatAction[];
}

export interface ChatAction {
  type: "navigate" | "link";
  label: string;
  target: string;
}

// ── Parsing ────────────────────────────────────────────

export function parseActions(text: string): { cleanText: string; actions: ChatAction[] } {
  const actions: ChatAction[] = [];
  let cleanText = text;

  // Parse [NAV:section_id:label]
  const navRegex = /\[NAV:([^:]+):([^\]]+)\]/g;
  let match;
  while ((match = navRegex.exec(text)) !== null) {
    actions.push({ type: "navigate", target: match[1], label: match[2] });
    cleanText = cleanText.replace(match[0], "");
  }

  // Parse [LINK:url:label]
  const linkRegex = /\[LINK:([^:]+(?::[^:]*)*?):([^\]]+)\]/g;
  // More robust: split on last colon for label
  const linkRegex2 = /\[LINK:((?:(?!\]).)*):([^\]:]+)\]/g;
  while ((match = linkRegex2.exec(text)) !== null) {
    actions.push({ type: "link", target: match[1], label: match[2] });
    cleanText = cleanText.replace(match[0], "");
  }

  return { cleanText: cleanText.trim(), actions };
}

// ── Navigation ─────────────────────────────────────────

export function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

let aiClient: GoogleGenAI | null = null;
function getAIClient() {
  if (!aiClient) {
    // using Vite define to replace process.env.GEMINI_API_KEY
    if (!process.env.GEMINI_API_KEY) {
       console.warn("GEMINI_API_KEY is missing!");
    }
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  }
  return aiClient;
}

export async function sendMessage(
  messages: ChatMessage[],
  userMessage: string,
): Promise<string> {
  const ai = getAIClient();
  
  // Format history, excluding the very latest user message since we pass it separately
  const historyParts = messages.map(msg => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }]
  }));
  
  // Add current message
  const contents = [
    ...historyParts,
    { role: "user", parts: [{ text: userMessage }]}
  ];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2
      }
    });

    if (response.text) {
      return response.text;
    } else {
      throw new Error("Empty response");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate response.");
  }
}

export function createMessage(role: "user" | "assistant", content: string): ChatMessage {
  const { cleanText, actions } = parseActions(content);
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    content: cleanText,
    timestamp: Date.now(),
    actions: actions.length > 0 ? actions : undefined,
  };
}
