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

export function parseActions(text: string): { cleanText: string; actions: ChatAction[] } {
  const actions: ChatAction[] = [];
  let cleanText = text;

  const navRegex = /\[NAV:([^:]+):([^\]]+)\]/g;
  let match: RegExpExecArray | null;

  while ((match = navRegex.exec(text)) !== null) {
    actions.push({ type: "navigate", target: match[1], label: match[2] });
    cleanText = cleanText.replace(match[0], "");
  }

  const linkRegex = /\[LINK:((?:(?!\]).)*):([^\]:]+)\]/g;

  while ((match = linkRegex.exec(text)) !== null) {
    actions.push({ type: "link", target: match[1], label: match[2] });
    cleanText = cleanText.replace(match[0], "");
  }

  return { cleanText: cleanText.trim(), actions };
}

export function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export async function sendMessage(
  messages: ChatMessage[],
  userMessage: string,
): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: messages.map(({ role, content }) => ({ role, content })),
      userMessage,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate response.");
  }

  const data = (await response.json()) as { text?: string };

  if (!data.text) {
    throw new Error("Empty response");
  }

  return data.text;
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
