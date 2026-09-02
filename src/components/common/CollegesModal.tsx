/**
 * COLLEGES MODAL - UNIVERSITY SELECTOR
 * ====================================
 * 
 * Modal showing all universities/colleges we work with in Tanzania
 * Similar to Student.com city selector
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface College {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
  image: string;
}

const colleges: College[] = [
  {
    id: '1',
    name: 'University of Dar es Salaam',
    abbreviation: 'UDSM',
    city: 'Dar es Salaam',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    name: 'Dar es Salaam Institute of Technology',
    abbreviation: 'DIT',
    city: 'Dar es Salaam',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    name: 'Ardhi University',
    abbreviation: 'ARU',
    city: 'Dar es Salaam',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    name: 'Muhimbili University',
    abbreviation: 'MUHAS',
    city: 'Dar es Salaam',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop'
  },
  {
    id: '5',
    name: 'University of Dodoma',
    abbreviation: 'UDOM',
    city: 'Dodoma',
    image: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&h=300&fit=crop'
  },
  {
    id: '6',
    name: 'Mzumbe University',
    abbreviation: 'MU',
    city: 'Morogoro',
    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop'
  },
  {
    id: '7',
    name: 'Sokoine University',
    abbreviation: 'SUA',
    city: 'Morogoro',
    image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400&h=300&fit=crop'
  },
  {
    id: '8',
    name: 'Institute of Finance Management',
    abbreviation: 'IFM',
    city: 'Dar es Salaam',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop'
  }
];

interface CollegesModalProps {
  open: boolean;
  onClose: () => void;
}

const CollegesModal: React.FC<CollegesModalProps> = ({ open, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
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
          {filteredColleges.map((college) => (
            <Link
              key={college.id}
              to={`/browse?university=${college.abbreviation}`}
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
          ))}
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
