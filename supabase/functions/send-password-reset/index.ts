
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetEmailRequest {
  email: string;
  firstName: string;
  resetUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase environment variables are not set");
    }

    const resend = new Resend(resendApiKey);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { email, firstName, resetUrl }: PasswordResetEmailRequest = await req.json();

    // Generate a secure password reset link using Supabase admin client
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: resetUrl,
      }
    });

    if (error) throw error;

    // Use the generated action link which contains the proper tokens
    const resetLink = data.properties?.action_link;
    
    if (!resetLink) {
      throw new Error("Failed to generate reset link");
    }

    const emailResponse = await resend.emails.send({
      from: "PurchasePal <welcome@resend.dev>",
      to: [email],
      subject: "Reset your PurchasePal password 🔐",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #EF4444 0%, #F97316 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
            <div style="font-size: 64px; margin-bottom: 16px;">🔐</div>
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Password Reset</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 12px 0 0 0; font-size: 18px; font-weight: 400;">Secure your PurchasePal account</p>
          </div>

          <!-- Main Content -->
          <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
            <!-- Greeting -->
            <div style="text-align: center; margin-bottom: 32px;">
              <h2 style="font-size: 24px; color: #1f2937; margin: 0 0 12px 0; font-weight: 600;">Hey ${firstName}! 👋</h2>
              <p style="font-size: 16px; color: #6b7280; margin: 0; line-height: 1.6;">We received a request to reset your password. No worries, it happens to the best of us!</p>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #EF4444 0%, #F97316 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3); transition: all 0.2s ease;">
                🔑 Reset Your Password
              </a>
              <p style="color: #9ca3af; margin: 16px 0 0 0; font-size: 14px;">Click the button above to create a new password</p>
            </div>

            <!-- Security Info -->
            <div style="background: #fef2f2; border-radius: 12px; padding: 24px; margin: 32px 0; border: 1px solid #fecaca;">
              <h3 style="font-size: 18px; font-weight: 600; color: #b91c1c; margin: 0 0 16px 0; text-align: center;">Security reminder 🛡️</h3>
              <div style="display: grid; gap: 12px;">
                <div style="display: flex; align-items: center; color: #7f1d1d;">
                  <span style="margin-right: 12px; font-size: 20px;">⏰</span>
                  <span style="font-size: 15px;">This link expires in 60 minutes</span>
                </div>
                <div style="display: flex; align-items: center; color: #7f1d1d;">
                  <span style="margin-right: 12px; font-size: 20px;">🔒</span>
                  <span style="font-size: 15px;">Choose a strong, unique password</span>
                </div>
                <div style="display: flex; align-items: center; color: #7f1d1d;">
                  <span style="margin-right: 12px; font-size: 20px;">👤</span>
                  <span style="font-size: 15px;">Only you should have access to this email</span>
                </div>
                <div style="display: flex; align-items: center; color: #7f1d1d;">
                  <span style="margin-right: 12px; font-size: 20px;">❓</span>
                  <span style="font-size: 15px;">Didn't request this? You can safely ignore</span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">
                Stay secure and happy spending,<br>
                <span style="color: #374151; font-weight: 600;">The PurchasePal Team 🛡️</span>
              </p>
            </div>
          </div>

          <!-- Footer Note -->
          <div style="text-align: center; margin-top: 24px; padding: 20px; background: rgba(255, 255, 255, 0.6); border-radius: 12px; backdrop-filter: blur(10px);">
            <p style="color: #6b7280; margin: 0; font-size: 13px; line-height: 1.5;">
              🔐 This password reset was requested for <strong>${email}</strong><br>
              If you didn't request this, please check your account security or contact support.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Password reset email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-password-reset function:", error);
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
