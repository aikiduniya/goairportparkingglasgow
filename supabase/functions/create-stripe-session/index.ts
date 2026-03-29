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
    const { ref_id, amount, currency, return_url } = body;

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const stripePublishableKey = Deno.env.get("STRIPE_PUBLISHABLE_KEY");
    if (!stripeSecretKey) {
      throw new Error("Missing Stripe secret key");
    }

    console.log("Creating Stripe embedded checkout session for:", ref_id, "amount:", amount, "currency:", currency);

    const params = new URLSearchParams();
    params.append("payment_method_types[0]", "card");
    params.append("mode", "payment");
    params.append("ui_mode", "embedded_page");
    params.append("line_items[0][price_data][currency]", currency.toLowerCase());
    params.append("line_items[0][price_data][unit_amount]", String(Math.round(amount)));
    params.append("line_items[0][price_data][product_data][name]", `Parking Booking - ${ref_id}`);
    params.append("line_items[0][quantity]", "1");
    params.append("return_url", return_url);
    params.append("client_reference_id", ref_id);

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Stripe error:", JSON.stringify(data));
      throw new Error(data.error?.message || `Stripe API error: ${response.status}`);
    }

    console.log("Stripe embedded session created:", data.id);

    return new Response(JSON.stringify({ 
      client_secret: data.client_secret,
      publishable_key: stripePublishableKey || "",
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to create payment session" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
