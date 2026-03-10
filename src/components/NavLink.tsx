"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

type Props = {
  href: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  onClick?: () => void;
};

export default function NavLink({ href, className, style, children, onClick }: Props) {
  const pathname = usePathname();
  const locale = useLocale();

  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHomePage && href.includes("#")) {
      const hash = href.split("#")[1];
      const el = document.getElementById(hash);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, "", `#${hash}`);
        onClick?.();
      }
    } else {
      onClick?.();
    }
  };

  return (
    <a href={href} className={className} style={style} onClick={handleClick}>
      {children}
    </a>
  );
}
