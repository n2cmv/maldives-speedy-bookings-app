
import React, { useState } from "react";
import { LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface AdminLoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  authError: string | null;
}

const AdminLoginForm = ({
  onSubmit,
  isLoading,
  authError
}: AdminLoginFormProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    setFormError(null);
    if (!email) {
      setFormError("Email is required");
      return;
    }
    if (!password) {
      setFormError("Password is required");
      return;
    }
    
    await onSubmit(email, password);
  };

  return (
    <>
      {(authError || formError) && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {formError || authError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-required="true"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-required="true"
            placeholder="Enter your password"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              Logging in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Login
            </span>
          )}
        </Button>
      </form>
    </>
  );
};

export default AdminLoginForm;
