import { useEffect, useState, useRef } from "react";
import { Check, Headphones, Building2, Briefcase, Shield, Users, Settings, Package } from "lucide-react";

const WhyChooseUs = () => {
  const features = [
    { icon: Check, title: "Guaranteed Parking Availability", description: "Reserve your space ahead of time and enjoy worry-free parking at Glasgow Airport, even during busy periods." },
    { icon: Headphones, title: "24/7 Customer Support", description: "Our friendly team is available around the clock to assist you with bookings, inquiries, and any parking concerns." },
    { icon: Building2, title: "Convenient Terminal Service", description: "Choose Meet & Greet or Park & Ride options for direct drop-off at the terminal, making travel easier and faster." },
    { icon: Briefcase, title: "Luggage Assistance", description: "Our staff can help with your luggage, ensuring a smooth start to your journey." },
    { icon: Shield, title: "Safe & Patrolled Car Parks", description: "Your car is secure in our monitored long stay car park Glasgow Airport facilities, with regular patrols and CCTV coverage." },
    { icon: Users, title: "Friendly & Professional Staff", description: "Our experienced team is dedicated to providing excellent customer service for every traveler." },
    { icon: Settings, title: "Flexible Service Options", description: "Pick the parking service that suits your needs — cheap Glasgow Airport parking, long stay, or premium Meet & Greet." },
    { icon: Package, title: "Collected & Dropped Back to the Boot", description: "For added convenience, we can collect and return your luggage directly to your car, making your journey seamless." },
  ];

  const stats = [
    { value: 15, suffix: "", label: "Years of Service" },
    { value: 100000, suffix: "+", label: "Happy Customers" },
    { value: 100, suffix: "+", label: "Cars Parked Daily" },
    { value: 5, suffix: "", label: "Industry Awards" },
  ];

  return (
    <section id="why-choose-us" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Us?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don’t stress about finding parking on the day — book in advance and enjoy a smooth, hassle-free start to
            your journey. With Glasgow Airport Parking, you get guaranteed parking, professional service, and peace of
            mind.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 p-5 rounded-xl bg-muted/50 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-semibold text-foreground text-sm">{feature.title}</span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="stats-gradient rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StatCounter key={index} value={stat.value} suffix={stat.suffix} label={stat.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

interface StatCounterProps {
  value: number;
  suffix: string;
  label: string;
}

const StatCounter = ({ value, suffix, label }: StatCounterProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    let startTime: number | null = null;
    let animationId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Use easeOutQuad for smooth animation
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      const currentValue = Math.floor(easeProgress * value);

      setCount(currentValue);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [isVisible, value]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return num.toLocaleString();
    }
    return num;
  };

  return (
    <div ref={ref} className="text-center animate-count-up">
      <div className="counter-value mb-2">
        {formatNumber(count)}
        {suffix}
      </div>
      <p className="text-primary-foreground/80 font-medium">{label}</p>
    </div>
  );
};

export default WhyChooseUs;
