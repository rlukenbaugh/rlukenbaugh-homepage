import type { Metadata } from "next";
import Link from "next/link";
import { ForecastExplorer } from "@/components/forecast-explorer";
import { forecastSlugToQuery } from "@/lib/forecast-share";
import { getForecastForQuery } from "@/lib/forecast";

type Props = {
  params: Promise<{ location: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { location } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const queryParam = resolvedSearchParams.query;
  const query =
    typeof queryParam === "string" && queryParam.trim()
      ? queryParam.trim()
      : forecastSlugToQuery(location);
  const titleLocation = query
    .split(" ")
    .map((part) => (part.length <= 2 ? part.toUpperCase() : `${part[0]?.toUpperCase()}${part.slice(1)}`))
    .join(" ");

  return {
    title: `Drone Forecast for ${titleLocation}`,
    description: `Check live drone weather conditions for ${titleLocation} including wind, gusts, visibility, cloud cover, and rain risk before you launch.`,
    alternates: {
      canonical: `/forecast/${location}`,
    },
    openGraph: {
      title: `Skies Ready forecast for ${titleLocation}`,
      description: `Review live launch guidance for ${titleLocation} with wind, gust, visibility, and rain checks.`,
      url: `https://skiesready.com/forecast/${location}`,
    },
  };
}

export default async function ShareableForecastPage({ params, searchParams }: Props) {
  const { location } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const queryParam = resolvedSearchParams.query;
  const query =
    typeof queryParam === "string" && queryParam.trim()
      ? queryParam.trim()
      : forecastSlugToQuery(location);
  const forecast = await getForecastForQuery(query);

  return (
    <main className="app-shell">
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link className="text-sm font-semibold text-cyan-200 hover:text-cyan-100" href="/">
            {"<- Back to home"}
          </Link>
          <div className="flex gap-3">
            <Link
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/[0.04]"
              href="/pricing"
            >
              View Pro
            </Link>
          </div>
        </div>

        <section className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
            Shareable forecast page
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Drone forecast for {forecast.location.name}
            {forecast.location.region ? `, ${forecast.location.region}` : ""}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            Share this page with other pilots who want a fast weather-based launch check for the
            same area. Skies Ready covers weather risk only, so FAA airspace, LAANC, TFRs, and
            local rules still need separate review before takeoff.
          </p>
        </section>

        <ForecastExplorer initialForecast={forecast} initialQuery={query} />
      </div>
    </main>
  );
}
