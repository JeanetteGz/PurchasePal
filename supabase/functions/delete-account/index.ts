
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      throw new Error('User ID is required');
    }

    console.log('Starting account deletion for user:', userId);

    // Create admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // First, delete all user-related data in the correct order
    // Delete user purchases first
    const { error: purchasesError } = await supabaseAdmin
      .from('user_purchases')
      .delete()
      .eq('user_id', userId);

    if (purchasesError) {
      console.error('Error deleting user purchases:', purchasesError);
      // Don't throw here, continue with deletion
    } else {
      console.log('Successfully deleted user purchases');
    }

    // Delete user wants
    const { error: wantsError } = await supabaseAdmin
      .from('user_wants')
      .delete()
      .eq('user_id', userId);

    if (wantsError) {
      console.error('Error deleting user wants:', wantsError);
      // Don't throw here, continue with deletion
    } else {
      console.log('Successfully deleted user wants');
    }

    // Delete user profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('Error deleting profile:', profileError);
      // Don't throw here, continue with deletion
    } else {
      console.log('Successfully deleted user profile');
    }

    // Finally, delete the auth user (this should cascade delete any remaining references)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('Error deleting auth user:', authError);
      throw authError;
    }

    console.log('Successfully deleted auth user');
    console.log('Account deletion completed for user:', userId);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Account and all associated data have been permanently deleted' 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in delete-account function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to completely delete account. Please contact support.'
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
