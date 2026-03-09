import { news as staticNews, type NewsItem } from "@/data/news";
import { agencies as staticAgencies, type Agency } from "@/data/agencies";
import { sponsors as staticSponsors, tieups as staticTieups, type Sponsor, type Tieup } from "@/data/sponsors";

export type { NewsItem, Agency, Sponsor, Tieup };

export type HeroSlide = {
  id: number;
  label: string;
  src: string;
};

export type OverviewLocaleData = {
  eventNameValue: string;
  dateValue: string;
  hoursValue: string;
  venueValue: string;
  admissionValue: string;
  organizerValue: string;
  coordinatorValue: string;
};

export type OverviewData = {
  ja: OverviewLocaleData;
  en: OverviewLocaleData;
};

export type SocialLinks = {
  xUrl: string;
  youtubeUrl: string;
};

const staticOverviewData: OverviewData = {
  ja: {
    eventNameValue: "VTUBER EXPO 2026",
    dateValue: "2026年5月3日(土) - 5月4日(日)",
    hoursValue: "",
    venueValue: "ベルサール秋葉原 1階",
    admissionValue: "入場無料（一部有料プログラムあり）",
    organizerValue: "VEXZ",
    coordinatorValue: "",
  },
  en: {
    eventNameValue: "VTUBER EXPO 2026",
    dateValue: "May 3 (Sat) - May 4 (Sun), 2026",
    hoursValue: "",
    venueValue: "Bellesalle Akihabara 1F",
    admissionValue: "Free admission (some paid programs)",
    organizerValue: "VEXZ",
    coordinatorValue: "",
  },
};

const staticSocialLinks: SocialLinks = {
  xUrl: "https://x.com/VTUBEREXPO2026",
  youtubeUrl: "https://www.youtube.com/@VTUBEREXPO",
};

const staticHeroSlides: HeroSlide[] = [
  { id: 1, label: "Key Visual 1", src: "/images/hero/kv1.png" },
  { id: 2, label: "Key Visual 2", src: "/images/hero/kv1.png" },
  { id: 3, label: "Key Visual 3", src: "/images/hero/kv1.png" },
];

async function getKV() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return null;
  }
  try {
    const { kv } = await import("@vercel/kv");
    return kv;
  } catch {
    return null;
  }
}

// Hero slides
export async function getHeroSlides(): Promise<HeroSlide[]> {
  const kv = await getKV();
  if (!kv) return staticHeroSlides;
  const data = await kv.get<HeroSlide[]>("hero:slides");
  return data ?? staticHeroSlides;
}

export async function setHeroSlides(slides: HeroSlide[]): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  await kv.set("hero:slides", slides);
}

// News
export async function getNews(): Promise<NewsItem[]> {
  const kv = await getKV();
  if (!kv) return staticNews;
  const data = await kv.get<NewsItem[]>("news:list");
  return data ?? staticNews;
}

export async function getNewsItem(slug: string): Promise<NewsItem | null> {
  const list = await getNews();
  return list.find((n) => n.slug === slug) ?? null;
}

export async function setNews(list: NewsItem[]): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  await kv.set("news:list", list);
}

export async function upsertNewsItem(item: NewsItem): Promise<void> {
  const list = await getNews();
  const idx = list.findIndex((n) => n.slug === item.slug);
  if (idx >= 0) {
    list[idx] = item;
  } else {
    list.unshift(item);
  }
  await setNews(list);
}

export async function deleteNewsItem(slug: string): Promise<void> {
  const list = await getNews();
  await setNews(list.filter((n) => n.slug !== slug));
}

// Agencies
export async function getAgencies(): Promise<Agency[]> {
  const kv = await getKV();
  if (!kv) return staticAgencies;
  const data = await kv.get<Agency[]>("logos:agencies");
  return data ?? staticAgencies;
}

export async function setAgencies(list: Agency[]): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  await kv.set("logos:agencies", list);
}

// Sponsors
export async function getSponsors(): Promise<Sponsor[]> {
  const kv = await getKV();
  if (!kv) return staticSponsors;
  const data = await kv.get<Sponsor[]>("logos:sponsors");
  return data ?? staticSponsors;
}

export async function setSponsors(list: Sponsor[]): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  await kv.set("logos:sponsors", list);
}

// Tieups
export async function getTieups(): Promise<Tieup[]> {
  const kv = await getKV();
  if (!kv) return staticTieups;
  const data = await kv.get<Tieup[]>("logos:tieups");
  return data ?? staticTieups;
}

export async function setTieups(list: Tieup[]): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  await kv.set("logos:tieups", list);
}

// Overview
export async function getOverviewData(): Promise<OverviewData> {
  const kv = await getKV();
  if (!kv) return staticOverviewData;
  const data = await kv.get<OverviewData>("overview:data");
  return data ?? staticOverviewData;
}

export async function setOverviewData(data: OverviewData): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  await kv.set("overview:data", data);
}

// Social Links
export async function getSocialLinks(): Promise<SocialLinks> {
  const kv = await getKV();
  if (!kv) return staticSocialLinks;
  const data = await kv.get<SocialLinks>("social:links");
  return data ?? staticSocialLinks;
}

export async function setSocialLinks(links: SocialLinks): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  await kv.set("social:links", links);
}

// Venue Map
export type BoothType = "booth" | "stage" | "entrance" | "goods" | "food" | "other";

export type VenueBooth = {
  id: string;
  name: string;
  type: BoothType;
  description: string;
  x: number;
  y: number;
};

export type VenueMapData = {
  isPublic: boolean;
  mapImageUrl: string;
  booths: VenueBooth[];
};

const staticVenueMapData: VenueMapData = {
  isPublic: false,
  mapImageUrl: "/images/venue/floor-plan.svg",
  booths: [
    { id: "b01", name: "B01", type: "booth", description: "", x: 10.6, y: 34.2 },
    { id: "b02", name: "B02", type: "booth", description: "", x: 24.4, y: 34.2 },
    { id: "b03", name: "B03", type: "booth", description: "", x: 38.1, y: 34.2 },
    { id: "b04", name: "B04", type: "booth", description: "", x: 10.6, y: 49.2 },
    { id: "b05", name: "B05", type: "booth", description: "", x: 24.4, y: 49.2 },
    { id: "b06", name: "B06", type: "booth", description: "", x: 38.1, y: 49.2 },
    { id: "b07", name: "B07", type: "booth", description: "", x: 10.6, y: 64.2 },
    { id: "b08", name: "B08", type: "booth", description: "", x: 24.4, y: 64.2 },
    { id: "b09", name: "B09", type: "booth", description: "", x: 38.1, y: 64.2 },
    { id: "b10", name: "B10", type: "booth", description: "", x: 61.9, y: 34.2 },
    { id: "b11", name: "B11", type: "booth", description: "", x: 75.6, y: 34.2 },
    { id: "b12", name: "B12", type: "booth", description: "", x: 89.4, y: 34.2 },
    { id: "b13", name: "B13", type: "booth", description: "", x: 61.9, y: 49.2 },
    { id: "b14", name: "B14", type: "booth", description: "", x: 75.6, y: 49.2 },
    { id: "b15", name: "B15", type: "booth", description: "", x: 89.4, y: 49.2 },
    { id: "b16", name: "B16", type: "booth", description: "", x: 61.9, y: 64.2 },
    { id: "b17", name: "B17", type: "booth", description: "", x: 75.6, y: 64.2 },
    { id: "b18", name: "B18", type: "booth", description: "", x: 89.4, y: 64.2 },
    { id: "stage", name: "MAIN STAGE", type: "stage", description: "メインステージエリア", x: 50, y: 13.3 },
    { id: "goods", name: "グッズ売り場", type: "goods", description: "限定グッズ販売", x: 14.8, y: 82.5 },
    { id: "entrance", name: "エントランス", type: "entrance", description: "入退場口", x: 50, y: 82.5 },
    { id: "food", name: "フードコート", type: "food", description: "フード・ドリンク販売", x: 85.4, y: 82.5 },
  ],
};

export async function getVenueMapData(): Promise<VenueMapData> {
  const kv = await getKV();
  if (!kv) return staticVenueMapData;
  const data = await kv.get<VenueMapData>("venue:map");
  return data ?? staticVenueMapData;
}

export async function setVenueMapData(data: VenueMapData): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  await kv.set("venue:map", data);
}

// Event Schedule
export type ScheduleSlot = {
  id: string;
  day: 1 | 2;
  startTime: string;
  endTime: string;
  title: string;
  performers: string;
  description: string;
};

export type EventScheduleData = {
  isPublic: boolean;
  day1Label: string;
  day2Label: string;
  items: ScheduleSlot[];
};

const staticEventScheduleData: EventScheduleData = {
  isPublic: false,
  day1Label: "DAY 1 - 5/3 SUN",
  day2Label: "DAY 2 - 5/4 MON",
  items: [
    { id: "d1-1", day: 1, startTime: "10:00", endTime: "", title: "開場", performers: "", description: "" },
    { id: "d1-2", day: 1, startTime: "11:00", endTime: "12:00", title: "オープニングステージ", performers: "", description: "VTuber EXPO 2026 開幕セレモニー" },
    { id: "d1-3", day: 1, startTime: "12:00", endTime: "13:00", title: "VTuberトークライブ", performers: "", description: "人気VTuberによるスペシャルトーク" },
    { id: "d1-4", day: 1, startTime: "14:00", endTime: "16:00", title: "ライブショーケース Part 1", performers: "", description: "注目VTuberによるライブパフォーマンス" },
    { id: "d1-5", day: 1, startTime: "16:00", endTime: "17:30", title: "スペシャルステージ", performers: "", description: "サプライズゲストによるスペシャルプログラム" },
    { id: "d1-6", day: 1, startTime: "18:00", endTime: "", title: "DAY 1 終了", performers: "", description: "" },
    { id: "d2-1", day: 2, startTime: "10:00", endTime: "", title: "開場", performers: "", description: "" },
    { id: "d2-2", day: 2, startTime: "11:00", endTime: "12:00", title: "モーニングステージ", performers: "", description: "DAY 2 スペシャルオープニング" },
    { id: "d2-3", day: 2, startTime: "12:30", endTime: "14:00", title: "クリエイタートーク", performers: "", description: "VTuber技術・文化の最前線トークセッション" },
    { id: "d2-4", day: 2, startTime: "14:00", endTime: "16:00", title: "ライブショーケース Part 2", performers: "", description: "DAY 2 ライブパフォーマンス" },
    { id: "d2-5", day: 2, startTime: "16:00", endTime: "18:00", title: "グランドフィナーレ", performers: "", description: "VTuber EXPO 2026 クロージングステージ" },
    { id: "d2-6", day: 2, startTime: "18:00", endTime: "", title: "閉場", performers: "", description: "" },
  ],
};

export async function getEventScheduleData(): Promise<EventScheduleData> {
  const kv = await getKV();
  if (!kv) return staticEventScheduleData;
  const data = await kv.get<EventScheduleData>("event:schedule");
  return data ?? staticEventScheduleData;
}

export async function setEventScheduleData(data: EventScheduleData): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  await kv.set("event:schedule", data);
}
