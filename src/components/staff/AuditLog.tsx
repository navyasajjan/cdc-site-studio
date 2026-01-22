import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Search, 
  Download, 
  LogIn, 
  LogOut, 
  UserPlus, 
  UserMinus, 
  Shield, 
  FileEdit, 
  Globe, 
  Settings,
  AlertTriangle,
  KeyRound,
  RotateCcw
} from 'lucide-react';
import { mockAuditLogs } from '@/data/staffMockData';
import { AuditLogEntry, AuditAction } from '@/types/staff';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const ACTION_ICONS: Record<AuditAction, React.ElementType> = {
  login: LogIn,
  logout: LogOut,
  login_failed: AlertTriangle,
  user_created: UserPlus,
  user_updated: FileEdit,
  user_suspended: UserMinus,
  user_revoked: UserMinus,
  role_assigned: Shield,
  role_removed: Shield,
  permission_changed: Shield,
  password_reset_requested: KeyRound,
  password_changed: KeyRound,
  site_published: Globe,
  site_edited: FileEdit,
  site_rollback: RotateCcw,
  settings_changed: Settings,
};

const ACTION_LABELS: Record<AuditAction, string> = {
  login: 'Login',
  logout: 'Logout',
  login_failed: 'Login Failed',
  user_created: 'User Created',
  user_updated: 'User Updated',
  user_suspended: 'User Suspended',
  user_revoked: 'Access Revoked',
  role_assigned: 'Role Assigned',
  role_removed: 'Role Removed',
  permission_changed: 'Permission Changed',
  password_reset_requested: 'Password Reset Requested',
  password_changed: 'Password Changed',
  site_published: 'Site Published',
  site_edited: 'Site Edited',
  site_rollback: 'Site Rollback',
  settings_changed: 'Settings Changed',
};

const ACTION_COLORS: Record<AuditAction, string> = {
  login: 'bg-success/10 text-success border-success/20',
  logout: 'bg-muted text-muted-foreground',
  login_failed: 'bg-destructive/10 text-destructive border-destructive/20',
  user_created: 'bg-info/10 text-info border-info/20',
  user_updated: 'bg-info/10 text-info border-info/20',
  user_suspended: 'bg-warning/10 text-warning border-warning/20',
  user_revoked: 'bg-destructive/10 text-destructive border-destructive/20',
  role_assigned: 'bg-primary/10 text-primary border-primary/20',
  role_removed: 'bg-warning/10 text-warning border-warning/20',
  permission_changed: 'bg-primary/10 text-primary border-primary/20',
  password_reset_requested: 'bg-warning/10 text-warning border-warning/20',
  password_changed: 'bg-success/10 text-success border-success/20',
  site_published: 'bg-success/10 text-success border-success/20',
  site_edited: 'bg-info/10 text-info border-info/20',
  site_rollback: 'bg-warning/10 text-warning border-warning/20',
  settings_changed: 'bg-muted text-muted-foreground',
};

export function AuditLog() {
  const { toast } = useToast();
  const [logs] = useState<AuditLogEntry[]>(mockAuditLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [targetFilter, setTargetFilter] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesTarget = targetFilter === 'all' || log.targetType === targetFilter;
    return matchesSearch && matchesAction && matchesTarget;
  });

  const handleExport = () => {
    // In a real app, this would generate and download a CSV/JSON
    toast({
      title: 'Export Started',
      description: 'Your audit log export will be ready shortly.',
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Audit Log</CardTitle>
          <CardDescription>
            Complete record of all system activities for compliance and security
          </CardDescription>
        </div>
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by user, target, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="login">Logins</SelectItem>
              <SelectItem value="login_failed">Failed Logins</SelectItem>
              <SelectItem value="user_created">User Created</SelectItem>
              <SelectItem value="user_suspended">User Suspended</SelectItem>
              <SelectItem value="role_assigned">Role Changes</SelectItem>
              <SelectItem value="site_published">Site Published</SelectItem>
              <SelectItem value="site_edited">Site Edited</SelectItem>
              <SelectItem value="settings_changed">Settings Changed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={targetFilter} onValueChange={setTargetFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="user">Users</SelectItem>
              <SelectItem value="role">Roles</SelectItem>
              <SelectItem value="site">Site</SelectItem>
              <SelectItem value="session">Sessions</SelectItem>
              <SelectItem value="settings">Settings</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Log Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead className="max-w-[300px]">Details</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map(log => {
                const Icon = ACTION_ICONS[log.action];
                return (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                    </TableCell>
                    <TableCell className="font-medium text-sm">{log.userName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`gap-1 ${ACTION_COLORS[log.action]}`}>
                        <Icon className="w-3 h-3" />
                        {ACTION_LABELS[log.action]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{log.targetName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">
                      {log.details}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">
                      {log.ipAddress}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No audit logs found matching your criteria
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground">
              {logs.filter(l => l.action === 'login').length}
            </p>
            <p className="text-sm text-muted-foreground">Successful Logins</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-destructive">
              {logs.filter(l => l.action === 'login_failed').length}
            </p>
            <p className="text-sm text-muted-foreground">Failed Logins</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground">
              {logs.filter(l => l.action.startsWith('user_') || l.action.startsWith('role_')).length}
            </p>
            <p className="text-sm text-muted-foreground">User/Role Changes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground">
              {logs.filter(l => l.action.startsWith('site_')).length}
            </p>
            <p className="text-sm text-muted-foreground">Site Changes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
