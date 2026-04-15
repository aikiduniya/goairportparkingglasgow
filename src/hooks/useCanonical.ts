import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDomainConfig } from "@/contexts/DomainConfigContext";

const useCanonical = () => {
  const { config } = useDomainConfig();
  const location = useLocation();

  useEffect(() => {
    const rawDomain = config?.domain || "goairportparkingglasgow.com";
    const domain = `https://${rawDomain.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
    const path = location.pathname === "/" ? "" : location.pathname.replace(/\/$/, "");
    const canonicalUrl = `${domain}${path}`;

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);
  }, [config?.domain, location.pathname]);
};

export default useCanonical;
