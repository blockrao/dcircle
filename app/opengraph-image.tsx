import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DallasCircle — Deep Ellum for the night out";
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
          padding: "76px 84px",
          background: "radial-gradient(circle at 78% 12%, #334155 0, #0c192b 42%, #0c192b 100%)",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 58, height: 58, borderRadius: 14, background: "#fbbf24", color: "#0c192b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, fontWeight: 900 }}>D</div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 3 }}>DALLASCIRCLE</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ color: "#fbbf24", fontSize: 24, fontWeight: 800, letterSpacing: 4 }}>DEEP ELLUM</div>
          <div style={{ fontSize: 76, lineHeight: 1.05, fontWeight: 800, letterSpacing: -2 }}>For the night out.</div>
          <div style={{ fontSize: 30, lineHeight: 1.4, color: "#cbd5e1" }}>Plan dinner, find late-night options,<br />and make a better evening of it.</div>
        </div>
        <div style={{ borderTop: "3px solid #fbbf24", paddingTop: 20, fontSize: 17, fontWeight: 700, letterSpacing: 2, color: "#cbd5e1" }}>DALLASCIRCLE.COM · SOURCE-BACKED LOCAL GUIDES</div>
      </div>
    ),
    { ...size },
  );
}
