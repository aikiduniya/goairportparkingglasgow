import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import { MapPin, Clock, Users, Car, Plane, AlertCircle, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingStepper from "@/components/booking/BookingStepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDomainConfig } from "@/contexts/DomainConfigContext";
import { supabase } from "@/integrations/supabase/client";

const BookingProfile = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { config } = useDomainConfig();

  // Use exact field names from old PHP flow
  const selectedDate = searchParams.get("selectedDate") || "";
  const changedDate = searchParams.get("changedDate") || "";
  const arrivalTime = searchParams.get("arrivalTime") || "1200";
  const departureTime = searchParams.get("departureTime") || "1200";
  const p_name = searchParams.get("name") || "";
  const price = searchParams.get("price") || "0";
  const p_id = searchParams.get("p_id") || "";
  const operator_id = searchParams.get("operator_id") || "";
  const promo_code = searchParams.get("promo_code") || "";
  const promo_price = searchParams.get("promo_price") || "";
  const traffic_source = searchParams.get("traffic_source") || "";

  // Form state with exact field names
  const [First_Name, setFirst_Name] = useState("");
  const [Surname, setSurname] = useState("");
  const [Email, setEmail] = useState("");
  const [Contact_Number, setContact_Number] = useState("");
  const [Passenger] = useState("1"); // Default value, not shown in UI
  const [Car_Registration, setCar_Registration] = useState("");
  const [Car_Manufacturer, setCar_Manufacturer] = useState("");
  const [Car_Model, setCar_Model] = useState("");
  const [Car_Colour, setCar_Colour] = useState("");
  const [Departure_Terminal, setDeparture_Terminal] = useState("");
  const [Return_Terminal, setReturn_Terminal] = useState("");
  const [Departure_Flight_Number, setDeparture_Flight_Number] = useState("");
  const [Return_Flight_Number, setReturn_Flight_Number] = useState("");

  const [new_reference, setNewReference] = useState("");
  const [countdown, setCountdown] = useState(560);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  // Generate reference on mount
  useEffect(() => {
    const generateReference = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-random-reference?airport_code=${config?.airport_code || "DUB"}`,
          {
            headers: {
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
          },
        );
        const data = await response.json();
        setNewReference(data.new_reference || `GO-DUB-${Date.now().toString(36).toUpperCase()}`);
      } catch (err) {
        console.error("Error generating reference:", err);
        setNewReference(`GO-DUB-${Date.now().toString(36).toUpperCase()}`);
      }
    };

    generateReference();
  }, [config]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      // Try parsing DD/MM/YYYY format
      const date = parse(dateStr, "dd/MM/yyyy", new Date());
      if (!isNaN(date.getTime())) {
        return format(date, "EEEE, dd MMM yyyy");
      }
      // Fallback to ISO format
      const isoDate = new Date(dateStr);
      return format(isoDate, "EEEE, dd MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  const formatTimeDisplay = (time: string) => {
    if (!time) return "";
    // Convert HHMM to HH:MM
    if (time.length === 4 && !time.includes(":")) {
      return `${time.slice(0, 2)}:${time.slice(2)}`;
    }
    return time;
  };

  // Email validation helper
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleBookNow = async () => {
    const errors: Record<string, boolean> = {};

    // Validate personal details
    if (!First_Name) errors.First_Name = true;
    if (!Surname) errors.Surname = true;
    if (!Email || !isValidEmail(Email)) errors.Email = true;
    if (!Contact_Number) errors.Contact_Number = true;

    // Validate car details
    if (!Car_Registration) errors.Car_Registration = true;
    if (!Car_Manufacturer) errors.Car_Manufacturer = true;
    if (!Car_Model) errors.Car_Model = true;
    if (!Car_Colour) errors.Car_Colour = true;

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Check which section has errors
      const personalErrors = ["First_Name", "Surname", "Email", "Contact_Number"].some((f) => errors[f]);
      const carErrors = ["Car_Registration", "Car_Manufacturer", "Car_Model", "Car_Colour"].some((f) => errors[f]);

      if (personalErrors && carErrors) {
        setError("Please fill in all required personal and car details");
      } else if (personalErrors) {
        if (errors.Email && Email && !isValidEmail(Email)) {
          setError("Please enter a valid email address");
        } else {
          setError("Please fill in all required personal details");
        }
      } else {
        setError("Please fill in all required car details");
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call create-booking edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          p_id,
          Car_Registration,
          Car_Manufacturer,
          Car_Model,
          Car_Colour,
          airport: config?.airport_code || "DUB",
          price,
          new_reference,
          Departure_Terminal,
          Return_Terminal,
          First_Name,
          Surname,
          Email,
          Contact_Number,
          Departure_Flight_Number,
          Return_Flight_Number,
          selectedDate,
          changedDate,
          arrivalTime,
          departureTime,
          operator_id,
          promoCode: promo_code,
          promo_price,
          Passenger,
          website: config?.domain || "",
          cur: config?.cur || "€",
          webtype: config?.webtype || "Airport",
          traffic_source,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Navigate to confirm page with all required params
        const confirmParams = new URLSearchParams({
          new_reference: result.ref_id,
          booking_last_inserted_id: result.booking_last_inserted_id,
          price: result.original_price.toString(),
          p_name,
          Passenger,
          airport: config?.airport_code || "DUB",
          selectedDate,
          changedDate,
          arrivalTime,
          departureTime,
          First_Name,
          Surname,
          Email,
          Contact_Number,
          Car_Registration,
          Car_Manufacturer,
          Car_Model,
          Car_Colour,
          Departure_Terminal,
          Return_Terminal,
          Departure_Flight_Number,
          Return_Flight_Number,
          traffic_source,
        });

        navigate(`/booking/confirm?${confirmParams.toString()}`);
      } else {
        setError(result.error || "Failed to create booking");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const displayPrice = parseFloat(price) || 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 md:pt-24 pb-6 bg-primary">
        <div className="container mx-auto px-4">
          <BookingStepper currentStep={3} />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 md:py-8 bg-cream">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Side - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Your Details */}
              <div className="bg-card rounded-2xl p-4 md:p-6 shadow-lg">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Your Details
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="First_Name">First Name *</Label>
                    <Input
                      id="First_Name"
                      placeholder="John"
                      value={First_Name}
                      onChange={(e) => {
                        setFirst_Name(e.target.value);
                        if (fieldErrors.First_Name) setFieldErrors((prev) => ({ ...prev, First_Name: false }));
                      }}
                      className={`mt-1 ${fieldErrors.First_Name ? "border-destructive ring-1 ring-destructive" : ""}`}
                      required
                    />
                    {fieldErrors.First_Name && <p className="text-xs text-destructive mt-1">First name is required</p>}
                  </div>
                  <div>
                    <Label htmlFor="Surname">Surname *</Label>
                    <Input
                      id="Surname"
                      placeholder="Doe"
                      value={Surname}
                      onChange={(e) => {
                        setSurname(e.target.value);
                        if (fieldErrors.Surname) setFieldErrors((prev) => ({ ...prev, Surname: false }));
                      }}
                      className={`mt-1 ${fieldErrors.Surname ? "border-destructive ring-1 ring-destructive" : ""}`}
                      required
                    />
                    {fieldErrors.Surname && <p className="text-xs text-destructive mt-1">Surname is required</p>}
                  </div>
                  <div>
                    <Label htmlFor="Email">Email *</Label>
                    <Input
                      id="Email"
                      type="email"
                      placeholder="john@example.com"
                      value={Email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.Email) setFieldErrors((prev) => ({ ...prev, Email: false }));
                      }}
                      className={`mt-1 ${fieldErrors.Email ? "border-destructive ring-1 ring-destructive" : ""}`}
                      required
                    />
                    {fieldErrors.Email && (
                      <p className="text-xs text-destructive mt-1">Valid email is required (e.g., john@example.com)</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="Contact_Number">Contact Number *</Label>
                    <Input
                      id="Contact_Number"
                      placeholder="441234567"
                      value={Contact_Number}
                      onChange={(e) => {
                        setContact_Number(e.target.value);
                        if (fieldErrors.Contact_Number) setFieldErrors((prev) => ({ ...prev, Contact_Number: false }));
                      }}
                      className={`mt-1 ${fieldErrors.Contact_Number ? "border-destructive ring-1 ring-destructive" : ""}`}
                      required
                    />
                    {fieldErrors.Contact_Number && (
                      <p className="text-xs text-destructive mt-1">Contact number is required</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Car Details */}
              <div className="bg-card rounded-2xl p-4 md:p-6 shadow-lg">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Car className="w-5 h-5 text-primary" />
                  Car Details
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="Car_Registration">Car Registration *</Label>
                    <Input
                      id="Car_Registration"
                      placeholder="ABC1234"
                      value={Car_Registration}
                      onChange={(e) => {
                        setCar_Registration(e.target.value);
                        if (fieldErrors.Car_Registration)
                          setFieldErrors((prev) => ({ ...prev, Car_Registration: false }));
                      }}
                      className={`mt-1 ${fieldErrors.Car_Registration ? "border-destructive ring-1 ring-destructive" : ""}`}
                      required
                    />
                    {fieldErrors.Car_Registration && (
                      <p className="text-xs text-destructive mt-1">Car registration is required</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="Car_Manufacturer">Car Manufacturer *</Label>
                    <Input
                      id="Car_Manufacturer"
                      placeholder="Toyota"
                      value={Car_Manufacturer}
                      onChange={(e) => {
                        setCar_Manufacturer(e.target.value);
                        if (fieldErrors.Car_Manufacturer)
                          setFieldErrors((prev) => ({ ...prev, Car_Manufacturer: false }));
                      }}
                      className={`mt-1 ${fieldErrors.Car_Manufacturer ? "border-destructive ring-1 ring-destructive" : ""}`}
                      required
                    />
                    {fieldErrors.Car_Manufacturer && (
                      <p className="text-xs text-destructive mt-1">Car manufacturer is required</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="Car_Model">Car Model *</Label>
                    <Input
                      id="Car_Model"
                      placeholder="Corolla"
                      value={Car_Model}
                      onChange={(e) => {
                        setCar_Model(e.target.value);
                        if (fieldErrors.Car_Model) setFieldErrors((prev) => ({ ...prev, Car_Model: false }));
                      }}
                      className={`mt-1 ${fieldErrors.Car_Model ? "border-destructive ring-1 ring-destructive" : ""}`}
                      required
                    />
                    {fieldErrors.Car_Model && <p className="text-xs text-destructive mt-1">Car model is required</p>}
                  </div>
                  <div>
                    <Label htmlFor="Car_Colour">Car Colour *</Label>
                    <Input
                      id="Car_Colour"
                      placeholder="Blue"
                      value={Car_Colour}
                      onChange={(e) => {
                        setCar_Colour(e.target.value);
                        if (fieldErrors.Car_Colour) setFieldErrors((prev) => ({ ...prev, Car_Colour: false }));
                      }}
                      className={`mt-1 ${fieldErrors.Car_Colour ? "border-destructive ring-1 ring-destructive" : ""}`}
                      required
                    />
                    {fieldErrors.Car_Colour && <p className="text-xs text-destructive mt-1">Car colour is required</p>}
                  </div>
                </div>
              </div>

              {/* Flight Details */}
              <div className="bg-card rounded-2xl p-4 md:p-6 shadow-lg">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Plane className="w-5 h-5 text-primary" />
                  Flight Details
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="Departure_Terminal">Departure Terminal</Label>
                    <Select value={Departure_Terminal} onValueChange={setDeparture_Terminal}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select terminal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Terminal 1">Terminal 1</SelectItem>
                        <SelectItem value="Terminal 2">Terminal 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="Return_Terminal">Return Terminal</Label>
                    <Select value={Return_Terminal} onValueChange={setReturn_Terminal}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select terminal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Terminal 1">Terminal 1</SelectItem>
                        <SelectItem value="Terminal 2">Terminal 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="Departure_Flight_Number">Departure Flight Number</Label>
                    <Input
                      id="Departure_Flight_Number"
                      placeholder="BA123"
                      value={Departure_Flight_Number}
                      onChange={(e) => setDeparture_Flight_Number(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="Return_Flight_Number">Return Flight Number</Label>
                    <Input
                      id="Return_Flight_Number"
                      placeholder="BA456"
                      value={Return_Flight_Number}
                      onChange={(e) => setReturn_Flight_Number(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-4 md:p-6 shadow-lg sticky top-24">
                <h2 className="text-xl font-bold text-foreground mb-4">Booking Summary</h2>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{config?.airport_code || "DUB"}</p>
                  </div>
                </div>

                <h3 className="font-semibold text-foreground mb-2">{p_name || "Selected Parking"}</h3>

                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      From: {formatDateDisplay(selectedDate)} {formatTimeDisplay(arrivalTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      To: {formatDateDisplay(changedDate)} {formatTimeDisplay(departureTime)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 pl-4 pr-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground font-medium">Total Price</span>
                    <span className="text-2xl font-bold text-primary">
                      {config?.cur || "€"}
                      {displayPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="bg-accent/10 rounded-lg p-3 mb-4 space-y-1">
                  <p className="text-sm text-accent-foreground">
                    ⏱️ Price guaranteed for <span className="font-bold">{formatCountdown(countdown)}</span> minutes
                  </p>
                  <p className="text-xs text-muted-foreground">12 people booked this service today</p>
                  <p className="text-xs text-destructive font-medium">Only 3 spaces left at this price!</p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 rounded-lg text-destructive text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <p className="text-xs text-muted-foreground mb-4">
                  By reserving parking you agree to our{" "}
                  <a href="#" className="text-primary hover:underline">
                    terms and conditions
                  </a>
                  .
                </p>

                <Button
                  onClick={handleBookNow}
                  disabled={loading}
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Book Now"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookingProfile;
