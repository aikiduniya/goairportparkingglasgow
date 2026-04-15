/**
 * Post-build script: generates lightweight static HTML snapshots
 * for each route so Apache can serve them to search-engine bots.
 *
 * Each file is a minimal copy of index.html with route-specific
 * <title>, <meta description>, <link rel="canonical">, <meta og:*>,
 * and an optional robots directive.
 *
 * The SPA bundle is still loaded so if a real user ever hits these
 * files the app hydrates normally.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";

const DOMAIN = "https://goairportparkingglasgow.com";
const SITE_NAME = "Go Glasgow Airport Parking";
const OG_IMAGE =
  "https://globalparkingtech.co.uk/logos/1769611943_f4bf76729560026cb896.png";

/** @type {Array<{path:string, title:string, description:string, robots?:string}>} */
const routes = [
  {
    path: "/",
    title: "Glasgow Airport Parking – Meet & Greet & Park & Ride Deals",
    description:
      "Book secure Glasgow Airport parking with Meet & Greet and Park & Ride services. Affordable prices, easy booking and reliable transfers.",
  },
  {
    path: "/about",
    title: "About Go Airport Parking Glasgow | Trusted Airport Parking",
    description:
      "Learn about Go Airport Parking Glasgow – trusted, affordable Meet & Greet and Park & Ride airport parking services at Glasgow Airport.",
  },
  {
    path: "/services",
    title: "Glasgow Airport Parking Services | Meet & Greet, Park & Ride",
    description:
      "Explore our Glasgow Airport parking services including Meet & Greet, Park & Ride, and long-stay options. Secure, affordable, and convenient.",
  },
  {
    path: "/faqs",
    title:
      "Glasgow Airport Parking FAQs | Booking Help, Services & Support",
    description:
      "Find answers to Glasgow Airport parking questions including bookings, arrivals, services, and parking support before you travel.",
  },
  {
    path: "/blogs",
    title: "Glasgow Airport Parking Blog | Tips, Guides & Travel News",
    description:
      "Read the latest Glasgow Airport parking tips, travel guides, and news to help you plan stress-free airport parking.",
  },
  {
    path: "/contact",
    title:
      "Contact Go Airport Parking Glasgow | Booking Support & Enquiries",
    description:
      "Get in touch with Go Airport Parking Glasgow for booking support, enquiries, and customer service. We're here to help.",
  },
  {
    path: "/testimonials",
    title: "Customer Reviews | Go Airport Parking Glasgow Testimonials",
    description:
      "Read real customer reviews and testimonials about Go Airport Parking Glasgow's Meet & Greet and Park & Ride services.",
  },
  {
    path: "/international",
    title: "International Airport Parking | Go Airport Parking",
    description:
      "Find affordable international airport parking options with Meet & Greet and Park & Ride services across major airports.",
  },
  {
    path: "/terms",
    title: "Terms & Conditions | Go Airport Parking Glasgow",
    description:
      "Read the terms and conditions for booking Glasgow Airport parking with Go Airport Parking Glasgow.",
    robots: "noindex, follow",
  },
  {
    path: "/privacy",
    title: "Privacy Policy | Go Airport Parking Glasgow",
    description:
      "Read our privacy policy to understand how Go Airport Parking Glasgow collects, uses, and protects your personal data.",
    robots: "noindex, follow",
  },
];

// ── helpers ────────────────────────────────────────────────
function canonicalUrl(routePath) {
  return routePath === "/" ? DOMAIN : `${DOMAIN}${routePath}`;
}

function buildHead(route) {
  const url = canonicalUrl(route.path);
  const robotsTag = route.robots
    ? `<meta name="robots" content="${route.robots}">`
    : `<meta name="robots" content="index, follow">`;

  return `
    <title>${escHtml(route.title)}</title>
    <meta name="description" content="${escHtml(route.description)}">
    ${robotsTag}
    <link rel="canonical" href="${url}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escHtml(route.title)}">
    <meta property="og:description" content="${escHtml(route.description)}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${OG_IMAGE}">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escHtml(route.title)}">
    <meta name="twitter:description" content="${escHtml(route.description)}">
    <meta name="twitter:image" content="${OG_IMAGE}">`;
}

function escHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ── main ───────────────────────────────────────────────────
const distDir = join(process.cwd(), "dist");
const indexPath = join(distDir, "index.html");

if (!existsSync(indexPath)) {
  console.error("dist/index.html not found – run `npm run build` first.");
  process.exit(1);
}

const baseHtml = readFileSync(indexPath, "utf-8");

// Strip existing <title>, <meta description>, <meta robots>,
// <link canonical>, og:*, twitter:* from the base HTML so we can inject fresh ones.
const stripped = baseHtml
  .replace(/<title>[^<]*<\/title>/i, "")
  .replace(/<meta\s+name="description"[^>]*>/i, "")
  .replace(/<meta\s+name="robots"[^>]*>/i, "")
  .replace(/<meta\s+name="keywords"[^>]*>/i, "")
  .replace(/<link\s+rel="canonical"[^>]*>/i, "")
  .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, "")
  .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, "");

const prerenderDir = join(distDir, "__prerender");
mkdirSync(prerenderDir, { recursive: true });

for (const route of routes) {
  const headBlock = buildHead(route);
  // Inject right after <head> opening tag
  const html = stripped.replace(/<head>/i, `<head>${headBlock}`);

  // Write e.g. dist/__prerender/about.html, dist/__prerender/index.html
  const filename =
    route.path === "/" ? "index.html" : `${route.path.slice(1)}.html`;
  const outPath = join(prerenderDir, filename);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, "utf-8");
  console.log(`  ✓ ${filename}`);
}

console.log(`\nGenerated ${routes.length} prerender snapshots in dist/__prerender/`);
