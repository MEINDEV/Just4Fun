const { EmailClient } = require("@azure/communication-email");
const { DefaultAzureCredential } = require("@azure/identity");
const { app } = require("@azure/functions");

// ─── Config ───────────────────────────────────────────────────────────────────
const EMAIL_ENDPOINT = process.env.EMAIL_ENDPOINT;
const SENDER_ADDRESS = process.env.EMAIL_SENDER_ADDRESS;

if (!EMAIL_ENDPOINT) throw new Error("Missing env var: EMAIL_ENDPOINT");
if (!SENDER_ADDRESS) throw new Error("Missing env var: EMAIL_SENDER_ADDRESS");

// ─── ACS Client (singleton — reused across warm invocations) ──────────────────
const credential = new DefaultAzureCredential();
const client = new EmailClient(EMAIL_ENDPOINT, credential);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Basic email format check */
const isValidEmail = (email) =>
  typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

/** Escape HTML to prevent injection in the template */
const esc = (str) =>
  String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Structured JSON response helper */
const respond = (status, body) => ({
  status,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

// ─── Email Template ───────────────────────────────────────────────────────────

/**
 * Generates the HTML + plain-text content for the confirmation email
 * sent to the customer.
 */
function buildEmailContent({ name, phone, company, service, office, subject, message }) {
  const safeName    = esc(name);
  const safePhone   = esc(phone);
  const safeCompany = esc(company);
  const safeService = esc(service);
  const safeOffice  = esc(office);
  const safeSubject = esc(subject);
  const safeMessage = esc(message);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>We received your message</title>
  <style>
    body { margin: 0; padding: 0; background: #f5f6fa; font-family: 'Segoe UI', Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 10px;
               box-shadow: 0 4px 20px rgba(0,0,0,0.07); overflow: hidden; }
    .header { background: #3b82f6; padding: 32px 40px; }
    .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; }
    .header p  { margin: 6px 0 0; color: #bfdbfe; font-size: 14px; }
    .body { padding: 32px 40px; }
    .greeting { font-size: 16px; color: #111827; margin-bottom: 20px; }
    .intro { font-size: 14px; color: #4b5563; line-height: 1.6; margin-bottom: 28px; }
    .summary { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;
               padding: 20px 24px; margin-bottom: 28px; }
    .summary h3 { margin: 0 0 16px; font-size: 13px; font-weight: 700;
                  text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
    .row { display: flex; gap: 8px; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .row:last-child { border-bottom: none; }
    .row .key   { width: 130px; flex-shrink: 0; font-size: 13px; font-weight: 600; color: #374151; }
    .row .value { font-size: 13px; color: #4b5563; word-break: break-word; }
    .message-box { background: #f9fafb; border-left: 3px solid #3b82f6; border-radius: 4px;
                   padding: 14px 18px; font-size: 14px; color: #374151; line-height: 1.6;
                   white-space: pre-wrap; margin-bottom: 28px; }
    .note { font-size: 13px; color: #6b7280; line-height: 1.6; }
    .footer { background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 20px 40px;
              text-align: center; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Thank you for reaching out</h1>
      <p>We've received your message and will get back to you shortly.</p>
    </div>
    <div class="body">
      <p class="greeting">Hi ${safeName},</p>
      <p class="intro">
        Thanks for contacting us. Here's a summary of the information you submitted.
        A member of our team will follow up with you as soon as possible.
      </p>

      <div class="summary">
        <h3>Submission Details</h3>
        ${safePhone   ? `<div class="row"><span class="key">Phone</span><span class="value">${safePhone}</span></div>` : ""}
        ${safeCompany ? `<div class="row"><span class="key">Company</span><span class="value">${safeCompany}</span></div>` : ""}
        ${safeService ? `<div class="row"><span class="key">Service</span><span class="value">${safeService}</span></div>` : ""}
        ${safeOffice  ? `<div class="row"><span class="key">Preferred Office</span><span class="value">${safeOffice}</span></div>` : ""}
        ${safeSubject ? `<div class="row"><span class="key">Subject</span><span class="value">${safeSubject}</span></div>` : ""}
      </div>

      ${safeMessage ? `
      <p style="font-size:13px;font-weight:700;color:#374151;margin-bottom:8px;">Your Message</p>
      <div class="message-box">${safeMessage}</div>
      ` : ""}

      <p class="note">
        If you didn't submit this form or believe this email was sent in error,
        please disregard it or contact our support team.
      </p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Your Company Name. All rights reserved.
    </div>
  </div>
</body>
</html>`;

  const plainText = `Hi ${name},

Thank you for contacting us. We've received your message and will be in touch shortly.

── Submission Details ──────────────────
${phone    ? `Phone:            ${phone}\n` : ""}${company  ? `Company:          ${company}\n` : ""}${service  ? `Service:          ${service}\n` : ""}${office   ? `Preferred Office: ${office}\n` : ""}${subject  ? `Subject:          ${subject}\n` : ""}
${message  ? `Your Message:\n${message}\n` : ""}
────────────────────────────────────────

If you didn't submit this form, please disregard this email.

© ${new Date().getFullYear()} Your Company Name`;

  return { html, plainText };
}

// ─── Azure Function ───────────────────────────────────────────────────────────

app.http("handleEmail", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const invocationId = context.invocationId;
    context.log(`[${invocationId}] Incoming POST ${request.url}`);

    // ── 1. Parse body ──────────────────────────────────────────────────────────
    let customer;
    try {
      customer = await request.json();
    } catch {
      context.warn(`[${invocationId}] Failed to parse JSON body`);
      return respond(400, { error: "Request body must be valid JSON." });
    }

    // ── 2. Validate required fields ────────────────────────────────────────────
    const {
      fullName: name = "",
      email = "",
      phone = "",
      company = "",
      service = "",
      office = "",
      subject = "",
      message = "",
    } = customer;

    if (!name.trim()) {
      return respond(400, { error: "Field 'fullName' is required." });
    }
    if (!isValidEmail(email)) {
      return respond(400, { error: "Field 'email' is missing or invalid." });
    }

    const recipientEmail = email.trim();
    const recipientName  = name.trim();

    context.log(`[${invocationId}] Sending confirmation to: ${recipientEmail}`);

    // ── 3. Build email ─────────────────────────────────────────────────────────
    const { html, plainText } = buildEmailContent({
      name: recipientName,
      phone,
      company,
      service,
      office,
      subject,
      message,
    });

    const emailMessage = {
      senderAddress: SENDER_ADDRESS,
      content: {
        subject: "We've received your message",
        plainText,
        html,
      },
      recipients: {
        to: [{ address: recipientEmail, displayName: recipientName }],
      },
    };

    // ── 4. Send via Azure Communication Services ───────────────────────────────
    try {
      const poller = await client.beginSend(emailMessage);
      const result = await poller.pollUntilDone();

      context.log(`[${invocationId}] Email sent — messageId: ${result.id}, status: ${result.status}`);

      return respond(200, {
        success: true,
        message: "Email sent successfully.",
        messageId: result.id,
      });
    } catch (err) {
      context.error(`[${invocationId}] ACS send failed:`, err);

      // Surface throttling specifically so callers can retry
      if (err.statusCode === 429) {
        return respond(429, { error: "Email service rate limit reached. Please retry shortly." });
      }

      return respond(502, { error: "Failed to send email. Please try again later." });
    }
  },
});
