import React from 'react';
import { Route, Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    element: JSX.Element;
    allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, allowedRoles }) => {
    const role = sessionStorage.getItem('role');

    if (allowedRoles.includes(role ?? '')) {
        return <>{element}</>;
    }

    return <Navigate to="/" replace />;
};


export default PrivateRoute;