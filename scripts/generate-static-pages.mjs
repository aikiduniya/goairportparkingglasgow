/**
 * Post-build script: generates a static HTML file for every route by cloning
 * dist/index.html and injecting per-route <title>, <meta name="description">
 * and <link rel="canonical">.
 *
 * This fixes Google Search Console issues:
 *   - "Duplicate without user-selected canonical"
 *   - "Redirect error" (deep links resolve to a real file, no SPA fallback redirect chain)
 *
 * The injected tags are present in the HTML at crawl time (no JS needed),
 * while the SPA still hydrates and runs normally because index.html content
 * is preserved.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist");
const indexPath = path.join(distDir, "index.html");

const SITE_ORIGIN = "https://goairportparkingglasgow.com";

/**
 * Routes to pre-generate. Keep in sync with src/App.tsx <Routes>.
 * Excludes auth-gated / dynamic / transactional routes (booking flow, payment,
 * blog detail slugs, NotFound).
 */
const routes = [
  {
    path: "/",
    title: "Glasgow Airport Parking – Meet & Greet & Park & Ride Deals",
    description:
      "Book secure Glasgow Airport parking with Meet & Greet and Park & Ride services. Affordable prices, easy booking and reliable transfers.",
  },
  {
    path: "/about",
    title: "About Us | Go Glasgow Airport Parking",
    description:
      "Learn about Go Glasgow Airport Parking — our story, values and commitment to safe, affordable and reliable airport parking.",
  },
  {
    path: "/services",
    title: "Our Services - Meet & Greet & Park & Ride Airport Parking",
    description:
      "Explore our airport parking services including Meet & Greet and Park & Ride. Convenient, secure and affordable parking options for every traveller.",
  },
  {
    path: "/international",
    title: "International Airport Parking | Go Airport Parking",
    description:
      "Compare and book airport parking across the UK and international airports. Trusted Meet & Greet and Park & Ride services worldwide.",
  },
  {
    path: "/faqs",
    title: "FAQs | Glasgow Airport Parking Help & Booking Questions",
    description:
      "Find answers to common questions about booking, payments, Meet & Greet and Park & Ride services at Glasgow Airport.",
  },
  {
    path: "/blogs",
    title: "Glasgow Airport Parking Blog | Tips, Guides & Travel Advice",
    description:
      "Read helpful Glasgow Airport parking guides, travel tips and planning advice designed to make your airport experience easier and stress-free.",
  },
  {
    path: "/contact",
    title: "Contact Us | Go Glasgow Airport Parking",
    description:
      "Get in touch with Go Glasgow Airport Parking for booking help, customer support or general enquiries. We're here 24/7 to assist you.",
  },
  {
    path: "/testimonials",
    title: "Customer Reviews & Testimonials | Go Glasgow Airport Parking",
    description:
      "Read genuine customer reviews and testimonials about our Glasgow Airport parking services from Google, Trustpilot and Facebook.",
  },
  {
    path: "/terms",
    title: "Terms & Conditions | Go Glasgow Airport Parking",
    description:
      "Read the terms and conditions for booking and using Go Glasgow Airport Parking services.",
  },
  {
    path: "/privacy",
    title: "Privacy Policy | Go Glasgow Airport Parking",
    description:
      "Read our privacy policy to learn how Go Glasgow Airport Parking collects, uses and protects your personal information.",
  },
];

if (!fs.existsSync(indexPath)) {
  console.warn(`[generate-static-pages] Skipping — ${indexPath} not found.`);
  process.exit(0);
}

const baseHtml = fs.readFileSync(indexPath, "utf8");

function injectMeta(html, { url, title, description }) {
  let out = html;

  // Replace <title>
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);

  // Replace <meta name="description">
  out = out.replace(
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${description}">`,
  );

  // Replace/insert OG and Twitter title + description
  const replaceOrInsert = (pattern, replacement) => {
    if (pattern.test(out)) {
      out = out.replace(pattern, replacement);
    } else {
      out = out.replace("</head>", `  ${replacement}\n  </head>`);
    }
  };

  replaceOrInsert(
    /<meta\s+property=["']og:title["'][^>]*>/i,
    `<meta property="og:title" content="${title}">`,
  );
  replaceOrInsert(
    /<meta\s+property=["']og:description["'][^>]*>/i,
    `<meta property="og:description" content="${description}">`,
  );
  replaceOrInsert(
    /<meta\s+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${url}">`,
  );
  replaceOrInsert(
    /<meta\s+name=["']twitter:title["'][^>]*>/i,
    `<meta name="twitter:title" content="${title}">`,
  );
  replaceOrInsert(
    /<meta\s+name=["']twitter:description["'][^>]*>/i,
    `<meta name="twitter:description" content="${description}">`,
  );

  // Insert/replace canonical
  if (/<link[^>]+rel=["']canonical["'][^>]*>/i.test(out)) {
    out = out.replace(
      /<link[^>]+rel=["']canonical["'][^>]*>/i,
      `<link rel="canonical" href="${url}">`,
    );
  } else {
    out = out.replace(
      "</head>",
      `  <link rel="canonical" href="${url}">\n  </head>`,
    );
  }

  return out;
}

let count = 0;
for (const route of routes) {
  const url = route.path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${route.path}`;
  const html = injectMeta(baseHtml, { url, title: route.title, description: route.description });

  if (route.path === "/") {
    fs.writeFileSync(indexPath, html, "utf8");
  } else {
    const dir = path.join(distDir, route.path.replace(/^\//, ""));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), html, "utf8");
  }
  count++;
}

console.log(`[generate-static-pages] Generated ${count} static HTML files with canonical tags.`);
