
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

    // Create admin client with service role key for full access
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Delete all user-related data in the correct order (foreign key dependencies)
    console.log('Deleting user purchases...');
    const { error: purchasesError } = await supabaseAdmin
      .from('user_purchases')
      .delete()
      .eq('user_id', userId);

    if (purchasesError) {
      console.error('Error deleting user purchases:', purchasesError);
      throw new Error(`Failed to delete purchases: ${purchasesError.message}`);
    }

    console.log('Deleting user wants...');
    const { error: wantsError } = await supabaseAdmin
      .from('user_wants')
      .delete()
      .eq('user_id', userId);

    if (wantsError) {
      console.error('Error deleting user wants:', wantsError);
      throw new Error(`Failed to delete wants: ${wantsError.message}`);
    }

    console.log('Deleting user profile...');
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('Error deleting profile:', profileError);
      throw new Error(`Failed to delete profile: ${profileError.message}`);
    }

    console.log('Deleting auth user...');
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('Error deleting auth user:', authError);
      throw new Error(`Failed to delete auth user: ${authError.message}`);
    }

    console.log('Account deletion completed successfully for user:', userId);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Account and all associated data have been permanently deleted',
      deletedUserId: userId
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
        success: false
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
