import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription
    console.log("Subscribing:", email);
    setEmail("");
  };

  return (
    <section className="py-12 sm:py-16 md:py-24 newsletter-gradient">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
          </div>

          {/* Content */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-3 sm:mb-4">
            Subscribe & Get
            <br />
            Special Discount!
          </h2>
          <p className="text-sm sm:text-base text-primary-foreground/80 mb-6 sm:mb-8 px-2">
            Subscribe today and secure your spot with our parking booking system.
            Get a special discount waiting just for you!
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto px-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 h-12 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:border-white"
            />
            <Button
              type="submit"
              className="h-12 px-6 sm:px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
