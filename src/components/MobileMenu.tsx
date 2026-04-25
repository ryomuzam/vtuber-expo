"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import LanguageToggle from "./LanguageToggle";
import NavLink from "./NavLink";

type Props = {
  schedulePublic?: boolean;
  ticketPublic?: boolean;
  xUrl?: string;
};

export default function MobileMenu({ schedulePublic = false, ticketPublic = false, xUrl }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Header");
  const locale = useLocale();

  const navItems = [
    { key: "whatis", href: `/${locale}#about` },
    { key: "news", href: `/${locale}#news` },
    { key: "overview", href: `/${locale}#overview` },
    ...(ticketPublic ? [{ key: "ticket" as const, href: `/${locale}#ticket` }] : []),
    ...(schedulePublic ? [{ key: "schedule" as const, href: `/${locale}#schedule` }] : []),
  ];

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span className={`h-0.5 w-6 rounded-full bg-gray-700 transition-all duration-300 ${isOpen ? "translate-y-2 rotate-45" : ""}`} />
        <span className={`h-0.5 w-6 rounded-full bg-gray-700 transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`} />
        <span className={`h-0.5 w-6 rounded-full bg-gray-700 transition-all duration-300 ${isOpen ? "-translate-y-2 -rotate-45" : ""}`} />
      </button>

      {/* Overlay — starts below header (header height ≈ 53px on mobile) */}
      <div
        className={`fixed inset-x-0 top-[53px] z-40 flex h-[calc(100dvh-53px)] flex-col bg-white transition-all duration-300 ${
          isOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-full opacity-0"
        }`}
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-7">
          {navItems.map((item, i) => (
            <NavLink
              key={item.key}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`text-xl font-bold tracking-wider text-gray-800 transition-all duration-300 hover:text-[#3D7FE0] ${
                isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: isOpen ? `${i * 50}ms` : "0ms" }}
            >
              {t(item.key)}
            </NavLink>
          ))}
        </div>

        {/* Bottom: social + language */}
        <div
          className={`flex flex-col items-center gap-5 pb-10 transition-all duration-300 ${
            isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: isOpen ? `${navItems.length * 50}ms` : "0ms" }}
        >
          {xUrl && (
            <div className="flex items-center gap-6">
              <a href={xUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#3D7FE0]" aria-label="X (Twitter)">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          )}
          <LanguageToggle />
        </div>
      </div>
    </div>
  );
}
