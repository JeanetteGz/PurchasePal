
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationEmailRequest {
  email: string;
  firstName: string;
  verificationUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }

    const resend = new Resend(resendApiKey);
    
    const { email, firstName, verificationUrl }: VerificationEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "PausePal <welcome@resend.dev>",
      to: [email],
      subject: "Welcome to PausePal! Verify your email ⏸️",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to PausePal - Verify Your Email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #BFDBFE 100%); min-height: 100vh;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="display: inline-flex; align-items: center; gap: 12px; background: white; padding: 16px 24px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                <span style="font-size: 32px;">⏸️</span>
                <span style="font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #3B82F6, #1D4ED8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">PausePal</span>
              </div>
            </div>

            <!-- Main Content -->
            <div style="background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); border-radius: 24px; padding: 40px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); border: 1px solid rgba(255,255,255,0.2);">
              <h1 style="font-size: 28px; font-weight: bold; color: #1E40AF; margin: 0 0 16px 0; text-align: center;">Welcome to PausePal! 🎉</h1>
              
              <p style="font-size: 18px; color: #6B7280; margin: 0 0 24px 0; text-align: center;">
                Hi ${firstName}, 👋
              </p>
              
              <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 24px 0;">
                Welcome to PausePal - your companion for mindful spending! 💰✨ We're excited to help you develop healthier spending habits and take control of your financial wellness.
              </p>
              
              <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 24px 0;">
                To get started, please verify your email address by clicking the button below:
              </p>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #3B82F6, #1D4ED8); color: white; text-decoration: none; font-weight: 600; font-size: 16px; padding: 16px 32px; border-radius: 12px; box-shadow: 0 4px 16px rgba(59,130,246,0.3); transition: all 0.3s ease;">
                  Verify Email Address ✅
                </a>
              </div>
              
              <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <p style="font-size: 16px; color: #1E40AF; font-weight: 600; margin: 0 0 12px 0;">
                  🚀 What's next?
                </p>
                <p style="font-size: 14px; color: #1E3A8A; margin: 0; line-height: 1.5;">
                  Once verified, you'll be able to:
                  <br>• Track your purchases and spending patterns 📊
                  <br>• Identify your spending triggers 🎯
                  <br>• Set mindful spending goals 🎯
                  <br>• Build healthier financial habits 💪
                </p>
              </div>
              
              <p style="font-size: 14px; color: #6B7280; line-height: 1.5; margin: 24px 0 0 0; text-align: center;">
                If you didn't create an account with PausePal, you can safely ignore this email. 🛡️
              </p>
              
              <p style="font-size: 12px; color: #9CA3AF; line-height: 1.5; margin: 16px 0 0 0; text-align: center;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #3B82F6; word-break: break-all;">${verificationUrl}</a>
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 32px; padding: 0 20px;">
              <p style="font-size: 14px; color: #9CA3AF; margin: 0;">
                Ready to pause before you purchase? Let's build mindful spending habits together! 🌟<br>
                PausePal - Your companion for intentional spending
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Verification email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-verification-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
