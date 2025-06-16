
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

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
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }

    const resend = new Resend(resendApiKey);
    
    const { email, firstName, deletionUrl }: DeletionEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "PurchasePal <security@purchasepal.app>",
      to: [email],
      subject: "🗑️ Confirm Account Deletion - PurchasePal",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fef2f2;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
            <div style="font-size: 64px; margin-bottom: 16px;">🗑️</div>
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Account Deletion Request</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 12px 0 0 0; font-size: 18px; font-weight: 400;">We're sad to see you go, but we understand</p>
          </div>

          <!-- Main Content -->
          <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
            <!-- Greeting -->
            <div style="text-align: center; margin-bottom: 32px;">
              <h2 style="font-size: 24px; color: #1f2937; margin: 0 0 12px 0; font-weight: 600;">Hey ${firstName}! 👋</h2>
              <p style="font-size: 16px; color: #6b7280; margin: 0; line-height: 1.6;">
                We received a request to permanently delete your PurchasePal account.<br>
                This is an important security step to protect your data 🛡️
              </p>
            </div>

            <!-- Warning -->
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-left: 4px solid #ef4444; border-radius: 12px; padding: 24px; margin: 32px 0;">
              <div style="display: flex; align-items: center; margin-bottom: 16px;">
                <span style="font-size: 28px; margin-right: 12px;">⚠️</span>
                <h3 style="font-size: 20px; font-weight: 600; color: #dc2626; margin: 0;">This action cannot be undone!</h3>
              </div>
              <p style="color: #7f1d1d; margin: 0 0 16px 0; font-size: 15px; line-height: 1.5;">
                Deleting your account will permanently remove:
              </p>
              <div style="background: #ffffff; border-radius: 8px; padding: 20px; margin-top: 16px;">
                <div style="display: grid; gap: 12px;">
                  <div style="display: flex; align-items: center; color: #7f1d1d;">
                    <span style="margin-right: 12px; font-size: 20px;">📊</span>
                    <span style="font-size: 14px;">All your purchase data and spending insights</span>
                  </div>
                  <div style="display: flex; align-items: center; color: #7f1d1d;">
                    <span style="margin-right: 12px; font-size: 20px;">👤</span>
                    <span style="font-size: 14px;">Your complete profile information</span>
                  </div>
                  <div style="display: flex; align-items: center; color: #7f1d1d;">
                    <span style="margin-right: 12px; font-size: 20px;">🎯</span>
                    <span style="font-size: 14px;">Your spending habits and trigger data</span>
                  </div>
                  <div style="display: flex; align-items: center; color: #7f1d1d;">
                    <span style="margin-right: 12px; font-size: 20px;">⚙️</span>
                    <span style="font-size: 14px;">All account settings and preferences</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${deletionUrl}" style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3); transition: all 0.2s ease;">
                🗑️ Confirm Account Deletion
              </a>
              <p style="color: #9ca3af; margin: 16px 0 0 0; font-size: 14px;">Click the button above to permanently delete your account</p>
            </div>

            <!-- Alternative -->
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #10b981; border-radius: 12px; padding: 24px; margin: 32px 0;">
              <div style="display: flex; align-items: center; margin-bottom: 16px;">
                <span style="font-size: 28px; margin-right: 12px;">💚</span>
                <h3 style="font-size: 20px; font-weight: 600; color: #059669; margin: 0;">Changed your mind?</h3>
              </div>
              <p style="color: #065f46; margin: 0; font-size: 15px; line-height: 1.6;">
                If you didn't request this deletion or want to keep your account, simply ignore this email. 
                Your account will remain active and secure! 🛡️
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">
                We hope you'll consider coming back to mindful spending someday! 🌟<br>
                <span style="color: #374151; font-weight: 600;">The PurchasePal Team 💜</span>
              </p>
            </div>
          </div>

          <!-- Footer Note -->
          <div style="text-align: center; margin-top: 24px; padding: 20px; background: rgba(255, 255, 255, 0.6); border-radius: 12px; backdrop-filter: blur(10px);">
            <p style="color: #6b7280; margin: 0; font-size: 13px; line-height: 1.5;">
              📧 This email was sent to <strong>${email}</strong><br>
              If you didn't request this deletion, you can safely ignore this email.<br><br>
              🔗 <strong>Having trouble with the button?</strong> Copy and paste this link:<br>
              <a href="${deletionUrl}" style="color: #10b981; word-break: break-all; font-size: 12px; text-decoration: none; font-weight: 500;">${deletionUrl}</a>
            </p>
          </div>
        </div>
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
