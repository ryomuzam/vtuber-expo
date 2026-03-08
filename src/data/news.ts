export type NewsItem = {
  slug: string;
  date: string;
  image?: string;
  title: { ja: string; en: string };
  description: { ja: string; en: string };
  body: { ja: string; en: string };
};

export const news: NewsItem[] = [
  {
    slug: "official-site-launched",
    date: "2026.02.19",
    title: {
      ja: "公式サイトを公開しました",
      en: "Official website launched",
    },
    description: {
      ja: "VTUBER EXPO 2026 の公式サイトを公開しました。イベント情報や出演者情報など、最新情報をお届けします。",
      en: "The official website for VTUBER EXPO 2026 is now live. Stay tuned for the latest event and performer information.",
    },
    body: {
      ja: "VTUBER EXPO 2026 の公式サイトを公開しました。\n\n本サイトでは、イベントの最新情報、出演者情報、タイムスケジュールなどをお届けしてまいります。\n\n今後の情報更新をお楽しみに！",
      en: "The official website for VTUBER EXPO 2026 is now live.\n\nThis site will provide the latest event information, performer details, and schedules.\n\nStay tuned for more updates!",
    },
  },
  {
    slug: "exhibitor-applications-open",
    date: "2026.02.15",
    title: {
      ja: "出展者募集を開始しました",
      en: "Exhibitor applications now open",
    },
    description: {
      ja: "VTUBER EXPO 2026 の出展者募集を開始しました。VTuber関連企業・団体の皆さまのご応募をお待ちしております。",
      en: "Exhibitor applications for VTUBER EXPO 2026 are now open. We welcome applications from VTuber-related companies and organizations.",
    },
    body: {
      ja: "VTUBER EXPO 2026 の出展者募集を開始しました。\n\nVTuber関連企業・団体の皆さまのご応募をお待ちしております。\n\n出展に関する詳細は、追って公開いたします。",
      en: "Exhibitor applications for VTUBER EXPO 2026 are now open.\n\nWe welcome applications from VTuber-related companies and organizations.\n\nMore details about exhibiting will be announced soon.",
    },
  },
  {
    slug: "lineup-first-wave",
    date: "2026.02.10",
    title: {
      ja: "出演事務所 第1弾を発表！",
      en: "First wave of participating agencies announced!",
    },
    description: {
      ja: "VTUBER EXPO 2026 に出演する VTuber 事務所の第1弾を発表しました。30以上の事務所が参加予定です。",
      en: "The first wave of VTuber agencies participating in VTUBER EXPO 2026 has been announced. Over 30 agencies are set to join.",
    },
    body: {
      ja: "VTUBER EXPO 2026 に出演する VTuber 事務所の第1弾を発表しました。\n\nホロライブプロダクション、にじさんじ、ぶいすぽっ！をはじめ、30以上の事務所が参加予定です。\n\n第2弾の発表もお楽しみに！",
      en: "The first wave of VTuber agencies participating in VTUBER EXPO 2026 has been announced.\n\nOver 30 agencies including Hololive Production, Nijisanji, and VSPO! are set to participate.\n\nStay tuned for the second wave announcement!",
    },
  },
  {
    slug: "event-announced",
    date: "2026.02.01",
    title: {
      ja: "VTUBER EXPO 2026 開催決定！",
      en: "VTUBER EXPO 2026 officially announced!",
    },
    description: {
      ja: "2026年5月3日-4日、ベルサール秋葉原にて VTUBER EXPO 2026 の開催が決定しました。入場無料でお届けする VTuber の祭典です。",
      en: "VTUBER EXPO 2026 will be held on May 3-4, 2026 at Bellesalle Akihabara. A VTuber festival with free admission.",
    },
    body: {
      ja: "VTUBER EXPO 2026 の開催が決定しました！\n\n日時：2026年5月3日(土) - 5月4日(日)\n会場：ベルサール秋葉原 1階\n入場：無料（一部有料プログラムあり）\n\nVTuber文化の祭典として、ライブ、トーク、展示、グッズ販売など多彩なコンテンツをお届けします。",
      en: "VTUBER EXPO 2026 has been officially announced!\n\nDate: May 3 (Sat) - May 4 (Sun), 2026\nVenue: Bellesalle Akihabara 1F\nAdmission: Free (some paid programs)\n\nAs a celebration of VTuber culture, we will offer a variety of content including live performances, talk shows, exhibitions, and merchandise.",
    },
  },
  {
    slug: "sponsor-recruitment",
    date: "2026.01.25",
    title: {
      ja: "協賛企業を募集しています",
      en: "Sponsorship opportunities available",
    },
    description: {
      ja: "VTUBER EXPO 2026 の協賛企業を募集しています。VTuber文化を一緒に盛り上げていただけるパートナーを歓迎します。",
      en: "We are seeking sponsors for VTUBER EXPO 2026. We welcome partners who want to support and grow VTuber culture together.",
    },
    body: {
      ja: "VTUBER EXPO 2026 の協賛企業を募集しています。\n\nVTuber文化を一緒に盛り上げていただけるパートナーを歓迎します。\n\n協賛プランの詳細については、お問い合わせください。",
      en: "We are seeking sponsors for VTUBER EXPO 2026.\n\nWe welcome partners who want to support and grow VTuber culture together.\n\nPlease contact us for details on sponsorship plans.",
    },
  },
  {
    slug: "teaser-site-launched",
    date: "2026.01.20",
    title: {
      ja: "ティザーサイトを公開しました",
      en: "Teaser site launched",
    },
    description: {
      ja: "VTUBER EXPO 2026 のティザーサイトを公開しました。今後の続報にご期待ください。",
      en: "The teaser site for VTUBER EXPO 2026 is now live. Stay tuned for more announcements.",
    },
    body: {
      ja: "VTUBER EXPO 2026 のティザーサイトを公開しました。\n\n今後、出演者情報やイベント詳細など、随時更新してまいります。\n\n続報をお楽しみに！",
      en: "The teaser site for VTUBER EXPO 2026 is now live.\n\nWe will be updating with performer information and event details.\n\nStay tuned for more!",
    },
  },
  {
    slug: "venue-confirmed",
    date: "2026.01.10",
    title: {
      ja: "会場がベルサール秋葉原に決定",
      en: "Venue confirmed: Bellesalle Akihabara",
    },
    description: {
      ja: "VTUBER EXPO 2026 の会場がベルサール秋葉原1階に決定しました。秋葉原駅から徒歩2分のアクセス良好な会場です。",
      en: "The venue for VTUBER EXPO 2026 has been confirmed as Bellesalle Akihabara 1F, just a 2-minute walk from Akihabara Station.",
    },
    body: {
      ja: "VTUBER EXPO 2026 の会場がベルサール秋葉原1階に決定しました。\n\n秋葉原駅から徒歩2分のアクセス良好な会場で、VTuber文化の祭典をお届けします。\n\n会場の詳細は追ってお知らせいたします。",
      en: "The venue for VTUBER EXPO 2026 has been confirmed as Bellesalle Akihabara 1F.\n\nConveniently located just a 2-minute walk from Akihabara Station.\n\nMore venue details will be shared soon.",
    },
  },
  {
    slug: "sns-accounts-open",
    date: "2026.01.05",
    title: {
      ja: "公式SNSアカウントを開設しました",
      en: "Official social media accounts launched",
    },
    description: {
      ja: "VTUBER EXPO 2026 の公式X（Twitter）およびYouTubeチャンネルを開設しました。フォロー＆チャンネル登録をお願いします。",
      en: "Official X (Twitter) and YouTube channels for VTUBER EXPO 2026 are now open. Please follow and subscribe!",
    },
    body: {
      ja: "VTUBER EXPO 2026 の公式SNSアカウントを開設しました。\n\n公式X（Twitter）およびYouTubeチャンネルで、最新情報をお届けしてまいります。\n\nフォロー＆チャンネル登録をお願いします！",
      en: "Official social media accounts for VTUBER EXPO 2026 are now open.\n\nFollow our X (Twitter) and subscribe to our YouTube channel for the latest updates!",
    },
  },
];
