
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
      from: "PurchasePal <security@resend.dev>",
      to: [email],
      subject: "🗑️ Confirm Account Deletion - PurchasePal",
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fafafa;">
          <!-- Header with Gradient -->
          <div style="background: linear-gradient(135deg, #10B981, #3B82F6); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px;">
            <div style="font-size: 48px; margin-bottom: 15px;">🗑️</div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Account Deletion Request</h1>
            <p style="color: white; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">We're sad to see you go, but we understand! 💔</p>
          </div>

          <!-- Main Content -->
          <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <!-- Welcome Message -->
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="font-size: 18px; color: #4B5563; margin: 0; font-weight: 600;">Hey ${firstName}! 👋</p>
              <p style="font-size: 16px; color: #6B7280; margin: 10px 0 0 0; line-height: 1.6;">
                We received a request to permanently delete your PurchasePal account.<br>
                This is an important security step to protect your data! 🛡️
              </p>
            </div>

            <!-- Warning Box -->
            <div style="margin: 30px 0; padding: 25px; background: #FEF2F2; border-radius: 10px; border-left: 5px solid #EF4444;">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <span style="font-size: 24px; margin-right: 10px;">⚠️</span>
                <p style="font-weight: 700; color: #DC2626; margin: 0; font-size: 18px;">This action cannot be undone!</p>
              </div>
              <p style="color: #7F1D1D; margin: 0 0 15px 0; font-size: 15px; line-height: 1.5;">
                Deleting your account will permanently remove:
              </p>
              <div style="background: white; padding: 20px; border-radius: 10px; margin-top: 15px;">
                <div style="display: grid; gap: 12px;">
                  <div style="display: flex; align-items: center; color: #7F1D1D;">
                    <span style="margin-right: 12px; font-size: 18px;">📊</span>
                    <span style="font-size: 14px;">All your purchase data and spending insights</span>
                  </div>
                  <div style="display: flex; align-items: center; color: #7F1D1D;">
                    <span style="margin-right: 12px; font-size: 18px;">👤</span>
                    <span style="font-size: 14px;">Your complete profile information</span>
                  </div>
                  <div style="display: flex; align-items: center; color: #7F1D1D;">
                    <span style="margin-right: 12px; font-size: 18px;">🎯</span>
                    <span style="font-size: 14px;">Your spending habits and trigger data</span>
                  </div>
                  <div style="display: flex; align-items: center; color: #7F1D1D;">
                    <span style="margin-right: 12px; font-size: 18px;">⚙️</span>
                    <span style="font-size: 14px;">All account settings and preferences</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Confirmation Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${deletionUrl}" style="background: linear-gradient(135deg, #10B981, #3B82F6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); font-size: 16px;">
                🗑️ Confirm Account Deletion
              </a>
              <p style="color: #6B7280; margin: 15px 0 0 0; font-size: 13px;">
                Click the button above to permanently delete your account
              </p>
            </div>

            <!-- Alternative Message -->
            <div style="margin: 30px 0; padding: 20px; background: #F0FDF4; border-radius: 10px; border-left: 5px solid #10B981;">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <span style="font-size: 24px; margin-right: 10px;">💚</span>
                <p style="font-weight: 700; color: #059669; margin: 0; font-size: 18px;">Changed your mind?</p>
              </div>
              <p style="color: #065F46; margin: 0; font-size: 15px; line-height: 1.6;">
                If you didn't request this deletion or want to keep your account, simply ignore this email. 
                Your account will remain active and secure! 🛡️
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
              <p style="color: #6B7280; margin: 0; font-size: 14px; line-height: 1.6;">
                We hope you'll consider coming back to mindful spending someday! 🌟<br>
                <span style="color: white; font-weight: bold;">The PurchasePal Team 💜</span>
              </p>
            </div>
          </div>

          <!-- Bottom Note -->
          <div style="text-align: center; margin-top: 20px; padding: 15px; background: #F8FAFC; border-radius: 10px;">
            <p style="color: #6B7280; margin: 0; font-size: 12px; line-height: 1.6;">
              📧 This email was sent to <strong>${email}</strong><br>
              If you didn't request this deletion, you can safely ignore this email.<br><br>
              🔗 <strong>Having trouble with the button?</strong> Copy and paste this link:<br>
              <a href="${deletionUrl}" style="color: #10B981; word-break: break-all; font-size: 12px; text-decoration: none; font-weight: 500;">${deletionUrl}</a>
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
