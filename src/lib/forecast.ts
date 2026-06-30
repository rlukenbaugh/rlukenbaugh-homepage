import { siteConfig } from "@/lib/site";

export type Suitability = "good" | "caution" | "risky";

export type ForecastWindow = {
  timeLabel: string;
  timeIso: string;
  tempF: number;
  windMph: number;
  gustMph: number;
  humidity: number;
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

type GeocodeLocation = {
  name: string;
  state?: string;
  country?: string;
  lat: number;
  lon: number;
};

type GeocodeResponse = GeocodeLocation[];

type ForecastResponse = {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      humidity: number;
    };
    weather?: Array<{
      id: number;
    }>;
    clouds?: {
      all: number;
    };
    wind?: {
      speed: number;
      gust?: number;
    };
    visibility?: number;
    pop?: number;
  }>;
  city: {
    timezone: number;
  };
};

type CurrentWeatherResponse = {
  dt: number;
  timezone: number;
  name: string;
  weather?: Array<{
    id: number;
  }>;
  main: {
    temp: number;
    humidity: number;
  };
  visibility?: number;
  wind?: {
    speed: number;
    gust?: number;
  };
  clouds?: {
    all: number;
  };
  sys?: {
    country?: string;
  };
};

function getWeatherApiKey() {
  return process.env.OPENWEATHER_API_KEY || process.env.OPEN_METEO_API_KEY;
}

function buildUrl(base: string, path: string, params: Record<string, string>) {
  const url = new URL(path, base);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const apiKey = getWeatherApiKey();

  if (apiKey) {
    url.searchParams.set("appid", apiKey);
  }

  return url.toString();
}

function getGeocodingBaseUrl() {
  return process.env.OPENWEATHER_GEOCODING_BASE_URL || "https://api.openweathermap.org";
}

function getForecastBaseUrl() {
  return process.env.OPENWEATHER_FORECAST_BASE_URL || "https://api.openweathermap.org";
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
  precipProbability: number;
  visibilityMiles: number;
}) {
  if (
    input.windMph >= 18 ||
    input.gustMph >= 25 ||
    input.precipProbability >= 50 ||
    input.visibilityMiles <= 2
  ) {
    return "risky" as const;
  }

  if (
    input.windMph >= 11 ||
    input.gustMph >= 18 ||
    input.precipProbability >= 25 ||
    input.visibilityMiles <= 5
  ) {
    return "caution" as const;
  }

  return "good" as const;
}

function formatHourLabel(timestamp: number, index: number, timezoneOffsetSeconds: number) {
  if (index === 0) {
    return "Now";
  }

  const shiftedDate = new Date((timestamp + timezoneOffsetSeconds) * 1000);
  const hourValue = shiftedDate.getUTCHours();
  const normalizedHour = hourValue % 12 || 12;
  const meridiem = hourValue >= 12 ? "PM" : "AM";

  return `${normalizedHour} ${meridiem}`;
}

function formatUtcOffset(offsetSeconds: number) {
  const sign = offsetSeconds >= 0 ? "+" : "-";
  const absoluteOffset = Math.abs(offsetSeconds);
  const hours = String(Math.floor(absoluteOffset / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((absoluteOffset % 3600) / 60)).padStart(2, "0");

  return `UTC${sign}${hours}:${minutes}`;
}

export async function getForecastForQuery(query: string): Promise<ForecastPayload> {
  if (!getWeatherApiKey()) {
    throw new Error("Weather API key is missing");
  }

  const attempts = [query, query.split(",")[0]?.trim()].filter(Boolean) as string[];
  let location: GeocodeLocation | undefined;

  for (const attempt of attempts) {
    const geocodeUrl = buildUrl(getGeocodingBaseUrl(), "/geo/1.0/direct", {
      q: attempt,
      limit: "1",
      units: "imperial",
    });

    const geocode = await fetchJson<GeocodeResponse>(geocodeUrl);
    location = geocode[0];

    if (location) {
      break;
    }
  }

  if (!location) {
    throw new Error("No matching location found");
  }

  const [current, forecast] = await Promise.all([
    fetchJson<CurrentWeatherResponse>(
      buildUrl(getForecastBaseUrl(), "/data/2.5/weather", {
        lat: String(location.lat),
        lon: String(location.lon),
        units: "imperial",
      }),
    ),
    fetchJson<ForecastResponse>(
      buildUrl(getForecastBaseUrl(), "/data/2.5/forecast", {
        lat: String(location.lat),
        lon: String(location.lon),
        units: "imperial",
      }),
    ),
  ]);

  const timezoneOffset = current.timezone ?? forecast.city.timezone ?? 0;
  const timezone = formatUtcOffset(timezoneOffset);
  const startIndex = forecast.list.findIndex((entry) => entry.dt >= current.dt);
  const upcomingEntries =
    startIndex === -1 ? forecast.list.slice(0, 7) : forecast.list.slice(startIndex, startIndex + 7);

  const currentWindMph = round(current.wind?.speed || 0);
  const currentGustMph = round(current.wind?.gust || current.wind?.speed || 0);
  const currentVisibilityMiles = round(toMiles(current.visibility || 0));
  const currentSuitability = assessSuitability({
    windMph: currentWindMph,
    gustMph: currentGustMph,
    precipProbability: 0,
    visibilityMiles: currentVisibilityMiles,
  });

  const windows = [
    {
      timeIso: new Date(current.dt * 1000).toISOString(),
      timeLabel: "Now",
      tempF: round(current.main.temp || 0),
      windMph: currentWindMph,
      gustMph: currentGustMph,
      humidity: round(current.main.humidity || 0),
      precipProbability: 0,
      visibilityMiles: currentVisibilityMiles,
      cloudCover: round(current.clouds?.all || 0),
      suitability: currentSuitability,
    },
    ...upcomingEntries.map((entry, index) => {
      const windMph = round(entry.wind?.speed || 0);
      const gustMph = round(entry.wind?.gust || entry.wind?.speed || 0);
      const precipProbability = round((entry.pop || 0) * 100);
      const visibilityMiles = round(toMiles(entry.visibility || 0));
      const suitability = assessSuitability({
        windMph,
        gustMph,
        precipProbability,
        visibilityMiles,
      });

      return {
        timeIso: new Date(entry.dt * 1000).toISOString(),
        timeLabel: formatHourLabel(entry.dt, index + 1, timezoneOffset),
        tempF: round(entry.main.temp || 0),
        windMph,
        gustMph,
        humidity: round(entry.main.humidity || 0),
        precipProbability,
        visibilityMiles,
        cloudCover: round(entry.clouds?.all || 0),
        suitability,
      };
    }),
  ];

  const locationLabel = [location.name, location.state, current.sys?.country || location.country]
    .filter(Boolean)
    .join(", ");

  return {
    location: {
      name: location.name,
      region: location.state || "",
      country: current.sys?.country || location.country || "",
      timezone,
      latitude: location.lat,
      longitude: location.lon,
    },
    current: {
      tempF: round(current.main.temp || 0),
      windMph: currentWindMph,
      gustMph: currentGustMph,
      weatherCode: current.weather?.[0]?.id || 0,
      suitability: currentSuitability,
    },
    windows,
    summary: `Live forecast for ${locationLabel} with current conditions and upcoming 3-hour forecast windows in imperial units.`,
    providerNote:
      getWeatherApiKey()
        ? "Live data from OpenWeatherMap. Forecast cards after Now use the provider's upcoming 3-hour windows on the current plan."
        : "OpenWeatherMap is not configured yet.",
    updatedAt: new Date(current.dt * 1000).toISOString(),
  };
}
