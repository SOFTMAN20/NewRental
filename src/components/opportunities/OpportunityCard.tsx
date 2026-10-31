/**
 * OPPORTUNITY CARD COMPONENT
 * ==========================
 * 
 * Reusable card for displaying opportunity listings
 * Supports: Jobs, Scholarships, Internships, Field Opportunities
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, GraduationCap, Building2, Globe, 
  MapPin, Calendar, Clock, Heart, Share2,
  DollarSign, TrendingUp
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface OpportunityCardProps {
  id: string;
  title: string;
  type: 'job' | 'scholarship' | 'internship' | 'field_opportunity' | 'grant';
  organization_name: string;
  organization_logo?: string;
  location: string;
  is_remote: boolean;
  compensation_type?: string;
  compensation_amount?: string;
  application_deadline: string;
  application_url: string;  // Added for direct linking
  description: string;
  is_featured?: boolean;
  views_count?: number;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
  created_at: string;
}

// Type icons and labels
const TYPE_CONFIG = {
  job: {
    icon: Briefcase,
    label: 'Job',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  scholarship: {
    icon: GraduationCap,
    label: 'Scholarship',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  internship: {
    icon: Building2,
    label: 'Internship',
    color: 'bg-green-100 text-green-700 border-green-200',
  },
  grant: {
    icon: TrendingUp,
    label: 'Grant & Funding',
    color: 'bg-pink-100 text-pink-700 border-pink-200',
  },
  field_opportunity: {
    icon: Globe,
    label: 'Field Opportunity',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
  },
};

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  id,
  title,
  type,
  organization_name,
  organization_logo,
  location,
  is_remote,
  compensation_type,
  compensation_amount,
  application_deadline,
  application_url,  // Added
  description,
  is_featured,
  views_count,
  isFavorited,
  onToggleFavorite,
  created_at,
}) => {
  const typeConfig = TYPE_CONFIG[type];
  const TypeIcon = typeConfig.icon;

  // Calculate days until deadline
  const daysUntilDeadline = Math.ceil(
    (new Date(application_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  const isExpired = daysUntilDeadline < 0;

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
      is_featured ? 'ring-2 ring-purple-400 ring-offset-2' : ''
    }`}>
      {/* Featured Badge */}
      {is_featured && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          Featured
        </div>
      )}

      <CardContent className="p-4 sm:p-5">
        {/* Header with Logo and Type */}
        <div className="flex items-start gap-3 mb-3">
          {/* Organization Logo */}
          <div className="flex-shrink-0">
            {organization_logo ? (
              <img
                src={organization_logo}
                alt={organization_name}
                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border border-gray-200">
                <TypeIcon className="h-6 w-6 text-blue-600" />
              </div>
            )}
          </div>

          {/* Type Badge and Favorite */}
          <div className="flex-1 flex items-start justify-between">
            <Badge className={`${typeConfig.color} border`}>
              <TypeIcon className="h-3 w-3 mr-1" />
              {typeConfig.label}
            </Badge>

            {/* Favorite Button */}
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onToggleFavorite(id);
                }}
                className="h-8 w-8 p-0 hover:bg-red-50"
              >
                <Heart
                  className={`h-4 w-4 ${
                    isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'
                  }`}
                />
              </Button>
            )}
          </div>
        </div>

        {/* Title and Organization */}
        <a 
          href={application_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
        </a>
        <p className="text-sm text-gray-600 font-medium mb-3">{organization_name}</p>

        {/* Description Preview */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>

        {/* Location and Remote */}
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="line-clamp-1">{location}</span>
          {is_remote && (
            <Badge variant="outline" className="ml-auto text-xs">
              Remote
            </Badge>
          )}
        </div>

        {/* Compensation */}
        {compensation_type && (
          <div className="flex items-center gap-2 mb-3 text-sm">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-700 capitalize">
              {compensation_type.replace('_', ' ')}
              {compensation_amount && ` • ${compensation_amount}`}
            </span>
          </div>
        )}

        {/* Deadline */}
        <div className={`flex items-center gap-2 mb-4 text-sm ${
          isExpired ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-gray-600'
        }`}>
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span className="font-medium">
            {isExpired ? (
              'Deadline passed'
            ) : isUrgent ? (
              `${daysUntilDeadline} days left!`
            ) : (
              `Deadline: ${new Date(application_deadline).toLocaleDateString()}`
            )}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
            </span>
            {views_count !== undefined && (
              <span className="flex items-center gap-1">
                👁️ {views_count}
              </span>
            )}
          </div>

          {/* Apply Now Button */}
          <a 
            href={application_url} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button
              size="sm"
              className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white"
            >
              Apply Now →
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpportunityCard;
