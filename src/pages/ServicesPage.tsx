import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import meetGreetImage from "@/assets/meet-greet.jpg";
import parkRideImage from "@/assets/park-ride-service.jpg";
import useSEO from "@/hooks/useSEO";

const services = [
  {
    title: "Meet & Greet",
    image: meetGreetImage,
    description:
      "The fastest and easiest way to park at the airport is to drive straight to the terminal entrance, hand over your car to the driver, grab your luggage, and you're off. When you return, just give the driver a call, and they'll bring your car to meet you at the terminal entrance.",
  },
  {
    title: "Park & Ride",
    image: parkRideImage,
    description:
      "The most budget-friendly parking option, typically involving a 5 to 10 minute transfer via shuttle. Most Park & Ride facilities are highly secure and provide personalized customer service. Shuttles usually operate frequently and are available on demand for your convenience.",
  },
];

const ServicesPage = () => {
  useSEO({
    title: "Our Services - Meet & Greet & Park & Ride Airport Parking",
    description:
      "Explore our airport parking services including Meet & Greet and Park & Ride. Convenient, secure and affordable parking options for every traveller.",
  });
  useEffect(() => {
    document.querySelector('meta[name="keywords"]')?.setAttribute("content", "airport parking services, meet and greet parking, park and ride parking, cheap airport parking, secure car park, terminal transfers");
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16 md:pt-20">
        {/* Hero */}
        <section className="bg-primary py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">Our Services</h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              We offer a range of convenient and affordable parking services to suit every traveller's needs.
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-10">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl shadow-medium overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-0 ${index % 2 !== 0 ? 'md:[direction:rtl]' : ''}`}>
                    <div className="relative h-64 md:h-96">
                      <img
                        src={service.image}
                        alt={service.title}
                        loading="lazy"
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`p-6 sm:p-8 md:p-10 flex flex-col justify-center ${index % 2 !== 0 ? 'md:[direction:ltr]' : ''}`}>
                      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                        {service.title}
                      </h2>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
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

export default ServicesPage;
