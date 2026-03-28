import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import { CreditCard, Shield, Lock, AlertCircle, Loader2 } from "lucide-react";
import visaLogo from "@/assets/partners/visa.svg";
import mastercardLogo from "@/assets/partners/mastercard.png";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingStepper from "@/components/booking/BookingStepper";
import { Button } from "@/components/ui/button";
import { useDomainConfig } from "@/contexts/DomainConfigContext";

// Preload BookingSuccess chunk so thankyou page loads instantly
import("./BookingSuccess").catch(() => {});

const BOOKING_FEE = 1.95;

const BookingConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { config } = useDomainConfig();
  const paymentContainerRef = useRef<HTMLDivElement>(null);

  // Read all params from query string (exact names from old PHP flow)
  const new_reference = searchParams.get("new_reference") || "";
  const booking_last_inserted_id = searchParams.get("booking_last_inserted_id") || "";
  const price = parseFloat(searchParams.get("price") || "0");
  const p_name = searchParams.get("p_name") || "";
  const Passenger = searchParams.get("Passenger") || "1";
  const airport = searchParams.get("airport") || "DUB";
  const selectedDate = searchParams.get("selectedDate") || "";
  const changedDate = searchParams.get("changedDate") || "";
  const arrivalTime = searchParams.get("arrivalTime") || "1200";
  const departureTime = searchParams.get("departureTime") || "1200";
  const First_Name = searchParams.get("First_Name") || "";
  const Surname = searchParams.get("Surname") || "";
  const Email = searchParams.get("Email") || "";
  const Contact_Number = searchParams.get("Contact_Number") || "";
  const Car_Registration = searchParams.get("Car_Registration") || "";
  const Car_Manufacturer = searchParams.get("Car_Manufacturer") || "";
  const Car_Model = searchParams.get("Car_Model") || "";
  const Car_Colour = searchParams.get("Car_Colour") || "";
  const Departure_Terminal = searchParams.get("Departure_Terminal") || "";
  const Return_Terminal = searchParams.get("Return_Terminal") || "";
  const Departure_Flight_Number = searchParams.get("Departure_Flight_Number") || "";
  const Return_Flight_Number = searchParams.get("Return_Flight_Number") || "";
  const traffic_source = searchParams.get("traffic_source") || "";

  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [worldpayUrl, setWorldpayUrl] = useState<string | null>(null);

  // Check if payment gateway should be shown
  const isPayOnArrival = !config?.secret_key?.trim() && !config?.publisher_key?.trim();
  

  // Calculate prices
  const totalPrice = price + BOOKING_FEE;
  const amount = Math.round(totalPrice * 100); // Worldpay expects amount in cents
  const currency = config?.cur === "£" ? "GBP" : "EUR";

  const formatDateDisplay = (dateStr: string, time: string) => {
    if (!dateStr) return "";
    try {
      // Try parsing DD/MM/YYYY format
      const date = parse(dateStr, "dd/MM/yyyy", new Date());
      if (!isNaN(date.getTime())) {
        const formattedTime = time.length === 4 ? `${time.slice(0, 2)}:${time.slice(2)}` : time;
        return `${format(date, "EEEE, dd MMM yyyy")}, ${formattedTime}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Initialize Worldpay payment session
  useEffect(() => {
    const initPayment = async () => {
      if (!new_reference || isPayOnArrival) {
        setPaymentLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-worldpay-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({
              ref_id: new_reference,
              amount,
              currency,
            }),
          }
        );

        const result = await response.json();

        if (result.error) {
          throw new Error(result.error);
        }

        setWorldpayUrl(result.url);
      } catch (err) {
        console.error("Error creating payment session:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize payment");
      } finally {
        setPaymentLoading(false);
      }
    };

    initPayment();
  }, [new_reference, amount, currency, isPayOnArrival]);

  // Load Worldpay embedded library and initialize iframe
  useEffect(() => {
    if (!worldpayUrl || !paymentContainerRef.current) return;

    let libraryObject: any = null;

    const script = document.createElement("script");
    script.src = "https://payments.worldpay.com/resources/hpp/integrations/embedded/js/hpp-embedded-integration-library.js";
    script.async = true;
    script.onload = () => {
      if ((window as any).WPCL) {
        const customOptions = {
          url: worldpayUrl,
          type: "iframe",
          inject: "immediate",
          target: "custom-html",
          accessibility: true,
          debug: false,
          language: "en",
          resultCallback: async (callbackData: any) => {
            if (callbackData?.order?.status === "success") {
              await handlePaymentSuccess(callbackData);
            } else {
              setError("Payment was not completed");
            }
          },
        };

        // Create a new instance of the library and call setup
        libraryObject = new (window as any).WPCL.Library();
        libraryObject.setup(customOptions);
      }
    };
    document.body.appendChild(script);

    return () => {
      // Clean up the library instance only if the target element still exists
      try {
        if (libraryObject && typeof libraryObject.destroy === "function" && document.getElementById("custom-html")) {
          libraryObject.destroy();
        }
      } catch (e) {
        // Ignore cleanup errors when navigating away
        console.log("Worldpay cleanup skipped");
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [worldpayUrl]);

  const handlePaymentSuccess = async (callbackData?: any) => {
    setLoading(true);
    setError(null);

    try {
      // Call process-payment edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            booking_last_inserted_id,
            email: Email,
            from: `booking@${config?.domain || "goairportparking.ie"}`,
            webtype: config?.webtype || "Airport",
            booking_type: "Online",
            ref_id: new_reference,
            price: totalPrice,
            payment_id: callbackData?.order?.id || "online",
          }),
        }
      );

      const result = await response.json();

      if (result.paysuccess) {
        // Redirect immediately to thank you page
        const successParams = new URLSearchParams({
          price: totalPrice.toFixed(2),
          ref_id: new_reference,
          arrival_date: selectedDate,
          departure_date: changedDate,
          arrival_time: arrivalTime,
          departure_time: departureTime,
          p_name: encodeURIComponent(p_name),
          airport,
          cancel: price.toFixed(2),
          email: Email,
          name: `${First_Name} ${Surname}`,
          car_reg: `${Car_Registration} ${Car_Manufacturer} ${Car_Model} ${Car_Colour}`.trim(),
        });

        navigate(`/thankyou?${successParams.toString()}`, { replace: true });
      } else {
        setError(result.error || "Payment processing failed");
      }
    } catch (err) {
      console.error("Payment processing error:", err);
      setError(err instanceof Error ? err.message : "Payment processing failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePayOnArrival = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            booking_last_inserted_id,
            email: Email,
            from: `booking@${config?.domain || "goairportparking.ie"}`,
            webtype: config?.webtype || "Airport",
            booking_type: "Arrival",
            ref_id: new_reference,
            price: totalPrice,
          }),
        }
      );

      const result = await response.json();

      if (result.paysuccess) {
        // Redirect immediately to thank you page
        const successParams = new URLSearchParams({
          price: totalPrice.toFixed(2),
          ref_id: new_reference,
          arrival_date: selectedDate,
          departure_date: changedDate,
          arrival_time: arrivalTime,
          departure_time: departureTime,
          p_name: encodeURIComponent(p_name),
          airport,
          cancel: price.toFixed(2),
          email: Email,
          name: `${First_Name} ${Surname}`,
          car_reg: `${Car_Registration} ${Car_Manufacturer} ${Car_Model} ${Car_Colour}`.trim(),
        });

        navigate(`/thankyou?${successParams.toString()}`, { replace: true });
      } else {
        setError(result.error || "Payment processing failed");
      }
    } catch (err) {
      console.error("Pay on arrival error:", err);
      setError(err instanceof Error ? err.message : "Failed to process booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 md:pt-24 pb-6 bg-primary">
        <div className="container mx-auto px-4">
          <BookingStepper currentStep={4} />
        </div>
      </section>


      {/* Main Content */}
      <section className="py-6 md:py-8 bg-cream">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Booking Summary */}
            <div className="bg-card rounded-2xl p-4 md:p-6 shadow-lg">
              <h2 className="text-xl font-bold text-foreground mb-6">Booking Summary</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Booking Ref</span>
                  <span className="font-medium text-foreground">{new_reference}</span>

                  <span className="text-muted-foreground">Passenger</span>
                  <span className="font-medium text-foreground">{First_Name} {Surname}</span>

                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium text-foreground">{Email}</span>

                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium text-foreground">{Contact_Number}</span>

                  <span className="text-muted-foreground">Car</span>
                  <span className="font-medium text-foreground">{Car_Registration} {Car_Manufacturer} ({Car_Model})</span>

                  <span className="text-muted-foreground">Departure Flight</span>
                  <span className="font-medium text-foreground">{Departure_Flight_Number || "-"}</span>

                  <span className="text-muted-foreground">Return Flight</span>
                  <span className="font-medium text-foreground">{Return_Flight_Number || "-"}</span>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Booking Fee</span>
                    <span className="font-medium">{config?.cur || "€"}{BOOKING_FEE.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{p_name}</span>
                    <span className="font-medium">{config?.cur || "€"}{price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">{p_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDateDisplay(selectedDate, arrivalTime)} → {formatDateDisplay(changedDate, departureTime)}
                  </p>
                  <p className="text-2xl font-bold text-primary mt-2">{config?.cur || "€"}{totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-card rounded-2xl p-4 md:p-6 shadow-lg">
              <h2 className="text-xl font-bold text-foreground mb-6">Payment Details</h2>

              <div className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Payment Methods</h3>
                  <div className="grid grid-cols-2 gap-2 max-w-[200px]">
                    <div className="border border-border rounded-lg p-2 flex items-center justify-center">
                      <img src={visaLogo} alt="Visa" className="h-6 object-contain" />
                    </div>
                    <div className="border border-border rounded-lg p-2 flex items-center justify-center">
                      <img src={mastercardLogo} alt="Mastercard" className="h-6 object-contain" />
                    </div>
                  </div>
                </div>

                {/* Worldpay Integration Container */}
                <div 
                  id="custom-html" 
                  ref={paymentContainerRef}
                  className="border border-border rounded-lg min-h-[300px] overflow-hidden"
                >
                  {paymentLoading ? (
                    <div className="flex flex-col items-center justify-center h-[300px] gap-3 text-muted-foreground">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <span className="font-medium">Loading secure payment form...</span>
                      <span className="text-xs">Please wait while we connect to Worldpay</span>
                    </div>
                  ) : error && !worldpayUrl ? (
                    <div className="flex flex-col items-center justify-center h-[300px] gap-3">
                      <AlertCircle className="w-12 h-12 text-destructive" />
                      <p className="text-sm text-destructive font-medium">Failed to load payment gateway</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.reload()}
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : null}
                </div>

                {/* Error Message */}
                {error && worldpayUrl && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-destructive text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>All payments are encrypted & 100% secure</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookingConfirm;
