
// Maximum number of recent streams to store
const MAX_RECENT_STREAMS = 10;

export interface StreamInfo {
  id: string;
  url: string;
  title: string;
  timestamp: number;
  thumbnailUrl?: string;
}

/**
 * Save a stream to local storage
 */
export const saveRecentStream = (stream: Omit<StreamInfo, 'timestamp'>): void => {
  try {
    // Get existing streams
    const existingStreamsJSON = localStorage.getItem('recentStreams');
    const existingStreams: StreamInfo[] = existingStreamsJSON 
      ? JSON.parse(existingStreamsJSON) 
      : [];
    
    // Create new stream with timestamp
    const newStream: StreamInfo = {
      ...stream,
      timestamp: Date.now()
    };
    
    // Remove existing entry with same id if exists
    const filteredStreams = existingStreams.filter(s => s.id !== newStream.id);
    
    // Add new stream to beginning of array
    const updatedStreams = [newStream, ...filteredStreams].slice(0, MAX_RECENT_STREAMS);
    
    // Save to localStorage
    localStorage.setItem('recentStreams', JSON.stringify(updatedStreams));
  } catch (error) {
    console.error('Failed to save recent stream:', error);
  }
};

/**
 * Get recent streams from local storage
 */
export const getRecentStreams = (): StreamInfo[] => {
  try {
    const streams = localStorage.getItem('recentStreams');
    return streams ? JSON.parse(streams) : [];
  } catch (error) {
    console.error('Failed to get recent streams:', error);
    return [];
  }
};

/**
 * Clear all recent streams
 */
export const clearRecentStreams = (): void => {
  try {
    localStorage.removeItem('recentStreams');
  } catch (error) {
    console.error('Failed to clear recent streams:', error);
  }
};

/**
 * Remove a specific stream by ID
 */
export const removeRecentStream = (id: string): void => {
  try {
    const streams = getRecentStreams();
    const updatedStreams = streams.filter(stream => stream.id !== id);
    localStorage.setItem('recentStreams', JSON.stringify(updatedStreams));
  } catch (error) {
    console.error('Failed to remove stream:', error);
  }
};
