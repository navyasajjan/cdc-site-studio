import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StaffMember, StaffRole, ROLE_LABELS, EmploymentType, EMPLOYMENT_LABELS } from '@/types/staff';
import { branches } from '@/data/staffMockData';

interface EditStaffDialogProps {
  staff: StaffMember;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (staff: StaffMember) => void;
}

export function EditStaffDialog({ staff, open, onOpenChange, onSave }: EditStaffDialogProps) {
  const [fullName, setFullName] = useState(staff.fullName);
  const [selectedRoles, setSelectedRoles] = useState<StaffRole[]>(staff.roles);
  const [branch, setBranch] = useState(staff.assignedBranch);
  const [employmentType, setEmploymentType] = useState<EmploymentType>(staff.employmentType);

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

  const toggleRole = (role: StaffRole) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleSave = () => {
    onSave({
      ...staff,
      fullName,
      roles: selectedRoles,
      assignedBranch: branch,
      employmentType,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Staff Profile</DialogTitle>
          <DialogDescription>
            Update {staff.fullName}'s profile information and roles.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input value={staff.email} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

          {/* Roles */}
          <div className="space-y-2">
            <Label>Assigned Role(s)</Label>
            <div className="grid grid-cols-2 gap-2">
              {allRoles.map(role => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-${role}`}
                    checked={selectedRoles.includes(role)}
                    onCheckedChange={() => toggleRole(role)}
                  />
                  <Label htmlFor={`edit-${role}`} className="text-sm font-normal cursor-pointer">
                    {ROLE_LABELS[role]}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Branch & Employment Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assigned Branch</Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(b => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Employment Type</Label>
              <Select value={employmentType} onValueChange={(v) => setEmploymentType(v as EmploymentType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(EMPLOYMENT_LABELS) as EmploymentType[]).map(type => (
                    <SelectItem key={type} value={type}>{EMPLOYMENT_LABELS[type]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={selectedRoles.length === 0 || !fullName.trim()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
