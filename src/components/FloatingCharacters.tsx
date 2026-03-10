"use client";

import type { FloatingChar } from "@/lib/data";

type Props = {
  chars: FloatingChar[];
};

// Pre-defined animation paths for variety
const PATHS = [
  { from: "-30vw 140vh", to: "110vw -20vh", dur: "18s" },
  { from: "120vw 130vh", to: "-20vw -10vh", dur: "22s" },
  { from: "-20vw -20vh", to: "110vw 110vh", dur: "20s" },
  { from: "110vw 50vh", to: "-20vw 30vh", dur: "24s" },
  { from: "-30vw 60vh", to: "120vw 20vh", dur: "19s" },
  { from: "50vw 130vh", to: "30vw -20vh", dur: "21s" },
  { from: "120vw -10vh", to: "-20vw 100vh", dur: "23s" },
  { from: "-10vw 30vh", to: "110vw 80vh", dur: "17s" },
];

export default function FloatingCharacters({ chars }: Props) {
  if (chars.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
      <style>{`
        ${chars.map((_, i) => {
          const path = PATHS[i % PATHS.length];
          const delay = (i * 3.5) % 12;
          return `
            @keyframes float-char-${i} {
              0% { translate: ${path.from}; opacity: 0; }
              5% { opacity: 0.35; }
              95% { opacity: 0.35; }
              100% { translate: ${path.to}; opacity: 0; }
            }
            .float-char-${i} {
              animation: float-char-${i} ${path.dur} ${delay}s linear infinite;
            }
          `;
        }).join("")}
      `}</style>
      {chars.map((char, i) => (
        <img
          key={char.id}
          src={char.imageUrl}
          alt=""
          className={`absolute h-16 w-16 object-contain opacity-0 md:h-24 md:w-24 float-char-${i}`}
        />
      ))}
    </div>
  );
}
