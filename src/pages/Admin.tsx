import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import AdminAuth from '@/components/AdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { 
  isYouTubeUrl
} from '@/utils/youtube';
import { getListenerCount, getPlayStatus } from '@/utils/listeners';
import { Activity, Users, Play, Pause, ArrowRight, LogOut } from 'lucide-react';
import { 
  saveStreamUrl, 
  getStreamUrl, 
  getStreamConfig,
  startStream,
  stopStream,
  isStreamActive
} from '@/utils/streamStorage';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [streamActive, setStreamActive] = useState<boolean>(false);
  const [listenerCount, setListenerCount] = useState<number>(0);
  const [playStatus, setPlayStatus] = useState<string>('stopped');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isToggling, setIsToggling] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuth = localStorage.getItem('church-radio-admin-auth') === 'true';
    setIsAuthenticated(isAuth);
    
    if (isAuth) {
      // Fetch stream URL and status from Supabase
      const fetchStreamData = async () => {
        const url = await getStreamUrl();
        if (url) {
          setStreamUrl(url);
        }
        
        const active = await isStreamActive();
        setStreamActive(active);
      };

      fetchStreamData();

      // Initialize listener count and play status
      setListenerCount(getListenerCount());
      setPlayStatus(getPlayStatus());

      // Set up interval to update listener count, play status, and stream active status
      const interval = setInterval(async () => {
        setListenerCount(getListenerCount());
        setPlayStatus(getPlayStatus());
        const active = await isStreamActive();
        setStreamActive(active);
      }, 5000); // Update every 5 seconds

      // Listen for storage events (for cross-tab updates)
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'church-radio-listener-count') {
          setListenerCount(parseInt(event.newValue || '0', 10));
        }
        if (event.key === 'church-radio-play-status') {
          setPlayStatus(event.newValue || 'stopped');
        }
      };

      window.addEventListener('storage', handleStorageChange);

      return () => {
        clearInterval(interval);
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [isAuthenticated]);

  const handleSaveStream = async () => {
    if (!streamUrl) {
      toast({
        title: "No URL provided",
        description: "Please enter a YouTube URL to configure",
        variant: "destructive"
      });
      return;
    }

    if (!isYouTubeUrl(streamUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await saveStreamUrl(streamUrl);
      
      if (success) {
        toast({
          title: "Stream configured",
          description: "The YouTube stream has been successfully configured and is available to all users"
        });
      } else {
        toast({
          title: "Configuration failed",
          description: "There was an error configuring the stream. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Configuration failed",
        description: "There was an error configuring the stream. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStream = async () => {
    setIsToggling(true);
    
    try {
      let success;
      
      if (streamActive) {
        // Stop the stream
        success = await stopStream();
        if (success) {
          setStreamActive(false);
          toast({
            title: "Stream stopped",
            description: "The stream has been deactivated successfully"
          });
        }
      } else {
        // Start the stream
        success = await startStream();
        if (success) {
          setStreamActive(true);
          toast({
            title: "Stream started",
            description: "The stream has been activated successfully"
          });
        }
      }
      
      if (!success) {
        toast({
          title: "Action failed",
          description: "There was an error changing the stream status. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Action failed",
        description: "There was an error changing the stream status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsToggling(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('church-radio-admin-auth');
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin panel"
    });
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-4 my-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-church-900 text-center">
            Admin Authentication
          </h1>
          <AdminAuth onAuthenticate={() => setIsAuthenticated(true)} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-8 text-center relative">
          <Button 
            variant="outline" 
            size="sm" 
            className="absolute right-0 top-0"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-church-900">
            Admin Configuration
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Configure the YouTube live stream for your audience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Stream Status Card */}
          <Card className="shadow-lg border-church-200">
            <CardHeader className="bg-gradient-to-r from-church-500 to-church-700">
              <CardTitle className="text-white">Stream Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                 
               
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-church-600" />
                    <span className="font-medium">Stream Status:</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {playStatus === 'playing' ? (
                      <>
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="font-bold text-green-600">Playing</span>
                      </>
                    ) : (
                      <>
                        <span className="relative flex h-3 w-3">
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <span className="font-bold text-red-600">Stopped</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="h-5 w-5 text-church-600" />
                    <span className="font-medium">Stream Active:</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={streamActive}
                      onCheckedChange={handleToggleStream}
                      disabled={isToggling}
                    />
                    <span className={`font-medium ${streamActive ? 'text-green-600' : 'text-red-600'}`}>
                      {streamActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <Button 
                    onClick={handleToggleStream}
                    disabled={isToggling}
                    className={`w-full ${streamActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {isToggling ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                    ) : streamActive ? (
                      <>
                        <Pause className="h-5 w-5 mr-1" /> Stop Stream
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-1" /> Start Stream
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stream Configuration Card */}
          <Card className="shadow-lg border-church-200">
            <CardHeader className="bg-gradient-to-r from-church-500 to-church-700">
              <CardTitle className="text-white">Stream Configuration</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="streamUrl">YouTube Live Stream URL</Label>
                  <Input
                    id="streamUrl"
                    placeholder="Enter YouTube live URL..."
                    value={streamUrl}
                    onChange={(e) => setStreamUrl(e.target.value)}
                    className="flex-grow"
                  />
                  <p className="text-sm text-muted-foreground">
                    Paste the URL of the YouTube live stream you want to share with your audience.
                  </p>
                </div>

                <Button 
                  onClick={handleSaveStream}
                  className="bg-church-600 hover:bg-church-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg border-church-200">
          <CardContent className="p-6">
            <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-md">
              <h3 className="font-medium text-amber-800">Important Notes:</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-amber-700 space-y-1">
                <li>Make sure the YouTube stream is public or unlisted</li>
                <li>Use the share URL from YouTube for best compatibility</li>
                <li>Set the stream to "Active" for users to access it</li>
                <li>You can disable the stream temporarily by toggling it to "Inactive"</li>
                <li>Users will only hear the audio from the stream</li>
                <li>The stream status updates every 5 seconds</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Admin;
