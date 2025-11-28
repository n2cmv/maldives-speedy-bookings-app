import React, { useState } from "react";
import { Shield, ArrowLeft, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast({
                title: "Email required",
                description: "Please enter your email address",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/admin/reset-password`,
            });

            if (error) throw error;

            setIsSent(true);
            toast({
                title: "Reset link sent",
                description: "Check your email for the password reset link",
            });
        } catch (error: any) {
            console.error("Error sending reset link:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to send reset link",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 justify-center mb-4">
                        <Shield className="h-8 w-8 text-ocean-dark" />
                        <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
                    </div>
                    <CardDescription className="text-center">
                        Enter your email address and we'll send you a link to reset your password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSent ? (
                        <div className="text-center space-y-4">
                            <div className="bg-green-50 text-green-800 p-4 rounded-lg flex flex-col items-center">
                                <Mail className="h-8 w-8 mb-2 text-green-600" />
                                <p className="font-medium">Check your email</p>
                                <p className="text-sm mt-1">We've sent a password reset link to {email}</p>
                            </div>
                            <Button asChild className="w-full" variant="outline">
                                <Link to="/admin/login">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Login
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Sending..." : "Send Reset Link"}
                            </Button>
                            <div className="text-center">
                                <Link
                                    to="/admin/login"
                                    className="text-sm text-gray-500 hover:text-ocean-dark flex items-center justify-center gap-1"
                                >
                                    <ArrowLeft className="h-3 w-3" />
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;
