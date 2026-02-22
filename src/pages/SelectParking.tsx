import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingStepper from "@/components/booking/BookingStepper";
import DatesSummary from "@/components/booking/DatesSummary";
import ParkingFilters from "@/components/booking/ParkingFilters";
import ProductInfoModal from "@/components/booking/ProductInfoModal";
import { useDomainConfig } from "@/contexts/DomainConfigContext";
import { AlertCircle, Loader2 } from "lucide-react";

// Styles for legacy HTML returned by the products API
import "@/styles/legacy-products.css";

interface ProductInfo {
  name: string;
  overview?: string;
  procedures?: string;
  photos?: string[];
  mapUrl?: string;
  mapEmbed?: string;
  category?: string;
}

interface ParsedProduct {
  html: string;
  price: number;
  category: string;
}

// Helper to parse price from HTML element - uses data-price attribute first
const extractPrice = (element: Element): number => {
  // Try to get price from data-price attribute
  const dataPriceAttr = element.getAttribute("data-price");
  if (dataPriceAttr) {
    const price = parseFloat(dataPriceAttr.replace(/[€,]/g, ""));
    if (!isNaN(price)) return price;
  }
  
  // Fallback to regex
  const html = element.outerHTML;
  const priceMatch = html.match(/€\s*([\d,.]+)/);
  if (priceMatch) {
    return parseFloat(priceMatch[1].replace(",", ""));
  }
  return 0;
};

// Helper to get product category from data-category attribute
const getProductCategory = (element: Element): string => {
  const category = element.getAttribute("data-category") || "";
  return category.toLowerCase();
};

// Parse HTML into individual product cards
const parseProductCards = (html: string): ParsedProduct[] => {
  if (!html) return [];
  
  // Create a temporary container to parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  
  // Find all product cards with .product-card class (from API structure)
  const cards = tempDiv.querySelectorAll(".product-card");
  
  if (cards.length === 0) {
    // If no cards found, return empty
    return [];
  }
  
  return Array.from(cards).map(card => ({
    html: card.outerHTML,
    price: extractPrice(card),
    category: getProductCategory(card)
  }));
};

const SelectParking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { config } = useDomainConfig();
  
  // Use exact field names from old PHP flow
  const ParkingFrom = searchParams.get("ParkingFrom") || "";
  const CollectingCar = searchParams.get("CollectingCar") || "";
  const arrival_time = searchParams.get("arrival_time") || "1200";
  const depart_time = searchParams.get("depart_time") || "1200";
  const promoCode = searchParams.get("promoCode") || "";
  const traffic_source = searchParams.get("traffic_source") || "";
  
  const [activeFilter, setActiveFilter] = useState<"all" | "meet-greet" | "park-ride">("all");
  const [sortBy, setSortBy] = useState<"low-to-high" | "high-to-low">("low-to-high");
  const [rawProductsHtml, setRawProductsHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedProductInfo, setSelectedProductInfo] = useState<ProductInfo | null>(null);

  // Parse, filter, and sort products
  const filteredProducts = useMemo(() => {
    const products = parseProductCards(rawProductsHtml);
    
    // Apply filter based on data-category attribute
    let filtered = products;
    if (activeFilter === "meet-greet") {
      filtered = products.filter(p => p.category.includes("meet") && p.category.includes("greet"));
    } else if (activeFilter === "park-ride") {
      filtered = products.filter(p => p.category.includes("park") && p.category.includes("ride"));
    }
    
    // Apply sort
    filtered.sort((a, b) => {
      if (sortBy === "low-to-high") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
    
    return filtered;
  }, [rawProductsHtml, activeFilter, sortBy]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!config) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Build query params for edge function
        const queryParams = new URLSearchParams({
          airport: config.airport_code,
          selectedDate: ParkingFrom,
          changedDate: CollectingCar,
          arrivalTime: arrival_time,
          departureTime: depart_time,
          code: promoCode,
          website: config.domain,
          cur: config.cur,
          webtype: config.webtype,
          traffic_source: traffic_source,
        });

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-parking-products?${queryParams.toString()}`,
          {
            headers: {
              "Content-Type": "application/json",
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch parking products");
        }

        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.error);
        }

        // Inject click handlers for product selection
        let html = result.html || "";
        
        // The HTML from API contains links - we need to intercept them
        // Replace href links to profile.php with our React route
        html = html.replace(
          /href=['"]profile\.php\?([^'"]+)['"]/g,
          (match: string, params: string) => {
            return `onclick="window.handleParkingSelection('${params}'); return false;" href="#"`;
          }
        );

        // Replace "More Info" button clicks to open modal with product data
        // The API HTML has class "moreInfoBtn" with data attributes
        html = html.replace(
          /class="([^"]*moreInfoBtn[^"]*)"/g,
          (match: string, classes: string) => {
            return `class="${classes}" onclick="window.handleProductInfo(this); return false;"`;
          }
        );

        setRawProductsHtml(html);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err instanceof Error ? err.message : "Failed to load parking options");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [config, ParkingFrom, CollectingCar, arrival_time, depart_time, promoCode, traffic_source]);

  // Global handler for product selection from injected HTML
  useEffect(() => {
    (window as any).handleParkingSelection = (queryString: string) => {
      const params = new URLSearchParams(queryString);
      
      // Build new params with exact field names for profile page
      const profileParams = new URLSearchParams({
        selectedDate: params.get("selectedDate") || ParkingFrom,
        changedDate: params.get("changedDate") || CollectingCar,
        arrivalTime: params.get("arrivalTime") || arrival_time,
        departureTime: params.get("departureTime") || depart_time,
        name: params.get("name") || "",
        price: params.get("price") || "",
        p_id: params.get("p_id") || "",
        operator_id: params.get("operator_id") || "",
        promo_code: params.get("promo_code") || promoCode,
        promo_price: params.get("promo_price") || "",
        traffic_source: traffic_source,
      });

      navigate(`/booking/profile?${profileParams.toString()}`);
    };

    // Global handler for opening product info modal
    (window as any).handleProductInfo = (element: HTMLElement) => {
      // The button itself has all the data attributes from the API
      const name = element.getAttribute("data-name") || element.getAttribute("data-product") || "Product Info";
      
      // Get category from parent product-card element
      const productCard = element.closest(".product-card");
      const category = productCard?.getAttribute("data-category") || "";
      
      // API uses data-introduction for overview
      const introduction = element.getAttribute("data-introduction") || "";
      
      // API uses data-arrival_procedures and data-departure_procedures for procedures
      const arrivalProcedures = element.getAttribute("data-arrival_procedures") || "";
      const departureProcedures = element.getAttribute("data-departure_procedures") || "";
      const securityMeasures = element.getAttribute("data-security_measures") || "";
      const information = element.getAttribute("data-information") || "";
      
      // Combine all procedure-related info
      let procedures = "";
      if (arrivalProcedures) {
        procedures += `<h3>Arrival Procedures</h3><p>${arrivalProcedures.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')}</p>`;
      }
      if (departureProcedures) {
        procedures += `<h3>Departure Procedures</h3><p>${departureProcedures}</p>`;
      }
      if (securityMeasures) {
        procedures += `<h3>Security Measures</h3><p>${securityMeasures}</p>`;
      }
      
      // API uses data-logo for product image
      const logo = element.getAttribute("data-logo") || "";
      const photos = logo ? [`https://globalparkingtech.co.uk/logos/products/${logo}`] : [];
      
      // API uses data-map for map embed
      const mapEmbed = element.getAttribute("data-map") || "";

      setSelectedProductInfo({
        name,
        overview: introduction,
        procedures: procedures || information,
        photos,
        mapEmbed,
        category,
      });
      setInfoModalOpen(true);
    };

    return () => {
      delete (window as any).handleParkingSelection;
      delete (window as any).handleProductInfo;
    };
  }, [navigate, ParkingFrom, CollectingCar, arrival_time, depart_time, promoCode, traffic_source]);

  // Combine filtered products back to HTML
  const displayHtml = filteredProducts.map(p => p.html).join("");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 md:pt-24 pb-6 bg-primary">
        <div className="container mx-auto px-4">
          <BookingStepper currentStep={2} />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 md:py-8 bg-cream">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar - Dates Summary */}
            <div className="lg:col-span-1">
              <DatesSummary
                entryDate={ParkingFrom}
                entryTime={arrival_time}
                exitDate={CollectingCar}
                exitTime={depart_time}
                promoCode={promoCode}
              />
            </div>

            {/* Main Content - Parking Options */}
            <div className="lg:col-span-3">
              <div className="bg-card rounded-2xl p-4 md:p-6 shadow-lg">
                <h1 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                  Choose Your Parking
                </h1>

                {/* Filters */}
                <ParkingFilters
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />

                {/* Loading State */}
                {loading && (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Loading parking options...</span>
                  </div>
                )}

                {/* Error State */}
                {error && !loading && (
                  <div className="flex items-center gap-2 p-4 bg-destructive/10 rounded-lg text-destructive mt-4">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Products from API */}
                {!loading && !error && displayHtml && (
                  <div 
                    className="mt-6 parking-products-grid"
                    dangerouslySetInnerHTML={{ __html: displayHtml }}
                  />
                )}

                {/* Empty State */}
                {!loading && !error && !displayHtml && (
                  <div className="text-center py-12 text-muted-foreground">
                    No parking options available for the selected dates.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Product Info Modal */}
      <ProductInfoModal
        open={infoModalOpen}
        onOpenChange={setInfoModalOpen}
        productInfo={selectedProductInfo}
      />
    </div>
  );
};

export default SelectParking;
