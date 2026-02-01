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
      question: `How do I book parking at ${airportName}?`,
      answer:
        "Simply use our online booking form on this page. Select your entry and exit dates, choose your preferred parking option, and complete your reservation in just a few minutes.",
    },
    {
      question: "What parking options are available?",
      answer:
        "We offer Meet & Greet service where you drop your car at the terminal, and Park & Ride where you park in our secure lot and take a free shuttle to the terminal.",
    },
    {
      question: "Is my car secure while parked?",
      answer:
        "Yes, all our car parks are fully secured with 24/7 CCTV monitoring, regular patrols, and secure fencing. Your vehicle is in safe hands with us.",
    },
    {
      question: "Can I modify or cancel my booking?",
      answer:
        "Yes, you can modify or cancel your booking Contact our 24x7 support team and they will assist you to cancel or modify your booking.",
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
