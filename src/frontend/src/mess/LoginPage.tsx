import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User, UtensilsCrossed } from "lucide-react";
import { useState } from "react";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      onLogin();
    } else {
      setError("Invalid credentials. Use admin / admin123");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center sidebar-gradient">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm mb-4">
            <UtensilsCrossed className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            HOSTEL MESS
          </h1>
          <p className="text-white/70 mt-1 text-sm">CONTROL SYSTEM</p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Admin Login</CardTitle>
            <CardDescription>
              Sign in to manage your hostel mess
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    data-ocid="login.input"
                    className="pl-10"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    data-ocid="login.input"
                    className="pl-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              {error && (
                <p
                  data-ocid="login.error_state"
                  className="text-sm text-destructive"
                >
                  {error}
                </p>
              )}
              <Button
                data-ocid="login.submit_button"
                type="submit"
                className="w-full bg-[oklch(0.22_0.09_253)] hover:bg-[oklch(0.27_0.09_253)]"
              >
                Sign In
              </Button>
            </form>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Default: admin / admin123
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
