import { siteConfig } from "@/lib/site";
import { sendTransactionalEmail } from "@/lib/email";

type Recipient = {
  email: string;
  firstName: string;
};

function formatDate(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getFirstName(fullName?: string | null, fallbackEmail?: string | null) {
  const candidate = fullName?.trim() || fallbackEmail?.split("@")[0]?.trim() || "there";
  return candidate.split(/\s+/)[0] || "there";
}

async function resolveRecipient(
  userId: string | null,
  fallbackEmail?: string | null,
  fallbackName?: string | null,
) {
  if (userId) {
    try {
      const { clerkClient } = await import("@clerk/nextjs/server");
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const email = user.primaryEmailAddress?.emailAddress || fallbackEmail;

      if (email) {
        return {
          email,
          firstName: getFirstName(user.firstName || user.fullName, email),
        } satisfies Recipient;
      }
    } catch {
      // Fall back to webhook-provided customer details.
    }
  }

  if (!fallbackEmail) {
    return null;
  }

  return {
    email: fallbackEmail,
    firstName: getFirstName(fallbackName, fallbackEmail),
  } satisfies Recipient;
}

function buildEmailShell(preview: string, title: string, body: string, ctaLabel: string) {
  const dashboardUrl = `${siteConfig.domain}/dashboard`;

  return {
    html: `
      <div style="background:#081522;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#f8fafc;">
        <div style="max-width:560px;margin:0 auto;background:#102032;border:1px solid #243447;border-radius:24px;padding:32px;">
          <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preview)}</div>
          <p style="margin:0 0 12px;color:#8dd8ef;font-size:12px;letter-spacing:0.28em;text-transform:uppercase;">Skies Ready</p>
          <h1 style="margin:0 0 16px;font-size:32px;line-height:1.1;color:#f8fafc;">${escapeHtml(title)}</h1>
          ${body}
          <p style="margin:28px 0 0;">
            <a href="${dashboardUrl}" style="display:inline-block;background:#21c8ea;color:#081522;text-decoration:none;font-weight:700;padding:14px 20px;border-radius:999px;">
              ${escapeHtml(ctaLabel)}
            </a>
          </p>
          <p style="margin:24px 0 0;color:#c8d4e3;font-size:14px;line-height:1.6;">
            Need help? Reply to this email or contact ${escapeHtml(siteConfig.supportEmail)}.
          </p>
        </div>
      </div>
    `,
    text: `${title}\n\n${preview}\n\nOpen your dashboard: ${dashboardUrl}\n\nNeed help? Contact ${siteConfig.supportEmail}.`,
  };
}

export async function sendProStartedEmail(input: {
  userId: string | null;
  email?: string | null;
  name?: string | null;
  idempotencyKey: string;
}) {
  const recipient = await resolveRecipient(input.userId, input.email, input.name);

  if (!recipient) {
    return;
  }

  const preview = `${recipient.firstName}, your Skies Ready Pro access is live.`;
  const title = "Your Pro plan is live";
  const body = `
    <p style="margin:0 0 16px;color:#e2e8f0;font-size:16px;line-height:1.7;">
      Hi ${escapeHtml(recipient.firstName)}, your Skies Ready Pro subscription has started successfully.
    </p>
    <p style="margin:0;color:#c8d4e3;font-size:16px;line-height:1.7;">
      You can now use paid launch features from your account dashboard, including Pro billing management and your saved launch setup.
    </p>
  `;

  const message = buildEmailShell(preview, title, body, "Open dashboard");
  await sendTransactionalEmail({
    to: recipient.email,
    subject: "Skies Ready Pro started",
    html: message.html,
    text: message.text,
    idempotencyKey: input.idempotencyKey,
  });
}

export async function sendProCancellationScheduledEmail(input: {
  userId: string | null;
  email?: string | null;
  name?: string | null;
  cancelAt: string | null;
  idempotencyKey: string;
}) {
  const recipient = await resolveRecipient(input.userId, input.email, input.name);

  if (!recipient) {
    return;
  }

  const cancelDate = formatDate(input.cancelAt);
  const preview = cancelDate
    ? `Your Pro plan is scheduled to end on ${cancelDate}.`
    : "Your Pro cancellation has been scheduled.";
  const title = "Your Pro cancellation is scheduled";
  const body = `
    <p style="margin:0 0 16px;color:#e2e8f0;font-size:16px;line-height:1.7;">
      Hi ${escapeHtml(recipient.firstName)}, we received your request to cancel Skies Ready Pro.
    </p>
    <p style="margin:0;color:#c8d4e3;font-size:16px;line-height:1.7;">
      ${cancelDate ? `Your access is scheduled to end on <strong>${escapeHtml(cancelDate)}</strong>.` : "Your access will end at the close of the current billing period or trial."}
      You can reopen the billing portal any time before then if you want to keep Pro active.
    </p>
  `;

  const message = buildEmailShell(preview, title, body, "Manage billing");
  await sendTransactionalEmail({
    to: recipient.email,
    subject: "Skies Ready Pro cancellation scheduled",
    html: message.html,
    text: message.text,
    idempotencyKey: input.idempotencyKey,
  });
}

export async function sendProResumedEmail(input: {
  userId: string | null;
  email?: string | null;
  name?: string | null;
  idempotencyKey: string;
}) {
  const recipient = await resolveRecipient(input.userId, input.email, input.name);

  if (!recipient) {
    return;
  }

  const preview = "Your Pro plan is set to continue.";
  const title = "Your Pro plan will continue";
  const body = `
    <p style="margin:0 0 16px;color:#e2e8f0;font-size:16px;line-height:1.7;">
      Hi ${escapeHtml(recipient.firstName)}, your Skies Ready Pro cancellation has been removed.
    </p>
    <p style="margin:0;color:#c8d4e3;font-size:16px;line-height:1.7;">
      Your subscription will stay active and renew normally unless you cancel it again from the billing portal.
    </p>
  `;

  const message = buildEmailShell(preview, title, body, "View account");
  await sendTransactionalEmail({
    to: recipient.email,
    subject: "Skies Ready Pro resumed",
    html: message.html,
    text: message.text,
    idempotencyKey: input.idempotencyKey,
  });
}

export async function sendProEndedEmail(input: {
  userId: string | null;
  email?: string | null;
  name?: string | null;
  idempotencyKey: string;
}) {
  const recipient = await resolveRecipient(input.userId, input.email, input.name);

  if (!recipient) {
    return;
  }

  const preview = "Your Pro access has ended.";
  const title = "Your Pro plan has ended";
  const body = `
    <p style="margin:0 0 16px;color:#e2e8f0;font-size:16px;line-height:1.7;">
      Hi ${escapeHtml(recipient.firstName)}, your Skies Ready Pro subscription has ended.
    </p>
    <p style="margin:0;color:#c8d4e3;font-size:16px;line-height:1.7;">
      Your account has been moved back to the free plan. If you want Pro access again, you can restart it from your dashboard at any time.
    </p>
  `;

  const message = buildEmailShell(preview, title, body, "Restart Pro");
  await sendTransactionalEmail({
    to: recipient.email,
    subject: "Skies Ready Pro ended",
    html: message.html,
    text: message.text,
    idempotencyKey: input.idempotencyKey,
  });
}
