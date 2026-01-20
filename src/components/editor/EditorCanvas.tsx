import { useEditor } from '@/contexts/EditorContext';
import { cn } from '@/lib/utils';
import { cdcData, services, therapists, galleryItems, reviews, pricingPackages } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EditableText } from './EditableText';
import {
  MessageCircle,
  Hand,
  Brain,
  Baby,
  Sparkles,
  Users,
  Phone,
  Mail,
  MapPin,
  Star,
  Check,
  Play,
  ChevronRight,
  Award,
  Clock,
  Calendar,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  MessageCircle,
  Hand,
  Brain,
  Baby,
  Sparkles,
  Users,
};

interface SectionProps {
  content: any;
  sectionId: string;
  onContentUpdate: (content: Record<string, any>) => void;
  style?: {
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
    textAlign: 'left' | 'center' | 'right';
    backgroundColor: string;
    backgroundType: 'color' | 'gradient' | 'image';
    backgroundImage?: string;
  };
  siteSettings?: {
    logo: string;
    logoPosition: 'left' | 'center' | 'right';
    logoSize: 'small' | 'medium' | 'large';
    showLogoInHero: boolean;
    showLogoInHeader: boolean;
  };
}

const defaultStyle = {
  paddingTop: 64,
  paddingBottom: 64,
  paddingLeft: 24,
  paddingRight: 24,
  textAlign: 'center' as const,
  backgroundColor: 'transparent',
  backgroundType: 'color' as const,
};

export function EditorCanvas() {
  const { sections, state, siteSettings, setSelectedSection, updateSectionContent } = useEditor();

  const previewClasses = cn(
    'transition-all duration-300 bg-white mx-auto shadow-elevated rounded-lg overflow-hidden',
    state.previewMode === 'desktop' && 'w-full max-w-[1200px]',
    state.previewMode === 'tablet' && 'w-[768px]',
    state.previewMode === 'mobile' && 'w-[375px]'
  );

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

  const visibleSections = sections.filter(s => s.visible).sort((a, b) => a.order - b.order);

  const handleContentUpdate = (sectionId: string) => (content: Record<string, any>) => {
    updateSectionContent(sectionId, content);
  };

  return (
    <div
      className="flex-1 overflow-auto p-6 bg-editor-canvas"
      style={{ transform: `scale(${state.zoom / 100})`, transformOrigin: 'top center' }}
    >
      <div className={previewClasses}>
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
          <div
            key={section.id}
            className={cn(
              'relative group cursor-pointer transition-all duration-200',
              state.selectedSectionId === section.id && 'ring-2 ring-primary ring-offset-2'
            )}
            onClick={() => setSelectedSection(section.id)}
          >
            {/* Section Overlay on Hover */}
            <div className={cn(
              'absolute inset-0 z-10 border-2 border-transparent transition-colors pointer-events-none',
              'group-hover:border-primary/50',
              state.selectedSectionId === section.id && 'border-primary'
            )} />

            {/* Section Label */}
            <div className={cn(
              'absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity',
              state.selectedSectionId === section.id && 'opacity-100'
            )}>
              <Badge variant="secondary" className="bg-primary text-primary-foreground text-[10px]">
                {section.title}
              </Badge>
            </div>

            {/* Render Section Content */}
            {section.type === 'hero' && <HeroSection content={section.content} sectionId={section.id} onContentUpdate={handleContentUpdate(section.id)} style={section.style || defaultStyle} siteSettings={siteSettings} />}
            {section.type === 'about' && <AboutSection content={section.content} sectionId={section.id} onContentUpdate={handleContentUpdate(section.id)} style={section.style || defaultStyle} />}
            {section.type === 'services' && <ServicesSection content={section.content} sectionId={section.id} onContentUpdate={handleContentUpdate(section.id)} style={section.style || defaultStyle} />}
            {section.type === 'therapists' && <TherapistsSection content={section.content} sectionId={section.id} onContentUpdate={handleContentUpdate(section.id)} style={section.style || defaultStyle} />}
            {section.type === 'gallery' && <GallerySection content={section.content} sectionId={section.id} onContentUpdate={handleContentUpdate(section.id)} style={section.style || defaultStyle} />}
            {section.type === 'booking' && <BookingSection content={section.content} sectionId={section.id} onContentUpdate={handleContentUpdate(section.id)} style={section.style || defaultStyle} />}
            {section.type === 'analytics' && <AnalyticsSection content={section.content} sectionId={section.id} onContentUpdate={handleContentUpdate(section.id)} style={section.style || defaultStyle} />}
            {section.type === 'testimonials' && <TestimonialsSection content={section.content} sectionId={section.id} onContentUpdate={handleContentUpdate(section.id)} style={section.style || defaultStyle} />}
            {section.type === 'pricing' && <PricingSection content={section.content} sectionId={section.id} onContentUpdate={handleContentUpdate(section.id)} style={section.style || defaultStyle} />}
            {section.type === 'learning' && <LearningSection content={section.content} sectionId={section.id} onContentUpdate={handleContentUpdate(section.id)} style={section.style || defaultStyle} />}
            {section.type === 'contact' && <ContactSection content={section.content} sectionId={section.id} onContentUpdate={handleContentUpdate(section.id)} style={section.style || defaultStyle} />}
            {section.type === 'footer' && <FooterSection content={section.content} sectionId={section.id} onContentUpdate={handleContentUpdate(section.id)} style={section.style || defaultStyle} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroSection({ content, onContentUpdate, style = defaultStyle, siteSettings }: SectionProps) {
  const logoSizeClass = cn(
    siteSettings?.logoSize === 'small' && 'h-10 sm:h-12',
    siteSettings?.logoSize === 'medium' && 'h-14 sm:h-16',
    siteSettings?.logoSize === 'large' && 'h-18 sm:h-20'
  );

  const textAlignClass = cn(
    style.textAlign === 'left' && 'text-left items-start',
    style.textAlign === 'center' && 'text-center items-center',
    style.textAlign === 'right' && 'text-right items-end'
  );

  return (
    <section
      className="relative min-h-[500px] flex items-center justify-center bg-cover bg-center"
      style={{
        paddingTop: `${style.paddingTop}px`,
        paddingBottom: `${style.paddingBottom}px`,
        paddingLeft: `${style.paddingLeft}px`,
        paddingRight: `${style.paddingRight}px`,
        backgroundImage: content.backgroundImage
          ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${content.backgroundImage})`
          : 'linear-gradient(135deg, hsl(174 58% 39%) 0%, hsl(174 58% 50%) 100%)',
      }}
    >
      <div className={cn("container mx-auto px-6 text-white flex flex-col", textAlignClass)}>
        {/* Logo in Hero */}
        {siteSettings?.showLogoInHero && siteSettings.logo && (
          <div className="mb-6">
            <img 
              src={siteSettings.logo} 
              alt="Site logo" 
              className={cn('object-contain', logoSizeClass, style.textAlign === 'center' && 'mx-auto')}
            />
          </div>
        )}
        <EditableText
          value={content.headline}
          onChange={(value) => onContentUpdate({ headline: value })}
          as="h1"
          className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
          placeholder="Enter headline..."
          maxLength={100}
        />
        <EditableText
          value={content.subheadline}
          onChange={(value) => onContentUpdate({ subheadline: value })}
          as="p"
          className="text-lg md:text-xl mb-8 max-w-2xl opacity-90"
          placeholder="Enter subheadline..."
          maxLength={200}
        />
        <div className={cn("flex flex-wrap gap-4", 
          style.textAlign === 'left' && 'justify-start',
          style.textAlign === 'center' && 'justify-center',
          style.textAlign === 'right' && 'justify-end'
        )}>
          {content.ctas?.map((cta: any, index: number) => (
            <Button
              key={index}
              variant={cta.style === 'primary' ? 'default' : cta.style === 'outline' ? 'outline' : 'secondary'}
              size="lg"
              className={cn(
                cta.style === 'primary' && 'bg-accent hover:bg-accent/90',
                cta.style === 'outline' && 'border-white text-white hover:bg-white/10'
              )}
            >
              <EditableText
                value={cta.text}
                onChange={(value) => {
                  const newCtas = [...content.ctas];
                  newCtas[index] = { ...newCtas[index], text: value };
                  onContentUpdate({ ctas: newCtas });
                }}
                placeholder="Button text..."
              />
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection({ content, onContentUpdate, style = defaultStyle }: SectionProps) {
  const textAlignClass = cn(
    style.textAlign === 'left' && 'text-left',
    style.textAlign === 'center' && 'text-center',
    style.textAlign === 'right' && 'text-right'
  );

  const bgClass = cn(
    style.backgroundColor === 'primary' && 'bg-primary text-primary-foreground',
    style.backgroundColor === 'secondary' && 'bg-secondary',
    style.backgroundColor === 'muted' && 'bg-muted',
    style.backgroundColor === 'transparent' && 'bg-background'
  );

  return (
    <section 
      className={cn("bg-background", bgClass)}
      style={{
        paddingTop: `${style.paddingTop}px`,
        paddingBottom: `${style.paddingBottom}px`,
        paddingLeft: `${style.paddingLeft}px`,
        paddingRight: `${style.paddingRight}px`,
      }}
    >
      <div className="container mx-auto max-w-4xl">
        <div className={cn("mb-12", textAlignClass)}>
          <EditableText
            value="About Our Center"
            onChange={() => {}}
            as="h2"
            className="text-3xl font-bold text-foreground mb-4"
            disabled
          />
          <EditableText
            value={content.mission}
            onChange={(value) => onContentUpdate({ mission: value })}
            as="p"
            className={cn("text-muted-foreground max-w-2xl", style.textAlign === 'center' && 'mx-auto')}
            placeholder="Enter mission statement..."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">
              <EditableText
                value={String(content.yearsExperience)}
                onChange={(value) => onContentUpdate({ yearsExperience: parseInt(value) || 0 })}
                placeholder="0"
              />+ Years
            </h3>
            <p className="text-sm text-muted-foreground">Of Excellence</p>
          </Card>
          <Card className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Expert Team</h3>
            <p className="text-sm text-muted-foreground">Certified Specialists</p>
          </Card>
          <Card className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold mb-2">Verified</h3>
            <p className="text-sm text-muted-foreground">
              {content.manoNiketanVerified ? 'ManoNiketan Certified' : 'Quality Assured'}
            </p>
          </Card>
        </div>

        <div className="bg-muted rounded-xl p-6">
          <h3 className="font-semibold mb-3">Our Philosophy</h3>
          <EditableText
            value={content.philosophy}
            onChange={(value) => onContentUpdate({ philosophy: value })}
            as="p"
            className="text-muted-foreground"
            placeholder="Enter philosophy..."
          />
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ content, onContentUpdate, style = defaultStyle }: SectionProps) {
  const textAlignClass = cn(
    style.textAlign === 'left' && 'text-left',
    style.textAlign === 'center' && 'text-center',
    style.textAlign === 'right' && 'text-right'
  );

  const bgClass = cn(
    style.backgroundColor === 'primary' && 'bg-primary text-primary-foreground',
    style.backgroundColor === 'secondary' && 'bg-secondary',
    style.backgroundColor === 'muted' && 'bg-muted',
    style.backgroundColor === 'transparent' && 'bg-muted/50'
  );

  return (
    <section 
      className={bgClass}
      style={{
        paddingTop: `${style.paddingTop}px`,
        paddingBottom: `${style.paddingBottom}px`,
        paddingLeft: `${style.paddingLeft}px`,
        paddingRight: `${style.paddingRight}px`,
      }}
    >
      <div className="container mx-auto">
        <div className={cn("mb-12", textAlignClass)}>
          <EditableText
            value={content.heading}
            onChange={(value) => onContentUpdate({ heading: value })}
            as="h2"
            className="text-3xl font-bold text-foreground mb-4"
            placeholder="Section heading..."
          />
          <EditableText
            value={content.description}
            onChange={(value) => onContentUpdate({ description: value })}
            as="p"
            className="text-muted-foreground max-w-2xl mx-auto"
            placeholder="Section description..."
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.filter(s => s.visible).map((service) => {
            const Icon = iconMap[service.icon] || MessageCircle;
            return (
              <Card key={service.id} className="group hover:shadow-elevated transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">{service.ageRange}</Badge>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TherapistsSection({ content, onContentUpdate, style = defaultStyle }: SectionProps) {
  const textAlignClass = cn(
    style.textAlign === 'left' && 'text-left',
    style.textAlign === 'center' && 'text-center',
    style.textAlign === 'right' && 'text-right'
  );

  return (
    <section 
      className="bg-background"
      style={{
        paddingTop: `${style.paddingTop}px`,
        paddingBottom: `${style.paddingBottom}px`,
        paddingLeft: `${style.paddingLeft}px`,
        paddingRight: `${style.paddingRight}px`,
      }}
    >
      <div className="container mx-auto">
        <div className={cn("mb-12", textAlignClass)}>
          <EditableText
            value={content.heading}
            onChange={(value) => onContentUpdate({ heading: value })}
            as="h2"
            className="text-3xl font-bold text-foreground mb-4"
            placeholder="Section heading..."
          />
          <EditableText
            value={content.description}
            onChange={(value) => onContentUpdate({ description: value })}
            as="p"
            className={cn("text-muted-foreground max-w-2xl", style.textAlign === 'center' && 'mx-auto')}
            placeholder="Section description..."
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {therapists.filter(t => t.visible).map((therapist) => (
            <Card key={therapist.id} className="overflow-hidden group">
              <div className="aspect-square overflow-hidden">
                <img
                  src={therapist.photo}
                  alt={therapist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{therapist.name}</h3>
                  <Badge variant={therapist.type === 'in-house' ? 'default' : 'secondary'} className="text-[10px]">
                    {therapist.type === 'in-house' ? 'In-House' : 'Visiting'}
                  </Badge>
                </div>
                <p className="text-sm text-primary font-medium mb-1">{therapist.specialization}</p>
                <p className="text-xs text-muted-foreground">{therapist.experience} experience</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ content, onContentUpdate, style = defaultStyle }: SectionProps) {
  const textAlignClass = cn(
    style.textAlign === 'left' && 'text-left',
    style.textAlign === 'center' && 'text-center',
    style.textAlign === 'right' && 'text-right'
  );

  return (
    <section 
      className="bg-muted/50"
      style={{
        paddingTop: `${style.paddingTop}px`,
        paddingBottom: `${style.paddingBottom}px`,
        paddingLeft: `${style.paddingLeft}px`,
        paddingRight: `${style.paddingRight}px`,
      }}
    >
      <div className="container mx-auto">
        <div className={cn("mb-12", textAlignClass)}>
          <EditableText
            value={content.heading}
            onChange={(value) => onContentUpdate({ heading: value })}
            as="h2"
            className="text-3xl font-bold text-foreground mb-4"
            placeholder="Section heading..."
          />
          <EditableText
            value={content.description}
            onChange={(value) => onContentUpdate({ description: value })}
            as="p"
            className="text-muted-foreground max-w-2xl mx-auto"
            placeholder="Section description..."
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
            >
              <img
                src={item.url}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="w-5 h-5 text-foreground ml-0.5" />
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="absolute bottom-3 left-3 text-white text-sm font-medium">{item.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingSection({ content, onContentUpdate }: SectionProps) {
  return (
    <section className="py-16 px-6 bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-4xl text-center">
        <Calendar className="w-12 h-12 mx-auto mb-6 opacity-80" />
        <EditableText
          value={content.heading}
          onChange={(value) => onContentUpdate({ heading: value })}
          as="h2"
          className="text-3xl font-bold mb-4"
          placeholder="Section heading..."
        />
        <EditableText
          value={content.subheading || "Book a consultation with one of our expert therapists today."}
          onChange={(value) => onContentUpdate({ subheading: value })}
          as="p"
          className="text-lg mb-8 opacity-90"
          placeholder="Section description..."
        />
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="bg-white text-primary hover:bg-white/90">
            Book Online
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            Call Us Now
          </Button>
        </div>
      </div>
    </section>
  );
}

function AnalyticsSection({ content, onContentUpdate }: SectionProps) {
  const handleStatUpdate = (index: number, field: 'value' | 'label', value: string) => {
    const newStats = [...(content.stats || [])];
    newStats[index] = { ...newStats[index], [field]: value };
    onContentUpdate({ stats: newStats });
  };

  return (
    <section className="py-16 px-6 bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {content.stats?.map((stat: any, index: number) => (
            <div key={index} className="text-center">
              <EditableText
                value={stat.value}
                onChange={(value) => handleStatUpdate(index, 'value', value)}
                as="p"
                className="text-4xl font-bold text-primary mb-2"
                placeholder="0"
              />
              <EditableText
                value={stat.label}
                onChange={(value) => handleStatUpdate(index, 'label', value)}
                as="p"
                className="text-muted-foreground"
                placeholder="Label..."
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ content, onContentUpdate }: SectionProps) {
  const featuredReviews = reviews.filter(r => r.approved && r.featured);

  return (
    <section className="py-16 px-6 bg-muted/50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <EditableText
            value={content.heading}
            onChange={(value) => onContentUpdate({ heading: value })}
            as="h2"
            className="text-3xl font-bold text-foreground mb-4"
            placeholder="Section heading..."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredReviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-4 h-4',
                      i < review.rating ? 'text-warning fill-warning' : 'text-muted'
                    )}
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">"{review.content}"</p>
              <p className="text-xs text-muted-foreground">
                {new Date(review.date).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection({ content, onContentUpdate }: SectionProps) {
  return (
    <section className="py-16 px-6 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <EditableText
            value={content.heading}
            onChange={(value) => onContentUpdate({ heading: value })}
            as="h2"
            className="text-3xl font-bold text-foreground mb-4"
            placeholder="Section heading..."
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPackages.filter(p => p.visible).map((pkg) => (
            <Card key={pkg.id} className="p-6 hover:shadow-elevated transition-shadow">
              <Badge variant="secondary" className="mb-4 capitalize">{pkg.type}</Badge>
              <h3 className="font-semibold text-lg mb-2">{pkg.name}</h3>
              <p className="text-3xl font-bold text-primary mb-4">
                ${pkg.price}
                {pkg.type === 'session' && <span className="text-sm font-normal text-muted-foreground">/session</span>}
                {pkg.type === 'monthly' && <span className="text-sm font-normal text-muted-foreground">/month</span>}
              </p>
              <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
              <ul className="space-y-2 mb-6">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant="outline">
                {pkg.type === 'custom' ? 'Request Quote' : 'Book Now'}
              </Button>
            </Card>
          ))}
        </div>

        {content.disclaimer && (
          <EditableText
            value={content.disclaimer}
            onChange={(value) => onContentUpdate({ disclaimer: value })}
            as="p"
            className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto"
            placeholder="Disclaimer text..."
          />
        )}
      </div>
    </section>
  );
}

function LearningSection({ content, onContentUpdate }: SectionProps) {
  return (
    <section className="py-16 px-6 bg-muted/50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <EditableText
            value={content.heading}
            onChange={(value) => onContentUpdate({ heading: value })}
            as="h2"
            className="text-3xl font-bold text-foreground mb-4"
            placeholder="Section heading..."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {content.modules?.map((module: any) => (
            <Card key={module.id} className="overflow-hidden group cursor-pointer">
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={module.thumbnail}
                  alt={module.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {module.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-4 h-4 text-foreground ml-0.5" />
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <Badge variant="secondary" className="text-xs mb-2 capitalize">{module.type}</Badge>
                <h3 className="font-semibold">{module.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ content, onContentUpdate }: SectionProps) {
  return (
    <section className="py-16 px-6 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <EditableText
            value={content.heading}
            onChange={(value) => onContentUpdate({ heading: value })}
            as="h2"
            className="text-3xl font-bold text-foreground mb-4"
            placeholder="Section heading..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-muted-foreground">{cdcData.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground">{cdcData.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Address</p>
                <p className="text-muted-foreground">{cdcData.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Working Hours</p>
                <p className="text-muted-foreground">{cdcData.workingHours}</p>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-xl h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Google Maps Embed</p>
          </div>
        </div>

        {content.showParkingInfo && content.parkingInfo && (
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Parking:</strong>{' '}
              <EditableText
                value={content.parkingInfo}
                onChange={(value) => onContentUpdate({ parkingInfo: value })}
                placeholder="Parking information..."
              />
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function FooterSection({ content }: SectionProps) {
  return (
    <footer className="py-12 px-6 bg-foreground text-background">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">BH</span>
              </div>
              <span className="font-semibold">{cdcData.name}</span>
            </div>
            <p className="text-sm opacity-70">{cdcData.tagline}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="#" className="hover:opacity-100">About Us</a></li>
              <li><a href="#" className="hover:opacity-100">Services</a></li>
              <li><a href="#" className="hover:opacity-100">Our Team</a></li>
              <li><a href="#" className="hover:opacity-100">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="#" className="hover:opacity-100">Speech Therapy</a></li>
              <li><a href="#" className="hover:opacity-100">Occupational Therapy</a></li>
              <li><a href="#" className="hover:opacity-100">Behavioral Therapy</a></li>
              <li><a href="#" className="hover:opacity-100">Early Intervention</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="#" className="hover:opacity-100">Privacy Policy</a></li>
              <li><a href="#" className="hover:opacity-100">Terms of Service</a></li>
              <li><a href="#" className="hover:opacity-100">HIPAA Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm opacity-70">
            © {new Date().getFullYear()} {cdcData.name}. All rights reserved.
          </p>
          {content.manoNiketanBranding && (
            <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
              Powered by ManoNiketan
            </Badge>
          )}
        </div>
      </div>
    </footer>
  );
}
