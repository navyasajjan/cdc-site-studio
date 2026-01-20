import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cdcData } from '@/data/mockData';
import { Search, Globe, FileText, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

export default function SEOPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">SEO & Visibility</h1>
        <p className="text-muted-foreground mt-1">Optimize your microsite for search engines</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-lg">Meta Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Page Title</Label>
              <Input defaultValue={cdcData.seo.title} />
              <p className="text-xs text-muted-foreground">{cdcData.seo.title.length}/60 characters</p>
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea defaultValue={cdcData.seo.description} rows={3} />
              <p className="text-xs text-muted-foreground">{cdcData.seo.description.length}/160 characters</p>
            </div>
            <div className="space-y-2">
              <Label>Keywords</Label>
              <div className="flex flex-wrap gap-2">
                {cdcData.seo.keywords.map((kw, i) => (
                  <Badge key={i} variant="secondary">{kw}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5" />SEO Score</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-success">92</p>
              <p className="text-sm text-muted-foreground">out of 100</p>
            </div>
            <Progress value={92} className="h-2" />
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-success"><CheckCircle className="w-4 h-4" />Title tag optimized</div>
              <div className="flex items-center gap-2 text-success"><CheckCircle className="w-4 h-4" />Meta description set</div>
              <div className="flex items-center gap-2 text-warning"><AlertCircle className="w-4 h-4" />Add more alt text</div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end"><Button>Save Changes</Button></div>
    </div>
  );
}
