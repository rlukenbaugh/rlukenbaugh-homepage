import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Skies Ready drone weather preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "radial-gradient(circle at top left, rgba(34,211,238,0.18), transparent 35%), linear-gradient(135deg, #08131f 0%, #102131 55%, #09141f 100%)",
          color: "white",
          fontFamily: "Arial, sans-serif",
          padding: "64px",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <div
            style={{
              height: "72px",
              width: "72px",
              borderRadius: "24px",
              background: "#22d3ee",
              color: "#08131f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              fontWeight: 700,
            }}
          >
            SR
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "22px", letterSpacing: "0.22em", color: "#9be9f7" }}>
              SKIES READY
            </div>
            <div style={{ marginTop: "8px", fontSize: "24px", color: "#cbd5e1" }}>
              Drone Flight Forecast
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "22px", maxWidth: "820px" }}>
          <div style={{ fontSize: "74px", lineHeight: 1.02, fontWeight: 700 }}>
            Is the sky drone-ready?
          </div>
          <div style={{ fontSize: "30px", lineHeight: 1.3, color: "#dbeafe" }}>
            Check wind, gusts, visibility, clouds, and rain risk before you launch.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "18px",
            flexWrap: "wrap",
          }}
        >
          {["Wind", "Gusts", "Visibility", "Rain Risk"].map((label) => (
            <div
              key={label}
              style={{
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.14)",
                padding: "14px 22px",
                fontSize: "24px",
                color: "#e2e8f0",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
