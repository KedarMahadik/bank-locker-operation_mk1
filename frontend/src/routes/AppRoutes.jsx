import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Typography } from '@mui/material';
import ProtectedRoute from './ProtectedRoute';

// --- Import All Page Components ---

// Guest Pages
import HomePage from '../pages/guest/HomePage';

// Authentication Pages
import RegisterFlow from '../pages/auth/RegisterFlow';
import LoginPage from '../pages/auth/LoginPage';
import AccountSetupPage from '../pages/auth/AccountSetupPage';
import PaymentPage from '../pages/auth/PaymentPage';

// User Dashboard Pages & Layout
import UserDashboardLayout from '../pages/user/UserDashboardLayout';
import MyLockersPage from '../pages/user/MyLockersPage';
import ApplyForLockerPage from '../pages/user/ApplyForLockerPage';
import NomineePage from '../pages/user/NomineePage';
import SettingsPage from '../pages/user/SettingsPage';

// Admin Dashboard Pages & Layout
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboardLayout from '../pages/admin/AdminDashboardLayout';
import PendingRequestsPage from '../pages/admin/PendingRequestsPage';
import ApplicationReviewPage from '../pages/admin/ApplicationReviewPage';

// Locker Access Flow
import LockerAccessFlow from '../pages/locker/LockerAccessFlow';

/**
 * Defines all routes for the application, including public, protected,
 * and nested dashboard routes, making the entire app navigable.
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* --- Public Routes (Accessible to Everyone) --- */}
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterFlow />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/payment" element={<PaymentPage />} />


      {/* --- Standalone Protected Routes --- */}
      <Route 
        path="/account/setup" 
        element={<ProtectedRoute><AccountSetupPage /></ProtectedRoute>} 
      />
      <Route 
        path="/locker-access" 
        element={<ProtectedRoute><LockerAccessFlow /></ProtectedRoute>} 
      />


      {/* --- Nested User Dashboard Routes --- */}
      {/* The UserDashboardLayout provides the shell with the sidebar.
          The child routes are rendered inside its <Outlet /> component. */}
      <Route 
        path="/user" 
        element={<ProtectedRoute><UserDashboardLayout /></ProtectedRoute>}
      >
        <Route index element={<MyLockersPage />} /> 
        <Route path="apply" element={<ApplyForLockerPage />} />
        <Route path="nominees" element={<NomineePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>


      {/* --- Nested Admin Dashboard Routes --- */}
      {/* This route is protected and requires an admin role. */}
      <Route 
        path="/admin" 
        element={<ProtectedRoute adminOnly={true}><AdminDashboardLayout /></ProtectedRoute>}
      >
        <Route index element={<PendingRequestsPage />} />
        <Route path="review/:userId" element={<ApplicationReviewPage />} />
      </Route>

      {/* --- Fallback Route for unmatched URLs --- */}
      <Route 
        path="*" 
        element={
          <Typography variant="h4" align="center" sx={{mt: 4}}>
            404: Page Not Found
          </Typography>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;