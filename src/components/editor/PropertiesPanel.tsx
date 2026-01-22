import { useEditor } from '@/contexts/EditorContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Image,
  Type,
  Palette,
  Settings2,
  Eye,
  Upload,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  X,
  Plus,
} from 'lucide-react';
import { SiteSection, SectionStyle } from '@/types/editor';
import React, { useRef } from 'react';

const defaultStyle: SectionStyle = {
  paddingTop: 64,
  paddingBottom: 64,
  paddingLeft: 24,
  paddingRight: 24,
  textAlign: 'center',
  backgroundColor: 'transparent',
  backgroundType: 'color',
};

export function PropertiesPanel() {
  const { state, sections, updateSectionContent, updateSectionStyle } = useEditor();
  
  const selectedSection = sections.find(s => s.id === state.selectedSectionId);

  if (!selectedSection) {
    return (
      <div className="h-full flex flex-col bg-editor-panel border-l border-editor-border">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Settings2 className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No Selection</p>
            <p className="text-xs text-muted-foreground mt-1">
              Click on a section in the canvas or navigator to edit its properties
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-editor-panel border-l border-editor-border">
      {/* Header */}
      <div className="p-4 border-b border-editor-border">
        <h3 className="font-semibold text-sm text-foreground">{selectedSection.title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5 capitalize">{selectedSection.type} Section</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="content" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-3 grid grid-cols-3">
          <TabsTrigger value="content" className="text-xs">
            <Type className="w-3.5 h-3.5 mr-1.5" />
            Content
          </TabsTrigger>
          <TabsTrigger value="style" className="text-xs">
            <Palette className="w-3.5 h-3.5 mr-1.5" />
            Style
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs">
            <Settings2 className="w-3.5 h-3.5 mr-1.5" />
            Settings
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          {/* Content Tab */}
          <TabsContent value="content" className="m-0">
            {selectedSection.type === 'hero' && (
              <HeroContentEditor section={selectedSection} updateContent={updateSectionContent} />
            )}
            {selectedSection.type === 'about' && (
              <AboutContentEditor section={selectedSection} updateContent={updateSectionContent} />
            )}
            {selectedSection.type === 'services' && (
              <ServicesContentEditor section={selectedSection} updateContent={updateSectionContent} />
            )}
            {selectedSection.type === 'therapists' && (
              <TherapistsContentEditor section={selectedSection} updateContent={updateSectionContent} />
            )}
            {selectedSection.type === 'gallery' && (
              <GalleryContentEditor section={selectedSection} updateContent={updateSectionContent} />
            )}
            {selectedSection.type === 'testimonials' && (
              <TestimonialsContentEditor section={selectedSection} updateContent={updateSectionContent} />
            )}
            {selectedSection.type === 'pricing' && (
              <PricingContentEditor section={selectedSection} updateContent={updateSectionContent} />
            )}
            {selectedSection.type === 'learning' && (
              <LearningContentEditor section={selectedSection} updateContent={updateSectionContent} />
            )}
            {selectedSection.type === 'contact' && (
              <ContactContentEditor section={selectedSection} updateContent={updateSectionContent} />
            )}
            {/* Default content editor for other sections */}
            {!['hero', 'about', 'services', 'therapists', 'gallery', 'testimonials', 'pricing', 'learning', 'contact'].includes(selectedSection.type) && (
              <DefaultContentEditor section={selectedSection} updateContent={updateSectionContent} />
            )}
          </TabsContent>

          {/* Style Tab */}
          <TabsContent value="style" className="m-0">
            <StyleEditor section={selectedSection} updateStyle={updateSectionStyle} />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="m-0">
            <SettingsEditor section={selectedSection} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function ImageUploader({ 
  value, 
  onChange, 
  label = "Image",
  recommendation = "Recommended: 1920×800px"
}: { 
  value: string; 
  onChange: (url: string) => void; 
  label?: string;
  recommendation?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = React.useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">{label}</Label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Preview"
            className="w-full h-24 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-3 h-3 mr-1" />
              Change
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onChange('')}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ) : (
        <div 
          className="border border-dashed border-editor-border rounded-lg p-4 text-center hover:bg-editor-hover transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">
            Click to upload
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            {recommendation}
          </p>
        </div>
      )}

      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Or paste image URL..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="text-xs"
        />
        <Button 
          size="sm" 
          variant="outline"
          disabled={!urlInput.trim()}
          onClick={() => {
            onChange(urlInput.trim());
            setUrlInput('');
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

function HeroContentEditor({ section, updateContent }: { section: any; updateContent: (id: string, content: any) => void }) {
  return (
    <div className="p-4 space-y-6">
      {/* Headline */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Headline</Label>
        <Textarea
          value={section.content.headline || ''}
          onChange={(e) => updateContent(section.id, { headline: e.target.value })}
          className="min-h-[80px] text-sm resize-none"
          placeholder="Enter your headline..."
        />
        <p className="text-[10px] text-muted-foreground">
          {(section.content.headline || '').length}/100 characters
        </p>
      </div>

      {/* Subheadline */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Subheadline</Label>
        <Textarea
          value={section.content.subheadline || ''}
          onChange={(e) => updateContent(section.id, { subheadline: e.target.value })}
          className="min-h-[60px] text-sm resize-none"
          placeholder="Enter your subheadline..."
        />
      </div>

      {/* Background Image */}
      <ImageUploader
        value={section.content.backgroundImage || ''}
        onChange={(url) => updateContent(section.id, { backgroundImage: url })}
        label="Background Image"
        recommendation="Recommended: 1920×800px"
      />

      {/* CTAs */}
      <div className="space-y-3">
        <Label className="text-xs font-medium">Call-to-Action Buttons</Label>
        {section.content.ctas?.map((cta: any, index: number) => (
          <div key={index} className="p-3 border border-editor-border rounded-lg space-y-2">
            <Input
              value={cta.text}
              onChange={(e) => {
                const newCtas = [...section.content.ctas];
                newCtas[index] = { ...cta, text: e.target.value };
                updateContent(section.id, { ctas: newCtas });
              }}
              className="text-sm"
              placeholder="Button text"
            />
            <Select value={cta.style} onValueChange={(value) => {
              const newCtas = [...section.content.ctas];
              newCtas[index] = { ...cta, style: value };
              updateContent(section.id, { ctas: newCtas });
            }}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Button style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutContentEditor({ section, updateContent }: { section: any; updateContent: (id: string, content: any) => void }) {
  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <Label className="text-xs font-medium">Mission Statement</Label>
        <Textarea
          value={section.content.mission || ''}
          onChange={(e) => updateContent(section.id, { mission: e.target.value })}
          className="min-h-[100px] text-sm resize-none"
          placeholder="Describe your mission..."
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Philosophy</Label>
        <Textarea
          value={section.content.philosophy || ''}
          onChange={(e) => updateContent(section.id, { philosophy: e.target.value })}
          className="min-h-[80px] text-sm resize-none"
          placeholder="Describe your philosophy..."
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Years of Experience</Label>
        <Input
          type="number"
          value={section.content.yearsExperience || 0}
          onChange={(e) => updateContent(section.id, { yearsExperience: parseInt(e.target.value) })}
          className="text-sm"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">ManoNiketan Verified Badge</Label>
        <Switch
          checked={section.content.manoNiketanVerified || false}
          onCheckedChange={(checked) => updateContent(section.id, { manoNiketanVerified: checked })}
        />
      </div>
    </div>
  );
}

function ServicesContentEditor({ section, updateContent }: { section: any; updateContent: (id: string, content: any) => void }) {
  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <Label className="text-xs font-medium">Section Heading</Label>
        <Input
          value={section.content.heading || ''}
          onChange={(e) => updateContent(section.id, { heading: e.target.value })}
          className="text-sm"
          placeholder="Enter heading..."
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Description</Label>
        <Textarea
          value={section.content.description || ''}
          onChange={(e) => updateContent(section.id, { description: e.target.value })}
          className="min-h-[80px] text-sm resize-none"
          placeholder="Enter description..."
        />
      </div>

      <div className="p-3 bg-muted rounded-lg">
        <p className="text-xs text-muted-foreground">
          Individual services can be managed from the <strong>Services</strong> page in the dashboard.
        </p>
        <Button variant="link" size="sm" className="p-0 h-auto mt-1 text-xs">
          Go to Services →
        </Button>
      </div>
    </div>
  );
}

function TherapistsContentEditor({ section, updateContent }: { section: any; updateContent: (id: string, content: any) => void }) {
  const therapists = section.content.therapists || [];
  
  const updateTherapist = (index: number, field: string, value: any) => {
    const newTherapists = [...therapists];
    newTherapists[index] = { ...newTherapists[index], [field]: value };
    updateContent(section.id, { therapists: newTherapists });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <Label className="text-xs font-medium">Section Heading</Label>
        <Input
          value={section.content.heading || ''}
          onChange={(e) => updateContent(section.id, { heading: e.target.value })}
          className="text-sm"
          placeholder="Meet Our Therapists"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-medium">Therapists ({therapists.length})</Label>
        {therapists.map((therapist: any, index: number) => (
          <div key={therapist.id || index} className="p-3 border border-editor-border rounded-lg space-y-3">
            <ImageUploader
              value={therapist.photo || ''}
              onChange={(url) => updateTherapist(index, 'photo', url)}
              label={`Photo - ${therapist.name || 'Therapist'}`}
              recommendation="Recommended: 300×300px"
            />
            <Input
              value={therapist.name || ''}
              onChange={(e) => updateTherapist(index, 'name', e.target.value)}
              className="text-sm"
              placeholder="Therapist name"
            />
            <Input
              value={therapist.specialization || ''}
              onChange={(e) => updateTherapist(index, 'specialization', e.target.value)}
              className="text-sm"
              placeholder="Specialization"
            />
            <Input
              value={therapist.experience || ''}
              onChange={(e) => updateTherapist(index, 'experience', e.target.value)}
              className="text-sm"
              placeholder="Experience"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryContentEditor({ section, updateContent }: { section: any; updateContent: (id: string, content: any) => void }) {
  const items = section.content.items || [];
  
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateContent(section.id, { items: newItems });
  };

  const addItem = () => {
    const newItems = [...items, { id: `gallery-${Date.now()}`, url: '', alt: '', type: 'image' }];
    updateContent(section.id, { items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_: any, i: number) => i !== index);
    updateContent(section.id, { items: newItems });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <Label className="text-xs font-medium">Section Heading</Label>
        <Input
          value={section.content.heading || ''}
          onChange={(e) => updateContent(section.id, { heading: e.target.value })}
          className="text-sm"
          placeholder="Our Gallery"
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-medium">Gallery Items ({items.length})</Label>
          <Button size="sm" variant="outline" onClick={addItem}>
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>
        {items.map((item: any, index: number) => (
          <div key={item.id || index} className="p-3 border border-editor-border rounded-lg space-y-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium">Item {index + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => removeItem(index)} className="h-6 w-6 p-0 text-destructive">
                <X className="w-3 h-3" />
              </Button>
            </div>
            <ImageUploader
              value={item.url || ''}
              onChange={(url) => updateItem(index, 'url', url)}
              recommendation="Recommended: 800×600px"
            />
            <Input
              value={item.alt || ''}
              onChange={(e) => updateItem(index, 'alt', e.target.value)}
              className="text-sm"
              placeholder="Alt text for accessibility"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialsContentEditor({ section, updateContent }: { section: any; updateContent: (id: string, content: any) => void }) {
  const testimonials = section.content.testimonials || [];
  
  const updateTestimonial = (index: number, field: string, value: any) => {
    const newTestimonials = [...testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    updateContent(section.id, { testimonials: newTestimonials });
  };

  const addTestimonial = () => {
    const newTestimonials = [...testimonials, { id: `testimonial-${Date.now()}`, content: '', author: '', rating: 5 }];
    updateContent(section.id, { testimonials: newTestimonials });
  };

  const removeTestimonial = (index: number) => {
    const newTestimonials = testimonials.filter((_: any, i: number) => i !== index);
    updateContent(section.id, { testimonials: newTestimonials });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <Label className="text-xs font-medium">Section Heading</Label>
        <Input
          value={section.content.heading || ''}
          onChange={(e) => updateContent(section.id, { heading: e.target.value })}
          className="text-sm"
          placeholder="What Parents Say"
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-medium">Testimonials ({testimonials.length})</Label>
          <Button size="sm" variant="outline" onClick={addTestimonial}>
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>
        {testimonials.map((testimonial: any, index: number) => (
          <div key={testimonial.id || index} className="p-3 border border-editor-border rounded-lg space-y-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium">Testimonial {index + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => removeTestimonial(index)} className="h-6 w-6 p-0 text-destructive">
                <X className="w-3 h-3" />
              </Button>
            </div>
            <Textarea
              value={testimonial.content || ''}
              onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
              className="text-sm min-h-[60px]"
              placeholder="Testimonial content..."
            />
            <Input
              value={testimonial.author || ''}
              onChange={(e) => updateTestimonial(index, 'author', e.target.value)}
              className="text-sm"
              placeholder="Author name"
            />
            <div className="flex items-center gap-2">
              <Label className="text-xs">Rating:</Label>
              <Select 
                value={String(testimonial.rating || 5)} 
                onValueChange={(value) => updateTestimonial(index, 'rating', parseInt(value))}
              >
                <SelectTrigger className="w-20 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <SelectItem key={rating} value={String(rating)}>{rating} ★</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingContentEditor({ section, updateContent }: { section: any; updateContent: (id: string, content: any) => void }) {
  const packages = section.content.packages || [];
  
  const updatePackage = (index: number, field: string, value: any) => {
    const newPackages = [...packages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    updateContent(section.id, { packages: newPackages });
  };

  const addPackage = () => {
    const newPackages = [...packages, { id: `package-${Date.now()}`, name: 'New Package', price: 0, description: '', features: [] }];
    updateContent(section.id, { packages: newPackages });
  };

  const removePackage = (index: number) => {
    const newPackages = packages.filter((_: any, i: number) => i !== index);
    updateContent(section.id, { packages: newPackages });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <Label className="text-xs font-medium">Section Heading</Label>
        <Input
          value={section.content.heading || ''}
          onChange={(e) => updateContent(section.id, { heading: e.target.value })}
          className="text-sm"
          placeholder="Our Pricing"
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-medium">Packages ({packages.length})</Label>
          <Button size="sm" variant="outline" onClick={addPackage}>
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>
        {packages.map((pkg: any, index: number) => (
          <div key={pkg.id || index} className="p-3 border border-editor-border rounded-lg space-y-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium">{pkg.name || `Package ${index + 1}`}</span>
              <Button variant="ghost" size="sm" onClick={() => removePackage(index)} className="h-6 w-6 p-0 text-destructive">
                <X className="w-3 h-3" />
              </Button>
            </div>
            <Input
              value={pkg.name || ''}
              onChange={(e) => updatePackage(index, 'name', e.target.value)}
              className="text-sm"
              placeholder="Package name"
            />
            <Input
              type="number"
              value={pkg.price || 0}
              onChange={(e) => updatePackage(index, 'price', parseInt(e.target.value))}
              className="text-sm"
              placeholder="Price"
            />
            <Textarea
              value={pkg.description || ''}
              onChange={(e) => updatePackage(index, 'description', e.target.value)}
              className="text-sm min-h-[40px]"
              placeholder="Description..."
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function LearningContentEditor({ section, updateContent }: { section: any; updateContent: (id: string, content: any) => void }) {
  const modules = section.content.modules || [];
  
  const updateModule = (index: number, field: string, value: any) => {
    const newModules = [...modules];
    newModules[index] = { ...newModules[index], [field]: value };
    updateContent(section.id, { modules: newModules });
  };

  const addModule = () => {
    const newModules = [...modules, { id: `module-${Date.now()}`, title: 'New Module', thumbnail: '' }];
    updateContent(section.id, { modules: newModules });
  };

  const removeModule = (index: number) => {
    const newModules = modules.filter((_: any, i: number) => i !== index);
    updateContent(section.id, { modules: newModules });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <Label className="text-xs font-medium">Section Heading</Label>
        <Input
          value={section.content.heading || ''}
          onChange={(e) => updateContent(section.id, { heading: e.target.value })}
          className="text-sm"
          placeholder="Learning Hub"
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-medium">Modules ({modules.length})</Label>
          <Button size="sm" variant="outline" onClick={addModule}>
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>
        {modules.map((mod: any, index: number) => (
          <div key={mod.id || index} className="p-3 border border-editor-border rounded-lg space-y-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium">{mod.title || `Module ${index + 1}`}</span>
              <Button variant="ghost" size="sm" onClick={() => removeModule(index)} className="h-6 w-6 p-0 text-destructive">
                <X className="w-3 h-3" />
              </Button>
            </div>
            <ImageUploader
              value={mod.thumbnail || ''}
              onChange={(url) => updateModule(index, 'thumbnail', url)}
              label="Thumbnail"
              recommendation="Recommended: 400×225px"
            />
            <Input
              value={mod.title || ''}
              onChange={(e) => updateModule(index, 'title', e.target.value)}
              className="text-sm"
              placeholder="Module title"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactContentEditor({ section, updateContent }: { section: any; updateContent: (id: string, content: any) => void }) {
  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <Label className="text-xs font-medium">Section Heading</Label>
        <Input
          value={section.content.heading || ''}
          onChange={(e) => updateContent(section.id, { heading: e.target.value })}
          className="text-sm"
          placeholder="Contact Us"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Phone</Label>
        <Input
          value={section.content.phone || ''}
          onChange={(e) => updateContent(section.id, { phone: e.target.value })}
          className="text-sm"
          placeholder="+1 234 567 890"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Email</Label>
        <Input
          value={section.content.email || ''}
          onChange={(e) => updateContent(section.id, { email: e.target.value })}
          className="text-sm"
          placeholder="contact@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Address</Label>
        <Textarea
          value={section.content.address || ''}
          onChange={(e) => updateContent(section.id, { address: e.target.value })}
          className="text-sm min-h-[60px]"
          placeholder="123 Main St, City, Country"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Working Hours</Label>
        <Input
          value={section.content.workingHours || ''}
          onChange={(e) => updateContent(section.id, { workingHours: e.target.value })}
          className="text-sm"
          placeholder="Mon-Fri: 9am-6pm"
        />
      </div>
    </div>
  );
}

function DefaultContentEditor({ section, updateContent }: { section: any; updateContent: (id: string, content: any) => void }) {
  return (
    <div className="p-4 space-y-6">
      {section.content.heading !== undefined && (
        <div className="space-y-2">
          <Label className="text-xs font-medium">Heading</Label>
          <Input
            value={section.content.heading || ''}
            onChange={(e) => updateContent(section.id, { heading: e.target.value })}
            className="text-sm"
            placeholder="Enter heading..."
          />
        </div>
      )}

      {section.content.description !== undefined && (
        <div className="space-y-2">
          <Label className="text-xs font-medium">Description</Label>
          <Textarea
            value={section.content.description || ''}
            onChange={(e) => updateContent(section.id, { description: e.target.value })}
            className="min-h-[80px] text-sm resize-none"
            placeholder="Enter description..."
          />
        </div>
      )}
    </div>
  );
}

function StyleEditor({ section, updateStyle }: { section: SiteSection; updateStyle: (id: string, style: Partial<SectionStyle>) => void }) {
  const style = section.style || defaultStyle;

  const presetColors = [
    { name: 'transparent', value: 'transparent', bg: 'bg-background' },
    { name: 'primary', value: 'primary', bg: 'bg-primary' },
    { name: 'secondary', value: 'secondary', bg: 'bg-secondary' },
    { name: 'muted', value: 'muted', bg: 'bg-muted' },
    { name: 'accent', value: 'accent', bg: 'bg-accent' },
  ];

  const fontFamilies = [
    { name: 'System Default', value: 'system-ui' },
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Poppins', value: 'Poppins, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif' },
    { name: 'Lato', value: 'Lato, sans-serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
    { name: 'Playfair Display', value: 'Playfair Display, serif' },
    { name: 'Merriweather', value: 'Merriweather, serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
  ];

  const textColors = [
    { name: 'Default', value: 'default', preview: 'bg-foreground' },
    { name: 'Primary', value: 'primary', preview: 'bg-primary' },
    { name: 'Muted', value: 'muted', preview: 'bg-muted-foreground' },
    { name: 'White', value: 'white', preview: 'bg-white border border-border' },
    { name: 'Custom', value: 'custom', preview: '' },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Background */}
      <div className="space-y-3">
        <Label className="text-xs font-medium">Background</Label>
        <Select 
          value={style.backgroundType} 
          onValueChange={(value: 'color' | 'gradient' | 'image') => updateStyle(section.id, { backgroundType: value })}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="color">Solid Color</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
            <SelectItem value="image">Image</SelectItem>
          </SelectContent>
        </Select>

        {/* Preset Colors */}
        <div className="space-y-2">
          <span className="text-[10px] text-muted-foreground">Preset Colors</span>
          <div className="flex gap-2 flex-wrap">
            {presetColors.map((color) => (
              <button
                key={color.value}
                className={cn(
                  "w-8 h-8 rounded-md cursor-pointer border-2 transition-all",
                  color.bg,
                  style.backgroundColor === color.value ? 'border-foreground ring-2 ring-primary/30' : 'border-input hover:border-muted-foreground'
                )}
                onClick={() => updateStyle(section.id, { backgroundColor: color.value, customBackgroundColor: undefined })}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Custom Color Picker */}
        <div className="space-y-2">
          <span className="text-[10px] text-muted-foreground">Custom Color</span>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <input
                type="color"
                value={style.customBackgroundColor || '#ffffff'}
                onChange={(e) => updateStyle(section.id, { backgroundColor: 'custom', customBackgroundColor: e.target.value })}
                className="w-10 h-10 rounded-md cursor-pointer border border-input p-0.5"
              />
            </div>
            <Input
              value={style.customBackgroundColor || ''}
              onChange={(e) => updateStyle(section.id, { backgroundColor: 'custom', customBackgroundColor: e.target.value })}
              placeholder="#ffffff"
              className="text-sm flex-1 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-3">
        <Label className="text-xs font-medium">Typography</Label>
        
        {/* Heading Font */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-muted-foreground">Heading Font</span>
          <Select 
            value={style.headingFontFamily || 'system-ui'} 
            onValueChange={(value) => updateStyle(section.id, { headingFontFamily: value })}
          >
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Body Font */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-muted-foreground">Body Font</span>
          <Select 
            value={style.fontFamily || 'system-ui'} 
            onValueChange={(value) => updateStyle(section.id, { fontFamily: value })}
          >
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Size */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-muted-foreground">Base Font Size</span>
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <Button 
              variant={style.fontSize === 'small' ? 'secondary' : 'ghost'} 
              size="sm" 
              className="flex-1 text-xs"
              onClick={() => updateStyle(section.id, { fontSize: 'small' })}
            >
              Small
            </Button>
            <Button 
              variant={(!style.fontSize || style.fontSize === 'medium') ? 'secondary' : 'ghost'} 
              size="sm" 
              className="flex-1 text-xs"
              onClick={() => updateStyle(section.id, { fontSize: 'medium' })}
            >
              Medium
            </Button>
            <Button 
              variant={style.fontSize === 'large' ? 'secondary' : 'ghost'} 
              size="sm" 
              className="flex-1 text-xs"
              onClick={() => updateStyle(section.id, { fontSize: 'large' })}
            >
              Large
            </Button>
          </div>
        </div>
      </div>

      {/* Text Color */}
      <div className="space-y-3">
        <Label className="text-xs font-medium">Text Color</Label>
        <div className="flex gap-2 flex-wrap">
          {textColors.filter(c => c.value !== 'custom').map((color) => (
            <button
              key={color.value}
              className={cn(
                "w-8 h-8 rounded-md cursor-pointer border-2 transition-all",
                color.preview,
                style.textColor === color.value ? 'border-foreground ring-2 ring-primary/30' : 'border-input hover:border-muted-foreground'
              )}
              onClick={() => updateStyle(section.id, { textColor: color.value, customTextColor: undefined })}
              title={color.name}
            />
          ))}
        </div>
        
        {/* Custom Text Color */}
        <div className="flex gap-2 items-center">
          <div className="relative">
            <input
              type="color"
              value={style.customTextColor || '#000000'}
              onChange={(e) => updateStyle(section.id, { textColor: 'custom', customTextColor: e.target.value })}
              className="w-8 h-8 rounded-md cursor-pointer border border-input p-0.5"
            />
          </div>
          <Input
            value={style.customTextColor || ''}
            onChange={(e) => updateStyle(section.id, { textColor: 'custom', customTextColor: e.target.value })}
            placeholder="#000000"
            className="text-sm flex-1 font-mono"
          />
        </div>
      </div>

      {/* Padding */}
      <div className="space-y-3">
        <Label className="text-xs font-medium">Padding</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[10px] text-muted-foreground">Top</span>
              <span className="text-[10px] text-muted-foreground">{style.paddingTop}px</span>
            </div>
            <Slider 
              value={[style.paddingTop]} 
              max={200} 
              step={4} 
              onValueChange={(value) => updateStyle(section.id, { paddingTop: value[0] })}
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[10px] text-muted-foreground">Bottom</span>
              <span className="text-[10px] text-muted-foreground">{style.paddingBottom}px</span>
            </div>
            <Slider 
              value={[style.paddingBottom]} 
              max={200} 
              step={4} 
              onValueChange={(value) => updateStyle(section.id, { paddingBottom: value[0] })}
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[10px] text-muted-foreground">Left</span>
              <span className="text-[10px] text-muted-foreground">{style.paddingLeft}px</span>
            </div>
            <Slider 
              value={[style.paddingLeft]} 
              max={100} 
              step={4} 
              onValueChange={(value) => updateStyle(section.id, { paddingLeft: value[0] })}
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[10px] text-muted-foreground">Right</span>
              <span className="text-[10px] text-muted-foreground">{style.paddingRight}px</span>
            </div>
            <Slider 
              value={[style.paddingRight]} 
              max={100} 
              step={4} 
              onValueChange={(value) => updateStyle(section.id, { paddingRight: value[0] })}
            />
          </div>
        </div>
      </div>

      {/* Text Alignment */}
      <div className="space-y-3">
        <Label className="text-xs font-medium">Text Alignment</Label>
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <Button 
            variant={style.textAlign === 'left' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="flex-1"
            onClick={() => updateStyle(section.id, { textAlign: 'left' })}
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant={style.textAlign === 'center' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="flex-1"
            onClick={() => updateStyle(section.id, { textAlign: 'center' })}
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button 
            variant={style.textAlign === 'right' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="flex-1"
            onClick={() => updateStyle(section.id, { textAlign: 'right' })}
          >
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function SettingsEditor({ section }: { section: any }) {
  return (
    <div className="p-4 space-y-6">
      {/* Visibility */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-xs font-medium">Visible on Site</Label>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Toggle to show or hide this section
          </p>
        </div>
        <Switch checked={section.visible} />
      </div>

      {/* Section ID */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Section ID</Label>
        <Input
          value={section.id}
          disabled
          className="text-sm bg-muted"
        />
        <p className="text-[10px] text-muted-foreground">
          Used for anchor links
        </p>
      </div>

      {/* Custom CSS Class */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Custom CSS Class</Label>
        <Input
          placeholder="e.g., my-custom-section"
          className="text-sm"
        />
      </div>
    </div>
  );
}
