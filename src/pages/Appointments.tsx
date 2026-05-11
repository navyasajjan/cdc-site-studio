import { useMemo, useState } from 'react';
import { format, parseISO, isToday, isFuture } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useClinic } from '@/contexts/ClinicContext';
import { therapists, services } from '@/data/mockData';

const statusStyles: Record<string, string> = {
  scheduled: 'bg-info/10 text-info border-info/20',
  ongoing: 'bg-warning/10 text-warning border-warning/20',
  completed: 'bg-success/10 text-success border-success/20',
  cancelled: 'bg-muted text-muted-foreground border-border',
  'no-show': 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function AppointmentsPage() {
  const { sessions, patients, addSession, updateSessionStatus } = useClinic();
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming'>('all');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return [...sessions]
      .filter(s => filter === 'all' || (filter === 'today' ? isToday(parseISO(s.start)) : isFuture(parseISO(s.start))))
      .sort((a, b) => a.start.localeCompare(b.start));
  }, [sessions, filter]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-muted-foreground text-sm">Manage all therapy session bookings</p>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="w-4 h-4" />New Appointment</Button>
            </DialogTrigger>
            <NewAppointmentDialog onDone={() => setOpen(false)} />
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Child</TableHead>
                <TableHead>Therapist</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(s => {
                const t = therapists.find(x => x.id === s.therapistId);
                const svc = services.find(x => x.id === s.serviceId);
                const p = patients.find(x => x.id === s.childId);
                return (
                  <TableRow key={s.id}>
                    <TableCell className="whitespace-nowrap">
                      <div className="text-sm font-medium">{format(parseISO(s.start), 'MMM d, yyyy')}</div>
                      <div className="text-xs text-muted-foreground">{format(parseISO(s.start), 'h:mm a')}</div>
                    </TableCell>
                    <TableCell><div className="text-sm font-medium">{s.childId}</div><div className="text-xs text-muted-foreground">{p?.displayName}</div></TableCell>
                    <TableCell className="text-sm">{t?.name}</TableCell>
                    <TableCell className="text-sm">{svc?.name}</TableCell>
                    <TableCell><Badge variant="outline" className={statusStyles[s.status]}>{s.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => updateSessionStatus(s.id, 'cancelled')}>Cancel</Button>
                      <Button size="sm" variant="ghost" onClick={() => updateSessionStatus(s.id, 'completed')}>Complete</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No appointments.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function NewAppointmentDialog({ onDone }: { onDone: () => void }) {
  const { patients, addSession } = useClinic();
  const [childId, setChildId] = useState('');
  const [therapistId, setTherapistId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [start, setStart] = useState('');
  const [duration, setDuration] = useState(45);

  const submit = () => {
    if (!childId || !therapistId || !serviceId || !start) return;
    const startISO = new Date(start).toISOString();
    const endISO = new Date(new Date(start).getTime() + duration * 60000).toISOString();
    addSession({ childId, therapistId, serviceId, start: startISO, end: endISO, status: 'scheduled' });
    onDone();
  };

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>New Appointment</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div className="space-y-2"><Label>Child</Label>
          <Select value={childId} onValueChange={setChildId}><SelectTrigger><SelectValue placeholder="Select child" /></SelectTrigger>
            <SelectContent>{patients.map(p => <SelectItem key={p.id} value={p.id}>{p.id} · {p.displayName}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Therapist</Label>
          <Select value={therapistId} onValueChange={setTherapistId}><SelectTrigger><SelectValue placeholder="Select therapist" /></SelectTrigger>
            <SelectContent>{therapists.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Service</Label>
          <Select value={serviceId} onValueChange={setServiceId}><SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
            <SelectContent>{services.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2"><Label>Start</Label><Input type="datetime-local" value={start} onChange={e => setStart(e.target.value)} /></div>
          <div className="space-y-2"><Label>Duration (min)</Label><Input type="number" min={15} step={15} value={duration} onChange={e => setDuration(Number(e.target.value))} /></div>
        </div>
      </div>
      <DialogFooter><Button onClick={submit}>Book</Button></DialogFooter>
    </DialogContent>
  );
}
