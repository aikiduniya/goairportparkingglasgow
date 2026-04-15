import fs from "fs";
import path from "path";
import type { Plugin } from "vite";

interface RouteMeta {
  title: string;
  description: string;
  canonical: string;
}

const BASE = "https://goairportparkingglasgow.com";

const routes: Record<string, RouteMeta> = {
  "/about": {
    title: "About Us – Go Glasgow Airport Parking",
    description: "Learn about Go Glasgow Airport Parking. We offer secure, affordable Meet & Greet and Park & Ride services at Glasgow Airport.",
    canonical: `${BASE}/about`,
  },
  "/faqs": {
    title: "FAQs – Glasgow Airport Parking Questions Answered",
    description: "Find answers to common questions about Glasgow Airport parking, including Meet & Greet, Park & Ride, booking changes, and security.",
    canonical: `${BASE}/faqs`,
  },
  "/contact": {
    title: "Contact Us – Go Glasgow Airport Parking",
    description: "Get in touch with Go Glasgow Airport Parking. We're here to help with bookings, enquiries, and support.",
    canonical: `${BASE}/contact`,
  },
  "/blogs": {
    title: "Blog – Glasgow Airport Parking Tips & Guides",
    description: "Read the latest tips, guides and news about Glasgow Airport parking, travel advice, and money-saving deals.",
    canonical: `${BASE}/blogs`,
  },
  "/international": {
    title: "UK & Dublin Airport Parking – Go Airport Parking Nationwide",
    description: "Discover Go Airport Parking network across UK and Dublin. Secure Meet & Greet and Park & Ride at all major airports.",
    canonical: `${BASE}/international`,
  },
  "/services": {
    title: "Our Services – Meet & Greet & Park & Ride Airport Parking",
    description: "Explore our airport parking services including Meet & Greet and Park & Ride. Convenient, secure, and affordable options.",
    canonical: `${BASE}/services`,
  },
  "/terms": {
    title: "Terms & Conditions – Go Glasgow Airport Parking",
    description: "Read the terms and conditions for using Go Glasgow Airport Parking booking services.",
    canonical: `${BASE}/terms`,
  },
  "/privacy": {
    title: "Privacy Policy – Go Glasgow Airport Parking",
    description: "Our privacy policy explains how we collect, use and protect your personal data at Go Glasgow Airport Parking.",
    canonical: `${BASE}/privacy`,
  },
  "/testimonials": {
    title: "Customer Reviews – Go Glasgow Airport Parking",
    description: "Read real customer reviews and testimonials about our Glasgow Airport parking services.",
    canonical: `${BASE}/testimonials`,
  },
};

export function seoPrerender(): Plugin {
  return {
    name: "seo-prerender",
    enforce: "post",
    closeBundle() {
      const distDir = path.resolve(process.cwd(), "dist");
      const indexPath = path.join(distDir, "index.html");

      if (!fs.existsSync(indexPath)) return;

      const baseHtml = fs.readFileSync(indexPath, "utf-8");

      for (const [route, meta] of Object.entries(routes)) {
        // Create directory e.g. dist/faqs/
        const dir = path.join(distDir, route.slice(1));
        fs.mkdirSync(dir, { recursive: true });

        let html = baseHtml;

        // Replace <title>
        html = html.replace(
          /<title>[^<]*<\/title>/,
          `<title>${meta.title}</title>`
        );

        // Replace canonical
        html = html.replace(
          /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
          `<link rel="canonical" href="${meta.canonical}" />`
        );

        // Replace meta description
        html = html.replace(
          /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
          `<meta name="description" content="${meta.description}">`
        );

        // Replace OG title
        html = html.replace(
          /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
          `<meta property="og:title" content="${meta.title}">`
        );

        // Replace OG description
        html = html.replace(
          /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
          `<meta property="og:description" content="${meta.description}">`
        );

        // Replace OG URL
        html = html.replace(
          /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
          `<meta property="og:url" content="${meta.canonical}">`
        );

        // Replace Twitter title
        html = html.replace(
          /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
          `<meta name="twitter:title" content="${meta.title}">`
        );

        // Replace Twitter description
        html = html.replace(
          /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
          `<meta name="twitter:description" content="${meta.description}">`
        );

        fs.writeFileSync(path.join(dir, "index.html"), html);
      }

      console.log(`[seo-prerender] Generated ${Object.keys(routes).length} route HTML files`);
    },
  };
}
