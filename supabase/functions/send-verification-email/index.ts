
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
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #10B981 0%, #3B82F6 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
            <div style="font-size: 64px; margin-bottom: 16px;">🌟</div>
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Welcome to PurchasePal!</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 12px 0 0 0; font-size: 18px; font-weight: 400;">Your journey to mindful spending starts here</p>
          </div>

          <!-- Main Content -->
          <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
            <!-- Greeting -->
            <div style="text-align: center; margin-bottom: 32px;">
              <h2 style="font-size: 24px; color: #1f2937; margin: 0 0 12px 0; font-weight: 600;">Hey ${firstName}! 👋</h2>
              <p style="font-size: 16px; color: #6b7280; margin: 0; line-height: 1.6;">We're excited to have you join our community of mindful spenders!</p>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #10B981 0%, #3B82F6 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3); transition: all 0.2s ease;">
                ✨ Confirm Your Email ✨
              </a>
              <p style="color: #9ca3af; margin: 16px 0 0 0; font-size: 14px;">Click the button above to verify your account</p>
            </div>

            <!-- Features -->
            <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin: 32px 0; border: 1px solid #e5e7eb;">
              <h3 style="font-size: 18px; font-weight: 600; color: #374151; margin: 0 0 16px 0; text-align: center;">What's waiting for you 🎁</h3>
              <div style="display: grid; gap: 12px;">
                <div style="display: flex; align-items: center; color: #4b5563;">
                  <span style="margin-right: 12px; font-size: 20px;">📝</span>
                  <span style="font-size: 15px;">Track your impulse purchases</span>
                </div>
                <div style="display: flex; align-items: center; color: #4b5563;">
                  <span style="margin-right: 12px; font-size: 20px;">💰</span>
                  <span style="font-size: 15px;">Set and manage your budget</span>
                </div>
                <div style="display: flex; align-items: center; color: #4b5563;">
                  <span style="margin-right: 12px; font-size: 20px;">📊</span>
                  <span style="font-size: 15px;">Understand your spending patterns</span>
                </div>
                <div style="display: flex; align-items: center; color: #4b5563;">
                  <span style="margin-right: 12px; font-size: 20px;">🎯</span>
                  <span style="font-size: 15px;">Make smarter financial decisions</span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">
                With love and excitement,<br>
                <span style="color: #374151; font-weight: 600;">The PurchasePal Team 💜</span>
              </p>
            </div>
          </div>

          <!-- Footer Note -->
          <div style="text-align: center; margin-top: 24px; padding: 20px; background: rgba(255, 255, 255, 0.6); border-radius: 12px; backdrop-filter: blur(10px);">
            <p style="color: #6b7280; margin: 0; font-size: 13px; line-height: 1.5;">
              📧 This email was sent to <strong>${email}</strong><br>
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
