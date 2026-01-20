import { useState } from 'react';
import { services as initialServices, therapists } from '@/data/mockData';
import { Service } from '@/types/editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
  GripVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  MessageCircle,
  Hand,
  Brain,
  Baby,
  Sparkles,
  Users,
  Search,
} from 'lucide-react';

const iconOptions = [
  { value: 'MessageCircle', label: 'Speech', icon: MessageCircle },
  { value: 'Hand', label: 'Hand', icon: Hand },
  { value: 'Brain', label: 'Brain', icon: Brain },
  { value: 'Baby', label: 'Baby', icon: Baby },
  { value: 'Sparkles', label: 'Sparkles', icon: Sparkles },
  { value: 'Users', label: 'Users', icon: Users },
];

const iconMap: Record<string, React.ElementType> = {
  MessageCircle,
  Hand,
  Brain,
  Baby,
  Sparkles,
  Users,
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleVisibility = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSaveService = (service: Service) => {
    if (editingService) {
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? service : s))
      );
    } else {
      setServices((prev) => [
        ...prev,
        { ...service, id: `service-${Date.now()}`, order: prev.length + 1 },
      ]);
    }
    setIsDialogOpen(false);
    setEditingService(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Services</h1>
          <p className="text-muted-foreground mt-1">
            Manage the therapy services displayed on your microsite
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2"
              onClick={() => {
                setEditingService(null);
              }}
            >
              <Plus className="w-4 h-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
            </DialogHeader>
            <ServiceForm
              service={editingService}
              onSave={handleSaveService}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingService(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices
          .sort((a, b) => a.order - b.order)
          .map((service) => {
            const Icon = iconMap[service.icon] || MessageCircle;
            const assignedTherapists = therapists.filter((t) =>
              service.therapistIds.includes(t.id)
            );

            return (
              <Card
                key={service.id}
                className={`group relative ${!service.visible ? 'opacity-60' : ''}`}
              >
                <div className="absolute top-3 left-3 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => toggleVisibility(service.id)}
                      >
                        {service.visible ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => {
                          setEditingService(service);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-destructive hover:text-destructive"
                        onClick={() => deleteService(service.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{service.ageRange}</Badge>
                    <div className="flex -space-x-2">
                      {assignedTherapists.slice(0, 3).map((t) => (
                        <img
                          key={t.id}
                          src={t.photo}
                          alt={t.name}
                          className="w-6 h-6 rounded-full border-2 border-background"
                        />
                      ))}
                      {assignedTherapists.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium border-2 border-background">
                          +{assignedTherapists.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {filteredServices.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No services found</p>
          <Button
            onClick={() => {
              setEditingService(null);
              setIsDialogOpen(true);
            }}
          >
            Add Your First Service
          </Button>
        </Card>
      )}
    </div>
  );
}

interface ServiceFormProps {
  service: Service | null;
  onSave: (service: Service) => void;
  onCancel: () => void;
}

function ServiceForm({ service, onSave, onCancel }: ServiceFormProps) {
  const [formData, setFormData] = useState<Partial<Service>>(
    service || {
      name: '',
      description: '',
      icon: 'MessageCircle',
      ageRange: '',
      therapistIds: [],
      visible: true,
      order: 1,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Service);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Service Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Speech Therapy"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the service..."
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Icon</Label>
          <Select
            value={formData.icon}
            onValueChange={(value) => setFormData({ ...formData, icon: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {opt.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Age Range</Label>
          <Input
            value={formData.ageRange}
            onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
            placeholder="e.g., 2-12 years"
          />
        </div>
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
          {service ? 'Save Changes' : 'Add Service'}
        </Button>
      </div>
    </form>
  );
}
