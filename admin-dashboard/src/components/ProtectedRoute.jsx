import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
        // Redirtect to login if no token is found
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
