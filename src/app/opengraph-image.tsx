import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Waypoint";
export const size = {
  width: 1200,
  height: 630,
};

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
          padding: "72px",
          background:
            "radial-gradient(circle at top left, rgba(200,254,2,0.22), transparent 32%), linear-gradient(180deg, #101010 0%, #050505 100%)",
          color: "#ffffff",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ fontSize: 28, letterSpacing: "0.38em", textTransform: "uppercase", color: "#c8fe02" }}>
            Waypoint
          </div>
          <div style={{ fontSize: 86, lineHeight: 1, fontWeight: 700, maxWidth: 980 }}>
            Structured learning paths from real videos.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 28, color: "#9ca3af" }}>
          <span>AI learning paths</span>
          <span>Free launch</span>
        </div>
      </div>
    ),
    size,
  );
}
