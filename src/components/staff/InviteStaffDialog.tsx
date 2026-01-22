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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Shield, AlertCircle, Check } from 'lucide-react';
import { StaffRole, ROLE_LABELS, EmploymentType, EMPLOYMENT_LABELS } from '@/types/staff';
import { branches } from '@/data/staffMockData';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

interface InviteStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const inviteSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  roles: z.array(z.string()).min(1, 'Please select at least one role'),
  branch: z.string().min(1, 'Please select a branch'),
  employmentType: z.string().min(1, 'Please select employment type'),
});

export function InviteStaffDialog({ open, onOpenChange }: InviteStaffDialogProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<StaffRole[]>([]);
  const [branch, setBranch] = useState('');
  const [employmentType, setEmploymentType] = useState<EmploymentType | ''>('');
  const [inviteExpiry, setInviteExpiry] = useState('7');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

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

  const handleSubmit = async () => {
    setErrors({});
    
    const result = inviteSchema.safeParse({
      email,
      roles: selectedRoles,
      branch,
      employmentType,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setInviteSent(true);

    toast({
      title: 'Invite Sent Successfully',
      description: `An invitation has been sent to ${email}`,
    });
  };

  const handleClose = () => {
    setEmail('');
    setSelectedRoles([]);
    setBranch('');
    setEmploymentType('');
    setInviteExpiry('7');
    setErrors({});
    setInviteSent(false);
    onOpenChange(false);
  };

  if (inviteSent) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Invitation Sent!</h3>
            <p className="text-muted-foreground mb-4">
              A secure invitation has been sent to <strong>{email}</strong>
            </p>
            <div className="bg-muted rounded-lg p-4 text-sm text-left w-full space-y-2">
              <p><strong>What happens next:</strong></p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Staff member receives invitation email</li>
                <li>They click the secure link (expires in {inviteExpiry} days)</li>
                <li>They create their password and accept terms</li>
                <li>Account becomes active upon completion</li>
              </ol>
            </div>
            <Button onClick={handleClose} className="mt-6 w-full">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Invite New Staff Member
          </DialogTitle>
          <DialogDescription>
            Send a secure invitation email. The staff member will create their own password on first login.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="staff.member@brighthorizons.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Roles */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Assign Role(s) *
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {allRoles.map(role => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox
                    id={role}
                    checked={selectedRoles.includes(role)}
                    onCheckedChange={() => toggleRole(role)}
                  />
                  <Label htmlFor={role} className="text-sm font-normal cursor-pointer">
                    {ROLE_LABELS[role]}
                  </Label>
                </div>
              ))}
            </div>
            {errors.roles && (
              <p className="text-xs text-destructive">{errors.roles}</p>
            )}
          </div>

          {/* Branch & Employment Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assigned Branch *</Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger className={errors.branch ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(b => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.branch && (
                <p className="text-xs text-destructive">{errors.branch}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Employment Type *</Label>
              <Select value={employmentType} onValueChange={(v) => setEmploymentType(v as EmploymentType)}>
                <SelectTrigger className={errors.employmentType ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(EMPLOYMENT_LABELS) as EmploymentType[]).map(type => (
                    <SelectItem key={type} value={type}>{EMPLOYMENT_LABELS[type]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employmentType && (
                <p className="text-xs text-destructive">{errors.employmentType}</p>
              )}
            </div>
          </div>

          {/* Invite Expiry */}
          <div className="space-y-2">
            <Label>Invite Link Expires In</Label>
            <Select value={inviteExpiry} onValueChange={setInviteExpiry}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="3">3 days</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Security Notice */}
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription className="text-sm">
              <strong>Security:</strong> The staff member will be required to create their own password and accept HIPAA privacy terms before gaining access.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Invitation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
