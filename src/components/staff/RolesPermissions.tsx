import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Shield, Save, Info } from 'lucide-react';
import { 
  StaffRole, 
  ROLE_LABELS, 
  ROLE_COLORS, 
  ALL_PERMISSIONS, 
  Permission,
  RolePermissions 
} from '@/types/staff';
import { defaultRolePermissions } from '@/data/staffMockData';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function RolesPermissions() {
  const { toast } = useToast();
  const [rolePermissions, setRolePermissions] = useState<RolePermissions[]>(defaultRolePermissions);
  const [hasChanges, setHasChanges] = useState(false);

  const allRoles: StaffRole[] = [
    'admin_owner',
    'cdc_manager',
    'senior_therapist',
    'therapist',
    'receptionist',
    'finance_billing',
    'branch_coordinator',
    'visiting_temp',
  ];

  const permissionsByCategory = ALL_PERMISSIONS.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  const categoryLabels: Record<string, string> = {
    appointments: 'Appointments',
    children: 'Children Data',
    analytics: 'Analytics',
    staff: 'Staff Management',
    site: 'Site Management',
    data: 'Data & Exports',
  };

  const hasPermission = (role: StaffRole, permissionId: string): boolean => {
    const roleConfig = rolePermissions.find(rp => rp.role === role);
    return roleConfig?.permissions.includes(permissionId) || false;
  };

  const togglePermission = (role: StaffRole, permissionId: string) => {
    // Admin Owner always has all permissions - can't be modified
    if (role === 'admin_owner') return;

    setRolePermissions(prev => prev.map(rp => {
      if (rp.role !== role) return rp;
      
      const hasIt = rp.permissions.includes(permissionId);
      return {
        ...rp,
        permissions: hasIt 
          ? rp.permissions.filter(p => p !== permissionId)
          : [...rp.permissions, permissionId]
      };
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    toast({
      title: 'Permissions Updated',
      description: 'Role permissions have been saved successfully.',
    });
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="w-4 h-4" />
        <AlertDescription>
          Configure what each role can access. Admin (Owner) has full access and cannot be modified.
          Changes are logged for audit purposes.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Role Permissions Matrix
            </CardTitle>
            <CardDescription>
              Define granular permissions for each staff role
            </CardDescription>
          </div>
          {hasChanges && (
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full" defaultValue={['appointments', 'site']}>
            {Object.entries(permissionsByCategory).map(([category, permissions]) => (
              <AccordionItem key={category} value={category}>
                <AccordionTrigger className="text-sm font-medium">
                  {categoryLabels[category]}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-medium w-[200px]">Permission</th>
                          {allRoles.map(role => (
                            <th key={role} className="text-center py-3 px-2 min-w-[100px]">
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${ROLE_COLORS[role]} whitespace-nowrap`}
                              >
                                {ROLE_LABELS[role].split('/')[0]}
                              </Badge>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {permissions.map(permission => (
                          <tr key={permission.id} className="border-b last:border-0">
                            <td className="py-3 px-2">
                              <div>
                                <p className="font-medium">{permission.name}</p>
                                <p className="text-xs text-muted-foreground">{permission.description}</p>
                              </div>
                            </td>
                            {allRoles.map(role => (
                              <td key={role} className="text-center py-3 px-2">
                                <Checkbox
                                  checked={hasPermission(role, permission.id)}
                                  onCheckedChange={() => togglePermission(role, permission.id)}
                                  disabled={role === 'admin_owner'}
                                  className={role === 'admin_owner' ? 'opacity-50' : ''}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Role Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Descriptions</CardTitle>
          <CardDescription>Overview of each role's intended responsibilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {allRoles.map(role => (
              <div key={role} className="p-4 border rounded-lg">
                <Badge className={`${ROLE_COLORS[role]} mb-2`}>
                  {ROLE_LABELS[role]}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {getRoleDescription(role)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getRoleDescription(role: StaffRole): string {
  const descriptions: Record<StaffRole, string> = {
    admin_owner: 'Full system access including staff management, site publishing, and all administrative functions. Cannot be restricted.',
    cdc_manager: 'Manages daily operations, staff schedules, and has editing access to site content. Cannot publish without approval.',
    senior_therapist: 'Lead therapist with access to appointments, child data, analytics, and site editing capabilities.',
    therapist: 'Standard therapist access to appointments and relevant child information for care delivery.',
    receptionist: 'Front desk operations including appointment scheduling and basic administrative tasks.',
    finance_billing: 'Financial operations, billing access, analytics viewing, and data export capabilities.',
    branch_coordinator: 'Branch-level operations management with access to appointments, child data, and analytics.',
    visiting_temp: 'Limited access for temporary or visiting staff with read-only permissions for essential functions.',
  };
  return descriptions[role];
}
