/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/Consult/DoctorCard.jsx
import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Star, 
  Calendar, 
  DollarSign, 
  Award, 
  TrendingUp,
  CheckCircle,
  ExternalLink,
  MessageSquare,
  Navigation,
  User,
  StarHalf
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import BookingModal from '../Appointment/AppointmentBooking/BookingModal';

const DoctorCard = ({ 
  doctor, 
  consultationId = null,
  onBooking = null, 
  isSelected = false,
  index = 0
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  if (!doctor) return null;

  // ✅ HELPER: Build WhatsApp link (with fallback)
  const getWhatsAppLink = () => {
    // Prefer backend's pre-built link
    if (doctor.action_links?.whatsapp) {
      return doctor.action_links.whatsapp;
    }
    
    // Fallback: Build manually
    if (doctor.whatsapp || doctor.phone) {
      const phoneNumber = (doctor.whatsapp || doctor.phone).replace(/\D/g, '');
      const message = `Hi ${doctor.name}, I'd like to schedule a consultation.`;
      return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    }
    
    return null;
  };

  // ✅ HELPER: Build call link (with fallback)
  const getCallLink = () => {
    // Prefer backend's pre-built link
    if (doctor.action_links?.call) {
      return doctor.action_links.call;
    }
    
    // Fallback: Build manually
    if (doctor.phone) {
      return `tel:${doctor.phone}`;
    }
    
    return null;
  };

  // ✅ HELPER: Build maps link (with fallback)
  const getMapsLink = () => {
    // Prefer backend's pre-built link
    if (doctor.action_links?.maps) {
      return doctor.action_links.maps;
    }
    
    // Fallback: Build manually using address or coordinates
    if (doctor.address) {
      const query = encodeURIComponent(doctor.address);
      return `https://www.google.com/maps/search/?api=1&query=${query}`;
    }
    
    if (doctor.latitude && doctor.longitude) {
      return `https://www.google.com/maps/search/?api=1&query=${doctor.latitude},${doctor.longitude}`;
    }
    
    return null;
  };

  const getMatchScoreColor = (score) => {
    if (!score) return 'gray';
    const percentage = score * 100;
    if (percentage >= 80) return 'green';
    if (percentage >= 60) return 'blue';
    if (percentage >= 40) return 'amber';
    return 'red';
  };

  const matchScoreColor = getMatchScoreColor(doctor.match_score);

  const handleBookingSuccess = (response) => {
    toast.success(`✅ Booking confirmed!`);
    toast.success(`📱 Booking ID: ${response.booking_id}`);
    toast.success(`WhatsApp sent to clinic & you!`);
    setShowBookingModal(false);
    onBooking && onBooking(response);
  };

  // Build full address from components (with fallback)
  const getFullAddress = () => {
    if (doctor.address_components && Object.keys(doctor.address_components).length > 0) {
      const addr = doctor.address_components;
      const parts = [
        addr.street,
        addr.city,
        addr.state,
        addr.postal_code
      ].filter(Boolean);
      
      if (parts.length > 0) {
        return parts.join(', ');
      }
    }
    // Fallback to regular address
    return doctor.address || doctor.clinic_name || 'Address not available';
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-yellow-400 text-yellow-400" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-yellow-400 text-yellow-400" />
      );
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-300" />
      );
    }
    
    return stars;
  };

  // ✅ Get action links (with fallbacks)
  const whatsappLink = getWhatsAppLink();
  const callLink = getCallLink();
  const mapsLink = getMapsLink();

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          bg-white rounded-lg border-2 transition-all duration-300 overflow-hidden relative
          ${isSelected 
            ? 'border-teal-500 shadow-lg scale-102' 
            : 'border-gray-200 hover:border-teal-300 hover:shadow-md'
          }
        `}
      >
        {/* Index Badge */}
        <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-gray-900 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full z-10">
          #{index + 1}
        </div>

        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-3 sm:p-4 border-b border-gray-100">
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <div className="flex-1 pr-10 sm:pr-12 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 truncate">
                {doctor.name}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-teal-600 mb-1.5 sm:mb-2 truncate">
                {doctor.specialty}
              </p>
              {doctor.why_recommended && (
                <p className="text-[10px] sm:text-xs text-gray-600 italic p-1.5 sm:p-2 bg-white rounded border-l-2 border-teal-400 line-clamp-2">
                  "{doctor.why_recommended}"
                </p>
              )}
            </div>

            {doctor.match_score && (
              <div className={`
                flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full flex-shrink-0
                ${matchScoreColor === 'green' ? 'bg-green-100 text-green-700' :
                  matchScoreColor === 'blue' ? 'bg-blue-100 text-blue-700' :
                  matchScoreColor === 'amber' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'}
                font-bold
              `}>
                <div className="text-center">
                  <div className="text-xs sm:text-sm font-bold">
                    {Math.round(doctor.match_score * 100)}%
                  </div>
                  <div className="text-[9px] sm:text-xs">Match</div>
                </div>
              </div>
            )}
          </div>

          {/* Rating with stars */}
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center space-x-1 min-w-0">
              {doctor.rating && (
                <>
                  <div className="flex items-center space-x-0.5">
                    {renderStars(doctor.rating)}
                  </div>
                  <span className="font-semibold text-gray-900 ml-1">{doctor.rating.toFixed(1)}</span>
                  <span className="text-gray-500 truncate">({doctor.reviews_count || 0})</span>
                </>
              )}
            </div>
            
            {doctor.is_verified && (
              <div className="flex items-center space-x-1 text-green-600 flex-shrink-0">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-[10px] sm:text-xs font-medium">Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          {doctor.clinic_name && (
            <div className="flex items-start space-x-2 sm:space-x-3">
              <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-500 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs text-gray-500">Clinic/Hospital</p>
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{doctor.clinic_name}</p>
              </div>
            </div>
          )}

          {/* Address Display */}
          {(doctor.address || doctor.address_components) && (
            <div className="flex items-start space-x-2 sm:space-x-3">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs text-gray-500">Location</p>
                <p className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2">
                  {getFullAddress()}
                </p>


                {/* Structured address breakdown on hover */}

                {/* {doctor.address_components && isHovered && (
                  <div className="mt-1 text-[10px] sm:text-xs text-gray-600 space-y-0.5">
                    {doctor.address_components.street && (
                      <div>📍 {doctor.address_components.street}</div>
                    )}
                    {doctor.address_components.city && doctor.address_components.state && (
                      <div>🏙️ {doctor.address_components.city}, {doctor.address_components.state}</div>
                    )}
                    {doctor.address_components.postal_code && (
                      <div>📮 {doctor.address_components.postal_code}</div>
                    )}
                  </div>
                )} */}

                {/* Distance text - prefer backend's distance_text, fallback to distance_km */}

                {/* {(doctor.distance_text || doctor.distance_km) && (
                  <p className="text-[10px] sm:text-xs text-teal-600 mt-0.5 sm:mt-1 font-medium">
                    📍 {doctor.distance_text || `${doctor.distance_km.toFixed(1)} km away`}
                  </p>
                )} */}

                
              </div>
            </div>
          )}

          {/* Phone */}
          {doctor.phone && (
            <div className="flex items-start space-x-2 sm:space-x-3">
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs text-gray-500">Phone</p>
                <a 
                  href={callLink}
                  className="text-xs sm:text-sm font-medium text-blue-600 hover:underline"
                >
                  {doctor.phone}
                </a>
              </div>
            </div>
          )}

          {doctor.consultation_fee && (
            <div className="flex items-start space-x-2 sm:space-x-3">
              <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs text-gray-500">Consultation Fee</p>
                <p className="text-xs sm:text-sm font-medium text-gray-900">
                  ₹{doctor.consultation_fee}
                </p>
              </div>
            </div>
          )}

          {doctor.experience_years && (
            <div className="flex items-start space-x-2 sm:space-x-3">
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs text-gray-500">Experience</p>
                <p className="text-xs sm:text-sm font-medium text-gray-900">
                  {doctor.experience_years} years
                </p>
              </div>
            </div>
          )}

          {/* Reviews Preview */}
          {doctor.reviews && doctor.reviews.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Recent Reviews</p>
                {doctor.reviews.length > 2 && (
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="text-[10px] text-teal-600 hover:underline"
                  >
                    {showAllReviews ? 'Show less' : `+${doctor.reviews.length - 2} more`}
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {(showAllReviews ? doctor.reviews : doctor.reviews.slice(0, 2)).map((review, idx) => (
                  <div key={idx} className="bg-gray-50 p-2 rounded text-[10px] sm:text-xs">
                    <div className="flex items-center space-x-1 mb-1">
                      <User className="h-3 w-3 text-gray-400" />
                      <span className="font-medium text-gray-700">{review.author_name || 'Anonymous'}</span>
                      <div className="flex items-center ml-auto">
                        <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                        <span className="ml-0.5 text-gray-600">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 line-clamp-2">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ✅ FIXED: Action Buttons with Fallbacks */}
        <div className="bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 border-t border-gray-100 grid grid-cols-3 gap-1.5 sm:gap-2">

          {/* Call Button - Always show if phone exists */}
          {callLink && (
            <a
              href={callLink}
              className="flex items-center justify-center px-2 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium text-xs sm:text-sm"
            >
              <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
            </a>
          )}

          {/* WhatsApp Button - Always show if phone/whatsapp exists */}
          {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-2 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium text-xs sm:text-sm"
                onClick={() => toast.success('Opening WhatsApp...')}
              >
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
            )}


          {/* Maps/Directions Button - Show if address exists */}
          {mapsLink && (
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium text-xs sm:text-sm"
              onClick={() => toast.success('Opening Google Maps...')}
            >
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
            </a>
          )}

          {/* Book Appointment - Always show */}
         <button
          onClick={() => setShowBookingModal(true)}
          className="col-span-3 w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg transition-all font-medium text-xs sm:text-sm shadow-sm hover:shadow-md"
        >
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>Book Appointment</span>
        </button>

          {/* View Profile - Optional */}
          {doctor.clinic_url && (
            <a
              href={doctor.clinic_url}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 flex items-center justify-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-2 border-2 border-gray-300 hover:border-teal-500 text-gray-700 hover:text-teal-600 rounded-lg transition-colors font-medium text-xs sm:text-sm"
            >
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>View Profile</span>
            </a>
          )}
        </div>
        
      </div>

      {showBookingModal && (
        <BookingModal
          doctor={doctor}
          consultationId={consultationId}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </>
  );
};

export default DoctorCard;










// // src/component/pages/Consult/DoctorCard.jsx
// import React, { useState } from 'react';
// import { 
//   MapPin, 
//   Phone, 
//   Star, 
//   Calendar, 
//   DollarSign, 
//   Award, 
//   TrendingUp,
//   CheckCircle,
//   ExternalLink,
//   MessageSquare,
//   Navigation
// } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import BookingModal from '../Appointment/AppointmentBooking/BookingModal';

// const DoctorCard = ({ 
//   doctor, 
//   consultationId = null,
//   onBooking = null, 
//   isSelected = false,
//   index = 0
// }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [showBookingModal, setShowBookingModal] = useState(false);

//   if (!doctor) return null;

//   const getMatchScoreColor = (score) => {
//     if (!score) return 'gray';
//     const percentage = score * 100;
//     if (percentage >= 80) return 'green';
//     if (percentage >= 60) return 'blue';
//     if (percentage >= 40) return 'amber';
//     return 'red';
//   };

//   const matchScoreColor = getMatchScoreColor(doctor.match_score);

//   const handleBookingSuccess = (response) => {
//     toast.success(`✅ Booking confirmed!`);
//     toast.success(`📱 Booking ID: ${response.booking_id}`);
//     toast.success(`WhatsApp sent to clinic & you!`);
//     setShowBookingModal(false);
//     onBooking && onBooking(response);
//   };

//   return (
//     <>
//       <div
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         className={`
//           bg-white rounded-lg border-2 transition-all duration-300 overflow-hidden relative
//           ${isSelected 
//             ? 'border-teal-500 shadow-lg scale-102' 
//             : 'border-gray-200 hover:border-teal-300 hover:shadow-md'
//           }
//         `}
//       >
//         {/* Index Badge - Smaller on Mobile */}
//         <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-gray-900 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full z-10">
//           #{index + 1}
//         </div>

//         {/* Header Section - Mobile Optimized */}
//         <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-3 sm:p-4 border-b border-gray-100">
//           <div className="flex items-start justify-between mb-2 sm:mb-3">
//             <div className="flex-1 pr-10 sm:pr-12 min-w-0">
//               <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 truncate">
//                 {doctor.name}
//               </h3>
//               <p className="text-xs sm:text-sm font-medium text-teal-600 mb-1.5 sm:mb-2 truncate">
//                 {doctor.specialty}
//               </p>
//               {doctor.why_recommended && (
//                 <p className="text-[10px] sm:text-xs text-gray-600 italic p-1.5 sm:p-2 bg-white rounded border-l-2 border-teal-400 line-clamp-2">
//                   "{doctor.why_recommended}"
//                 </p>
//               )}
//             </div>

//             {doctor.match_score && (
//               <div className={`
//                 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full flex-shrink-0
//                 ${matchScoreColor === 'green' ? 'bg-green-100 text-green-700' :
//                   matchScoreColor === 'blue' ? 'bg-blue-100 text-blue-700' :
//                   matchScoreColor === 'amber' ? 'bg-amber-100 text-amber-700' :
//                   'bg-red-100 text-red-700'}
//                 font-bold
//               `}>
//                 <div className="text-center">
//                   <div className="text-xs sm:text-sm font-bold">
//                     {Math.round(doctor.match_score * 100)}%
//                   </div>
//                   <div className="text-[9px] sm:text-xs">Match</div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="flex items-center justify-between text-xs sm:text-sm">
//             <div className="flex items-center space-x-1 min-w-0">
//               {doctor.rating && (
//                 <>
//                   <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
//                   <span className="font-semibold text-gray-900">{doctor.rating.toFixed(1)}</span>
//                   <span className="text-gray-500 truncate">({doctor.reviews_count || 0})</span>
//                 </>
//               )}
//             </div>
            
//             {doctor.is_verified && (
//               <div className="flex items-center space-x-1 text-green-600 flex-shrink-0">
//                 <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
//                 <span className="text-[10px] sm:text-xs font-medium">Verified</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Details Section - Mobile Compact */}
//         <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
//           {doctor.clinic_name && (
//             <div className="flex items-start space-x-2 sm:space-x-3">
//               <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-500 flex-shrink-0 mt-0.5" />
//               <div className="min-w-0 flex-1">
//                 <p className="text-[10px] sm:text-xs text-gray-500">Clinic/Hospital</p>
//                 <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{doctor.clinic_name}</p>
//               </div>
//             </div>
//           )}

//           {doctor.address && (
//             <div className="flex items-start space-x-2 sm:space-x-3">
//               <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 flex-shrink-0 mt-0.5" />
//               <div className="min-w-0 flex-1">
//                 <p className="text-[10px] sm:text-xs text-gray-500">Location</p>
//                 <p className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2">{doctor.address}</p>
//                 {doctor.distance_km && (
//                   <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
//                     📍 {doctor.distance_km.toFixed(1)} km away
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}

//           {doctor.phone && (
//             <div className="flex items-start space-x-2 sm:space-x-3">
//               <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0 mt-0.5" />
//               <div className="min-w-0 flex-1">
//                 <p className="text-[10px] sm:text-xs text-gray-500">Phone</p>
//                 <a 
//                   href={`tel:${doctor.phone}`}
//                   className="text-xs sm:text-sm font-medium text-blue-600 hover:underline"
//                 >
//                   {doctor.phone}
//                 </a>
//               </div>
//             </div>
//           )}

//           {doctor.consultation_fee && (
//             <div className="flex items-start space-x-2 sm:space-x-3">
//               <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 flex-shrink-0 mt-0.5" />
//               <div className="min-w-0 flex-1">
//                 <p className="text-[10px] sm:text-xs text-gray-500">Consultation Fee</p>
//                 <p className="text-xs sm:text-sm font-medium text-gray-900">
//                   ₹{doctor.consultation_fee}
//                 </p>
//               </div>
//             </div>
//           )}

//           {doctor.experience_years && (
//             <div className="flex items-start space-x-2 sm:space-x-3">
//               <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
//               <div className="min-w-0 flex-1">
//                 <p className="text-[10px] sm:text-xs text-gray-500">Experience</p>
//                 <p className="text-xs sm:text-sm font-medium text-gray-900">
//                   {doctor.experience_years} years
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Action Buttons - Mobile Optimized */}
//         <div className="bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 border-t border-gray-100 grid grid-cols-2 gap-1.5 sm:gap-2">
//           {doctor.phone && (
//             <a
//               href={`tel:${doctor.phone}`}
//               className="flex items-center justify-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium text-xs sm:text-sm"
//             >
//               <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
//               <span className="hidden xs:inline">Call</span>
//             </a>
//           )}

//           {(doctor.whatsapp || doctor.phone) && (
//             <button
//               onClick={() => {
//                 const message = `Hi ${doctor.name}, I'd like to schedule a consultation.`;
//                 const phoneNumber = doctor.whatsapp || doctor.phone;
//                 window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
//                 toast.success('WhatsApp opened!');
//               }}
//               className="flex items-center justify-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium text-xs sm:text-sm"
//             >
//               <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
//               <span className="hidden xs:inline">WhatsApp</span>
//             </button>
//           )}

//           <button
//             onClick={() => setShowBookingModal(true)}
//             className="col-span-2 flex items-center justify-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg transition-colors font-medium text-xs sm:text-sm shadow-sm hover:shadow-md"
//           >
//             <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
//             <span>Book Appointment</span>
//           </button>

//           {doctor.clinic_url && (
//             <a
//               href={doctor.clinic_url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="col-span-2 flex items-center justify-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-2 border-2 border-gray-300 hover:border-teal-500 text-gray-700 hover:text-teal-600 rounded-lg transition-colors font-medium text-xs sm:text-sm"
//             >
//               <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
//               <span>View Profile</span>
//             </a>
//           )}
//         </div>
//       </div>

//       {showBookingModal && (
//         <BookingModal
//           doctor={doctor}
//           consultationId={consultationId}
//           onClose={() => setShowBookingModal(false)}
//           onSuccess={handleBookingSuccess}
//         />
//       )}
//     </>
//   );
// };

// export default DoctorCard;
