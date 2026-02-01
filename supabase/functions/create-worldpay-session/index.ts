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
    const { ref_id, amount, currency } = body;

    const username = Deno.env.get("WORLDPAY_USERNAME");
    const password = Deno.env.get("WORLDPAY_PASSWORD");

    if (!username || !password) {
      throw new Error("Missing Worldpay credentials");
    }

    const credentials = btoa(`${username}:${password}`);

    const payload = {
      transactionReference: ref_id,
      merchant: { entity: "PO4068021821" },
      narrative: { line1: "Online Parking Booking" },
      value: { currency, amount: Math.round(amount) },
    };

    console.log("Creating Worldpay session for:", ref_id);

    const response = await fetch("https://access.worldpay.com/payment_pages", {
      method: "POST",
      headers: {
        "Content-Type": "application/vnd.worldpay.payment_pages-v1.hal+json",
        "Accept": "application/vnd.worldpay.payment_pages-v1.hal+json",
        "Authorization": `Basic ${credentials}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Worldpay error:", errorText);
      throw new Error(`Worldpay API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Worldpay session created:", data.url ? "URL received" : "No URL");

    return new Response(JSON.stringify({ url: data.url }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error creating Worldpay session:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to create payment session" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
