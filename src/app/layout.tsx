import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VTUBER EXPO 2026 | 2026.5.3-5.4 ベルサール秋葉原",
  description:
    "VTUBER EXPO 2026 — VTuberの祭典。2026年5月3日(土)-4日(日) ベルサール秋葉原にて開催。入場無料。ライブ、トーク、展示、グッズ、フードなど盛りだくさん！",
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

const GA_ID = "G-3WP3GXD0XQ";
const CLARITY_ID = "vt03crien1";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="icon" href="/site-icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/site-icon.png" />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_ID}");
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
