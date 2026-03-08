"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export default function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === "ja" ? "en" : "ja";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1 rounded-full border border-gray-300 bg-white/60 px-3 py-1 text-xs font-bold tracking-wider shadow-sm transition-all hover:border-[#3D7FE0] hover:bg-white"
      aria-label="Toggle language"
    >
      <span className={locale === "ja" ? "text-[#3D7FE0]" : "text-gray-400"}>
        JP
      </span>
      <span className="text-gray-300">/</span>
      <span className={locale === "en" ? "text-[#3D7FE0]" : "text-gray-400"}>
        EN
      </span>
    </button>
  );
}
