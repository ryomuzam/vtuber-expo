import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import LanguageToggle from "./LanguageToggle";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const t = useTranslations("Header");
  const locale = useLocale();

  const navItems = [
    { key: "whatis", href: `/${locale}#about` },
    { key: "news", href: `/${locale}#news` },
    { key: "overview", href: `/${locale}#overview` },
    { key: "lineup", href: `/${locale}#lineup` },
    { key: "schedule", href: `/${locale}#schedule` },
  ] as const;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200/60 bg-white/90 shadow-md shadow-black/5 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 md:px-8 md:py-3">
        {/* Left — Logo */}
        <a href={`/${locale}`} className="shrink-0">
          <Image
            src="/images/logo.png"
            alt="VTUBER EXPO 2026"
            width={1047}
            height={265}
            className="h-9 w-auto md:h-11"
            priority
          />
        </a>

        {/* Right — Nav (top) + Language (bottom) */}
        <div className="hidden flex-col items-end gap-2 md:flex">
          <nav className="flex items-center gap-2">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="nav-slide px-3 py-1 text-sm font-bold tracking-wider text-gray-700 transition-colors duration-300 hover:text-[#3D7FE0]"
              >
                <span className="relative z-10">{t(item.key)}</span>
              </a>
            ))}
          </nav>
          <LanguageToggle />
        </div>

        {/* Mobile */}
        <MobileMenu />
      </div>
    </header>
  );
}
