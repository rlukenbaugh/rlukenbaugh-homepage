import { NextRequest, NextResponse } from "next/server";
import { createRouteLogger } from "@/lib/monitoring";
import {
  getViewerLocationLibrary,
  recordLocationHistory,
  removeSavedLocation,
  saveLocation,
} from "@/lib/user-locations";
import { getViewerSubscriptionState } from "@/lib/subscription";
import { isClerkConfigured } from "@/lib/site";

type ActionPayload = {
  action?: "record" | "save" | "remove";
  query?: string;
  label?: string;
};

export async function GET(request: NextRequest) {
  const logger = createRouteLogger("/api/user-locations", request);
  logger.start({ method: "GET" });

  if (!isClerkConfigured()) {
    logger.success({ method: "GET", configured: false });
    return NextResponse.json({ error: "Clerk is not configured yet" }, { status: 503 });
  }

  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();

  if (!userId) {
    logger.success({ method: "GET", authenticated: false });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await getViewerSubscriptionState();

  if (!subscription?.isPro) {
    logger.success({ method: "GET", pro: false });
    return NextResponse.json({ error: "Pro plan required" }, { status: 403 });
  }

  const library = await getViewerLocationLibrary();
  logger.success({
    method: "GET",
    savedCount: library?.saved.length || 0,
    historyCount: library?.history.length || 0,
  });
  return NextResponse.json(library || { saved: [], history: [] });
}

export async function POST(request: NextRequest) {
  const logger = createRouteLogger("/api/user-locations", request);
  logger.start({ method: "POST" });

  if (!isClerkConfigured()) {
    logger.success({ method: "POST", configured: false });
    return NextResponse.json({ error: "Clerk is not configured yet" }, { status: 503 });
  }

  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();

  if (!userId) {
    logger.success({ method: "POST", authenticated: false });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await getViewerSubscriptionState();

  if (!subscription?.isPro) {
    logger.success({ method: "POST", pro: false });
    return NextResponse.json({ error: "Pro plan required" }, { status: 403 });
  }

  try {
    const payload = (await request.json()) as ActionPayload;
    const action = payload.action;
    const query = payload.query?.trim() || "";
    const label = payload.label?.trim() || query;

    if (!action || !query) {
      throw new Error("Missing location action or query");
    }

    const library =
      action === "save"
        ? await saveLocation(userId, { query, label })
        : action === "remove"
          ? await removeSavedLocation(userId, query)
          : await recordLocationHistory(userId, { query, label });

    logger.success({
      method: "POST",
      action,
      savedCount: library.saved.length,
      historyCount: library.history.length,
    });
    return NextResponse.json(library);
  } catch (error) {
    await logger.failure(error, { method: "POST" });
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to update locations",
      },
      { status: 500 },
    );
  }
}
