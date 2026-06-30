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
