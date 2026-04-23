import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const accessToken = Deno.env.get("BOOKING_ACCESS_TOKEN");
    
    if (!accessToken) {
      throw new Error("Missing access token");
    }

    // Convert times to HH:MM format
    const formatTime = (time: string): string => {
      if (!time) return "12:00";
      // If already in HH:MM format
      if (time.includes(":")) return time;
      // If in HHMM format, convert
      if (time.length === 4) {
        return `${time.slice(0, 2)}:${time.slice(2)}`;
      }
      return time;
    };

    // Calculate price with booking fee
    const basePrice = parseFloat(body.price) || 0;
    const priceForApi = (basePrice + 1.95).toFixed(2);

    // Generate unix timestamp for rdate
    const rdate = Math.floor(Date.now() / 1000);

    const apiUrl = new URL("https://globalparkingtech.co.uk/api_create_booking3");
    apiUrl.searchParams.set("p_id", body.p_id || "");
    apiUrl.searchParams.set("Car_Registration", body.Car_Registration || "");
    apiUrl.searchParams.set("Car_Manufacturer", body.Car_Manufacturer || "");
    apiUrl.searchParams.set("Car_Model", body.Car_Model || "");
    apiUrl.searchParams.set("Car_Colour", body.Car_Colour || "");
    apiUrl.searchParams.set("airport", body.airport || "");
    apiUrl.searchParams.set("price", priceForApi);
    apiUrl.searchParams.set("new_reference", body.new_reference || "");
    apiUrl.searchParams.set("Departure_Terminal", body.Departure_Terminal || "");
    apiUrl.searchParams.set("Return_Terminal", body.Return_Terminal || "");
    apiUrl.searchParams.set("First_Name", body.First_Name || "");
    apiUrl.searchParams.set("Surname", body.Surname || "");
    apiUrl.searchParams.set("Email", body.Email || "");
    apiUrl.searchParams.set("Contact_Number", body.Contact_Number || "");
    apiUrl.searchParams.set("Departure_Flight_Number", body.Departure_Flight_Number || "");
    apiUrl.searchParams.set("Return_Flight_Number", body.Return_Flight_Number || "");
    apiUrl.searchParams.set("rdate", rdate.toString());
    apiUrl.searchParams.set("selectedDate", body.selectedDate || "");
    apiUrl.searchParams.set("changedDate", body.changedDate || "");
    apiUrl.searchParams.set("arrivalTime", formatTime(body.arrivalTime));
    apiUrl.searchParams.set("departureTime", formatTime(body.departureTime));
    apiUrl.searchParams.set("operator_id", body.operator_id || "");
    apiUrl.searchParams.set("promoCode", body.promoCode || "");
    apiUrl.searchParams.set("promo_price", body.promo_price || "");
    apiUrl.searchParams.set("passenger", body.Passenger || "1");
    apiUrl.searchParams.set("website", body.website || "");
    apiUrl.searchParams.set("access_token", accessToken);
    apiUrl.searchParams.set("cur", body.cur || "€");
    apiUrl.searchParams.set("webtype", body.webtype || "Airport");

    // --- Booking attribution mapping ---
    // organic_search => "SEO"; referral => "Backlink"; paid/direct/unknown => ""
    const channel = body?.attribution?.traffic_channel || "";
    let trafficSourceForDb = "";
    if (channel === "organic_search") trafficSourceForDb = "SEO";
    else if (channel === "referral") trafficSourceForDb = "Backlink";
    // explicit override from frontend takes precedence only if attribution missing
    if (!channel && body.traffic_source) trafficSourceForDb = body.traffic_source;

    apiUrl.searchParams.set("traffic_source", trafficSourceForDb);
    console.log("[create-booking] attribution channel:", channel, "=> DB value:", trafficSourceForDb);

    console.log("Creating booking at:", apiUrl.toString().replace(accessToken, "***"));

    const response = await fetch(apiUrl.toString());
    const responseText = await response.text();
    
    console.log("Booking API raw response:", responseText);

    // Try to parse JSON - the API might return multiple JSON objects or invalid JSON
    let data;
    try {
      // Try to extract the first valid JSON object from the response
      const jsonMatch = responseText.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON object found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse API response:", parseError);
      // Check if response contains success indicators
      if (responseText.includes('"code":1') || responseText.includes('"code":"1"')) {
        // Try to extract ref_id and booking_last_inserted_id from the raw text
        const refIdMatch = responseText.match(/"ref_id"\s*:\s*"?([^",}]+)"?/);
        const bookingIdMatch = responseText.match(/"booking_last_inserted_id"\s*:\s*"?([^",}]+)"?/);
        data = {
          code: 1,
          ref_id: refIdMatch ? refIdMatch[1] : "",
          booking_last_inserted_id: bookingIdMatch ? bookingIdMatch[1] : ""
        };
      } else {
        throw new Error(`Invalid API response: ${responseText.substring(0, 500)}`);
      }
    }

    console.log("Booking API parsed data:", data);

    if (data.code === 1 || data.code === "1") {
      return new Response(JSON.stringify({
        success: true,
        ref_id: data.ref_id,
        booking_last_inserted_id: data.booking_last_inserted_id,
        original_price: basePrice,
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: data.message || "Booking creation failed",
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  } catch (error) {
    console.error("Error creating booking:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Failed to create booking" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
