import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AgencyMarquee from "@/components/AgencyMarquee";
import AboutSection from "@/components/AboutSection";
import NewsSection from "@/components/NewsSection";
import OverviewSection from "@/components/OverviewSection";
import FreeAdmissionBanner from "@/components/FreeAdmissionBanner";
import SocialSection from "@/components/SocialSection";
import Footer from "@/components/Footer";
import VenueMapSection from "@/components/VenueMapSection";
import EventScheduleSection from "@/components/EventScheduleSection";
import SponsorsSection from "@/components/SponsorsSection";
import ShareButton from "@/components/ShareButton";
import {
  getHeroSlides,
  getNews,
  getAgencies,
  getSponsors,
  getTieups,
  getVenueMapData,
  getEventScheduleData,
  getSponsorPageData,
  getMarqueeSettings,
} from "@/lib/data";

export const revalidate = 60;

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [slides, news, agencies, tieups, venueMap, eventSchedule, sponsorPage, marquee] =
    await Promise.all([
      getHeroSlides(),
      getNews(),
      getAgencies(),
      getTieups(),
      getVenueMapData(),
      getEventScheduleData(),
      getSponsorPageData(),
      getMarqueeSettings(),
    ]);

  return (
    <>
      <Header />
      <main>
        <HeroSection slides={slides} />
        {marquee.isPublic && <AgencyMarquee agencies={agencies} tieups={tieups} />}
        <AboutSection />
        <NewsSection news={news} />
        <OverviewSection />
        <FreeAdmissionBanner />
        {venueMap.isPublic && <VenueMapSection data={venueMap} />}
        {eventSchedule.isPublic && <EventScheduleSection data={eventSchedule} />}
        {sponsorPage.isPublic && <SponsorsSection data={sponsorPage} />}
        <div className="flex justify-center py-8 bg-gray-50">
          <ShareButton />
        </div>
        <SocialSection />
      </main>
      <Footer />
    </>
  );
}
