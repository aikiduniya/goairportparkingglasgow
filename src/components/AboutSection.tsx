import { Shield, Users, Building2, BadgeCheck } from "lucide-react";
import dublinAirportImage from "@/assets/dublin-airport.webp";
import { useDomainConfig } from "@/contexts/DomainConfigContext";

const AboutSection = () => {
  const { config } = useDomainConfig();
  const webName = config?.web_name || "Go Airport Parking";
  const airportName = config?.airport_name || "the airport";

  const trustBadges = [
    {
      icon: Shield,
      title: "Monitored Parking",
    },
    {
      icon: Users,
      title: "Friendly & Trained Staff",
    },
    {
      icon: Building2,
      title: "Service at Terminal",
    },
    {
      icon: BadgeCheck,
      title: "Best Price Guarantee",
    },
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-cream">
      <div className="container mx-auto px-4">
        {/* Main Content with Image */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Airport Image */}
          <div className="animate-fade-in">
            <img
              src={dublinAirportImage}
              alt={airportName}
              width={600}
              height={400}
              loading="lazy"
              decoding="async"
              className="w-full h-auto rounded-2xl shadow-strong"
            />
          </div>

          {/* Right Content */}
          <div className="animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mb-6">
              <span className="text-primary-foreground font-bold text-lg">G</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">About {webName}</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Welcome to {webName}, your trusted choice for secure and affordable airport parking Glasgow travellers
                can rely on. For over a decade, we have helped thousands of customers find dependable parking at Glasgow
                Airport, offering competitive prices and professional service.
              </p>
              <p>
                We specialise in cheap Glasgow Airport parking without compromising on quality. Whether you need Meet &
                Greet, Park & Ride, or a secure long stay car park Glasgow Airport solution, we provide convenient
                options designed to suit every traveller’s needs and budget.
              </p>
              <p>
                Our services cover parking near Glasgow Airport with safe, monitored facilities and efficient transfers
                to the terminal. From Glasgow Airport parking deals to flexible short and Glasgow Airport long stay
                options, we focus on delivering outstanding value and a smooth, stress-free experience.
              </p>
              <p>
                If you are looking for cheap car parking Glasgow Airport or reliable airport parking Glasgow
                International, our experienced local team is committed to providing secure vehicle handling, excellent
                customer support, and easy online booking.
              </p>
              <p>
                Book today and discover why we are a preferred provider of Glasgow Airport parking services across the
                UK.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges - Below */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustBadges.map((badge, index) => (
            <div key={index} className="trust-badge animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <badge.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="font-semibold text-foreground text-sm">{badge.title}</span>
            </div>
          ))}
        </div>

        {/* Brand Description */}
        <div className="mt-16 pt-16 border-t border-border text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            {webName} — Trusted Airport Parking Across the UK
          </h3>
          <div className="space-y-4 text-muted-foreground leading-relaxed max-w-4xl mx-auto text-justify">
            <p>
              For over a decade, {webName} has been a trusted name in airport parking services across the UK. Our
              mission is simple: to make your journey smoother by offering a wide range of secure, reliable, and
              affordable airport parking options. With our easy-to-use online booking platform and a network of
              professional parking operators, we ensure outstanding value and peace of mind for every traveler.
            </p>
            <p>
              Discover our trusted airport parking solutions at the United Kingdom's busiest airports, including
              Heathrow, Gatwick, Manchester, and more. We've built our reputation on providing safe, convenient, and
              cost-effective parking, so you can travel with confidence knowing your car is in good hands. Whether you
              need short stay, long stay, or meet-and-greet airport parking, {webName} is here to make your journey
              stress-free.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
