import { useEffect } from "react";
import { useCanonical } from "@/hooks/useCanonical";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useDomainConfig } from "@/contexts/DomainConfigContext";

const FAQs = () => {
  const { config } = useDomainConfig();
  const phoneNumber = config?.customer_service || "+44 203 9292 689";
  const airportName = config?.airport_name || "the airport";

  const faqCategories = [
    {
      title: "Booking & Payments",
      faqs: [
        {
          question: "How do I book Glasgow Airport parking online?",
          answer:
            "You can book your Glasgow Airport parking through our secure online system. Simply enter your travel dates, choose your preferred service, and confirm your reservation. You'll receive instant confirmation by email.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept major debit and credit cards through our secure online checkout. All payments are encrypted to keep your details safe.",
        },
        {
          question: "Can I amend or cancel my booking?",
          answer:
            "Yes, bookings can be amended or cancelled in line with our terms and conditions. You can manage your reservation using the link provided in your confirmation email.",
        },
        {
          question: "Is there a booking fee?",
          answer:
            "No, we do not charge a separate booking fee. The price shown at checkout is the total you pay for your parking service.",
        },
      ],
    },
    {
      title: "Meet & Greet Parking",
      faqs: [
        {
          question: "How does Meet & Greet parking at Glasgow Airport work?",
          answer:
            "With Meet & Greet parking, you drive directly to the agreed terminal drop-off point where a trained driver meets you. Your vehicle is parked securely while you travel and returned to you when you land.",
        },
        {
          question: "Is Meet & Greet parking secure?",
          answer:
            "Yes, vehicles are parked in secure facilities operated by trusted professionals, giving you peace of mind while you're away.",
        },
        {
          question: "Is Meet & Greet suitable for families or business travelers?",
          answer:
            "Yes, Meet & Greet parking is ideal for families with luggage, business travelers, and anyone wanting the fastest and most convenient airport parking option.",
        },
      ],
    },
    {
      title: "Park & Ride Parking",
      faqs: [
        {
          question: "How does Park & Ride parking work?",
          answer:
            "With Park & Ride, you drive to a secure off-site parking location near Glasgow Airport. From there, a shuttle transfer takes you to the terminal quickly and comfortably.",
        },
        {
          question: "Are shuttle transfers included?",
          answer: "Yes, shuttle transfers to and from Glasgow Airport are included in your Park & Ride booking.",
        },
        {
          question: "How long do shuttle transfers take?",
          answer: "Shuttle transfer times are typically short and operate regularly to ensure smooth airport access.",
        },
      ],
    },
    {
      title: "At the Airport",
      faqs: [
        {
          question: "What should I do when I arrive?",
          answer:
            "Arrival instructions are included in your booking confirmation. Follow the directions provided for either Meet & Greet or Park & Ride services.",
        },
        {
          question: "What happens if my flight is delayed?",
          answer:
            "If your return flight is delayed, contact the number in your confirmation email. Our team will assist with updated collection or shuttle arrangements.",
        },
        {
          question: "Is long-stay parking available?",
          answer:
            "Yes, both Meet & Greet and Park & Ride services are suitable for short-term and long-stay Glasgow Airport parking.",
        },
      ],
    },
    {
      title: "Security & Support",
      faqs: [
        {
          question: "Are your parking facilities secure?",
          answer:
            "All parking locations are operated by trusted partners and include security measures to help keep vehicles safe during your trip.",
        },
        {
          question: "Can I get help if my car battery is flat?",
          answer: "Yes, assistance such as jump-start support may be available at selected parking locations.",
        },
        {
          question: "Who do I contact if I need assistance?",
          answer:
            "Customer support details are included in your booking confirmation email. Our team is available to help before, during, and after your trip.",
        },
      ],
    },
  ];

  useEffect(() => {
    document.title = "Glasgow Airport Parking FAQs | Booking Help, Services & Support";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        "Find answers to Glasgow Airport parking questions including bookings, arrivals, services, and parking support before you travel.",
      );
    document
      .querySelector('meta[name="keywords"]')
      ?.setAttribute(
        "content",
        `${airportName} parking FAQ, airport parking questions, cheap parking, meet and greet FAQ, park and ride FAQ, booking help`,
      );
  }, [airportName]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-primary py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Glasgow Airport Parking FAQs – Booking, Services & Customer Support
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Everything you need to know before arriving at Glasgow Airport parking — simple, transparent, and
              stress-free.
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16 md:py-24 bg-cream">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
              {/* Left Side - FAQs */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
                <p className="text-muted-foreground mb-8">
                  Have questions about our services? Here are some of the most common queries from our customers.
                </p>

                {faqCategories.map((category, catIndex) => (
                  <div key={catIndex} className="mb-10">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">{category.title}</h3>
                    <Accordion type="single" collapsible className="space-y-3">
                      {category.faqs.map((faq, index) => (
                        <AccordionItem
                          key={index}
                          value={`cat-${catIndex}-item-${index}`}
                          className="faq-item bg-card rounded-xl px-6 border-0 shadow-soft"
                        >
                          <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground pb-5">{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}

                <div className="mt-6">
                  <Link to="/contact">
                    <Button
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Contact Us
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
      </main>

      <Footer />
    </div>
  );
};

export default FAQs;
