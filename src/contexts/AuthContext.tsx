
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  age: number;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string, age: number) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          if (event === 'SIGNED_IN') {
            // Check if this is a new user by seeing if profile exists
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
            
            if (!existingProfile) {
              // This is likely a new signup, retry with delays
              await fetchUserProfileWithRetry(session.user.id, 5, 1000);
            } else {
              await fetchUserProfile(session.user.id);
            }
          } else {
            await fetchUserProfile(session.user.id);
          }
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (data) {
        console.log('Profile data fetched:', data);
        setProfile(data);
      } else {
        console.log('No profile found for user:', userId);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserProfileWithRetry = async (userId: string, maxRetries: number, delay: number) => {
    for (let i = 0; i < maxRetries; i++) {
      console.log(`Attempting to fetch profile (attempt ${i + 1}/${maxRetries})`);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (!error && data) {
          console.log('Profile data fetched successfully:', data);
          setProfile(data);
          return;
        }
        
        if (error) {
          console.log('Profile fetch attempt failed:', error);
        } else {
          console.log('Profile not found yet, will retry...');
        }
      } catch (error) {
        console.log('Profile fetch attempt error:', error);
      }

      // Wait before retrying, with increasing delay
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
    
    console.log('Failed to fetch profile after all retries');
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, age: number) => {
    const redirectUrl = `${window.location.origin}/`;
    
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

    // If signup was successful and user is created, the auth state change will handle profile fetching
    if (!error && data.user && !data.user.email_confirmed_at) {
      try {
        const { error: emailError } = await supabase.functions.invoke('send-verification-email', {
          body: {
            email: email,
            firstName: firstName,
            verificationUrl: `${window.location.origin}/auth?token_hash=${data.user.id}&type=signup&redirect_to=${redirectUrl}`
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

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    // Set localStorage flag to indicate user has signed out
    localStorage.setItem('userSignedOut', 'true');
    
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    window.location.href = '/auth';
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
