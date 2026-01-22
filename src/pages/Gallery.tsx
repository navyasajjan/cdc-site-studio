import { useState, useRef } from 'react';
import { galleryItems as initialItems } from '@/data/mockData';
import { GalleryItem } from '@/types/editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Upload,
  Image,
  Video,
  Trash2,
  GripVertical,
  Grid3X3,
  LayoutGrid,
  Play,
  Tag,
} from 'lucide-react';

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [layout, setLayout] = useState<'masonry' | 'grid' | 'slider'>('masonry');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = [...new Set(items.flatMap((item) => item.tags))];

  const filteredItems = selectedTag
    ? items.filter((item) => item.tags.includes(selectedTag))
    : items;

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = (newItem: GalleryItem) => {
    setItems((prev) => [
      ...prev,
      { ...newItem, id: `gallery-${Date.now()}`, order: prev.length + 1 },
    ]);
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gallery & Facilities</h1>
          <p className="text-muted-foreground mt-1">
            Showcase your therapy spaces and facilities
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Media
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Media</DialogTitle>
            </DialogHeader>
            <MediaUploadForm onSave={handleAddItem} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Tags Filter */}
        <div className="flex items-center gap-2">
          <Button
            variant={selectedTag === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTag(null)}
          >
            All
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag(tag)}
              className="capitalize"
            >
              {tag}
            </Button>
          ))}
        </div>

        {/* Layout Selector */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={layout === 'masonry' ? 'secondary' : 'ghost'}
            size="icon"
            className="w-8 h-8"
            onClick={() => setLayout('masonry')}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={layout === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            className="w-8 h-8"
            onClick={() => setLayout('grid')}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div
        className={`grid gap-4 ${
          layout === 'masonry'
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }`}
      >
        {filteredItems
          .sort((a, b) => a.order - b.order)
          .map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl overflow-hidden aspect-[4/3] cursor-move"
            >
              <img
                src={item.url}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="w-5 h-5 text-foreground ml-0.5" />
                  </div>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute top-2 left-2">
                  <GripVertical className="w-5 h-5 text-white" />
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <Badge variant="secondary" className="text-[10px]">
                    {item.type === 'image' ? <Image className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                  </Badge>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="w-7 h-7"
                    onClick={() => deleteItem(item.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-sm font-medium truncate">{item.alt}</p>
                  <div className="flex gap-1 mt-1">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] capitalize">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Image className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">No media items found</p>
          <Button onClick={() => setIsDialogOpen(true)}>Upload Your First Image</Button>
        </Card>
      )}

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Gallery Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Use high-quality images (minimum 1200×800px) for best results</li>
            <li>• Add descriptive alt text for accessibility and SEO</li>
            <li>• Tag images to help organize and filter your gallery</li>
            <li>• Drag and drop to reorder images</li>
            <li>• Video tours can significantly increase engagement</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

interface MediaUploadFormProps {
  onSave: (item: GalleryItem) => void;
  onCancel: () => void;
}

function MediaUploadForm({ onSave, onCancel }: MediaUploadFormProps) {
  const [formData, setFormData] = useState<Partial<GalleryItem>>({
    type: 'image',
    url: '',
    alt: '',
    tags: [],
    order: 1,
  });
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        alert('Please select an image or video file');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        alert('File must be less than 50MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ 
          ...formData, 
          url: event.target?.result as string,
          type: file.type.startsWith('video/') ? 'video' : 'image'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as GalleryItem);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim().toLowerCase()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="url">URL</TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="pt-4">
          {formData.url ? (
            <div className="relative rounded-lg overflow-hidden">
              {formData.type === 'video' ? (
                <video src={formData.url} className="w-full h-32 object-cover" />
              ) : (
                <img src={formData.url} alt="Preview" className="w-full h-32 object-cover" />
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setFormData({ ...formData, url: '' })}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="border-2 border-dashed border-input rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag & drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, GIF, MP4 (max 50MB)
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="url" className="pt-4">
          <div className="space-y-2">
            <Label>Media URL</Label>
            <Input
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-2">
        <Label>Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: 'image' | 'video') =>
            setFormData({ ...formData, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="image">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Image
              </div>
            </SelectItem>
            <SelectItem value="video">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Video
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Alt Text / Description</Label>
        <Input
          value={formData.alt}
          onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
          placeholder="Describe the image..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add tag..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addTag}>
            <Tag className="w-4 h-4" />
          </Button>
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {formData.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer capitalize"
                onClick={() => removeTag(tag)}
              >
                {tag} ×
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Media</Button>
      </div>
    </form>
  );
}
