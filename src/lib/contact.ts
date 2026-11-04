// Shared by the contact form (client) and /api/contact (server).

export const CONTACT_TOPICS = [
  "A role or contract",
  "A project idea",
  "Just saying hello",
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export interface ContactMessage {
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
}

export type ContactValidation =
  | { success: true; data: ContactMessage }
  | { success: false; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export function validateContact(input: unknown, now = Date.now()): ContactValidation {
  if (!input || typeof input !== "object") {
    return { success: false, message: "Please fill in the form." };
  }

  const raw = input as Record<string, unknown>;
  const name = clean(raw.name);
  const email = clean(raw.email).toLowerCase();
  const topic = clean(raw.topic);
  const message = clean(raw.message);
  const startedAt = typeof raw.startedAt === "number" ? raw.startedAt : 0;

  // Hidden field that people never see, so only bots fill it in.
  if (clean(raw.website)) {
    return { success: false, message: "Unable to send this message." };
  }

  // Bots submit instantly; stale tabs should refresh.
  if (startedAt <= 0 || now - startedAt < 2_000 || now - startedAt > 86_400_000) {
    return { success: false, message: "Please refresh the page and try again." };
  }

  if (name.length < 2 || name.length > 80) {
    return { success: false, message: "Please enter your name." };
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  if (!(CONTACT_TOPICS as readonly string[]).includes(topic)) {
    return { success: false, message: "Please choose what your message is about." };
  }

  if (message.length < 10 || message.length > 3_000) {
    return { success: false, message: "Please write between 10 and 3,000 characters." };
  }

  return { success: true, data: { name, email, topic: topic as ContactTopic, message } };
}
