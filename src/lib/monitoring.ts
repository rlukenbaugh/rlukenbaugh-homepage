import { sendAlertEmail } from "@/lib/email";

type MonitoringContext = Record<string, unknown>;

function toErrorPayload(error: unknown) {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      name: error.name,
    };
  }

  return {
    message: String(error),
  };
}

function createPayload(level: "info" | "error", message: string, context?: MonitoringContext) {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(context || {}),
  };
}

export function logInfo(message: string, context?: MonitoringContext) {
  console.log(JSON.stringify(createPayload("info", message, context)));
}

export async function reportError(
  message: string,
  error: unknown,
  context?: MonitoringContext,
) {
  const payload = createPayload("error", message, {
    ...toErrorPayload(error),
    ...(context || {}),
  });

  console.error(JSON.stringify(payload));

  await sendAlertEmail({
    subject: `Skies Ready alert: ${message}`,
    html: buildErrorHtml(payload),
    text: buildErrorText(payload),
    idempotencyKey: `alert-${message}-${payload.timestamp}`,
  });

  const webhookUrl = process.env.ERROR_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (webhookError) {
    console.error(
      JSON.stringify(
        createPayload("error", "External error webhook delivery failed", {
          ...toErrorPayload(webhookError),
          sourceMessage: message,
        }),
      ),
    );
  }
}

function buildErrorText(payload: Record<string, unknown>) {
  return Object.entries(payload)
    .map(([key, value]) => `${key}: ${typeof value === "string" ? value : JSON.stringify(value)}`)
    .join("\n");
}

function buildErrorHtml(payload: Record<string, unknown>) {
  const rows = Object.entries(payload)
    .map(
      ([key, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #243447;font-weight:700;color:#f8fafc;vertical-align:top;">${escapeHtml(
          key,
        )}</td><td style="padding:8px 12px;border:1px solid #243447;color:#d8e2f0;white-space:pre-wrap;">${escapeHtml(
          typeof value === "string" ? value : JSON.stringify(value, null, 2),
        )}</td></tr>`,
    )
    .join("");

  return `
    <div style="background:#081522;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#f8fafc;">
      <div style="max-width:760px;margin:0 auto;background:#102032;border:1px solid #243447;border-radius:20px;padding:24px;">
        <p style="margin:0 0 12px;color:#8dd8ef;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;">Skies Ready alert</p>
        <h1 style="margin:0 0 18px;font-size:28px;line-height:1.15;">Server error reported</h1>
        <table style="width:100%;border-collapse:collapse;border:1px solid #243447;">
          ${rows}
        </table>
      </div>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function createRouteLogger(route: string, request?: Request) {
  const startedAt = Date.now();
  const requestId = request?.headers.get("x-vercel-id") || null;

  return {
    start(context?: MonitoringContext) {
      logInfo("route_started", {
        route,
        requestId,
        ...(context || {}),
      });
    },
    success(context?: MonitoringContext) {
      logInfo("route_completed", {
        route,
        requestId,
        durationMs: Date.now() - startedAt,
        ...(context || {}),
      });
    },
    async failure(error: unknown, context?: MonitoringContext) {
      await reportError("route_failed", error, {
        route,
        requestId,
        durationMs: Date.now() - startedAt,
        ...(context || {}),
      });
    },
  };
}
