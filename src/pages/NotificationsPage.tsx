// import { useData } from '@/lib/data-context';
// import { useAuth } from '@/lib/auth-context';
// import { PageHeader } from '@/components/PageHeader';
// import { Bell, Check } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// export default function NotificationsPage() {
//   const { notifications, setNotifications } = useData();
//   const { user } = useAuth();

//   const filtered = notifications.filter(n => {
//     if (n.targetRole !== user?.role) return false;
//     if (n.targetUserId && n.targetUserId !== user?.id) return false;
//     return true;
//   });

//   const markRead = (id: string) => {
//     setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
//   };

//   return (
//     <div className="animate-fade-in">
//       <PageHeader title="Notifications" description={`${filtered.filter(n => !n.read).length} unread`} />
//       <div className="space-y-2">
//         {filtered.length === 0 ? (
//           <div className="text-center py-12 text-muted-foreground">
//             <Bell className="h-8 w-8 mx-auto mb-2 opacity-40" />
//             <p className="text-sm">No notifications</p>
//           </div>
//         ) : filtered.map(n => (
//           <div key={n.id} className={`flex items-start gap-3 p-4 border border-border rounded-lg ${n.read ? 'bg-card' : 'bg-cobalt/5 border-cobalt/20'}`}>
//             <Bell className={`h-4 w-4 mt-0.5 shrink-0 ${n.read ? 'text-muted-foreground' : 'text-cobalt'}`} />
//             <div className="flex-1 min-w-0">
//               <p className="text-sm">{n.message}</p>
//               <p className="text-xs text-muted-foreground font-mono mt-1">{n.date}</p>
//             </div>
//             {!n.read && (
//               <Button variant="ghost" size="sm" className="text-xs shrink-0" onClick={() => markRead(n.id)}>
//                 <Check className="h-3 w-3 mr-1" />Mark read
//               </Button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/PageHeader';
import { Bell, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://finance-vfm-backend.onrender.com/api';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/notifications`, getAuthHeaders());
      setNotifications(response.data.data.notifications);
      setUnreadCount(response.data.data.unreadCount);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      toast.error(error.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.post(`${API_URL}/notifications/${id}/read`, {}, getAuthHeaders());
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      toast.success('Marked as read');
    } catch (error: any) {
      console.error('Error marking as read:', error);
      toast.error(error.response?.data?.message || 'Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(`${API_URL}/notifications/mark-all-read`, {}, getAuthHeaders());
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error: any) {
      console.error('Error marking all as read:', error);
      toast.error(error.response?.data?.message || 'Failed to mark all as read');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/notifications/${id}`, getAuthHeaders());
      const deleted = notifications.find(n => n._id === id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      if (deleted && !deleted.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      toast.success('Notification deleted');
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      toast.error(error.response?.data?.message || 'Failed to delete notification');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-IN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cobalt"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Notifications" 
        description={`${unreadCount} unread`}
        actions={
          unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )
        }
      />
      
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card border border-border rounded-lg">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`flex items-start gap-3 p-4 border rounded-lg transition-colors ${
                notification.read 
                  ? 'bg-card border-border' 
                  : 'bg-cobalt/5 border-cobalt/20'
              }`}
            >
              <Bell className={`h-4 w-4 mt-0.5 shrink-0 ${
                notification.read ? 'text-muted-foreground' : 'text-cobalt'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  {formatDate(notification.createdAt)}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                {!notification.read && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-8"
                    onClick={() => markAsRead(notification._id)}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Read
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-8 text-destructive hover:text-destructive"
                  onClick={() => deleteNotification(notification._id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}