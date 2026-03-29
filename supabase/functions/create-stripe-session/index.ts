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

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const stripePublishableKey = Deno.env.get("STRIPE_PUBLISHABLE_KEY");
    if (!stripeSecretKey) {
      throw new Error("Missing Stripe secret key");
    }

    console.log("Creating Stripe PaymentIntent for:", ref_id, "amount:", amount, "currency:", currency);

    const params = new URLSearchParams();
    params.append("amount", String(Math.round(amount)));
    params.append("currency", currency.toLowerCase());
    params.append("payment_method_types[0]", "card");
    params.append("metadata[ref_id]", ref_id);
    params.append("description", `Parking Booking - ${ref_id}`);

    const response = await fetch("https://api.stripe.com/v1/payment_intents", {
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

    console.log("PaymentIntent created:", data.id);

    return new Response(JSON.stringify({
      client_secret: data.client_secret,
      publishable_key: stripePublishableKey || "",
      payment_intent_id: data.id,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to create payment session" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
