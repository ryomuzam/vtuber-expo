import { news as staticNews, type NewsItem } from "@/data/news";
import { agencies as staticAgencies, type Agency } from "@/data/agencies";
import { sponsors as staticSponsors, tieups as staticTieups, type Sponsor, type Tieup } from "@/data/sponsors";

export type { NewsItem, Agency, Sponsor, Tieup };

export type HeroSlide = {
  id: number;
  label: string;
  src: string;
  url?: string;
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

export type SocialLinkItem = {
  id: string;
  platform: string;
  url: string;
  isPublic: boolean;
};

export type SocialLinks = {
  isPublic: boolean;
  items: SocialLinkItem[];
  /** @deprecated — kept for backward compatibility migration */
  xUrl?: string;
  /** @deprecated — kept for backward compatibility migration */
  youtubeUrl?: string;
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
  isPublic: true,
  items: [
    { id: "x", platform: "x", url: "https://x.com/VTUBEREXPO2026", isPublic: true },
    { id: "youtube", platform: "youtube", url: "https://www.youtube.com/@VTUBEREXPO", isPublic: true },
  ],
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
  if (!data) return staticSocialLinks;
  // Migrate old format (xUrl/youtubeUrl only, no items)
  if (!data.items) {
    const migrated: SocialLinks = {
      isPublic: data.isPublic ?? true,
      items: [
        { id: "x", platform: "x", url: data.xUrl ?? "", isPublic: true },
        { id: "youtube", platform: "youtube", url: data.youtubeUrl ?? "", isPublic: true },
      ],
    };
    return migrated;
  }
  return { ...data, isPublic: data.isPublic ?? true };
}

export async function setSocialLinks(links: SocialLinks): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  await kv.set("social:links", links);
}

// Venue Map
export type PinCategory = {
  id: string;
  name: string;
  color: string;
};

export type VenueBooth = {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  logoUrl?: string;
  url?: string;
  x: number;
  y: number;
};

export type VenueMapData = {
  isPublic: boolean;
  mapImageUrl: string;
  pinCategories: PinCategory[];
  booths: VenueBooth[];
};

const defaultPinCategories: PinCategory[] = [
  { id: "booth", name: "展示ブース", color: "#3D7FE0" },
  { id: "stage", name: "ステージ", color: "#E040FB" },
  { id: "entrance", name: "エントランス", color: "#22c55e" },
  { id: "goods", name: "グッズ", color: "#a855f7" },
  { id: "food", name: "フード", color: "#f97316" },
  { id: "other", name: "その他", color: "#6b7280" },
];

const staticVenueMapData: VenueMapData = {
  isPublic: false,
  mapImageUrl: "/images/venue/vexpo_floormap_v3.png",
  pinCategories: defaultPinCategories,
  booths: [],
};

export async function getVenueMapData(): Promise<VenueMapData> {
  const kv = await getKV();
  if (!kv) return staticVenueMapData;
  const data = await kv.get<VenueMapData>("venue:map");
  if (!data) return staticVenueMapData;
  // 旧データに pinCategories がない場合のフォールバック
  return { ...data, pinCategories: data.pinCategories ?? defaultPinCategories };
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
  titleEn?: string;
  performers: string;
  performersEn?: string;
  description: string;
  descriptionEn?: string;
};

export type EventScheduleData = {
  isPublic: boolean;
  day1Label: string;
  day1LabelEn?: string;
  day2Label: string;
  day2LabelEn?: string;
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

// Logo Marquee
export type MarqueeSettings = {
  isPublic: boolean;
};

export async function getMarqueeSettings(): Promise<MarqueeSettings> {
  const kv = await getKV();
  if (!kv) return { isPublic: false };
  const data = await kv.get<MarqueeSettings>("marquee:settings");
  return data ?? { isPublic: false };
}

export async function setMarqueeSettings(settings: MarqueeSettings): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  await kv.set("marquee:settings", settings);
}

// Tiered Sponsors
export type SponsorTier = "gold" | "silver" | "bronze" | "sampling";

export type TieredSponsor = {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  tier: SponsorTier;
};

export type SponsorPageData = {
  isPublic: boolean;
  sponsors: TieredSponsor[];
};

const staticSponsorPageData: SponsorPageData = {
  isPublic: false,
  sponsors: [],
};

export async function getSponsorPageData(): Promise<SponsorPageData> {
  const kv = await getKV();
  if (!kv) return staticSponsorPageData;
  const data = await kv.get<SponsorPageData>("sponsor:page");
  return data ?? staticSponsorPageData;
}

export async function setSponsorPageData(data: SponsorPageData): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  await kv.set("sponsor:page", data);
}

// Privacy Policy
export type PrivacyPolicyData = {
  content: string;
  updatedAt: string;
};

export async function getPrivacyPolicyData(): Promise<PrivacyPolicyData> {
  const kv = await getKV();
  if (!kv) return { content: "", updatedAt: "" };
  const data = await kv.get<PrivacyPolicyData>("privacy:policy");
  return data ?? { content: "", updatedAt: "" };
}

export async function setPrivacyPolicyData(data: PrivacyPolicyData): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  await kv.set("privacy:policy", data);
}

// Ticket
export type TicketItem = {
  id: string;
  name: string;
  nameEn?: string;
  price: string;
  priceEn?: string;
  description: string;
  descriptionEn?: string;
  purchaseUrl: string;
  isSoldOut?: boolean;
};

export type TicketData = {
  isPublic: boolean;
  floatingButtonEnabled: boolean;
  note: string;
  noteEn?: string;
  items: TicketItem[];
};

const staticTicketData: TicketData = {
  isPublic: false,
  floatingButtonEnabled: false,
  note: "",
  items: [],
};

export async function getTicketData(): Promise<TicketData> {
  const kv = await getKV();
  if (!kv) return staticTicketData;
  const data = await kv.get<TicketData>("ticket:data");
  return data ?? staticTicketData;
}

export async function setTicketData(data: TicketData): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  await kv.set("ticket:data", data);
}

// Contact Form
export type ContactInquiry = {
  id: string;
  email: string;
  inquiryType: string;
  message: string;
  createdAt: string;
  isRead: boolean;
};

export type ContactSettings = {
  isPublic: boolean;
  notifyEmail: string;
  inquiryTypes: string[];
};

const defaultInquiryTypes = [
  "出展・ブース出展に関するお問い合わせ",
  "来場・チケットに関するお問い合わせ",
  "取材・メディアに関するお問い合わせ",
  "スポンサーシップに関するお問い合わせ",
  "コラボレーション・タイアップに関するお問い合わせ",
  "その他のお問い合わせ",
];

export async function getContactSettings(): Promise<ContactSettings> {
  const kv = await getKV();
  if (!kv) return { isPublic: false, notifyEmail: "", inquiryTypes: defaultInquiryTypes };
  const data = await kv.get<ContactSettings>("contact:settings");
  if (!data) return { isPublic: false, notifyEmail: "", inquiryTypes: defaultInquiryTypes };
  // 旧データに inquiryTypes がない場合のフォールバック
  return { ...data, inquiryTypes: data.inquiryTypes ?? defaultInquiryTypes };
}

export async function setContactSettings(data: ContactSettings): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  await kv.set("contact:settings", data);
}

export async function getContactInquiries(): Promise<ContactInquiry[]> {
  const kv = await getKV();
  if (!kv) return [];
  const data = await kv.get<ContactInquiry[]>("contact:inquiries");
  return data ?? [];
}

export async function addContactInquiry(inquiry: Pick<ContactInquiry, "email" | "inquiryType" | "message">): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  const list = await getContactInquiries();
  const newItem: ContactInquiry = {
    ...inquiry,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    isRead: false,
  };
  await kv.set("contact:inquiries", [newItem, ...list]);
}

export async function markContactInquiryRead(id: string): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  const list = await getContactInquiries();
  const updated = list.map((item) => (item.id === id ? { ...item, isRead: true } : item));
  await kv.set("contact:inquiries", updated);
}

export async function deleteContactInquiry(id: string): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  const list = await getContactInquiries();
  await kv.set("contact:inquiries", list.filter((item) => item.id !== id));
}

// About Intro Section
export type AboutIntroData = {
  isPublic: boolean;
  sectionTitleJa: string;
  sectionTitleEn: string;
  leadCopyJa: string;
  leadCopyEn: string;
};

// About Cards Section
export type AboutCardData = {
  titleJa: string;
  titleEn: string;
  labelJa?: string;
  labelEn?: string;
  descJa: string;
  descEn: string;
  iconUrl?: string;
};

export type AboutData = {
  isPublic: boolean;
  sectionTitleJa: string;
  sectionTitleEn: string;
  leadCopyJa: string;
  leadCopyEn: string;
  cards: AboutCardData[];
};

const staticAboutIntroData: AboutIntroData = {
  isPublic: true,
  sectionTitleJa: "世界初開催！",
  sectionTitleEn: "World's First!",
  leadCopyJa: "世界初!?VTuberに特化した博覧会が、GWの秋葉原に誕生!\n展示、ステージ、体験コーナー全てがVTuber!\nVが大好きなあなたも、これから好きになるあなたも\nみんなで楽しめるイベントです！",
  leadCopyEn: "The world's first VTuber-dedicated expo is coming to Akihabara during Golden Week!\nExhibitions, stages, hands-on experiences — everything is VTuber!\nWhether you already love VTubers or are just getting started,\nthis is an event everyone can enjoy!",
};

const staticAboutData: AboutData = {
  isPublic: true,
  sectionTitleJa: "世界初開催！",
  sectionTitleEn: "World's First!",
  leadCopyJa: "世界初!?VTuberに特化した博覧会が、GWの秋葉原に誕生!\n展示、ステージ、体験コーナー全てがVTuber!\nVが大好きなあなたも、これから好きになるあなたも\nみんなで楽しめるイベントです！",
  leadCopyEn: "The world's first VTuber-dedicated expo is coming to Akihabara during Golden Week!\nExhibitions, stages, hands-on experiences — everything is VTuber!\nWhether you already love VTubers or are just getting started,\nthis is an event everyone can enjoy!",
  cards: [
    {
      titleJa: "「なれる」",
      titleEn: "\"Become\"",
      labelJa: "VTuberに",
      labelEn: "With VTubers",
      descJa: "最先端のモーションキャプチャ体験！\nその場であなたがVTuberに!?",
      descEn: "Experience cutting-edge motion capture!\nBecome a VTuber on the spot!?",
    },
    {
      titleJa: "「話せる」",
      titleEn: "\"Talk\"",
      labelJa: "VTuberと",
      labelEn: "With VTubers",
      descJa: "VTuberとお話ししてみませんか？\nお金を使わずに投げ銭体験もできちゃう!?",
      descEn: "Chat with VTubers!\nTry the virtual tipping experience for free!?",
    },
    {
      titleJa: "「遊べる」",
      titleEn: "\"Play\"",
      labelJa: "VTuberと",
      labelEn: "With VTubers",
      descJa: "特設ステージでミニライブやトークショー\n発表会など楽しい企画が目白押し！",
      descEn: "Mini-lives, talk shows, presentations\nand more fun events at the special stage!",
    },
    {
      titleJa: "「知れる」",
      titleEn: "\"Discover\"",
      labelJa: "VTuberを",
      labelEn: "About VTubers",
      descJa: "人気VTuberやプロダクション、\n関連企業の展示が盛りだくさん！",
      descEn: "Packed with exhibits from popular VTubers,\nproductions, and related companies!",
    },
  ],
};

export async function getAboutIntroData(): Promise<AboutIntroData> {
  const kv = await getKV();
  if (!kv) return staticAboutIntroData;
  const data = await kv.get<AboutIntroData>("about:intro");
  return data ?? staticAboutIntroData;
}

export async function setAboutIntroData(data: AboutIntroData): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  await kv.set("about:intro", data);
}

export async function getAboutData(): Promise<AboutData> {
  const kv = await getKV();
  if (!kv) return staticAboutData;
  const data = await kv.get<AboutData>("about:data");
  if (!data) return staticAboutData;
  return { ...staticAboutData, ...data, isPublic: data.isPublic ?? true };
}

export async function setAboutData(data: AboutData): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  await kv.set("about:data", data);
}

// VTuber Wall
export type VTuberWallData = {
  isPublic: boolean;
  backgroundImageUrl?: string;
  bannerImageUrl: string;
  formUrl: string;
  titleJa: string;
  titleEn: string;
  subtitleJa: string;
  subtitleEn: string;
  descriptionJa: string;
  descriptionEn: string;
  buttonLabelJa: string;
  buttonLabelEn: string;
  deadlineJa: string;
  deadlineEn: string;
};

const staticVTuberWallData: VTuberWallData = {
  isPublic: false,
  bannerImageUrl: "",
  formUrl: "",
  titleJa: "VTuberウォール 募集開始！",
  titleEn: "VTuber Wall — Now Accepting Applications!",
  subtitleJa: "参加型企画",
  subtitleEn: "Participatory Project",
  descriptionJa: "あなたのアイコンが秋葉原に！VTuber・Vライバーとして活動されている方なら誰でも参加OK。ご自身の活動アイコン画像を提供いただき、会場の巨大ウォールに掲出します。",
  descriptionEn: "Your icon in Akihabara! Open to all active VTubers and VLivers. Submit your activity icon to be featured on the giant wall at the venue.",
  buttonLabelJa: "応募フォームはこちら",
  buttonLabelEn: "Apply Here",
  deadlineJa: "募集期間：2026年3月末日まで",
  deadlineEn: "Deadline: End of March 2026",
};

export async function getVTuberWallData(): Promise<VTuberWallData> {
  const kv = await getKV();
  if (!kv) return staticVTuberWallData;
  const data = await kv.get<VTuberWallData>("vtuber:wall");
  return data ?? staticVTuberWallData;
}

export async function setVTuberWallData(data: VTuberWallData): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  await kv.set("vtuber:wall", data);
}

// Floating Characters
export type FloatingChar = {
  id: string;
  name: string;
  imageUrl: string;
};

export type FloatingCharsData = {
  isPublic: boolean;
  chars: FloatingChar[];
};

const staticFloatingCharsData: FloatingCharsData = {
  isPublic: false,
  chars: [],
};

export async function getFloatingCharsData(): Promise<FloatingCharsData> {
  const kv = await getKV();
  if (!kv) return staticFloatingCharsData;
  const data = await kv.get<FloatingCharsData>("floating:chars");
  return data ?? staticFloatingCharsData;
}

export async function setFloatingCharsData(data: FloatingCharsData): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  await kv.set("floating:chars", data);
}

// X Share tracking
export type ShareStats = {
  total: number;
  daily: Record<string, number>; // "YYYY-MM-DD" -> count
};

export async function getShareStats(): Promise<ShareStats> {
  const kv = await getKV();
  if (!kv) return { total: 0, daily: {} };
  const data = await kv.get<ShareStats>("share:stats");
  return data ?? { total: 0, daily: {} };
}

export async function incrementShareCount(): Promise<void> {
  const kv = await getKV();
  if (!kv) return;
  const stats = await getShareStats();
  const today = new Date().toISOString().split("T")[0];
  stats.total += 1;
  stats.daily[today] = (stats.daily[today] ?? 0) + 1;
  // Keep only last 30 days
  const keys = Object.keys(stats.daily).sort();
  if (keys.length > 30) {
    keys.slice(0, keys.length - 30).forEach((k) => delete stats.daily[k]);
  }
  await kv.set("share:stats", stats);
}
