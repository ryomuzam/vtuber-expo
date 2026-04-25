import { setRequestLocale, getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AgencyMarquee from "@/components/AgencyMarquee";
import AboutIntroSection from "@/components/AboutIntroSection";
import AboutSection from "@/components/AboutSection";
import NewsSection from "@/components/NewsSection";
import VTuberWallSection from "@/components/VTuberWallSection";
import OverviewSection from "@/components/OverviewSection";
import FreeAdmissionBanner from "@/components/FreeAdmissionBanner";
import SocialSection from "@/components/SocialSection";
import VenueMapSection from "@/components/VenueMapSection";
import EventScheduleSection from "@/components/EventScheduleSection";
import SponsorsSection from "@/components/SponsorsSection";
import AccessSection from "@/components/AccessSection";
import ContactSection from "@/components/ContactSection";
import TicketSection from "@/components/TicketSection";
import TicketFloatingButton from "@/components/TicketFloatingButton";
import MobileBottomNav from "@/components/MobileBottomNav";
import FloatingCharacters from "@/components/FloatingCharacters";
import Footer from "@/components/Footer";
import {
  getHeroSlides,
  getNews,
  getAgencies,
  getSponsors,
  getTieups,
  getSocialLinks,
  getVenueMapData,
  getEventScheduleData,
  getSponsorPageData,
  getContactSettings,
  getFloatingCharsData,
  getAboutData,
  getAboutIntroData,
  getTicketData,
  getVTuberWallData,
} from "@/lib/data";

export const revalidate = 60;

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [slides, news, agencies, sponsors, tieups, socialLinks, venueMap, eventSchedule, sponsorPage, contactSettings, floatingChars, aboutData, aboutIntroData, ticketData, vtuberWallData, tVenueMap, tEventSchedule, tContact, tTicket] = await Promise.all([
    getHeroSlides(),
    getNews(),
    getAgencies(),
    getSponsors(),
    getTieups(),
    getSocialLinks(),
    getVenueMapData(),
    getEventScheduleData(),
    getSponsorPageData(),
    getContactSettings(),
    getFloatingCharsData(),
    getAboutData(),
    getAboutIntroData(),
    getTicketData(),
    getVTuberWallData(),
    getTranslations("VenueMap"),
    getTranslations("EventSchedule"),
    getTranslations("Contact"),
    getTranslations("Ticket"),
  ]);

  return (
    <>
      <Header
        schedulePublic={eventSchedule.isPublic}
        ticketPublic={ticketData.isPublic && ticketData.items.length > 0}
        xUrl={socialLinks.items.find((i) => i.platform === "x" && i.isPublic)?.url}
      />
      {floatingChars.isPublic && floatingChars.chars.length > 0 && (
        <FloatingCharacters chars={floatingChars.chars} />
      )}
      <main className="relative z-[2]">
        <HeroSection slides={slides} />
        <AgencyMarquee agencies={agencies} sponsors={sponsors} tieups={tieups} />
        {aboutIntroData.isPublic && <AboutIntroSection data={aboutIntroData} />}
        {aboutData.isPublic && <AboutSection data={aboutData} />}
        <NewsSection news={news.filter((n) => n.isPublic !== false)} />
        {vtuberWallData.isPublic && <VTuberWallSection data={vtuberWallData} />}
        <OverviewSection />
        <FreeAdmissionBanner />
        {ticketData.isPublic && ticketData.items.length > 0 && (
          <TicketSection data={ticketData} labels={{ sectionTitle: tTicket("sectionTitle"), sectionSubtitle: tTicket("sectionSubtitle"), buyButton: tTicket("buyButton"), soldOut: tTicket("soldOut") }} locale={locale} />
        )}
        <AccessSection />
        {venueMap.isPublic && <VenueMapSection data={venueMap} labels={{ sectionTitle: tVenueMap("sectionTitle"), sectionSubtitle: tVenueMap("sectionSubtitle") }} />}
        {eventSchedule.isPublic && <EventScheduleSection data={eventSchedule} labels={{ sectionTitle: tEventSchedule("sectionTitle"), sectionSubtitle: tEventSchedule("sectionSubtitle") }} locale={locale} />}
        {sponsorPage.isPublic && <SponsorsSection data={sponsorPage} />}
        <SocialSection />
        {contactSettings.isPublic && (
          <ContactSection inquiryTypes={contactSettings.inquiryTypes ?? []} labels={{
            sectionTitle: tContact("sectionTitle"),
            sectionSubtitle: tContact("sectionSubtitle"),
            description: tContact("description"),
            email: tContact("email"),
            emailRequired: tContact("emailRequired"),
            emailNote: tContact("emailNote"),
            inquiryType: tContact("inquiryType"),
            selectPlaceholder: tContact("selectPlaceholder"),
            message: tContact("message"),
            messagePlaceholder: tContact("messagePlaceholder"),
            privacyAgree: tContact("privacyAgree"),
            privacyPolicy: tContact("privacyPolicy"),
            privacyError: tContact("privacyError"),
            submitError: tContact("submitError"),
            submitting: tContact("submitting"),
            submit: tContact("submit"),
            doneTitle: tContact("doneTitle"),
            doneMessage: tContact("doneMessage"),
            note: tContact("note"),
          }} />
        )}
      </main>
      <div className="relative z-[2]"><Footer /></div>
      <MobileBottomNav />
      {ticketData.isPublic && ticketData.floatingButtonEnabled && (
        <TicketFloatingButton label={tTicket("floatingButton")} />
      )}
    </>
  );
}
