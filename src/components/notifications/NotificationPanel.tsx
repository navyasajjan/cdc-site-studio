import { useState } from 'react';
import { Bell, Check, CheckCheck, Clock, MessageSquare, Settings, Trash2, UserPlus, X, AlertTriangle, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Notification {
  id: string;
  type: 'message' | 'alert' | 'update' | 'reminder' | 'user';
  title: string;
  description: string;
  time: string;
  read: boolean;
  avatar?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'message',
    title: 'New review submitted',
    description: 'A parent left a 5-star review for Dr. Sarah Johnson.',
    time: '2 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'alert',
    title: 'Site published successfully',
    description: 'Your microsite changes are now live.',
    time: '15 min ago',
    read: false,
  },
  {
    id: '3',
    type: 'user',
    title: 'New therapist added',
    description: 'Dr. Emily Chen has been added to your team.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '4',
    type: 'reminder',
    title: 'Content review due',
    description: 'Your quarterly content review is due in 2 days.',
    time: '3 hours ago',
    read: true,
  },
  {
    id: '5',
    type: 'update',
    title: 'Analytics report ready',
    description: 'Your weekly analytics report is now available.',
    time: '1 day ago',
    read: true,
  },
  {
    id: '6',
    type: 'message',
    title: 'Booking inquiry received',
    description: 'New booking inquiry for Speech Therapy session.',
    time: '2 days ago',
    read: true,
  },
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'message':
      return MessageSquare;
    case 'alert':
      return AlertTriangle;
    case 'update':
      return FileText;
    case 'reminder':
      return Calendar;
    case 'user':
      return UserPlus;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'message':
      return 'bg-info/10 text-info';
    case 'alert':
      return 'bg-success/10 text-success';
    case 'update':
      return 'bg-primary/10 text-primary';
    case 'reminder':
      return 'bg-warning/10 text-warning';
    case 'user':
      return 'bg-accent/10 text-accent';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

function NotificationItem({ 
  notification, 
  onMarkRead, 
  onDelete 
}: { 
  notification: Notification; 
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const Icon = getNotificationIcon(notification.type);
  const colorClass = getNotificationColor(notification.type);

  return (
    <div
      className={cn(
        'group flex gap-3 p-3 hover:bg-muted/50 transition-colors border-b border-border last:border-0',
        !notification.read && 'bg-primary/5'
      )}
    >
      <div className={cn('w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0', colorClass)}>
        <Icon className="w-4 h-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn(
            'text-sm truncate',
            !notification.read ? 'font-semibold text-foreground' : 'font-medium text-foreground'
          )}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
          {notification.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {notification.time}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!notification.read && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => onMarkRead(notification.id)}
              >
                <Check className="w-3 h-3" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(notification.id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[380px] p-0 shadow-elevated" 
        align="end" 
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs px-1.5">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs gap-1"
                onClick={handleMarkAllRead}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-10 px-4">
            <TabsTrigger 
              value="all" 
              className="text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2.5"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="unread" 
              className="text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2.5"
            >
              Unread ({unreadCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <ScrollArea className="h-[360px]">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkRead={handleMarkRead}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <EmptyState />
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="unread" className="mt-0">
            <ScrollArea className="h-[360px]">
              {unreadNotifications.length > 0 ? (
                unreadNotifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkRead={handleMarkRead}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <EmptyState message="All caught up!" subMessage="No unread notifications" />
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/30">
            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-destructive" onClick={handleClearAll}>
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Clear all
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function EmptyState({ message = 'No notifications', subMessage = "You're all caught up!" }: { message?: string; subMessage?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <Bell className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="font-medium text-foreground">{message}</p>
      <p className="text-sm text-muted-foreground">{subMessage}</p>
    </div>
  );
}
