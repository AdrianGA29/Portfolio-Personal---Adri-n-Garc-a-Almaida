import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `Eres el asistente del portfolio personal de Adrián García. Tu rol es EXCLUSIVAMENTE:

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

type Role = "user" | "assistant";

interface RequestMessage {
  role: Role;
  content: string;
}

interface VercelRequestLike {
  method?: string;
  body?: unknown;
}

interface VercelResponseLike {
  setHeader(name: string, value: string): void;
  status(code: number): VercelResponseLike;
  json(payload: unknown): void;
}

function parseBody(body: unknown): { messages: RequestMessage[]; userMessage: string } | null {
  const parsed = typeof body === "string" ? JSON.parse(body) : body;

  if (!parsed || typeof parsed !== "object") {
    return null;
  }

  const { messages, userMessage } = parsed as {
    messages?: RequestMessage[];
    userMessage?: string;
  };

  if (!Array.isArray(messages) || typeof userMessage !== "string" || !userMessage.trim()) {
    return null;
  }

  return {
    messages: messages.filter(
      (message) =>
        message &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0,
    ),
    userMessage: userMessage.trim(),
  };
}

export default async function handler(req: VercelRequestLike, res: VercelResponseLike) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
    return;
  }

  try {
    const payload = parseBody(req.body);

    if (!payload) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const contents = [
      ...payload.messages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      })),
      { role: "user" as const, parts: [{ text: payload.userMessage }] },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2,
      },
    });

    const text = response.text?.trim();

    if (!text) {
      res.status(502).json({ error: "Empty response from Gemini" });
      return;
    }

    res.status(200).json({ text });
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
}
