import { lazy, Suspense } from "react";
import { Check } from "lucide-react";
import heroImage from "@/assets/dublin-airport-compressed.webp";
import { useDomainConfig } from "@/contexts/DomainConfigContext";

// Lazy load BookingForm to defer react-day-picker and related dependencies
const BookingForm = lazy(() => import("./BookingForm"));

const HeroSection = () => {
  const { config } = useDomainConfig();
  const webName = config?.title || "Go Airport Parking";

  const features = ["Pick-up and Drop-Off at Terminal", "2 To 3 Minutes Away From Airport", "Monitored Car Parks", "24/7 Live Support"];

  return (
    <section className="relative min-h-screen pt-20 md:pt-24 overflow-hidden">
      {/* Background Image - LCP element */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt={webName}
          width={1920}
          height={1280}
          className="w-full h-full object-cover"
          fetchPriority="high"
          decoding="sync"
          loading="eager"
        />
        <div className="absolute inset-0 bg-primary/80" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-8 sm:py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-6rem)] lg:min-h-[calc(100vh-8rem)]">
          {/* Left Content */}
          <div className="text-primary-foreground animate-slide-in-left text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3 sm:mb-4 text-white">
              {webName}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium mb-4 sm:mb-6 opacity-90">
              Save 60% On Your {webName} Space Today.
            </p>
            <ul className="space-y-2 sm:space-y-3 flex flex-col items-center lg:items-start">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg opacity-90">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-accent-foreground" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Content - Booking Form - CSS containment prevents layout shifts */}
          <div className="flex justify-center lg:justify-end" style={{ contain: "layout style", minHeight: "600px" }}>
            <Suspense
              fallback={
                <div className="booking-card w-full max-w-md min-h-[600px] animate-pulse bg-white/10 rounded-2xl" />
              }
            >
              <BookingForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
