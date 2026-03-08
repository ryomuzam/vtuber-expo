import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AgencyMarquee from "@/components/AgencyMarquee";
import AboutSection from "@/components/AboutSection";
import NewsSection from "@/components/NewsSection";
import OverviewSection from "@/components/OverviewSection";
import FreeAdmissionBanner from "@/components/FreeAdmissionBanner";
import LineupSection from "@/components/LineupSection";
import ScheduleSection from "@/components/ScheduleSection";
import SocialSection from "@/components/SocialSection";
import Footer from "@/components/Footer";
import {
  getHeroSlides,
  getNews,
  getAgencies,
  getSponsors,
  getTieups,
} from "@/lib/data";

export const revalidate = 60;

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [slides, news, agencies, sponsors, tieups] = await Promise.all([
    getHeroSlides(),
    getNews(),
    getAgencies(),
    getSponsors(),
    getTieups(),
  ]);

  return (
    <>
      <Header />
      <main>
        <HeroSection slides={slides} />
        {/* <AgencyMarquee /> */}{/* TODO: プレ公開後に表示 */}
        <AboutSection />
        <NewsSection news={news} />
        <OverviewSection />
        <FreeAdmissionBanner />
        {/* <LineupSection agencies={agencies} sponsors={sponsors} tieups={tieups} /> */}{/* TODO: プレ公開後に表示 */}
        {/* <ScheduleSection /> */}{/* TODO: プレ公開後に表示 */}
        <SocialSection />
      </main>
      <Footer />
    </>
  );
}
