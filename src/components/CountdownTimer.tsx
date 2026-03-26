"use client";

import { useState, useEffect } from "react";

type Props = {
  targetDate: string;
  labels?: { days: string; hours: string; minutes: string; seconds: string; expired: string };
};

const DEFAULT_LABELS = { days: "日", hours: "時間", minutes: "分", seconds: "秒", expired: "募集は終了しました" };

function calcRemaining(target: number) {
  const diff = target - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function CountdownTimer({ targetDate, labels: labelsProp }: Props) {
  const target = new Date(targetDate).getTime();
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const [remaining, setRemaining] = useState(() => calcRemaining(target));

  useEffect(() => {
    const id = setInterval(() => {
      const r = calcRemaining(target);
      setRemaining(r);
      if (!r) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!remaining) {
    return (
      <p className="text-center text-sm font-bold text-[#f87171]">{labels.expired}</p>
    );
  }

  const units = [
    { value: remaining.days, label: labels.days },
    { value: remaining.hours, label: labels.hours },
    { value: remaining.minutes, label: labels.minutes },
    { value: remaining.seconds, label: labels.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-2 md:gap-3">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-2 md:gap-3">
          <div className="flex flex-col items-center">
            <span className="min-w-[2.5rem] rounded-lg bg-white/10 px-2 py-1.5 text-center text-2xl font-black tabular-nums text-white backdrop-blur-sm md:min-w-[3.5rem] md:text-4xl">
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="mt-1 text-[10px] font-bold tracking-wider text-gray-400 md:text-xs">
              {u.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="mb-4 text-xl font-bold text-white/40 md:text-2xl">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
