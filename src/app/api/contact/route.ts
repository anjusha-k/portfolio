import { validateContact, type ContactMessage } from "@/lib/contact";

// Server only. The recipient address never reaches the browser.
const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_TO = "anjusha.khandavalli@gmail.com";
// Must be on a domain verified in Resend.
const DEFAULT_FROM = "portfolio@thewanderlustgirldiary.com";

const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1_000;
const hits = new Map<string, { count: number; resetAt: number }>();

/** Best-effort, per-instance spam guard. */
function isRateLimited(key: string, now = Date.now()) {
  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= LIMIT) return true;
  entry.count += 1;
  return false;
}

function clientIp(request: Request) {
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function hasValidOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() || request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>'"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]!,
  );

function emailBody(fields: ContactMessage) {
  const rows: [string, string][] = [
    ["Name", fields.name],
    ["Email", fields.email],
    ["Topic", fields.topic],
  ];

  const htmlRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 16px 8px 0;color:#5a6280;vertical-align:top">${escapeHtml(label)}</td>
          <td style="padding:8px 0;color:#0f1b4d;font-weight:600">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return {
    html: `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#0f1b4d">
        <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#e4572e">New message from your portfolio</p>
        <h1 style="font-size:26px;font-weight:600">${escapeHtml(fields.name)} sent you a message.</h1>
        <table style="width:100%;border-collapse:collapse;margin:24px 0">${htmlRows}</table>
        <div style="padding:24px;border-radius:12px;background:#eef4fb;white-space:pre-wrap;line-height:1.6">${escapeHtml(fields.message)}</div>
        <p style="margin-top:24px;color:#5a6280">Reply to this email to answer ${escapeHtml(fields.name)} directly.</p>
      </div>`,
    text: [
      "New message from your portfolio",
      "",
      ...rows.map(([label, value]) => `${label}: ${value}`),
      "",
      "Message:",
      fields.message,
    ].join("\n"),
  };
}

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > 20_000) {
    return Response.json({ message: "Message is too large." }, { status: 413 });
  }

  if (!hasValidOrigin(request)) {
    return Response.json({ message: "Invalid request origin." }, { status: 403 });
  }

  if (isRateLimited(clientIp(request))) {
    return Response.json(
      { message: "Too many messages. Please try again later." },
      { status: 429 },
    );
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return Response.json({ message: "Invalid message." }, { status: 400 });
  }

  const result = validateContact(input);
  if (!result.success) {
    return Response.json({ message: result.message }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured.");
    return Response.json(
      { message: "Email isn't set up yet. Please try again shortly." },
      { status: 503 },
    );
  }

  const fields = result.data;
  const body = emailBody(fields);
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `Anjusha's portfolio <${process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM}>`,
      to: [process.env.CONTACT_TO_EMAIL || DEFAULT_TO],
      reply_to: fields.email,
      subject: `${fields.topic}: message from ${fields.name}`,
      html: body.html,
      text: body.text,
    }),
  });

  if (!response.ok) {
    console.error("Resend email failed:", response.status, await response.text());
    return Response.json(
      { message: "Your message couldn't be sent. Please try again." },
      { status: 502 },
    );
  }

  return Response.json(
    { message: "Thanks! Your message is on its way to Anjusha." },
    { headers: { "Cache-Control": "no-store" } },
  );
}
