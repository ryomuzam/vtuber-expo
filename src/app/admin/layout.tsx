import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "管理画面 | VTUBER EXPO 2026",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 text-gray-900 antialiased">{children}</div>
  );
}
