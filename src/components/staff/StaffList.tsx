import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, MoreHorizontal, Mail, KeyRound, UserX, UserCheck, Edit, RefreshCw } from 'lucide-react';
import { mockStaffMembers, branches } from '@/data/staffMockData';
import { StaffMember, ROLE_LABELS, ROLE_COLORS, STATUS_LABELS, STATUS_COLORS, EMPLOYMENT_LABELS } from '@/types/staff';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { EditStaffDialog } from './EditStaffDialog';

export function StaffList() {
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>(mockStaffMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [confirmAction, setConfirmAction] = useState<{ type: 'suspend' | 'revoke' | 'reactivate' | 'resend'; staff: StaffMember } | null>(null);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.accountStatus === statusFilter;
    const matchesBranch = branchFilter === 'all' || member.assignedBranch === branchFilter;
    return matchesSearch && matchesStatus && matchesBranch;
  });

  const handleAction = (action: 'suspend' | 'revoke' | 'reactivate' | 'resend', member: StaffMember) => {
    setConfirmAction({ type: action, staff: member });
  };

  const executeAction = () => {
    if (!confirmAction) return;

    const { type, staff: member } = confirmAction;
    
    setStaff(prev => prev.map(s => {
      if (s.id !== member.id) return s;
      
      switch (type) {
        case 'suspend':
          return { ...s, accountStatus: 'suspended' as const };
        case 'revoke':
          return { ...s, accountStatus: 'revoked' as const };
        case 'reactivate':
          return { ...s, accountStatus: 'active' as const };
        case 'resend':
          return { 
            ...s, 
            inviteSentAt: new Date().toISOString(),
            inviteExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          };
        default:
          return s;
      }
    }));

    const actionMessages = {
      suspend: `${member.fullName} has been suspended`,
      revoke: `${member.fullName}'s access has been revoked`,
      reactivate: `${member.fullName} has been reactivated`,
      resend: `Invite resent to ${member.email}`,
    };

    toast({
      title: 'Action Completed',
      description: actionMessages[type],
    });

    setConfirmAction(null);
  };

  const handleForcePasswordReset = (member: StaffMember) => {
    toast({
      title: 'Password Reset Initiated',
      description: `A password reset email has been sent to ${member.email}`,
    });
  };

  const handleUpdateStaff = (updatedMember: StaffMember) => {
    setStaff(prev => prev.map(s => s.id === updatedMember.id ? updatedMember : s));
    setEditingStaff(null);
    toast({
      title: 'Staff Updated',
      description: `${updatedMember.fullName}'s profile has been updated`,
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Staff Directory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending_invite">Pending Invite</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map(branch => (
                  <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Staff Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Role(s)</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Employment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map(member => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {member.fullName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{member.fullName}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {member.roles.map(role => (
                          <Badge key={role} variant="secondary" className={`text-xs ${ROLE_COLORS[role]}`}>
                            {ROLE_LABELS[role]}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{member.assignedBranch}</TableCell>
                    <TableCell className="text-sm">{EMPLOYMENT_LABELS[member.employmentType]}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${STATUS_COLORS[member.accountStatus]}`}>
                        {STATUS_LABELS[member.accountStatus]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {member.lastLogin ? format(new Date(member.lastLogin), 'MMM d, yyyy HH:mm') : 'Never'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setEditingStaff(member)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                          </DropdownMenuItem>
                          {member.accountStatus === 'pending_invite' && (
                            <DropdownMenuItem onClick={() => handleAction('resend', member)}>
                              <Mail className="w-4 h-4 mr-2" />
                              Resend Invite
                            </DropdownMenuItem>
                          )}
                          {member.accountStatus === 'active' && (
                            <DropdownMenuItem onClick={() => handleForcePasswordReset(member)}>
                              <KeyRound className="w-4 h-4 mr-2" />
                              Force Password Reset
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {member.accountStatus === 'active' && (
                            <DropdownMenuItem 
                              onClick={() => handleAction('suspend', member)}
                              className="text-warning"
                            >
                              <UserX className="w-4 h-4 mr-2" />
                              Suspend Access
                            </DropdownMenuItem>
                          )}
                          {member.accountStatus === 'suspended' && (
                            <DropdownMenuItem 
                              onClick={() => handleAction('reactivate', member)}
                              className="text-success"
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Reactivate
                            </DropdownMenuItem>
                          )}
                          {member.accountStatus !== 'revoked' && (
                            <DropdownMenuItem 
                              onClick={() => handleAction('revoke', member)}
                              className="text-destructive"
                            >
                              <UserX className="w-4 h-4 mr-2" />
                              Revoke Access
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredStaff.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No staff members found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.type === 'suspend' && 'Suspend Staff Access'}
              {confirmAction?.type === 'revoke' && 'Revoke Staff Access'}
              {confirmAction?.type === 'reactivate' && 'Reactivate Staff Access'}
              {confirmAction?.type === 'resend' && 'Resend Invite'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === 'suspend' && (
                <>Are you sure you want to suspend <strong>{confirmAction.staff.fullName}</strong>? They will lose access to the system until reactivated.</>
              )}
              {confirmAction?.type === 'revoke' && (
                <>Are you sure you want to permanently revoke access for <strong>{confirmAction.staff.fullName}</strong>? This action cannot be undone.</>
              )}
              {confirmAction?.type === 'reactivate' && (
                <>Reactivate access for <strong>{confirmAction.staff.fullName}</strong>? They will regain their previous permissions.</>
              )}
              {confirmAction?.type === 'resend' && (
                <>Resend invite email to <strong>{confirmAction.staff.email}</strong>? The previous invite link will be invalidated.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeAction}
              className={confirmAction?.type === 'revoke' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {confirmAction?.type === 'suspend' && 'Suspend'}
              {confirmAction?.type === 'revoke' && 'Revoke'}
              {confirmAction?.type === 'reactivate' && 'Reactivate'}
              {confirmAction?.type === 'resend' && 'Resend'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Staff Dialog */}
      {editingStaff && (
        <EditStaffDialog
          staff={editingStaff}
          open={!!editingStaff}
          onOpenChange={(open) => !open && setEditingStaff(null)}
          onSave={handleUpdateStaff}
        />
      )}
    </>
  );
}
