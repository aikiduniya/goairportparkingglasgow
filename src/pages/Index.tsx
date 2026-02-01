import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";

import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

// Lazy load below-fold sections to reduce initial JS bundle and improve TTI
const AboutSection = lazy(() => import("@/components/AboutSection"));
const AirportNetwork = lazy(() => import("@/components/AirportNetwork"));
const Partners = lazy(() => import("@/components/Partners"));
const WhyChooseUs = lazy(() => import("@/components/WhyChooseUs"));
const Services = lazy(() => import("@/components/Services"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const TawkToChat = lazy(() => import("@/components/TawkToChat"));

// Minimal section placeholder for lazy sections
const SectionFallback = ({ className = "" }: { className?: string }) => (
  <div className={`py-16 md:py-24 ${className}`} />
);

const Index = () => {
  const location = useLocation();

  // Handle scroll to section when navigating from another page
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace("#", "");
      // Small delay to ensure components are rendered
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <HowItWorks />
        <Suspense fallback={<SectionFallback className="bg-cream" />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<SectionFallback className="bg-card" />}>
          <AirportNetwork />
        </Suspense>
        <Suspense fallback={<SectionFallback className="bg-muted" />}>
          <Partners />
        </Suspense>
        <Suspense fallback={<SectionFallback className="bg-cream" />}>
          <WhyChooseUs />
        </Suspense>
        <Suspense fallback={<SectionFallback className="bg-card" />}>
          <Services />
        </Suspense>
        <Suspense fallback={<SectionFallback className="bg-card" />}>
          <Testimonials />
        </Suspense>
        <FAQSection />
      </main>
      <Footer />
      <Suspense fallback={null}>
        <TawkToChat />
      </Suspense>
    </div>
  );
};

export default Index;
