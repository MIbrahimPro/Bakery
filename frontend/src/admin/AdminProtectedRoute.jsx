import React from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "../AdminContext";

const AdminProtectedRoute = ({ children }) => {
    const { isAdmin, checked } = useAdmin();
    if (!checked) return null; // or a loading spinner
    if (!isAdmin) return <Navigate to="/" replace />;
    return children;
};

export default AdminProtectedRoute;
