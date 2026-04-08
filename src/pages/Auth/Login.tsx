import React, { useState, useEffect } from "react";
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

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        const storedFirstLogin = localStorage.getItem("is_first_login") === "true";
        if (storedRole) {
            redirectBasedOnRole(storedRole, storedFirstLogin);
        }
    }, [navigate]);

    const redirectBasedOnRole = (role: string, isFirstLogin: boolean = false) => {
        console.log("Redirecting...", { role, isFirstLogin });
        if (role === "instructor" && isFirstLogin) {
            navigate("/instructor/change-password");
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
    };

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
        } catch (error: any) {
            console.error("Login Error:", error);
            toast.error(error.response?.data?.error || error.response?.data?.message || "Login failed. Check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center py-12">
            <div className="container mx-auto px-4 flex justify-center">
                <Card className="w-full max-w-md shadow-lg border-t-4 border-t-[#000080]">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-3xl font-bold text-center text-[#000080]">Sign In</CardTitle>
                        <CardDescription className="text-center font-medium">
                            Access your NxGen Academy Dashboard
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username or Email</Label>
                                <Input
                                    id="username"
                                    placeholder="Enter your username or email"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="border-gray-300 focus:border-[#000080] focus:ring-[#000080]"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link to="/forgot-password" className="text-xs text-[#000080] hover:underline">Forgot password?</Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="border-gray-300 focus:border-[#000080] focus:ring-[#000080] pr-10"
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
                                <Label htmlFor="role">Login As</Label>
                                <Select onValueChange={(value) => setRole(value)} defaultValue={role}>
                                    <SelectTrigger className="border-gray-300 focus:border-[#000080]">
                                        <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="instructor">Instructor</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="blog">Blog Content</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button type="submit" className="w-full bg-[#000080] hover:bg-[#000060] text-lg py-6" disabled={isLoading}>
                                {isLoading ? "Logging in..." : "Login"}
                            </Button>
                            {/* <div className="text-sm text-center text-gray-500">
                                Don't have an account?{" "}
                                <Link to="/register" className="text-[#000080] font-semibold hover:underline">
                                    Register here
                                </Link>
                            </div> */}
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
