"use client";

import { startTransition, useState } from "react";
import type { ForecastPayload } from "@/lib/forecast";

function statusClasses(status: ForecastPayload["current"]["suitability"]) {
  if (status === "good") {
    return "bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-400/30";
  }

  if (status === "caution") {
    return "bg-amber-400/15 text-amber-100 ring-1 ring-amber-400/30";
  }

  return "bg-rose-400/15 text-rose-100 ring-1 ring-rose-400/30";
}

export function ForecastExplorer({
  initialForecast,
}: {
  initialForecast: ForecastPayload;
}) {
  const [query, setQuery] = useState(
    `${initialForecast.location.name}, ${initialForecast.location.region}`,
  );
  const [forecast, setForecast] = useState(initialForecast);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const selectedWindow = forecast.windows[selectedIndex] || forecast.windows[0];

  function searchForecast() {
    setPending(true);
    setError("");

    startTransition(() => {
      void fetch(`/api/forecast?query=${encodeURIComponent(query)}`)
        .then(async (response) => {
          const payload = (await response.json()) as ForecastPayload & { error?: string };

          if (!response.ok) {
            throw new Error(payload.error || "Unable to load live forecast");
          }

          setForecast(payload);
          setSelectedIndex(0);
          setPending(false);
        })
        .catch((cause: unknown) => {
          setError(cause instanceof Error ? cause.message : "Unable to load live forecast");
          setPending(false);
        });
    });
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur md:p-6">
      <div className="mb-5 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
              Live launch forecast
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              {forecast.location.name}
              {forecast.location.region ? `, ${forecast.location.region}` : ""}
            </h2>
            <p className="mt-1 text-sm text-slate-300">{forecast.summary}</p>
          </div>
          <div
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusClasses(
              forecast.current.suitability,
            )}`}
          >
            {forecast.current.suitability}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-400"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a city or launch area"
            value={query}
          />
          <button
            className="rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            disabled={pending}
            onClick={searchForecast}
            type="button"
          >
            {pending ? "Refreshing..." : "Update forecast"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/35 p-4">
          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Temp</p>
              <p className="mt-2 text-3xl font-semibold text-white">{forecast.current.tempF}°F</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Wind</p>
              <p className="mt-2 text-3xl font-semibold text-white">{forecast.current.windMph} mph</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Gust</p>
              <p className="mt-2 text-3xl font-semibold text-white">{forecast.current.gustMph} mph</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Updated</p>
              <p className="mt-2 text-base font-semibold text-white">
                {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                }).format(new Date(forecast.updatedAt))}
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
            {forecast.windows.map((window, index) => (
              <button
                className={`rounded-2xl border p-3 text-left transition ${
                  index === selectedIndex
                    ? "border-cyan-300 bg-cyan-400/12 shadow-[0_0_0_1px_rgba(90,216,255,0.2)]"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                }`}
                key={window.timeIso}
                onClick={() => setSelectedIndex(index)}
                type="button"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {window.timeLabel}
                </p>
                <p className="mt-2 text-3xl font-semibold text-white">{window.tempF}°F</p>
                <p className="mt-2 text-sm text-slate-300">Wind {window.windMph} mph</p>
                <p className="text-sm text-slate-300">Gust {window.gustMph} mph</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/80">
            Selected window
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{selectedWindow.timeLabel}</h3>
          <div className="mt-4 grid gap-3">
            <Metric label="Wind at launch" value={`${selectedWindow.windMph} mph`} />
            <Metric label="Wind at 80m" value={`${selectedWindow.wind80Mph} mph`} />
            <Metric label="Gust spread" value={`${selectedWindow.gustMph - selectedWindow.windMph} mph`} />
            <Metric label="Visibility" value={`${selectedWindow.visibilityMiles} mi`} />
            <Metric label="Precip chance" value={`${selectedWindow.precipProbability}%`} />
            <Metric label="Cloud cover" value={`${selectedWindow.cloudCover}%`} />
          </div>
          <p className="mt-4 text-sm text-slate-300">{forecast.providerNote}</p>
          {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
