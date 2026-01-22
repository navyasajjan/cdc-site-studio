import { useState, useRef } from 'react';
import { therapists as initialTherapists, services } from '@/data/mockData';
import { Therapist } from '@/types/editor';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Upload,
  X,
  Link,
} from 'lucide-react';

export default function TherapistsPage() {
  const [therapistList, setTherapistList] = useState<Therapist[]>(initialTherapists);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredTherapists = therapistList.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleVisibility = (id: string) => {
    setTherapistList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visible: !t.visible } : t))
    );
  };

  const deleteTherapist = (id: string) => {
    setTherapistList((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSaveTherapist = (therapist: Therapist) => {
    if (editingTherapist) {
      setTherapistList((prev) =>
        prev.map((t) => (t.id === therapist.id ? therapist : t))
      );
    } else {
      setTherapistList((prev) => [
        ...prev,
        { ...therapist, id: `therapist-${Date.now()}` },
      ]);
    }
    setIsDialogOpen(false);
    setEditingTherapist(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Therapists</h1>
          <p className="text-muted-foreground mt-1">
            Manage your therapy team profiles displayed on the microsite
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2"
              onClick={() => setEditingTherapist(null)}
            >
              <Plus className="w-4 h-4" />
              Add Therapist
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingTherapist ? 'Edit Therapist' : 'Add New Therapist'}
              </DialogTitle>
            </DialogHeader>
            <TherapistForm
              therapist={editingTherapist}
              onSave={handleSaveTherapist}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingTherapist(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search therapists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Therapists Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTherapists.map((therapist) => {
          const assignedServices = services.filter((s) =>
            therapist.serviceIds.includes(s.id)
          );

          return (
            <Card
              key={therapist.id}
              className={`group overflow-hidden ${!therapist.visible ? 'opacity-60' : ''}`}
            >
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={therapist.photo}
                  alt={therapist.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => toggleVisibility(therapist.id)}
                  >
                    {therapist.visible ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => {
                      setEditingTherapist(therapist);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="w-8 h-8 text-destructive hover:text-destructive"
                    onClick={() => deleteTherapist(therapist.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Badge
                  className="absolute bottom-2 left-2"
                  variant={therapist.type === 'in-house' ? 'default' : 'secondary'}
                >
                  {therapist.type === 'in-house' ? 'In-House' : 'Visiting'}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{therapist.name}</h3>
                <p className="text-sm text-primary font-medium">{therapist.specialization}</p>
                <p className="text-xs text-muted-foreground mt-1">{therapist.experience} experience</p>
                <p className="text-xs text-muted-foreground mt-0.5">{therapist.credentials}</p>

                {assignedServices.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {assignedServices.slice(0, 2).map((s) => (
                      <Badge key={s.id} variant="outline" className="text-[10px]">
                        {s.name}
                      </Badge>
                    ))}
                    {assignedServices.length > 2 && (
                      <Badge variant="outline" className="text-[10px]">
                        +{assignedServices.length - 2} more
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTherapists.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No therapists found</p>
          <Button
            onClick={() => {
              setEditingTherapist(null);
              setIsDialogOpen(true);
            }}
          >
            Add Your First Therapist
          </Button>
        </Card>
      )}
    </div>
  );
}

interface TherapistFormProps {
  therapist: Therapist | null;
  onSave: (therapist: Therapist) => void;
  onCancel: () => void;
}

function TherapistForm({ therapist, onSave, onCancel }: TherapistFormProps) {
  const [formData, setFormData] = useState<Partial<Therapist>>(
    therapist || {
      name: '',
      photo: '',
      specialization: '',
      experience: '',
      credentials: '',
      type: 'in-house',
      visible: true,
      serviceIds: [],
    }
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState('');

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
        setFormData({ ...formData, photo: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Therapist);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Photo Upload */}
      <div className="space-y-2">
        <Label>Photo</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={formData.photo} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {formData.name?.split(' ').map((n) => n[0]).join('') || 'TH'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4" />
              Upload Photo
            </Button>
            {formData.photo && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-destructive hover:text-destructive"
                onClick={() => setFormData({ ...formData, photo: '' })}
              >
                <X className="w-4 h-4" />
                Remove
              </Button>
            )}
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Or paste image URL..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="text-xs"
          />
          <Button 
            type="button"
            size="sm" 
            variant="outline"
            disabled={!urlInput.trim()}
            onClick={() => {
              setFormData({ ...formData, photo: urlInput.trim() });
              setUrlInput('');
            }}
          >
            <Link className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Dr. Emily Chen"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Specialization</Label>
        <Input
          value={formData.specialization}
          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          placeholder="e.g., Speech-Language Pathologist"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Experience</Label>
          <Input
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            placeholder="e.g., 10 years"
          />
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: 'in-house' | 'visiting') =>
              setFormData({ ...formData, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in-house">In-House</SelectItem>
              <SelectItem value="visiting">Visiting</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Credentials</Label>
        <Input
          value={formData.credentials}
          onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
          placeholder="e.g., Ph.D., CCC-SLP, ASHA Certified"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Visible on Site</Label>
        <Switch
          checked={formData.visible}
          onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {therapist ? 'Save Changes' : 'Add Therapist'}
        </Button>
      </div>
    </form>
  );
}
