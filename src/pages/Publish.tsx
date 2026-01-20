import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { versionHistory, siteSections } from '@/data/mockData';
import { Eye, Upload, History, Clock, Check, Calendar, Monitor, Tablet, Smartphone, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type PreviewMode = 'desktop' | 'tablet' | 'mobile';

export default function PublishPage() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');

  const previewModes = [
    { mode: 'desktop' as const, icon: Monitor, label: 'Desktop' },
    { mode: 'tablet' as const, icon: Tablet, label: 'Tablet' },
    { mode: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
  ];

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
            <Button className="w-full gap-2">
              <Upload className="w-4 h-4" />Publish Now
            </Button>
            <Button variant="outline" className="w-full gap-2">
              <Calendar className="w-4 h-4" />Schedule Publish
            </Button>
          </CardContent>
        </Card>
      </div>

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

// Simplified preview component showing the actual site
function PreviewContent() {
  const visibleSections = siteSections.filter(s => s.visible).sort((a, b) => a.order - b.order);
  
  return (
    <div className="min-h-full">
      {visibleSections.map((section) => (
        <div key={section.id}>
          {section.type === 'hero' && <HeroPreview content={section.content} />}
          {section.type === 'about' && <AboutPreview content={section.content} />}
          {section.type === 'services' && <ServicesPreview content={section.content} />}
          {section.type === 'booking' && <BookingPreview content={section.content} />}
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
      className="relative min-h-[400px] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: content.backgroundImage
          ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${content.backgroundImage})`
          : 'linear-gradient(135deg, hsl(174 58% 39%) 0%, hsl(174 58% 50%) 100%)',
      }}
    >
      <div className="container mx-auto px-6 text-center text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{content.headline}</h1>
        <p className="text-base md:text-lg mb-6 max-w-xl mx-auto opacity-90">{content.subheadline}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {content.ctas?.map((cta: any, index: number) => (
            <Button
              key={index}
              variant={cta.style === 'primary' ? 'default' : 'outline'}
              className={cn(
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
    <section className="py-12 px-6 bg-background">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold mb-4">About Our Center</h2>
        <p className="text-muted-foreground mb-6">{content.mission}</p>
        <div className="bg-muted rounded-lg p-4">
          <h3 className="font-semibold mb-2">Our Philosophy</h3>
          <p className="text-sm text-muted-foreground">{content.philosophy}</p>
        </div>
      </div>
    </section>
  );
}

function ServicesPreview({ content }: { content: any }) {
  return (
    <section className="py-12 px-6 bg-muted/50">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2">{content.heading}</h2>
        <p className="text-muted-foreground mb-6">{content.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['Speech Therapy', 'Occupational Therapy', 'Behavioral Therapy'].map((service, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
              <p className="font-medium text-sm">{service}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingPreview({ content }: { content: any }) {
  return (
    <section className="py-12 px-6 bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">{content.heading}</h2>
        <p className="mb-6 opacity-90">Book a consultation today</p>
        <div className="flex justify-center gap-3">
          <Button className="bg-white text-primary hover:bg-white/90">Book Online</Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/10">Call Us</Button>
        </div>
      </div>
    </section>
  );
}

function ContactPreview({ content }: { content: any }) {
  return (
    <section className="py-12 px-6 bg-background">
      <div className="container mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold mb-6">{content.heading}</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium">Phone</p>
            <p className="text-muted-foreground">+1 (555) 123-4567</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium">Email</p>
            <p className="text-muted-foreground">hello@brighthorizons.com</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterPreview() {
  return (
    <footer className="py-8 px-6 bg-foreground text-background">
      <div className="container mx-auto text-center">
        <p className="text-sm opacity-70">© 2024 Bright Horizons CDC. All rights reserved.</p>
        <Badge variant="secondary" className="mt-3 bg-primary/20 text-primary-foreground">
          Powered by ManoNiketan
        </Badge>
      </div>
    </footer>
  );
}
