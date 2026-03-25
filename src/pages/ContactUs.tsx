import { useState, useEffect } from "react";
import { useCanonical } from "@/hooks/useCanonical";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useDomainConfig } from "@/contexts/DomainConfigContext";
import { supabase } from "@/integrations/supabase/client";

const ContactUs = () => {
  const { toast } = useToast();
  const { config } = useDomainConfig();

  const phone = config?.customer_service || "+44 203 9292 689";
  const email = config?.email || "support@example.com";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    enquiryType: "",
    title: "",
    firstName: "",
    surname: "",
    email: "",
    contactNumber: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.firstName || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          ...formData,
          customerServicePhone: phone,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible. A confirmation has been sent to your email.",
      });

      // Reset form
      setFormData({
        enquiryType: "",
        title: "",
        firstName: "",
        surname: "",
        email: "",
        contactNumber: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    document.title = "Contact Go Airport Parking Glasgow | Booking Support & Enquiries";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        "Contact Go Airport Parking Glasgow for quick help with your booking and enquiries. Get fast, friendly support for a stress-free airport experience.",
      );
    document
      .querySelector('meta[name="keywords"]')
      ?.setAttribute(
        "content",
        "contact airport parking, customer support, booking enquiry, airport parking help, phone number, email support",
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
              Glasgow Airport Parking Booking Help – Contact Us
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Need help with your Glasgow Airport parking booking? Our friendly team is here to answer your questions.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16 md:py-24 bg-cream">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Contact Info Cards */}
              <div className="lg:col-span-1 space-y-6">
                {/* Phone */}
                <div className="bg-card rounded-2xl p-6 shadow-lg animate-fade-in" style={{ animationDelay: "100ms" }}>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Call Us</h3>
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-accent hover:underline font-semibold">
                    {phone}
                  </a>
                </div>

                {/* Email */}
                <div className="bg-card rounded-2xl p-6 shadow-lg animate-fade-in" style={{ animationDelay: "200ms" }}>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Email</h3>
                  <a href={`mailto:${email}`} className="text-accent hover:underline font-semibold">
                    {email}
                  </a>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-2xl p-8 shadow-lg animate-fade-in" style={{ animationDelay: "150ms" }}>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Enquiry Type */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        What is your enquiry concerning?
                      </label>
                      <Select
                        value={formData.enquiryType}
                        onValueChange={(value) => handleChange("enquiryType", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Enquiry Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="booking">Booking Enquiry</SelectItem>
                          <SelectItem value="general">General Enquiry</SelectItem>
                          <SelectItem value="complaint">Complaint</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Title & Name Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Select value={formData.title} onValueChange={(value) => handleChange("title", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Title" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mr">Mr</SelectItem>
                          <SelectItem value="mrs">Mrs</SelectItem>
                          <SelectItem value="ms">Ms</SelectItem>
                          <SelectItem value="dr">Dr</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        required
                      />
                      <Input
                        placeholder="Surname"
                        value={formData.surname}
                        onChange={(e) => handleChange("surname", e.target.value)}
                      />
                    </div>

                    {/* Email & Phone Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                      />
                      <Input
                        type="tel"
                        placeholder="Contact Number"
                        value={formData.contactNumber}
                        onChange={(e) => handleChange("contactNumber", e.target.value)}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <Textarea
                        placeholder="Write your enquiry here..."
                        rows={5}
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
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

export default ContactUs;
