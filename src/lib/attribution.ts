// Booking attribution detection & persistence
// Stores traffic source/medium/channel/referrer in sessionStorage on first landing.

export interface Attribution {
  traffic_source: string;    // referring domain OR utm_source OR "google"/"direct"
  traffic_medium: string;    // utm_medium OR "cpc"/"organic"/"referral"/"(none)"
  traffic_channel: string;   // paid_search | paid_social | organic_search | referral | direct
  traffic_referrer: string;  // full referring URL
  landing_url: string;
  landing_at: string;
}

const STORAGE_KEY = "lvbl_attribution_v1";

const SEARCH_ENGINES = [
  "google.",
  "bing.",
  "yahoo.",
  "duckduckgo.",
  "ecosia.",
  "yandex.",
  "baidu.",
  "ask.com",
];

const SOCIAL_DOMAINS = [
  "facebook.",
  "instagram.",
  "twitter.",
  "x.com",
  "t.co",
  "linkedin.",
  "tiktok.",
  "pinterest.",
  "reddit.",
  "youtube.",
];

const getDomain = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
};

const isSelfReferral = (referrerHost: string): boolean => {
  if (!referrerHost) return false;
  const ownHost = window.location.hostname.replace(/^www\./, "").toLowerCase();
  if (referrerHost === ownHost) return true;
  // Allow common subdomain/preview matches
  const ownRoot = ownHost.split(".").slice(-2).join(".");
  const refRoot = referrerHost.split(".").slice(-2).join(".");
  return ownRoot === refRoot;
};

const matchesAny = (host: string, list: string[]): boolean =>
  list.some((s) => host.includes(s));

export const detectAttribution = (): Attribution => {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const referrer = document.referrer || "";
  const referrerHost = getDomain(referrer);
  const selfRef = isSelfReferral(referrerHost);

  const utm_source = params.get("utm_source") || "";
  const utm_medium = params.get("utm_medium") || "";

  const gclid = params.get("gclid");
  const gad_source = params.get("gad_source");
  const gbraid = params.get("gbraid");
  const wbraid = params.get("wbraid");
  const msclkid = params.get("msclkid");
  const fbclid = params.get("fbclid");

  let channel = "direct";
  let source = "";
  let medium = "";

  // 1. Paid search clicks
  if (gclid || gad_source || gbraid || wbraid) {
    channel = "paid_search";
    source = utm_source || "google";
    medium = utm_medium || "cpc";
  } else if (msclkid) {
    channel = "paid_search";
    source = utm_source || "bing";
    medium = utm_medium || "cpc";
  } else if (fbclid) {
    channel = "paid_social";
    source = utm_source || "facebook";
    medium = utm_medium || "cpc";
  }
  // 2. Explicit UTM
  else if (utm_source || utm_medium) {
    source = utm_source || (referrerHost && !selfRef ? referrerHost : "direct");
    medium = utm_medium || "referral";
    const m = medium.toLowerCase();
    if (["cpc", "ppc", "paid", "paidsearch", "paid-search"].includes(m)) channel = "paid_search";
    else if (["paidsocial", "paid-social", "social-paid"].includes(m)) channel = "paid_social";
    else if (m === "organic") channel = "organic_search";
    else if (["referral", "affiliate"].includes(m)) channel = "referral";
    else channel = "referral";
  }
  // 3. Referrer-based (ignore self-referrals)
  else if (referrerHost && !selfRef) {
    if (matchesAny(referrerHost, SEARCH_ENGINES)) {
      channel = "organic_search";
      source = referrerHost;
      medium = "organic";
    } else if (matchesAny(referrerHost, SOCIAL_DOMAINS)) {
      channel = "referral";
      source = referrerHost;
      medium = "social";
    } else {
      channel = "referral";
      source = referrerHost;
      medium = "referral";
    }
  }
  // 4. Direct
  else {
    channel = "direct";
    source = "direct";
    medium = "(none)";
  }

  return {
    traffic_source: source,
    traffic_medium: medium,
    traffic_channel: channel,
    traffic_referrer: selfRef ? "" : referrer,
    landing_url: window.location.href,
    landing_at: new Date().toISOString(),
  };
};

export const initAttribution = (): Attribution | null => {
  if (typeof window === "undefined") return null;
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing) return JSON.parse(existing) as Attribution;
    const attr = detectAttribution();
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attr));
    return attr;
  } catch (e) {
    console.warn("[attribution] init failed", e);
    return null;
  }
};

export const getAttribution = (): Attribution | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Attribution;
    return initAttribution();
  } catch {
    return null;
  }
};

// Map channel to legacy DB value
export const getDbAttributionValue = (channel: string | undefined): string => {
  if (channel === "organic_search") return "SEO";
  if (channel === "referral") return "Backlink";
  return ""; // paid + direct + unknown => blank
};
