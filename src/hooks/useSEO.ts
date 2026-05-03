import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const CANONICAL_ORIGIN = "https://goairportparkingglasgow.com";

interface SEOOptions {
  title?: string;
  description?: string;
  /** Set to true for private/booking/payment/thankyou pages */
  noindex?: boolean;
  /** Override canonical path; defaults to current pathname (no trailing slash) */
  canonicalPath?: string;
}

const setMeta = (selector: string, attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const useSEO = ({ title, description, noindex = false, canonicalPath }: SEOOptions = {}) => {
  const location = useLocation();

  useEffect(() => {
    const path = canonicalPath ?? location.pathname;
    const cleanPath = path === "/" ? "/" : path.replace(/\/+$/, "");
    const canonicalUrl = `${CANONICAL_ORIGIN}${cleanPath}`;

    if (title) document.title = title;

    if (description) {
      setMeta('meta[name="description"]', "name", "description", description);
    }

    // robots
    setMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      noindex ? "noindex, follow" : "index, follow",
    );

    // canonical (only one)
    document.head.querySelectorAll('link[rel="canonical"]').forEach((n, i) => {
      if (i > 0) n.remove();
    });
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);

    // og:url + og:title + og:description
    setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    if (title) setMeta('meta[property="og:title"]', "property", "og:title", title);
    if (description)
      setMeta('meta[property="og:description"]', "property", "og:description", description);

    // twitter
    if (title) setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    if (description)
      setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
  }, [title, description, noindex, canonicalPath, location.pathname]);
};

export default useSEO;
