import { NextRequest, NextResponse } from "next/server";
import { getForecastForQuery } from "@/lib/forecast";
import { siteConfig } from "@/lib/site";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query") || siteConfig.defaultLocationQuery;

  try {
    const forecast = await getForecastForQuery(query);
    return NextResponse.json(forecast);
  } catch (cause) {
    return NextResponse.json(
      {
        error: cause instanceof Error ? cause.message : "Unable to load forecast",
      },
      { status: 500 },
    );
  }
}
