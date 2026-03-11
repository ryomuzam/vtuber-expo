import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { useTranslations, useLocale } from "next-intl";
import { getNews } from "@/lib/data";
import type { NewsItem } from "@/data/news";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const news = await getNews();
  return routing.locales.flatMap((locale) =>
    news.map((item) => ({ locale, slug: item.slug }))
  );
}

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const news = await getNews();
  const item = news.find((n) => n.slug === slug);
  if (!item) notFound();

  return (
    <>
      <Header />
      <main className="pt-16">
        <NewsDetailContent item={item} />
      </main>
      <Footer />
    </>
  );
}

function linkify(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent-blue underline break-all hover:text-accent-magenta transition-colors"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}

function NewsDetailContent({ item }: { item: NewsItem }) {
  const t = useTranslations("News");
  const locale = useLocale();
  const localePath = locale === "ja" ? "" : "/en";

  const title = locale === "ja" ? item.title.ja : item.title.en;
  const body = locale === "ja" ? item.body.ja : item.body.en;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      {/* Back link */}
      <Link
        href={`${localePath}/#news`}
        className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-accent-blue transition-colors hover:text-accent-magenta"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {t("backToList")}
      </Link>

      {/* Hero image */}
      <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl">
        <Image
          src={item.image || "/images/news/vtuberexpo_news.png"}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Meta */}
      <time className="text-sm font-semibold text-accent-blue">{item.date}</time>
      <h1 className="mt-3 text-2xl font-bold text-pop-text md:text-3xl">{title}</h1>

      {/* Body */}
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-pop-muted md:text-base">
        {body.split("\n").map((line, i) => (
          <p key={i}>{line ? linkify(line) : "\u00A0"}</p>
        ))}
      </div>
    </article>
  );
}
