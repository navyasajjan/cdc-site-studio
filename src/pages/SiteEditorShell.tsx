import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Palette, Briefcase, Users, Image as ImageIcon, Calendar, Star, DollarSign, BookOpen, Search, Eye } from 'lucide-react';
import SiteEditorBuilder from '@/pages/SiteEditor';
import ServicesPage from '@/pages/Services';
import TherapistsPage from '@/pages/Therapists';
import GalleryPage from '@/pages/Gallery';
import BookingPage from '@/pages/Booking';
import ReviewsPage from '@/pages/Reviews';
import PricingPage from '@/pages/Pricing';
import LearningPage from '@/pages/Learning';
import SEOPage from '@/pages/SEO';
import PublishPage from '@/pages/Publish';

const TABS = [
  { id: 'design',     label: 'Design',      icon: Palette,    Comp: SiteEditorBuilder, full: true },
  { id: 'services',   label: 'Services',    icon: Briefcase,  Comp: ServicesPage },
  { id: 'therapists', label: 'Therapists',  icon: Users,      Comp: TherapistsPage },
  { id: 'gallery',    label: 'Gallery',     icon: ImageIcon,  Comp: GalleryPage },
  { id: 'booking',    label: 'Booking',     icon: Calendar,   Comp: BookingPage },
  { id: 'reviews',    label: 'Reviews',     icon: Star,       Comp: ReviewsPage },
  { id: 'pricing',    label: 'Pricing',     icon: DollarSign, Comp: PricingPage },
  { id: 'learning',   label: 'Learning Hub', icon: BookOpen,  Comp: LearningPage },
  { id: 'seo',        label: 'SEO',         icon: Search,     Comp: SEOPage },
  { id: 'publish',    label: 'Publish',     icon: Eye,        Comp: PublishPage },
];

export default function SiteEditorShell() {
  const [params, setParams] = useSearchParams();
  const active = params.get('tab') ?? 'design';
  const setTab = (id: string) => setParams(p => { p.set('tab', id); return p; }, { replace: true });

  return (
    <Tabs value={active} onValueChange={setTab} className="h-full flex flex-col">
      <div className="border-b bg-card px-2 md:px-4 overflow-x-auto">
        <TabsList className="bg-transparent h-12 gap-1">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <TabsTrigger key={t.id} value={t.id} className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Icon className="w-4 h-4" />{t.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>
      <div className="flex-1 overflow-auto">
        {TABS.map(t => {
          const Comp = t.Comp;
          return (
            <TabsContent key={t.id} value={t.id} className="m-0 h-full">
              {t.full ? <div className="h-full"><Comp /></div> : <Comp />}
            </TabsContent>
          );
        })}
      </div>
    </Tabs>
  );
}
