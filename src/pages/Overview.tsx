import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Calendar,
  Star,
  TrendingUp,
  Eye,
  MousePointer,
  ArrowUpRight,
  ArrowDownRight,
  Palette,
  BarChart3,
  MessageSquare,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OverviewPage() {
  const stats = [
    {
      title: 'Page Views',
      value: '12,847',
      change: '+14.2%',
      trend: 'up',
      icon: Eye,
    },
    {
      title: 'Booking Clicks',
      value: '342',
      change: '+8.1%',
      trend: 'up',
      icon: MousePointer,
    },
    {
      title: 'Active Services',
      value: '6',
      change: '0%',
      trend: 'neutral',
      icon: Calendar,
    },
    {
      title: 'Avg. Rating',
      value: '4.9',
      change: '+0.2',
      trend: 'up',
      icon: Star,
    },
  ];

  const recentActivity = [
    { action: 'Published site update', time: '2 hours ago', type: 'publish' },
    { action: 'New review received', time: '5 hours ago', type: 'review' },
    { action: 'Updated pricing section', time: '1 day ago', type: 'edit' },
    { action: 'Added new therapist', time: '2 days ago', type: 'add' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, Dr. Sarah</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your CDC microsite
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/editor">
            <Palette className="w-4 h-4" />
            Edit Site
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      stat.trend === 'up'
                        ? 'bg-success/10 text-success'
                        : stat.trend === 'down'
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-muted text-muted-foreground'
                    }
                  >
                    {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3 mr-1" />}
                    {stat.trend === 'down' && <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Site Health */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Site Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">SEO Score</span>
                  <span className="text-sm text-success font-medium">92/100</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Content Completeness</span>
                  <span className="text-sm text-primary font-medium">88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Mobile Optimization</span>
                  <span className="text-sm text-success font-medium">95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Page Load Speed</span>
                  <span className="text-sm text-warning font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link to="/seo">View SEO Details</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/analytics">Full Analytics</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'publish'
                        ? 'bg-success'
                        : activity.type === 'review'
                        ? 'bg-warning'
                        : activity.type === 'edit'
                        ? 'bg-info'
                        : 'bg-primary'
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/editor">
                <Palette className="w-5 h-5" />
                <span className="text-sm">Edit Site</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/services">
                <Calendar className="w-5 h-5" />
                <span className="text-sm">Manage Services</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/reviews">
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm">View Reviews</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/analytics">
                <BarChart3 className="w-5 h-5" />
                <span className="text-sm">Analytics</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
