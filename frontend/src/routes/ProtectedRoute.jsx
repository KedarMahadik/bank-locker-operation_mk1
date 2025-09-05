import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/common/Spinner';

/**
 * A component that acts as a gatekeeper for routes, ensuring only authenticated
 * (and optionally, authorized) users can access them.
 *
 * @param {{children: React.ReactNode, adminOnly?: boolean}} props
 * @returns {React.ReactNode} The protected component or a redirect.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  // 1. Show a loading spinner while the AuthContext is checking for a session.
  // This prevents a "flash" of the protected content before the user is redirected.
  if (loading) {
    return <Spinner />;
  }

  // 2. If loading is finished and there is no user, redirect to the login page.
  // We save the page they were trying to access in the 'state' so we can
  // redirect them back there after a successful login.
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // 3. If the route requires admin privileges and the user is not an admin,
  // redirect them to a safe default page (like their dashboard).
  if (adminOnly && !isAdmin) {
    return <Navigate to="/user/dashboard" replace />;
  }

  // 4. If all checks pass, render the requested component.
  return children;
};

export default ProtectedRoute;