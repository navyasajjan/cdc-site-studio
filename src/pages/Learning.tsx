import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Video,
  FileText,
  Play,
  Download,
  ExternalLink,
  Clock,
  Users,
  Award,
} from 'lucide-react';

const modules = [
  {
    id: 'module-1',
    title: 'Understanding Speech Delays',
    type: 'video',
    duration: '12 min',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=225&fit=crop',
    featured: true,
    views: 234,
  },
  {
    id: 'module-2',
    title: 'Sensory Activities at Home',
    type: 'pdf',
    duration: '8 pages',
    thumbnail: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=225&fit=crop',
    featured: true,
    views: 189,
  },
  {
    id: 'module-3',
    title: 'Building Communication Skills',
    type: 'video',
    duration: '18 min',
    thumbnail: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=400&h=225&fit=crop',
    featured: false,
    views: 156,
  },
  {
    id: 'module-4',
    title: 'Early Signs of Autism',
    type: 'video',
    duration: '15 min',
    thumbnail: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=225&fit=crop',
    featured: false,
    views: 312,
  },
  {
    id: 'module-5',
    title: 'Creating a Therapy-Friendly Home',
    type: 'pdf',
    duration: '12 pages',
    thumbnail: 'https://images.unsplash.com/photo-1560438718-eb61ede255eb?w=400&h=225&fit=crop',
    featured: true,
    views: 98,
  },
  {
    id: 'module-6',
    title: 'Fine Motor Skills Development',
    type: 'video',
    duration: '20 min',
    thumbnail: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=225&fit=crop',
    featured: false,
    views: 145,
  },
];

export default function LearningPage() {
  const featuredModules = modules.filter((m) => m.featured);
  const totalViews = modules.reduce((sum, m) => sum + m.views, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Learning Hub</h1>
          <p className="text-muted-foreground mt-1">
            Manage educational content displayed on your microsite
          </p>
        </div>
        <Button className="gap-2">
          <ExternalLink className="w-4 h-4" />
          Open ManoNiketan Hub
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{modules.length}</p>
                <p className="text-sm text-muted-foreground">Total Modules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{featuredModules.length}</p>
                <p className="text-sm text-muted-foreground">Featured on Site</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Featured on Microsite</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            These modules will appear in the Learning Hub section of your public microsite.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {featuredModules.map((module) => (
              <div
                key={module.id}
                className="group relative rounded-xl overflow-hidden border"
              >
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={module.thumbnail}
                    alt={module.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {module.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-4 h-4 text-foreground ml-0.5" />
                      </div>
                    </div>
                  )}
                  <Badge
                    className="absolute top-2 right-2"
                    variant="secondary"
                  >
                    {module.type === 'video' ? (
                      <Video className="w-3 h-3 mr-1" />
                    ) : (
                      <FileText className="w-3 h-3 mr-1" />
                    )}
                    {module.type.toUpperCase()}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm mb-2">{module.title}</h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {module.duration}
                    </span>
                    <span>{module.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Modules */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">All Available Modules</CardTitle>
            <Badge variant="outline">{modules.length} modules</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {modules.map((module) => (
              <div
                key={module.id}
                className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <img
                  src={module.thumbnail}
                  alt={module.title}
                  className="w-24 h-14 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm truncate">{module.title}</h3>
                    {module.featured && (
                      <Badge variant="default" className="text-[10px]">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {module.type === 'video' ? (
                        <Video className="w-3 h-3" />
                      ) : (
                        <FileText className="w-3 h-3" />
                      )}
                      {module.type.toUpperCase()}
                    </span>
                    <span>{module.duration}</span>
                    <span>{module.views} views</span>
                  </div>
                </div>
                <Button
                  variant={module.featured ? 'secondary' : 'outline'}
                  size="sm"
                >
                  {module.featured ? 'Remove' : 'Feature'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">ManoNiketan Learning Hub</h3>
              <p className="text-sm text-muted-foreground mb-3">
                All learning content is sourced from the ManoNiketan platform. Featured modules
                appear as teasers on your microsite, directing parents to the full ManoNiketan app
                for complete access.
              </p>
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                Manage Content in ManoNiketan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
