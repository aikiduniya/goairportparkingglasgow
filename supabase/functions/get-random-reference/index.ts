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
    const airportCode = url.searchParams.get("airport_code") || "DUB";

    const response = await fetch("https://globalparkingtech.co.uk/api_get_random_strings");
    const data = await response.json();

    const reference = data.reference || data.random_string || Math.random().toString(36).substring(2, 10).toUpperCase();
    const newReference = `GO-${airportCode}-${reference}`;

    return new Response(JSON.stringify({ new_reference: newReference }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error generating reference:", error);
    // Generate fallback reference
    const fallbackRef = `GO-DUB-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    return new Response(JSON.stringify({ new_reference: fallbackRef }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
