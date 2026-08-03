import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") || "pmbyven";
  const subtitle = searchParams.get("subtitle") || "If Apple designed Medium";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          padding: 64,
          fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#94a3b8",
            fontSize: 28,
            fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              background: "linear-gradient(135deg, #3b82f6, #a855f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            P
          </div>
          pmbyven
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: title.length > 60 ? 48 : 64,
              color: "white",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#94a3b8",
              fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
            }}
          >
            {subtitle}
          </div>
        </div>
        <div
          style={{
            height: 6,
            width: 120,
            borderRadius: 999,
            background: "linear-gradient(90deg, #3b82f6, #a855f7)",
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
