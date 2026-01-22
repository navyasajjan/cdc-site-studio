import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SiteSection } from '@/types/editor';
import { SiteSettings } from '@/contexts/EditorContext';
import { cdcData, services, therapists, galleryItems, reviews, pricingPackages } from '@/data/mockData';
import { MessageCircle, Star, MapPin, Phone, Mail, Play, FileText, Check, ChevronRight, Award, Clock, Calendar, Users as UsersIcon } from 'lucide-react';

interface SitePreviewProps {
  sections: SiteSection[];
  siteSettings: SiteSettings;
  previewMode?: 'desktop' | 'tablet' | 'mobile';
}

export function SitePreview({ sections, siteSettings, previewMode = 'desktop' }: SitePreviewProps) {
  const visibleSections = sections.filter(s => s.visible).sort((a, b) => a.order - b.order);

  const logoSizeClass = cn(
    siteSettings.logoSize === 'small' && 'h-8',
    siteSettings.logoSize === 'medium' && 'h-12',
    siteSettings.logoSize === 'large' && 'h-16'
  );

  const logoPositionClass = cn(
    siteSettings.logoPosition === 'left' && 'justify-start',
    siteSettings.logoPosition === 'center' && 'justify-center',
    siteSettings.logoPosition === 'right' && 'justify-end'
  );

  return (
    <div className="min-h-full bg-white">
      {/* Site Header with Logo */}
      {siteSettings.showLogoInHeader && siteSettings.logo && (
        <header className={cn(
          'px-4 sm:px-6 py-3 border-b border-border flex items-center bg-white',
          logoPositionClass
        )}>
          <div className="flex items-center gap-2">
            <img 
              src={siteSettings.logo} 
              alt="Site logo" 
              className={cn('object-contain', logoSizeClass)}
            />
            <span className="font-semibold text-foreground hidden sm:inline">{cdcData.name}</span>
          </div>
        </header>
      )}
      
      {visibleSections.map((section) => (
        <div key={section.id}>
          {section.type === 'hero' && <HeroPreview content={section.content} style={section.style} siteSettings={siteSettings} />}
          {section.type === 'about' && <AboutPreview content={section.content} style={section.style} />}
          {section.type === 'services' && <ServicesPreview content={section.content} style={section.style} />}
          {section.type === 'therapists' && <TherapistsPreview content={section.content} style={section.style} />}
          {section.type === 'gallery' && <GalleryPreview content={section.content} style={section.style} />}
          {section.type === 'booking' && <BookingPreview content={section.content} style={section.style} />}
          {section.type === 'analytics' && <AnalyticsPreview content={section.content} style={section.style} />}
          {section.type === 'testimonials' && <TestimonialsPreview content={section.content} style={section.style} />}
          {section.type === 'pricing' && <PricingPreview content={section.content} style={section.style} />}
          {section.type === 'learning' && <LearningPreview content={section.content} style={section.style} />}
          {section.type === 'contact' && <ContactPreview content={section.content} style={section.style} />}
          {section.type === 'footer' && <FooterPreview content={section.content} style={section.style} />}
        </div>
      ))}
    </div>
  );
}

function HeroPreview({ content, style, siteSettings }: { content: any; style?: any; siteSettings: SiteSettings }) {
  const logoSizeClass = cn(
    siteSettings?.logoSize === 'small' && 'h-10 sm:h-12',
    siteSettings?.logoSize === 'medium' && 'h-14 sm:h-16',
    siteSettings?.logoSize === 'large' && 'h-18 sm:h-20'
  );

  const getLogoPositionClasses = (position: string) => {
    switch (position) {
      case 'top-left': return 'top-4 left-4';
      case 'top-center': return 'top-4 left-1/2 -translate-x-1/2';
      case 'top-right': return 'top-4 right-4';
      case 'center-left': return 'top-1/2 left-4 -translate-y-1/2';
      case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'center-right': return 'top-1/2 right-4 -translate-y-1/2';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'bottom-center': return 'bottom-4 left-1/2 -translate-x-1/2';
      case 'bottom-right': return 'bottom-4 right-4';
      default: return 'top-4 left-4';
    }
  };

  return (
    <section
      className="relative min-h-[300px] sm:min-h-[350px] md:min-h-[400px] flex items-center justify-center bg-cover bg-center py-8 sm:py-12"
      style={{
        paddingTop: style?.paddingTop ? `${style.paddingTop}px` : undefined,
        paddingBottom: style?.paddingBottom ? `${style.paddingBottom}px` : undefined,
        backgroundImage: content.backgroundImage
          ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${content.backgroundImage})`
          : 'linear-gradient(135deg, hsl(174 58% 39%) 0%, hsl(174 58% 50%) 100%)',
      }}
    >
      {/* Logo in Hero */}
      {siteSettings?.showLogoInHero && siteSettings.logo && (
        <div className={cn('absolute z-10', getLogoPositionClasses(siteSettings.heroLogoPosition || 'top-left'))}>
          <img src={siteSettings.logo} alt="Site logo" className={cn('object-contain', logoSizeClass)} />
        </div>
      )}

      <div className={cn("container mx-auto px-4 sm:px-6 text-center text-white", style?.textAlign && `text-${style.textAlign}`)}>
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

function AboutPreview({ content, style }: { content: any; style?: any }) {
  return (
    <section 
      className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-background"
      style={{
        paddingTop: style?.paddingTop ? `${style.paddingTop}px` : undefined,
        paddingBottom: style?.paddingBottom ? `${style.paddingBottom}px` : undefined,
      }}
    >
      <div className="container mx-auto max-w-4xl">
        <div className={cn("text-center mb-6 sm:mb-8", style?.textAlign && `text-${style.textAlign}`)}>
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

function ServicesPreview({ content, style }: { content: any; style?: any }) {
  const visibleServices = services.filter(s => s.visible).sort((a, b) => a.order - b.order);
  
  return (
    <section 
      className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-muted/50"
      style={{
        paddingTop: style?.paddingTop ? `${style.paddingTop}px` : undefined,
        paddingBottom: style?.paddingBottom ? `${style.paddingBottom}px` : undefined,
      }}
    >
      <div className="container mx-auto">
        <div className={cn("text-center mb-6 sm:mb-8", style?.textAlign && `text-${style.textAlign}`)}>
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

function TherapistsPreview({ content, style }: { content: any; style?: any }) {
  const visibleTherapists = therapists.filter(t => t.visible);
  
  return (
    <section 
      className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-background"
      style={{
        paddingTop: style?.paddingTop ? `${style.paddingTop}px` : undefined,
        paddingBottom: style?.paddingBottom ? `${style.paddingBottom}px` : undefined,
      }}
    >
      <div className="container mx-auto">
        <div className={cn("text-center mb-6 sm:mb-8", style?.textAlign && `text-${style.textAlign}`)}>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{content.heading}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{content.description}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {visibleTherapists.map((therapist) => (
            <div key={therapist.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <img src={therapist.photo} alt={therapist.name} className="w-full h-36 sm:h-48 object-cover" />
              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-1 sm:gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-sm sm:text-base">{therapist.name}</h3>
                  <Badge variant={therapist.type === 'in-house' ? 'default' : 'secondary'} className="text-[10px] sm:text-xs">
                    {therapist.type === 'in-house' ? 'In-House' : 'Visiting'}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-primary mb-1">{therapist.specialization}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{therapist.experience} experience</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryPreview({ content, style }: { content: any; style?: any }) {
  const visibleGallery = galleryItems.sort((a, b) => a.order - b.order).slice(0, 6);
  
  return (
    <section 
      className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-muted/50"
      style={{
        paddingTop: style?.paddingTop ? `${style.paddingTop}px` : undefined,
        paddingBottom: style?.paddingBottom ? `${style.paddingBottom}px` : undefined,
      }}
    >
      <div className="container mx-auto">
        <div className={cn("text-center mb-6 sm:mb-8", style?.textAlign && `text-${style.textAlign}`)}>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{content.heading}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{content.description}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
          {visibleGallery.map((item) => (
            <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden group">
              <img src={item.url} alt={item.alt} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 sm:p-3">
                <p className="text-white text-xs sm:text-sm">{item.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingPreview({ content, style }: { content: any; style?: any }) {
  return (
    <section 
      className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-primary/5"
      style={{
        paddingTop: style?.paddingTop ? `${style.paddingTop}px` : undefined,
        paddingBottom: style?.paddingBottom ? `${style.paddingBottom}px` : undefined,
      }}
    >
      <div className="container mx-auto max-w-2xl text-center">
        <Calendar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-primary" />
        <h2 className="text-xl sm:text-2xl font-bold mb-2">{content.heading}</h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">{content.description}</p>
        <Button size="lg" className="w-full sm:w-auto gap-2">
          <Calendar className="w-4 h-4" />
          {content.buttonText || 'Book Appointment'}
        </Button>
      </div>
    </section>
  );
}

function AnalyticsPreview({ content, style }: { content: any; style?: any }) {
  return (
    <section 
      className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-background"
      style={{
        paddingTop: style?.paddingTop ? `${style.paddingTop}px` : undefined,
        paddingBottom: style?.paddingBottom ? `${style.paddingBottom}px` : undefined,
      }}
    >
      <div className="container mx-auto">
        <div className={cn("text-center mb-6 sm:mb-8", style?.textAlign && `text-${style.textAlign}`)}>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{content.heading}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{content.description}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
          {content.stats?.map((stat: any, index: number) => (
            <div key={index} className="p-4 sm:p-6 bg-muted rounded-lg">
              <p className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsPreview({ content, style }: { content: any; style?: any }) {
  const approvedReviews = reviews.filter(r => r.approved).slice(0, 3);
  
  return (
    <section 
      className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-muted/50"
      style={{
        paddingTop: style?.paddingTop ? `${style.paddingTop}px` : undefined,
        paddingBottom: style?.paddingBottom ? `${style.paddingBottom}px` : undefined,
      }}
    >
      <div className="container mx-auto">
        <div className={cn("text-center mb-6 sm:mb-8", style?.textAlign && `text-${style.textAlign}`)}>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{content.heading}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{content.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {approvedReviews.map((review) => (
            <div key={review.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-4">"{review.content}"</p>
              <p className="font-medium text-sm">— Parent</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingPreview({ content, style }: { content: any; style?: any }) {
  const visiblePackages = pricingPackages.filter(p => p.visible);
  
  return (
    <section 
      className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-background"
      style={{
        paddingTop: style?.paddingTop ? `${style.paddingTop}px` : undefined,
        paddingBottom: style?.paddingBottom ? `${style.paddingBottom}px` : undefined,
      }}
    >
      <div className="container mx-auto">
        <div className={cn("text-center mb-6 sm:mb-8", style?.textAlign && `text-${style.textAlign}`)}>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{content.heading}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{content.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {visiblePackages.map((pkg, index) => (
            <div key={pkg.id} className={cn(
              "bg-white p-4 sm:p-6 rounded-lg border relative",
              index === 1 && "border-primary ring-2 ring-primary/20"
            )}>
              {index === 1 && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">Popular</Badge>
              )}
              <h3 className="font-semibold text-base sm:text-lg mb-2">{pkg.name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">{pkg.description}</p>
              <p className="text-2xl sm:text-3xl font-bold mb-4">
                ₹{pkg.price.toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground">/{pkg.type}</span>
              </p>
              <ul className="space-y-2 mb-4">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs sm:text-sm">
                    <Check className="w-4 h-4 text-success flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={index === 1 ? 'default' : 'outline'}>
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LearningPreview({ content, style }: { content: any; style?: any }) {
  return (
    <section 
      className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-muted/50"
      style={{
        paddingTop: style?.paddingTop ? `${style.paddingTop}px` : undefined,
        paddingBottom: style?.paddingBottom ? `${style.paddingBottom}px` : undefined,
      }}
    >
      <div className="container mx-auto">
        <div className={cn("text-center mb-6 sm:mb-8", style?.textAlign && `text-${style.textAlign}`)}>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{content.heading}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{content.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {content.modules?.slice(0, 6).map((module: any, index: number) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="aspect-video bg-muted relative">
                <img src={module.thumbnail} alt={module.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="w-5 h-5 text-primary ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <Badge variant="outline" className="mb-2 text-[10px] sm:text-xs">{module.type}</Badge>
                <h3 className="font-semibold text-sm sm:text-base mb-1">{module.title}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{module.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactPreview({ content, style }: { content: any; style?: any }) {
  return (
    <section 
      className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-background"
      style={{
        paddingTop: style?.paddingTop ? `${style.paddingTop}px` : undefined,
        paddingBottom: style?.paddingBottom ? `${style.paddingBottom}px` : undefined,
      }}
    >
      <div className="container mx-auto max-w-4xl">
        <div className={cn("text-center mb-6 sm:mb-8", style?.textAlign && `text-${style.textAlign}`)}>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{content.heading}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{content.description}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm sm:text-base">Address</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{cdcData.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm sm:text-base">Phone</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{cdcData.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm sm:text-base">Email</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{cdcData.email}</p>
              </div>
            </div>
          </div>
          <div className="bg-muted rounded-lg h-48 sm:h-64 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Map Placeholder</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterPreview({ content, style }: { content: any; style?: any }) {
  return (
    <footer 
      className="py-6 sm:py-8 px-4 sm:px-6 bg-foreground text-background"
      style={{
        paddingTop: style?.paddingTop ? `${style.paddingTop}px` : undefined,
        paddingBottom: style?.paddingBottom ? `${style.paddingBottom}px` : undefined,
      }}
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm opacity-80">
            © {new Date().getFullYear()} {cdcData.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs sm:text-sm opacity-80 hover:opacity-100 transition-opacity">Privacy Policy</a>
            <a href="#" className="text-xs sm:text-sm opacity-80 hover:opacity-100 transition-opacity">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
