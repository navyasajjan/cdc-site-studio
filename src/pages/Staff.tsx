import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StaffList } from '@/components/staff/StaffList';
import { InviteStaffDialog } from '@/components/staff/InviteStaffDialog';
import { RolesPermissions } from '@/components/staff/RolesPermissions';
import { AuditLog } from '@/components/staff/AuditLog';
import { Button } from '@/components/ui/button';
import { UserPlus, Users, Shield, FileText } from 'lucide-react';

export default function Staff() {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your team, roles, permissions, and access controls
          </p>
        </div>
        <Button onClick={() => setInviteDialogOpen(true)} className="gap-2">
          <UserPlus className="w-4 h-4" />
          Invite Staff
        </Button>
      </div>

      <Tabs defaultValue="staff" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="staff" className="gap-2">
            <Users className="w-4 h-4" />
            Staff Directory
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="w-4 h-4" />
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <FileText className="w-4 h-4" />
            Audit Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-4">
          <StaffList />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <RolesPermissions />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <AuditLog />
        </TabsContent>
      </Tabs>

      <InviteStaffDialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} />
    </div>
  );
}
