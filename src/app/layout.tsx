import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VTUBER EXPO 2026 | 2026.5.3-5.4 ベルサール秋葉原",
  description:
    "VTUBER EXPO 2026 — VTuberの祭典。2026年5月3日(土)-4日(日) ベルサール秋葉原にて開催。入場無料。ライブ、トーク、展示、グッズ、フードなど盛りだくさん！",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "VTUBER EXPO 2026",
    description:
      "VTuberの祭典 2026.5.3-5.4 ベルサール秋葉原 入場無料",
    type: "website",
    siteName: "VTUBER EXPO 2026",
  },
  twitter: {
    card: "summary_large_image",
    title: "VTUBER EXPO 2026",
    description:
      "VTuberの祭典 2026.5.3-5.4 ベルサール秋葉原 入場無料",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
