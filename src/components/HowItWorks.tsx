import { MousePointer, Car, CreditCard } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: MousePointer,
      title: "Select Dates",
      subtitle: "Select Dates",
      description: "Start In A Blink Of An Eye",
    },
    {
      icon: Car,
      title: "Choose Parking Product",
      subtitle: "Choose Parking Product",
      description: "Choose Parking Product That Suits Your Need & Budget",
    },
    {
      icon: CreditCard,
      title: "Easy to Book",
      subtitle: "Easy to Book",
      description: "Just Confirm Details & Pay With An Easy & Fast Booking Process",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <h2 className="sr-only">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="text-center group animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Icon Circle */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
                <div className="absolute inset-0 rounded-full bg-secondary group-hover:bg-primary transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <step.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                {/* Step Number */}
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-bold text-accent-foreground">
                    {index + 1}
                  </span>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {/* Connector Line (not on last) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
