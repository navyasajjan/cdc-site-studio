import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cdcData, currentUser } from '@/data/mockData';
import { Settings, User, Shield, Bell } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div><h1 className="text-2xl font-bold">Settings & Permissions</h1><p className="text-muted-foreground mt-1">Manage CDC settings and user access</p></div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Settings className="w-5 h-5" />General</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>CDC Name</Label><Input defaultValue={cdcData.name} /></div>
            <div className="space-y-2"><Label>Tagline</Label><Input defaultValue={cdcData.tagline} /></div>
            <div className="space-y-2"><Label>Email</Label><Input defaultValue={cdcData.email} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input defaultValue={cdcData.phone} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><User className="w-5 h-5" />Your Account</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <img src={currentUser.avatar} alt="" className="w-16 h-16 rounded-full" />
              <div><p className="font-medium">{currentUser.name}</p><p className="text-sm text-muted-foreground">{currentUser.email}</p></div>
            </div>
            <Button variant="outline">Change Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Shield className="w-5 h-5" />Security</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between"><div><Label>Two-Factor Authentication</Label><p className="text-xs text-muted-foreground">Add extra security</p></div><Switch /></div>
            <div className="flex items-center justify-between"><div><Label>Session Timeout</Label><p className="text-xs text-muted-foreground">Auto logout after inactivity</p></div><Switch defaultChecked /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Bell className="w-5 h-5" />Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between"><Label>New Reviews</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label>Booking Requests</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label>System Updates</Label><Switch /></div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end"><Button>Save Changes</Button></div>
    </div>
  );
}
