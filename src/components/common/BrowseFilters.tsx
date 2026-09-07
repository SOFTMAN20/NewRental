/**
 * BROWSE FILTERS - COMPREHENSIVE FILTER SYSTEM
 * ============================================
 * 
 * Modern, comprehensive filtering UI for Browse page
 * Includes: Property Type, Region, Amenities, Gender, Beds, University
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Home, Users, Award, Building, Bed, Wifi, Shield, 
  Utensils, Car, Zap, Waves, Sofa, GraduationCap, Bath,
  X, MapPin, Droplets, BookOpen, Camera
} from 'lucide-react';

interface FilterState {
  propertyType: string[];
  region: string;
  amenities: string[];
  gender: string;
  beds: string;
  university: string;
}

interface BrowseFiltersProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onClearAll: () => void;
  onOpenCollegesModal: () => void;
}

const propertyTypes = [
  { value: 'single_room', label: 'Single Room', icon: Bed },
  { value: 'shared_room', label: 'Shared Room', icon: Users },
  { value: 'master_room', label: 'Master Room', icon: Award },
  { value: 'self_contained', label: 'Self Contained', icon: Home },
  { value: 'apartment', label: 'Apartment', icon: Building },
  { value: 'studio', label: 'Studio', icon: Home },
];

const amenitiesList = [
  { key: 'WiFi', label: 'WiFi', icon: Wifi },
  { key: '24_Hour_Security', label: 'Security', icon: Shield },
  { key: 'Kitchen', label: 'Kitchen', icon: Utensils },
  { key: 'Parking', label: 'Parking', icon: Car },
  { key: 'Backup_Generator', label: 'Generator', icon: Zap },
  { key: 'Hot_Shower', label: 'Hot Water', icon: Waves },
  { key: 'Furnished', label: 'Furnished', icon: Sofa },
  { key: 'CCTV', label: 'CCTV', icon: Camera },
];

const regions = [
  'Dar es Salaam',
  'Mbeya',
  'Dodoma',
  'Morogoro',
  'Arusha',
  'Mwanza'
];

const BrowseFilters: React.FC<BrowseFiltersProps> = ({
  filters,
  onFilterChange,
  onClearAll,
  onOpenCollegesModal
}) => {
  const togglePropertyType = (type: string) => {
    const newTypes = filters.propertyType.includes(type)
      ? filters.propertyType.filter(t => t !== type)
      : [...filters.propertyType, type];
    onFilterChange('propertyType', newTypes);
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    onFilterChange('amenities', newAmenities);
  };

  const hasActiveFilters = 
    filters.propertyType.length > 0 ||
    filters.region !== '' ||
    filters.amenities.length > 0 ||
    (filters.gender && filters.gender !== 'all') ||
    (filters.beds && filters.beds !== 'all') ||
    filters.university !== '';

  return (
    <div className="space-y-6">
      {/* Property Type Filter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Building className="h-4 w-4 text-primary" />
          Property Type
        </h3>
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => togglePropertyType(value)}
              className={`px-4 py-2 rounded-full border-2 transition-all duration-200 text-sm font-medium flex items-center gap-2 ${
                filters.propertyType.includes(value)
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-primary/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Region Filter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Region/City
        </h3>
        <Select value={filters.region} onValueChange={(value) => onFilterChange('region', value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Regions</SelectItem>
            {regions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Amenities Filter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Wifi className="h-4 w-4 text-primary" />
          Amenities
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {amenitiesList.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => toggleAmenity(key)}
              className={`px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 ${
                filters.amenities.includes(key)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Gender & Beds Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gender Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Gender Restriction
          </h3>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All', emoji: '👥' },
              { value: 'male_only', label: 'Male Only', emoji: '👨‍🎓' },
              { value: 'female_only', label: 'Female Only', emoji: '👩‍🎓' }
            ].map(({ value, label, emoji }) => (
              <button
                key={value}
                onClick={() => onFilterChange('gender', value)}
                className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                  filters.gender === value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-1">{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Beds Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Bed className="h-4 w-4 text-primary" />
            Number of Beds
          </h3>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: '1', label: '1 Bed' },
              { value: '2', label: '2 Beds' },
              { value: '3+', label: '3+ Beds' }
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onFilterChange('beds', value)}
                className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                  filters.beds === value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* University Filter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-primary" />
          University/College
        </h3>
        <Button
          variant="outline"
          onClick={onOpenCollegesModal}
          className="w-full justify-between"
        >
          {filters.university || 'Select University'}
          <MapPin className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Clear All Button */}
      {hasActiveFilters && (
        <div className="pt-4 border-t">
          <Button
            variant="ghost"
            onClick={onClearAll}
            className="w-full text-gray-600 hover:text-red-600 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default BrowseFilters;
