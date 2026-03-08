import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-gray-200 bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 text-center md:px-8">
        <div className="mb-5">
          <Image
            src="/images/logo.png"
            alt="VTUBER EXPO 2026"
            width={1047}
            height={265}
            className="mx-auto h-auto w-36"
          />
        </div>

        <div className="mb-5 flex items-center justify-center gap-5">
          <a
            href="https://x.com/VTUBEREXPO2026"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 transition-colors hover:text-[#3D7FE0]"
            aria-label="X (Twitter)"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://www.youtube.com/@VTUBEREXPO"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 transition-colors hover:text-[#3D7FE0]"
            aria-label="YouTube"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
        </div>

        <p className="mb-1 text-sm text-gray-500">{t("producer")}</p>
        <p className="text-xs text-gray-400">{t("copyright")}</p>
      </div>
    </footer>
  );
}
