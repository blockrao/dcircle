import { ImageResponse } from "next/og";

export const alt = "DallasCircle — Deep Ellum for the Night Out";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "76px",
          color: "#ffffff",
          background:
            "radial-gradient(circle at 82% 12%, rgba(217,119,6,.42), transparent 34%), linear-gradient(135deg, #020617 0%, #172033 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#fbbf24",
              color: "#020617",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 42,
              fontWeight: 900,
            }}
          >
            D
          </div>
          <div style={{ fontSize: 34, fontWeight: 700 }}>DallasCircle</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              color: "#fcd34d",
              fontSize: 23,
              fontWeight: 700,
              letterSpacing: 5,
              textTransform: "uppercase",
            }}
          >
            Deep Ellum · Dallas, Texas
          </div>
          <div
            style={{
              maxWidth: 980,
              fontSize: 76,
              lineHeight: 1.08,
              fontWeight: 800,
              letterSpacing: -3,
            }}
          >
            Deep Ellum for the night out.
          </div>
          <div style={{ color: "#cbd5e1", fontSize: 28 }}>
            Practical plans. Local places. Clear sources.
          </div>
        </div>
        <div style={{ color: "#94a3b8", fontSize: 22 }}>
          dallascircle.com
        </div>
      </div>
    ),
    { ...size },
  );
}
