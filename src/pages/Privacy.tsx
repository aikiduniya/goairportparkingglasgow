import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useDomainConfig } from "@/contexts/DomainConfigContext";

const Privacy = () => {
  const { config, loading } = useDomainConfig();
  const companyName = config?.legal_name || config?.title || "Go Airport Parking";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
            Privacy Policy
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-card rounded-2xl p-8 md:p-12 shadow-medium">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : config?.privacy_policy ? (
              <div 
                className="prose prose-lg max-w-none [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-foreground [&>h2]:mb-4 [&>h2]:mt-8 first:[&>h2]:mt-0 [&>p]:text-muted-foreground [&>p]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:text-muted-foreground [&>ul]:mb-6 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:text-muted-foreground [&>ol]:mb-6 [&>ol]:space-y-2"
                dangerouslySetInnerHTML={{ __html: config.privacy_policy }}
              />
            ) : (
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
                <p className="text-muted-foreground mb-6">
                  {companyName} ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                </p>

                <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
                <p className="text-muted-foreground mb-4">We may collect the following types of information:</p>
                <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                  <li><strong>Personal Information:</strong> Name, email address, phone number, and billing address when you make a booking.</li>
                  <li><strong>Vehicle Information:</strong> Vehicle registration, make, model, and color for parking services.</li>
                  <li><strong>Payment Information:</strong> Credit/debit card details processed securely through our payment providers.</li>
                  <li><strong>Usage Data:</strong> Information about how you use our website and services.</li>
                </ul>

                <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                  <li>Process and manage your parking bookings</li>
                  <li>Send booking confirmations and important updates</li>
                  <li>Provide customer support</li>
                  <li>Improve our services and website</li>
                  <li>Send promotional communications (with your consent)</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h2 className="text-2xl font-bold text-foreground mb-4">4. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us at{" "}
                  <a href={`mailto:${config?.email || "support@goairportparking.com"}`} className="text-primary hover:underline">
                    {config?.email || "support@goairportparking.com"}
                  </a>
                  {" "}or call us at{" "}
                  <a href={`tel:${config?.customer_service?.replace(/\s/g, "") || "+442039292689"}`} className="text-primary hover:underline">
                    {config?.customer_service || "+44 203 9292 689"}
                  </a>.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Privacy;
