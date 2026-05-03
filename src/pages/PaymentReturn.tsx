import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import useSEO from "@/hooks/useSEO";

const PaymentReturn = () => {
  useSEO({ title: "Processing Payment", noindex: true });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const processPayment = async () => {
      try {
        const booking_last_inserted_id = searchParams.get("booking_last_inserted_id") || "";
        const email = searchParams.get("email") || "";
        const domain = searchParams.get("domain") || "goairportparking.ie";
        const webtype = searchParams.get("webtype") || "Airport";
        const ref_id = searchParams.get("ref_id") || "";
        const price = searchParams.get("price") || "0";

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
              email,
              from: `booking@${domain}`,
              webtype,
              booking_type: "Online",
              ref_id,
              price: parseFloat(price),
              payment_id: "stripe",
            }),
          }
        );

        const result = await response.json();

        if (result.paysuccess) {
          const successParams = new URLSearchParams({
            price,
            ref_id,
            arrival_date: searchParams.get("arrival_date") || "",
            departure_date: searchParams.get("departure_date") || "",
            arrival_time: searchParams.get("arrival_time") || "",
            departure_time: searchParams.get("departure_time") || "",
            p_name: encodeURIComponent(searchParams.get("p_name") || ""),
            airport: searchParams.get("airport") || "",
            cancel: searchParams.get("cancel") || "0",
            email,
            name: searchParams.get("name") || "",
            car_reg: searchParams.get("car_reg") || "",
          });

          navigate(`/thankyou?${successParams.toString()}`, { replace: true });
        } else {
          setError(result.error || "Payment processing failed");
          setProcessing(false);
        }
      } catch (err) {
        console.error("Payment return error:", err);
        setError(err instanceof Error ? err.message : "Payment processing failed");
        setProcessing(false);
      }
    };

    processPayment();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="pt-32 pb-16 bg-cream">
        <div className="container mx-auto px-4 text-center">
          {processing ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <h2 className="text-xl font-bold text-foreground">Processing your payment...</h2>
              <p className="text-muted-foreground">Please wait while we confirm your booking.</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
              <AlertCircle className="w-12 h-12 text-destructive" />
              <h2 className="text-xl font-bold text-foreground">Payment Error</h2>
              <p className="text-destructive">{error}</p>
              <Button onClick={() => navigate("/")} variant="outline">
                Return to Home
              </Button>
            </div>
          ) : null}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PaymentReturn;
