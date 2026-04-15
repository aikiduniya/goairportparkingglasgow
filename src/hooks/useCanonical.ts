import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE_DOMAIN = "https://goairportparkingglasgow.com";

const useCanonical = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname === "/" ? "" : location.pathname.replace(/\/$/, "");
    const canonicalUrl = `${BASE_DOMAIN}${path}`;

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);
  }, [location.pathname]);
};

export default useCanonical;
