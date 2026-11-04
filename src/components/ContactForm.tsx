"use client";

import { useEffect, useRef, useState } from "react";
import { CONTACT_TOPICS } from "@/lib/contact";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; message: string }
  | { kind: "error"; message: string };

/**
 * A "Send me a message" button that opens the form. Sends through
 * /api/contact (Resend), so no email address is shown on the page.
 * Any link to #contact (e.g. "Work with me") opens it too.
 */
export function ContactForm() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  // When the form was opened; the server rejects instant (bot) submits.
  const startedAt = useRef(0);
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const openFromLink = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href$='#contact']");
      if (link) setOpen(true);
    };
    // Arriving from another page via /#contact: open after first paint.
    const frame =
      window.location.hash === "#contact" ? requestAnimationFrame(() => setOpen(true)) : 0;
    document.addEventListener("click", openFromLink);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", openFromLink);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    startedAt.current = Date.now();
    firstField.current?.focus({ preventScroll: true });
  }, [open]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus({ kind: "sending" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, startedAt: startedAt.current }),
      });
      const json = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) {
        setStatus({ kind: "error", message: json.message || "Something went wrong. Please try again." });
        return;
      }
      form.reset();
      setStatus({ kind: "sent", message: json.message || "Thanks! Your message has been sent." });
    } catch {
      setStatus({ kind: "error", message: "Couldn't reach the server. Please try again." });
    }
  }

  if (status.kind === "sent") {
    return (
      <p className="contact-form__done" role="status">
        {status.message}
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        className="button contact-form__open"
        aria-expanded={false}
        aria-controls="contact-form"
        onClick={() => setOpen(true)}
      >
        <span>Send me a message</span>
      </button>
    );
  }

  const sending = status.kind === "sending";

  return (
    <form id="contact-form" className="contact-form" onSubmit={onSubmit}>
      <div className="contact-form__row">
        <label className="contact-form__field">
          <span>Name</span>
          <input ref={firstField} name="name" type="text" autoComplete="name" required minLength={2} maxLength={80} />
        </label>
        <label className="contact-form__field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required maxLength={254} />
        </label>
      </div>
      <label className="contact-form__field">
        <span>What&rsquo;s it about?</span>
        <select name="topic" required defaultValue={CONTACT_TOPICS[0]}>
          {CONTACT_TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="contact-form__field">
        <span>Message</span>
        <textarea name="message" rows={5} required minLength={10} maxLength={3000} />
      </label>
      {/* Hidden from people; bots fill it in. */}
      <label className="u-vhide" aria-hidden="true">
        Website
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <button type="submit" className="button" disabled={sending}>
        <span>{sending ? "Sending…" : "Send message"}</span>
      </button>
      <p className="contact-form__status" role="status" aria-live="polite">
        {status.kind === "error" ? status.message : ""}
      </p>
    </form>
  );
}
