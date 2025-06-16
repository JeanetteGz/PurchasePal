
import { supabase } from '@/integrations/supabase/client';
import { cleanupFirebaseKeys, setAccountDeleted, setUserSignedOut } from './utils';

export const signUp = async (email: string, password: string, firstName: string, lastName: string, age: number) => {
  const redirectUrl = `${window.location.origin}/auth`;
  
  console.log('Signing up with metadata:', { first_name: firstName, last_name: lastName, age });
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        first_name: firstName,
        last_name: lastName,
        age: age
      }
    }
  });

  if (!error && data.user && !data.user.email_confirmed_at) {
    try {
      const { error: emailError } = await supabase.functions.invoke('send-verification-email', {
        body: {
          email: email,
          firstName: firstName,
          verificationUrl: `${window.location.origin}/auth?token_hash=${data.user.id}&type=signup`
        }
      });
      
      if (emailError) {
        console.error('Error sending verification email:', emailError);
      }
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }
  }

  return { error };
};

export const signIn = async (email: string, password: string) => {
  // Clear deleted account flag when signing in
  setAccountDeleted(false);
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { error };
};

export const signOut = async () => {
  // Set localStorage flag to indicate user has signed out
  setUserSignedOut(true);
  setAccountDeleted(false);
  
  await supabase.auth.signOut();
  window.location.href = '/auth';
};
