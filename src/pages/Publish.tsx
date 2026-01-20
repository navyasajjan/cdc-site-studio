import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { versionHistory } from '@/data/mockData';
import { Eye, Upload, History, Clock, Check, Calendar } from 'lucide-react';

export default function PublishPage() {
  return (
    <div className="p-6 space-y-6">
      <div><h1 className="text-2xl font-bold">Preview & Publish</h1><p className="text-muted-foreground mt-1">Preview changes and publish your microsite</p></div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Eye className="w-5 h-5" />Preview</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Preview your site before publishing</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">Desktop</Button>
              <Button variant="outline" className="flex-1">Tablet</Button>
              <Button variant="outline" className="flex-1">Mobile</Button>
            </div>
            <Button className="w-full gap-2"><Eye className="w-4 h-4" />Open Preview</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Upload className="w-5 h-5" />Publish</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-success/10 rounded-lg border border-success/20">
              <p className="text-sm font-medium text-success flex items-center gap-2"><Check className="w-4 h-4" />All checks passed</p>
            </div>
            <Button className="w-full gap-2"><Upload className="w-4 h-4" />Publish Now</Button>
            <Button variant="outline" className="w-full gap-2"><Calendar className="w-4 h-4" />Schedule Publish</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><History className="w-5 h-5" />Version History</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {versionHistory.map((v) => (
              <div key={v.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{new Date(v.createdAt).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">by {v.createdBy}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={v.status === 'published' ? 'default' : 'secondary'}>{v.status}</Badge>
                  <Button variant="ghost" size="sm">Rollback</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
