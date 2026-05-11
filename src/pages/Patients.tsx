import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, ShieldCheck } from 'lucide-react';
import { useClinic } from '@/contexts/ClinicContext';
import { therapists } from '@/data/mockData';
import { currentUser } from '@/data/mockData';

export default function PatientsPage() {
  const { patients, notes, sessions } = useClinic();
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<string | null>(patients[0]?.id ?? null);

  // RBAC: admin sees all; therapist sees only their assigned patients
  const role = currentUser.role;
  const visible = role === 'cdc_admin'
    ? patients
    : patients.filter(p => p.assignedTherapistId === currentUser.id);

  const filtered = visible.filter(p =>
    !q || p.id.toLowerCase().includes(q.toLowerCase()) || p.displayName.toLowerCase().includes(q.toLowerCase())
  );

  const patient = filtered.find(p => p.id === selected) ?? filtered[0];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Patients</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-success" /> HIPAA-safe view · Child IDs and initials only
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by Child ID…" className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[560px] overflow-auto">
            {filtered.map(p => (
              <button key={p.id} onClick={() => setSelected(p.id)} className={`w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition ${patient?.id === p.id ? 'border-primary bg-primary/5' : ''}`}>
                <div className="flex items-center gap-3">
                  <Avatar className="w-9 h-9"><AvatarFallback className="bg-primary/10 text-primary text-xs">{p.id.slice(-2)}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{p.id}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.displayName} · {p.age}y</p>
                  </div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && <p className="text-sm text-muted-foreground p-3">No matches.</p>}
          </CardContent>
        </Card>

        {patient && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{patient.id}</CardTitle>
              <p className="text-sm text-muted-foreground">{patient.displayName} · {patient.age}y · joined {patient.joinedDate}</p>
              <div className="flex flex-wrap gap-1 mt-1">{patient.diagnosisTags.map(t => <Badge key={t} variant="outline">{t}</Badge>)}</div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile">
                <TabsList>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="sessions">Sessions</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Assigned therapist:</span> {therapists.find(t => t.id === patient.assignedTherapistId)?.name}</p>
                  <p><span className="text-muted-foreground">Parent contact:</span> {patient.parentContact}</p>
                </TabsContent>
                <TabsContent value="sessions" className="space-y-2">
                  {sessions.filter(s => s.childId === patient.id).map(s => (
                    <div key={s.id} className="flex items-center justify-between p-2 rounded border">
                      <span className="text-sm">{new Date(s.start).toLocaleString()}</span>
                      <Badge variant="outline">{s.status}</Badge>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="notes" className="space-y-2">
                  {notes.filter(n => n.childId === patient.id).map(n => (
                    <div key={n.id} className="p-3 rounded border">
                      <p className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
                      <p className="text-sm mt-1 whitespace-pre-wrap">{n.content}</p>
                    </div>
                  ))}
                  {notes.filter(n => n.childId === patient.id).length === 0 && <p className="text-sm text-muted-foreground">No notes yet.</p>}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
