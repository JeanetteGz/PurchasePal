
import { supabase } from '@/integrations/supabase/client';
import { Profile } from './types';

export const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log('fetchUserProfile: Starting fetch for user:', userId);
    console.log('fetchUserProfile: Testing database connection...');
    
    // Test database connection first
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    console.log('fetchUserProfile: Database connection test result:', { testData, testError });
    
    if (testError) {
      console.error('fetchUserProfile: Database connection failed:', testError);
      throw testError;
    }
    
    console.log('fetchUserProfile: Making actual profile query...');
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    console.log('fetchUserProfile: Profile query completed');
    console.log('fetchUserProfile: Database response received:', { data, error });

    if (error) {
      console.error('fetchUserProfile: Database error:', error);
      console.error('fetchUserProfile: Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    
    if (data) {
      console.log('fetchUserProfile: Profile data found, setting profile:', data);
      return data;
    } else {
      console.log('fetchUserProfile: No profile found for user:', userId);
      return null;
    }
  } catch (error) {
    console.error('fetchUserProfile: Unexpected error:', error);
    console.error('fetchUserProfile: Error type:', typeof error);
    console.error('fetchUserProfile: Error constructor:', error?.constructor?.name);
    if (error instanceof Error) {
      console.error('fetchUserProfile: Error message:', error.message);
      console.error('fetchUserProfile: Error stack:', error.stack);
    }
    throw error;
  }
};

export const fetchUserProfileWithRetry = async (userId: string, maxRetries: number, delay: number): Promise<Profile | null> => {
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
        return data;
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
      console.error('fetchUserProfileWithRetry: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    }

    // Wait before retrying
    if (i < maxRetries - 1) {
      console.log(`fetchUserProfileWithRetry: Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  console.log('fetchUserProfileWithRetry: Failed to fetch profile after all retries');
  return null;
};
