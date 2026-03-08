import { news as staticNews, type NewsItem } from "@/data/news";
import { agencies as staticAgencies, type Agency } from "@/data/agencies";
import { sponsors as staticSponsors, tieups as staticTieups, type Sponsor, type Tieup } from "@/data/sponsors";

export type { NewsItem, Agency, Sponsor, Tieup };

export type HeroSlide = {
  id: number;
  label: string;
  src: string;
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
