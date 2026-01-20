import { useState } from 'react';
import { pricingPackages as initialPackages } from '@/data/mockData';
import { PricingPackage } from '@/types/editor';
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
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Check,
  DollarSign,
  Calendar,
  FileText,
  Package,
} from 'lucide-react';

const typeIcons = {
  session: DollarSign,
  monthly: Calendar,
  assessment: FileText,
  custom: Package,
};

export default function PricingPage() {
  const [packages, setPackages] = useState<PricingPackage[]>(initialPackages);
  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [disclaimer, setDisclaimer] = useState(
    'Prices may vary based on individual assessment. Insurance coverage available for qualified services.'
  );

  const toggleVisibility = (id: string) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p))
    );
  };

  const deletePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSavePackage = (pkg: PricingPackage) => {
    if (editingPackage) {
      setPackages((prev) =>
        prev.map((p) => (p.id === pkg.id ? pkg : p))
      );
    } else {
      setPackages((prev) => [
        ...prev,
        { ...pkg, id: `pricing-${Date.now()}` },
      ]);
    }
    setIsDialogOpen(false);
    setEditingPackage(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pricing & Packages</h1>
          <p className="text-muted-foreground mt-1">
            Configure service pricing displayed on your microsite
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2"
              onClick={() => setEditingPackage(null)}
            >
              <Plus className="w-4 h-4" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingPackage ? 'Edit Package' : 'Add New Package'}
              </DialogTitle>
            </DialogHeader>
            <PackageForm
              pkg={editingPackage}
              onSave={handleSavePackage}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingPackage(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Packages Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {packages.map((pkg) => {
          const Icon = typeIcons[pkg.type];
          return (
            <Card
              key={pkg.id}
              className={`group relative ${!pkg.visible ? 'opacity-60' : ''}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-7 h-7"
                      onClick={() => toggleVisibility(pkg.id)}
                    >
                      {pkg.visible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-7 h-7"
                      onClick={() => {
                        setEditingPackage(pkg);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-7 h-7 text-destructive hover:text-destructive"
                      onClick={() => deletePackage(pkg.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Badge variant="secondary" className="mb-3 capitalize">
                  {pkg.type}
                </Badge>

                <h3 className="font-semibold text-lg mb-1">{pkg.name}</h3>
                <p className="text-3xl font-bold text-primary mb-3">
                  ${pkg.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    {pkg.type === 'session' && '/session'}
                    {pkg.type === 'monthly' && '/month'}
                  </span>
                </p>

                <p className="text-sm text-muted-foreground mb-4">
                  {pkg.description}
                </p>

                <ul className="space-y-2">
                  {pkg.features.slice(0, 3).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                  {pkg.features.length > 3 && (
                    <li className="text-xs text-muted-foreground pl-6">
                      +{pkg.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Disclaimer Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pricing Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={disclaimer}
            onChange={(e) => setDisclaimer(e.target.value)}
            rows={3}
            placeholder="Add a disclaimer that appears below pricing..."
          />
          <p className="text-xs text-muted-foreground">
            This disclaimer will be displayed at the bottom of the pricing section on your microsite.
          </p>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Display Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Show "Request Quote" Button</Label>
              <p className="text-xs text-muted-foreground">
                Allow visitors to request custom quotes
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Display Currency Symbol</Label>
              <p className="text-xs text-muted-foreground">
                Show $ symbol before prices
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Show Insurance Information</Label>
              <p className="text-xs text-muted-foreground">
                Display insurance acceptance notice
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface PackageFormProps {
  pkg: PricingPackage | null;
  onSave: (pkg: PricingPackage) => void;
  onCancel: () => void;
}

function PackageForm({ pkg, onSave, onCancel }: PackageFormProps) {
  const [formData, setFormData] = useState<Partial<PricingPackage>>(
    pkg || {
      name: '',
      type: 'session',
      price: 0,
      description: '',
      features: [''],
      visible: true,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      features: formData.features?.filter((f) => f.trim() !== '') || [],
    } as PricingPackage);
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...(formData.features || []), ''],
    });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features?.filter((_, i) => i !== index),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Package Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Monthly Package"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: 'session' | 'monthly' | 'assessment' | 'custom') =>
              setFormData({ ...formData, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="session">Per Session</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="assessment">Assessment</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Price ($)</Label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            min={0}
            step={1}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the package..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Features</Label>
        {formData.features?.map((feature, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={feature}
              onChange={(e) => updateFeature(index, e.target.value)}
              placeholder="Enter a feature..."
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeFeature(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addFeature}
          className="gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Feature
        </Button>
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
          {pkg ? 'Save Changes' : 'Add Package'}
        </Button>
      </div>
    </form>
  );
}
