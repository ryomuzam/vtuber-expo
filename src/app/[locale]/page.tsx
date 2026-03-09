import { setRequestLocale } from "next-intl/server";
import { getSocialLinks } from "@/lib/data";

export const revalidate = 60;

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const socialLinks = await getSocialLinks();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a1a] px-4 text-center">
      {/* Background gradient blobs */}
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[#3D7FE0]/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-[#E040FB]/20 blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo / Title */}
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-white/40">
          produced by VEXZ
        </p>
        <h1 className="text-4xl font-black text-white md:text-6xl lg:text-7xl">
          VTUBER EXPO 2026
        </h1>

        {/* Coming Soon */}
        <div className="mt-2 rounded-full border border-white/20 bg-white/10 px-8 py-3 backdrop-blur-sm">
          <p className="text-xl font-bold tracking-[0.2em] text-white md:text-2xl">
            COMING SOON
          </p>
        </div>

        {/* Date & Venue */}
        <div className="mt-4 space-y-2 text-white/60">
          <p className="text-lg font-semibold text-white/80">
            2026.5.3 SAT – 5.4 SUN
          </p>
          <p className="text-sm">
            {locale === "ja" ? "ベルサール秋葉原" : "Bellesalle Akihabara"}
          </p>
        </div>

        {/* SNS Links */}
        <div className="mt-8 flex gap-4">
          <a
            href={socialLinks.xUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            X (Twitter)
          </a>
          <a
            href={socialLinks.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            YouTube
          </a>
        </div>
      </div>
    </main>
  );
}
