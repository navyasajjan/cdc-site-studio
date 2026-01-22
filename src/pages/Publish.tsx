import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { versionHistory } from '@/data/mockData';
import { Eye, Upload, History, Clock, Check, Calendar, Monitor, Tablet, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useEditor } from '@/contexts/EditorContext';
import { SitePreview } from '@/components/preview/SitePreview';

type PreviewMode = 'desktop' | 'tablet' | 'mobile';

export default function PublishPage() {
  const { sections, siteSettings, state } = useEditor();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduleTimezone, setScheduleTimezone] = useState('America/New_York');

  const previewModes = [
    { mode: 'desktop' as const, icon: Monitor, label: 'Desktop' },
    { mode: 'tablet' as const, icon: Tablet, label: 'Tablet' },
    { mode: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
  ];

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Asia/Kolkata', label: 'India (IST)' },
  ];

  const handleSchedulePublish = () => {
    if (!scheduleDate || !scheduleTime) {
      toast.error('Please select both date and time');
      return;
    }
    toast.success(`Publish scheduled for ${scheduleDate} at ${scheduleTime}`);
    setScheduleOpen(false);
    setScheduleDate('');
    setScheduleTime('');
  };

  const handlePublishNow = () => {
    toast.success('Site published successfully!');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Preview & Publish</h1>
        <p className="text-muted-foreground mt-1">Preview changes and publish your microsite</p>
        {state.hasUnsavedChanges && (
          <Badge variant="outline" className="mt-2 bg-warning/10 text-warning border-warning/20">
            You have unsaved changes
          </Badge>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="w-5 h-5" />Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Preview your site before publishing</p>
            <div className="flex gap-3">
              {previewModes.map(({ mode, icon: Icon, label }) => (
                <Button 
                  key={mode}
                  variant={previewMode === mode ? 'default' : 'outline'} 
                  className="flex-1 gap-2"
                  onClick={() => setPreviewMode(mode)}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              ))}
            </div>
            <Button className="w-full gap-2" onClick={() => setPreviewOpen(true)}>
              <Eye className="w-4 h-4" />Open Preview
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="w-5 h-5" />Publish
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-success/10 rounded-lg border border-success/20">
              <p className="text-sm font-medium text-success flex items-center gap-2">
                <Check className="w-4 h-4" />All checks passed
              </p>
            </div>
            <Button className="w-full gap-2" onClick={handlePublishNow}>
              <Upload className="w-4 h-4" />Publish Now
            </Button>
            <Button variant="outline" className="w-full gap-2" onClick={() => setScheduleOpen(true)}>
              <Calendar className="w-4 h-4" />Schedule Publish
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Publish Dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Publish
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-date">Publish Date</Label>
              <Input
                id="schedule-date"
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-time">Publish Time</Label>
              <Input
                id="schedule-time"
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-timezone">Timezone</Label>
              <Select value={scheduleTimezone} onValueChange={setScheduleTimezone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {scheduleDate && scheduleTime && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Your site will be published on{' '}
                  <span className="font-medium text-foreground">
                    {new Date(scheduleDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>{' '}
                  at <span className="font-medium text-foreground">{scheduleTime}</span>
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSchedulePublish}>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Version History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="w-5 h-5" />Version History
          </CardTitle>
        </CardHeader>
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

      {/* Preview Modal - Now uses live EditorContext data */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[95vw] h-[90vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="p-4 border-b bg-muted/50 flex flex-row items-center justify-between flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Site Preview
              {state.hasUnsavedChanges && (
                <Badge variant="outline" className="ml-2 bg-warning/10 text-warning border-warning/20 text-xs">
                  Draft
                </Badge>
              )}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {previewModes.map(({ mode, icon: Icon, label }) => (
                <Button
                  key={mode}
                  variant={previewMode === mode ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode(mode)}
                  className="gap-1"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Button>
              ))}
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto bg-editor-canvas p-6 flex justify-center min-h-0">
            <div
              className={cn(
                'bg-white shadow-elevated rounded-lg overflow-auto transition-all duration-300',
                previewMode === 'desktop' && 'w-full max-w-[1200px]',
                previewMode === 'tablet' && 'w-[768px]',
                previewMode === 'mobile' && 'w-[375px]'
              )}
            >
              {/* Use SitePreview component with live EditorContext data */}
              <SitePreview 
                sections={sections} 
                siteSettings={siteSettings} 
                previewMode={previewMode}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
