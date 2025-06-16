
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
      console.log('AuthProvider: Handling session change, event:', event);
      
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
        console.log('AuthProvider: User found, loading profile for:', userId);

        // For SIGNED_IN events, be more aggressive about profile loading
        if (event === 'SIGNED_IN') {
          console.log('SIGNED_IN: checking for existing profile...');
          try {
            const { data: existingProfile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .maybeSingle();

            if (error) {
              console.warn('Profile check error:', error);
              // Try retry approach on error
              setTimeout(() => {
                loadProfile(userId, true);
              }, 100);
            } else if (!existingProfile) {
              console.warn('No profile found, retrying...');
              // Try retry approach if no profile found
              setTimeout(() => {
                loadProfile(userId, true);
              }, 100);
            } else {
              console.log('Profile found:', existingProfile);
              setProfile(existingProfile);
            }
          } catch (error) {
            console.error('Error checking profile:', error);
            // Fallback: try normal profile load
            setTimeout(() => {
              loadProfile(userId);
            }, 100);
          }
        } else {
          // For other events, use normal profile loading
          setTimeout(() => {
            loadProfile(userId);
          }, 100);
        }
      } else {
        setProfile(null);
      }

      // Always set loading to false after handling session
      setTimeout(() => {
        setLoading(false);
      }, 500); // Give profile loading a bit of time
    };

    // Handle existing session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthProvider: Initial session check:', session ? 'found' : 'none');
      handleSession(session);
    });

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
