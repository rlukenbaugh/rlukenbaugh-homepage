import {
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSun,
  Sun,
  Snowflake,
  Wind,
} from "lucide-react";
import type { WeatherIconKey } from "@/lib/forecast";

export function WeatherIcon({
  iconKey,
  className,
}: {
  iconKey: WeatherIconKey;
  className?: string;
}) {
  switch (iconKey) {
    case "sun":
      return <Sun className={className} />;
    case "cloud":
      return <Cloud className={className} />;
    case "cloud-sun":
      return <CloudSun className={className} />;
    case "cloud-rain":
      return <CloudRain className={className} />;
    case "cloud-drizzle":
      return <CloudDrizzle className={className} />;
    case "cloud-lightning":
      return <CloudLightning className={className} />;
    case "snow":
      return <Snowflake className={className} />;
    case "fog":
      return <Cloud className={className} />;
    case "wind":
      return <Wind className={className} />;
    default:
      return <CloudSun className={className} />;
  }
}
