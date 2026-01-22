import React, { useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { useEditor, SiteSettings } from '@/contexts/EditorContext';
import { cn } from '@/lib/utils';
import { cdcData, services, therapists, galleryItems, reviews, pricingPackages } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';
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
  X,
  Move,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  MessageCircle,
  Hand,
  Brain,
  Baby,
  Sparkles,
  Users,
};

interface SectionStyle {
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  textAlign: 'left' | 'center' | 'right';
  backgroundColor: string;
  customBackgroundColor?: string;
  backgroundType: 'color' | 'gradient' | 'image';
  backgroundImage?: string;
  fontFamily?: string;
  headingFontFamily?: string;
  fontSize?: 'small' | 'medium' | 'large';
  textColor?: string;
  customTextColor?: string;
}

interface SectionProps {
  content: any;
  sectionId: string;
  onContentUpdate: (content: Record<string, any>) => void;
  style?: SectionStyle;
  siteSettings?: SiteSettings;
  onUpdateSiteSettings?: (settings: Partial<SiteSettings>) => void;
}

const defaultStyle: SectionStyle = {
  paddingTop: 64,
  paddingBottom: 64,
  paddingLeft: 24,
  paddingRight: 24,
  textAlign: 'center' as const,
  backgroundColor: 'transparent',
  backgroundType: 'color' as const,
};

// Helper function to get background color from style
const getBackgroundColor = (style: SectionStyle): string | undefined => {
  if (style.backgroundColor === 'custom' && style.customBackgroundColor) {
    return style.customBackgroundColor;
  }
  return undefined;
};

// Helper function to get text color from style
const getTextColor = (style: SectionStyle): string | undefined => {
  if (style.textColor === 'custom' && style.customTextColor) {
    return style.customTextColor;
  }
  return undefined;
};

// Helper function to get font size class
const getFontSizeClass = (fontSize?: 'small' | 'medium' | 'large') => {
  switch (fontSize) {
    case 'small': return 'text-sm';
    case 'large': return 'text-lg';
    default: return 'text-base';
  }
};

// Helper function to build section inline styles
const getSectionStyles = (style: SectionStyle): React.CSSProperties => {
  const styles: React.CSSProperties = {
    paddingTop: `${style.paddingTop}px`,
    paddingBottom: `${style.paddingBottom}px`,
    paddingLeft: `${style.paddingLeft}px`,
    paddingRight: `${style.paddingRight}px`,
  };

  // Apply custom background color
  const bgColor = getBackgroundColor(style);
  if (bgColor) {
    styles.backgroundColor = bgColor;
  }

  // Apply custom text color
  const textColor = getTextColor(style);
  if (textColor) {
    styles.color = textColor;
  }

  // Apply font family
  if (style.fontFamily) {
    styles.fontFamily = style.fontFamily;
  }

  return styles;
};

// Helper function to get background class when not using custom color
const getBackgroundClass = (style: SectionStyle, defaultClass: string = 'bg-background'): string => {
  if (style.backgroundColor === 'custom' && style.customBackgroundColor) {
    return ''; // Using inline style instead
  }
  switch (style.backgroundColor) {
    case 'primary': return 'bg-primary text-primary-foreground';
    case 'secondary': return 'bg-secondary';
    case 'muted': return 'bg-muted';
    case 'transparent': return defaultClass;
    default: return defaultClass;
  }
};

export interface EditorCanvasRef {
  scrollToSection: (sectionId: string) => void;
}

export const EditorCanvas = forwardRef<EditorCanvasRef>(function EditorCanvas(_, ref) {
  const { sections, state, siteSettings, setSelectedSection, updateSectionContent, updateSiteSettings } = useEditor();
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = useCallback((sectionId: string) => {
    const sectionElement = sectionRefs.current.get(sectionId);
    if (sectionElement && containerRef.current) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useImperativeHandle(ref, () => ({
    scrollToSection,
  }), [scrollToSection]);

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
      ref={containerRef}
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
            ref={(el) => {
              if (el) sectionRefs.current.set(section.id, el);
            }}
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
            {section.type === 'hero' && <HeroSection content={section.content} sectionId={section.id} onContentUpdate={handleContentUpdate(section.id)} style={section.style || defaultStyle} siteSettings={siteSettings} onUpdateSiteSettings={updateSiteSettings} />}
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
});

function HeroSection({ content, onContentUpdate, style = defaultStyle, siteSettings, onUpdateSiteSettings }: SectionProps) {
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

  const positionOptions: Array<SiteSettings['heroLogoPosition']> = [
    'top-left', 'top-center', 'top-right',
    'center-left', 'center', 'center-right',
    'bottom-left', 'bottom-center', 'bottom-right'
  ];

  const handlePositionChange = (position: SiteSettings['heroLogoPosition']) => {
    onUpdateSiteSettings?.({ heroLogoPosition: position });
  };

  const handleRemoveLogo = () => {
    onUpdateSiteSettings?.({ showLogoInHero: false });
  };

  const handleBackgroundImageChange = (newImage: string) => {
    onContentUpdate({ backgroundImage: newImage });
  };

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
      {/* Movable Logo in Hero */}
      {siteSettings?.showLogoInHero && siteSettings.logo && (
        <div 
          className={cn(
            'absolute z-20 group',
            getLogoPositionClasses(siteSettings.heroLogoPosition || 'top-left')
          )}
        >
          <div className="relative">
            <img 
              src={siteSettings.logo} 
              alt="Site logo" 
              className={cn('object-contain', logoSizeClass)}
            />
            {/* Logo Controls on Hover */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-background/95 rounded-lg shadow-elevated p-1 border border-border">
              {/* Position Grid */}
              <div className="flex flex-wrap w-[78px] gap-0.5">
                {positionOptions.map((pos) => (
                  <button
                    key={pos}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePositionChange(pos);
                    }}
                    className={cn(
                      'w-6 h-6 rounded flex items-center justify-center transition-all duration-150',
                      'active:scale-90 active:translate-y-0.5',
                      siteSettings.heroLogoPosition === pos 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:scale-105'
                    )}
                    title={pos.replace('-', ' ')}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                  </button>
                ))}
              </div>
              <div className="w-px h-6 bg-border mx-1" />
              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveLogo();
                }}
                className="w-6 h-6 rounded flex items-center justify-center bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
                title="Hide logo from hero"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            {/* Move indicator */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge variant="secondary" className="text-[10px] gap-1 bg-background/95 shadow-sm">
                <Move className="w-3 h-3" />
                Click to move
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Background Image Editor */}
      <div className="absolute top-4 right-4 z-20 group/bg">
        <div className="bg-background/90 backdrop-blur-sm rounded-lg shadow-lg border border-border p-1.5 flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-xs font-medium text-foreground px-2 hidden group-hover/bg:inline">Background</span>
          <EditableImage
            src={content.backgroundImage || ''}
            alt="Hero background"
            onChange={handleBackgroundImageChange}
            className="w-8 h-8 rounded"
            showOverlay={false}
            placeholder=""
          />
        </div>
      </div>

      <div className={cn("container mx-auto px-6 text-white flex flex-col", textAlignClass)}>
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

  const bgClass = getBackgroundClass(style, 'bg-background');
  const sectionStyles = getSectionStyles(style);
  const headingStyle: React.CSSProperties = style.headingFontFamily ? { fontFamily: style.headingFontFamily } : {};
  const textColorStyle: React.CSSProperties = getTextColor(style) ? { color: getTextColor(style) } : {};

  // Initialize cards if not present
  const cards = content.cards || [
    { title: `${content.yearsExperience || 10}+ Years`, subtitle: 'Of Excellence', icon: 'award' },
    { title: 'Expert Team', subtitle: 'Certified Specialists', icon: 'users' },
    { title: 'Verified', subtitle: content.manoNiketanVerified ? 'ManoNiketan Certified' : 'Quality Assured', icon: 'check' }
  ];

  const handleCardUpdate = (index: number, field: 'title' | 'subtitle', value: string) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    onContentUpdate({ cards: newCards });
  };

  return (
    <section 
      className={cn("bg-background", bgClass, getFontSizeClass(style.fontSize))}
      style={sectionStyles}
    >
      <div className="container mx-auto max-w-4xl">
        <div className={cn("mb-12", textAlignClass)}>
          <EditableText
            value={content.heading || "About Our Center"}
            onChange={(value) => onContentUpdate({ heading: value })}
            as="h2"
            className="text-3xl font-bold mb-4"
            style={{ ...headingStyle, ...textColorStyle }}
            placeholder="Section heading..."
          />
          <EditableText
            value={content.mission}
            onChange={(value) => onContentUpdate({ mission: value })}
            as="p"
            className={cn("max-w-2xl", style.textAlign === 'center' && 'mx-auto', !getTextColor(style) && 'text-muted-foreground')}
            style={textColorStyle}
            placeholder="Enter mission statement..."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2" style={textColorStyle}>
              <EditableText
                value={cards[0]?.title || "10+ Years"}
                onChange={(value) => handleCardUpdate(0, 'title', value)}
                placeholder="Card title..."
              />
            </h3>
            <p className="text-sm text-muted-foreground">
              <EditableText
                value={cards[0]?.subtitle || "Of Excellence"}
                onChange={(value) => handleCardUpdate(0, 'subtitle', value)}
                placeholder="Card subtitle..."
              />
            </p>
          </Card>
          <Card className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2" style={textColorStyle}>
              <EditableText
                value={cards[1]?.title || "Expert Team"}
                onChange={(value) => handleCardUpdate(1, 'title', value)}
                placeholder="Card title..."
              />
            </h3>
            <p className="text-sm text-muted-foreground">
              <EditableText
                value={cards[1]?.subtitle || "Certified Specialists"}
                onChange={(value) => handleCardUpdate(1, 'subtitle', value)}
                placeholder="Card subtitle..."
              />
            </p>
          </Card>
          <Card className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold mb-2" style={textColorStyle}>
              <EditableText
                value={cards[2]?.title || "Verified"}
                onChange={(value) => handleCardUpdate(2, 'title', value)}
                placeholder="Card title..."
              />
            </h3>
            <p className="text-sm text-muted-foreground">
              <EditableText
                value={cards[2]?.subtitle || "Quality Assured"}
                onChange={(value) => handleCardUpdate(2, 'subtitle', value)}
                placeholder="Card subtitle..."
              />
            </p>
          </Card>
        </div>

        <div className="bg-muted rounded-xl p-6">
          <h3 className="font-semibold mb-3" style={textColorStyle}>
            <EditableText
              value={content.philosophyTitle || "Our Philosophy"}
              onChange={(value) => onContentUpdate({ philosophyTitle: value })}
              placeholder="Philosophy title..."
            />
          </h3>
          <EditableText
            value={content.philosophy}
            onChange={(value) => onContentUpdate({ philosophy: value })}
            as="p"
            className={!getTextColor(style) ? "text-muted-foreground" : ""}
            style={textColorStyle}
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

  const bgClass = getBackgroundClass(style, 'bg-muted/50');
  const sectionStyles = getSectionStyles(style);
  const headingStyle: React.CSSProperties = style.headingFontFamily ? { fontFamily: style.headingFontFamily } : {};
  const textColorStyle: React.CSSProperties = getTextColor(style) ? { color: getTextColor(style) } : {};

  return (
    <section 
      className={cn(bgClass, getFontSizeClass(style.fontSize))}
      style={sectionStyles}
    >
      <div className="container mx-auto">
        <div className={cn("mb-12", textAlignClass)}>
          <EditableText
            value={content.heading}
            onChange={(value) => onContentUpdate({ heading: value })}
            as="h2"
            className="text-3xl font-bold mb-4"
            style={{ ...headingStyle, ...textColorStyle }}
            placeholder="Section heading..."
          />
          <EditableText
            value={content.description}
            onChange={(value) => onContentUpdate({ description: value })}
            as="p"
            className={cn("max-w-2xl mx-auto", !getTextColor(style) && "text-muted-foreground")}
            style={textColorStyle}
            placeholder="Section description..."
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(content.services || services.filter(s => s.visible)).map((service: any, index: number) => {
            const Icon = iconMap[service.icon] || MessageCircle;
            
            const handleServiceUpdate = (field: string, value: string) => {
              const currentServices = content.services || services.filter(s => s.visible);
              const newServices = [...currentServices];
              newServices[index] = { ...newServices[index], [field]: value };
              onContentUpdate({ services: newServices });
            };

            return (
              <Card key={service.id} className="group hover:shadow-elevated transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    <EditableText
                      value={service.name}
                      onChange={(value) => handleServiceUpdate('name', value)}
                      placeholder="Service name..."
                    />
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    <EditableText
                      value={service.description}
                      onChange={(value) => handleServiceUpdate('description', value)}
                      placeholder="Service description..."
                    />
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      <EditableText
                        value={service.ageRange}
                        onChange={(value) => handleServiceUpdate('ageRange', value)}
                        placeholder="Age range..."
                      />
                    </Badge>
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

  const bgClass = getBackgroundClass(style, 'bg-background');
  const sectionStyles = getSectionStyles(style);
  const headingStyle: React.CSSProperties = style.headingFontFamily ? { fontFamily: style.headingFontFamily } : {};
  const textColorStyle: React.CSSProperties = getTextColor(style) ? { color: getTextColor(style) } : {};

  return (
    <section 
      className={cn(bgClass, getFontSizeClass(style.fontSize))}
      style={sectionStyles}
    >
      <div className="container mx-auto">
        <div className={cn("mb-12", textAlignClass)}>
          <EditableText
            value={content.heading}
            onChange={(value) => onContentUpdate({ heading: value })}
            as="h2"
            className="text-3xl font-bold mb-4"
            style={{ ...headingStyle, ...textColorStyle }}
            placeholder="Section heading..."
          />
          <EditableText
            value={content.description}
            onChange={(value) => onContentUpdate({ description: value })}
            as="p"
            className={cn("max-w-2xl", style.textAlign === 'center' && 'mx-auto', !getTextColor(style) && "text-muted-foreground")}
            style={textColorStyle}
            placeholder="Section description..."
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(content.therapists || therapists.filter(t => t.visible)).map((therapist: any, index: number) => {
            const handleTherapistUpdate = (field: string, value: string) => {
              const currentTherapists = content.therapists || therapists.filter(t => t.visible);
              const newTherapists = [...currentTherapists];
              newTherapists[index] = { ...newTherapists[index], [field]: value };
              onContentUpdate({ therapists: newTherapists });
            };

            return (
              <Card key={therapist.id} className="overflow-hidden group">
                <EditableImage
                  src={therapist.photo}
                  alt={therapist.name}
                  onChange={(value) => handleTherapistUpdate('photo', value)}
                  className="aspect-square"
                  aspectRatio="square"
                  placeholder="Add therapist photo"
                />
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">
                      <EditableText
                        value={therapist.name}
                        onChange={(value) => handleTherapistUpdate('name', value)}
                        placeholder="Name..."
                      />
                    </h3>
                    <Badge variant={therapist.type === 'in-house' ? 'default' : 'secondary'} className="text-[10px]">
                      {therapist.type === 'in-house' ? 'In-House' : 'Visiting'}
                    </Badge>
                  </div>
                  <p className="text-sm text-primary font-medium mb-1">
                    <EditableText
                      value={therapist.specialization}
                      onChange={(value) => handleTherapistUpdate('specialization', value)}
                      placeholder="Specialization..."
                    />
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <EditableText
                      value={therapist.experience}
                      onChange={(value) => handleTherapistUpdate('experience', value)}
                      placeholder="Experience..."
                    /> experience
                  </p>
                </CardContent>
              </Card>
            );
          })}
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

  const bgClass = getBackgroundClass(style, 'bg-muted/50');
  const sectionStyles = getSectionStyles(style);
  const headingStyle: React.CSSProperties = style.headingFontFamily ? { fontFamily: style.headingFontFamily } : {};
  const textColorStyle: React.CSSProperties = getTextColor(style) ? { color: getTextColor(style) } : {};

  return (
    <section 
      className={cn(bgClass, getFontSizeClass(style.fontSize))}
      style={sectionStyles}
    >
      <div className="container mx-auto">
        <div className={cn("mb-12", textAlignClass)}>
          <EditableText
            value={content.heading}
            onChange={(value) => onContentUpdate({ heading: value })}
            as="h2"
            className="text-3xl font-bold mb-4"
            style={{ ...headingStyle, ...textColorStyle }}
            placeholder="Section heading..."
          />
          <EditableText
            value={content.description}
            onChange={(value) => onContentUpdate({ description: value })}
            as="p"
            className={cn("max-w-2xl mx-auto", !getTextColor(style) && "text-muted-foreground")}
            style={textColorStyle}
            placeholder="Section description..."
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(content.gallery || galleryItems).map((item: any, index: number) => {
            const handleGalleryUpdate = (field: string, value: string) => {
              const currentGallery = content.gallery || galleryItems;
              const newGallery = [...currentGallery];
              newGallery[index] = { ...newGallery[index], [field]: value };
              onContentUpdate({ gallery: newGallery });
            };

            return (
              <div
                key={item.id}
                className="relative rounded-xl overflow-hidden"
              >
                <EditableImage
                  src={item.url}
                  alt={item.alt}
                  onChange={(value) => handleGalleryUpdate('url', value)}
                  onAltChange={(value) => handleGalleryUpdate('alt', value)}
                  className="aspect-[4/3]"
                  placeholder="Add gallery image"
                />
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-5 h-5 text-foreground ml-0.5" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BookingSection({ content, onContentUpdate, style = defaultStyle }: SectionProps) {
  const bgClass = getBackgroundClass(style, 'bg-primary text-primary-foreground');
  const sectionStyles = getSectionStyles(style);
  const headingStyle: React.CSSProperties = style.headingFontFamily ? { fontFamily: style.headingFontFamily } : {};
  const textColorStyle: React.CSSProperties = getTextColor(style) ? { color: getTextColor(style) } : {};

  return (
    <section 
      className={cn(bgClass, getFontSizeClass(style.fontSize))}
      style={sectionStyles}
    >
      <div className="container mx-auto max-w-4xl text-center">
        <Calendar className="w-12 h-12 mx-auto mb-6 opacity-80" />
        <EditableText
          value={content.heading}
          onChange={(value) => onContentUpdate({ heading: value })}
          as="h2"
          className="text-3xl font-bold mb-4"
          style={{ ...headingStyle, ...textColorStyle }}
          placeholder="Section heading..."
        />
        <EditableText
          value={content.subheading || "Book a consultation with one of our expert therapists today."}
          onChange={(value) => onContentUpdate({ subheading: value })}
          as="p"
          className="text-lg mb-8 opacity-90"
          style={textColorStyle}
          placeholder="Section description..."
        />
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="bg-white text-primary hover:bg-white/90">
            <EditableText
              value={content.primaryButtonText || "Book Online"}
              onChange={(value) => onContentUpdate({ primaryButtonText: value })}
              placeholder="Button text..."
            />
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            <EditableText
              value={content.secondaryButtonText || "Call Us Now"}
              onChange={(value) => onContentUpdate({ secondaryButtonText: value })}
              placeholder="Button text..."
            />
          </Button>
        </div>
      </div>
    </section>
  );
}

function AnalyticsSection({ content, onContentUpdate, style = defaultStyle }: SectionProps) {
  const bgClass = getBackgroundClass(style, 'bg-background');
  const sectionStyles = getSectionStyles(style);
  const textColorStyle: React.CSSProperties = getTextColor(style) ? { color: getTextColor(style) } : {};

  const handleStatUpdate = (index: number, field: 'value' | 'label', value: string) => {
    const newStats = [...(content.stats || [])];
    newStats[index] = { ...newStats[index], [field]: value };
    onContentUpdate({ stats: newStats });
  };

  return (
    <section 
      className={cn(bgClass, getFontSizeClass(style.fontSize))}
      style={sectionStyles}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {content.stats?.map((stat: any, index: number) => (
            <div key={index} className="text-center">
              <EditableText
                value={stat.value}
                onChange={(value) => handleStatUpdate(index, 'value', value)}
                as="p"
                className={cn("text-4xl font-bold mb-2", !getTextColor(style) && "text-primary")}
                style={textColorStyle}
                placeholder="0"
              />
              <EditableText
                value={stat.label}
                onChange={(value) => handleStatUpdate(index, 'label', value)}
                as="p"
                className={!getTextColor(style) ? "text-muted-foreground" : ""}
                style={textColorStyle}
                placeholder="Label..."
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ content, onContentUpdate, style = defaultStyle }: SectionProps) {
  const bgClass = getBackgroundClass(style, 'bg-muted/50');
  const sectionStyles = getSectionStyles(style);
  const headingStyle: React.CSSProperties = style.headingFontFamily ? { fontFamily: style.headingFontFamily } : {};
  const textColorStyle: React.CSSProperties = getTextColor(style) ? { color: getTextColor(style) } : {};

  // Use content.testimonials if available, otherwise fall back to featured reviews
  const testimonials = content.testimonials || reviews.filter(r => r.approved && r.featured);

  const handleTestimonialUpdate = (index: number, field: string, value: any) => {
    const newTestimonials = [...testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    onContentUpdate({ testimonials: newTestimonials });
  };

  return (
    <section 
      className={cn(bgClass, getFontSizeClass(style.fontSize))}
      style={sectionStyles}
    >
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <EditableText
            value={content.heading}
            onChange={(value) => onContentUpdate({ heading: value })}
            as="h2"
            className="text-3xl font-bold mb-4"
            style={{ ...headingStyle, ...textColorStyle }}
            placeholder="Section heading..."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((review: any, index: number) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-4 h-4 cursor-pointer',
                      i < review.rating ? 'text-warning fill-warning' : 'text-muted'
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTestimonialUpdate(index, 'rating', i + 1);
                    }}
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "<EditableText
                  value={review.content}
                  onChange={(value) => handleTestimonialUpdate(index, 'content', value)}
                  placeholder="Testimonial text..."
                />"
              </p>
              <p className="text-xs text-muted-foreground">
                <EditableText
                  value={review.author || new Date(review.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  onChange={(value) => handleTestimonialUpdate(index, 'author', value)}
                  placeholder="Author or date..."
                />
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection({ content, onContentUpdate, style = defaultStyle }: SectionProps) {
  const bgClass = getBackgroundClass(style, 'bg-background');
  const sectionStyles = getSectionStyles(style);
  const headingStyle: React.CSSProperties = style.headingFontFamily ? { fontFamily: style.headingFontFamily } : {};
  const textColorStyle: React.CSSProperties = getTextColor(style) ? { color: getTextColor(style) } : {};

  return (
    <section 
      className={cn(bgClass, getFontSizeClass(style.fontSize))}
      style={sectionStyles}
    >
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <EditableText
            value={content.heading}
            onChange={(value) => onContentUpdate({ heading: value })}
            as="h2"
            className="text-3xl font-bold mb-4"
            style={{ ...headingStyle, ...textColorStyle }}
            placeholder="Section heading..."
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(content.packages || pricingPackages.filter(p => p.visible)).map((pkg: any, index: number) => {
            const handlePackageUpdate = (field: string, value: any) => {
              const currentPackages = content.packages || pricingPackages.filter(p => p.visible);
              const newPackages = [...currentPackages];
              newPackages[index] = { ...newPackages[index], [field]: value };
              onContentUpdate({ packages: newPackages });
            };

            const handleFeatureUpdate = (featureIndex: number, value: string) => {
              const currentPackages = content.packages || pricingPackages.filter(p => p.visible);
              const newPackages = [...currentPackages];
              const newFeatures = [...(newPackages[index].features || [])];
              newFeatures[featureIndex] = value;
              newPackages[index] = { ...newPackages[index], features: newFeatures };
              onContentUpdate({ packages: newPackages });
            };

            return (
              <Card key={pkg.id} className="p-6 hover:shadow-elevated transition-shadow">
                <Badge variant="secondary" className="mb-4 capitalize">{pkg.type}</Badge>
                <h3 className="font-semibold text-lg mb-2">
                  <EditableText
                    value={pkg.name}
                    onChange={(value) => handlePackageUpdate('name', value)}
                    placeholder="Package name..."
                  />
                </h3>
                <p className="text-3xl font-bold text-primary mb-4">
                  $<EditableText
                    value={String(pkg.price)}
                    onChange={(value) => handlePackageUpdate('price', parseFloat(value) || 0)}
                    placeholder="0"
                  />
                  {pkg.type === 'session' && <span className="text-sm font-normal text-muted-foreground">/session</span>}
                  {pkg.type === 'monthly' && <span className="text-sm font-normal text-muted-foreground">/month</span>}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  <EditableText
                    value={pkg.description}
                    onChange={(value) => handlePackageUpdate('description', value)}
                    placeholder="Description..."
                  />
                </p>
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <EditableText
                        value={feature}
                        onChange={(value) => handleFeatureUpdate(i, value)}
                        placeholder="Feature..."
                      />
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline">
                  <EditableText
                    value={pkg.buttonText || (pkg.type === 'custom' ? 'Request Quote' : 'Book Now')}
                    onChange={(value) => handlePackageUpdate('buttonText', value)}
                    placeholder="Button text..."
                  />
                </Button>
              </Card>
            );
          })}
        </div>

        {content.disclaimer && (
          <EditableText
            value={content.disclaimer}
            onChange={(value) => onContentUpdate({ disclaimer: value })}
            as="p"
            className={cn("text-center text-sm mt-8 max-w-2xl mx-auto", !getTextColor(style) && "text-muted-foreground")}
            style={textColorStyle}
            placeholder="Disclaimer text..."
          />
        )}
      </div>
    </section>
  );
}

function LearningSection({ content, onContentUpdate, style = defaultStyle }: SectionProps) {
  const bgClass = getBackgroundClass(style, 'bg-muted/50');
  const sectionStyles = getSectionStyles(style);
  const headingStyle: React.CSSProperties = style.headingFontFamily ? { fontFamily: style.headingFontFamily } : {};
  const textColorStyle: React.CSSProperties = getTextColor(style) ? { color: getTextColor(style) } : {};

  return (
    <section 
      className={cn(bgClass, getFontSizeClass(style.fontSize))}
      style={sectionStyles}
    >
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <EditableText
            value={content.heading}
            onChange={(value) => onContentUpdate({ heading: value })}
            as="h2"
            className="text-3xl font-bold mb-4"
            style={{ ...headingStyle, ...textColorStyle }}
            placeholder="Section heading..."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {content.modules?.map((module: any, index: number) => {
            const handleModuleUpdate = (field: string, value: string) => {
              const newModules = [...(content.modules || [])];
              newModules[index] = { ...newModules[index], [field]: value };
              onContentUpdate({ modules: newModules });
            };

            return (
              <Card key={module.id} className="overflow-hidden group cursor-pointer">
                <div className="relative">
                  <EditableImage
                    src={module.thumbnail}
                    alt={module.title}
                    onChange={(value) => handleModuleUpdate('thumbnail', value)}
                    className="aspect-video"
                    aspectRatio="video"
                    placeholder="Add module thumbnail"
                  />
                  {module.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-4 h-4 text-foreground ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="text-xs mb-2 capitalize">{module.type}</Badge>
                  <h3 className="font-semibold">
                    <EditableText
                      value={module.title}
                      onChange={(value) => handleModuleUpdate('title', value)}
                      placeholder="Module title..."
                    />
                  </h3>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ content, onContentUpdate, style = defaultStyle }: SectionProps) {
  const bgClass = getBackgroundClass(style, 'bg-background');
  const sectionStyles = getSectionStyles(style);
  const headingStyle: React.CSSProperties = style.headingFontFamily ? { fontFamily: style.headingFontFamily } : {};
  const textColorStyle: React.CSSProperties = getTextColor(style) ? { color: getTextColor(style) } : {};

  return (
    <section 
      className={cn(bgClass, getFontSizeClass(style.fontSize))}
      style={sectionStyles}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <EditableText
            value={content.heading}
            onChange={(value) => onContentUpdate({ heading: value })}
            as="h2"
            className="text-3xl font-bold mb-4"
            style={{ ...headingStyle, ...textColorStyle }}
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
                <p className="font-medium" style={textColorStyle}>
                  <EditableText
                    value={content.phoneLabel || "Phone"}
                    onChange={(value) => onContentUpdate({ phoneLabel: value })}
                    placeholder="Label..."
                  />
                </p>
                <p className={!getTextColor(style) ? "text-muted-foreground" : ""} style={textColorStyle}>
                  <EditableText
                    value={content.phone || cdcData.phone}
                    onChange={(value) => onContentUpdate({ phone: value })}
                    placeholder="Phone number..."
                  />
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium" style={textColorStyle}>
                  <EditableText
                    value={content.emailLabel || "Email"}
                    onChange={(value) => onContentUpdate({ emailLabel: value })}
                    placeholder="Label..."
                  />
                </p>
                <p className={!getTextColor(style) ? "text-muted-foreground" : ""} style={textColorStyle}>
                  <EditableText
                    value={content.email || cdcData.email}
                    onChange={(value) => onContentUpdate({ email: value })}
                    placeholder="Email address..."
                  />
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium" style={textColorStyle}>
                  <EditableText
                    value={content.addressLabel || "Address"}
                    onChange={(value) => onContentUpdate({ addressLabel: value })}
                    placeholder="Label..."
                  />
                </p>
                <p className={!getTextColor(style) ? "text-muted-foreground" : ""} style={textColorStyle}>
                  <EditableText
                    value={content.address || cdcData.address}
                    onChange={(value) => onContentUpdate({ address: value })}
                    placeholder="Address..."
                  />
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium" style={textColorStyle}>
                  <EditableText
                    value={content.hoursLabel || "Working Hours"}
                    onChange={(value) => onContentUpdate({ hoursLabel: value })}
                    placeholder="Label..."
                  />
                </p>
                <p className={!getTextColor(style) ? "text-muted-foreground" : ""} style={textColorStyle}>
                  <EditableText
                    value={content.workingHours || cdcData.workingHours}
                    onChange={(value) => onContentUpdate({ workingHours: value })}
                    placeholder="Working hours..."
                  />
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-xl h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Google Maps Embed</p>
          </div>
        </div>

        {content.showParkingInfo && content.parkingInfo && (
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm" style={textColorStyle}>
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

function FooterSection({ content, onContentUpdate, style = defaultStyle }: SectionProps) {
  const sectionStyles = getSectionStyles(style);
  const textColorStyle: React.CSSProperties = getTextColor(style) ? { color: getTextColor(style) } : {};
  const hasCustomBg = style.backgroundColor === 'custom' && style.customBackgroundColor;

  // Initialize footer links if not present
  const quickLinks = content.quickLinks || [
    { text: 'About Us', href: '#' },
    { text: 'Services', href: '#' },
    { text: 'Our Team', href: '#' },
    { text: 'Contact', href: '#' }
  ];

  const serviceLinks = content.serviceLinks || [
    { text: 'Speech Therapy', href: '#' },
    { text: 'Occupational Therapy', href: '#' },
    { text: 'Behavioral Therapy', href: '#' },
    { text: 'Early Intervention', href: '#' }
  ];

  const legalLinks = content.legalLinks || [
    { text: 'Privacy Policy', href: '#' },
    { text: 'Terms of Service', href: '#' },
    { text: 'HIPAA Compliance', href: '#' }
  ];

  const handleLinkUpdate = (section: 'quickLinks' | 'serviceLinks' | 'legalLinks', index: number, value: string) => {
    const links = section === 'quickLinks' ? [...quickLinks] : section === 'serviceLinks' ? [...serviceLinks] : [...legalLinks];
    links[index] = { ...links[index], text: value };
    onContentUpdate({ [section]: links });
  };

  return (
    <footer 
      className={cn(
        getFontSizeClass(style.fontSize),
        !hasCustomBg && "bg-foreground text-background"
      )}
      style={sectionStyles}
    >
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  <EditableText
                    value={content.logoText || "BH"}
                    onChange={(value) => onContentUpdate({ logoText: value })}
                    placeholder="Logo"
                  />
                </span>
              </div>
              <span className="font-semibold" style={textColorStyle}>
                <EditableText
                  value={content.companyName || cdcData.name}
                  onChange={(value) => onContentUpdate({ companyName: value })}
                  placeholder="Company name..."
                />
              </span>
            </div>
            <p className="text-sm opacity-70" style={textColorStyle}>
              <EditableText
                value={content.tagline || cdcData.tagline}
                onChange={(value) => onContentUpdate({ tagline: value })}
                placeholder="Tagline..."
              />
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={textColorStyle}>
              <EditableText
                value={content.quickLinksTitle || "Quick Links"}
                onChange={(value) => onContentUpdate({ quickLinksTitle: value })}
                placeholder="Section title..."
              />
            </h4>
            <ul className="space-y-2 text-sm opacity-70">
              {quickLinks.map((link: any, index: number) => (
                <li key={index}>
                  <a href={link.href} className="hover:opacity-100" style={textColorStyle}>
                    <EditableText
                      value={link.text}
                      onChange={(value) => handleLinkUpdate('quickLinks', index, value)}
                      placeholder="Link text..."
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={textColorStyle}>
              <EditableText
                value={content.servicesTitle || "Services"}
                onChange={(value) => onContentUpdate({ servicesTitle: value })}
                placeholder="Section title..."
              />
            </h4>
            <ul className="space-y-2 text-sm opacity-70">
              {serviceLinks.map((link: any, index: number) => (
                <li key={index}>
                  <a href={link.href} className="hover:opacity-100" style={textColorStyle}>
                    <EditableText
                      value={link.text}
                      onChange={(value) => handleLinkUpdate('serviceLinks', index, value)}
                      placeholder="Link text..."
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={textColorStyle}>
              <EditableText
                value={content.legalTitle || "Legal"}
                onChange={(value) => onContentUpdate({ legalTitle: value })}
                placeholder="Section title..."
              />
            </h4>
            <ul className="space-y-2 text-sm opacity-70">
              {legalLinks.map((link: any, index: number) => (
                <li key={index}>
                  <a href={link.href} className="hover:opacity-100" style={textColorStyle}>
                    <EditableText
                      value={link.text}
                      onChange={(value) => handleLinkUpdate('legalLinks', index, value)}
                      placeholder="Link text..."
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm opacity-70" style={textColorStyle}>
            <EditableText
              value={content.copyright || `© ${new Date().getFullYear()} ${cdcData.name}. All rights reserved.`}
              onChange={(value) => onContentUpdate({ copyright: value })}
              placeholder="Copyright text..."
            />
          </p>
          {content.manoNiketanBranding && (
            <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
              <EditableText
                value={content.brandingText || "Powered by ManoNiketan"}
                onChange={(value) => onContentUpdate({ brandingText: value })}
                placeholder="Branding text..."
              />
            </Badge>
          )}
        </div>
      </div>
    </footer>
  );
}
