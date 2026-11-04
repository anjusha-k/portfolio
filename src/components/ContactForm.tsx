"use client";

import { useEffect, useRef, useState } from "react";
import { CONTACT_TOPICS } from "@/lib/contact";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; message: string }
  | { kind: "error"; message: string };

/** Sends through /api/contact (Resend), so no email address is shown on the page. */
export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  // When the form appeared; the server rejects instant (bot) submits.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

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

  const sending = status.kind === "sending";

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="contact-form__row">
        <label className="contact-form__field">
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" required minLength={2} maxLength={80} />
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
