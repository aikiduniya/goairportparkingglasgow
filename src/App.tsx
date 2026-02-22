import { lazy, Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Lazy load toasters - not needed on initial page load
const Toaster = lazy(() => import("@/components/ui/toaster").then(m => ({ default: m.Toaster })));
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DomainConfigProvider } from "./contexts/DomainConfigContext";
import Index from "./pages/Index";
import RouteLoading from "@/components/RouteLoading";

// Lazy load Sonner toaster - not needed on initial page load
const Sonner = lazy(() => import("@/components/ui/sonner").then(m => ({ default: m.Toaster })));

// Lazy load non-critical routes
const AboutUs = lazy(() => import("./pages/AboutUs"));
const International = lazy(() => import("./pages/International"));
const FAQs = lazy(() => import("./pages/FAQs"));
const Blogs = lazy(() => import("./pages/Blogs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));

const SelectParking = lazy(() => import("./pages/SelectParking"));
const BookingProfile = lazy(() => import("./pages/BookingProfile"));
const BookingConfirm = lazy(() => import("./pages/BookingConfirm"));
const BookingSuccess = lazy(() => import("./pages/BookingSuccess"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const TestimonialsPage = lazy(() => import("./pages/TestimonialsPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DomainConfigProvider>
      <TooltipProvider>
        <Suspense fallback={null}>
          <Toaster />
          <Sonner />
        </Suspense>
        <BrowserRouter>
          <Suspense fallback={<RouteLoading label="Loading page…" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/international" element={<International />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:slug" element={<BlogDetail />} />
              <Route path="/contact" element={<ContactUs />} />
              
              <Route path="/select-parking" element={<SelectParking />} />
              <Route path="/booking/profile" element={<BookingProfile />} />
              <Route path="/booking/confirm" element={<BookingConfirm />} />
              <Route path="/booking/success" element={<BookingSuccess />} />
              <Route path="/thankyou" element={<BookingSuccess />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </DomainConfigProvider>
  </QueryClientProvider>
);

export default App;
