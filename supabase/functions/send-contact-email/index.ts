import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ContactFormData {
  enquiryType: string;
  title: string;
  firstName: string;
  surname: string;
  email: string;
  contactNumber: string;
  message: string;
  customerServicePhone?: string;
}

// Simple SMTP email sender using raw sockets
async function sendEmail(config: {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const { host, port, user, pass, from, to, subject, html } = config;
  
  // Connect to SMTP server
  const conn = await Deno.connectTls({
    hostname: host,
    port: port,
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const readResponse = async (): Promise<string> => {
    const buffer = new Uint8Array(1024);
    const n = await conn.read(buffer);
    if (n === null) return "";
    return decoder.decode(buffer.subarray(0, n));
  };

  const sendCommand = async (cmd: string): Promise<string> => {
    await conn.write(encoder.encode(cmd + "\r\n"));
    return await readResponse();
  };

  try {
    // Read greeting
    await readResponse();

    // EHLO
    await sendCommand(`EHLO ${host}`);

    // AUTH LOGIN
    await sendCommand("AUTH LOGIN");
    await sendCommand(btoa(user));
    await sendCommand(btoa(pass));

    // MAIL FROM
    await sendCommand(`MAIL FROM:<${from}>`);

    // RCPT TO
    await sendCommand(`RCPT TO:<${to}>`);

    // DATA
    await sendCommand("DATA");

    // Email content
    const boundary = "----=_Part_" + Math.random().toString(36).substr(2, 9);
    const emailContent = [
      `From: ${from}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      "Content-Type: text/html; charset=utf-8",
      "Content-Transfer-Encoding: quoted-printable",
      "",
      html,
      "",
      `--${boundary}--`,
      ".",
    ].join("\r\n");

    await sendCommand(emailContent);

    // QUIT
    await sendCommand("QUIT");
  } finally {
    conn.close();
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();

    // Validate required fields
    if (!formData.firstName || !formData.email || !formData.message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SMTP_HOST = Deno.env.get("SMTP_HOST");
    const SMTP_PORT = Deno.env.get("SMTP_PORT");
    const SMTP_USER = Deno.env.get("SMTP_USER");
    const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD");
    const SMTP_FROM_EMAIL = Deno.env.get("SMTP_FROM_EMAIL");
    const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL");

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM_EMAIL || !ADMIN_EMAIL) {
      console.error("Missing SMTP configuration");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const fullName = `${formData.title ? formData.title.toUpperCase() + ' ' : ''}${formData.firstName} ${formData.surname}`.trim();
    const enquiryLabel = formData.enquiryType ? formData.enquiryType.charAt(0).toUpperCase() + formData.enquiryType.slice(1) : 'General';

    // Email to Admin
    const adminEmailContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1a365d; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #1a365d; }
    .value { margin-top: 5px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Form Submission</h1>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Enquiry Type:</div>
        <div class="value">${enquiryLabel}</div>
      </div>
      <div class="field">
        <div class="label">Name:</div>
        <div class="value">${fullName}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value">${formData.email}</div>
      </div>
      <div class="field">
        <div class="label">Contact Number:</div>
        <div class="value">${formData.contactNumber || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">Message:</div>
        <div class="value">${formData.message}</div>
      </div>
    </div>
    <div class="footer">
      <p>This email was sent from the website contact form.</p>
    </div>
  </div>
</body>
</html>`;

    // Send email to Admin
    await sendEmail({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT),
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
      from: SMTP_FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Contact Enquiry: ${enquiryLabel} - ${fullName}`,
      html: adminEmailContent,
    });

    console.log("Admin email sent successfully");

    // Confirmation Email to User
    const userEmailContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1a365d; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .message-box { background: white; padding: 15px; border-left: 4px solid #1a365d; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You for Contacting Us</h1>
    </div>
    <div class="content">
      <p>Dear ${formData.firstName},</p>
      <p>Thank you for reaching out to us. We have received your enquiry and our team will get back to you as soon as possible.</p>
      
      <h3>Your Enquiry Details:</h3>
      <div class="message-box">
        <p><strong>Enquiry Type:</strong> ${enquiryLabel}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message}</p>
      </div>
      
      <p>If you have any urgent queries, please don't hesitate to call us at <strong>${formData.customerServicePhone || '+44 203 9292 689'}</strong>.</p>
      <p>Best regards,<br>Customer Support Team</p>
    </div>
    <div class="footer">
      <p>This is an automated confirmation email. Please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>`;

    // Send confirmation email to User
    await sendEmail({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT),
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
      from: SMTP_FROM_EMAIL,
      to: formData.email,
      subject: "Thank You for Contacting Us - We've Received Your Enquiry",
      html: userEmailContent,
    });

    console.log("User confirmation email sent successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Emails sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error sending email:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
