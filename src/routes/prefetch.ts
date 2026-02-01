/**
 * Route chunk prefetching to reduce Suspense blank time on navigation.
 * Keep this file in sync with lazy route imports in src/App.tsx.
 */

export type AppPath =
  | "/"
  | "/about"
  | "/international"
  | "/faqs"
  | "/blogs"
  | "/contact"
  | "/select-parking"
  | "/booking/profile"
  | "/booking/confirm"
  | "/booking/success"
  | "/thankyou"
  | "/terms"
  | "/privacy"
  | "/testimonials";

const prefetchMap: Record<string, () => Promise<unknown>> = {
  "/about": () => import("@/pages/AboutUs"),
  "/international": () => import("@/pages/International"),
  "/faqs": () => import("@/pages/FAQs"),
  "/blogs": () => import("@/pages/Blogs"),
  "/contact": () => import("@/pages/ContactUs"),
  "/select-parking": () => import("@/pages/SelectParking"),
  "/booking/profile": () => import("@/pages/BookingProfile"),
  "/booking/confirm": () => import("@/pages/BookingConfirm"),
  "/booking/success": () => import("@/pages/BookingSuccess"),
  "/thankyou": () => import("@/pages/BookingSuccess"),
  "/terms": () => import("@/pages/Terms"),
  "/privacy": () => import("@/pages/Privacy"),
  "/testimonials": () => import("@/pages/TestimonialsPage"),
};

export function prefetchRoute(path: string) {
  const fn = prefetchMap[path];
  if (!fn) return;
  // Fire-and-forget
  void fn();
}
