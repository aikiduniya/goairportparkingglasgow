import stripeLogo from "@/assets/partners/stripe.webp";
import ryanairLogo from "@/assets/partners/ryanair.webp";
import parkviaLogo from "@/assets/partners/parkvia.webp";
import cloudflareLogo from "@/assets/partners/cloudflare.webp";
import trustpilotLogo from "@/assets/partners/trustpilot.svg";
import googleLogo from "@/assets/partners/google-partner.webp";
import facebookLogo from "@/assets/partners/facebook.png";
import youtubeLogo from "@/assets/partners/youtube.png";

const Partners = () => {
  const partners = [
    { name: "Stripe", logo: stripeLogo },
    { name: "Ryanair", logo: ryanairLogo },
    { name: "ParkVia", logo: parkviaLogo },
    { name: "Cloudflare", logo: cloudflareLogo },
    { name: "Trustpilot", logo: trustpilotLogo },
    { name: "Google Partner", logo: googleLogo },
    { name: "Facebook", logo: facebookLogo },
    { name: "YouTube", logo: youtubeLogo },
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-muted overflow-hidden">
      <div className="container mx-auto px-4 mb-6 sm:mb-8">
        <h3 className="text-center text-lg sm:text-xl font-bold text-foreground">
          Our Trusted Partners
        </h3>
      </div>

      {/* Marquee */}
      <div className="relative">
        <div className="flex marquee-track items-center">
          {/* First set */}
          {partners.map((partner, index) => (
            <div
              key={`first-${index}`}
              className="flex-shrink-0 mx-3 sm:mx-6 px-4 sm:px-8 py-3 sm:py-4 bg-white rounded-lg shadow-soft flex items-center justify-center h-16 sm:h-20 min-w-[140px] sm:min-w-[180px]"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                width={100}
                height={32}
                loading="lazy"
                decoding="async"
                className="max-h-8 sm:max-h-12 max-w-[100px] sm:max-w-[140px] w-auto object-contain"
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {partners.map((partner, index) => (
            <div
              key={`second-${index}`}
              className="flex-shrink-0 mx-3 sm:mx-6 px-4 sm:px-8 py-3 sm:py-4 bg-white rounded-lg shadow-soft flex items-center justify-center h-16 sm:h-20 min-w-[140px] sm:min-w-[180px]"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                width={100}
                height={32}
                loading="lazy"
                decoding="async"
                className="max-h-8 sm:max-h-12 max-w-[100px] sm:max-w-[140px] w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
