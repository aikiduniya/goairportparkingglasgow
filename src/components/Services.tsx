import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import meetGreetImage from "@/assets/meet-greet.jpg";
import parkRideImage from "@/assets/park-ride-service.jpg";

const Services = () => {
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

  return (
    <section id="services" className="py-12 sm:py-16 md:py-24 bg-cream">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">Our Services</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Global Operations & Services</p>
        </div>

        {/* Services */}
        <div className="max-w-5xl mx-auto space-y-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-card rounded-2xl shadow-medium overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-0 ${index % 2 !== 0 ? 'md:[direction:rtl]' : ''}`}>
                {/* Image */}
                <div className="relative h-64 md:h-80">
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className={`p-6 sm:p-8 md:p-10 flex flex-col justify-center ${index % 2 !== 0 ? 'md:[direction:ltr]' : ''}`}>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {service.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More Services Button */}
        <div className="text-center mt-10">
          <Link to="/services">
            <Button size="lg" className="px-8">
              More Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
