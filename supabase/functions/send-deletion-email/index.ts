
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DeletionEmailRequest {
  email: string;
  firstName: string;
  deletionUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, deletionUrl }: DeletionEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "PausePal <security@resend.dev>",
      to: [email],
      subject: "Confirm Account Deletion - PausePal 🗑️",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirm Account Deletion - PausePal</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 50%, #FECACA 100%); min-height: 100vh;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="display: inline-flex; align-items: center; gap: 12px; background: white; padding: 16px 24px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                <span style="font-size: 32px;">⏸️</span>
                <span style="font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #EF4444, #DC2626); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">PausePal</span>
              </div>
            </div>

            <!-- Main Content -->
            <div style="background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); border-radius: 24px; padding: 40px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); border: 1px solid rgba(255,255,255,0.2);">
              <h1 style="font-size: 28px; font-weight: bold; color: #DC2626; margin: 0 0 16px 0; text-align: center;">Account Deletion Request 🗑️</h1>
              
              <p style="font-size: 18px; color: #6B7280; margin: 0 0 24px 0; text-align: center;">
                Hi ${firstName}, 👋
              </p>
              
              <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 24px 0;">
                We received a request to permanently delete your PausePal account. We're sad to see you go! 😢
              </p>
              
              <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <p style="font-size: 16px; color: #DC2626; font-weight: 600; margin: 0 0 12px 0;">
                  ⚠️ Important: This action cannot be undone
                </p>
                <p style="font-size: 14px; color: #7F1D1D; margin: 0; line-height: 1.5;">
                  Deleting your account will permanently remove:
                  <br>• All your purchase data and insights 📊
                  <br>• Your profile information 👤
                  <br>• Your spending habits and triggers 🎯
                  <br>• All account settings and preferences ⚙️
                </p>
              </div>
              
              <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 24px 0;">
                If you're sure you want to proceed, click the button below to confirm the deletion:
              </p>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${deletionUrl}" style="display: inline-block; background: linear-gradient(135deg, #DC2626, #B91C1C); color: white; text-decoration: none; font-weight: 600; font-size: 16px; padding: 16px 32px; border-radius: 12px; box-shadow: 0 4px 16px rgba(220,38,38,0.3); transition: all 0.3s ease;">
                  Confirm Account Deletion 🗑️
                </a>
              </div>
              
              <p style="font-size: 14px; color: #6B7280; line-height: 1.5; margin: 24px 0 0 0; text-align: center;">
                If you didn't request this deletion or want to keep your account, simply ignore this email. Your account will remain active. 🛡️
              </p>
              
              <p style="font-size: 12px; color: #9CA3AF; line-height: 1.5; margin: 16px 0 0 0; text-align: center;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${deletionUrl}" style="color: #DC2626; word-break: break-all;">${deletionUrl}</a>
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 32px; padding: 0 20px;">
              <p style="font-size: 14px; color: #9CA3AF; margin: 0;">
                We hope you'll consider coming back to mindful spending! 💙<br>
                PausePal - Your companion for intentional spending
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Deletion confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-deletion-email function:", error);
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
