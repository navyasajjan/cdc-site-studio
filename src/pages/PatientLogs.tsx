import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { useClinic } from '@/contexts/ClinicContext';
import { format, parseISO } from 'date-fns';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))', 'hsl(var(--muted-foreground))'];

export default function PatientLogsPage() {
  const { sessions, logs, patients } = useClinic();
  const byStatus = ['scheduled', 'ongoing', 'completed', 'cancelled', 'no-show'].map((k, i) => ({
    name: k, value: sessions.filter(s => s.status === k).length, fill: COLORS[i % COLORS.length],
  }));
  const byPatient = patients.map(p => ({ name: p.id, sessions: sessions.filter(s => s.childId === p.id).length }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Patient Logs & Analytics</h1>
        <p className="text-sm text-muted-foreground">Aggregate insights across clinic operations</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Sessions by status</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                  {byStatus.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Legend /><Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Sessions per child</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byPatient}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" fontSize={11} /><YAxis allowDecimals={false} fontSize={11} /><Tooltip />
                <Bar dataKey="sessions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
        <CardContent className="space-y-2 max-h-96 overflow-auto">
          {logs.map(l => (
            <div key={l.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <p className="text-sm font-medium">{l.action}</p>
                {l.detail && <p className="text-xs text-muted-foreground">{l.detail}</p>}
              </div>
              <span className="text-xs text-muted-foreground">{format(parseISO(l.timestamp), 'MMM d, h:mm a')}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
