
/**
 * Extracts the YouTube video ID from various YouTube URL formats
 */
export const extractYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;

  // Regular expression to match YouTube video IDs from various URL formats
  const regExp = /^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  return match && match[1].length === 11 ? match[1] : null;
};

/**
 * Checks if a URL is a valid YouTube URL
 */
export const isYouTubeUrl = (url: string): boolean => {
  if (!url) return false;
  
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return youtubeRegex.test(url);
};

/**
 * Generates an embed URL for a YouTube video
 */
export const generateYouTubeEmbedUrl = (videoId: string, audioOnly: boolean = false): string => {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0${audioOnly ? '&controls=0' : ''}`;
};

/**
 * Generates a thumbnail URL for a YouTube video
 */
export const getYouTubeThumbnailUrl = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
};
