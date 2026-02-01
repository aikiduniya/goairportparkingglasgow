import { forwardRef } from "react";
import { Phone, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDomainConfig } from "@/contexts/DomainConfigContext";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  const { config } = useDomainConfig();
  const location = useLocation();
  const navigate = useNavigate();

  // Get dynamic values from API
  const phoneNumber = config?.customer_service || "+44 203 9292 689";
  const email = config?.email || "support@goairportparkingglasgow.com";
  const logoUrl = config?.logo ? `https://globalparkingtech.co.uk/logos/${config.logo}` : "/logo.png";
  const title = config?.title || "Go Airport Parking";
  const legalName = config?.legal_name || config?.title || "Go Airport Parking";

  // Handle scroll to section (works from any page)
  const handleScrollToSection = (sectionId: string) => {
    if (location.pathname === "/") {
      // Already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to home page with hash
      navigate(`/#${sectionId}`);
    }
  };

  const quickLinks = [
    { name: "Why Choose Us", href: "/#why-choose-us", isSection: true, sectionId: "why-choose-us" },
    { name: "Services", href: "/#services", isSection: true, sectionId: "services" },
    { name: "About", href: "/about", isSection: false },
    { name: "FAQs", href: "/faqs", isSection: false },
  ];

  const companyLinks = [
    { name: "Testimonials", href: "/#testimonials", isSection: true, sectionId: "testimonials" },
    { name: "Terms & Conditions", href: "/terms", isSection: false },
    { name: "Privacy Policy", href: "/privacy", isSection: false },
    { name: "Contact Us", href: "/contact", isSection: false },
  ];

  return (
    <footer ref={ref} id="contact" className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="mb-4 inline-block">
              <img src={logoUrl} alt={title} className="h-10 sm:h-12 w-auto object-contain" />
            </Link>
            <p className="text-primary-foreground text-xs sm:text-sm leading-relaxed opacity-90">
              {title} provides reliable, affordable, and convenient parking solutions, trusted by thousands every year.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Useful Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  {link.isSection ? (
                    <button
                      onClick={() => handleScrollToSection(link.sectionId!)}
                      className="text-primary-foreground hover:text-accent transition-colors text-sm opacity-90 hover:opacity-100 text-left"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-primary-foreground hover:text-accent transition-colors text-sm opacity-90 hover:opacity-100"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Useful Links</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  {link.isSection ? (
                    <button
                      onClick={() => handleScrollToSection(link.sectionId!)}
                      className="text-primary-foreground hover:text-accent transition-colors text-sm opacity-90 hover:opacity-100 text-left"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-primary-foreground hover:text-accent transition-colors text-sm opacity-90 hover:opacity-100"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <div className="space-y-3">
              <a
                href={`tel:${phoneNumber.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-primary-foreground hover:text-accent transition-colors text-sm opacity-90 hover:opacity-100"
              >
                <Phone className="w-4 h-4" />
                <span>{phoneNumber}</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-primary-foreground hover:text-accent transition-colors text-xs sm:text-sm opacity-90 hover:opacity-100"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="break-all">{email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <p className="text-center text-primary-foreground text-sm opacity-80">© 2026 {legalName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
