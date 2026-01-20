import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, MousePointer, Clock, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function AnalyticsPage() {
  const stats = [
    { title: 'Page Views', value: '12,847', change: '+14.2%', icon: Eye },
    { title: 'Booking Clicks', value: '342', change: '+8.1%', icon: MousePointer },
    { title: 'Avg. Time on Page', value: '2:45', change: '+5.3%', icon: Clock },
    { title: 'Conversion Rate', value: '2.7%', change: '+0.4%', icon: TrendingUp },
  ];

  return (
    <div className="p-6 space-y-6">
      <div><h1 className="text-2xl font-bold">Analytics</h1><p className="text-muted-foreground mt-1">Marketing performance metrics (no PHI)</p></div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Icon className="w-5 h-5 text-primary" /></div>
                  <Badge variant="secondary" className="bg-success/10 text-success"><ArrowUpRight className="w-3 h-3 mr-1" />{stat.change}</Badge>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card><CardHeader><CardTitle>Top Services Viewed</CardTitle></CardHeader><CardContent>
        <div className="space-y-3">
          {['Speech & Language Therapy', 'Occupational Therapy', 'Behavioral Therapy'].map((s, i) => (
            <div key={s} className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">{s}</span>
              <Badge variant="outline">{[234, 189, 156][i]} views</Badge>
            </div>
          ))}
        </div>
      </CardContent></Card>
    </div>
  );
}
