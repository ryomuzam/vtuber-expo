"use client";

import { useState, useEffect } from "react";

export default function TicketFloatingButton({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#ticket"
      className={`fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C94BEA] to-[#3D7FE0] px-5 py-3.5 text-sm font-black tracking-wider text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(201,75,234,0.4)] md:bottom-8 md:right-8 md:px-6 md:py-4 md:text-base ${
        visible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
      }`}
    >
      <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
      </svg>
      {label}
    </a>
  );
}
