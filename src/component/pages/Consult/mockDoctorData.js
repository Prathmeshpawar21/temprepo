/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/Consult/mockDoctorData.js

/**
 * Mock doctor data for testing appointment booking
 * Phone: +918698844006
 * Location: Nashik, Maharashtra
 */

const getMockDoctors = () => {
  const today = new Date().toISOString().split('T')[0];
  
  return [
    {
      id: "mock_test_doctor_1",
      place_id: "mock_place_test_1",
      name: "Dr. Jayesh Patil",
      specialty: "BDS, MDS - Oral & Maxillofacial Surgery",
      clinic_name: "Dattatreya Dental Care",
      address: "Sharanpur Road, Nashik Road, Maharashtra 422002, India",
      phone: "08698844006",
      whatsapp: "+918698844006",
      rating: 4.9,
      reviews_count: 328,
      consultation_fee: 400,
      distance_km: 1.2,
      experience_years: 12,
      is_verified: true,
      match_score: 0.98,
      why_recommended: "Highly experienced oral surgeon with expertise in dental implants and wisdom tooth extraction",
      available_slots: [
        { time: "10:00 AM", date: today, available: true },
        { time: "02:00 PM", date: today, available: true },
        { time: "04:00 PM", date: today, available: true },
        { time: "06:00 PM", date: today, available: true }
      ],
      languages: ["English", "Hindi", "Marathi"],
      clinic_url: "https://www.dentee.com/clinic/nashik/dattatreya-dental-clinic/3cef4446-5f12-4219-9470-169de24f211f"
    },
    {
      id: "mock_test_doctor_2",
      place_id: "mock_place_test_2",
      name: "Dr. Rahul Agrawal",
      specialty: "BDS, MDS - Orthodontics",
      clinic_name: "Dr. Agrawal's Orthodontic & Dental Implant Centre",
      address: "Shop No 8, Laxmi Plaza, College Road, Near Rajiv Gandhi Bhavan, Nashik 422005",
      phone: "08965781989",
      whatsapp: "+918965781989",
      rating: 4.7,
      reviews_count: 245,
      consultation_fee: 500,
      distance_km: 2.8,
      experience_years: 15,
      is_verified: true,
      match_score: 0.88,
      why_recommended: "Specialist in braces treatment and dental implants with modern technology",
      available_slots: [
        { time: "09:00 AM", date: today, available: true },
        { time: "11:00 AM", date: today, available: true },
        { time: "03:00 PM", date: today, available: true },
        { time: "05:00 PM", date: today, available: true }
      ],
      languages: ["English", "Hindi", "Marathi"],
      clinic_url: "https://www.practo.com/nashik/dentist/dr-rahul-agrawal-orthodontist"
    },
    {
      id: "mock_test_doctor_3",
      place_id: "mock_place_test_3",
      name: "Dr. Priyanka Mahale",
      specialty: "BDS, MDS - Prosthodontics",
      clinic_name: "Smile Designers Dental Clinic and Orthodontic Care",
      address: "Ground Floor, Hare Krishna Colony, Behind KKW Engg College, Panchavati, Landmark: Durga Mandir, Nashik 422003",
      phone: "09487625870",
      whatsapp: "+919487625870",
      rating: 4.8,
      reviews_count: 412,
      consultation_fee: 450,
      distance_km: 3.5,
      experience_years: 11,
      is_verified: true,
      match_score: 0.92,
      why_recommended: "Expert in cosmetic dentistry, crown & bridge work, and smile makeovers",
      available_slots: [
        { time: "10:30 AM", date: today, available: true },
        { time: "02:30 PM", date: today, available: true },
        { time: "04:30 PM", date: today, available: true }
      ],
      languages: ["English", "Hindi", "Marathi"],
      clinic_url: "https://www.practo.com/nashik/dentist/dr-priyanka-mahale"
    },
    {
      id: "mock_test_doctor_4",
      place_id: "mock_place_test_4",
      name: "Dr. Sanjay Patil",
      specialty: "BDS, MDS - Periodontology",
      clinic_name: "Patil Dental Clinic",
      address: "Deshmukh Lane, Raviwar Peth, Near Satpur Colony, Nashik 422002",
      phone: "09876543210",
      whatsapp: "+919876543210",
      rating: 4.6,
      reviews_count: 189,
      consultation_fee: 350,
      distance_km: 1.8,
      experience_years: 9,
      is_verified: true,
      match_score: 0.85,
      why_recommended: "Specialist in gum diseases, root canal treatment, and preventive dentistry",
      available_slots: [
        { time: "09:30 AM", date: today, available: true },
        { time: "12:00 PM", date: today, available: true },
        { time: "04:00 PM", date: today, available: true },
        { time: "06:30 PM", date: today, available: true }
      ],
      languages: ["English", "Hindi", "Marathi"],
      clinic_url: "https://www.justdial.com/Nashik/Patil-Dental-Clinic"
    },
    {
      id: "mock_test_doctor_5",
      place_id: "mock_place_test_5",
      name: "Dr. Neha Kulkarni",
      specialty: "BDS, MDS - Pediatric Dentistry",
      clinic_name: "Little Smiles Kids Dental Clinic",
      address: "Suyojit Sankul, Canada Corner, Nashik Road, Nashik 422101",
      phone: "09823456789",
      whatsapp: "+919823456789",
      rating: 4.9,
      reviews_count: 567,
      consultation_fee: 400,
      distance_km: 2.1,
      experience_years: 8,
      is_verified: true,
      match_score: 0.94,
      why_recommended: "Child-friendly specialist with expertise in pediatric dental care and preventive treatments",
      available_slots: [
        { time: "10:00 AM", date: today, available: true },
        { time: "12:30 PM", date: today, available: true },
        { time: "03:00 PM", date: today, available: true },
        { time: "05:30 PM", date: today, available: true }
      ],
      languages: ["English", "Hindi", "Marathi"],
      clinic_url: "https://www.practo.com/nashik/dentist/dr-neha-kulkarni-pediatric-dentist"
    },
    {
      id: "mock_test_doctor_6",
      place_id: "mock_place_test_6",
      name: "Dr. Amit Deshmukh",
      specialty: "BDS, MDS - Endodontics",
      clinic_name: "Root Care Dental Clinic",
      address: "Shop 12, Shalimar Complex, Old Agra Road, Near Dwarka Circle, Nashik 422001",
      phone: "09765432187",
      whatsapp: "+919765432187",
      rating: 4.7,
      reviews_count: 294,
      consultation_fee: 550,
      distance_km: 2.4,
      experience_years: 13,
      is_verified: true,
      match_score: 0.89,
      why_recommended: "Root canal specialist with painless treatment techniques and advanced equipment",
      available_slots: [
        { time: "09:00 AM", date: today, available: true },
        { time: "11:30 AM", date: today, available: true },
        { time: "02:00 PM", date: today, available: true },
        { time: "05:00 PM", date: today, available: true }
      ],
      languages: ["English", "Hindi", "Marathi"],
      clinic_url: "https://www.sulekha.com/root-care-dental-clinic-nashik"
    },
    {
      id: "mock_test_doctor_7",
      place_id: "mock_place_test_7",
      name: "Dr. Snehal Joshi",
      specialty: "BDS, MDS - Oral Medicine & Radiology",
      clinic_name: "Joshi Multispecialty Dental Clinic",
      address: "Prashant Nagar, Tidke Colony, Near CIDCO Bus Stand, Nashik 422009",
      phone: "09898989898",
      whatsapp: "+919898989898",
      rating: 4.8,
      reviews_count: 378,
      consultation_fee: 600,
      distance_km: 3.2,
      experience_years: 16,
      is_verified: true,
      match_score: 0.91,
      why_recommended: "Expert in oral cancer screening, TMJ disorders, and comprehensive dental diagnostics",
      available_slots: [
        { time: "10:00 AM", date: today, available: true },
        { time: "01:00 PM", date: today, available: true },
        { time: "03:30 PM", date: today, available: true },
        { time: "06:00 PM", date: today, available: true }
      ],
      languages: ["English", "Hindi", "Marathi", "Gujarati"],
      clinic_url: "https://www.justdial.com/Nashik/Joshi-Multispecialty-Dental-Clinic"
    },
    {
      id: "mock_test_doctor_8",
      place_id: "mock_place_test_8",
      name: "Dr. Rajesh Bhosale",
      specialty: "BDS, MDS - Oral & Maxillofacial Pathology",
      clinic_name: "Nashik Dental & Maxillofacial Centre",
      address: "1st Floor, Shivaji Nagar, Near MG Road, Nashik 422002",
      phone: "09912345678",
      whatsapp: "+919912345678",
      rating: 4.6,
      reviews_count: 156,
      consultation_fee: 700,
      distance_km: 1.5,
      experience_years: 14,
      is_verified: true,
      match_score: 0.87,
      why_recommended: "Senior consultant specializing in complex oral surgeries, jaw corrections, and facial trauma",
      available_slots: [
        { time: "09:30 AM", date: today, available: true },
        { time: "12:00 PM", date: today, available: true },
        { time: "03:00 PM", date: today, available: true },
        { time: "05:30 PM", date: today, available: true }
      ],
      languages: ["English", "Hindi", "Marathi"],
      clinic_url: "https://www.practo.com/nashik/dentist/dr-rajesh-bhosale"
    }
  ];
};

export default getMockDoctors;