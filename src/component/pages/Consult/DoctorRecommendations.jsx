/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/Consult/DoctorRecommendations.jsx
import React from 'react';
import { 
  X, 
  User,
  Search,
  RefreshCw,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import DoctorCard from './DoctorCard';

const DoctorRecommendations = ({ 
  doctors, 
  consultationId, 
  onClose, 
  onSearch, 
  isVisible = true
}) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [searchSpecialty, setSearchSpecialty] = React.useState('');
  const [sortBy, setSortBy] = React.useState('rating');
  const [filterDistance, setFilterDistance] = React.useState('all');

  const handleRefreshDoctors = async () => {
    setIsRefreshing(true);
    try {
      if (onSearch) {
        await onSearch(searchSpecialty || 'general physician');
        toast.success('Doctor list refreshed!');
      }
    } catch (error) {
      toast.error('Failed to refresh doctors');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSpecialtySearch = async () => {
    if (!searchSpecialty.trim()) {
      toast.error('Please enter a specialty to search');
      return;
    }
    
    setIsRefreshing(true);
    try {
      if (onSearch) {
        await onSearch(searchSpecialty);
        toast.success(`Searching for ${searchSpecialty} specialists...`);
      }
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getFilteredAndSortedDoctors = () => {
    if (!doctors) return [];
    
    let filtered = [...doctors];
    
    // ✅ ENHANCED: Better distance filtering
    if (filterDistance !== 'all') {
      const maxDistance = parseInt(filterDistance);
      filtered = filtered.filter(doctor => {
        // Use distance_km if available
        const distance = doctor.distance_km || 0;
        return distance <= maxDistance;
      });
    }
    
    // ✅ ENHANCED: Better sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'distance':
          return (a.distance_km || 999) - (b.distance_km || 999);
        case 'price':
          return (a.consultation_fee || 999) - (b.consultation_fee || 999);
        case 'experience': // ✅ NEW
          return (b.experience_years || 0) - (a.experience_years || 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const filteredDoctors = getFilteredAndSortedDoctors();

  // No doctors state - Mobile Optimized
  if (!doctors || doctors.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600 flex-shrink-0" />
                <span className="truncate">Find Doctors</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">No doctors found. Try different search.</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-center">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <User className="h-8 w-8 sm:h-10 sm:w-10 text-teal-600" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Doctors Found</h4>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Try searching for a specific specialty</p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="e.g., Cardiologist, Dentist..."
                value={searchSpecialty}
                onChange={(e) => setSearchSpecialty(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSpecialtySearch()}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-xs sm:text-sm"
              />
              <Search className="absolute left-3 top-3 sm:top-3.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
            </div>
            
            <button
              onClick={handleSpecialtySearch}
              disabled={isRefreshing || !searchSpecialty.trim()}
              className="w-full py-2.5 sm:py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span>Search Doctors</span>
            </button>

            <div className="pt-3 sm:pt-4 border-t border-gray-200">
              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Popular Specialties:</p>
              <div className="grid grid-cols-2 gap-2">
                {['Cardiologist', 'Dentist', 'Dermatologist', 'Pediatrician'].map((specialty) => (
                  <button
                    key={specialty}
                    onClick={() => {
                      setSearchSpecialty(specialty);
                      onSearch && onSearch(specialty);
                    }}
                    className="p-2 text-[10px] sm:text-xs bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors font-medium truncate"
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header - Mobile Optimized */}
      <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-start justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center space-x-2">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600 flex-shrink-0" />
              <span className="truncate">Recommended Doctors</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {filteredDoctors.length} specialists found
            </p>
          </div>
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            {/* <button
              onClick={() => toast.info('Emergency: 108')}
              className="text-[10px] sm:text-xs bg-red-50 text-red-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-red-100 transition-colors flex items-center space-x-1 font-medium border border-red-200"
            >
              <AlertTriangle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span className="hidden xs:inline">SOS</span>
            </button> */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search and Filters - Mobile Compact */}

        <div className="space-y-2 sm:space-y-3">
          {/* <div className="relative">
            <input
              type="text"
              placeholder="Search by specialty..."
              value={searchSpecialty}
              onChange={(e) => setSearchSpecialty(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSpecialtySearch()}
              className="w-full pl-8 sm:pl-10 pr-16 sm:pr-20 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-xs sm:text-sm"
            />
            <Search className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
            <button
              onClick={handleSpecialtySearch}
              disabled={isRefreshing || !searchSpecialty.trim()}
              className="absolute right-1 sm:right-1.5 top-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 transition-colors text-xs"
            >
              {isRefreshing ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Search className="h-3 w-3" />
              )}
            </button>
          </div> */}
          
          <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2">
            {/* ✅ ENHANCED: Added Experience sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="rating">Sort: Rating</option>
              <option value="distance">Sort: Distance</option>
              <option value="price">Sort: Price</option>
              <option value="experience">Sort: Experience</option>
            </select>
            
            <select
              value={filterDistance}
              onChange={(e) => setFilterDistance(e.target.value)}
              className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Distances</option>
              <option value="5">Within 5km</option>
              <option value="10">Within 10km</option>
              <option value="15">Within 15km</option>
            </select>
          </div>
          
          {/* <button
            onClick={handleRefreshDoctors}
            disabled={isRefreshing}
            className="w-full text-[10px] sm:text-xs bg-teal-50 text-teal-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-teal-100 transition-colors flex items-center justify-center space-x-1 font-medium border border-teal-200"
          >
            {isRefreshing ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
            <span>Refresh</span>
          </button> */}

        </div>
      </div>

      {/* Doctors List - Mobile Optimized Spacing */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3 lg:p-4 space-y-3 sm:space-y-4">
        {filteredDoctors.map((doctor, index) => (
          <DoctorCard
            key={doctor.place_id || doctor.id || index}
            doctor={doctor}
            consultationId={consultationId}
            index={index}
            onBooking={(response) => {
              console.log('Booking successful:', response);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DoctorRecommendations;





















