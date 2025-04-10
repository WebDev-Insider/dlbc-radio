
import { supabase } from "@/integrations/supabase/client";

/**
 * Saves a YouTube stream URL to Supabase
 */
export const saveStreamUrl = async (url: string, title: string = 'Church Live Stream'): Promise<boolean> => {
  try {
    // Get current active stream if any
    const { data: existingStreams } = await supabase
      .from('stream_config')
      .select('*')
      .eq('is_active', true)
      .limit(1);
    
    if (existingStreams && existingStreams.length > 0) {
      // Update existing stream
      const { error } = await supabase
        .from('stream_config')
        .update({ url, title, updated_at: new Date().toISOString() })
        .eq('id', existingStreams[0].id);
      
      return !error;
    } else {
      // Insert new stream
      const { error } = await supabase
        .from('stream_config')
        .insert({ url, title, is_active: true });
      
      return !error;
    }
  } catch (error) {
    console.error('Error saving stream URL:', error);
    return false;
  }
};

/**
 * Retrieves the active YouTube stream URL from Supabase
 */
export const getStreamUrl = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('stream_config')
      .select('url')
      .eq('is_active', true)
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching stream URL:', error);
      return null;
    }
    
    return data?.url || null;
  } catch (error) {
    console.error('Error getting stream URL:', error);
    return null;
  }
};

/**
 * Retrieves the full stream configuration from Supabase
 */
export const getStreamConfig = async (): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from('stream_config')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching stream config:', error);
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error('Error getting stream config:', error);
    return null;
  }
};

/**
 * Starts the stream by setting is_active to true
 */
export const startStream = async (id?: string): Promise<boolean> => {
  try {
    // If no ID is provided, use the most recently added stream
    if (!id) {
      const { data } = await supabase
        .from('stream_config')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      id = data?.id;
    }
    
    if (!id) {
      console.error('No stream configuration found');
      return false;
    }
    
    const { error } = await supabase
      .from('stream_config')
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    return !error;
  } catch (error) {
    console.error('Error starting stream:', error);
    return false;
  }
};

/**
 * Stops the stream by setting is_active to false
 */
export const stopStream = async (id?: string): Promise<boolean> => {
  try {
    // If no ID is provided, find the currently active stream
    if (!id) {
      const { data } = await supabase
        .from('stream_config')
        .select('id')
        .eq('is_active', true)
        .limit(1)
        .single();
      
      id = data?.id;
    }
    
    if (!id) {
      console.error('No active stream found');
      return false;
    }
    
    const { error } = await supabase
      .from('stream_config')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    return !error;
  } catch (error) {
    console.error('Error stopping stream:', error);
    return false;
  }
};

/**
 * Checks if a stream is active
 */
export const isStreamActive = async (): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from('stream_config')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    
    if (error) {
      console.error('Error checking stream status:', error);
      return false;
    }
    
    return count ? count > 0 : false;
  } catch (error) {
    console.error('Error checking stream status:', error);
    return false;
  }
};
