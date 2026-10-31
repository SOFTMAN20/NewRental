/**
 * OPPORTUNITY FILTERS COMPONENT
 * =============================
 * 
 * Advanced filtering sidebar for opportunities
 * Supports multiple filter types and combinations
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Filter, X, Briefcase, GraduationCap, Building2, Globe,
  DollarSign, MapPin, Calendar
} from 'lucide-react';

export interface OpportunityFilters {
  types: string[];
  locations: string[];
  compensationTypes: string[];
  isRemoteOnly: boolean;
  searchQuery: string;
  minCompensation?: number;
  maxCompensation?: number;
  deadlineBefore?: string;
  deadlineAfter?: string;
}

interface OpportunityFiltersProps {
  filters: OpportunityFilters;
  onFiltersChange: (filters: OpportunityFilters) => void;
  onClearFilters: () => void;
}

const OPPORTUNITY_TYPES = [
  { id: 'job', label: 'Jobs', icon: Briefcase, color: 'text-blue-600' },
  { id: 'scholarship', label: 'Scholarships', icon: GraduationCap, color: 'text-purple-600' },
  { id: 'internship', label: 'Internships', icon: Building2, color: 'text-green-600' },
  { id: 'field_opportunity', label: 'Field Opportunities', icon: Globe, color: 'text-orange-600' },
];

const COMPENSATION_TYPES = [
  { id: 'paid', label: 'Paid' },
  { id: 'unpaid', label: 'Unpaid' },
  { id: 'stipend', label: 'Stipend' },
  { id: 'full_scholarship', label: 'Full Scholarship' },
  { id: 'partial_scholarship', label: 'Partial Scholarship' },
];

const POPULAR_LOCATIONS = [
  'Dar es Salaam',
  'Arusha',
  'Mwanza',
  'Dodoma',
  'Mbeya',
  'Morogoro',
  'Zanzibar',
  'Remote',
];

const OpportunityFiltersComponent: React.FC<OpportunityFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const handleTypeToggle = (typeId: string) => {
    const newTypes = filters.types.includes(typeId)
      ? filters.types.filter((t) => t !== typeId)
      : [...filters.types, typeId];
    onFiltersChange({ ...filters, types: newTypes });
  };

  const handleCompensationToggle = (compId: string) => {
    const newComps = filters.compensationTypes.includes(compId)
      ? filters.compensationTypes.filter((c) => c !== compId)
      : [...filters.compensationTypes, compId];
    onFiltersChange({ ...filters, compensationTypes: newComps });
  };

  const handleLocationToggle = (location: string) => {
    const newLocations = filters.locations.includes(location)
      ? filters.locations.filter((l) => l !== location)
      : [...filters.locations, location];
    onFiltersChange({ ...filters, locations: newLocations });
  };

  const activeFiltersCount =
    filters.types.length +
    filters.locations.length +
    filters.compensationTypes.length +
    (filters.isRemoteOnly ? 1 : 0);

  return (
    <Card className="sticky top-24">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Opportunity Type Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700">Opportunity Type</Label>
          <div className="space-y-2">
            {OPPORTUNITY_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type.id}`}
                    checked={filters.types.includes(type.id)}
                    onCheckedChange={() => handleTypeToggle(type.id)}
                  />
                  <Label
                    htmlFor={`type-${type.id}`}
                    className="flex items-center gap-2 cursor-pointer text-sm font-normal"
                  >
                    <Icon className={`h-4 w-4 ${type.color}`} />
                    {type.label}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Location Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </Label>
          <div className="space-y-2">
            {POPULAR_LOCATIONS.map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${location}`}
                  checked={filters.locations.includes(location)}
                  onCheckedChange={() => handleLocationToggle(location)}
                />
                <Label
                  htmlFor={`location-${location}`}
                  className="cursor-pointer text-sm font-normal"
                >
                  {location}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Remote Only Toggle */}
        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Checkbox
            id="remote-only"
            checked={filters.isRemoteOnly}
            onCheckedChange={(checked) =>
              onFiltersChange({ ...filters, isRemoteOnly: checked as boolean })
            }
          />
          <Label htmlFor="remote-only" className="cursor-pointer text-sm font-medium text-blue-900">
            🌐 Remote Opportunities Only
          </Label>
        </div>

        {/* Compensation Type Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Compensation
          </Label>
          <div className="space-y-2">
            {COMPENSATION_TYPES.map((comp) => (
              <div key={comp.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`comp-${comp.id}`}
                  checked={filters.compensationTypes.includes(comp.id)}
                  onCheckedChange={() => handleCompensationToggle(comp.id)}
                />
                <Label
                  htmlFor={`comp-${comp.id}`}
                  className="cursor-pointer text-sm font-normal"
                >
                  {comp.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Deadline Range */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Application Deadline
          </Label>
          <div className="space-y-2">
            <div>
              <Label className="text-xs text-gray-600">From</Label>
              <Input
                type="date"
                value={filters.deadlineAfter || ''}
                onChange={(e) =>
                  onFiltersChange({ ...filters, deadlineAfter: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">To</Label>
              <Input
                type="date"
                value={filters.deadlineBefore || ''}
                onChange={(e) =>
                  onFiltersChange({ ...filters, deadlineBefore: e.target.value })
                }
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpportunityFiltersComponent;
