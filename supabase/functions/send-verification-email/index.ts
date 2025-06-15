
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    const { email, firstName, verificationUrl }: VerificationEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "PausePal <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to PausePal! Please verify your email 🎉",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to PausePal</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #EBF4FF 0%, #E0E7FF 50%, #F3E8FF 100%); min-height: 100vh;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="display: inline-flex; align-items: center; gap: 12px; background: white; padding: 16px 24px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                <span style="font-size: 32px;">⏸️</span>
                <span style="font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #6366F1, #8B5CF6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">PausePal</span>
              </div>
            </div>

            <!-- Main Content -->
            <div style="background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); border-radius: 24px; padding: 40px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); border: 1px solid rgba(255,255,255,0.2);">
              <h1 style="font-size: 28px; font-weight: bold; color: #1F2937; margin: 0 0 16px 0; text-align: center;">Welcome to PausePal! 🎉</h1>
              
              <p style="font-size: 18px; color: #6B7280; margin: 0 0 24px 0; text-align: center;">
                Hi ${firstName}! 👋
              </p>
              
              <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 24px 0;">
                We're excited to have you join our community of mindful shoppers! PausePal is here to help you make more intentional purchasing decisions and build better spending habits. ⏸️✨
              </p>
              
              <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 32px 0;">
                To get started with your mindful spending journey, please verify your email address by clicking the button below:
              </p>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366F1, #8B5CF6); color: white; text-decoration: none; font-weight: 600; font-size: 16px; padding: 16px 32px; border-radius: 12px; box-shadow: 0 4px 16px rgba(99,102,241,0.3); transition: all 0.3s ease;">
                  Verify Email Address 🚀
                </a>
              </div>
              
              <p style="font-size: 14px; color: #6B7280; line-height: 1.5; margin: 24px 0 0 0; text-align: center;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #6366F1; word-break: break-all;">${verificationUrl}</a>
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 32px; padding: 0 20px;">
              <p style="font-size: 14px; color: #9CA3AF; margin: 0;">
                Made with ❤️ for mindful shoppers<br>
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
