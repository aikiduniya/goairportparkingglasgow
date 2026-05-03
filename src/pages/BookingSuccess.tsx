import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import { CheckCircle, Printer, Home } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useDomainConfig } from "@/contexts/DomainConfigContext";
import bookingLogo from "@/assets/booking-logo.webp";
import useSEO from "@/hooks/useSEO";

const BookingSuccess = () => {
  useSEO({ title: "Booking Confirmation", noindex: true });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { config } = useDomainConfig();

  // Read params with exact names from old status.php
  const price = searchParams.get("price") || "";
  const ref_id = searchParams.get("ref_id") || searchParams.get("bookingId") || "";
  const arrival_date = searchParams.get("arrival_date") || searchParams.get("entryDate") || "";
  const departure_date = searchParams.get("departure_date") || searchParams.get("exitDate") || "";
  const arrival_time = searchParams.get("arrival_time") || searchParams.get("entryTime") || "";
  const departure_time = searchParams.get("departure_time") || searchParams.get("exitTime") || "";
  const p_name = decodeURIComponent(searchParams.get("p_name") || "");
  const airport = searchParams.get("airport") || config?.airport_code || "GLA";
  const name = searchParams.get("name") || `${searchParams.get("firstName") || ""} ${searchParams.get("surname") || ""}`.trim();
  const car_reg = searchParams.get("car_reg") || "";

  const formatDateDisplay = (dateStr: string, time: string) => {
    if (!dateStr) return "";
    try {
      // Try parsing DD/MM/YYYY format
      const date = parse(dateStr, "dd/MM/yyyy", new Date());
      if (!isNaN(date.getTime())) {
        const formattedTime = time && time.length === 4 ? `${time.slice(0, 2)}:${time.slice(2)}` : time;
        return `${format(date, "dd MMM yyyy")} ${formattedTime || ""}`.trim();
      }
      // Try ISO format
      const isoDate = new Date(dateStr);
      if (!isNaN(isoDate.getTime())) {
        return `${format(isoDate, "dd MMM yyyy")} ${time || ""}`.trim();
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const websiteUrl = config?.domain || "www.goairportparkingglasgow.com";
  const companyName = config?.title || "Go Airport Parking";
  const airportName = config?.airport_name || "Glasgow Airport";

  // Push transaction data to dataLayer for Google Ads conversion tracking
  useEffect(() => {
    if (!ref_id) return;
    const flag = `__tracked_${ref_id}`;
    if ((window as any)[flag]) return;
    (window as any)[flag] = true;

    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      transactionId: ref_id,
      transactionTotal: parseFloat(price) || 0,
    });
  }, [ref_id, price]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Success Content */}
      <section className="pt-24 md:pt-28 pb-12 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            
            {/* Printable Booking Confirmation - matches sample design */}
            <div className="bg-white rounded-lg border-2 border-dashed border-muted p-6 md:p-8 print:border-solid print:p-4" id="printable-booking">
              
              {/* Logo */}
              <div className="mb-6 print:mb-4">
                <img src={bookingLogo} alt={companyName} className="h-10 object-contain" />
              </div>

              {/* Success Icon & Title */}
              <div className="text-center mb-6 print:mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  Booking Confirmed!
                </h1>
                <p className="text-muted-foreground text-sm">
                  Your parking is reserved. A confirmation email has been sent to your inbox.
                  Please check your junk or spam folder if you don't see it.
                </p>
              </div>

              {/* Booking ID */}
              <div className="text-center mb-6 print:mb-4">
                <p className="text-sm font-semibold text-foreground">Booking ID:</p>
                <p className="text-xl font-bold text-primary">{ref_id}</p>
              </div>

              {/* Summary Card */}
              <div className="border border-muted rounded-lg p-4 mb-6 print:mb-4">
                <h2 className="text-lg font-bold text-foreground mb-4">Summary of Your Booking</h2>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold text-foreground">Name:</span>
                    <p className="text-foreground">{name || "-"}</p>
                  </div>

                  <div>
                    <span className="font-semibold text-foreground">Car:</span>
                    <p className="text-foreground">{car_reg || "-"}</p>
                  </div>

                  <div>
                    <span className="font-semibold text-foreground">Dates:</span>
                    <p className="text-foreground">
                      {formatDateDisplay(arrival_date, arrival_time)} - {formatDateDisplay(departure_date, departure_time)}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-foreground">Airport:</span>
                    <p className="text-foreground">{airportName} ({airport})</p>
                  </div>

                  <div>
                    <span className="font-semibold text-foreground">Service:</span>
                    <p className="text-foreground">{p_name || "-"}</p>
                  </div>

                  <div>
                    <span className="font-semibold text-foreground">Price:</span>
                    <p className="text-accent font-bold">{config?.cur || "€"}{price}</p>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="mb-6 print:mb-4">
                <h2 className="text-lg font-bold text-foreground mb-3">Next Steps</h2>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>Bring your booking confirmation on arrival.</li>
                  <li>Check your email for full instructions and directions.</li>
                  <li>Have a great trip!</li>
                </ul>
              </div>

              {/* Footer */}
              <div className="border-t border-muted pt-4 text-center text-sm">
                <p className="text-muted-foreground">Thank you for choosing</p>
                <p className="font-bold text-foreground">{companyName}</p>
              </div>
            </div>

            {/* Action Buttons - Hidden on Print */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 print:hidden">
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="flex-1 h-12"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Booking
              </Button>
              <Button
                onClick={() => navigate("/")}
                className="flex-1 h-12 bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookingSuccess;
