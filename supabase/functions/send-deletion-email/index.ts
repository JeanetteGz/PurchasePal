
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
      from: "PausePal <security@resend.dev>",
      to: [email],
      subject: "Confirm Account Deletion - PausePal 🗑️",
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fafafa;">
          <!-- Header with Red Gradient for Deletion -->
          <div style="background: linear-gradient(135deg, #EF4444, #DC2626); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Account Deletion Request 🗑️</h1>
            <p style="color: white; opacity: 0.9; margin: 10px 0 0 0;">We're sad to see you go, but we understand!</p>
          </div>

          <!-- Main Content -->
          <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <!-- Welcome Message -->
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="font-size: 18px; color: #4B5563; margin: 0;">Hi ${firstName}! 👋</p>
              <p style="font-size: 16px; color: #6B7280; margin: 10px 0;">We received a request to permanently delete your PausePal account.</p>
            </div>

            <!-- Warning Box -->
            <div style="margin: 30px 0; padding: 20px; background: #FEF2F2; border-radius: 10px; border-left: 4px solid #EF4444;">
              <p style="font-weight: bold; color: #DC2626; margin-bottom: 15px;">⚠️ Important: This action cannot be undone</p>
              <p style="color: #7F1D1D; margin: 0; font-size: 14px;">
                Deleting your account will permanently remove:
              </p>
              <ul style="color: #7F1D1D; margin: 10px 0 0 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">All your purchase data and insights 📊</li>
                <li style="margin-bottom: 8px;">Your profile information 👤</li>
                <li style="margin-bottom: 8px;">Your spending habits and triggers 🎯</li>
                <li style="margin-bottom: 8px;">All account settings and preferences ⚙️</li>
              </ul>
            </div>

            <!-- Confirmation Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${deletionUrl}" style="background: linear-gradient(135deg, #DC2626, #B91C1C); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);">
                🗑️ Confirm Account Deletion 🗑️
              </a>
            </div>

            <!-- Alternative Message -->
            <div style="margin: 30px 0; padding: 20px; background: #F0FDF4; border-radius: 10px;">
              <p style="font-weight: bold; color: #15803D; margin-bottom: 15px;">Changed your mind? 💚</p>
              <p style="color: #166534; margin: 0; font-size: 14px;">
                If you didn't request this deletion or want to keep your account, simply ignore this email. Your account will remain active and secure! 🛡️
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
              <p style="color: #6B7280; margin: 0; font-size: 14px;">
                We hope you'll consider coming back to mindful spending!<br>
                <span style="color: #8B5CF6; font-weight: bold;">The PausePal Team 💙</span>
              </p>
            </div>
          </div>

          <!-- Bottom Note -->
          <div style="text-align: center; margin-top: 20px; padding: 15px; background: #F8FAFC; border-radius: 10px;">
            <p style="color: #6B7280; margin: 0; font-size: 12px;">
              This email was sent to ${email}<br>
              If you didn't request this deletion, you can safely ignore this email.<br>
              <br>
              If the button doesn't work, copy and paste this link:<br>
              <a href="${deletionUrl}" style="color: #DC2626; word-break: break-all; font-size: 11px;">${deletionUrl}</a>
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
