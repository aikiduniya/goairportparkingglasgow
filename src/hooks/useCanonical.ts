import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://goairportparkingglasgow.com";

/**
 * Sets the canonical link tag dynamically based on the current route.
 * Optionally pass a custom path (e.g., for blog detail pages).
 */
export const useCanonical = (customPath?: string) => {
  const location = useLocation();

  useEffect(() => {
    const path = customPath ?? location.pathname;
    const canonicalUrl = `${BASE_URL}${path === "/" ? "" : path}`;

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);
  }, [customPath, location.pathname]);
};
