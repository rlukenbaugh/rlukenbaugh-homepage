import { NextRequest, NextResponse } from "next/server";
import { getForecastForQuery } from "@/lib/forecast";
import { createRouteLogger } from "@/lib/monitoring";
import { siteConfig } from "@/lib/site";

export async function GET(request: NextRequest) {
  const logger = createRouteLogger("/api/forecast", request);
  const query = request.nextUrl.searchParams.get("query") || siteConfig.defaultLocationQuery;
  logger.start({ query });

  try {
    const forecast = await getForecastForQuery(query);
    logger.success({
      query,
      location: `${forecast.location.name}, ${forecast.location.region || forecast.location.country}`,
    });
    return NextResponse.json(forecast);
  } catch (cause) {
    await logger.failure(cause, { query });
    return NextResponse.json(
      {
        error: cause instanceof Error ? cause.message : "Unable to load forecast",
      },
      { status: 500 },
    );
  }
}
