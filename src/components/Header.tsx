import { useState, forwardRef } from "react";
import { Phone, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDomainConfig } from "@/contexts/DomainConfigContext";
import { prefetchRoute } from "@/routes/prefetch";

const Header = forwardRef<HTMLElement>((_, ref) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { config } = useDomainConfig();

  // Get logo from API or fallback
  const logoUrl = config?.logo ? `https://globalparkingtech.co.uk/logos/${config.logo}` : "/logo.png";

  // Get phone from API or fallback
  const phoneNumber = config?.customer_service || "+353 1233 7318";

  const navLinks = [
    { name: "Home", href: "/", isRoute: true },
    { name: "Services", href: "/services", isRoute: true },
    { name: "About Us", href: "/about", isRoute: true },
    { name: "International", href: "/international", isRoute: true },
    { name: "FAQs", href: "/faqs", isRoute: true },
    { name: "Blogs", href: "/blogs", isRoute: true },
    { name: "Contact Us", href: "/contact", isRoute: true },
  ];

  return (
    <header ref={ref} className="fixed top-0 left-0 right-0 z-50 bg-primary backdrop-blur-md border-b border-primary/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logoUrl}
              alt={config?.web_name || "Glasgow Airport Parking"}
              className="h-10 md:h-12 w-auto object-contain"
              width={286}
              height={40}
              fetchPriority="high"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = link.isRoute && location.pathname === link.href;
              return link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-sm font-medium transition-colors link-underline ${
                    isActive ? "text-accent" : "text-primary-foreground/80 hover:text-accent"
                  }`}
                  onMouseEnter={() => prefetchRoute(link.href)}
                  onFocus={() => prefetchRoute(link.href)}
                  onTouchStart={() => prefetchRoute(link.href)}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-primary-foreground/80 hover:text-accent transition-colors link-underline"
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Phone */}
            <a
              href={`tel:${phoneNumber.replace(/\s/g, "")}`}
              className="hidden md:flex items-center gap-2 text-accent font-semibold"
            >
              <Phone className="w-4 h-4" />
              <span>{phoneNumber}</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-primary-foreground"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-primary-foreground/20 animate-fade-in bg-primary">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const isActive = link.isRoute && location.pathname === link.href;
                return link.isRoute ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`text-sm font-medium transition-colors py-2 ${
                      isActive ? "text-accent" : "text-primary-foreground/80 hover:text-accent"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    onMouseEnter={() => prefetchRoute(link.href)}
                    onFocus={() => prefetchRoute(link.href)}
                    onTouchStart={() => prefetchRoute(link.href)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm font-medium text-primary-foreground/80 hover:text-accent transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                );
              })}
              <a
                href={`tel:${phoneNumber.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-accent font-semibold py-2"
              >
                <Phone className="w-4 h-4" />
                <span>{phoneNumber}</span>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
});

Header.displayName = "Header";

export default Header;
