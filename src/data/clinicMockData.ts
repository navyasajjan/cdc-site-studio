// Mock clinic data: patients, sessions, notes, availability, activity logs
// HIPAA-safe — uses anonymized Child IDs and synthetic names only.

export type SessionStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled' | 'no-show';

export interface Patient {
  id: string;            // Child ID (anonymized)
  displayName: string;   // First name + last initial only
  age: number;
  gender: 'M' | 'F' | 'X';
  assignedTherapistId: string;
  joinedDate: string;
  parentContact: string; // masked
  diagnosisTags: string[]; // generic tags only (no detailed PHI)
}

export interface SessionNote {
  id: string;
  childId: string;
  therapistId: string;
  sessionId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicSession {
  id: string;
  childId: string;
  therapistId: string;
  serviceId: string;
  start: string; // ISO
  end: string;   // ISO
  status: SessionStatus;
  room?: string;
  notes?: string;
}

export interface AvailabilityBlock {
  id: string;
  therapistId: string;
  start: string;
  end: string;
  reason: string;
  createdAt: string;
}

export interface ActivityLogEntry {
  id: string;
  therapistId: string;
  type: 'availability' | 'session' | 'note' | 'profile' | 'auth';
  action: string;
  detail?: string;
  timestamp: string;
}

const now = new Date();
const iso = (d: Date) => d.toISOString();
const at = (hOffset: number, durationMin = 45) => {
  const s = new Date(now);
  s.setMinutes(0, 0, 0);
  s.setHours(s.getHours() + hOffset);
  const e = new Date(s.getTime() + durationMin * 60000);
  return { start: iso(s), end: iso(e) };
};
const daysFromNow = (days: number, hour: number, durationMin = 45) => {
  const s = new Date(now);
  s.setDate(s.getDate() + days);
  s.setHours(hour, 0, 0, 0);
  const e = new Date(s.getTime() + durationMin * 60000);
  return { start: iso(s), end: iso(e) };
};

// Current therapist context for the dashboard (assume therapist-1)
export const currentTherapistId = 'therapist-1';

export const patients: Patient[] = [
  { id: 'CHD-1042', displayName: 'Liam K.',   age: 5, gender: 'M', assignedTherapistId: 'therapist-1', joinedDate: '2024-03-10', parentContact: '+1 (555) ***-2210', diagnosisTags: ['Speech delay'] },
  { id: 'CHD-1098', displayName: 'Ava P.',    age: 4, gender: 'F', assignedTherapistId: 'therapist-1', joinedDate: '2024-05-22', parentContact: '+1 (555) ***-7783', diagnosisTags: ['Articulation'] },
  { id: 'CHD-1133', displayName: 'Noah B.',   age: 7, gender: 'M', assignedTherapistId: 'therapist-1', joinedDate: '2023-11-04', parentContact: '+1 (555) ***-1199', diagnosisTags: ['Language'] },
  { id: 'CHD-1187', displayName: 'Mia R.',    age: 3, gender: 'F', assignedTherapistId: 'therapist-2', joinedDate: '2024-01-18', parentContact: '+1 (555) ***-4422', diagnosisTags: ['Sensory'] },
  { id: 'CHD-1212', displayName: 'Ethan S.',  age: 6, gender: 'M', assignedTherapistId: 'therapist-2', joinedDate: '2024-02-09', parentContact: '+1 (555) ***-5051', diagnosisTags: ['Motor skills'] },
  { id: 'CHD-1245', displayName: 'Sophia L.', age: 8, gender: 'F', assignedTherapistId: 'therapist-4', joinedDate: '2023-09-15', parentContact: '+1 (555) ***-8810', diagnosisTags: ['Behavioral'] },
];

export const sessions: ClinicSession[] = [
  // Today — ongoing
  { id: 'sess-1', childId: 'CHD-1042', therapistId: 'therapist-1', serviceId: 'service-1', ...at(0), status: 'ongoing', room: 'Room A' },
  // Today — upcoming
  { id: 'sess-2', childId: 'CHD-1098', therapistId: 'therapist-1', serviceId: 'service-1', ...at(2), status: 'scheduled', room: 'Room A' },
  { id: 'sess-3', childId: 'CHD-1133', therapistId: 'therapist-1', serviceId: 'service-4', ...at(4), status: 'scheduled', room: 'Room B' },
  // Today — completed earlier
  { id: 'sess-4', childId: 'CHD-1042', therapistId: 'therapist-1', serviceId: 'service-1', ...at(-3), status: 'completed', room: 'Room A' },
  { id: 'sess-5', childId: 'CHD-1098', therapistId: 'therapist-1', serviceId: 'service-1', ...at(-5), status: 'completed', room: 'Room A' },
  // Tomorrow
  { id: 'sess-6', childId: 'CHD-1042', therapistId: 'therapist-1', serviceId: 'service-1', ...daysFromNow(1, 10), status: 'scheduled' },
  { id: 'sess-7', childId: 'CHD-1133', therapistId: 'therapist-1', serviceId: 'service-4', ...daysFromNow(1, 11), status: 'scheduled' },
  // Day after — potential conflict
  { id: 'sess-8', childId: 'CHD-1098', therapistId: 'therapist-1', serviceId: 'service-1', ...daysFromNow(2, 9), status: 'scheduled' },
  { id: 'sess-9', childId: 'CHD-1133', therapistId: 'therapist-1', serviceId: 'service-4', ...daysFromNow(2, 9, 60), status: 'scheduled' },
  // Past week — for analytics
  { id: 'sess-10', childId: 'CHD-1042', therapistId: 'therapist-1', serviceId: 'service-1', ...daysFromNow(-1, 10), status: 'completed' },
  { id: 'sess-11', childId: 'CHD-1098', therapistId: 'therapist-1', serviceId: 'service-1', ...daysFromNow(-2, 11), status: 'completed' },
  { id: 'sess-12', childId: 'CHD-1133', therapistId: 'therapist-1', serviceId: 'service-4', ...daysFromNow(-3, 14), status: 'no-show' },
  { id: 'sess-13', childId: 'CHD-1042', therapistId: 'therapist-1', serviceId: 'service-1', ...daysFromNow(-4, 9), status: 'completed' },
  { id: 'sess-14', childId: 'CHD-1098', therapistId: 'therapist-1', serviceId: 'service-1', ...daysFromNow(-5, 15), status: 'cancelled' },
  { id: 'sess-15', childId: 'CHD-1133', therapistId: 'therapist-1', serviceId: 'service-4', ...daysFromNow(-6, 10), status: 'completed' },
  // Other therapists (so admin views have variety)
  { id: 'sess-16', childId: 'CHD-1187', therapistId: 'therapist-2', serviceId: 'service-2', ...at(1), status: 'scheduled' },
  { id: 'sess-17', childId: 'CHD-1212', therapistId: 'therapist-2', serviceId: 'service-2', ...at(3), status: 'scheduled' },
  { id: 'sess-18', childId: 'CHD-1245', therapistId: 'therapist-4', serviceId: 'service-3', ...at(2), status: 'scheduled' },
];

export const sessionNotes: SessionNote[] = [
  { id: 'note-1', childId: 'CHD-1042', therapistId: 'therapist-1', sessionId: 'sess-4', content: 'Continued articulation drills (/s/ and /sh/). Improved clarity in structured tasks. Plan: introduce sentence-level practice next session.', createdAt: iso(new Date(now.getTime() - 3 * 3600 * 1000)), updatedAt: iso(new Date(now.getTime() - 3 * 3600 * 1000)) },
  { id: 'note-2', childId: 'CHD-1098', therapistId: 'therapist-1', sessionId: 'sess-5', content: 'Worked on receptive language tasks. Engaged well; recommend caregiver follow-through with picture cards at home.', createdAt: iso(new Date(now.getTime() - 5 * 3600 * 1000)), updatedAt: iso(new Date(now.getTime() - 5 * 3600 * 1000)) },
  { id: 'note-3', childId: 'CHD-1133', therapistId: 'therapist-1', sessionId: 'sess-15', content: 'Vocabulary expansion using thematic categories. Strong recall today. Family briefed on weekly goals.', createdAt: iso(new Date(now.getTime() - 6 * 86400 * 1000)), updatedAt: iso(new Date(now.getTime() - 6 * 86400 * 1000)) },
];

export const availabilityBlocks: AvailabilityBlock[] = [
  { id: 'block-1', therapistId: 'therapist-1', start: iso(new Date(new Date().setDate(now.getDate() + 5))), end: iso(new Date(new Date().setDate(now.getDate() + 5))), reason: 'Continuing education', createdAt: iso(new Date(now.getTime() - 2 * 86400 * 1000)) },
];

export const activityLogs: ActivityLogEntry[] = [
  { id: 'log-1', therapistId: 'therapist-1', type: 'session', action: 'Marked session completed', detail: 'CHD-1042 · 09:00', timestamp: iso(new Date(now.getTime() - 3 * 3600 * 1000)) },
  { id: 'log-2', therapistId: 'therapist-1', type: 'note',    action: 'Added session note',       detail: 'CHD-1098',         timestamp: iso(new Date(now.getTime() - 5 * 3600 * 1000)) },
  { id: 'log-3', therapistId: 'therapist-1', type: 'availability', action: 'Blocked availability', detail: 'Continuing education · +5d', timestamp: iso(new Date(now.getTime() - 2 * 86400 * 1000)) },
  { id: 'log-4', therapistId: 'therapist-1', type: 'profile', action: 'Updated phone number',     timestamp: iso(new Date(now.getTime() - 7 * 86400 * 1000)) },
  { id: 'log-5', therapistId: 'therapist-1', type: 'auth',    action: 'Signed in',                timestamp: iso(new Date(now.getTime() - 8 * 3600 * 1000)) },
];

export const feedback = {
  averageRating: 4.8,
  totalReviews: 36,
  recent: [
    { id: 'fb-1', rating: 5, comment: 'Patient and attentive — our child loves sessions.', date: '2026-04-22' },
    { id: 'fb-2', rating: 5, comment: 'Clear progress reports every week.', date: '2026-04-09' },
    { id: 'fb-3', rating: 4, comment: 'Great experience overall.', date: '2026-03-28' },
  ],
};
