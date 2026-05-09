import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useAuth } from '@/lib/auth-context';

export default function DashboardLayout() {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border px-4 bg-card shrink-0">
            <SidebarTrigger className="mr-3" />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {user?.role === 'admin' ? 'Finance Admin' : user?.role === 'customer' ? 'Customer Portal' : 'Agent Portal'}
            </span>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1680px] w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
