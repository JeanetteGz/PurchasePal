
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
    console.log('AuthProvider: Starting initialization');
    
    // Clean up any potential Firebase references in localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.includes('firebase') || key.includes('Firebase')) {
        console.log('Removing Firebase key:', key);
        localStorage.removeItem(key);
      }
    });

    // Check if account was deleted
    const accountDeleted = localStorage.getItem('accountDeleted');
    if (accountDeleted === 'true') {
      console.log('Account was deleted, clearing all state');
      setUser(null);
      setSession(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AUTH_EVENT:', event, 'User ID:', session?.user?.id);
        console.log('AuthProvider: Processing auth state change, current loading:', loading);
        
        // If account was deleted, don't process auth changes
        if (localStorage.getItem('accountDeleted') === 'true') {
          console.log('Ignoring auth state change - account deleted');
          setUser(null);
          setSession(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('AuthProvider: User found, starting profile fetch for:', session.user.id);
          
          try {
            if (event === 'SIGNED_IN') {
              console.log('AuthProvider: SIGNED_IN event - checking for existing profile');
              // Check if this is a new user by seeing if profile exists
              const { data: existingProfile, error: checkError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              console.log('AuthProvider: Profile check result:', { existingProfile, checkError });
              
              if (checkError) {
                console.error('AuthProvider: Error checking for existing profile:', checkError);
                setLoading(false);
                return;
              }
              
              if (!existingProfile) {
                console.log('AuthProvider: No existing profile found, retrying with delays');
                await fetchUserProfileWithRetry(session.user.id, 3, 500);
              } else {
                console.log('AuthProvider: Existing profile found, setting it:', existingProfile);
                setProfile(existingProfile);
                setLoading(false);
              }
            } else {
              console.log('AuthProvider: Not a SIGNED_IN event, fetching profile normally');
              await fetchUserProfile(session.user.id);
            }
          } catch (error) {
            console.error('AuthProvider: Error in profile loading process:', error);
            setLoading(false);
          }
        } else {
          console.log('AuthProvider: No user, clearing profile and setting loading to false');
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthProvider: Checking existing session:', !!session);
      
      // If account was deleted, don't process existing session
      if (localStorage.getItem('accountDeleted') === 'true') {
        console.log('Ignoring existing session - account deleted');
        setUser(null);
        setSession(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log('AuthProvider: Existing session found, fetching profile');
        fetchUserProfile(session.user.id).finally(() => {
          console.log('AuthProvider: Profile fetch completed for existing session');
        });
      } else {
        console.log('AuthProvider: No existing session, setting loading to false');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('fetchUserProfile: Starting fetch for user:', userId);
      
      console.log('fetchUserProfile: Making database query...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      console.log('fetchUserProfile: Database response received:', { data, error });

      if (error) {
        console.error('fetchUserProfile: Database error:', error);
        console.error('fetchUserProfile: Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        setLoading(false);
        return;
      }
      
      if (data) {
        console.log('fetchUserProfile: Profile data found, setting profile:', data);
        setProfile(data);
      } else {
        console.log('fetchUserProfile: No profile found for user:', userId);
        setProfile(null);
      }
      
      console.log('fetchUserProfile: Setting loading to false');
      setLoading(false);
    } catch (error) {
      console.error('fetchUserProfile: Unexpected error:', error);
      setLoading(false);
    }
  };

  const fetchUserProfileWithRetry = async (userId: string, maxRetries: number, delay: number) => {
    console.log(`fetchUserProfileWithRetry: Starting with ${maxRetries} retries for user:`, userId);
    
    for (let i = 0; i < maxRetries; i++) {
      console.log(`fetchUserProfileWithRetry: Attempt ${i + 1}/${maxRetries}`);
      
      try {
        console.log(`fetchUserProfileWithRetry: Making database query attempt ${i + 1}...`);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        console.log(`fetchUserProfileWithRetry: Attempt ${i + 1} result:`, { data, error });

        if (!error && data) {
          console.log('fetchUserProfileWithRetry: Profile found successfully:', data);
          setProfile(data);
          setLoading(false);
          return;
        }
        
        if (error) {
          console.log('fetchUserProfileWithRetry: Database error on attempt', i + 1, ':', error);
          console.error('fetchUserProfileWithRetry: Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
        } else {
          console.log('fetchUserProfileWithRetry: Profile not found yet, will retry...');
        }
      } catch (error) {
        console.log('fetchUserProfileWithRetry: Exception on attempt', i + 1, ':', error);
      }

      // Wait before retrying
      if (i < maxRetries - 1) {
        console.log(`fetchUserProfileWithRetry: Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    console.log('fetchUserProfileWithRetry: Failed to fetch profile after all retries, setting loading to false');
    setLoading(false);
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
    // Clear deleted account flag when signing in
    localStorage.removeItem('accountDeleted');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    // Set localStorage flag to indicate user has signed out
    localStorage.setItem('userSignedOut', 'true');
    localStorage.removeItem('accountDeleted');
    
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    window.location.href = '/auth';
  };

  console.log('AuthProvider: Current state - loading:', loading, 'user:', !!user, 'profile:', !!profile);

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
