"use client";

import { startTransition, useState } from "react";
import type { ForecastPayload } from "@/lib/forecast";
import type { LocationEntry } from "@/lib/user-locations";
import { WeatherIcon } from "@/components/weather-icon";

function statusClasses(status: ForecastPayload["current"]["suitability"]) {
  if (status === "good") {
    return "bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-400/30";
  }

  if (status === "caution") {
    return "bg-amber-400/15 text-amber-100 ring-1 ring-amber-400/30";
  }

  return "bg-rose-400/15 text-rose-100 ring-1 ring-rose-400/30";
}

function alertClasses(severity: "info" | "warning") {
  return severity === "warning"
    ? "border-amber-300/25 bg-amber-400/10 text-amber-50"
    : "border-cyan-300/20 bg-cyan-400/10 text-cyan-50";
}

export function ForecastExplorer({
  initialForecast,
  initialQuery,
  canManageLocations = false,
  initialSavedLocations = [],
  initialLocationHistory = [],
  showProLocationUpsell = false,
}: {
  initialForecast: ForecastPayload;
  initialQuery: string;
  canManageLocations?: boolean;
  initialSavedLocations?: LocationEntry[];
  initialLocationHistory?: LocationEntry[];
  showProLocationUpsell?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [forecast, setForecast] = useState(initialForecast);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [libraryBusy, setLibraryBusy] = useState(false);
  const [libraryMessage, setLibraryMessage] = useState("");
  const [savedLocations, setSavedLocations] = useState(initialSavedLocations);
  const [locationHistory, setLocationHistory] = useState(initialLocationHistory);

  const selectedWindow = forecast.windows[selectedIndex] || forecast.windows[0];
  const locationLabel = `${forecast.location.name}${forecast.location.region ? `, ${forecast.location.region}` : ""}`;

  function searchForecast() {
    setPending(true);
    setError("");
    setLibraryMessage("");

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
          if (canManageLocations) {
            void syncLibrary("record", query, formatSearchLabel(payload));
          }
        })
        .catch((cause: unknown) => {
          setError(cause instanceof Error ? cause.message : "Unable to load live forecast");
          setPending(false);
        });
    });
  }

  function formatSearchLabel(payload: ForecastPayload) {
    return `${payload.location.name}${payload.location.region ? `, ${payload.location.region}` : ""}`;
  }

  function syncLibrary(action: "record" | "save" | "remove", nextQuery: string, label?: string) {
    setLibraryBusy(true);

    return fetch("/api/user-locations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        query: nextQuery,
        label,
      }),
    })
      .then(async (response) => {
        const payload = (await response.json()) as {
          error?: string;
          saved?: LocationEntry[];
          history?: LocationEntry[];
        };

        if (!response.ok) {
          throw new Error(payload.error || "Unable to update saved locations");
        }

        setSavedLocations(payload.saved || []);
        setLocationHistory(payload.history || []);

        if (action === "save") {
          setLibraryMessage("Location saved to Pro launch locations.");
        } else if (action === "remove") {
          setLibraryMessage("Saved location removed.");
        }
      })
      .catch((cause: unknown) => {
        setLibraryMessage(
          cause instanceof Error ? cause.message : "Unable to update saved locations",
        );
      })
      .finally(() => {
        setLibraryBusy(false);
      });
  }

  function runSavedSearch(nextQuery: string) {
    setQuery(nextQuery);
    setPending(true);
    setError("");
    setLibraryMessage("");

    startTransition(() => {
      void fetch(`/api/forecast?query=${encodeURIComponent(nextQuery)}`)
        .then(async (response) => {
          const payload = (await response.json()) as ForecastPayload & { error?: string };

          if (!response.ok) {
            throw new Error(payload.error || "Unable to load live forecast");
          }

          setForecast(payload);
          setSelectedIndex(0);
          setPending(false);
          if (canManageLocations) {
            void syncLibrary("record", nextQuery, formatSearchLabel(payload));
          }
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
              {locationLabel}
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

        {forecast.alerts.length ? (
          <div className="grid gap-3 xl:grid-cols-3">
            {forecast.alerts.map((alert) => (
              <article
                className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${alertClasses(alert.severity)}`}
                key={`${alert.title}-${alert.detail}`}
              >
                <p className="font-semibold uppercase tracking-[0.14em]">{alert.title}</p>
                <p className="mt-1 text-white/80">{alert.detail}</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/35 p-4">
          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Condition</p>
              <div className="mt-2 flex items-center gap-2 text-white">
                <WeatherIcon className="h-6 w-6 text-cyan-200" iconKey={forecast.current.iconKey} />
                <span className="text-lg font-semibold">{forecast.current.conditionLabel}</span>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Temp</p>
              <div className="mt-2 flex items-start gap-1 text-white">
                <span className="text-[clamp(1.9rem,3.6vw,2.6rem)] font-semibold leading-none tracking-[-0.05em] tabular-nums">
                  {forecast.current.tempF}
                </span>
                <span className="pt-1 text-sm font-semibold tracking-[0.14em] text-white/80">
                  {"\u00B0F"}
                </span>
              </div>
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
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Sunrise</p>
              <p className="mt-2 text-base font-semibold text-white">
                {formatClock(forecast.current.sunriseAt)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Sunset</p>
              <p className="mt-2 text-base font-semibold text-white">
                {formatClock(forecast.current.sunsetAt)}
              </p>
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
                className={`flex min-w-0 flex-col rounded-2xl border p-3 text-left transition ${
                  index === selectedIndex
                    ? "border-cyan-300 bg-cyan-400/12 shadow-[0_0_0_1px_rgba(90,216,255,0.2)]"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                }`}
                key={window.timeIso}
                onClick={() => setSelectedIndex(index)}
                type="button"
              >
                <p className="min-h-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {window.timeLabel}
                </p>
                <div className="mt-2 flex min-h-[2.65rem] items-start gap-0.5 text-white">
                  <span className="text-[clamp(1.7rem,2vw,2.25rem)] font-semibold leading-none tracking-[-0.05em] tabular-nums">
                    {window.tempF}
                  </span>
                  <span className="shrink-0 pt-1 text-[0.65rem] font-semibold tracking-[0.12em] text-white/80">
                    {"\u00B0F"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-300">Wind {window.windMph} mph</p>
                <p className="text-sm text-slate-300">Gust {window.gustMph} mph</p>
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
                  Next 5 days
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  Daily highs, lows, wind, gust, and rain risk
                </h3>
              </div>
              <p className="text-sm text-slate-300">
                Built from the provider&apos;s rolling 3-hour forecast windows.
              </p>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {forecast.daily.map((day) => (
                <article
                  className="rounded-2xl border border-white/10 bg-slate-950/35 p-4"
                  key={day.dateKey}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <WeatherIcon className="h-4 w-4 text-cyan-200" iconKey={day.iconKey} />
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">
                          {day.dayLabel}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">{day.dateLabel}</p>
                      <p className="mt-1 text-xs text-slate-400">{day.conditionLabel}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${statusClasses(
                        day.suitability,
                      )}`}
                    >
                      {day.suitability}
                    </span>
                  </div>

                  <div className="mt-4 flex items-end gap-2 text-white">
                    <span className="text-3xl font-semibold leading-none tracking-[-0.05em] tabular-nums">
                      {day.highTempF}
                    </span>
                    <span className="pb-0.5 text-xs font-semibold tracking-[0.12em] text-white/80">
                      {"\u00B0F"}
                    </span>
                    <span className="pb-0.5 text-sm text-slate-400">/</span>
                    <span className="pb-0.5 text-lg font-semibold tabular-nums text-slate-300">
                      {day.lowTempF}
                      {"\u00B0F"}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-300">
                    <p>Wind up to {day.windMph} mph</p>
                    <p>Gust up to {day.gustMph} mph</p>
                    <p>Rain chance up to {day.precipProbability}%</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/80">
            Selected window
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{selectedWindow.timeLabel}</h3>
          <div className="mt-4 grid gap-3">
            <Metric label="Wind at launch" value={`${selectedWindow.windMph} mph`} />
            <Metric label="Humidity" value={`${selectedWindow.humidity}%`} />
            <Metric label="Gust speed" value={`${selectedWindow.gustMph} mph`} />
            <Metric label="Visibility" value={`${selectedWindow.visibilityMiles} mi`} />
            <Metric label="Precip chance" value={`${selectedWindow.precipProbability}%`} />
            <Metric label="Cloud cover" value={`${selectedWindow.cloudCover}%`} />
          </div>

          {canManageLocations ? (
            <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
                    Pro launch locations
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    Save favorite launch areas and revisit recent searches quickly.
                  </p>
                </div>
                <button
                  className="rounded-2xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
                  disabled={libraryBusy}
                  onClick={() => void syncLibrary("save", query, locationLabel)}
                  type="button"
                >
                  {libraryBusy ? "Updating..." : "Save this location"}
                </button>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                <LocationList
                  emptyCopy="No saved locations yet."
                  items={savedLocations}
                  onPick={runSavedSearch}
                  onRemove={(itemQuery) => void syncLibrary("remove", itemQuery)}
                  title="Saved locations"
                />
                <LocationList
                  emptyCopy="Search activity will appear here."
                  items={locationHistory}
                  onPick={runSavedSearch}
                  title="Recent history"
                />
              </div>
              {libraryMessage ? <p className="mt-3 text-sm text-slate-300">{libraryMessage}</p> : null}
            </div>
          ) : showProLocationUpsell ? (
            <div className="mt-5 rounded-[1.5rem] border border-cyan-300/15 bg-cyan-400/8 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
                Pro feature
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Saved launch locations and recent forecast history unlock with Pro so repeat flight
                planning is faster.
              </p>
            </div>
          ) : null}

          <p className="mt-4 text-sm text-slate-300">{forecast.providerNote}</p>
          {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
        </div>
      </div>
    </section>
  );
}

function formatClock(value: string | null) {
  if (!value) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

function LocationList({
  title,
  items,
  emptyCopy,
  onPick,
  onRemove,
}: {
  title: string;
  items: LocationEntry[];
  emptyCopy: string;
  onPick: (query: string) => void;
  onRemove?: (query: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{title}</p>
      <div className="mt-3 space-y-2">
        {items.length ? (
          items.map((item) => (
            <div
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-3"
              key={`${title}-${item.query}`}
            >
              <button
                className="min-w-0 flex-1 text-left"
                onClick={() => onPick(item.query)}
                type="button"
              >
                <p className="truncate font-semibold text-white">{item.label}</p>
                <p className="mt-1 truncate text-xs text-slate-400">{item.query}</p>
              </button>
              {onRemove ? (
                <button
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 hover:bg-white/[0.04]"
                  onClick={() => onRemove(item.query)}
                  type="button"
                >
                  Remove
                </button>
              ) : null}
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-3 text-sm text-slate-400">
            {emptyCopy}
          </p>
        )}
      </div>
    </div>
  );
}
