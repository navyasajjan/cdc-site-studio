import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { currentUser } from '@/data/mockData';
import {
  LayoutDashboard,
  Palette,
  Briefcase,
  Users,
  Image,
  Calendar,
  Star,
  DollarSign,
  BookOpen,
  Search,
  Eye,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  HelpCircle,
  UsersRound,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Overview', icon: LayoutDashboard, href: '/' },
  { label: 'Site Editor', icon: Palette, href: '/editor' },
  { label: 'Services', icon: Briefcase, href: '/services' },
  { label: 'Therapists', icon: Users, href: '/therapists' },
  { label: 'Gallery & Facilities', icon: Image, href: '/gallery' },
  { label: 'Booking Display', icon: Calendar, href: '/booking' },
  { label: 'Reviews', icon: Star, href: '/reviews' },
  { label: 'Pricing', icon: DollarSign, href: '/pricing' },
  { label: 'Learning Hub', icon: BookOpen, href: '/learning' },
  { label: 'SEO & Visibility', icon: Search, href: '/seo' },
  { label: 'Preview & Publish', icon: Eye, href: '/publish' },
  { label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { label: 'Staff Management', icon: UsersRound, href: '/staff' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'cdc_admin': return 'bg-primary text-primary-foreground';
      case 'cdc_editor': return 'bg-info text-info-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'cdc_admin': return 'Admin';
      case 'cdc_editor': return 'Editor';
      case 'practitioner': return 'Practitioner';
      case 'receptionist': return 'Receptionist';
      default: return role;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out',
          collapsed ? 'w-[72px]' : 'w-[260px]'
        )}
      >
        {/* Logo */}
        <div className={cn(
          'flex items-center h-16 px-4 border-b border-sidebar-border',
          collapsed ? 'justify-center' : 'gap-3'
        )}>
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">BH</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold text-sidebar-foreground truncate text-sm">
                Bright Horizons
              </h1>
              <p className="text-xs text-muted-foreground truncate">CDC Admin</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          'nav-item',
                          isActive && 'nav-item-active',
                          collapsed && 'justify-center px-2'
                        )}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </Link>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right" className="font-medium">
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-20 -right-3 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center shadow-soft hover:bg-muted transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>

        {/* User Profile */}
        <div className={cn(
          'border-t border-sidebar-border p-3',
          collapsed && 'flex justify-center'
        )}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                'flex items-center gap-3 w-full rounded-lg p-2 hover:bg-sidebar-accent transition-colors',
                collapsed && 'justify-center p-2'
              )}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {currentUser.name}
                    </p>
                    <Badge className={cn('text-[10px] px-1.5 py-0', getRoleBadgeColor(currentUser.role))}>
                      {getRoleLabel(currentUser.role)}
                    </Badge>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{currentUser.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">{currentUser.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-foreground">
              {navItems.find(item => item.href === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <NotificationPanel />
            <Button variant="ghost" size="icon">
              <HelpCircle className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
