import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

type ResetStep = "email" | "otp" | "reset";

const getPasswordValidationError = (password: string): string | null => {
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one capital letter.";
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return "Password must include at least one special character.";
  }
  if (/(.)\1/.test(password)) {
    return "Password cannot contain repeated consecutive characters.";
  }
  return null;
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<ResetStep>("email");
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [resetToken, setResetToken] = useState<string | null>(null);

  const postToFirstAvailableEndpoint = async <T,>(
    endpointCandidates: string[],
    payload: Record<string, any>,
  ): Promise<T> => {
    let lastError: any;

    for (const endpoint of endpointCandidates) {
      try {
        const response = await axiosInstance.post(endpoint, payload);
        return response.data as T;
      } catch (error: any) {
        const status = error?.response?.status;
        if (status === 404 || status === 405) {
          lastError = error;
          continue;
        }
        throw error;
      }
    }

    throw lastError || new Error("No matching endpoint found for forgot password flow.");
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await postToFirstAvailableEndpoint([
        "/api/auth/forgot-password/",
        "/api/auth/password-reset/request-otp/",
        "/api/auth/request-password-reset/",
      ], {
        email,
      });

      toast.success("OTP sent to your registered email.");
      setStep("otp");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.response?.data?.error || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await postToFirstAvailableEndpoint<Record<string, any>>([
        "/api/auth/forgot-password/verify-otp/",
        "/api/auth/password-reset/verify-otp/",
        "/api/auth/verify-reset-otp/",
      ], {
        email,
        otp,
      });

      setResetToken((data as any)?.reset_token ?? null);
      toast.success("OTP verified. You can now set a new password.");
      setStep("reset");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.response?.data?.error || "Invalid OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewPasswordError("");
    setConfirmPasswordError("");

    const passwordValidationError = getPasswordValidationError(newPassword);
    if (passwordValidationError) {
      setNewPasswordError(passwordValidationError);
      toast.error(passwordValidationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      const mismatchMessage = "Confirm password does not match new password.";
      setConfirmPasswordError(mismatchMessage);
      toast.error(mismatchMessage);
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        email,
        otp,
        reset_token: resetToken,
        new_password: newPassword,
        confirm_password: confirmPassword,
      };

      await postToFirstAvailableEndpoint([
        "/api/auth/forgot-password/reset/",
        "/api/auth/password-reset/confirm/",
        "/api/auth/reset-password/",
      ], payload);

      toast.success("Password reset successful. Please login with your new password.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.response?.data?.error || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = () => {
    if (step === "email") return "Forgot Password";
    if (step === "otp") return "Verify OTP";
    return "Set New Password";
  };

  const getStepDescription = () => {
    if (step === "email") return "Enter your registered email to receive an OTP";
    if (step === "otp") return "Enter the OTP sent to your email address";
    return "Create a new password for your account";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side: Branding & Background */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#000080] overflow-hidden flex-col justify-between p-8 xl:p-12">
        {/* Background Image with Overlay */}
        <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
            style={{ backgroundImage: "url('/realistic-ai-bg.png')" }}
        />
        <div className="absolute inset-0 bg-[#000080]/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000080]/90 via-[#000080]/20 to-transparent" />
        
        {/* Top Left Logo */}
        <div className="relative z-10">
            <div className="inline-block bg-white p-3 md:p-4 rounded-xl shadow-xl transform hover:-translate-y-1 transition-transform duration-300">
                <img src="/Logo.png" alt="NxGen Tech Academy Logo" className="h-10 md:h-12 object-contain" />
            </div>
        </div>

        {/* Bottom Content */}
        <div className="relative z-10 flex flex-col text-white max-w-lg mb-8">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
                Secure Your Account
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed font-medium">
                Reset your password securely to regain access to your NxGen dashboard and continue your learning journey.
            </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
              <img src="/Logo.png" alt="NxGen Tech Academy Logo" className="h-16 object-contain" />
          </div>

          <Card className="w-full shadow-2xl border-0 border-t-4 border-t-[#000080] rounded-xl overflow-hidden">
            <CardHeader className="space-y-2 pb-6 bg-slate-50 border-b">
              <CardTitle className="text-3xl font-bold text-center text-[#000080]">{getStepTitle()}</CardTitle>
              <CardDescription className="text-center font-medium text-gray-500">{getStepDescription()}</CardDescription>
            </CardHeader>

            {step === "email" && (
              <form onSubmit={handleSendOtp}>
                <CardContent className="space-y-5 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-semibold text-gray-700">Registered Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 border-gray-300 focus:border-[#000080] focus:ring-[#000080] transition-colors"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 pb-8">
                  <Button type="submit" className="w-full h-12 bg-[#000080] hover:bg-blue-800 text-lg font-semibold transition-colors" disabled={isLoading}>
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                  <Link to="/login" className="text-sm font-medium text-[#000080] hover:text-blue-600 transition-colors">
                    Back to Login
                  </Link>
                </CardFooter>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleVerifyOtp}>
                <CardContent className="space-y-5 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="font-semibold text-gray-700">OTP</Label>
                    <Input
                      id="otp"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="h-12 border-gray-300 focus:border-[#000080] focus:ring-[#000080] transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-2">The OTP sent to your email is valid for 15 minutes.</p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 pb-8">
                  <Button type="submit" className="w-full h-12 bg-[#000080] hover:bg-blue-800 text-lg font-semibold transition-colors" disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>
                  <Button type="button" variant="outline" className="w-full h-12 font-semibold" onClick={() => setStep("email")}>
                    Change Email
                  </Button>
                </CardFooter>
              </form>
            )}

            {step === "reset" && (
              <form onSubmit={handleResetPassword}>
                <CardContent className="space-y-5 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="font-semibold text-gray-700">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (newPasswordError) setNewPasswordError("");
                        }}
                        required
                        className={`h-12 border-gray-300 focus:border-[#000080] focus:ring-[#000080] pr-10 transition-colors ${newPasswordError ? "border-red-500" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#000080] transition-colors"
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {newPasswordError && <p className="text-red-500 text-xs mt-1">{newPasswordError}</p>}
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      Password should have at least 8 characters, one capital letter, one special character, and no repeated consecutive characters.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="font-semibold text-gray-700">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (confirmPasswordError) setConfirmPasswordError("");
                        }}
                        required
                        className={`h-12 border-gray-300 focus:border-[#000080] focus:ring-[#000080] pr-10 transition-colors ${confirmPasswordError ? "border-red-500" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#000080] transition-colors"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {confirmPasswordError && <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 pb-8">
                  <Button type="submit" className="w-full h-12 bg-[#000080] hover:bg-blue-800 text-lg font-semibold transition-colors" disabled={isLoading}>
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </CardFooter>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
