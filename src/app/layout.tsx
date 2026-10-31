import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Dancing_Script, Jost } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const hand = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hand",
  display: "swap",
});

const sans = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "If You Could Hear My Heart ❤️",
  description: "A personal letter, written with love, honesty and hope.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "If You Could Hear My Heart ❤️",
    description: "A personal letter, written with love, honesty and hope.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#09070B",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${serif.variable} ${hand.variable} ${sans.variable} bg-midnight font-sans text-ivory antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
