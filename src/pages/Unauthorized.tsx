// pages/Unauthorized.tsx
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Home, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";

export default function Unauthorized() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleGoHome = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'agent') {
      navigate('/agent');
    } else {
      navigate('/customer');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
          <ShieldAlert className="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
          Access Denied
        </h1>
        
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page. This area is restricted to authorized personnel only.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={handleGoHome}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Button>
          
          <Button 
            variant="outline" 
            onClick={logout}
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          If you believe this is a mistake, please contact your system administrator.
        </p>
      </motion.div>
    </div>
  );
}