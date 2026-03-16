import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const location = useLocation();
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role || "")) {
        // Redirect to unauthorized page or home if role not allowed
        toast.error("You do not have permission to access this page.");
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;

import { toast } from "sonner";
