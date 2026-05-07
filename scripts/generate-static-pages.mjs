/**
 * Post-build script: generates static, crawlable HTML files for every public URL.
 *
 * Important SEO detail: internal pages are written as flat files (about.html,
 * services.html, etc.) instead of folders (about/index.html). On Apache/Hostinger,
 * physical folders make /about redirect to /about/, which triggered Google Search
 * Console's "Redirect error" for the sitemap URLs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const indexPath = path.join(distDir, "index.html");
const blogsSourcePath = path.join(projectRoot, "src", "data", "blogs.ts");

const SITE_ORIGIN = "https://goairportparkingglasgow.com";

const publicRoutes = [
  {
    path: "/",
    outputFile: "index.html",
    title: "Glasgow Airport Parking – Meet & Greet & Park & Ride Deals",
    description:
      "Book secure Glasgow Airport parking with Meet & Greet and Park & Ride services. Affordable prices, easy booking and reliable transfers.",
    priority: "1.0",
    changefreq: "weekly",
  },
  {
    path: "/about",
    outputFile: "about.html",
    title: "About Us | Go Glasgow Airport Parking",
    description:
      "Learn about Go Glasgow Airport Parking — our story, values and commitment to safe, affordable and reliable airport parking.",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    path: "/services",
    outputFile: "services.html",
    title: "Our Services - Meet & Greet & Park & Ride Airport Parking",
    description:
      "Explore our airport parking services including Meet & Greet and Park & Ride. Convenient, secure and affordable parking options for every traveller.",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    path: "/faqs",
    outputFile: "faqs.html",
    title: "FAQs | Glasgow Airport Parking Help & Booking Questions",
    description:
      "Find answers to common questions about booking, payments, Meet & Greet and Park & Ride services at Glasgow Airport.",
    priority: "0.7",
    changefreq: "monthly",
  },
  {
    path: "/blogs",
    outputFile: "blogs.html",
    title: "Glasgow Airport Parking Blog | Tips, Guides & Travel Advice",
    description:
      "Read helpful Glasgow Airport parking guides, travel tips and planning advice designed to make your airport experience easier and stress-free.",
    priority: "0.7",
    changefreq: "weekly",
  },
  {
    path: "/contact",
    outputFile: "contact.html",
    title: "Contact Us | Go Glasgow Airport Parking",
    description:
      "Get in touch with Go Glasgow Airport Parking for booking help, customer support or general enquiries. We're here 24/7 to assist you.",
    priority: "0.7",
    changefreq: "monthly",
  },
  {
    path: "/testimonials",
    outputFile: "testimonials.html",
    title: "Customer Reviews & Testimonials | Go Glasgow Airport Parking",
    description:
      "Read genuine customer reviews and testimonials about our Glasgow Airport parking services from Google, Trustpilot and Facebook.",
    priority: "0.6",
    changefreq: "monthly",
  },
  {
    path: "/international",
    outputFile: "international.html",
    title: "International Airport Parking | Go Airport Parking",
    description:
      "Compare and book airport parking across the UK and international airports. Trusted Meet & Greet and Park & Ride services worldwide.",
    priority: "0.6",
    changefreq: "monthly",
  },
  {
    path: "/terms",
    outputFile: "terms.html",
    title: "Terms & Conditions | Go Glasgow Airport Parking",
    description: "Read the terms and conditions for booking and using Go Glasgow Airport Parking services.",
    priority: "0.3",
    changefreq: "yearly",
  },
  {
    path: "/privacy",
    outputFile: "privacy.html",
    title: "Privacy Policy | Go Glasgow Airport Parking",
    description:
      "Read our privacy policy to learn how Go Glasgow Airport Parking collects, uses and protects your personal information.",
    priority: "0.3",
    changefreq: "yearly",
  },
];

function htmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function slugToOutputFile(slug) {
  return `blog-${slug}.html`;
}

function getBlogRoutes() {
  if (!fs.existsSync(blogsSourcePath)) return [];

  const source = fs.readFileSync(blogsSourcePath, "utf8");
  const blocks = source.match(/\{[\s\S]*?slug:\s*"[^"]+"[\s\S]*?metaKeywords:/g) ?? [];

  return blocks
    .map((block) => {
      const slug = block.match(/slug:\s*"([^"]+)"/)?.[1];
      const title = block.match(/metaTitle:\s*"([^"]+)"/)?.[1];
      const description = block.match(/metaDescription:\s*"([^"]+)"/)?.[1];
      if (!slug || !title || !description) return null;

      return {
        path: `/blogs/${slug}`,
        outputFile: slugToOutputFile(slug),
        title,
        description,
        priority: "0.6",
        changefreq: "monthly",
      };
    })
    .filter(Boolean);
}

function replaceOrInsert(html, pattern, replacement) {
  if (pattern.test(html)) return html.replace(pattern, replacement);
  return html.replace("</head>", `  ${replacement}\n  </head>`);
}

function injectMeta(html, { url, title, description }) {
  const safeTitle = htmlEscape(title);
  const safeDescription = htmlEscape(description);
  let out = html;

  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);

  out = replaceOrInsert(
    out,
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${safeDescription}">`,
  );

  out = replaceOrInsert(
    out,
    /<meta\s+name=["']robots["'][^>]*>/i,
    `<meta name="robots" content="index, follow">`,
  );

  out = replaceOrInsert(
    out,
    /<meta\s+property=["']og:title["'][^>]*>/i,
    `<meta property="og:title" content="${safeTitle}">`,
  );
  out = replaceOrInsert(
    out,
    /<meta\s+property=["']og:description["'][^>]*>/i,
    `<meta property="og:description" content="${safeDescription}">`,
  );
  out = replaceOrInsert(
    out,
    /<meta\s+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${url}">`,
  );
  out = replaceOrInsert(
    out,
    /<meta\s+name=["']twitter:title["'][^>]*>/i,
    `<meta name="twitter:title" content="${safeTitle}">`,
  );
  out = replaceOrInsert(
    out,
    /<meta\s+name=["']twitter:description["'][^>]*>/i,
    `<meta name="twitter:description" content="${safeDescription}">`,
  );

  out = replaceOrInsert(
    out,
    /<link[^>]+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${url}">`,
  );

  return out;
}

function writeSitemap(routes) {
  const urls = routes
    .map(
      (route) => `  <url>
    <loc>${SITE_ORIGIN}${route.path === "/" ? "/" : route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  fs.writeFileSync(path.join(distDir, "sitemap.xml"), xml, "utf8");
}

if (!fs.existsSync(indexPath)) {
  console.warn(`[generate-static-pages] Skipping — ${indexPath} not found.`);
  process.exit(0);
}

const baseHtml = fs.readFileSync(indexPath, "utf8");
const routes = [...publicRoutes, ...getBlogRoutes()];

for (const route of routes) {
  const url = route.path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${route.path}`;
  const html = injectMeta(baseHtml, { url, title: route.title, description: route.description });
  fs.writeFileSync(path.join(distDir, route.outputFile), html, "utf8");
}

writeSitemap(routes);

console.log(`[generate-static-pages] Generated ${routes.length} flat static HTML files and sitemap.xml.`);
