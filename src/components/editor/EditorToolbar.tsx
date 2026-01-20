import { useState } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  Save,
  Upload,
  Eye,
  History,
  MoreHorizontal,
  ImageIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function EditorToolbar() {
  const {
    state,
    siteSettings,
    setPreviewMode,
    setZoom,
    undo,
    redo,
    saveDraft,
    publish,
    updateSiteSettings,
  } = useEditor();

  const [logoDialogOpen, setLogoDialogOpen] = useState(false);
  const [tempLogoUrl, setTempLogoUrl] = useState(siteSettings.logo);

  const zoomLevels = [50, 75, 100, 125, 150, 200];

  const handleSaveLogo = () => {
    updateSiteSettings({ logo: tempLogoUrl });
    setLogoDialogOpen(false);
  };

  return (
    <div className="h-14 border-b border-editor-border bg-editor-panel flex items-center justify-between px-4">
      {/* Left Section - History Controls */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={undo}>
              <Undo2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={redo}>
              <Redo2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-2" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <History className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Version History</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Logo Settings */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1.5"
              onClick={() => {
                setTempLogoUrl(siteSettings.logo);
                setLogoDialogOpen(true);
              }}
            >
              <ImageIcon className="w-4 h-4" />
              Logo
            </Button>
          </TooltipTrigger>
          <TooltipContent>Site Logo Settings</TooltipContent>
        </Tooltip>
      </div>

      {/* Center Section - Device Preview */}
      <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={state.previewMode === 'desktop' ? 'secondary' : 'ghost'}
              size="icon"
              className="w-8 h-8"
              onClick={() => setPreviewMode('desktop')}
            >
              <Monitor className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Desktop</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={state.previewMode === 'tablet' ? 'secondary' : 'ghost'}
              size="icon"
              className="w-8 h-8"
              onClick={() => setPreviewMode('tablet')}
            >
              <Tablet className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Tablet</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={state.previewMode === 'mobile' ? 'secondary' : 'ghost'}
              size="icon"
              className="w-8 h-8"
              onClick={() => setPreviewMode('mobile')}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Mobile</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Zoom Controls */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => setZoom(state.zoom - 10)}
              disabled={state.zoom <= 50}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom Out</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="w-16 text-xs font-medium">
              {state.zoom}%
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {zoomLevels.map((level) => (
              <DropdownMenuItem
                key={level}
                onClick={() => setZoom(level)}
                className={cn(state.zoom === level && 'bg-accent')}
              >
                {level}%
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => setZoom(state.zoom + 10)}
              disabled={state.zoom >= 200}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom In</TooltipContent>
        </Tooltip>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        {state.hasUnsavedChanges && (
          <Badge variant="outline" className="status-draft border-warning text-warning">
            Unsaved Changes
          </Badge>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Eye className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Preview</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />

        <Button variant="outline" size="sm" onClick={saveDraft} className="gap-1.5">
          <Save className="w-4 h-4" />
          Save Draft
        </Button>

        <Button size="sm" onClick={publish} className="gap-1.5">
          <Upload className="w-4 h-4" />
          Publish
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Schedule Publish</DropdownMenuItem>
            <DropdownMenuItem>Export Site</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Rollback to Previous</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Logo Settings Dialog */}
      <Dialog open={logoDialogOpen} onOpenChange={setLogoDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Logo Settings
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Logo Preview */}
            <div className="flex justify-center">
              <div className="w-32 h-32 border border-dashed border-editor-border rounded-lg flex items-center justify-center bg-muted overflow-hidden">
                {tempLogoUrl && tempLogoUrl !== '/placeholder.svg' ? (
                  <img 
                    src={tempLogoUrl} 
                    alt="Logo preview" 
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No logo set</p>
                  </div>
                )}
              </div>
            </div>

            {/* Logo URL */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Logo URL</Label>
              <Input
                value={tempLogoUrl}
                onChange={(e) => setTempLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="text-sm"
              />
              <p className="text-[10px] text-muted-foreground">
                Enter a URL or upload an image
              </p>
            </div>

            {/* Upload Button */}
            <div className="border border-dashed border-editor-border rounded-lg p-4 text-center hover:bg-editor-hover transition-colors cursor-pointer">
              <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">
                Click to upload logo
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Recommended: 200×60px, PNG or SVG
              </p>
            </div>

            <Separator />

            {/* Logo Position */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Position in Header</Label>
              <Select 
                value={siteSettings.logoPosition} 
                onValueChange={(value: 'left' | 'center' | 'right') => updateSiteSettings({ logoPosition: value })}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Logo Size */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Size</Label>
              <Select 
                value={siteSettings.logoSize} 
                onValueChange={(value: 'small' | 'medium' | 'large') => updateSiteSettings({ logoSize: value })}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (32px)</SelectItem>
                  <SelectItem value="medium">Medium (48px)</SelectItem>
                  <SelectItem value="large">Large (64px)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Display Options */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Show in Header</Label>
                <Switch
                  checked={siteSettings.showLogoInHeader}
                  onCheckedChange={(checked) => updateSiteSettings({ showLogoInHeader: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Show in Hero Section</Label>
                <Switch
                  checked={siteSettings.showLogoInHero}
                  onCheckedChange={(checked) => updateSiteSettings({ showLogoInHero: checked })}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setLogoDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLogo}>
              Save Logo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
