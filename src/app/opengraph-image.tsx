import { ImageResponse } from "next/og";

/**
 * Open Graph preview (1200×630) — deliberately generic and warm.
 * No private letter content or response details appear in public metadata.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "If You Could Hear My Heart — a personal letter";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(120% 90% at 50% 0%, #300D20 0%, #09070B 70%)",
          color: "#FFF5ED",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -140,
            left: -120,
            width: 460,
            height: 460,
            borderRadius: 9999,
            background: "#651B35",
            opacity: 0.45,
            filter: "blur(90px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            right: -100,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: "#DCA7B5",
            opacity: 0.2,
            filter: "blur(110px)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#DCA7B5",
          }}
        >
          <div style={{ width: 48, height: 1, background: "#651B35" }} />
          For Bacha
          <div style={{ width: 48, height: 1, background: "#651B35" }} />
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 76,
            fontWeight: 300,
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          If You Could Hear My Heart
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 26,
            fontWeight: 300,
            color: "#E8D6B5",
            opacity: 0.9,
          }}
        >
          A personal letter, written with love, honesty and hope.
        </div>
      </div>
    ),
    { ...size }
  );
}
