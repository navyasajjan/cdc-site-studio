import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Upload, Image as ImageIcon, X, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface EditableImageProps {
  src: string;
  alt: string;
  onChange: (src: string) => void;
  onAltChange?: (alt: string) => void;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'auto' | string;
  placeholder?: string;
  showOverlay?: boolean;
}

export function EditableImage({
  src,
  alt,
  onChange,
  onAltChange,
  className,
  aspectRatio = 'auto',
  placeholder = 'Click to add image',
  showOverlay = true,
}: EditableImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        onChange(dataUrl);
        setIsOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
      setIsOpen(false);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  const aspectClass = cn(
    aspectRatio === 'square' && 'aspect-square',
    aspectRatio === 'video' && 'aspect-video',
    aspectRatio === 'auto' && ''
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'relative cursor-pointer group overflow-hidden rounded-lg transition-all duration-200',
            aspectClass,
            !src && 'border-2 border-dashed border-muted-foreground/30 bg-muted/50 flex items-center justify-center min-h-[100px]',
            className
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {src ? (
            <>
              <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
              />
              {showOverlay && (
                <div
                  className={cn(
                    'absolute inset-0 bg-black/50 flex items-center justify-center gap-2 transition-opacity duration-200',
                    isHovered ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  <div className="flex items-center gap-2 bg-background/95 rounded-lg p-2 shadow-lg">
                    <Upload className="w-4 h-4 text-foreground" />
                    <span className="text-sm text-foreground font-medium">Change Image</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 p-4 text-muted-foreground">
              <ImageIcon className="w-8 h-8" />
              <span className="text-sm">{placeholder}</span>
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="center" side="top">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Change Image</h4>
            {src && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveImage}
                className="h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="w-3 h-3 mr-1" />
                Remove
              </Button>
            )}
          </div>
          
          {/* File Upload */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload from Device
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-popover px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Paste image URL..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                  className="pl-9"
                />
              </div>
              <Button onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
                Add
              </Button>
            </div>
          </div>

          {/* Alt text if handler provided */}
          {onAltChange && (
            <div className="pt-2 border-t">
              <label className="text-xs text-muted-foreground mb-1 block">
                Alt text (for accessibility)
              </label>
              <Input
                placeholder="Describe the image..."
                value={alt}
                onChange={(e) => onAltChange(e.target.value)}
                className="text-sm"
              />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
