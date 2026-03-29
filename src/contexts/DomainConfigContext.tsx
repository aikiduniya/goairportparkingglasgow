import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface DomainConfig {
  title: string;
  domain: string;
  airport_code: string;
  airport_name: string;
  cur: string;
  webtype: string;
  web_name: string;
  publisher_key?: string;
  secret_key?: string;
  footer?: string;
  customer_service?: string;
  logo?: string;
  terms?: string;
  terms_conditions?: string;
  privacy?: string;
  privacy_policy?: string;
  contact?: string;
  email?: string;
  phone?: string;
  address?: string;
  legal_name?: string;
}

interface DomainConfigContextValue {
  config: DomainConfig | null;
  loading: boolean;
  error: string | null;
}

const DomainConfigContext = createContext<DomainConfigContextValue>({
  config: null,
  loading: true,
  error: null,
});

export const useDomainConfig = () => useContext(DomainConfigContext);

interface DomainConfigProviderProps {
  children: ReactNode;
}

export const DomainConfigProvider = ({ children }: DomainConfigProviderProps) => {
  const [config, setConfig] = useState<DomainConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let rafId: number;

    const fetchConfig = async () => {
      try {
        const response = await fetch("https://globalparkingtech.co.uk/get_domain?code=82");
        if (!response.ok) {
          throw new Error("Failed to fetch domain config");
        }
        const data = await response.json();

        // Use requestAnimationFrame to batch state updates and avoid forced reflow
        rafId = requestAnimationFrame(() => {
          if (Array.isArray(data) && data.length > 0) {
            const item = data[0];
            const itemData = {
              title: item.title || "Go Airport Parking",
              domain: item.website || item.domain || "",
              airport_code: item.code || "GLA",
              airport_name: item.airport_name || "Glasgow Airport",
              cur: item.cur || "£",
              webtype: item.type === "AIRPORT" ? "Airport" : "Cruise Ports",
              web_name: item.web_name || "Go Airport Parking",
              publisher_key: item.publisher_key,
              secret_key: item.secret_key,
              footer: item.footer,
              customer_service: item.customer_service,
              logo: item.logo,
              terms: item.terms,
              privacy: item.privacy,
              privacy_policy: item.privacy_policy,
              contact: item.contact,
              email: item.email,
              phone: item.phone,
              address: item.address,
              legal_name: item.legal_name,
            };

            // No dynamic updates - using static Glasgow-specific meta tags from index.html
            // Favicon is also static from /favicon.ico

            setConfig(itemData);
          } else {
            // Fallback defaults
            setConfig({
              title: "Go Glasgow Airport Parking",
              domain: "goairportparkingglasgow.com",
              airport_code: "GLA",
              airport_name: "Glasgow Airport",
              cur: "£",
              webtype: "Airport",
              web_name: "Go Airport Parking",
            });
          }
          setLoading(false);
        });
      } catch (err) {
        console.error("Error fetching domain config:", err);
        // Use requestAnimationFrame for error state updates too
        rafId = requestAnimationFrame(() => {
          setError(err instanceof Error ? err.message : "Failed to load config");
          // Set fallback config on error
          setConfig({
            title: "Go Glasgow Airport Parking",
            domain: "goairportparkingglasgow.com",
            airport_code: "GLA",
            airport_name: "Glasgow Airport",
            cur: "£",
            webtype: "Airport",
            web_name: "Go Airport Parking",
          });
          setLoading(false);
        });
      }
    };

    fetchConfig();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return <DomainConfigContext.Provider value={{ config, loading, error }}>{children}</DomainConfigContext.Provider>;
};
