import { Link } from "react-router-dom";

const AirportNetwork = () => {
  // Optimized: reduced dimensions to 200x150 (matches display) and quality to 30%
  const airports = [
    {
      name: "London Heathrow",
      image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=200&h=150&fit=crop&fm=webp&q=30",
    },
    {
      name: "Manchester",
      image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=200&h=150&fit=crop&fm=webp&q=30",
    },
    {
      name: "Dublin",
      image: "https://images.unsplash.com/photo-1549918864-48ac978761a4?w=200&h=150&fit=crop&fm=webp&q=30",
    },
    {
      name: "Southampton",
      image: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=200&h=150&fit=crop&fm=webp&q=30",
    },
    {
      name: "Luton",
      image: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=200&h=150&fit=crop&fm=webp&q=30",
    },
    {
      name: "Stansted",
      image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=200&h=150&fit=crop&fm=webp&q=30",
    },
  ];

  return (
    <section id="network" className="py-12 sm:py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <Link
            to="/international"
            className="inline-block text-sm sm:text-base text-primary font-semibold hover:underline mb-4"
          >
            View our network →
          </Link>
        </div>

        {/* Airport Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {airports.map((airport, index) => (
            <div
              key={index}
              className="airport-card aspect-[4/3] animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={airport.image}
                alt={airport.name}
                loading="lazy"
                width={200}
                height={150}
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-end p-3 sm:p-4 z-10">
                <h4 className="text-sm sm:text-lg font-bold text-white">{airport.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AirportNetwork;
