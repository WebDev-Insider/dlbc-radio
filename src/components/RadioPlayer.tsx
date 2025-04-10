import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, Play, Pause, Radio, Waves, Users } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { 
  extractYouTubeVideoId, 
  generateYouTubeEmbedUrl
} from '@/utils/youtube';
import { 
  registerListener, 
  unregisterListener, 
  getListenerCount, 
  updateHeartbeat,
  broadcastListenerUpdate
} from '@/utils/listeners';
import { getStreamUrl } from '@/utils/streamStorage';
import { useIsMobile } from '@/hooks/use-mobile';

const RadioPlayer: React.FC = () => {
  const [currentStreamId, setCurrentStreamId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(80);
  const [listenerCount, setListenerCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const playerRef = useRef<any>(null);
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Add YouTube iframe API script
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Define onYouTubeIframeAPIReady function globally
    window.onYouTubeIframeAPIReady = () => {
      console.log("YouTube iframe API ready");
    };

    // Initial listener count
    setListenerCount(getListenerCount());

    // Listen for storage events (for cross-tab updates)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'church-radio-listener-count') {
        setListenerCount(parseInt(event.newValue || '0', 10));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      // Cleanup
      if (playerRef.current) {
        playerRef.current = null;
      }
      
      // Remove the event listener
      window.removeEventListener('storage', handleStorageChange);
      
      // Clear the heartbeat interval
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
      
      // If we were playing, unregister as a listener
      if (isPlaying) {
        unregisterListener();
        broadcastListenerUpdate();
      }
    };
  }, []);

  // Function to initialize or update YouTube player
  const initializePlayer = (videoId: string) => {
    if (window.YT && window.YT.Player) {
      if (playerRef.current) {
        playerRef.current.loadVideoById(videoId);
        playerRef.current.setVolume(volume);
      } else {
        playerRef.current = new window.YT.Player('youtube-player', {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            showinfo: 0,
            rel: 0,
            fs: 0,
            modestbranding: 1,
          },
          events: {
            onReady: (event: any) => {
              event.target.setVolume(volume);
              event.target.playVideo();
            }
          }
        });
      }
    } else {
      console.log("YouTube API not ready yet");
      // Retry in a moment if API isn't ready
      setTimeout(() => initializePlayer(videoId), 500);
    }
  };

  // Function to play the configured YouTube stream
  const playStream = async () => {
    setIsLoading(true);
    
    try {
      const streamUrl = await getStreamUrl();
      
      if (!streamUrl) {
        toast({
          title: "No stream configured",
          description: "Please contact the administrator to configure a stream",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      const videoId = extractYouTubeVideoId(streamUrl);
      
      if (!videoId) {
        toast({
          title: "Invalid stream configuration",
          description: "Please contact the administrator to fix the stream URL",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // Set current stream ID and playing state
      setCurrentStreamId(videoId);
      setIsPlaying(true);
      
      // Initialize YouTube player with the video ID
      initializePlayer(videoId);
      
      // Register as a listener
      registerListener();
      broadcastListenerUpdate();
      setListenerCount(getListenerCount());
      
      // Set up heartbeat interval
      heartbeatInterval.current = setInterval(() => {
        updateHeartbeat();
      }, 30000); // Send heartbeat every 30 seconds
      
    } catch (error) {
      toast({
        title: "Error playing stream",
        description: "There was an error playing the stream. Please try again later.",
        variant: "destructive"
      });
      console.error("Error playing stream:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle play button click
  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (playerRef.current) {
        playerRef.current.pauseVideo();
      }
      
      // Unregister as a listener
      unregisterListener();
      broadcastListenerUpdate();
      setListenerCount(getListenerCount());
      
      // Clear heartbeat interval
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
        heartbeatInterval.current = null;
      }
    } else {
      playStream();
    }
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    // Apply volume change to the YouTube player if it exists
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="overflow-hidden shadow-lg border-church-200">
        <div className="bg-gradient-to-r from-church-500 to-church-700 p-4 text-white">
          <div className="flex items-center space-x-2">
            <Radio className="h-6 w-6" />
            <h2 className="text-xl font-bold">DLBC Church Radio Streaming</h2>
          </div>
        </div>
        
        <CardContent className="p-6">
          {/* Main Player Control */}
          <div className="flex flex-col items-center justify-center gap-6 py-8">
            <div className="relative h-32 w-32 rounded-full bg-church-100 flex items-center justify-center shadow-md">
              <Button
                size="icon"
                variant="ghost"
                onClick={handlePlay}
                disabled={isLoading}
                className="h-24 w-24 rounded-full bg-church-600 hover:bg-church-700 text-white shadow-lg transform transition-transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                ) : isPlaying ? (
                  <Pause className="h-12 w-12" />
                ) : (
                  <Play className="h-12 w-12 ml-2" />
                )}
              </Button>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-1">
                {isPlaying ? "Now Playing" : "Click to Listen"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isPlaying ? "Church Service Live Stream" : "Start Church Radio Stream"}
              </p>
            </div>
          </div>
          
          {/* Hidden YouTube player div */}
          <div id="youtube-player" style={{ display: 'none' }}></div>
          
          {/* Volume Control */}
          <div className="flex items-center space-x-2 w-full max-w-md mx-auto mt-4">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="flex-grow"
            />
            <span className="text-sm text-muted-foreground w-8">{volume}%</span>
          </div>
          
          {/* Status Indicator and Listener Count */}
          <div className="mt-8 flex justify-center items-center space-x-6">
            {isPlaying ? (
              <div className="flex items-center space-x-2 text-green-600">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full animate-ping bg-green-400 opacity-30"></div>
                  <div className="relative h-2 w-2 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm font-medium">Live</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-400">
                <Waves className="h-4 w-4" />
                <span className="text-sm">Ready to stream</span>
              </div>
            )}
            
            {/* Listener Count */}
            <div className="flex items-center space-x-2 text-church-600">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium"> listen now</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RadioPlayer;
