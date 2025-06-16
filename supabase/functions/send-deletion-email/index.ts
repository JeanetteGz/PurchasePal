
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
          <!-- Header with Green to Red Gradient -->
          <div style="background: linear-gradient(135deg, #10B981, #EF4444); padding: 40px 30px; border-radius: 20px; text-align: center; margin-bottom: 30px;">
            <div style="font-size: 48px; margin-bottom: 15px;">🗑️</div>
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">Account Deletion Request</h1>
            <p style="color: white; opacity: 0.95; margin: 15px 0 0 0; font-size: 18px;">We're sad to see you go, but we understand! 💔</p>
          </div>

          <!-- Main Content -->
          <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <!-- Welcome Message -->
            <div style="text-align: center; margin-bottom: 35px;">
              <p style="font-size: 20px; color: #374151; margin: 0; font-weight: 600;">Hey ${firstName}! 👋</p>
              <p style="font-size: 16px; color: #6B7280; margin: 15px 0 0 0; line-height: 1.6;">
                We received a request to permanently delete your PurchasePal account.<br>
                This is an important security step to protect your data! 🛡️
              </p>
            </div>

            <!-- Warning Box -->
            <div style="margin: 35px 0; padding: 25px; background: linear-gradient(135deg, #FEF2F2, #FECACA); border-radius: 15px; border-left: 5px solid #EF4444;">
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
            <div style="text-align: center; margin: 40px 0;">
              <a href="${deletionUrl}" style="background: linear-gradient(135deg, #10B981, #EF4444); color: white; padding: 18px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; display: inline-block; box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4); font-size: 16px; transition: all 0.3s ease;">
                🗑️ Confirm Account Deletion
              </a>
              <p style="color: #9CA3AF; margin: 15px 0 0 0; font-size: 13px;">
                Click the button above to permanently delete your account
              </p>
            </div>

            <!-- Alternative Message -->
            <div style="margin: 35px 0; padding: 25px; background: linear-gradient(135deg, #F0FDF4, #DCFCE7); border-radius: 15px; border-left: 5px solid #10B981;">
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
            <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-top: 2px solid #F3F4F6;">
              <p style="color: #6B7280; margin: 0; font-size: 16px; line-height: 1.6;">
                We hope you'll consider coming back to mindful spending someday! 🌟<br>
                <span style="background: linear-gradient(135deg, #10B981, #3B82F6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700; font-size: 18px;">The PurchasePal Team 💚</span>
              </p>
            </div>
          </div>

          <!-- Bottom Note -->
          <div style="text-align: center; margin-top: 25px; padding: 20px; background: linear-gradient(135deg, #F8FAFC, #F1F5F9); border-radius: 15px; border: 1px solid #E2E8F0;">
            <p style="color: #64748B; margin: 0; font-size: 13px; line-height: 1.6;">
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
