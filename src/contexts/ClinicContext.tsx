import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import {
  patients as seedPatients,
  sessions as seedSessions,
  sessionNotes as seedNotes,
  availabilityBlocks as seedBlocks,
  activityLogs as seedLogs,
  currentTherapistId,
  type Patient,
  type ClinicSession,
  type SessionNote,
  type AvailabilityBlock,
  type ActivityLogEntry,
  type SessionStatus,
} from '@/data/clinicMockData';
import { toast } from '@/hooks/use-toast';

interface ClinicState {
  currentTherapistId: string;
  patients: Patient[];
  sessions: ClinicSession[];
  notes: SessionNote[];
  blocks: AvailabilityBlock[];
  logs: ActivityLogEntry[];
  // mutations
  updateSessionStatus: (id: string, status: SessionStatus) => void;
  addNote: (childId: string, content: string, sessionId?: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  addBlock: (start: string, end: string, reason: string) => { ok: boolean; error?: string };
  removeBlock: (id: string) => void;
  addSession: (s: Omit<ClinicSession, 'id'>) => void;
}

const ClinicContext = createContext<ClinicState | null>(null);
const LS_KEY = 'clinicState.v1';

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [patients] = useState<Patient[]>(seedPatients);
  const [sessions, setSessions] = useState<ClinicSession[]>(seedSessions);
  const [notes, setNotes] = useState<SessionNote[]>(seedNotes);
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>(seedBlocks);
  const [logs, setLogs] = useState<ActivityLogEntry[]>(seedLogs);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.sessions) setSessions(s.sessions);
        if (s.notes) setNotes(s.notes);
        if (s.blocks) setBlocks(s.blocks);
        if (s.logs) setLogs(s.logs);
      }
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({ sessions, notes, blocks, logs }));
  }, [sessions, notes, blocks, logs]);

  const log = (entry: Omit<ActivityLogEntry, 'id' | 'timestamp' | 'therapistId'>) => {
    setLogs(prev => [
      { id: `log-${Date.now()}`, therapistId: currentTherapistId, timestamp: new Date().toISOString(), ...entry },
      ...prev,
    ]);
  };

  const updateSessionStatus: ClinicState['updateSessionStatus'] = (id, status) => {
    setSessions(prev => prev.map(s => (s.id === id ? { ...s, status } : s)));
    const s = sessions.find(x => x.id === id);
    log({ type: 'session', action: `Marked session ${status}`, detail: s ? `${s.childId}` : id });
    toast({ title: 'Session updated', description: `Status set to ${status}.` });
  };

  const addNote: ClinicState['addNote'] = (childId, content, sessionId) => {
    const n: SessionNote = {
      id: `note-${Date.now()}`,
      childId, therapistId: currentTherapistId, sessionId, content,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [n, ...prev]);
    log({ type: 'note', action: 'Added session note', detail: childId });
    toast({ title: 'Note added', description: `Saved to ${childId}.` });
  };

  const updateNote: ClinicState['updateNote'] = (id, content) => {
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, content, updatedAt: new Date().toISOString() } : n)));
    const n = notes.find(x => x.id === id);
    log({ type: 'note', action: 'Updated session note', detail: n?.childId });
  };

  const deleteNote: ClinicState['deleteNote'] = (id) => {
    const n = notes.find(x => x.id === id);
    setNotes(prev => prev.filter(x => x.id !== id));
    log({ type: 'note', action: 'Deleted session note', detail: n?.childId });
  };

  const addBlock: ClinicState['addBlock'] = (start, end, reason) => {
    const startDate = new Date(start);
    const minLead = new Date();
    minLead.setHours(minLead.getHours() + 24); // require 24h lead-time
    if (startDate < minLead) {
      return { ok: false, error: 'Blocks must be at least 24 hours in advance.' };
    }
    // Check overlap with active scheduled/ongoing sessions
    const overlap = sessions.some(s => {
      if (s.therapistId !== currentTherapistId) return false;
      if (s.status === 'cancelled' || s.status === 'completed' || s.status === 'no-show') return false;
      return new Date(s.start) < new Date(end) && new Date(s.end) > startDate;
    });
    if (overlap) {
      return { ok: false, error: 'This range overlaps an active session. Please reschedule first.' };
    }
    const block: AvailabilityBlock = {
      id: `block-${Date.now()}`, therapistId: currentTherapistId,
      start, end, reason, createdAt: new Date().toISOString(),
    };
    setBlocks(prev => [block, ...prev]);
    log({ type: 'availability', action: 'Blocked availability', detail: reason });
    toast({ title: 'Availability blocked', description: reason });
    return { ok: true };
  };

  const removeBlock: ClinicState['removeBlock'] = (id) => {
    const b = blocks.find(x => x.id === id);
    setBlocks(prev => prev.filter(x => x.id !== id));
    log({ type: 'availability', action: 'Removed availability block', detail: b?.reason });
  };

  const addSession: ClinicState['addSession'] = (s) => {
    const session: ClinicSession = { id: `sess-${Date.now()}`, ...s };
    setSessions(prev => [...prev, session]);
    log({ type: 'session', action: 'Created session', detail: s.childId });
    toast({ title: 'Session booked', description: `${s.childId}` });
  };

  const value = useMemo<ClinicState>(() => ({
    currentTherapistId, patients, sessions, notes, blocks, logs,
    updateSessionStatus, addNote, updateNote, deleteNote, addBlock, removeBlock, addSession,
  }), [patients, sessions, notes, blocks, logs]);

  return <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>;
}

export function useClinic() {
  const ctx = useContext(ClinicContext);
  if (!ctx) throw new Error('useClinic must be used inside ClinicProvider');
  return ctx;
}
