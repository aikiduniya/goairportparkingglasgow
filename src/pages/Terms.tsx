import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useDomainConfig } from "@/contexts/DomainConfigContext";
import { Loader2 } from "lucide-react";
import useSEO from "@/hooks/useSEO";

const Terms = () => {
  useSEO({
    title: "Terms & Conditions | Go Glasgow Airport Parking",
    description:
      "Read the terms and conditions for booking and using Go Glasgow Airport Parking services.",
  });
  const { config, loading } = useDomainConfig();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Terms & Conditions</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span>Loading...</span>
          </div>
        ) : config?.terms_conditions ? (
          <div
            className="prose prose-gray dark:prose-invert max-w-none [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground [&_a]:text-primary [&_a:hover]:underline"
            dangerouslySetInnerHTML={{ __html: config.terms_conditions }}
          />
        ) : (
          <p className="text-muted-foreground">Terms and conditions are not available at this time.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
