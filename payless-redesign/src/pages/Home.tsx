import Seo from "@/components/Seo";
import MarketTicker from "@/components/layout/MarketTicker";
import Hero from "@/components/home/Hero";
import PartnersMarquee from "@/components/home/PartnersMarquee";
import FeaturedCompanies from "@/components/home/FeaturedCompanies";
import ComparisonTeaser from "@/components/home/ComparisonTeaser";
import WhyPayless from "@/components/home/WhyPayless";
import ServicesStrip from "@/components/home/ServicesStrip";
import VideosSection from "@/components/home/VideosSection";
import Testimonials from "@/components/home/Testimonials";
import NewsletterCta from "@/components/home/NewsletterCta";

export default function Home() {
  return (
    <>
      <Seo
        title="חברות המימון הטובות ביותר למסחר ב-2026 | Prop Firm Payless"
        description="השווה בין חברות המימון הטובות ביותר לשנת 2026 עם PAYLESS - הפלטפורמה המובילה בישראל להשוואת חברות מימון, הכוללת ביקורות, דירוגים, חוקים וחלוקות רווחים."
      />
      <MarketTicker />
      <Hero />
      <PartnersMarquee />
      <div className="beam-divider container" />
      <FeaturedCompanies />
      <WhyPayless />
      <ComparisonTeaser />
      <ServicesStrip />
      <VideosSection />
      <Testimonials />
      <NewsletterCta />
    </>
  );
}
