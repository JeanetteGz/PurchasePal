
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
      from: "PurchasePal <welcome@resend.dev>",
      to: [email],
      subject: "Welcome to PurchasePal! Verify your email 🛍️",
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fafafa;">
          <!-- Cute Header with Gradient -->
          <div style="background: linear-gradient(135deg, #10B981, #3B82F6); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to PurchasePal! 🌟</h1>
            <p style="color: white; opacity: 0.9; margin: 10px 0 0 0;">Your journey to mindful spending starts here!</p>
          </div>

          <!-- Main Content -->
          <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <!-- Welcome Message -->
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="font-size: 18px; color: #4B5563; margin: 0;">Hey ${firstName}! 👋</p>
              <p style="font-size: 16px; color: #6B7280; margin: 10px 0;">We're so excited to have you join our community of mindful spenders!</p>
            </div>

            <!-- Confirmation Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background: linear-gradient(135deg, #10B981, #3B82F6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">
                ✨ Confirm Your Email ✨
              </a>
            </div>

            <!-- Features List -->
            <div style="margin: 30px 0; padding: 20px; background: #F8FAFC; border-radius: 10px;">
              <p style="font-weight: bold; color: #4B5563; margin-bottom: 15px;">What's waiting for you: 🎁</p>
              <ul style="color: #6B7280; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Track your impulse purchases 📝</li>
                <li style="margin-bottom: 8px;">Set and manage your budget 💰</li>
                <li style="margin-bottom: 8px;">Understand your spending patterns 📊</li>
                <li style="margin-bottom: 8px;">Make smarter financial decisions 🎯</li>
              </ul>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
              <p style="color: #6B7280; margin: 0; font-size: 14px;">
                With love and excitement,<br>
                <span style="color: white; font-weight: bold;">The PurchasePal Team 💜</span>
              </p>
            </div>
          </div>

          <!-- Bottom Note -->
          <div style="text-align: center; margin-top: 20px; padding: 15px; background: #F8FAFC; border-radius: 10px;">
            <p style="color: #6B7280; margin: 0; font-size: 12px;">
              This email was sent to ${email}<br>
              If you didn't create this account, you can safely ignore this email.
            </p>
          </div>
        </div>
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
