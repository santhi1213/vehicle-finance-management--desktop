import { useAuth } from '@/lib/auth-context';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';
import { Car, LayoutDashboard, Truck, Users, ShoppingCart, Receipt, UserCheck, LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const adminNav = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Vehicles', url: '/admin/vehicles', icon: Truck },
  { title: 'Customers', url: '/admin/customers', icon: Users },
  { title: 'New Sale', url: '/admin/sell', icon: ShoppingCart },
  { title: 'EMI Tracking', url: '/admin/emis', icon: Receipt },
  { title: 'Agents', url: '/admin/agents', icon: UserCheck },
  // { title: 'Notifications', url: '/admin/notifications', icon: Bell },
];

const customerNav = [
  { title: 'Dashboard', url: '/customer', icon: LayoutDashboard },
  { title: 'My Loans', url: '/customer/loans', icon: Receipt },
  { title: 'Notifications', url: '/customer/notifications', icon: Bell },
];

const agentNav = [
  { title: 'Dashboard', url: '/agent', icon: LayoutDashboard },
  { title: 'Collections', url: '/agent/collections', icon: Receipt },
  { title: 'Notifications', url: '/agent/notifications', icon: Bell },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();

  if (!user) return null;

  const navItems = user.role === 'admin' ? adminNav : user.role === 'customer' ? customerNav : agentNav;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5 text-cobalt shrink-0" />
          {!collapsed && <span className="font-bold text-sm tracking-tight">VFM</span>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-[10px] uppercase tracking-widest">Navigation</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/admin' || item.url === '/customer' || item.url === '/agent'}
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-cobalt font-medium"
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3 border-t border-sidebar-border">
        {!collapsed && (
          <div className="mb-2 px-1">
            <p className="text-xs font-medium truncate">{user.name}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{user.role}</p>
          </div>
        )}
        <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-muted-foreground" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2 shrink-0" />
          {!collapsed && 'Sign out'}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
