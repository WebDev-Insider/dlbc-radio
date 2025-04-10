
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Lock } from 'lucide-react';

interface AdminAuthProps {
  onAuthenticate: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthenticate }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple password check
    if (password === 'henrydustin') {
      // Store authentication in localStorage
      localStorage.setItem('church-radio-admin-auth', 'true');
      toast({
        title: "Authentication successful",
        description: "Welcome to the admin panel",
      });
      onAuthenticate();
    } else {
      toast({
        title: "Authentication failed",
        description: "Incorrect password",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-lg border-church-200">
        <CardHeader className="bg-gradient-to-r from-church-500 to-church-700">
          <CardTitle className="text-white flex items-center justify-center gap-2">
            <Lock className="h-5 w-5" /> Admin Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Admin Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-grow"
                autoComplete="current-password"
              />
            </div>
            <Button 
              type="submit"
              className="w-full bg-church-600 hover:bg-church-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
