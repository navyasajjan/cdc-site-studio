import { useState } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { cn } from '@/lib/utils';
import {
  GripVertical,
  Eye,
  EyeOff,
  Lock,
  Copy,
  ChevronDown,
  ChevronRight,
  Image,
  MessageSquare,
  Users,
  Briefcase,
  Calendar,
  Star,
  DollarSign,
  BookOpen,
  MapPin,
  BarChart3,
  Layout,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { SectionType } from '@/types/editor';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const sectionIcons: Record<SectionType, React.ElementType> = {
  hero: Layout,
  about: MessageSquare,
  services: Briefcase,
  therapists: Users,
  gallery: Image,
  booking: Calendar,
  analytics: BarChart3,
  testimonials: Star,
  pricing: DollarSign,
  learning: BookOpen,
  contact: MapPin,
  footer: Layout,
};

const sectionLabels: Record<SectionType, string> = {
  hero: 'Hero Section',
  about: 'About Section',
  services: 'Services Section',
  therapists: 'Therapists Section',
  gallery: 'Gallery Section',
  booking: 'Booking Section',
  analytics: 'Analytics Section',
  testimonials: 'Testimonials Section',
  pricing: 'Pricing Section',
  learning: 'Learning Hub Section',
  contact: 'Contact Section',
  footer: 'Footer Section',
};

interface SectionNavigatorProps {
  onScrollToSection?: (sectionId: string) => void;
}

export function SectionNavigator({ onScrollToSection }: SectionNavigatorProps) {
  const { sections, state, setSelectedSection, toggleSectionVisibility, duplicateSection, reorderSections, addSection, deleteSection } = useEditor();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['section-hero', 'section-services']));
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setSectionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (sectionToDelete) {
      deleteSection(sectionToDelete);
    }
    setDeleteDialogOpen(false);
    setSectionToDelete(null);
  };

  const toggleExpanded = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      reorderSections(draggedIndex, dragOverIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const availableSectionTypes: SectionType[] = [
    'hero', 'about', 'services', 'therapists', 'gallery', 
    'booking', 'analytics', 'testimonials', 'pricing', 'learning', 'contact', 'footer'
  ];

  return (
    <div className="h-full flex flex-col bg-editor-panel border-r border-editor-border">
      {/* Header */}
      <div className="p-4 border-b border-editor-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">Sections</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1">
                <Plus className="w-3.5 h-3.5" />
                Add
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {availableSectionTypes.map((type) => {
                const Icon = sectionIcons[type];
                return (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => addSection(type)}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {sectionLabels[type]}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Drag to reorder • Click to edit</p>
      </div>

      {/* Section List */}
      <div className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {sections.sort((a, b) => a.order - b.order).map((section, index) => {
            const Icon = sectionIcons[section.type] || Layout;
            const isSelected = state.selectedSectionId === section.id;
            const isExpanded = expandedSections.has(section.id);
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index;

            return (
              <li
                key={section.id}
                draggable={!section.locked}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  'rounded-lg transition-all duration-150',
                  isDragging && 'opacity-50',
                  isDragOver && 'border-t-2 border-primary'
                )}
              >
                <div
                  className={cn(
                    'flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors',
                    isSelected ? 'bg-editor-selected' : 'hover:bg-editor-hover',
                    !section.visible && 'opacity-50'
                  )}
                  onClick={() => {
                    setSelectedSection(section.id);
                    onScrollToSection?.(section.id);
                  }}
                >
                  {/* Drag Handle */}
                  <div className={cn(
                    'cursor-grab active:cursor-grabbing',
                    section.locked && 'opacity-30 cursor-not-allowed'
                  )}>
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                  </div>

                  {/* Expand/Collapse */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpanded(section.id);
                    }}
                    className="p-0.5 hover:bg-muted rounded"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </button>

                  {/* Icon */}
                  <div className={cn(
                    'w-7 h-7 rounded-md flex items-center justify-center',
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Title */}
                  <span className="flex-1 text-sm font-medium truncate">
                    {section.title}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {section.locked ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="p-1">
                            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Locked section</TooltipContent>
                      </Tooltip>
                    ) : (
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-6 h-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSectionVisibility(section.id);
                              }}
                            >
                              {section.visible ? (
                                <Eye className="w-3.5 h-3.5" />
                              ) : (
                                <EyeOff className="w-3.5 h-3.5" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {section.visible ? 'Hide section' : 'Show section'}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-6 h-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateSection(section.id);
                              }}
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Duplicate section</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-6 h-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(section.id);
                              }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete section</TooltipContent>
                        </Tooltip>
                      </>
                    )}
                  </div>
                </div>

                {/* Expanded Content Preview */}
                {isExpanded && (
                  <div className="ml-10 pl-2 border-l border-editor-border mt-1 mb-2 space-y-1">
                    {section.type === 'hero' && (
                      <>
                        <div className="text-xs text-muted-foreground py-1 px-2 hover:bg-editor-hover rounded cursor-pointer">
                          • Title
                        </div>
                        <div className="text-xs text-muted-foreground py-1 px-2 hover:bg-editor-hover rounded cursor-pointer">
                          • Subtitle
                        </div>
                        <div className="text-xs text-muted-foreground py-1 px-2 hover:bg-editor-hover rounded cursor-pointer">
                          • CTA Buttons
                        </div>
                        <div className="text-xs text-muted-foreground py-1 px-2 hover:bg-editor-hover rounded cursor-pointer">
                          • Background
                        </div>
                      </>
                    )}
                    {section.type === 'services' && (
                      <>
                        <div className="text-xs text-muted-foreground py-1 px-2 hover:bg-editor-hover rounded cursor-pointer">
                          • Heading
                        </div>
                        <div className="text-xs text-muted-foreground py-1 px-2 hover:bg-editor-hover rounded cursor-pointer">
                          • Service Cards (6)
                        </div>
                      </>
                    )}
                    {section.type === 'therapists' && (
                      <>
                        <div className="text-xs text-muted-foreground py-1 px-2 hover:bg-editor-hover rounded cursor-pointer">
                          • Team Heading
                        </div>
                        <div className="text-xs text-muted-foreground py-1 px-2 hover:bg-editor-hover rounded cursor-pointer">
                          • Therapist Cards (4)
                        </div>
                      </>
                    )}
                    {/* Add more section types as needed */}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Section</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this section? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
