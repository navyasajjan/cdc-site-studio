import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, isToday, isFuture, isPast, parseISO, startOfDay, endOfDay, differenceInMinutes, addDays, isSameDay } from 'date-fns';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Activity, AlarmClock, BarChart3, Bell, Calendar as CalendarIcon, CheckCircle2, ChevronRight,
  Clock, FileText, KeyRound, LogOut, NotebookPen, PlayCircle, Search, Settings as SettingsIcon,
  ShieldAlert, Star, UserCircle, XCircle,
} from 'lucide-react';
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip as RTooltip, LineChart, Line, CartesianGrid,
} from 'recharts';
import { useClinic } from '@/contexts/ClinicContext';
import { therapists, services } from '@/data/mockData';
import { feedback } from '@/data/clinicMockData';
import { toast } from '@/hooks/use-toast';

const statusStyles: Record<string, string> = {
  scheduled: 'bg-info/10 text-info border-info/20',
  ongoing:   'bg-warning/10 text-warning border-warning/20',
  completed: 'bg-success/10 text-success border-success/20',
  cancelled: 'bg-muted text-muted-foreground border-border',
  'no-show': 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function TherapistDashboard() {
  const { sessions, patients, notes, blocks, logs, currentTherapistId, updateSessionStatus, addNote, addBlock, removeBlock } = useClinic();
  const therapist = therapists.find(t => t.id === currentTherapistId)!;
  const my = useMemo(() => sessions.filter(s => s.therapistId === currentTherapistId), [sessions, currentTherapistId]);

  const today = my.filter(s => isToday(parseISO(s.start)));
  const ongoing = my.filter(s => s.status === 'ongoing');
  const upcoming = my.filter(s => s.status === 'scheduled' && isFuture(parseISO(s.start)));
  const completed = my.filter(s => s.status === 'completed');

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-14 h-14">
            <AvatarImage src={therapist.photo} alt={therapist.name} />
            <AvatarFallback>{therapist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{therapist.name}</h1>
            <p className="text-sm text-muted-foreground">{therapist.specialization} · {therapist.experience}</p>
          </div>
        </div>
        <NotificationsBell />
      </div>

      {/* Day-wise quick overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon={CalendarIcon} label="Today" value={today.length} hint={`${today.filter(s => s.status === 'completed').length} done`} />
        <StatCard icon={PlayCircle} label="Ongoing" value={ongoing.length} hint="Active now" tone="warning" />
        <StatCard icon={AlarmClock} label="Upcoming" value={upcoming.length} hint="Scheduled" tone="info" />
        <StatCard icon={CheckCircle2} label="Completed" value={completed.length} hint="All time" tone="success" />
      </div>

      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="schedule"><CalendarIcon className="w-4 h-4 mr-1.5" />Schedule</TabsTrigger>
          <TabsTrigger value="sessions"><Clock className="w-4 h-4 mr-1.5" />Sessions</TabsTrigger>
          <TabsTrigger value="notes"><NotebookPen className="w-4 h-4 mr-1.5" />Notes</TabsTrigger>
          <TabsTrigger value="availability"><ShieldAlert className="w-4 h-4 mr-1.5" />Availability</TabsTrigger>
          <TabsTrigger value="performance"><BarChart3 className="w-4 h-4 mr-1.5" />Performance</TabsTrigger>
          <TabsTrigger value="logs"><Activity className="w-4 h-4 mr-1.5" />Activity Logs</TabsTrigger>
          <TabsTrigger value="profile"><UserCircle className="w-4 h-4 mr-1.5" />Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule"><ScheduleTab /></TabsContent>
        <TabsContent value="sessions"><SessionsTab /></TabsContent>
        <TabsContent value="notes"><NotesTab /></TabsContent>
        <TabsContent value="availability"><AvailabilityTab /></TabsContent>
        <TabsContent value="performance"><PerformanceTab /></TabsContent>
        <TabsContent value="logs"><LogsTab /></TabsContent>
        <TabsContent value="profile"><ProfileTab /></TabsContent>
      </Tabs>
    </div>
  );
}

/* ------------------------------- Components ------------------------------- */

function StatCard({ icon: Icon, label, value, hint, tone = 'primary' }: { icon: any; label: string; value: number | string; hint?: string; tone?: 'primary' | 'success' | 'warning' | 'info' }) {
  const toneClass = { primary: 'bg-primary/10 text-primary', success: 'bg-success/10 text-success', warning: 'bg-warning/10 text-warning', info: 'bg-info/10 text-info' }[tone];
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${toneClass}`}><Icon className="w-5 h-5" /></div>
        <div>
          <p className="text-2xl font-bold leading-tight">{value}</p>
          <p className="text-xs text-muted-foreground">{label}{hint ? ` · ${hint}` : ''}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationsBell() {
  const { sessions, currentTherapistId } = useClinic();
  const items = sessions
    .filter(s => s.therapistId === currentTherapistId)
    .slice(-5).reverse()
    .map(s => ({ id: s.id, text: `Session ${s.status} · ${s.childId}`, time: format(parseISO(s.start), 'MMM d, h:mm a') }));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 relative">
          <Bell className="w-4 h-4" />
          Notifications
          <Badge className="ml-1" variant="secondary">{items.length}</Badge>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Session Notifications</DialogTitle></DialogHeader>
        <div className="space-y-2 max-h-96 overflow-auto">
          {items.map(i => (
            <div key={i.id} className="p-3 rounded-lg border bg-card">
              <p className="text-sm font-medium">{i.text}</p>
              <p className="text-xs text-muted-foreground">{i.time}</p>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-muted-foreground">You're all caught up.</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* -------- Schedule -------- */

function ScheduleTab() {
  const { sessions, currentTherapistId } = useClinic();
  const [view, setView] = useState<'day' | 'week'>('day');
  const [anchor, setAnchor] = useState<Date>(new Date());

  const days = view === 'day' ? [anchor] : Array.from({ length: 7 }, (_, i) => addDays(startOfDay(anchor), i - anchor.getDay()));

  const my = sessions.filter(s => s.therapistId === currentTherapistId);

  // Conflict detection
  const conflicts = useMemo(() => {
    const set = new Set<string>();
    const list = [...my].sort((a, b) => a.start.localeCompare(b.start));
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        if (parseISO(list[j].start) < parseISO(list[i].end) && parseISO(list[j].end) > parseISO(list[i].start)) {
          set.add(list[i].id); set.add(list[j].id);
        }
      }
    }
    return set;
  }, [my]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <div>
          <CardTitle>Schedule</CardTitle>
          <CardDescription>Assigned sessions with conflict highlighting</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setAnchor(addDays(anchor, -1))}>Prev</Button>
          <Input type="date" value={format(anchor, 'yyyy-MM-dd')} onChange={(e) => setAnchor(new Date(e.target.value))} className="w-40" />
          <Button variant="outline" size="sm" onClick={() => setAnchor(addDays(anchor, 1))}>Next</Button>
          <Select value={view} onValueChange={(v: 'day' | 'week') => setView(v)}>
            <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-3 ${view === 'week' ? 'md:grid-cols-7' : 'grid-cols-1'}`}>
          {days.map(d => {
            const dayItems = my.filter(s => isSameDay(parseISO(s.start), d)).sort((a, b) => a.start.localeCompare(b.start));
            return (
              <div key={d.toISOString()} className="border rounded-lg p-3 min-h-32">
                <p className="text-xs font-semibold text-muted-foreground mb-2">{format(d, 'EEE, MMM d')}</p>
                {dayItems.length === 0 && <p className="text-xs text-muted-foreground">No sessions</p>}
                <div className="space-y-2">
                  {dayItems.map(s => {
                    const conflict = conflicts.has(s.id);
                    return (
                      <div key={s.id} className={`p-2 rounded border text-xs ${conflict ? 'border-destructive bg-destructive/5' : 'border-border bg-muted/40'}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{format(parseISO(s.start), 'h:mm a')}–{format(parseISO(s.end), 'h:mm a')}</span>
                          <Badge variant="outline" className={statusStyles[s.status]}>{s.status}</Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">{s.childId} · {services.find(x => x.id === s.serviceId)?.name}</p>
                        {conflict && <p className="text-destructive mt-1 flex items-center gap-1"><ShieldAlert className="w-3 h-3" />Time conflict</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/* -------- Sessions -------- */

function SessionsTab() {
  const { sessions, currentTherapistId, patients, updateSessionStatus } = useClinic();
  const [filter, setFilter] = useState<string>('all');
  const my = sessions.filter(s => s.therapistId === currentTherapistId)
    .filter(s => filter === 'all' || s.status === filter)
    .sort((a, b) => a.start.localeCompare(b.start));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 flex-wrap">
        <div>
          <CardTitle>Session Details</CardTitle>
          <CardDescription>Mark attendance and view full session info</CardDescription>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="no-show">No-show</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Child</TableHead>
              <TableHead>Therapy</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {my.map(s => {
              const p = patients.find(x => x.id === s.childId);
              return (
                <TableRow key={s.id}>
                  <TableCell className="whitespace-nowrap">
                    <div className="text-sm font-medium">{format(parseISO(s.start), 'MMM d')}</div>
                    <div className="text-xs text-muted-foreground">{format(parseISO(s.start), 'h:mm a')} – {format(parseISO(s.end), 'h:mm a')}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{s.childId}</div>
                    <div className="text-xs text-muted-foreground">{p?.displayName} · {p?.age}y</div>
                  </TableCell>
                  <TableCell className="text-sm">{services.find(x => x.id === s.serviceId)?.name}</TableCell>
                  <TableCell><Badge variant="outline" className={statusStyles[s.status]}>{s.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 flex-wrap">
                      <Button size="sm" variant="ghost" onClick={() => updateSessionStatus(s.id, 'ongoing')}><PlayCircle className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => updateSessionStatus(s.id, 'completed')}><CheckCircle2 className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => updateSessionStatus(s.id, 'cancelled')}><XCircle className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => updateSessionStatus(s.id, 'no-show')}>No-show</Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {my.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No sessions match this filter.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/* -------- Notes -------- */

function NotesTab() {
  const { notes, addNote, patients, currentTherapistId } = useClinic();
  const [query, setQuery] = useState('');
  const [childId, setChildId] = useState('');
  const [content, setContent] = useState('');
  const myPatients = patients.filter(p => p.assignedTherapistId === currentTherapistId);
  const filtered = notes.filter(n =>
    !query || n.childId.toLowerCase().includes(query.toLowerCase()) || n.content.toLowerCase().includes(query.toLowerCase())
  );

  const submit = () => {
    if (!childId || !content.trim()) { toast({ title: 'Missing info', description: 'Choose a child and write a note.' }); return; }
    addNote(childId, content.trim());
    setContent(''); setChildId('');
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader><CardTitle>Add Session Note</CardTitle><CardDescription>Notes are linked to a Child ID for future reference</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Child ID</Label>
            <Select value={childId} onValueChange={setChildId}>
              <SelectTrigger><SelectValue placeholder="Select a child" /></SelectTrigger>
              <SelectContent>
                {myPatients.map(p => <SelectItem key={p.id} value={p.id}>{p.id} · {p.displayName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Note</Label>
            <Textarea rows={6} value={content} onChange={e => setContent(e.target.value)} placeholder="Goals worked on, observations, next steps…" />
          </div>
          <Button onClick={submit}>Save Note</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
          <CardDescription>Searchable by Child ID or content</CardDescription>
          <div className="relative pt-2">
            <Search className="absolute left-3 top-5 w-4 h-4 text-muted-foreground" />
            <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search notes…" className="pl-10" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[480px] overflow-auto">
          {filtered.map(n => (
            <div key={n.id} className="p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="outline">{n.childId}</Badge>
                <span className="text-xs text-muted-foreground">{format(parseISO(n.createdAt), 'MMM d, yyyy h:mm a')}</span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{n.content}</p>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-muted-foreground">No notes found.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

/* -------- Availability -------- */

function AvailabilityTab() {
  const { blocks, addBlock, removeBlock, currentTherapistId } = useClinic();
  const mine = blocks.filter(b => b.therapistId === currentTherapistId);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [reason, setReason] = useState('');

  const submit = () => {
    if (!start || !end || !reason.trim()) { toast({ title: 'Missing info' }); return; }
    const result = addBlock(new Date(start).toISOString(), new Date(end).toISOString(), reason.trim());
    if (!result.ok) {
      toast({ title: 'Cannot block', description: result.error, variant: 'destructive' as any });
    } else {
      setStart(''); setEnd(''); setReason('');
    }
  };

  const minDate = format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm");

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Block Availability</CardTitle>
          <CardDescription>Blocks must be at least 24 hours in advance and cannot overlap active sessions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Start</Label><Input type="datetime-local" min={minDate} value={start} onChange={e => setStart(e.target.value)} /></div>
            <div className="space-y-2"><Label>End</Label><Input type="datetime-local" min={minDate} value={end} onChange={e => setEnd(e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Reason</Label><Input value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g., Continuing education" /></div>
          <Button onClick={submit}>Block Time</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Active Blocks</CardTitle><CardDescription>All changes are recorded in activity logs</CardDescription></CardHeader>
        <CardContent className="space-y-2">
          {mine.length === 0 && <p className="text-sm text-muted-foreground">No blocks set.</p>}
          {mine.map(b => (
            <div key={b.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="text-sm font-medium">{b.reason}</p>
                <p className="text-xs text-muted-foreground">{format(parseISO(b.start), 'MMM d, h:mm a')} → {format(parseISO(b.end), 'MMM d, h:mm a')}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeBlock(b.id)}>Remove</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/* -------- Performance -------- */

function PerformanceTab() {
  const { sessions, currentTherapistId } = useClinic();
  const my = sessions.filter(s => s.therapistId === currentTherapistId);
  const completed = my.filter(s => s.status === 'completed').length;

  // Last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(new Date(), -6 + i);
    const count = my.filter(s => s.status === 'completed' && isSameDay(parseISO(s.start), d)).length;
    return { day: format(d, 'EEE'), count };
  });

  // Monthly buckets
  const monthly = [
    { m: 'Jan', n: 22 }, { m: 'Feb', n: 28 }, { m: 'Mar', n: 31 }, { m: 'Apr', n: 25 }, { m: 'May', n: completed },
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Completed Sessions</CardTitle></CardHeader>
        <CardContent><p className="text-4xl font-bold">{completed}</p><p className="text-xs text-muted-foreground">All time</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Avg Rating</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-2"><Star className="w-6 h-6 text-warning fill-warning" /><p className="text-4xl font-bold">{feedback.averageRating}</p></div>
          <p className="text-xs text-muted-foreground">{feedback.totalReviews} reviews</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">This Week</CardTitle></CardHeader>
        <CardContent><p className="text-4xl font-bold">{last7.reduce((a, b) => a + b.count, 0)}</p><p className="text-xs text-muted-foreground">Completed</p></CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader><CardTitle className="text-base">Sessions This Week</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <RTooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Recent Feedback</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {feedback.recent.map(r => (
            <div key={r.id} className="p-2 rounded border">
              <div className="flex items-center gap-1 mb-1">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3 h-3 text-warning fill-warning" />)}</div>
              <p className="text-sm">{r.comment}</p>
              <p className="text-xs text-muted-foreground">{r.date}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
        <CardHeader><CardTitle className="text-base">Monthly Trend</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} /><RTooltip />
              <Line type="monotone" dataKey="n" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

/* -------- Logs -------- */

function LogsTab() {
  const { logs, currentTherapistId } = useClinic();
  const mine = logs.filter(l => l.therapistId === currentTherapistId);
  const iconFor = { availability: ShieldAlert, session: CalendarIcon, note: NotebookPen, profile: UserCircle, auth: KeyRound } as const;

  return (
    <Card>
      <CardHeader><CardTitle>Activity Logs</CardTitle><CardDescription>Availability, session, note, and profile changes</CardDescription></CardHeader>
      <CardContent className="space-y-2 max-h-[600px] overflow-auto">
        {mine.map(l => {
          const Icon = iconFor[l.type] ?? Activity;
          return (
            <div key={l.id} className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center"><Icon className="w-4 h-4" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{l.action}</p>
                {l.detail && <p className="text-xs text-muted-foreground">{l.detail}</p>}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{format(parseISO(l.timestamp), 'MMM d, h:mm a')}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/* -------- Profile -------- */

function ProfileTab() {
  const { currentTherapistId } = useClinic();
  const therapist = therapists.find(t => t.id === currentTherapistId)!;
  const [name, setName] = useState(therapist.name);
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [email, setEmail] = useState('therapist@brighthorizons.com');
  const [emailNotifs, setEmailNotifs] = useState(true);

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Update your personal information</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16"><AvatarImage src={therapist.photo} /><AvatarFallback>{therapist.name[0]}</AvatarFallback></Avatar>
            <Button variant="outline" size="sm">Change photo</Button>
          </div>
          <div className="space-y-2"><Label>Full Name</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
          <div className="space-y-2"><Label>Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} /></div>
          <Button onClick={() => toast({ title: 'Profile saved' })}>Save Changes</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Security & Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Current Password</Label><Input type="password" /></div>
          <div className="space-y-2"><Label>New Password</Label><Input type="password" /></div>
          <div className="space-y-2"><Label>Confirm Password</Label><Input type="password" /></div>
          <Button onClick={() => toast({ title: 'Password updated' })}><KeyRound className="w-4 h-4 mr-2" />Change Password</Button>
          <Separator />
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium">Email notifications</p><p className="text-xs text-muted-foreground">New, updated, or cancelled bookings</p></div>
            <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
          </div>
          <Separator />
          <Button variant="destructive" className="w-full" onClick={() => toast({ title: 'Signed out (mock)' })}>
            <LogOut className="w-4 h-4 mr-2" />Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
