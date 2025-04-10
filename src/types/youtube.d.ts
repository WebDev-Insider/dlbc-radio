
interface YT {
  Player: {
    new (
      elementId: string,
      options: {
        videoId?: string;
        playerVars?: {
          autoplay?: number;
          controls?: number;
          showinfo?: number;
          rel?: number;
          fs?: number;
          modestbranding?: number;
          [key: string]: any;
        };
        events?: {
          onReady?: (event: any) => void;
          onStateChange?: (event: any) => void;
          onError?: (event: any) => void;
          [key: string]: any;
        };
      }
    ): YTPlayer;
  };
}

interface YTPlayer {
  loadVideoById(videoId: string): void;
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  setVolume(volume: number): void;
  getVolume(): number;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  destroy(): void;
}

interface Window {
  YT: YT;
  onYouTubeIframeAPIReady: () => void;
}
