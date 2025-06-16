
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

        // Load profile asynchronously without blocking
        setTimeout(async () => {
          try {
            await loadProfile(userId, event === 'SIGNED_IN');
          } catch (error) {
            console.error('Profile loading failed:', error);
          }
        }, 100);
      } else {
        setProfile(null);
      }

      // Set loading to false quickly to prevent timeout
      setLoading(false);
    };

    // Handle existing session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthProvider: Initial session check:', session ? 'found' : 'none');
      handleSession(session);
    }).catch((error) => {
      console.error('AuthProvider: Error getting session:', error);
      setLoading(false);
    });

    // Subscribe to auth events
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
