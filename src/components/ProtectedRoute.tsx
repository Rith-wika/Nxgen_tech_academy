import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const location = useLocation();
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role")?.toLowerCase();
    const isFirstLogin = localStorage.getItem("is_first_login") === "true";

    if (!token) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role || "")) {
        // Redirect to unauthorized page or home if role not allowed
        toast.error("You do not have permission to access this page.");
        return <Navigate to="/" replace />;
    }

    // Force password change for first-time instructor login
    if (role === "instructor" && isFirstLogin && !location.pathname.includes("change-password")) {
        console.log("Redirecting instructor to change-password (First Login)");
        return <Navigate to="/instructor/change-password" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
