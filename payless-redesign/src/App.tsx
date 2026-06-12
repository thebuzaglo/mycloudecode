import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";

const Companies = lazy(() => import("@/pages/Companies"));
const CompanyPage = lazy(() => import("@/pages/CompanyPage"));
const Offers = lazy(() => import("@/pages/Offers"));
const Tools = lazy(() => import("@/pages/Tools"));
const ToolDetail = lazy(() => import("@/pages/ToolDetail"));
const ConsistencyCalculator = lazy(() => import("@/pages/ConsistencyCalculator"));
const RiskCalculator = lazy(() => import("@/pages/RiskCalculator"));
const TraderQuiz = lazy(() => import("@/pages/TraderQuiz"));
const CertificateGenerator = lazy(() => import("@/pages/CertificateGenerator"));
const Services = lazy(() => import("@/pages/Services"));
const FundedAward = lazy(() => import("@/pages/services/FundedAward"));
const AcHolding = lazy(() => import("@/pages/services/AcHolding"));
const InteractiveBrokers = lazy(() => import("@/pages/services/InteractiveBrokers"));
const AslanCpa = lazy(() => import("@/pages/services/AslanCpa"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const Glossary = lazy(() => import("@/pages/Glossary"));
const GlossaryTerm = lazy(() => import("@/pages/GlossaryTerm"));
const About = lazy(() => import("@/pages/About"));
const HowItWorks = lazy(() => import("@/pages/HowItWorks"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const Contact = lazy(() => import("@/pages/Contact"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Accessibility = lazy(() => import("@/pages/Accessibility"));
const SitemapPage = lazy(() => import("@/pages/SitemapPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="relative h-12 w-12">
        <span className="absolute inset-0 rounded-full border-2 border-white/10" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-secondary" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="*"
          element={
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/companies" element={<Companies />} />
                <Route path="/company/:id" element={<CompanyPage />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/tools/consistency-calculator" element={<ConsistencyCalculator />} />
                <Route path="/tools/risk-calculator" element={<RiskCalculator />} />
                <Route path="/tools/match" element={<TraderQuiz />} />
                <Route path="/tools/certificate-generator" element={<CertificateGenerator />} />
                <Route path="/tools/:id" element={<ToolDetail />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/funded-award" element={<FundedAward />} />
                <Route path="/services/ac-holding" element={<AcHolding />} />
                <Route path="/services/interactive-brokers" element={<InteractiveBrokers />} />
                <Route path="/services/aslan-cpa" element={<AslanCpa />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/glossary" element={<Glossary />} />
                <Route path="/glossary/:slug" element={<GlossaryTerm />} />
                <Route path="/about" element={<About />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/accessibility" element={<Accessibility />} />
                <Route path="/sitemap" element={<SitemapPage />} />
                <Route path="/certificates" element={<CertificateGenerator />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
