import { useEffect } from "react";
import { ArrowRight, Shield, MapPin, Heart, Building, Users, DollarSign, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useDomainConfig } from "@/contexts/DomainConfigContext";

const AboutUs = () => {
  const { config } = useDomainConfig();
  const title = config?.title || "Go Airport Parking";
  const webName = config?.web_name || "Go Airport Parking";
  const airportName = config?.airport_name || "the airport";
  const coreValues = [
    {
      title: "Security & Safety",
      icon: Shield,
      description: "Ensuring your vehicle is protected in our monitored and patrolled facilities.",
    },
    {
      title: "Convenience & Reliability",
      icon: Star,
      description: "Offering efficient Meet & Greet and Park & Ride services for hassle-free travel.",
    },
    {
      title: "Affordable & Quality Service",
      icon: DollarSign,
      description: "Delivering competitive pricing and exceptional customer support at every stage of your journey.",
    },
  ];

  const timeline = [
    { year: "2010", description: "Founded with a mission to make airport parking simple & affordable." },
    {
      year: "2011",
      description: "Started with individual websites dedicated to different airports, building trust locally.",
    },
    { year: "2015", description: "Expanded nationwide across major UK airports with individual platforms." },
    { year: "2020", description: "Celebrated 1 million travelers served across the UK." },
    {
      year: "2023",
      description: `Brought everything together under the ${title} umbrella — a comparison platform uniting all sites.`,
    },
    { year: "2024", description: "Upgraded facilities & introduced premium valet + extras." },
    { year: "2025", description: `Launched ${airportName} services with territorial expertise.` },
  ];

  const trustPoints = [
    {
      icon: Shield,
      title: "Trusted Brand",
      description: `Part of ${title}, a nationwide leader with years of experience in secure airport parking.`,
    },
    {
      icon: MapPin,
      title: "Local Expertise",
      description: `Our ${airportName} team ensures your journey starts and ends smoothly, right from the airport gates.`,
    },
    {
      icon: Heart,
      title: "Customer First",
      description:
        "Committed to delivering excellent service, transparent pricing, and reliable extras for every traveler.",
    },
  ];

  const whyChooseUs = [
    {
      icon: Building,
      title: "Nationwide Experience",
      description:
        "With years of experience providing airport parking across the UK, we bring stability, trust, and proven operational expertise to every booking.",
    },
    {
      icon: MapPin,
      title: `${airportName}-Tailored Service`,
      description: `Our services are designed specifically for Glasgow Airport travelers. Local staff, optimized logistics, and thoughtful extras ensure a smooth, stress-free parking experience.`,
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description: "Backed by years of experience across the UK, we bring stability, trust, and proven operations.",
    },
    {
      icon: Star,
      title: "Quality & Extras",
      description:
        "Enhance your journey with optional services such as valet parking, luggage assistance, car care, and more. Choose the extras that add real value to your trip.",
    },
  ];

  useEffect(() => {
    document.title = `About Us - ${title} | Trusted ${airportName} Parking`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        `Learn about ${title}, your trusted partner for secure and affordable ${airportName} parking. Meet & Greet, Park & Ride, and more.`,
      );
    document
      .querySelector('meta[name="keywords"]')
      ?.setAttribute(
        "content",
        `about ${title}, ${airportName} parking, airport parking UK, trusted parking, meet and greet, park and ride`,
      );
  }, [title, airportName]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-primary py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              About Go Airport Parking Glasgow – Trusted Airport Parking in the UK
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Your trusted partner for {airportName} parking
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
                {title} Mission Statement
              </h2>
              <p className="text-muted-foreground leading-relaxed text-center mb-4">
                At {webName}, our mission is to make your journey smooth, convenient, and stress-free. Choosing the
                right {airportName} Parking option ensures you have plenty of time to start your trip with peace of
                mind, avoiding the congestion and delays that can occur around busy airports.
              </p>
              <p className="text-muted-foreground leading-relaxed text-center mb-4">
                We are dedicated to providing the best airport parking experience for you and your loved ones, guided by
                our three core principles:
              </p>

              {/* Core Principles */}
              <div className="grid md:grid-cols-3 gap-6">
                {coreValues.map((value, index) => (
                  <div
                    key={index}
                    className="bg-cream rounded-xl p-8 text-center shadow-soft hover:shadow-medium transition-shadow"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed text-center mt-8">
                Our goal is simple: excellence in {airportName} Parking, so you can travel with confidence, comfort, and
                peace of mind.
              </p>
            </div>
          </div>
        </section>

        {/* Our Journey Timeline */}
        <section className="py-16 md:py-24 bg-cream">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">Our Journey</h2>
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-primary/30" />

                {timeline.map((item, index) => (
                  <div
                    key={index}
                    className={`relative flex items-start gap-6 mb-8 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Year bubble */}
                    <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-primary flex items-center justify-center z-10">
                      <span className="text-primary-foreground font-bold text-sm">{item.year}</span>
                    </div>

                    {/* Content */}
                    <div
                      className={`ml-28 md:ml-0 md:w-[calc(50%-3rem)] ${index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}
                    >
                      <div className="bg-background rounded-xl p-6 shadow-soft">
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block md:w-[calc(50%-3rem)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust Points */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {trustPoints.map((point, index) => (
                <div
                  key={index}
                  className="text-center p-8 rounded-xl bg-cream shadow-soft hover:shadow-medium transition-shadow"
                >
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
                    <point.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">{point.title}</h3>
                  <p className="text-muted-foreground">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & History */}
        <section className="py-16 md:py-24 bg-cream">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Mission & History</h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Since our beginnings as part of {title}, our mission has been clear: make parking at airports simple,
                  secure, and stress-free. We believe that the journey begins not when you board the plane but from the
                  moment you leave your home.
                </p>
                <p>
                  Our {airportName} site builds on that legacy. We've selected convenient locations, invested in quality
                  facilities, and trained our staff to uphold high standards—all so that our customers get the best
                  possible experience under our trusted brand.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">Why Choose Us?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {whyChooseUs.map((item, index) => (
                <div key={index} className="bg-cream rounded-xl p-6 shadow-soft hover:shadow-medium transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              ))}
            </div>

            {/* Book Now Button */}
            <div className="text-center mt-12">
              <Link to="/">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Book Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
