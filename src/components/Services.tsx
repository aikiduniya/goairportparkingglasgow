import meetGreetImage from "@/assets/meet-greet.jpg";

const Services = () => {
  const services = [
    {
      title: "Meet & Greet",
      image: meetGreetImage,
      description:
        "The fastest and easiest way to park at the airport is to drive straight to the terminal entrance, hand over your car to the driver, grab your luggage, and you're off. When you return, just give the driver a call, and they'll bring your car to meet you at the terminal entrance.",
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

        {/* Services - Horizontal Layout */}
        <div className="max-w-5xl mx-auto">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-card rounded-2xl shadow-medium overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Left - Image */}
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

                {/* Right - Content */}
                <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
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
      </div>
    </section>
  );
};

export default Services;
