
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

  const loadProfile = async (userId: string, useRetry = false) => {
    try {
      const profileData = useRetry
        ? await fetchUserProfileWithRetry(userId, 3, 500)
        : await fetchUserProfile(userId);
      setProfile(profileData);
    } catch (error) {
      console.error('AuthProvider: Failed to load profile:', error);
      setProfile(null); // prevent locking loading state
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Initializing auth state...');
    cleanupFirebaseKeys();

    const handleSession = async (session: Session | null, event?: string) => {
      if (isAccountDeleted()) {
        setUser(null);
        setSession(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const userId = session.user.id;

        if (event === 'SIGNED_IN') {
          console.log('SIGNED_IN: checking for existing profile...');
          const { data: existingProfile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

          if (error) {
            console.warn('Profile check error:', error);
            await loadProfile(userId, true); // fallback to retry
          } else if (!existingProfile) {
            console.warn('No profile found, retrying...');
            await loadProfile(userId, true);
          } else {
            setProfile(existingProfile);
          }
        } else {
          await loadProfile(userId);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    };

    // Handle existing session first
    supabase.auth.getSession().then(({ data: { session } }) =>
      handleSession(session)
    );

    // Subscribe to auth events - fix the subscription handling
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        await handleSession(session, event);
      }
    );

    // Return proper cleanup function
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return {
    user,
    session,
    profile,
    loading,
    refreshProfile,
  };
};
