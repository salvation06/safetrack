import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error('Invalid credentials. Use test/test123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-secondary/5 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>
      <Card className="w-full max-w-md shadow-2xl border-2 relative z-10 bg-white/95 backdrop-blur">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-xl animate-pulse-slow">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-display font-bold text-foreground">SafeTrack</CardTitle>
            <CardDescription className="text-base mt-2 font-medium">
              Sign in to access your safety dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-2 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-2 focus:border-primary"
              />
            </div>
            <Button type="submit" className="w-full gradient-primary text-white hover:opacity-90 shadow-lg font-semibold py-6">
              <Shield className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground bg-gradient-to-br from-primary/5 to-secondary/5 p-4 rounded-xl border-2 border-primary/20">
            <p className="font-semibold mb-2 text-foreground">Demo Credentials:</p>
            <p>Username: <span className="font-mono font-bold text-primary">test</span></p>
            <p>Password: <span className="font-mono font-bold text-primary">test123</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
