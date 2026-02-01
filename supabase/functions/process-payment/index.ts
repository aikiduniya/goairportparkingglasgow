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
    const {
      booking_last_inserted_id,
      email,
      from,
      webtype,
      booking_type,
      ref_id,
      price,
      payment_id,
    } = body;

    const accessToken = Deno.env.get("BOOKING_ACCESS_TOKEN");
    if (!accessToken) {
      throw new Error("Missing access token");
    }

    // Send email
    const emailUrl = new URL("https://globalparkingtech.co.uk/send_mail_api");
    emailUrl.searchParams.set("booking_last_inserted_id", booking_last_inserted_id || "");
    emailUrl.searchParams.set("email", email || "");
    emailUrl.searchParams.set("from", from || "");
    emailUrl.searchParams.set("access_token", accessToken);
    emailUrl.searchParams.set("webtype", webtype || "Airport");

    console.log("Sending confirmation email...");
    const emailResponse = await fetch(emailUrl.toString());
    console.log("Email sent:", emailResponse.ok);

    // Update booking status
    const statusUrl = new URL("https://globalparkingtech.co.uk/update_booking_status_api");
    statusUrl.searchParams.set("access_token", accessToken);
    statusUrl.searchParams.set("booking_id", booking_last_inserted_id || "");
    statusUrl.searchParams.set("payment_id", payment_id || "abc");
    statusUrl.searchParams.set("booking_type", booking_type || "Online");
    statusUrl.searchParams.set("stripe_ref_id", "");

    console.log("Updating booking status...");
    const statusResponse = await fetch(statusUrl.toString());
    console.log("Status updated:", statusResponse.ok);

    return new Response(JSON.stringify({ paysuccess: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    return new Response(
      JSON.stringify({ paysuccess: false, error: error instanceof Error ? error.message : "Payment processing failed" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
