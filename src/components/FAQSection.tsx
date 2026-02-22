import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useDomainConfig } from "@/contexts/DomainConfigContext";

const FAQSection = () => {
  const { config } = useDomainConfig();
  const phoneNumber = config?.customer_service || "+44 203 9292 689";
  const airportName = config?.airport_name || "the airport";

  const faqs = [
    {
      question: `What types of parking services do you offer at ${airportName}?`,
      answer: `We provide Meet & Greet and Park & Ride services, along with secure long stay car park ${airportName} options. You can choose the service that best suits your travel needs.`,
    },
    {
      question: `Can I find cheap ${airportName} parking?`,
      answer: `Yes! We offer competitive rates and special ${airportName} parking deals for both Meet & Greet and Park & Ride services. Booking in advance ensures the best prices.`,
    },
    {
      question: `How do I book parking at ${airportName}?`,
      answer: `Booking is simple with our online platform. Select your dates, choose your preferred service, and confirm your booking. You'll receive instant confirmation for airport parking ${airportName}.`,
    },
    {
      question: "Is my car safe while parked?",
      answer: `Absolutely. All our long stay car park ${airportName} facilities are fully monitored, patrolled, and secured with CCTV to keep your vehicle safe while you travel.`,
    },
    {
      question: "Do you provide shuttle transfers to the terminal?",
      answer: `Yes, for Park & Ride services we provide fast and reliable shuttle transfers to ${airportName} terminals. For Meet & Greet, our staff will meet you at the terminal and park your car for you.`,
    },
    {
      question: "Can you help with luggage?",
      answer: "Yes! Our friendly staff assist with your luggage during Meet & Greet service or when dropping off your car for Park & Ride, ensuring a smooth start to your journey.",
    },
    {
      question: "Do I need to book in advance?",
      answer: `We highly recommend booking ahead to guarantee your parking space and secure the best rates for parking at ${airportName}. Advance booking also ensures a stress-free start to your travel.`,
    },
    {
      question: "Where are your car parks located?",
      answer: `Our secure ${airportName} parking locations are conveniently near the terminal, providing easy access and efficient transfers, so you can park quickly and start your journey with peace of mind.`,
    },
    {
      question: "Can I cancel or modify my booking?",
      answer: "Yes, you can modify or cancel your booking according to our terms. Check your booking confirmation or contact our 24/7 customer support team for assistance.",
    },
    {
      question: "Do you offer services at other UK airports?",
      answer: "Yes, we also provide trusted airport parking across the UK, including Heathrow, Gatwick, Manchester, and more, all with professional service and competitive pricing.",
    },
  ];

  return (
    <section id="faq" className="py-16 md:py-24 bg-cream">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - FAQs */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mb-8">
              Have questions about our services? Here are some of the most common queries from our customers.
            </p>

            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="faq-item bg-card rounded-xl px-6 border-0 shadow-soft"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-6">
              <Link to="/faqs">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  More FAQs
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Contact CTA */}
          <div className="lg:sticky lg:top-32">
            <div className="bg-card rounded-2xl p-8 shadow-medium text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Still have a question?</h3>
              <p className="text-muted-foreground mb-6">Our Agents Will Be With You In Seconds</p>
              <a href={`tel:${phoneNumber.replace(/\s/g, "")}`}>
                <Button className="w-full h-12 text-lg bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us Now
                </Button>
              </a>
              <p className="text-primary font-semibold mt-4">{phoneNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
