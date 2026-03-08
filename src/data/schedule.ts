export type ScheduleItem = {
  time: string;
  title: { ja: string; en: string };
  description?: { ja: string; en: string };
};

export type DaySchedule = {
  day: string;
  items: ScheduleItem[];
};

export const schedule: DaySchedule[] = [
  {
    day: "DAY 1",
    items: [
      {
        time: "10:00",
        title: { ja: "開場", en: "Doors Open" },
      },
      {
        time: "11:00",
        title: { ja: "オープニングステージ", en: "Opening Stage" },
        description: {
          ja: "VTuber EXPO 2026 開幕セレモニー",
          en: "VTuber EXPO 2026 Opening Ceremony",
        },
      },
      {
        time: "12:00",
        title: { ja: "VTuberトークライブ", en: "VTuber Talk Live" },
        description: {
          ja: "人気VTuberによるスペシャルトーク",
          en: "Special talk by popular VTubers",
        },
      },
      {
        time: "14:00",
        title: { ja: "ライブショーケース Part 1", en: "Live Showcase Part 1" },
        description: {
          ja: "注目VTuberによるライブパフォーマンス",
          en: "Live performances by featured VTubers",
        },
      },
      {
        time: "16:00",
        title: { ja: "スペシャルステージ", en: "Special Stage" },
        description: {
          ja: "サプライズゲストによるスペシャルプログラム",
          en: "Special program with surprise guests",
        },
      },
      {
        time: "18:00",
        title: { ja: "DAY 1 エンディング", en: "DAY 1 Ending" },
      },
    ],
  },
  {
    day: "DAY 2",
    items: [
      {
        time: "10:00",
        title: { ja: "開場", en: "Doors Open" },
      },
      {
        time: "11:00",
        title: { ja: "モーニングステージ", en: "Morning Stage" },
        description: {
          ja: "DAY 2 スペシャルオープニング",
          en: "DAY 2 Special Opening",
        },
      },
      {
        time: "12:30",
        title: { ja: "クリエイタートーク", en: "Creator Talk" },
        description: {
          ja: "VTuber技術・文化の最前線トークセッション",
          en: "Talk session on VTuber technology and culture",
        },
      },
      {
        time: "14:00",
        title: { ja: "ライブショーケース Part 2", en: "Live Showcase Part 2" },
        description: {
          ja: "DAY 2 ライブパフォーマンス",
          en: "DAY 2 Live performances",
        },
      },
      {
        time: "16:00",
        title: { ja: "グランドフィナーレ", en: "Grand Finale" },
        description: {
          ja: "VTuber EXPO 2026 クロージングステージ",
          en: "VTuber EXPO 2026 Closing Stage",
        },
      },
      {
        time: "18:00",
        title: { ja: "閉場", en: "Doors Close" },
      },
    ],
  },
];
