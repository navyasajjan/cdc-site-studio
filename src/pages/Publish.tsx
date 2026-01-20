import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { versionHistory, siteSections, therapists, services, galleryItems, reviews, pricingPackages, cdcData } from '@/data/mockData';
import { Eye, Upload, History, Clock, Check, Calendar, Monitor, Tablet, Smartphone, Star, MapPin, Phone, Mail, MessageCircle, Play, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type PreviewMode = 'desktop' | 'tablet' | 'mobile';

export default function PublishPage() {
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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Preview & Publish</h1>
        <p className="text-muted-foreground mt-1">Preview changes and publish your microsite</p>
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
            <Button className="w-full gap-2" onClick={() => toast.success('Site published successfully!')}>
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

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[95vw] h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-muted/50 flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Site Preview
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
          
          <div className="flex-1 overflow-auto bg-editor-canvas p-6 flex justify-center">
            <div
              className={cn(
                'bg-white shadow-elevated rounded-lg overflow-auto transition-all duration-300',
                previewMode === 'desktop' && 'w-full max-w-[1200px]',
                previewMode === 'tablet' && 'w-[768px]',
                previewMode === 'mobile' && 'w-[375px]'
              )}
              style={{ height: 'calc(90vh - 80px)' }}
            >
              <PreviewContent />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Full preview component showing all site content
function PreviewContent() {
  const visibleSections = siteSections.filter(s => s.visible).sort((a, b) => a.order - b.order);
  
  return (
    <div className="min-h-full">
      {visibleSections.map((section) => (
        <div key={section.id}>
          {section.type === 'hero' && <HeroPreview content={section.content} />}
          {section.type === 'about' && <AboutPreview content={section.content} />}
          {section.type === 'services' && <ServicesPreview content={section.content} />}
          {section.type === 'therapists' && <TherapistsPreview content={section.content} />}
          {section.type === 'gallery' && <GalleryPreview content={section.content} />}
          {section.type === 'booking' && <BookingPreview content={section.content} />}
          {section.type === 'analytics' && <AnalyticsPreview content={section.content} />}
          {section.type === 'testimonials' && <TestimonialsPreview content={section.content} />}
          {section.type === 'pricing' && <PricingPreview content={section.content} />}
          {section.type === 'learning' && <LearningPreview content={section.content} />}
          {section.type === 'contact' && <ContactPreview content={section.content} />}
          {section.type === 'footer' && <FooterPreview />}
        </div>
      ))}
    </div>
  );
}

function HeroPreview({ content }: { content: any }) {
  return (
    <section
      className="relative min-h-[300px] sm:min-h-[350px] md:min-h-[400px] flex items-center justify-center bg-cover bg-center py-8 sm:py-12"
      style={{
        backgroundImage: content.backgroundImage
          ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${content.backgroundImage})`
          : 'linear-gradient(135deg, hsl(174 58% 39%) 0%, hsl(174 58% 50%) 100%)',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 text-center text-white">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">{content.headline}</h1>
        <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-xl mx-auto opacity-90">{content.subheadline}</p>
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-3">
          {content.ctas?.map((cta: any, index: number) => (
            <Button
              key={index}
              variant={cta.style === 'primary' ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'w-full sm:w-auto',
                cta.style === 'primary' && 'bg-accent hover:bg-accent/90',
                cta.style === 'outline' && 'border-white text-white hover:bg-white/10'
              )}
            >
              {cta.text}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutPreview({ content }: { content: any }) {
  return (
    <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">About Our Center</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{content.mission}</p>
        </div>
        <div className="bg-muted rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="font-semibold mb-2 text-sm sm:text-base">Our Philosophy</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">{content.philosophy}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-center">
          <div className="p-3 sm:p-4 bg-primary/10 rounded-lg">
            <p className="text-xl sm:text-2xl font-bold text-primary">{content.yearsExperience}+</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Years Experience</p>
          </div>
          {content.accreditations?.map((acc: string, i: number) => (
            <div key={i} className="p-3 sm:p-4 bg-muted rounded-lg flex items-center justify-center">
              <Badge variant="secondary" className="text-[10px] sm:text-xs">{acc}</Badge>
            </div>
          ))}
        </div>
        {content.manoNiketanVerified && (
          <div className="mt-4 sm:mt-6 text-center">
            <Badge className="bg-primary text-xs sm:text-sm">✓ ManoNiketan Verified</Badge>
          </div>
        )}
      </div>
    </section>
  );
}

function ServicesPreview({ content }: { content: any }) {
  const visibleServices = services.filter(s => s.visible).sort((a, b) => a.order - b.order);
  
  return (
    <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-muted/50">
      <div className="container mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{content.heading}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{content.description}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {visibleServices.map((service) => (
            <div key={service.id} className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{service.name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">{service.description}</p>
              <Badge variant="outline" className="text-[10px] sm:text-xs">{service.ageRange}</Badge>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TherapistsPreview({ content }: { content: any }) {
  const visibleTherapists = therapists.filter(t => t.visible);
  
  return (
    <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{content.heading}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{content.description}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {visibleTherapists.map((therapist) => (
            <div key={therapist.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <img 
                src={therapist.photo} 
                alt={therapist.name}
                className="w-full h-36 sm:h-48 object-cover"
              />
              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-1 sm:gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-sm sm:text-base">{therapist.name}</h3>
                  <Badge variant={therapist.type === 'in-house' ? 'default' : 'secondary'} className="text-[10px] sm:text-xs">
                    {therapist.type === 'in-house' ? 'In-House' : 'Visiting'}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-primary mb-1">{therapist.specialization}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{therapist.experience} experience</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{therapist.credentials}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryPreview({ content }: { content: any }) {
  return (
    <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-muted/50">
      <div className="container mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{content.heading}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{content.description}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
          {galleryItems.map((item) => (
            <div key={item.id} className="relative rounded-lg overflow-hidden group">
              <img 
                src={item.url} 
                alt={item.alt}
                className="w-full h-28 sm:h-40 md:h-48 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-xs sm:text-sm font-medium px-2 text-center">{item.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingPreview({ content }: { content: any }) {
  return (
    <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-2xl text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{content.heading}</h2>
        <p className="text-sm sm:text-base mb-4 sm:mb-6 opacity-90">Book a consultation with our expert therapists today</p>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-3">
          {content.enableOnlineBooking && (
            <Button size="sm" className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto">Book Online</Button>
          )}
          <Button variant="outline" size="sm" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
            <Phone className="w-4 h-4 mr-2" />Call Us
          </Button>
          <Button variant="outline" size="sm" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
            <MessageCircle className="w-4 h-4 mr-2" />WhatsApp
          </Button>
        </div>
        {content.showTherapistSelection && (
          <p className="text-xs sm:text-sm mt-3 sm:mt-4 opacity-75">Select your preferred therapist when booking</p>
        )}
      </div>
    </section>
  );
}

function AnalyticsPreview({ content }: { content: any }) {
  return (
    <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold">Our Impact</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          {content.stats?.map((stat: any, index: number) => (
            <div key={index} className="text-center p-4 sm:p-6 bg-primary/5 rounded-lg">
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsPreview({ content }: { content: any }) {
  const featuredReviews = reviews.filter(r => r.approved && r.featured);
  
  return (
    <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-muted/50">
      <div className="container mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{content.heading}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {featuredReviews.map((review) => (
            <div key={review.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
              {content.showRatings && (
                <div className="flex gap-1 mb-2 sm:mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              )}
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">"{review.content}"</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {new Date(review.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingPreview({ content }: { content: any }) {
  const visiblePackages = pricingPackages.filter(p => p.visible);
  
  return (
    <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{content.heading}</h2>
          {content.disclaimer && (
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">{content.disclaimer}</p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {visiblePackages.map((pkg) => (
            <div key={pkg.id} className="bg-white border rounded-lg p-4 sm:p-6 flex flex-col">
              <Badge variant="outline" className="w-fit mb-2 sm:mb-3 capitalize text-[10px] sm:text-xs">{pkg.type}</Badge>
              <h3 className="font-semibold text-base sm:text-lg">{pkg.name}</h3>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary my-2 sm:my-3">${pkg.price}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">{pkg.description}</p>
              <ul className="space-y-1 sm:space-y-2 mb-3 sm:mb-4 flex-1">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="text-xs sm:text-sm flex items-start gap-1 sm:gap-2">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button size="sm" className="w-full">Select Plan</Button>
            </div>
          ))}
        </div>
        {content.showRequestQuote && (
          <div className="text-center mt-6 sm:mt-8">
            <Button variant="outline" size="sm">Request Custom Quote</Button>
          </div>
        )}
      </div>
    </section>
  );
}

function LearningPreview({ content }: { content: any }) {
  return (
    <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-muted/50">
      <div className="container mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{content.heading}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {content.modules?.map((module: any) => (
            <div key={module.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="relative">
                <img 
                  src={module.thumbnail} 
                  alt={module.title}
                  className="w-full h-32 sm:h-40 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  {module.type === 'video' ? (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 text-primary ml-0.5 sm:ml-1" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                  )}
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <Badge variant="outline" className="mb-2 capitalize text-[10px] sm:text-xs">{module.type}</Badge>
                <h3 className="font-semibold text-sm sm:text-base">{module.title}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6 sm:mt-8">
          <Button size="sm">Explore Learning Hub</Button>
        </div>
      </div>
    </section>
  );
}

function ContactPreview({ content }: { content: any }) {
  return (
    <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold">{content.heading}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted rounded-lg">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-sm sm:text-base">Phone</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{cdcData.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted rounded-lg">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-sm sm:text-base">Email</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{cdcData.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted rounded-lg">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-sm sm:text-base">WhatsApp</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{cdcData.whatsapp}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-muted rounded-lg">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-sm sm:text-base">Address</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{cdcData.address}</p>
              </div>
            </div>
            <div className="p-3 sm:p-4 bg-muted rounded-lg">
              <p className="font-medium mb-1 text-sm sm:text-base">Working Hours</p>
              <p className="text-xs sm:text-sm text-muted-foreground">{cdcData.workingHours}</p>
            </div>
            {content.showParkingInfo && content.parkingInfo && (
              <div className="p-3 sm:p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="font-medium mb-1 text-sm sm:text-base">Parking Information</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{content.parkingInfo}</p>
              </div>
            )}
          </div>
          {content.showMap && (
            <div className="bg-muted rounded-lg h-48 sm:h-64 md:h-full min-h-[200px] sm:min-h-[250px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
                <p className="text-xs sm:text-sm">Google Maps Integration</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FooterPreview() {
  return (
    <footer className="py-6 sm:py-8 px-4 sm:px-6 bg-foreground text-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">{cdcData.name}</h4>
            <p className="text-xs sm:text-sm opacity-70">{cdcData.tagline}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Quick Links</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm opacity-70">
              <li>About Us</li>
              <li>Our Services</li>
              <li>Meet the Team</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Policies</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm opacity-70">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cancellation Policy</li>
              <li>FAQs</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/20 pt-4 sm:pt-6 text-center">
          <p className="text-xs sm:text-sm opacity-70 mb-2 sm:mb-3">© 2024 {cdcData.name}. All rights reserved.</p>
          <Badge variant="secondary" className="bg-primary/20 text-primary-foreground text-[10px] sm:text-xs">
            Powered by ManoNiketan
          </Badge>
        </div>
      </div>
    </footer>
  );
}
