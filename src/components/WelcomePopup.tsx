import { useState, useEffect } from "react";
import { Gift, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const WelcomePopup = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = sessionStorage.getItem("hasSeenWelcomePopup");
    if (!hasSeenPopup) {
      // Show popup after page has fully settled to avoid forced reflow
      // Use longer delay + idle callback to ensure we don't interfere with initial paint
      const timer = setTimeout(() => {
        if ("requestIdleCallback" in window) {
          (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
            setOpen(true);
          });
        } else {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setOpen(true);
            });
          });
        }
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("hasSeenWelcomePopup", "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribing:", email);
    setEmail("");
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-primary to-primary/90 border-none text-primary-foreground">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-primary-foreground" />
        </button>
        
        <DialogHeader className="text-center space-y-4">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto">
            <Gift className="w-8 h-8 text-accent-foreground" />
          </div>
          
          <DialogTitle className="text-2xl md:text-3xl font-bold text-primary-foreground">
            Unlock a Special Discount!
          </DialogTitle>
          
          <DialogDescription className="text-primary-foreground/80 text-base">
            Sign up now and be the first to receive exclusive offers and future discounts.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:border-white"
          />
          <Button
            type="submit"
            className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base"
          >
            Claim My Discount
          </Button>
        </form>

        {/* Privacy note */}
        <p className="text-center text-sm text-primary-foreground/60 mt-2">
          We respect your privacy. No spam, ever.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomePopup;
