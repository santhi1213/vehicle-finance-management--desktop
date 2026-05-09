import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

import DashboardLayout from "./components/DashboardLayout";
// import ProtectedRoute from "./components/ProtectedRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VehicleManagement from "./pages/admin/VehicleManagement";
import CustomerManagement from "./pages/admin/CustomerManagement";
import SellingModule from "./pages/admin/SellingModule";
import EMITracking from "./pages/admin/EMITracking";
import AgentManagement from "./pages/admin/AgentManagement";

import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerLoans from "./pages/customer/CustomerLoans";

import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentCollections from "./pages/agent/AgentCollections";

import NotificationsPage from "./pages/NotificationsPage";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

function AppRoutes() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={
          <Navigate
            to={
              user?.role === "admin"
                ? "/admin"
                : user?.role === "agent"
                ? "/agent"
                : "/customer"
            }
            replace
          />
        }
      />

      <Route path="/login" element={<Navigate to="/" replace />} />

      <Route element={<DashboardLayout />}>

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/vehicles"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <VehicleManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CustomerManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sell"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SellingModule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/emis"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EMITracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/agents"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AgentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        {/* CUSTOMER */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/loans"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerLoans />
            </ProtectedRoute>
          }
        />

        {/* AGENT */}
        <Route
          path="/agent"
          element={
            <ProtectedRoute allowedRoles={["agent"]}>
              <AgentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/collections"
          element={
            <ProtectedRoute allowedRoles={["agent"]}>
              <AgentCollections />
            </ProtectedRoute>
          }
        />

      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;