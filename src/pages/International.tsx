import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Car, Bus, Sparkles, MapPin } from "lucide-react";

const AirportCard = ({ airport, index }: { airport: { name: string; image: string }; index: number }) => (
  <div
    className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer animate-fade-in"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <img
      src={airport.image}
      alt={airport.name}
      loading="lazy"
      width={200}
      height={150}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
    <div className="absolute inset-0 flex items-end p-4">
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-accent" />
        <h3 className="text-xl font-bold text-white">{airport.name}</h3>
      </div>
    </div>
  </div>
);

const International = () => {
  const ukAirports = [
    {
      name: "Birmingham",
      image: "https://images.unsplash.com/photo-1583416750470-965b2707b355?w=200&h=150&fit=crop&fm=webp&q=50",
    },
    {
      name: "Heathrow",
      image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=200&h=150&fit=crop&fm=webp&q=50",
    },
    {
      name: "Manchester",
      image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=200&h=150&fit=crop&fm=webp&q=50",
    },
    {
      name: "Luton",
      image: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=200&h=150&fit=crop&fm=webp&q=50",
    },
    {
      name: "Stansted",
      image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=200&h=150&fit=crop&fm=webp&q=50",
    },
    {
      name: "Bristol",
      image: "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?w=200&h=150&fit=crop&fm=webp&q=50",
    },
  ];



  const irelandAirports = [
    {
      name: "Dublin",
      image: "https://images.unsplash.com/photo-1549918864-48ac978761a4?w=200&h=150&fit=crop&fm=webp&q=50",
    },
  ];

  const ports = [
    {
      name: "Southampton Port",
      image: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=200&h=150&fit=crop&fm=webp&q=50",
    },
  ];

  const services = [
    {
      icon: Car,
      title: "Meet & Greet",
      description:
        "Hand over your car at the terminal, and our professional team will park it securely for you while you travel stress-free.",
    },
    {
      icon: Bus,
      title: "Park & Ride",
      description:
        "Park at our secure lot and enjoy a free shuttle service directly to your terminal—convenient, fast, and hassle-free.",
    },
    {
      icon: Sparkles,
      title: "Valet Parking",
      description:
        "Experience full luxury valet service at the terminal. Hand over your keys and enjoy a seamless, stress-free journey.",
    },
  ];

  useEffect(() => {
    document.title = "UK & Dublin Airport Parking – Go Airport Parking Nationwide Services";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        "Discover Go Airport Parking network of airport parking across the UK and Dublin. Secure Meet & Greet and Park & Ride services at all major airports.",
      );
    document
      .querySelector('meta[name="keywords"]')
      ?.setAttribute(
        "content",
        "UK airport parking, Heathrow parking, Manchester airport parking, Birmingham airport parking, Luton parking, meet and greet, park and ride",
      );
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-primary py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Our Airport Parking Network – UK Airports & Dublin Airport
            </h1>
          </div>
        </section>

        {/* UK Airports */}
        <section className="py-16 md:py-24 bg-cream">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">UK Airports</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {ukAirports.map((airport, index) => (
                <AirportCard key={index} airport={airport} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Ireland Airports */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">Ireland Airports</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-md mx-auto lg:max-w-none">
              {irelandAirports.map((airport, index) => (
                <AirportCard key={index} airport={airport} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Ports */}
        <section className="py-16 md:py-24 bg-cream">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">Ports</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-2xl mx-auto lg:max-w-none">
              {ports.map((airport, index) => (
                <AirportCard key={index} airport={airport} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Parking Services */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Parking Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose the service that best fits your travel needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default International;
