import { Resend } from "resend";
import { siteConfig } from "@/lib/site";

type TransactionalEmail = {
  to: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey?: string;
};

function getResendApiKey() {
  return process.env.RESEND_API_KEY?.trim() || "";
}

function getFromEmail() {
  return process.env.RESEND_FROM_EMAIL?.trim() || "";
}

export function isTransactionalEmailConfigured() {
  return Boolean(getResendApiKey() && getFromEmail());
}

function getResendClient() {
  return new Resend(getResendApiKey());
}

export async function sendTransactionalEmail({
  to,
  subject,
  html,
  text,
  idempotencyKey,
}: TransactionalEmail) {
  if (!isTransactionalEmailConfigured()) {
    return { skipped: true as const };
  }

  try {
    const resend = getResendClient();

    await resend.emails.send(
      {
        from: `${siteConfig.name} <${getFromEmail()}>`,
        to,
        subject,
        html,
        text,
        replyTo: siteConfig.supportEmail,
      },
      idempotencyKey
        ? {
            headers: {
              "Idempotency-Key": idempotencyKey,
            },
          }
        : undefined,
    );

    return { skipped: false as const };
  } catch (error) {
    console.error("Failed to send transactional email", error);
    return { skipped: false as const };
  }
}
