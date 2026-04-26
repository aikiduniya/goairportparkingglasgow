/**
 * Traffic source detection
 * - "seo"      => organic search (Google, Bing, Yahoo, DuckDuckGo, etc.)
 * - "Backlink" => referral from another website / blog
 * - ""         => paid campaign (utm_source=cpc/paid, gclid, fbclid, msclkid, etc.)
 *                 OR direct traffic (no referrer)
 *
 * Result is cached in sessionStorage so it stays consistent across pages
 * for the same visit and never duplicates / changes mid-session.
 */

const STORAGE_KEY = "ts_detected_v1";

const SEARCH_ENGINE_HOSTS = [
  "google.",
  "bing.",
  "yahoo.",
  "duckduckgo.",
  "yandex.",
  "baidu.",
  "ecosia.",
  "ask.com",
  "aol.",
  "brave.com",
];

const PAID_PARAMS = [
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
  "ttclid",
  "twclid",
  "li_fat_id",
  "yclid",
  "dclid",
];

const PAID_MEDIUMS = ["cpc", "ppc", "paid", "paidsearch", "paid-search", "display", "paid_social", "paid-social"];

function isSearchEngine(host: string): boolean {
  const h = host.toLowerCase();
  return SEARCH_ENGINE_HOSTS.some((s) => h.includes(s));
}

export function detectTrafficSource(): string {
  if (typeof window === "undefined") return "";

  // Return cached value if already detected this session (no duplicates)
  try {
    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (cached !== null) return cached;
  } catch {
    // ignore storage errors
  }

  const params = new URLSearchParams(window.location.search);

  // 1) Paid campaign? -> blank
  const hasPaidClickId = PAID_PARAMS.some((p) => params.has(p));
  const utmMedium = (params.get("utm_medium") || "").toLowerCase();
  const utmSource = (params.get("utm_source") || "").toLowerCase();
  const isPaidByUtm =
    PAID_MEDIUMS.includes(utmMedium) ||
    utmSource === "google_ads" ||
    utmSource === "googleads" ||
    utmSource === "facebook_ads" ||
    utmSource === "meta_ads";

  let result = "";

  if (hasPaidClickId || isPaidByUtm) {
    result = "";
  } else {
    // 2) Check referrer
    const referrer = document.referrer || "";
    if (referrer) {
      try {
        const refHost = new URL(referrer).hostname;
        const currentHost = window.location.hostname;

        // Same-site navigation -> ignore (do not overwrite)
        if (refHost && refHost !== currentHost) {
          if (isSearchEngine(refHost)) {
            result = "SEO";
          } else {
            result = "Backlink";
          }
        }
      } catch {
        // bad referrer URL - leave blank
      }
    }
    // No referrer => direct -> blank ("")
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, result);
  } catch {
    // ignore
  }

  return result;
}
