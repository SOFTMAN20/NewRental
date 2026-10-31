/**
 * OPPORTUNITIES INDEX PAGE
 * ========================
 * 
 * Main opportunities listing page
 * Browse all jobs, scholarships, internships, and field opportunities
 */

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import OpportunityCard from '@/components/opportunities/OpportunityCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, Plus, 
  Briefcase, GraduationCap, Building2, Globe,
  TrendingUp, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { OPPORTUNITIES_DATA } from '@/data/opportunities';

// Using centralized opportunities data
const MOCK_OPPORTUNITIES = OPPORTUNITIES_DATA;

/*
// OLD DATA - NOW USING CENTRALIZED FILE
const OLD_MOCK_OPPORTUNITIES = [
// Data now imported from centralized file
*/

const QUICK_FILTERS = [
  { type: 'all', icon: TrendingUp, label: 'All Opportunities', color: 'bg-gray-100 text-gray-700' },
  { type: 'job', icon: Briefcase, label: 'Jobs', color: 'bg-blue-100 text-blue-700' },
  { type: 'scholarship', icon: GraduationCap, label: 'Scholarships', color: 'bg-purple-100 text-purple-700' },
  { type: 'internship', icon: Building2, label: 'Internships', color: 'bg-green-100 text-green-700' },
  { type: 'grant', icon: TrendingUp, label: 'Grants & Funding', color: 'bg-pink-100 text-pink-700' },
  { type: 'field_opportunity', icon: Globe, label: 'Field Work', color: 'bg-orange-100 text-orange-700' },
];

const OpportunitiesIndex = () => {
  const { user } = useAuth();
  const [quickFilter, setQuickFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter opportunities
  const filteredOpportunities = MOCK_OPPORTUNITIES.filter((opp) => {
    // Quick filter
    if (quickFilter !== 'all' && opp.type !== quickFilter) return false;

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !opp.title.toLowerCase().includes(query) &&
        !opp.description.toLowerCase().includes(query) &&
        !opp.organization_name.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    return true;
  });

  // Sort by newest
  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    if (!user) return;
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      {/* Hero Section with Background Image */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white pt-20 sm:pt-24 lg:pt-28 pb-12 overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(/images/team1.jpg)',
            opacity: 0.2
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/80 to-pink-900/80" />
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 flex items-center gap-3 text-white drop-shadow-lg">
                🎯 Fursa za Kazi na Ufadhili
              </h1>
              <p className="text-lg sm:text-xl text-white/95 drop-shadow-md font-medium">
                Opportunities for Jobs, Scholarships, Internships & Funding
              </p>
              <p className="text-sm mt-2 text-white/90 font-semibold bg-white/10 inline-block px-4 py-2 rounded-full backdrop-blur-sm">
                ✨ {sortedOpportunities.length} opportunities available
              </p>
            </div>

            {/* Post Opportunity Button - Disabled */}
            <Button
              size="lg"
              disabled
              className="bg-gray-400 text-gray-600 cursor-not-allowed opacity-60"
            >
              <Plus className="h-5 w-5 mr-2" />
              Post Opportunity
            </Button>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {QUICK_FILTERS.map((filter) => {
              const Icon = filter.icon;
              return (
                <Button
                  key={filter.type}
                  variant={quickFilter === filter.type ? 'default' : 'secondary'}
                  onClick={() => setQuickFilter(filter.type)}
                  className={`rounded-full ${
                    quickFilter === filter.type
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                  size="sm"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {filter.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{sortedOpportunities.length}</span> opportunities
          </p>
        </div>

        {/* Opportunities Grid */}
        {sortedOpportunities.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                {...opportunity}
                isFavorited={favoriteIds.includes(opportunity.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-8 inline-block mb-6">
                <Search className="h-16 w-16 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No opportunities found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OpportunitiesIndex;
