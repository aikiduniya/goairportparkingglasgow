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
    const url = new URL(req.url);
    const airport = url.searchParams.get("airport") || "";
    const selectedDate = url.searchParams.get("selectedDate") || "";
    const changedDate = url.searchParams.get("changedDate") || "";
    const arrivalTime = url.searchParams.get("arrivalTime") || "";
    const departureTime = url.searchParams.get("departureTime") || "";
    const code = url.searchParams.get("code") || "";
    const website = url.searchParams.get("website") || "";
    const cur = url.searchParams.get("cur") || "€";
    const webtype = url.searchParams.get("webtype") || "Airport";
    const traffic_source = url.searchParams.get("traffic_source") || "";

    const accessToken = Deno.env.get("BOOKING_ACCESS_TOKEN");
    if (!accessToken) {
      throw new Error("Missing access token");
    }

    const apiUrl = new URL("https://globalparkingtech.co.uk/api_create_goAirport_booking");
    apiUrl.searchParams.set("airport", airport);
    apiUrl.searchParams.set("selectedDate", selectedDate);
    apiUrl.searchParams.set("changedDate", changedDate);
    apiUrl.searchParams.set("arrivalTime", arrivalTime);
    apiUrl.searchParams.set("departureTime", departureTime);
    apiUrl.searchParams.set("code", code);
    apiUrl.searchParams.set("website", website);
    apiUrl.searchParams.set("access_token", accessToken);
    apiUrl.searchParams.set("cur", cur);
    apiUrl.searchParams.set("webtype", webtype);
    apiUrl.searchParams.set("traffic_source", traffic_source);

    console.log("Fetching parking products from:", apiUrl.toString().replace(accessToken, "***"));

    const response = await fetch(apiUrl.toString());
    const html = await response.text();

    return new Response(JSON.stringify({ html }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error fetching parking products:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to fetch products" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
