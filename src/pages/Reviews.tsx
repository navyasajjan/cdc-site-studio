import { useState } from 'react';
import { reviews as initialReviews } from '@/data/mockData';
import { Review } from '@/types/editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Star,
  Check,
  X,
  MessageSquare,
  Flag,
  Eye,
  EyeOff,
  Award,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReviewsPage() {
  const [reviewList, setReviewList] = useState<Review[]>(initialReviews);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const pendingReviews = reviewList.filter((r) => !r.approved);
  const approvedReviews = reviewList.filter((r) => r.approved);
  const featuredReviews = reviewList.filter((r) => r.featured);

  const avgRating = reviewList.length > 0
    ? (reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length).toFixed(1)
    : '0';

  const approveReview = (id: string) => {
    setReviewList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approved: true } : r))
    );
  };

  const rejectReview = (id: string) => {
    setReviewList((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleFeatured = (id: string) => {
    setReviewList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, featured: !r.featured } : r))
    );
  };

  const submitReply = (id: string) => {
    setReviewList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reply: replyText } : r))
    );
    setReplyingTo(null);
    setReplyText('');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reviews & Testimonials</h1>
          <p className="text-muted-foreground mt-1">
            Manage reviews and testimonials displayed on your microsite
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgRating}</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{reviewList.length}</p>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
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
                <p className="text-2xl font-bold">{featuredReviews.length}</p>
                <p className="text-sm text-muted-foreground">Featured</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Flag className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingReviews.length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Tabs */}
      <Tabs defaultValue="approved" className="w-full">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            Pending
            {pendingReviews.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {pendingReviews.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <div className="space-y-4">
            {pendingReviews.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No pending reviews</p>
              </Card>
            ) : (
              pendingReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onApprove={() => approveReview(review.id)}
                  onReject={() => rejectReview(review.id)}
                  showActions
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          <div className="space-y-4">
            {approvedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onToggleFeatured={() => toggleFeatured(review.id)}
                onReply={() => setReplyingTo(review.id)}
                replyingTo={replyingTo}
                replyText={replyText}
                setReplyText={setReplyText}
                onSubmitReply={() => submitReply(review.id)}
                onCancelReply={() => {
                  setReplyingTo(null);
                  setReplyText('');
                }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured" className="mt-6">
          <div className="space-y-4">
            {featuredReviews.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No featured reviews. Mark reviews as featured to display them prominently.
                </p>
              </Card>
            ) : (
              featuredReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onToggleFeatured={() => toggleFeatured(review.id)}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Review Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Never display parent or child names publicly</li>
            <li>• Use templated responses for consistency</li>
            <li>• Feature positive testimonials to build trust</li>
            <li>• Respond promptly to all reviews</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

interface ReviewCardProps {
  review: Review;
  onApprove?: () => void;
  onReject?: () => void;
  onToggleFeatured?: () => void;
  onReply?: () => void;
  showActions?: boolean;
  replyingTo?: string | null;
  replyText?: string;
  setReplyText?: (text: string) => void;
  onSubmitReply?: () => void;
  onCancelReply?: () => void;
}

function ReviewCard({
  review,
  onApprove,
  onReject,
  onToggleFeatured,
  onReply,
  showActions,
  replyingTo,
  replyText,
  setReplyText,
  onSubmitReply,
  onCancelReply,
}: ReviewCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-4 h-4',
                  i < review.rating ? 'text-warning fill-warning' : 'text-muted'
                )}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-2">
              {new Date(review.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {review.featured && (
              <Badge className="bg-accent text-accent-foreground">Featured</Badge>
            )}
            {review.approved && onToggleFeatured && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFeatured}
                className="gap-1"
              >
                <Award className="w-4 h-4" />
                {review.featured ? 'Unfeature' : 'Feature'}
              </Button>
            )}
          </div>
        </div>

        <p className="text-foreground mb-4">"{review.content}"</p>

        {review.reply && (
          <div className="bg-muted p-4 rounded-lg mt-4">
            <p className="text-sm font-medium mb-1">Your Reply:</p>
            <p className="text-sm text-muted-foreground">{review.reply}</p>
          </div>
        )}

        {replyingTo === review.id && setReplyText && (
          <div className="mt-4 space-y-3">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={onCancelReply}>
                Cancel
              </Button>
              <Button size="sm" onClick={onSubmitReply}>
                Send Reply
              </Button>
            </div>
          </div>
        )}

        {showActions && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t">
            <Button
              variant="default"
              size="sm"
              className="gap-1 bg-success hover:bg-success/90"
              onClick={onApprove}
            >
              <ThumbsUp className="w-4 h-4" />
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 text-destructive hover:text-destructive"
              onClick={onReject}
            >
              <ThumbsDown className="w-4 h-4" />
              Reject
            </Button>
          </div>
        )}

        {!showActions && !review.reply && onReply && replyingTo !== review.id && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4 gap-1"
            onClick={onReply}
          >
            <MessageSquare className="w-4 h-4" />
            Reply
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
