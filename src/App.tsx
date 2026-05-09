// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";

// import { AuthProvider } from "@/lib/auth-context";
// import { DataProvider } from "@/lib/data-context";

// // import AppRoutes from "./AppRoutes"; // 👈 recommended separation
// import AppRoutes from "./AppRoutes";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner richColors position="top-right" />

//       <AuthProvider>
//         <DataProvider>
//           <AppRoutes />
//         </DataProvider>
//       </AuthProvider>

//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { DataProvider } from "@/lib/data-context";
import { ProtectedRoute } from "./components/ProtectedRoute"
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/DashboardLayout";
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
import Unauthorized from "./pages/Unauthorized"
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Loading component
function AppLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return <AppLoading />;
  }

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // If authenticated, show protected routes
  return (
    <Routes>
      {/* Root redirect based on role */}
      <Route 
        path="/" 
        element={
          <Navigate 
            to={
              user?.role === 'admin' 
                ? '/admin' 
                : user?.role === 'agent' 
                ? '/agent' 
                : '/customer'
            } 
            replace 
          />
        } 
      />

      {/* Public route (but redirects if authenticated) */}
      <Route path="/login" element={<Navigate to="/" replace />} />

      {/* Protected Routes with DashboardLayout */}
      <Route element={<DashboardLayout />}>
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/vehicles"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <VehicleManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CustomerManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sell"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SellingModule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/emis"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EMITracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/agents"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AgentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        {/* Customer Routes */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/loans"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerLoans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/notifications"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        {/* Agent Routes */}
        <Route
          path="/agent"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <AgentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/collections"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <AgentCollections />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/notifications"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Unauthorized page */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner richColors position="top-right" />
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;