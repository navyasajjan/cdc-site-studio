import { useEditor } from '@/contexts/EditorContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
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
    setPreviewMode,
    setZoom,
    undo,
    redo,
    saveDraft,
    publish,
  } = useEditor();

  const zoomLevels = [50, 75, 100, 125, 150, 200];

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
    </div>
  );
}
