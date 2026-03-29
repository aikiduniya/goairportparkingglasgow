import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import { Shield, AlertCircle, Loader2, CreditCard } from "lucide-react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import visaLogo from "@/assets/partners/visa.svg";
import mastercardLogo from "@/assets/partners/mastercard.png";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingStepper from "@/components/booking/BookingStepper";
import { Button } from "@/components/ui/button";
import { useDomainConfig } from "@/contexts/DomainConfigContext";

import("./BookingSuccess").catch(() => {});

const BOOKING_FEE = 1.95;

// --- Card Payment Form (rendered inside Elements provider) ---
interface CardFormProps {
  clientSecret: string;
  totalPrice: number;
  currency: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (msg: string) => void;
}

const CardForm = ({ clientSecret, totalPrice, currency, onSuccess, onError }: CardFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const { config } = useDomainConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPaying(true);
    onError("");

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onError("Card element not found");
      setPaying(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      onError(error.message || "Payment failed");
      setPaying(false);
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess(paymentIntent.id);
    } else {
      onError("Payment was not completed");
      setPaying(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-border rounded-lg p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#1a1a1a",
                "::placeholder": { color: "#9ca3af" },
                fontFamily: "system-ui, -apple-system, sans-serif",
                lineHeight: "24px",
              },
              invalid: { color: "#ef4444" },
            },
            hidePostalCode: true,
          }}
        />
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-base font-semibold bg-accent hover:bg-accent/90 text-accent-foreground"
        disabled={paying || !stripe}
      >
        {paying ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing payment...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay {config?.cur || "€"}{totalPrice.toFixed(2)}
          </>
        )}
      </Button>
    </form>
  );
};

// --- Main BookingConfirm Component ---
const BookingConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { config, loading: configLoading } = useDomainConfig();

  const new_reference = searchParams.get("new_reference") || "";
  const booking_last_inserted_id = searchParams.get("booking_last_inserted_id") || "";
  const price = parseFloat(searchParams.get("price") || "0");
  const p_name = searchParams.get("p_name") || "";
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
  const Departure_Flight_Number = searchParams.get("Departure_Flight_Number") || "";
  const Return_Flight_Number = searchParams.get("Return_Flight_Number") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(true);

  const isPayOnArrival = config ? (!config.secret_key?.trim() && !config.publisher_key?.trim()) : false;

  const totalPrice = price + BOOKING_FEE;
  const amount = Math.round(totalPrice * 100);
  const currency = config?.cur === "£" ? "GBP" : "EUR";

  const formatDateDisplay = (dateStr: string, time: string) => {
    if (!dateStr) return "";
    try {
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

  // Initialize Stripe PaymentIntent
  useEffect(() => {
    if (!new_reference || isPayOnArrival || configLoading) {
      setPaymentLoading(false);
      return;
    }

    const initStripe = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-stripe-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({ ref_id: new_reference, amount, currency }),
          }
        );

        const result = await response.json();
        if (result.error) throw new Error(result.error);

        if (result.publishable_key) {
          setStripePromise(loadStripe(result.publishable_key));
        }
        setClientSecret(result.client_secret);
      } catch (err) {
        console.error("Error creating PaymentIntent:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize payment");
      } finally {
        setPaymentLoading(false);
      }
    };

    initStripe();
  }, [new_reference, amount, currency, isPayOnArrival, configLoading]);

  const navigateToSuccess = (paymentId?: string) => {
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
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
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
            booking_type: "Online",
            ref_id: new_reference,
            price: totalPrice,
            payment_id: paymentIntentId,
          }),
        }
      );
      const result = await response.json();
      if (result.paysuccess) {
        navigateToSuccess(paymentIntentId);
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
        navigateToSuccess();
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

      <section className="pt-20 md:pt-24 pb-6 bg-primary">
        <div className="container mx-auto px-4">
          <BookingStepper currentStep={4} />
        </div>
      </section>

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
              <h2 className="text-xl font-bold text-foreground mb-6">
                {isPayOnArrival ? "Complete Booking" : "Payment Details"}
              </h2>

              <div className="space-y-6">
                {configLoading ? (
                  <div className="flex items-center justify-center h-[200px] gap-3 text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="font-medium">Loading...</span>
                  </div>
                ) : isPayOnArrival ? (
                  <>
                    <div className="bg-primary/5 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-2">No online payment required</p>
                      <p className="text-lg font-semibold text-foreground">Pay {config?.cur || "€"}{totalPrice.toFixed(2)} on arrival</p>
                    </div>
                    <Button
                      className="w-full h-12 text-base font-semibold bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={handlePayOnArrival}
                      disabled={loading}
                    >
                      {loading ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                      ) : (
                        "Confirm Booking — Pay on Arrival"
                      )}
                    </Button>
                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" /><span>{error}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
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

                    <div className="min-h-[120px]">
                      {paymentLoading ? (
                        <div className="flex flex-col items-center justify-center h-[120px] gap-3 text-muted-foreground">
                          <Loader2 className="w-8 h-8 animate-spin text-primary" />
                          <span className="font-medium">Loading secure payment form...</span>
                        </div>
                      ) : error && !clientSecret ? (
                        <div className="flex flex-col items-center justify-center h-[120px] gap-3">
                          <AlertCircle className="w-12 h-12 text-destructive" />
                          <p className="text-sm text-destructive font-medium">Failed to load payment form</p>
                          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                            Try Again
                          </Button>
                        </div>
                      ) : stripePromise && clientSecret ? (
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                          <CardForm
                            clientSecret={clientSecret}
                            totalPrice={totalPrice}
                            currency={currency}
                            onSuccess={handlePaymentSuccess}
                            onError={(msg) => setError(msg || null)}
                          />
                        </Elements>
                      ) : null}
                    </div>

                    {error && clientSecret && (
                      <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" /><span>{error}</span>
                      </div>
                    )}
                  </>
                )}

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
