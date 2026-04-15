import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDomainConfig } from "@/contexts/DomainConfigContext";

const setMetaTag = (property: string, content: string) => {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
};

const useCanonical = () => {
  const { config } = useDomainConfig();
  const location = useLocation();

  useEffect(() => {
    const rawDomain = config?.domain || "goairportparkingglasgow.com";
    const domain = `https://${rawDomain.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
    const path = location.pathname === "/" ? "" : location.pathname.replace(/\/$/, "");
    const canonicalUrl = `${domain}${path}`;

    // Set canonical link
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);

    // Set og:url to match canonical — critical for preventing duplicate indexing
    setMetaTag("og:url", canonicalUrl);
  }, [config?.domain, location.pathname]);
};

export default useCanonical;
