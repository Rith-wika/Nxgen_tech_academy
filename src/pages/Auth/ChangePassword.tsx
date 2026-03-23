import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { instructorService } from "@/services/instructorService";
import { Eye, EyeOff, Lock, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [passwords, setPasswords] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const validate = () => {
        let isValid = true;
        const newErrs = { newPassword: "", confirmPassword: "" };

        if (passwords.newPassword.length < 8) {
            newErrs.newPassword = "Password must be at least 8 characters long";
            isValid = false;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            newErrs.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        setErrors(newErrs);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await instructorService.changePassword({ password: passwords.newPassword });
            toast.success("Password changed successfully!");

            // Mark as no longer first login in local storage if needed
            localStorage.setItem("is_first_login", "false");

            navigate("/instructor/dashboard");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md"
            >
                <div className="flex justify-center mb-8">
                    <div className="bg-[#000080] p-3 rounded-2xl shadow-lg shadow-blue-200">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                </div>

                <Card className="border-none shadow-xl">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-2xl font-bold text-gray-800">Change Password</CardTitle>
                        <CardDescription>
                            This is your first login. For security reasons, you must change your password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className={`pr-10 ${errors.newPassword ? 'border-red-500' : ''}`}
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.newPassword && <p className="text-red-500 text-xs">{errors.newPassword}</p>}
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <CheckCircle2 className={`w-3 h-3 ${passwords.newPassword.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                                    Minimum 8 characters
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={errors.confirmPassword ? 'border-red-500' : ''}
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#000080] hover:bg-[#000060] h-12 text-lg font-semibold transition-all hover:translate-y-[-2px]"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Set New Password"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="mt-8 text-center text-gray-500 text-sm">
                    Protected by NxGen Security Protocol
                </p>
            </motion.div>
        </div>
    );
};

export default ChangePassword;
