
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from './types';
import { cleanupFirebaseKeys, isAccountDeleted } from './utils';
import { fetchUserProfile, fetchUserProfileWithRetry } from './profileService';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (user?.id) {
      try {
        const profileData = await fetchUserProfile(user.id);
        setProfile(profileData);
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    }
  };

  const loadProfile = async (userId: string, event?: string) => {
    try {
      setLoading(true);
      
      if (event === 'SIGNED_IN') {
        console.log('AuthProvider: SIGNED_IN event - checking for existing profile');
        console.log('AuthProvider: About to query profiles table...');
        
        // Check if this is a new user by seeing if profile exists
        const { data: existingProfile, error: checkError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        
        console.log('AuthProvider: Profile check completed');
        console.log('AuthProvider: Profile check result:', { existingProfile, checkError });
        
        if (checkError) {
          console.error('AuthProvider: Error checking for existing profile:', checkError);
          console.error('AuthProvider: Database error details:', {
            message: checkError.message,
            details: checkError.details,
            hint: checkError.hint,
            code: checkError.code
          });
          setLoading(false);
          return;
        }
        
        if (!existingProfile) {
          console.log('AuthProvider: No existing profile found, retrying with delays');
          const profileData = await fetchUserProfileWithRetry(userId, 3, 500);
          setProfile(profileData);
        } else {
          console.log('AuthProvider: Existing profile found, setting it:', existingProfile);
          setProfile(existingProfile);
        }
      } else {
        console.log('AuthProvider: Not a SIGNED_IN event, fetching profile normally');
        const profileData = await fetchUserProfile(userId);
        setProfile(profileData);
      }
    } catch (error) {
      console.error('AuthProvider: Error in profile loading process:', error);
      console.error('AuthProvider: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Starting initialization');
    
    // Clean up any potential Firebase references in localStorage
    cleanupFirebaseKeys();

    // Check if account was deleted
    if (isAccountDeleted()) {
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
        if (isAccountDeleted()) {
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
          await loadProfile(session.user.id, event);
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
      if (isAccountDeleted()) {
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
        loadProfile(session.user.id).finally(() => {
          console.log('AuthProvider: Profile fetch completed for existing session');
        });
      } else {
        console.log('AuthProvider: No existing session, setting loading to false');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  console.log('AuthProvider: Current state - loading:', loading, 'user:', !!user, 'profile:', !!profile);

  return {
    user,
    session,
    profile,
    loading,
    refreshProfile
  };
};
