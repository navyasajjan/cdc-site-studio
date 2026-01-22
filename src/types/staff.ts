// Staff Management Types

export type StaffRole = 
  | 'admin_owner'
  | 'cdc_manager'
  | 'senior_therapist'
  | 'therapist'
  | 'receptionist'
  | 'finance_billing'
  | 'branch_coordinator'
  | 'visiting_temp';

export type AccountStatus = 'active' | 'pending_invite' | 'suspended' | 'revoked';

export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'visiting';

export interface StaffMember {
  id: string;
  fullName: string;
  email: string;
  phone: string; // Masked for display
  roles: StaffRole[];
  assignedBranch: string;
  employmentType: EmploymentType;
  accountStatus: AccountStatus;
  createdAt: string;
  lastLogin: string | null;
  inviteSentAt: string | null;
  inviteExpiresAt: string | null;
  avatar?: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'appointments' | 'children' | 'analytics' | 'staff' | 'site' | 'data';
}

export interface RolePermissions {
  role: StaffRole;
  permissions: string[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: AuditAction;
  targetType: 'user' | 'site' | 'settings' | 'role' | 'session';
  targetId: string;
  targetName: string;
  details: string;
  ipAddress: string;
}

export type AuditAction = 
  | 'login'
  | 'logout'
  | 'login_failed'
  | 'user_created'
  | 'user_updated'
  | 'user_suspended'
  | 'user_revoked'
  | 'role_assigned'
  | 'role_removed'
  | 'permission_changed'
  | 'password_reset_requested'
  | 'password_changed'
  | 'site_published'
  | 'site_edited'
  | 'site_rollback'
  | 'settings_changed';

export const ROLE_LABELS: Record<StaffRole, string> = {
  admin_owner: 'Admin (Owner)',
  cdc_manager: 'CDC Manager',
  senior_therapist: 'Senior Therapist',
  therapist: 'Therapist/Practitioner',
  receptionist: 'Receptionist',
  finance_billing: 'Finance/Billing',
  branch_coordinator: 'Branch Coordinator',
  visiting_temp: 'Visiting/Temporary Staff',
};

export const ROLE_COLORS: Record<StaffRole, string> = {
  admin_owner: 'bg-primary text-primary-foreground',
  cdc_manager: 'bg-info text-info-foreground',
  senior_therapist: 'bg-success text-success-foreground',
  therapist: 'bg-accent text-accent-foreground',
  receptionist: 'bg-secondary text-secondary-foreground',
  finance_billing: 'bg-warning text-warning-foreground',
  branch_coordinator: 'bg-muted text-muted-foreground',
  visiting_temp: 'bg-muted text-muted-foreground',
};

export const STATUS_LABELS: Record<AccountStatus, string> = {
  active: 'Active',
  pending_invite: 'Pending Invite',
  suspended: 'Suspended',
  revoked: 'Revoked',
};

export const STATUS_COLORS: Record<AccountStatus, string> = {
  active: 'bg-success/10 text-success border-success/20',
  pending_invite: 'bg-warning/10 text-warning border-warning/20',
  suspended: 'bg-destructive/10 text-destructive border-destructive/20',
  revoked: 'bg-muted text-muted-foreground border-muted',
};

export const EMPLOYMENT_LABELS: Record<EmploymentType, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  visiting: 'Visiting',
};

export const ALL_PERMISSIONS: Permission[] = [
  { id: 'view_appointments', name: 'View Appointments', description: 'View appointment schedules', category: 'appointments' },
  { id: 'edit_appointments', name: 'Edit Appointments', description: 'Create, modify, and cancel appointments', category: 'appointments' },
  { id: 'view_children', name: 'View Child Data (Limited)', description: 'View basic child information', category: 'children' },
  { id: 'edit_children', name: 'Edit Child Data', description: 'Modify child records', category: 'children' },
  { id: 'view_analytics', name: 'View Analytics', description: 'Access marketing analytics dashboard', category: 'analytics' },
  { id: 'export_data', name: 'Export Data', description: 'Download reports and data exports', category: 'data' },
  { id: 'manage_staff', name: 'Manage Staff', description: 'Add, edit, and remove staff members', category: 'staff' },
  { id: 'manage_roles', name: 'Manage Roles & Permissions', description: 'Assign roles and configure permissions', category: 'staff' },
  { id: 'edit_site', name: 'Edit Site Content', description: 'Modify website content in the editor', category: 'site' },
  { id: 'publish_site', name: 'Publish Site', description: 'Publish changes to the live website', category: 'site' },
  { id: 'rollback_site', name: 'Rollback Site', description: 'Restore previous site versions', category: 'site' },
];
