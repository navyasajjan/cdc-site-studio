import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { services, therapists } from '@/data/mockData';
import { Calendar, Clock, User, Settings, Info, AlertCircle } from 'lucide-react';

export default function BookingPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Booking Display Rules</h1>
          <p className="text-muted-foreground mt-1">
            Configure how booking options appear on your microsite
          </p>
        </div>
      </div>

      {/* Notice */}
      <Card className="border-info bg-info/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-info mt-0.5" />
          <div>
            <p className="text-sm font-medium text-info">Display Settings Only</p>
            <p className="text-sm text-muted-foreground mt-1">
              These settings control what visitors see on your microsite. Actual appointment data
              and PHI are managed separately in your clinical system.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Enable Online Booking</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Show booking section on microsite
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Show Therapist Selection</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Let visitors choose their therapist
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Auto-Assign Therapist</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Automatically assign based on availability
                </p>
              </div>
              <Switch />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Slot Visibility Window</Label>
              <Select defaultValue="14">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days ahead</SelectItem>
                  <SelectItem value="14">14 days ahead</SelectItem>
                  <SelectItem value="30">30 days ahead</SelectItem>
                  <SelectItem value="60">60 days ahead</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Available Services */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Available for Booking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.ageRange}</p>
                  </div>
                </div>
                <Switch defaultChecked={service.visible} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Therapist Availability Display */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              Therapist Display
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {therapists.map((therapist) => (
              <div
                key={therapist.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={therapist.photo}
                    alt={therapist.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium">{therapist.name}</p>
                    <p className="text-xs text-muted-foreground">{therapist.specialization}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={therapist.type === 'in-house' ? 'default' : 'secondary'}>
                    {therapist.type === 'in-house' ? 'In-House' : 'Visiting'}
                  </Badge>
                  <Switch defaultChecked={therapist.visible} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Time Slot Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Time Slot Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Default Session Duration</Label>
              <Select defaultValue="45">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Buffer Between Sessions</Label>
              <Select defaultValue="15">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No buffer</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Show Availability Indicator</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Display "Limited spots" for high-demand times
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* HIPAA Notice */}
      <Card className="border-warning bg-warning/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
          <div>
            <p className="text-sm font-medium text-warning">HIPAA Compliance</p>
            <p className="text-sm text-muted-foreground mt-1">
              No protected health information (PHI) is displayed on the public microsite. All booking
              data is handled securely through your clinical management system.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
