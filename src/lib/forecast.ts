import { siteConfig } from "@/lib/site";

export type Suitability = "good" | "caution" | "risky";

export type ForecastWindow = {
  timeLabel: string;
  timeIso: string;
  tempF: number;
  windMph: number;
  gustMph: number;
  wind80Mph: number;
  precipProbability: number;
  visibilityMiles: number;
  cloudCover: number;
  suitability: Suitability;
};

export type ForecastPayload = {
  location: {
    name: string;
    region: string;
    country: string;
    timezone: string;
    latitude: number;
    longitude: number;
  };
  current: {
    tempF: number;
    windMph: number;
    gustMph: number;
    weatherCode: number;
    suitability: Suitability;
  };
  windows: ForecastWindow[];
  summary: string;
  providerNote: string;
  updatedAt: string;
};

type GeocodeResponse = {
  results?: Array<{
    name: string;
    admin1?: string;
    country?: string;
    timezone?: string;
    latitude: number;
    longitude: number;
  }>;
};

type ForecastResponse = {
  hourly: {
    time: string[];
    temperature_2m: number[];
    wind_speed_10m: number[];
    wind_gusts_10m: number[];
    wind_speed_80m: number[];
    precipitation_probability: number[];
    visibility: number[];
    cloud_cover: number[];
  };
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
    weather_code: number;
  };
};

function buildUrl(base: string, path: string, params: Record<string, string>) {
  const url = new URL(path, base);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  if (process.env.OPEN_METEO_API_KEY) {
    url.searchParams.set("apikey", process.env.OPEN_METEO_API_KEY);
  }

  return url.toString();
}

function getGeocodingBaseUrl() {
  return process.env.OPEN_METEO_GEOCODING_BASE_URL || "https://geocoding-api.open-meteo.com";
}

function getForecastBaseUrl() {
  return process.env.OPEN_METEO_FORECAST_BASE_URL || "https://api.open-meteo.com";
}

async function fetchJson<T>(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "User-Agent": `${siteConfig.name}/0.1.0`,
    },
  });

  if (!response.ok) {
    throw new Error(`Forecast request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

function toMiles(meters: number) {
  return meters * 0.000621371;
}

function round(value: number) {
  return Math.round(value);
}

function assessSuitability(input: {
  windMph: number;
  gustMph: number;
  wind80Mph: number;
  precipProbability: number;
  visibilityMiles: number;
}) {
  if (
    input.windMph >= 18 ||
    input.gustMph >= 25 ||
    input.wind80Mph >= 24 ||
    input.precipProbability >= 50 ||
    input.visibilityMiles <= 2
  ) {
    return "risky" as const;
  }

  if (
    input.windMph >= 11 ||
    input.gustMph >= 18 ||
    input.wind80Mph >= 16 ||
    input.precipProbability >= 25 ||
    input.visibilityMiles <= 5
  ) {
    return "caution" as const;
  }

  return "good" as const;
}

function formatHourLabel(timeIso: string, timezone: string, index: number) {
  const date = new Date(`${timeIso}:00`);

  if (index === 0) {
    return "Now";
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
  }).format(date);
}

function findStartingIndex(timezone: string, times: string[]) {
  const currentHourKey = new Intl.DateTimeFormat("sv-SE", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
  })
    .format(new Date())
    .replace(" ", "T")
    .concat(":00");

  const nextIndex = times.findIndex((time) => time >= currentHourKey);
  return nextIndex === -1 ? 0 : nextIndex;
}

export async function getForecastForQuery(query: string): Promise<ForecastPayload> {
  const attempts = [query, query.split(",")[0]?.trim()].filter(Boolean) as string[];
  let location: GeocodeResponse["results"][number] | undefined;

  for (const attempt of attempts) {
    const geocodeUrl = buildUrl(getGeocodingBaseUrl(), "/v1/search", {
      name: attempt,
      count: "1",
      language: "en",
      format: "json",
    });

    const geocode = await fetchJson<GeocodeResponse>(geocodeUrl);
    location = geocode.results?.[0];

    if (location) {
      break;
    }
  }

  if (!location) {
    throw new Error("No matching location found");
  }

  const forecastUrl = buildUrl(getForecastBaseUrl(), "/v1/forecast", {
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: "temperature_2m,wind_speed_10m,wind_gusts_10m,weather_code",
    hourly:
      "temperature_2m,wind_speed_10m,wind_gusts_10m,wind_speed_80m,precipitation_probability,visibility,cloud_cover",
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    timezone: location.timezone || "auto",
    forecast_days: "2",
  });

  const forecast = await fetchJson<ForecastResponse>(forecastUrl);
  const timezone = location.timezone || "UTC";
  const startIndex = findStartingIndex(timezone, forecast.hourly.time);
  const windows = forecast.hourly.time.slice(startIndex, startIndex + 8).map((time, index) => {
    const sourceIndex = startIndex + index;
    const windMph = round(forecast.hourly.wind_speed_10m[sourceIndex] || 0);
    const gustMph = round(forecast.hourly.wind_gusts_10m[sourceIndex] || 0);
    const wind80Mph = round(forecast.hourly.wind_speed_80m[sourceIndex] || 0);
    const precipProbability = round(
      forecast.hourly.precipitation_probability[sourceIndex] || 0,
    );
    const visibilityMiles = round(toMiles(forecast.hourly.visibility[sourceIndex] || 0));
    const cloudCover = round(forecast.hourly.cloud_cover[sourceIndex] || 0);
    const suitability = assessSuitability({
      windMph,
      gustMph,
      wind80Mph,
      precipProbability,
      visibilityMiles,
    });

    return {
      timeIso: time,
      timeLabel: formatHourLabel(time, timezone, index),
      tempF: round(forecast.hourly.temperature_2m[sourceIndex] || 0),
      windMph,
      gustMph,
      wind80Mph,
      precipProbability,
      visibilityMiles,
      cloudCover,
      suitability,
    };
  });

  const currentSuitability = assessSuitability({
    windMph: round(forecast.current.wind_speed_10m || 0),
    gustMph: round(forecast.current.wind_gusts_10m || 0),
    wind80Mph: windows[0]?.wind80Mph || 0,
    precipProbability: windows[0]?.precipProbability || 0,
    visibilityMiles: windows[0]?.visibilityMiles || 0,
  });

  const locationLabel = [location.name, location.admin1, location.country]
    .filter(Boolean)
    .join(", ");

  return {
    location: {
      name: location.name,
      region: location.admin1 || "",
      country: location.country || "",
      timezone,
      latitude: location.latitude,
      longitude: location.longitude,
    },
    current: {
      tempF: round(forecast.current.temperature_2m || 0),
      windMph: round(forecast.current.wind_speed_10m || 0),
      gustMph: round(forecast.current.wind_gusts_10m || 0),
      weatherCode: forecast.current.weather_code || 0,
      suitability: currentSuitability,
    },
    windows,
    summary: `Live forecast for ${locationLabel} with imperial wind, gust, visibility, and precipitation checks.`,
    providerNote:
      process.env.OPEN_METEO_API_KEY
        ? "Commercial weather endpoint configured."
        : "Using the public Open-Meteo endpoint. Switch to a commercial key before paid launch.",
    updatedAt: new Date().toISOString(),
  };
}
