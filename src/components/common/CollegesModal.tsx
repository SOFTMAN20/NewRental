/**
 * COLLEGES MODAL - UNIVERSITY SELECTOR
 * ====================================
 * 
 * Modal showing all universities/colleges we work with in Tanzania
 * Similar to Student.com city selector
 * 
 * Z-INDEX FIX:
 * This modal can be opened from within BrowseFilters modal,
 * so we need higher z-index to appear on top
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/integrations/supabase/client';

interface College {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
  image: string;
  propertyCount?: number; // Add property count
}

const colleges: College[] = [
  {
    id: 'b9fd4ef3-343c-4035-b3a7-13b6d085823c', // MUST UUID from database
    name: 'Mbeya University of Science and Technology',
    abbreviation: 'MUST',
    city: 'Mbeya',
    image: '/images/collegephotos/must.png'
  },
  {
    id: '89baa0cd-6d38-4dbc-a8fe-eced5006a1eb', // TEKU UUID from database
    name: 'Teofilo Kisanji University',
    abbreviation: 'TEKU',
    city: 'Mbeya',
    image: '/images/collegephotos/teku.jpeg'
  },
  {
    id: '9c0445e4-5492-46ad-87d8-7aa19564a0d1', // UDSM UUID
    name: 'University of Dar es Salaam',
    abbreviation: 'UDSM',
    city: 'Dar es Salaam',
    image: '/images/collegephotos/udsm.jpg'
  },
  {
    id: '3a66a06e-0dde-402c-9c85-69c992085f39', // DIT UUID
    name: 'Dar es Salaam Institute of Technology',
    abbreviation: 'DIT',
    city: 'Dar es Salaam',
    image: '/images/collegephotos/dit.jpg'
  },
  {
    id: '4f57b203-d56d-4f7d-8685-79c5752ae658', // OUT UUID
    name: 'Open University of Tanzania',
    abbreviation: 'OUT',
    city: 'Dar es Salaam',
    image: '/images/collegephotos/out.jpg'
  },
  {
    id: '993c5329-9588-4d10-ba81-c0bfde085940', // ARU UUID
    name: 'Ardhi University',
    abbreviation: 'ARU',
    city: 'Dar es Salaam',
    image: '/images/collegephotos/aru.jpg'
  },
  {
    id: '4b003b77-b817-4371-bb2e-e3efc2f035f4', // MUHAS UUID
    name: 'Muhimbili University',
    abbreviation: 'MUHAS',
    city: 'Dar es Salaam',
    image: '/images/collegephotos/muhas.jpg'
  },
  {
    id: '6321d492-87f2-49a3-899f-73380410366c', // UDOM UUID
    name: 'University of Dodoma',
    abbreviation: 'UDOM',
    city: 'Dodoma',
    image: '/images/collegephotos/udom.jpg'
  },
  {
    id: '3fb45e07-d761-48c6-851c-61058ae42c17', // MU UUID
    name: 'Mzumbe University',
    abbreviation: 'MU',
    city: 'Morogoro',
    image: '/images/collegephotos/mzumbe.jpg'
  },
  {
    id: '13', // MU Mbeya - need UUID
    name: 'Mzumbe University Mbeya Campus',
    abbreviation: 'MU Mbeya',
    city: 'Mbeya',
    image: '/images/collegephotos/mzumbe.jpg'
  },
  {
    id: '68794951-3342-4633-9970-ae19cbea45c7', // SUA UUID
    name: 'Sokoine University',
    abbreviation: 'SUA',
    city: 'Morogoro',
    image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400&h=300&fit=crop'
  },
  {
    id: '369442a2-5421-4eb3-add0-e5677f541ebe', // IFM UUID
    name: 'Institute of Finance Management',
    abbreviation: 'IFM',
    city: 'Dar es Salaam',
    image: '/images/collegephotos/ifm.jpg'
  },
  {
    id: '12', // CUOM - need UUID
    name: 'Catholic University of Mbeya',
    abbreviation: 'CUOM',
    city: 'Mbeya',
    image: '/images/collegephotos/cuom.jpg'
  },
  {
    id: '14', // CBE - need UUID
    name: 'College of Business Education',
    abbreviation: 'CBE',
    city: 'Dar es Salaam',
    image: '/images/collegephotos/cbe.jpg'
  }
];

interface CollegesModalProps {
  open: boolean;
  onClose: () => void;
}

const CollegesModal: React.FC<CollegesModalProps> = ({ open, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [collegesWithCounts, setCollegesWithCounts] = useState<College[]>(colleges);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch property counts for each university
  useEffect(() => {
    const fetchPropertyCounts = async () => {
      if (!open) return;
      
      setIsLoading(true);
      console.log('🔍 Fetching property counts for universities...');
      
      try {
        // Fetch all active properties with university info
        const { data: properties, error } = await supabase
          .from('properties')
          .select('university_id, universities(id, name, abbreviation)')
          .eq('status', 'active')
          .eq('is_available', true);

        if (error) {
          console.error('❌ Error fetching properties:', error);
          return;
        }

        console.log('✅ Properties fetched:', properties?.length);
        console.log('📋 Sample properties:', properties?.slice(0, 5));

        // Count properties per university
        const propertyCounts: Record<string, number> = {};
        properties?.forEach(property => {
          if (property.university_id) {
            const uniId = property.university_id.toString();
            propertyCounts[uniId] = (propertyCounts[uniId] || 0) + 1;
          }
        });

        console.log('📊 Property counts by ID:', propertyCounts);
        console.log('🎓 MUST (id=9):', propertyCounts['9'] || 0);
        console.log('🎓 TEKU (id=11):', propertyCounts['11'] || 0);

        // Update colleges with counts
        const updatedColleges = colleges.map(college => ({
          ...college,
          propertyCount: propertyCounts[college.id] || 0
        }));

        console.log('✅ Colleges with counts:', updatedColleges.map(c => ({ 
          id: c.id, 
          abbr: c.abbreviation, 
          count: c.propertyCount 
        })));

        setCollegesWithCounts(updatedColleges);
      } catch (error) {
        console.error('💥 Error fetching property counts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyCounts();
  }, [open]);

  // Force higher z-index for overlay and content when modal opens
  useEffect(() => {
    if (open) {
      // Find and update z-index of overlay and content
      setTimeout(() => {
        const overlays = document.querySelectorAll('[data-radix-dialog-overlay]');
        const contents = document.querySelectorAll('[data-radix-dialog-content]');
        
        overlays.forEach((overlay) => {
          (overlay as HTMLElement).style.zIndex = '60';
        });
        
        contents.forEach((content) => {
          (content as HTMLElement).style.zIndex = '60';
        });
      }, 0);
    }
  }, [open]);

  const filteredColleges = collegesWithCounts.filter(college =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-5xl max-h-[90vh] overflow-y-auto"
        data-radix-dialog-content
      >
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
            Which university do you attend?
          </DialogTitle>
        </DialogHeader>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search universities in Tanzania..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-base border-2 rounded-full"
          />
        </div>

        {/* Section Title */}
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">
            Universities in Tanzania
          </h3>
        </div>

        {/* University Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredColleges.map((college) => {
            // Force enable MUST and TEKU even if no properties yet
            const isAlwaysEnabled = ['b9fd4ef3-343c-4035-b3a7-13b6d085823c', '89baa0cd-6d38-4dbc-a8fe-eced5006a1eb'].includes(college.id);
            const hasProperties = (college.propertyCount || 0) > 0 || isAlwaysEnabled;
            
            // For Mbeya universities (MUST & TEKU), show all Mbeya properties
            const isMbeyaUniversity = college.city === 'Mbeya';
            const browseUrl = isMbeyaUniversity 
              ? `/browse?city=Mbeya` 
              : `/browse?university=${college.abbreviation}`;
            
            if (hasProperties) {
              // University with properties - clickable link
              return (
                <Link
                  key={college.id}
                  to={browseUrl}
                  onClick={onClose}
                  className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* College Image */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={college.image}
                      alt={college.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  </div>

                  {/* College Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h4 className="text-white font-bold text-sm sm:text-base line-clamp-2">
                      {college.abbreviation}
                    </h4>
                    <p className="text-white/80 text-xs mt-0.5">{college.city}</p>
                  </div>
                </Link>
              );
            } else {
              // University without properties - disabled card
              return (
                <div
                  key={college.id}
                  className="relative overflow-hidden rounded-2xl shadow-md opacity-50 cursor-not-allowed"
                  title="No properties available yet"
                >
                  {/* College Image */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={college.image}
                      alt={college.name}
                      className="w-full h-full object-cover grayscale"
                    />
                    {/* Overlay with "Coming Soon" */}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="text-center px-2">
                        <p className="text-white font-bold text-xs sm:text-sm">Coming Soon</p>
                        <p className="text-white/80 text-xs mt-1">No properties yet</p>
                      </div>
                    </div>
                  </div>

                  {/* College Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gray-900/80">
                    <h4 className="text-white font-bold text-sm sm:text-base line-clamp-2">
                      {college.abbreviation}
                    </h4>
                    <p className="text-white/60 text-xs mt-0.5">{college.city}</p>
                  </div>
                </div>
              );
            }
          })}
        </div>

        {/* No Results */}
        {filteredColleges.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No universities found</p>
            <p className="text-gray-400 text-sm mt-2">Try a different search term</p>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-gray-700">
            We're currently working with universities across Tanzania.
          </p>
          <button className="text-sm text-primary font-semibold mt-2 hover:underline">
            Click here to learn more →
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollegesModal;
