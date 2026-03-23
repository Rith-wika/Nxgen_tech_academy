import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        if (storedRole) {
            redirectBasedOnRole(storedRole);
        }
    }, [navigate]);

    const redirectBasedOnRole = (role: string, isFirstLogin: boolean = false) => {
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
            const response = await axiosInstance.post("/api/login/", {
                username: username,
                password,
                role: role,
            });

            console.log("Login Response:", response.data);

            const userRole = response.data.role || role;
            const isFirstLogin = response.data.is_first_login || false;

            // Store tokens and user info
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            localStorage.setItem("user_id", response.data.user_id);
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("role", userRole);
            localStorage.setItem("is_first_login", String(isFirstLogin));

            toast.success("Login successful! Welcome back.");
            redirectBasedOnRole(userRole, isFirstLogin);
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
                                    <Link to="#" className="text-xs text-[#000080] hover:underline">Forgot password?</Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="border-gray-300 focus:border-[#000080] focus:ring-[#000080]"
                                />
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
                            <div className="text-sm text-center text-gray-500">
                                Don't have an account?{" "}
                                <Link to="/register" className="text-[#000080] font-semibold hover:underline">
                                    Register here
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
