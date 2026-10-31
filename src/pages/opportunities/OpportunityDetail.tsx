/**
 * OPPORTUNITY DETAIL PAGE
 * =======================
 * 
 * Detailed view of single opportunity
 * Shows full information, requirements, benefits, and application options
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft, Heart, MapPin, Calendar, DollarSign, Clock,
  Briefcase, GraduationCap, Building2, Globe, TrendingUp,
  ExternalLink, Share2, Bookmark, CheckCircle, AlertCircle,
  Users, Target, Award, Lightbulb
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { OPPORTUNITIES_DATA } from '@/data/opportunities';

// Type configuration
const TYPE_CONFIG = {
  job: {
    icon: Briefcase,
    label: 'Job',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    gradient: 'from-blue-500 to-blue-600',
  },
  scholarship: {
    icon: GraduationCap,
    label: 'Scholarship',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    gradient: 'from-purple-500 to-purple-600',
  },
  internship: {
    icon: Building2,
    label: 'Internship',
    color: 'bg-green-100 text-green-700 border-green-200',
    gradient: 'from-green-500 to-green-600',
  },
  grant: {
    icon: TrendingUp,
    label: 'Grant & Funding',
    color: 'bg-pink-100 text-pink-700 border-pink-200',
    gradient: 'from-pink-500 to-pink-600',
  },
  field_opportunity: {
    icon: Globe,
    label: 'Field Opportunity',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    gradient: 'from-orange-500 to-orange-600',
  },
};

// Using centralized opportunities data
const ALL_OPPORTUNITIES = OPPORTUNITIES_DATA;

const OpportunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Find opportunity by ID from URL
  const opportunity = ALL_OPPORTUNITIES.find(opp => opp.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Opportunity Not Found</h2>
          <p className="text-gray-600 mb-6">The opportunity you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/opportunities')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Opportunities
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const typeConfig = TYPE_CONFIG[opportunity.type];
  const TypeIcon = typeConfig.icon;

  // Calculate deadline urgency
  const daysUntilDeadline = Math.ceil(
    (new Date(opportunity.application_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  const isExpired = daysUntilDeadline < 0;

  const handleBookmark = () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please sign in to bookmark opportunities',
        variant: 'destructive',
      });
      return;
    }
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks',
      description: isBookmarked ? 'Opportunity removed from your saved list' : 'Opportunity saved successfully',
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: opportunity.title,
        text: opportunity.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied!',
        description: 'Opportunity link copied to clipboard',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />

      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${typeConfig.gradient} text-white pt-20 sm:pt-24 lg:pt-28 pb-12`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/opportunities')}
            className="text-white hover:bg-white/20 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Opportunities
          </Button>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Organization Logo */}
            {opportunity.organization_logo && (
              <div className="flex-shrink-0">
                <img
                  src={opportunity.organization_logo}
                  alt={opportunity.organization_name}
                  className="w-24 h-24 rounded-xl bg-white p-3 shadow-lg"
                />
              </div>
            )}

            {/* Title and Meta */}
            <div className="flex-1">
              <Badge className={`${typeConfig.color} border mb-3`}>
                <TypeIcon className="h-3 w-3 mr-1" />
                {typeConfig.label}
              </Badge>

              <h1 className="text-3xl sm:text-4xl font-bold mb-3">{opportunity.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-white/90 mb-4">
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {opportunity.organization_name}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {opportunity.location}
                </span>
                {opportunity.is_remote && (
                  <Badge className="bg-white/20 text-white border-white/30">Remote</Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => window.open(opportunity.application_url, '_blank')}
                >
                  Apply Now
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white/30 hover:bg-white/20"
                  onClick={handleBookmark}
                >
                  {isBookmarked ? (
                    <Heart className="h-4 w-4 mr-2 fill-current" />
                  ) : (
                    <Heart className="h-4 w-4 mr-2" />
                  )}
                  {isBookmarked ? 'Saved' : 'Save'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white/30 hover:bg-white/20"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Information Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold">Compensation</h3>
                  </div>
                  <p className="text-lg font-bold text-green-700">{opportunity.compensation_amount}</p>
                  <p className="text-sm text-gray-600 capitalize">{opportunity.compensation_type?.replace('_', ' ')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className={`h-5 w-5 ${isUrgent ? 'text-orange-600' : isExpired ? 'text-red-600' : 'text-blue-600'}`} />
                    <h3 className="font-semibold">Application Deadline</h3>
                  </div>
                  <p className={`text-lg font-bold ${isUrgent ? 'text-orange-700' : isExpired ? 'text-red-700' : 'text-blue-700'}`}>
                    {new Date(opportunity.application_deadline).toLocaleDateString()}
                  </p>
                  <p className={`text-sm ${isUrgent ? 'text-orange-600' : isExpired ? 'text-red-600' : 'text-gray-600'}`}>
                    {isExpired ? 'Deadline passed' : `${daysUntilDeadline} days left`}
                  </p>
                </CardContent>
              </Card>

              {opportunity.duration && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold">Duration</h3>
                    </div>
                    <p className="text-lg font-bold text-purple-700">{opportunity.duration}</p>
                    {opportunity.start_date && (
                      <p className="text-sm text-gray-600">
                        Starts: {new Date(opportunity.start_date).toLocaleDateString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-semibold">Views</h3>
                  </div>
                  <p className="text-lg font-bold text-indigo-700">{opportunity.views_count}</p>
                  <p className="text-sm text-gray-600">Total views</p>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-yellow-500" />
                  About This Opportunity
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{opportunity.long_description || opportunity.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {opportunity.requirements && opportunity.requirements.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Target className="h-6 w-6 text-red-500" />
                    Requirements
                  </h2>
                  <ul className="space-y-2">
                    {opportunity.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {opportunity.benefits && opportunity.benefits.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Award className="h-6 w-6 text-purple-500" />
                    What You'll Get
                  </h2>
                  <ul className="space-y-2">
                    {opportunity.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Application Instructions */}
            {opportunity.application_instructions && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">How to Apply</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-line">{opportunity.application_instructions}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Apply Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-4">Quick Actions</h3>
                
                <Button
                  className="w-full mb-3"
                  size="lg"
                  onClick={() => window.open(opportunity.application_url, '_blank')}
                >
                  Apply Now
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleBookmark}
                >
                  {isBookmarked ? (
                    <>
                      <Heart className="h-4 w-4 mr-2 fill-current" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save for Later
                    </>
                  )}
                </Button>

                <Separator className="my-4" />

                {/* Deadline Reminder */}
                <div className={`p-4 rounded-lg ${isUrgent ? 'bg-orange-50 border border-orange-200' : isExpired ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}>
                  <p className="text-sm font-semibold mb-1">Application Deadline</p>
                  <p className={`text-lg font-bold ${isUrgent ? 'text-orange-700' : isExpired ? 'text-red-700' : 'text-blue-700'}`}>
                    {new Date(opportunity.application_deadline).toLocaleDateString()}
                  </p>
                  <p className={`text-sm mt-1 ${isUrgent ? 'text-orange-600' : isExpired ? 'text-red-600' : 'text-blue-600'}`}>
                    {isExpired ? '⚠️ Deadline has passed' : isUrgent ? `⏰ Only ${daysUntilDeadline} days left!` : `${daysUntilDeadline} days remaining`}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    ⓘ Always verify deadline on official website
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Organization Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">About Organization</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Organization</p>
                    <p className="font-semibold">{opportunity.organization_name}</p>
                  </div>
                  {opportunity.organization_website && (
                    <div>
                      <a
                        href={opportunity.organization_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 text-sm"
                      >
                        Visit Website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  {opportunity.contact_email && (
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <a href={`mailto:${opportunity.contact_email}`} className="text-primary hover:underline text-sm">
                        {opportunity.contact_email}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {opportunity.tags && opportunity.tags.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OpportunityDetail;
