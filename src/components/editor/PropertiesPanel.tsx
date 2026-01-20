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
} from 'lucide-react';

export function PropertiesPanel() {
  const { state, sections, updateSectionContent } = useEditor();
  
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
            {/* Default content editor for other sections */}
            {!['hero', 'about', 'services'].includes(selectedSection.type) && (
              <DefaultContentEditor section={selectedSection} updateContent={updateSectionContent} />
            )}
          </TabsContent>

          {/* Style Tab */}
          <TabsContent value="style" className="m-0">
            <StyleEditor />
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
      <div className="space-y-2">
        <Label className="text-xs font-medium">Background Image</Label>
        <div className="border border-dashed border-editor-border rounded-lg p-4 text-center hover:bg-editor-hover transition-colors cursor-pointer">
          <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">
            Click to upload or drag & drop
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Recommended: 1920×800px
          </p>
        </div>
        {section.content.backgroundImage && (
          <img
            src={section.content.backgroundImage}
            alt="Background preview"
            className="w-full h-24 object-cover rounded-lg mt-2"
          />
        )}
      </div>

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

function StyleEditor() {
  return (
    <div className="p-4 space-y-6">
      {/* Background */}
      <div className="space-y-3">
        <Label className="text-xs font-medium">Background</Label>
        <Select defaultValue="color">
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="color">Solid Color</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
            <SelectItem value="image">Image</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-md bg-background border border-input cursor-pointer" />
          <div className="w-8 h-8 rounded-md bg-primary cursor-pointer" />
          <div className="w-8 h-8 rounded-md bg-secondary cursor-pointer" />
          <div className="w-8 h-8 rounded-md bg-muted cursor-pointer" />
        </div>
      </div>

      {/* Padding */}
      <div className="space-y-3">
        <Label className="text-xs font-medium">Padding</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <span className="text-[10px] text-muted-foreground">Top</span>
            <Slider defaultValue={[64]} max={200} step={4} />
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] text-muted-foreground">Bottom</span>
            <Slider defaultValue={[64]} max={200} step={4} />
          </div>
        </div>
      </div>

      {/* Text Alignment */}
      <div className="space-y-3">
        <Label className="text-xs font-medium">Text Alignment</Label>
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <Button variant="ghost" size="sm" className="flex-1">
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="sm" className="flex-1">
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
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
