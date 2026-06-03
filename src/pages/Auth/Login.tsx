import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const redirectBasedOnRole = useCallback((role: string, isFirstLogin: boolean = false) => {
        console.log("Redirecting...", { role, isFirstLogin });
        if (isFirstLogin && (role === "instructor" || role === "student")) {
            navigate(`/${role}/change-password`);
            return;
        }

        switch (role) {
            case "admin":
                navigate("/admin/dashboard");
                break;
            case "instructor":
                navigate("/instructor/dashboard");
                break;
            case "student":
                navigate("/student/dashboard");
                break;
            case "blog_admin":
                navigate("/blog-admin/dashboard");
                break;
            default:
                navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        const storedFirstLogin = localStorage.getItem("is_first_login") === "true";
        if (storedRole) {
            redirectBasedOnRole(storedRole, storedFirstLogin);
        }
    }, [redirectBasedOnRole]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const loginPayload = {
                username_or_email: username,
                password,
                role: role,
            };
            const responseData = (await axiosInstance.post("/api/auth/login/", loginPayload)).data;

            const userRole = (responseData.role || role).toLowerCase();

            // Handle various possible response field names for first login (boolean, string, or number)
            // Checking both top-level and nested user object
            const data = responseData;
            const isFirstLogin =
                data.is_first_login === true ||
                data.is_first_login === "true" ||
                data.is_first_login === 1 ||
                data.first_login === true ||
                data.first_login === "true" ||
                data.first_login === 1 ||
                data.user?.is_first_login === true ||
                data.user?.is_first_login === "true" ||
                data.user?.is_first_login === 1 ||
                data.user?.first_login === true ||
                data.user?.first_login === "true" ||
                data.user?.first_login === 1 ||
                false;

            // Store tokens and user info
            localStorage.setItem("access_token", responseData.access);
            localStorage.setItem("refresh_token", responseData.refresh);
            localStorage.setItem("user_id", responseData.user_id);
            localStorage.setItem("username", responseData.username);
            const normalizedRole = userRole === "blog" ? "blog_admin" : userRole;
            localStorage.setItem("role", normalizedRole);
            localStorage.setItem("is_first_login", String(isFirstLogin));

            toast.success("Login successful! Welcome back.");
            redirectBasedOnRole(normalizedRole, isFirstLogin);
        } catch (error: unknown) {
            console.error("Login Error:", error);
            const message =
                typeof error === "object" &&
                    error !== null &&
                    "response" in error &&
                    typeof (error as { response?: { data?: { error?: string; message?: string } } }).response?.data?.error === "string"
                    ? (error as { response?: { data?: { error?: string; message?: string } } }).response?.data?.error
                    : typeof error === "object" &&
                        error !== null &&
                        "response" in error &&
                        typeof (error as { response?: { data?: { error?: string; message?: string } } }).response?.data?.message === "string"
                        ? (error as { response?: { data?: { error?: string; message?: string } } }).response?.data?.message
                        : "Login failed. Check your credentials.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
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
                        Shape Your Future with <br /> <span className="text-blue-300">NxGen Academy</span>
                    </h1>
                    <p className="text-lg text-blue-100 leading-relaxed font-medium">
                        Access premium courses, expert mentorship, and industry-recognized certifications to accelerate your tech career in AI and beyond.
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
                            <CardTitle className="text-3xl font-bold text-center text-[#000080]">Welcome Back</CardTitle>
                            <CardDescription className="text-center font-medium text-gray-500">
                                Sign in to your NxGen Dashboard
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleLogin}>
                            <CardContent className="space-y-5 pt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="font-semibold text-gray-700">Username or Email</Label>
                                    <Input
                                        id="username"
                                        placeholder="Enter your username or email"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="h-12 border-gray-300 focus:border-[#000080] focus:ring-[#000080] transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="font-semibold text-gray-700">Password</Label>
                                        <Link to="/forgot-password" className="text-sm font-medium text-[#000080] hover:text-blue-600 transition-colors">Forgot password?</Link>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="h-12 border-gray-300 focus:border-[#000080] focus:ring-[#000080] pr-10 transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#000080] transition-colors"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role" className="font-semibold text-gray-700">Login As</Label>
                                    <Select onValueChange={(value) => setRole(value)} defaultValue={role}>
                                        <SelectTrigger className="h-12 border-gray-300 focus:border-[#000080]">
                                            <SelectValue placeholder="Select your role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="student">Student</SelectItem>
                                            <SelectItem value="instructor">Instructor</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="blog_admin">Blog Content</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-4 pb-8">
                                <Button type="submit" className="w-full h-12 bg-[#000080] hover:bg-blue-800 text-lg font-semibold transition-colors" disabled={isLoading}>
                                    {isLoading ? "Authenticating..." : "Sign In"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Login;
