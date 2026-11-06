import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type {
  Role,
  LanguageCode,
  ServiceCategory,
  TechnicianProfile,
  Booking,
  BookingStatus,
  GroupBooking,
  SOSAlert,
  NotificationItem,
  AppUser,
  ChatMessage,
} from "../types";
import { translations } from "../translations";
import { api } from "../lib/api";

export const initialCategories: ServiceCategory[] = [
  {
    id: "plumbing",
    name: "Plumbing",
    nameHi: "नलसाजी (प्लंबर)",
    nameMr: "प्लंबिंग",
    description: "Pipe leaks, tap fixes, drain cleaning, and bathroom sanitary fittings.",
    icon: "droplet",
    basePrice: 199,
    duration: "45-60 min",
    availableTechs: 14,
    tags: ["Pipe leaks", "Taps", "Geyser fitting", "Drain blockage"],
  },
  {
    id: "electrical",
    name: "Electrical",
    nameHi: "बिजली मरम्मत",
    nameMr: "इलेक्ट्रिकल दुरुस्ती",
    description: "Wiring, switchboard fixes, short circuit detection, fans, and MCB installation.",
    icon: "bolt",
    basePrice: 149,
    duration: "30-50 min",
    availableTechs: 18,
    tags: ["Wiring", "Switchboard", "Fan installation", "Fuse/MCB"],
  },
  {
    id: "ac_repair",
    name: "AC Care & Repair",
    nameHi: "एसी सर्विस और मरम्मत",
    nameMr: "एसी सर्व्हिस व दुरुस्ती",
    description: "Deep foam wash, gas charging, cooling coil repair, and installation.",
    icon: "snow",
    basePrice: 399,
    duration: "60-90 min",
    availableTechs: 9,
    tags: ["Gas refill", "Foam jet service", "No cooling", "Water leakage"],
  },
  {
    id: "cleaning",
    name: "Deep Cleaning",
    nameHi: "गहन सफाई",
    nameMr: "खोलवर स्वच्छता",
    description: "Kitchen degreasing, bathroom descaling, sofa shampooing, full home sanitization.",
    icon: "sparkles",
    basePrice: 299,
    duration: "2-4 hours",
    availableTechs: 22,
    tags: ["Full home", "Bathroom", "Kitchen", "Sofa wash"],
  },
  {
    id: "carpentry",
    name: "Carpentry",
    nameHi: "बढ़ईगीरी (कारपेंटर)",
    nameMr: "सुतारकाम",
    description: "Furniture repair, door locks, modular kitchen adjustments, and hinges.",
    icon: "hammer",
    basePrice: 249,
    duration: "45-90 min",
    availableTechs: 11,
    tags: ["Lock repair", "Door fitting", "Furniture fix", "Hinges"],
  },
  {
    id: "painting",
    name: "Wall Painting",
    nameHi: "दीवार पेंटिंग",
    nameMr: "रंगकाम",
    description: "Waterproofing, exterior & interior wall touch-ups, texture finish.",
    icon: "paint",
    basePrice: 499,
    duration: "1-3 days",
    availableTechs: 8,
    tags: ["Waterproofing", "Touch up", "Full room", "Texture"],
  },
  {
    id: "appliances",
    name: "Appliance Repair",
    nameHi: "उपकरण मरम्मत",
    nameMr: "उपकरणे दुरुस्ती",
    description: "Washing machine, refrigerator, microwave oven, and water purifier servicing.",
    icon: "settings",
    basePrice: 299,
    duration: "45-75 min",
    availableTechs: 15,
    tags: ["Washing machine", "Refrigerator", "Microwave", "RO Water"],
  },
  {
    id: "pest_control",
    name: "Pest Control",
    nameHi: "कीट नियंत्रण",
    nameMr: "कीटक नियंत्रण",
    description: "Odorless herbal gel for cockroaches, termite eradication, bed bug treatments.",
    icon: "shield",
    basePrice: 599,
    duration: "60-120 min",
    availableTechs: 7,
    tags: ["Cockroach gel", "Termite", "Bed bugs", "Mosquito"],
  },
  {
    id: "garbage",
    name: "Garbage & Waste Disposal",
    nameHi: "कचरा और अपशिष्ट प्रबंधन",
    nameMr: "कचरा व घनकचरा व्यवस्थापन",
    description:
      "Doorstep segregated waste collection, bulk renovation debris, e-waste pickup, garden foliage, and eco-certified recycling.",
    icon: "trash",
    basePrice: 99,
    duration: "20-40 min",
    availableTechs: 16,
    tags: ["Daily Waste", "Bulk Debris", "E-Waste", "Recycling", "Garden Foliage", "Eco-Cert"],
  },
  {
    id: "bodyguard",
    name: "Bodyguard & Personal Security",
    nameHi: "अंगरक्षक एवं व्यक्तिगत सुरक्षा",
    nameMr: "अंगरक्षक व वैयक्तिक सुरक्षा",
    description:
      "Licensed armed PSOs, VIP close protection, night travel escort, verified event security, and senior safe transit.",
    icon: "shield",
    basePrice: 799,
    duration: "4-8 hours",
    availableTechs: 12,
    tags: [
      "Armed PSO",
      "VIP Escort",
      "Ex-Military",
      "Night Travel",
      "Event Bouncer",
      "Police Verified",
    ],
  },
];

export const initialTechnicians: TechnicianProfile[] = [
  {
    id: "tech-1",
    name: "Ramesh Patil",
    phone: "+91 98230 45671",
    email: "ramesh.patil@homecare360.in",
    photo:
      "https://images.unsplash.com/photo-1659353587367-61eb5b8c6ef7?crop=faces&fit=crop&w=320&h=320&q=85",
    rating: 4.9,
    totalJobs: 428,
    experienceYears: 8,
    primaryService: "plumbing",
    skills: [
      "Pipe leak detection",
      "Kitchen sanitary fittings",
      "Geyser plumbing",
      "Pressure testing",
    ],
    serviceArea: "Koregaon Park, Pune",
    startingPrice: 340,
    isVerified: true,
    verificationStatus: "approved",
    trustScore: 96,
    distanceKm: 1.2,
    etaMinutes: 18,
    isOnline: true,
    about:
      "Certified Master Plumber with 8 years of municipal and residential experience in Pune. Specializing in leak prevention and modern fixtures.",
    languages: ["Marathi", "Hindi", "English"],
    certificates: [
      {
        title: "Govt. ITI Certificate in Plumbing & Sanitation",
        issuer: "Maharashtra State Board of Vocational Education",
        year: "2017",
      },
      {
        title: "Advanced Backflow Prevention & PEX certification",
        issuer: "Indian Plumbing Association (IPA)",
        year: "2020",
      },
    ],
    portfolio: [
      {
        title: "Kitchen Sink S-Trap Replacement",
        beforePhoto:
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
        afterPhoto:
          "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      },
    ],
    reviews: [
      {
        id: "rev-1",
        citizenName: "Pooja Kulkarni",
        rating: 5,
        comment:
          "Ramesh arrived on time and resolved the kitchen under-sink drip within 35 minutes. Very respectful and cleaned up after.",
        date: "14 Jun 2026",
        serviceName: "Plumbing",
      },
      {
        id: "rev-2",
        citizenName: "Vikram Deshmukh",
        rating: 5,
        comment:
          "Excellent technical work, showed me the cracked washer before replacing it. Fair pricing.",
        date: "02 Jun 2026",
        serviceName: "Plumbing",
      },
    ],
    dob: "1988-04-12",
    gender: "Male",
    address: {
      houseDetails: "House #14, Gurukrupa Niwas",
      area: "Lane 4, Koregaon Park",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
    },
    specialisations: [
      "Concealed Pipe Leaks",
      "Sanitary & CP Fittings",
      "Pressure Testing",
      "Geyser Plumbing",
    ],
    notificationPreferences: { sms: true, email: true, app: true },
    languagePreference: "Marathi",
    profileVisibility: "public",
    lastUpdated: "21 Jun 2026",
    bankDetails: {
      accountNumber: "918200192834",
      ifsc: "HDFC0001244",
      upiId: "ramesh.patil@upi",
      accountHolder: "Ramesh S. Patil",
    },
  },
  {
    id: "tech-2",
    name: "Sanjay Kumar",
    phone: "+91 97654 32109",
    email: "sanjay.k@homecare360.in",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=faces&fit=crop&w=320&h=320&q=85",
    rating: 4.8,
    totalJobs: 312,
    experienceYears: 6,
    primaryService: "plumbing",
    skills: [
      "Bathroom fittings",
      "Drain unclogging",
      "Overhead tank valves",
      "Water meter repairs",
    ],
    serviceArea: "Kalyani Nagar, Pune",
    startingPrice: 390,
    isVerified: true,
    verificationStatus: "approved",
    trustScore: 92,
    distanceKm: 2.4,
    etaMinutes: 25,
    isOnline: true,
    about:
      "Dedicated technician skilled in modern plumbing solutions. Fast response across East Pune.",
    languages: ["Hindi", "English"],
    certificates: [
      {
        title: "National Trade Certificate - Plumbing",
        issuer: "Directorate General of Training (DGT)",
        year: "2019",
      },
    ],
    portfolio: [],
    reviews: [
      {
        id: "rev-3",
        citizenName: "Anand Joshi",
        rating: 5,
        comment: "Fixed bathroom flush mechanism promptly.",
        date: "10 Jun 2026",
        serviceName: "Plumbing",
      },
    ],
  },
  {
    id: "tech-3",
    name: "Imran Shaikh",
    phone: "+91 98901 23456",
    email: "imran.shaikh@homecare360.in",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=faces&fit=crop&w=320&h=320&q=85",
    rating: 4.7,
    totalJobs: 205,
    experienceYears: 5,
    primaryService: "electrical",
    skills: [
      "Circuit diagnosis",
      "MCB panel repair",
      "Smart switch wiring",
      "Ceiling fan installation",
    ],
    serviceArea: "Viman Nagar, Pune",
    startingPrice: 249,
    isVerified: true,
    verificationStatus: "approved",
    trustScore: 89,
    distanceKm: 3.1,
    etaMinutes: 32,
    isOnline: true,
    about:
      "Licensed wireman prioritizing safety standards and fire prevention guidelines in residential homes.",
    languages: ["Hindi", "Marathi", "English"],
    certificates: [
      {
        title: "PWD Wireman License Grade I",
        issuer: "Maharashtra Electrical Licensing Board",
        year: "2020",
      },
    ],
    portfolio: [],
    reviews: [],
  },
  {
    id: "tech-4",
    name: "Pooja Yadav",
    phone: "+91 99220 78901",
    email: "pooja.y@homecare360.in",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=faces&fit=crop&w=320&h=320&q=85",
    rating: 4.9,
    totalJobs: 540,
    experienceYears: 7,
    primaryService: "cleaning",
    skills: [
      "Deep kitchen degreasing",
      "Bathroom restoration",
      "ECO-friendly sanitization",
      "Carpet washing",
    ],
    serviceArea: "Koregaon Park & Camp, Pune",
    startingPrice: 399,
    isVerified: true,
    verificationStatus: "approved",
    trustScore: 97,
    distanceKm: 1.8,
    etaMinutes: 20,
    isOnline: true,
    about:
      "Leader of an all-women expert cleaning crew. 100% background checked and eco-certified materials.",
    languages: ["Hindi", "Marathi"],
    certificates: [
      {
        title: "Professional Housekeeping Certification",
        issuer: "Tourism and Hospitality Skill Council",
        year: "2019",
      },
    ],
    portfolio: [],
    reviews: [],
  },
  {
    id: "tech-5",
    name: "Amit Solanki",
    phone: "+91 91234 56780",
    email: "amit.solanki@homecare360.in",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=faces&fit=crop&w=320&h=320&q=85",
    rating: 4.6,
    totalJobs: 118,
    experienceYears: 4,
    primaryService: "ac_repair",
    skills: ["Inverter AC PCB repair", "Gas leakage detection", "Copper pipe brazing"],
    serviceArea: "Baner & Aundh, Pune",
    startingPrice: 449,
    isVerified: false,
    verificationStatus: "pending",
    trustScore: 84,
    distanceKm: 4.5,
    etaMinutes: 40,
    isOnline: false,
    about:
      "Specialized in Daikin and Voltas inverter units. Verification documents currently under administrative review.",
    languages: ["Hindi", "English"],
    certificates: [
      {
        title: "HVAC Apprentice Diploma",
        issuer: "National Skill Development Corporation",
        year: "2022",
      },
    ],
    portfolio: [],
    reviews: [],
  },
  {
    id: "tech-6",
    name: "Ganesh Shinde",
    phone: "+91 98221 44556",
    email: "ganesh.shinde@homecare360.in",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=faces&fit=crop&w=320&h=320&q=85",
    rating: 4.5,
    totalJobs: 86,
    experienceYears: 5,
    primaryService: "painting",
    skills: ["Wall dampness waterproofing", "Exterior acrylic coating", "Texture finishes"],
    serviceArea: "Hadapsar & Magarpatta, Pune",
    startingPrice: 499,
    isVerified: false,
    verificationStatus: "pending",
    trustScore: 82,
    distanceKm: 3.8,
    etaMinutes: 35,
    isOnline: true,
    about:
      "Certified applicator for Asian Paints and Dr. Fixit waterproofing solutions. Pending police verification certificate upload.",
    languages: ["Marathi", "Hindi"],
    certificates: [
      { title: "Master Waterproofing Applicator", issuer: "Dr. Fixit Institute", year: "2021" },
    ],
    portfolio: [],
    reviews: [],
  },
  {
    id: "tech-7",
    name: "Rajesh Tambe",
    phone: "+91 97664 11223",
    email: "rajesh.tambe@homecare360.in",
    photo:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?crop=faces&fit=crop&w=320&h=320&q=85",
    rating: 4.2,
    totalJobs: 54,
    experienceYears: 3,
    primaryService: "carpentry",
    skills: ["Godrej lock repair", "Cabinet hinge adjustment", "Door frame alignment"],
    serviceArea: "Camp & Swargate, Pune",
    startingPrice: 249,
    isVerified: false,
    verificationStatus: "rejected",
    trustScore: 71,
    distanceKm: 5.2,
    etaMinutes: 45,
    isOnline: false,
    about:
      "Residential carpenter. Application declined due to expired municipal trade license document.",
    languages: ["Hindi", "Marathi"],
    certificates: [
      { title: "Carpentry Certificate", issuer: "Industrial Training Center", year: "2018" },
    ],
    portfolio: [],
    reviews: [],
  },
  {
    id: "tech-garbage-1",
    name: "Kailash Jadhav",
    phone: "+91 98229 65432",
    email: "kailash.jadhav@homecare360.in",
    photo:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?crop=faces&fit=crop&w=320&h=320&q=85",
    rating: 4.9,
    totalJobs: 614,
    experienceYears: 7,
    primaryService: "garbage",
    skills: [
      "Segregated Doorstep Waste",
      "Bulk Renovation Debris Removal",
      "Certified E-Waste Recycling",
      "Garden Foliage Clearance",
      "Eco-Truck Logistics",
    ],
    serviceArea: "Koregaon Park & Kalyani Nagar, Pune",
    startingPrice: 99,
    isVerified: true,
    verificationStatus: "approved",
    trustScore: 97,
    distanceKm: 0.9,
    etaMinutes: 14,
    isOnline: true,
    about:
      "Certified Municipal Solid Waste Management (SWM) supervisor. Operating clean green mini-tippers for door-to-door waste segregation, heavy debris removal, and e-waste recycling.",
    languages: ["Marathi", "Hindi", "English"],
    certificates: [
      {
        title: "Municipal Solid Waste Management (SWM) Lead Certification",
        issuer: "Pune Municipal Corporation (PMC)",
        year: "2018",
      },
      {
        title: "Hazardous & E-Waste Handling Compliance",
        issuer: "Maharashtra Pollution Control Board (MPCB)",
        year: "2021",
      },
    ],
    portfolio: [
      {
        title: "Apartment Society Renovation Rubble & Debris Clearance",
        beforePhoto:
          "https://images.unsplash.com/photo-1530587191325-3db32d826c18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
        afterPhoto:
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      },
    ],
    reviews: [
      {
        id: "rev-garb-1",
        citizenName: "Sunita Deshpande",
        rating: 5,
        comment:
          "Kailash arrived with a clean tipper truck and cleared 12 bags of renovation rubble in 20 minutes. Provided municipal recycling certificate on the spot!",
        date: "16 Jun 2026",
        serviceName: "Garbage & Waste Disposal",
      },
    ],
    specialisations: [
      "Segregated Waste",
      "Bulk Debris Tipper",
      "E-Waste Green Audit",
      "Society Composting",
    ],
  },
  {
    id: "tech-bodyguard-1",
    name: "Capt. Vikramaditya 'Vikram' Rathore (Retd.)",
    phone: "+91 98223 77890",
    email: "vikram.rathore@homecare360.in",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=faces&fit=crop&w=320&h=320&q=85",
    rating: 5.0,
    totalJobs: 342,
    experienceYears: 12,
    primaryService: "bodyguard",
    skills: [
      "Armed Close Protection (PSO)",
      "VIP Executive Transit Escort",
      "Ex-Special Forces Veteran",
      "Defensive & Evasive Driving",
      "Tactical Trauma & First Aid",
    ],
    serviceArea: "Pune Metro, Koregaon Park & Baner",
    startingPrice: 999,
    isVerified: true,
    verificationStatus: "approved",
    trustScore: 99,
    distanceKm: 1.8,
    etaMinutes: 20,
    isOnline: true,
    about:
      "Former Indian Army Special Forces officer with 12 years of executive close protection experience. Licensed for concealed firearm carry (MHA Form-IV), certified in VIP close escort, tactical counter-measures, and discrete security.",
    languages: ["English", "Hindi", "Punjabi", "Marathi"],
    certificates: [
      {
        title: "PSARA Grade-I Certified Personal Security Officer",
        issuer: "Private Security Agencies Regulatory Authority (PSARA)",
        year: "2019",
      },
      {
        title: "National Arms Carry License (Form-IV All India)",
        issuer: "Ministry of Home Affairs",
        year: "2018",
      },
      {
        title: "Tactical Close Combat & Krav Maga Black Belt 4th Dan",
        issuer: "International Krav Maga Federation",
        year: "2020",
      },
      {
        title: "Tactical Trauma Life Support & Emergency CPR",
        issuer: "Red Cross & Military Medical Corps",
        year: "2022",
      },
    ],
    portfolio: [
      {
        title: "Executive VIP Delegation Motorcade Escort",
        beforePhoto:
          "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
        afterPhoto:
          "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      },
    ],
    reviews: [
      {
        id: "rev-bg-1",
        citizenName: "Rajeev Singhania",
        rating: 5,
        comment:
          "Capt. Vikram provided exceptional personal security during our business delegation visit in Pune. Impeccable formal attire, sharp situational awareness, and total discretion.",
        date: "12 Jun 2026",
        serviceName: "Bodyguard & Personal Security",
      },
    ],
    specialisations: [
      "Armed PSO Escort",
      "Executive VIP Travel",
      "High-Value Asset Transit",
      "24/7 Satellite Guardian Sync",
    ],
  },
  {
    id: "tech-bodyguard-2",
    name: "Sunita Rawat",
    phone: "+91 97660 88991",
    email: "sunita.rawat@homecare360.in",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=faces&fit=crop&w=320&h=320&q=85",
    rating: 4.9,
    totalJobs: 218,
    experienceYears: 8,
    primaryService: "bodyguard",
    skills: [
      "Women & Executive Close Protection",
      "Martial Arts Black Belt",
      "Discreet Plainclothes Escort",
      "Night Commute Safety",
      "Event Security & VIP Screening",
    ],
    serviceArea: "Viman Nagar & Koregaon Park, Pune",
    startingPrice: 799,
    isVerified: true,
    verificationStatus: "approved",
    trustScore: 98,
    distanceKm: 2.2,
    etaMinutes: 22,
    isOnline: true,
    about:
      "Certified Close Protection Specialist with 8 years protecting women executives, delegates, and senior citizens. Judo champion, Krav Maga certified, with 100% clean police background verification.",
    languages: ["Hindi", "English", "Marathi"],
    certificates: [
      {
        title: "Certified Close Protection Officer (CPO)",
        issuer: "Security Skills Sector Council (SSSC)",
        year: "2018",
      },
      {
        title: "Police Verification Certificate (PVR Clean)",
        issuer: "Pune City Police Commissionerate",
        year: "2024",
      },
    ],
    portfolio: [],
    reviews: [
      {
        id: "rev-bg-2",
        citizenName: "Meenakshi Iyer",
        rating: 5,
        comment:
          "Sunita escorted my elderly mother during late-night intercity travel. Extremely attentive, calm, and professional. Made us feel completely safe.",
        date: "08 Jun 2026",
        serviceName: "Bodyguard & Personal Security",
      },
    ],
    specialisations: [
      "Solo Female Transit Protection",
      "Senior Citizen Travel Escort",
      "Event VIP Screening",
      "Tactical Defense",
    ],
  },
];

export const initialBookings: Booking[] = [
  {
    id: "HC-2848",
    serviceId: "garbage",
    serviceName: "Garbage & Waste · Bulk Debris & E-Waste Pickup",
    citizenName: "Asha Sharma",
    citizenPhone: "+91 98221 12345",
    citizenAddress: "Flat 402, Ganga Carnation, Koregaon Park, Pune",
    area: "Koregaon Park",
    issueDescription:
      "Old electronic appliances (CRT monitor, broken microwave) and 4 bags of balcony tile debris after renovation. Requires eco-segregated tipper truck pickup.",
    issuePhotos: [
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
    urgency: "standard",
    scheduledDate: "Today",
    scheduledTimeWindow: "3:00 PM – 5:00 PM",
    status: "work_completed",
    completedAt: "Today · 3:45 PM",
    technicianId: "tech-garbage-1",
    technicianName: "Kailash Jadhav",
    technicianPhone: "+91 98229 65432",
    technicianPhoto:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?crop=faces&fit=crop&w=320&h=320&q=85",
    technicianRating: 4.9,
    lockedPrice: 180,
    platformFee: 9,
    gstAmount: 34.02,
    totalPaid: 223.02,
    paymentMethod: "UPI (asha@okhdfcbank)",
    paymentRef: "HC360-GARB-98A1",
    createdAt: "Today, 10:15 AM",
    quotations: [],
    chatMessages: [],
    beforeWorkPhoto:
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    afterWorkPhoto:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    beforeWorkPhotos: [
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    ],
    afterWorkPhotos: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    ],
    beforeHash: "GB-0921-DEBRIS-B4",
    afterHash: "GB-0921-CLEAN-AFT",
    aiVerification: {
      confidence: 97,
      verdict: "Debris Cleared & Area Disinfected",
      checks: [
        { title: "All debris sacks and e-waste appliances removed", passed: true },
        { title: "Floor sweep & sanitation completed", passed: true },
        { title: "PMC Municipal Bio-Processing Receipt Verified", passed: true },
      ],
    },
    garbageDetails: {
      wasteType: "Renovation Debris & E-Waste",
      volumeSize: "Medium (4 Bags + Monitor, 35kg)",
      isSegregated: true,
      ecoCertRequested: true,
      disposalFacility: "PMC Municipal Bio-Processing & E-Waste Hub, Hadapsar",
      recycledKg: 35,
      vehicleType: "Green Mini-Tipper #MH12-TR-4421",
    },
    warrantyActiveUntil: "28 Jun 2026",
  },
  {
    id: "HC-2849",
    serviceId: "bodyguard",
    serviceName: "Bodyguard · Armed Close Protection (PSO) Escort",
    citizenName: "Asha Sharma",
    citizenPhone: "+91 98221 12345",
    citizenAddress: "Flat 402, Ganga Carnation, Koregaon Park, Pune",
    area: "Koregaon Park",
    issueDescription:
      "Requirement of elite armed personal security officer (PSO) for executive transit from Koregaon Park to Pune International Airport. Dark suit attire, ex-defense background, real-time satellite tracking active.",
    issuePhotos: [],
    urgency: "urgent",
    scheduledDate: "Today",
    scheduledTimeWindow: "5:30 PM – 9:30 PM",
    status: "on_the_way",
    technicianId: "tech-bodyguard-1",
    technicianName: "Capt. Vikramaditya Rathore",
    technicianPhone: "+91 98223 77890",
    technicianPhoto:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=faces&fit=crop&w=320&h=320&q=85",
    technicianRating: 5.0,
    lockedPrice: 1200,
    platformFee: 60,
    gstAmount: 226.8,
    totalPaid: 1486.8,
    paymentMethod: "UPI (asha@okhdfcbank)",
    paymentRef: "HC360-BG-7741",
    createdAt: "Today, 1:30 PM",
    quotations: [
      {
        id: "q-bg-1",
        technicianId: "tech-bodyguard-1",
        technicianName: "Capt. Vikramaditya Rathore",
        technicianRating: 5.0,
        technicianJobs: 342,
        technicianPhoto:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=faces&fit=crop&w=320&h=320&q=85",
        originalPrice: 1400,
        currentPrice: 1200,
        status: "accepted",
        eta: "20 min",
        distanceKm: 1.8,
        scopeNote:
          "Includes 4-hour Armed Close Protection (MHA Form-IV licensed carry), executive suit attire, satellite guardian sync, and rapid response backup vehicle.",
        warrantyDays: 1,
        label: "Armed PSO Certified",
        tagColor: "green",
      },
    ],
    chatMessages: [
      {
        id: "m-bg-1",
        sender: "technician",
        senderName: "Capt. Vikramaditya Rathore",
        text: "Namaste Asha ji. I have confirmed your 4-hour executive escort. I am in dark business suit attire with verified concealed firearm carry license. En route to your address, ETA 20 mins.",
        timestamp: "1:45 PM",
        status: "read",
      },
    ],
    bodyguardRequirements: {
      tier: "armed_pso",
      attire: "formal_suit",
      exMilitaryRequired: true,
      combatCertified: true,
      policeVerified: true,
      firstAidCertified: true,
      minHeight: "6'0\" (183 cm)",
      genderPreference: "male",
      durationHours: 4,
      threatLevel: "standard",
      emergencyBackupRequested: true,
      dutyScope:
        "Executive airport transit & secure commute with satellite guardian live tracking.",
      armsLicenseRequired: true,
    },
  },
  {
    id: "HC-2845",
    serviceId: "plumbing",
    serviceName: "Plumbing · Bathroom Mixer & Tap Leak",
    citizenName: "Rajesh Kulkarni",
    citizenPhone: "+91 98224 88712",
    citizenAddress: "Flat 204, Hermes Heritage, Shastri Nagar, Pune",
    area: "Shastri Nagar",
    issueDescription:
      "Hot and cold mixer lever in master bathroom is dripping water continuously. Needs washer replacement and cartridge realignment.",
    issuePhotos: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
    urgency: "urgent",
    scheduledDate: "Today",
    scheduledTimeWindow: "4:00 PM – 6:00 PM",
    status: "request_submitted",
    lockedPrice: 280,
    platformFee: 14,
    gstAmount: 50.4,
    totalPaid: 344.4,
    createdAt: "Today, 11:15 AM",
    quotations: [],
    chatMessages: [],
  },
  {
    id: "HC-2843",
    serviceId: "plumbing",
    serviceName: "Plumbing · Geyser Inlet Pipe Mineral Leak",
    citizenName: "Sunita Patel",
    citizenPhone: "+91 97651 34902",
    citizenAddress: "Bungalow 12, Lane 7, Koregaon Park, Pune",
    area: "Koregaon Park",
    issueDescription:
      "Hard water scaling on geyser flexible connector pipe. Water is leaking along the electrical casing.",
    issuePhotos: [
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
    urgency: "standard",
    scheduledDate: "Tomorrow",
    scheduledTimeWindow: "10:00 AM – 12:00 PM",
    status: "quoted",
    lockedPrice: 320,
    platformFee: 16,
    gstAmount: 57.6,
    totalPaid: 393.6,
    createdAt: "Today, 9:40 AM",
    quotations: [
      {
        id: "q-2843-1",
        technicianId: "tech-1",
        technicianName: "Ramesh Patil",
        technicianRating: 4.9,
        technicianJobs: 428,
        technicianPhoto:
          "https://images.unsplash.com/photo-1659353587367-61eb5b8c6ef7?crop=faces&fit=crop&w=320&h=320&q=85",
        originalPrice: 350,
        currentPrice: 320,
        status: "pending",
        eta: "20 min",
        distanceKm: 1.5,
        scopeNote: "Includes site inspection, braided SS geyser pipe replacement, and leak test.",
        warrantyDays: 7,
        label: "Best match",
        tagColor: "green",
      },
    ],
    chatMessages: [],
  },
  {
    id: "HC-2841",
    serviceId: "plumbing",
    serviceName: "Plumbing · Pipe leak",
    citizenName: "Asha Sharma",
    citizenPhone: "+91 98221 12345",
    citizenAddress: "Flat 402, Ganga Carnation, Koregaon Park, Pune",
    area: "Koregaon Park",
    issueDescription:
      "The drain pipe under my kitchen sink is dripping continuously whenever the tap runs.",
    issuePhotos: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
    urgency: "standard",
    scheduledDate: "Tomorrow (22 Jun)",
    scheduledTimeWindow: "2:00 PM – 4:00 PM",
    status: "on_the_way",
    technicianId: "tech-1",
    technicianName: "Ramesh Patil",
    technicianPhone: "+91 98230 45671",
    technicianPhoto:
      "https://images.unsplash.com/photo-1659353587367-61eb5b8c6ef7?crop=faces&fit=crop&w=320&h=320&q=85",
    technicianRating: 4.9,
    lockedPrice: 340,
    materialCharges: 0,
    platformFee: 17,
    gstAmount: 61.12,
    totalPaid: 418.12,
    paymentMethod: "UPI (asha@okhdfcbank)",
    paymentRef: "HC360-0621-4F9C",
    createdAt: "21 Jun 2026, 10:30 AM",
    quotations: [
      {
        id: "q-1",
        technicianId: "tech-1",
        technicianName: "Ramesh Patil",
        technicianRating: 4.9,
        technicianJobs: 428,
        technicianPhoto:
          "https://images.unsplash.com/photo-1659353587367-61eb5b8c6ef7?crop=faces&fit=crop&w=320&h=320&q=85",
        originalPrice: 349,
        currentPrice: 340,
        status: "accepted",
        eta: "18 min",
        distanceKm: 1.2,
        scopeNote: "Includes site visit, leak inspection, coupling seal fix and 7-day guarantee.",
        warrantyDays: 7,
        label: "Great deal",
        tagColor: "green",
      },
      {
        id: "q-2",
        technicianId: "tech-2",
        technicianName: "Sanjay Kumar",
        technicianRating: 4.8,
        technicianJobs: 312,
        technicianPhoto:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=faces&fit=crop&w=320&h=320&q=85",
        originalPrice: 399,
        currentPrice: 399,
        status: "pending",
        eta: "25 min",
        distanceKm: 2.4,
        scopeNote: "Standard replacement of pipe washers and seal.",
        warrantyDays: 7,
        label: "Fair price",
        tagColor: "blue",
      },
    ],
    activeQuotationId: "q-1",
    chatMessages: [
      {
        id: "m-1",
        sender: "technician",
        senderName: "Ramesh Patil",
        text: "Namaste Asha ji, I can fix the kitchen leak tomorrow. My quote includes the visit and standard pipe fitting.",
        timestamp: "10:42 AM",
        status: "read",
      },
      {
        id: "m-2",
        sender: "citizen",
        senderName: "Asha Sharma",
        text: "Would ₹320 work? The replacement washer is already available here at home.",
        timestamp: "10:44 AM",
        status: "read",
      },
      {
        id: "m-3",
        sender: "technician",
        senderName: "Ramesh Patil",
        text: "I can do ₹340 including our 7-day service warranty and pressure leak testing.",
        timestamp: "10:45 AM",
        status: "delivered",
      },
    ],
    beforeWorkPhoto:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    afterWorkPhoto:
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    beforeWorkPhotos: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    ],
    afterWorkPhotos: [
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    ],
    beforeHash: "4F9C-8A21-EVID-B4",
    afterHash: "7D32-10AB-EVID-AFT",
    beforeTimestamp: "21 Jun · 2:51 PM",
    afterTimestamp: "21 Jun · 3:24 PM",
    aiVerification: {
      confidence: 94,
      verdict: "Issue Successfully Resolved",
      checks: [
        { title: "Active water leak no longer visible under sink", passed: true },
        { title: "Joint washer replaced and clamp tightened securely", passed: true },
        { title: "Surrounding cabinet floor wiped clean and dry", passed: true },
      ],
    },
    warrantyActiveUntil: "28 Jun 2026",
  },
  {
    id: "HC-2835",
    serviceId: "plumbing",
    serviceName: "Plumbing · Main Ball Valve Replacement",
    citizenName: "Vikram Rao",
    citizenPhone: "+91 98220 11442",
    citizenAddress: "Vascon Windermere, North Main Road, Koregaon Park",
    area: "Koregaon Park",
    issueDescription:
      "Main overhead tank control valve jammed. Replaced with heavy-duty brass full-bore ball valve.",
    issuePhotos: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
    urgency: "standard",
    scheduledDate: "Yesterday",
    scheduledTimeWindow: "2:00 PM",
    status: "work_completed",
    completedAt: "20 Jun 2026, 3:45 PM",
    technicianId: "tech-1",
    technicianName: "Ramesh Patil",
    technicianPhoto:
      "https://images.unsplash.com/photo-1659353587367-61eb5b8c6ef7?crop=faces&fit=crop&w=320&h=320&q=85",
    technicianRating: 5.0,
    lockedPrice: 420,
    platformFee: 21,
    gstAmount: 75.6,
    totalPaid: 516.6,
    createdAt: "20 Jun 2026",
    quotations: [],
    chatMessages: [],
    beforeWorkPhoto:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    afterWorkPhoto:
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    beforeWorkPhotos: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    ],
    afterWorkPhotos: [
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    ],
    warrantyActiveUntil: "27 Jun 2026",
  },
  {
    id: "HC-2830",
    serviceId: "plumbing",
    serviceName: "Plumbing · Concealed Wall Pipeline Leak",
    citizenName: "Amit Deshmukh",
    citizenPhone: "+91 98901 22334",
    citizenAddress: "Sector 14, Magarpatta City, Hadapsar, Pune",
    area: "Hadapsar",
    issueDescription: "Seepage in common hallway wall. Suspected internal riser pipe rupture.",
    issuePhotos: [],
    urgency: "standard",
    scheduledDate: "19 Jun 2026",
    scheduledTimeWindow: "11:00 AM",
    status: "cancelled",
    rejectedReason: "Location is outside technician's Koregaon Park 4 km service zone.",
    lockedPrice: 450,
    platformFee: 22.5,
    gstAmount: 81,
    totalPaid: 553.5,
    createdAt: "19 Jun 2026",
    quotations: [],
    chatMessages: [],
  },
  {
    id: "HC-2840",
    serviceId: "ac_repair",
    serviceName: "AC Care · Jet wash & cooling fix",
    citizenName: "Meera Joshi",
    citizenPhone: "+91 98223 99887",
    citizenAddress: "Bungalow 7, Lane 5, Koregaon Park",
    area: "Koregaon Park",
    issueDescription: "Master bedroom 1.5 ton AC is not cooling properly and making buzzing sound.",
    issuePhotos: [],
    urgency: "standard",
    scheduledDate: "18 Jun 2026",
    scheduledTimeWindow: "11:00 AM",
    status: "payment_released",
    technicianId: "tech-2",
    technicianName: "Sanjay Kumar",
    technicianPhoto:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=faces&fit=crop&w=320&h=320&q=85",
    technicianRating: 4.8,
    lockedPrice: 699,
    platformFee: 35,
    gstAmount: 125.82,
    totalPaid: 859.82,
    createdAt: "18 Jun 2026",
    quotations: [],
    chatMessages: [],
    warrantyActiveUntil: "25 Jun 2026",
  },
  {
    id: "HC-2838",
    serviceId: "cleaning",
    serviceName: "Deep Cleaning · Bathroom descaling",
    citizenName: "Nina Das",
    citizenPhone: "+91 97660 54321",
    citizenAddress: "Flat 101, Hermes Heritage, Shastri Nagar",
    area: "Shastri Nagar",
    issueDescription: "Hard water scale stains on floor tiles were left half done.",
    issuePhotos: [],
    urgency: "standard",
    scheduledDate: "17 Jun 2026",
    scheduledTimeWindow: "3:00 PM",
    status: "disputed",
    technicianId: "tech-4",
    technicianName: "Pooja Yadav",
    lockedPrice: 1120,
    platformFee: 56,
    gstAmount: 201.6,
    totalPaid: 1377.6,
    createdAt: "17 Jun 2026",
    disputeReason: "Hard water scale was only cleaned from wall tiles; floor was left untreated.",
    quotations: [],
    chatMessages: [],
  },
];

export const initialGroupBookings: GroupBooking[] = [
  {
    id: "grp-1",
    neighbourhood: "Koregaon Park (Societies 1-4)",
    serviceId: "ac_repair",
    serviceName: "Pre-Monsoon AC Servicing & Coil Wash",
    discountPercentage: 61,
    targetHouseholds: 20,
    joinedHouseholds: [
      { name: "Asha Sharma", apt: "Ganga Carnation #402", joinedAt: "Yesterday" },
      { name: "Dr. K. Mehta", apt: "Ganga Carnation #104", joinedAt: "Today" },
      { name: "Ritu Kapoor", apt: "Vascon Windermere #3A", joinedAt: "Today" },
      { name: "Manoj Godbole", apt: "Hermes Domes #12", joinedAt: "Today" },
    ],
    expiresInDays: 3,
    dateDeadline: "24 Jun 2026",
    basePrice: 899,
    groupPrice: 349,
  },
  {
    id: "grp-2",
    neighbourhood: "Viman Nagar Central",
    serviceId: "pest_control",
    serviceName: "Community Herbal Cockroach & Pest Shield",
    discountPercentage: 45,
    targetHouseholds: 15,
    joinedHouseholds: [
      { name: "Deepak Shinde", apt: "Lunkad SkyLounge #8B", joinedAt: "2 days ago" },
      { name: "Sunita Roy", apt: "Lunkad SkyLounge #10A", joinedAt: "Yesterday" },
    ],
    expiresInDays: 5,
    dateDeadline: "26 Jun 2026",
    basePrice: 1200,
    groupPrice: 660,
  },
  {
    id: "grp-3",
    neighbourhood: "Koregaon Park & Kalyani Nagar",
    serviceId: "garbage",
    serviceName: "Society Bulk E-Waste & Renovation Debris Drive",
    discountPercentage: 55,
    targetHouseholds: 25,
    joinedHouseholds: [
      { name: "Asha Sharma", apt: "Ganga Carnation #402", joinedAt: "Today" },
      { name: "Vikram Rao", apt: "Windermere #14", joinedAt: "Today" },
      { name: "Dr. K. Mehta", apt: "Ganga Carnation #104", joinedAt: "Yesterday" },
      { name: "Sunita Patel", apt: "Lane 7 Bungalow", joinedAt: "Yesterday" },
      { name: "Pooja Kulkarni", apt: "Hermes Heritage #302", joinedAt: "2 days ago" },
    ],
    expiresInDays: 4,
    dateDeadline: "25 Jun 2026",
    basePrice: 450,
    groupPrice: 199,
  },
  {
    id: "grp-4",
    neighbourhood: "Baner - Balewadi Gated Societies",
    serviceId: "bodyguard",
    serviceName: "Community Gated Night Guard & Rapid Armed Patrol",
    discountPercentage: 40,
    targetHouseholds: 30,
    joinedHouseholds: [
      { name: "Col. S. K. Joshi", apt: "Pancard Club Enclave #12", joinedAt: "Yesterday" },
      { name: "Nisha Singhania", apt: "Windmills #4B", joinedAt: "Today" },
    ],
    expiresInDays: 6,
    dateDeadline: "27 Jun 2026",
    basePrice: 1500,
    groupPrice: 899,
  },
];

export const initialSOSAlerts: SOSAlert[] = [
  {
    id: "sos-101",
    citizenName: "Smt. Kamala Nair (78 yrs)",
    citizenPhone: "+91 98220 88776",
    location: "Lane 7, Koregaon Park, Pune",
    latitude: 18.5362,
    longitude: 73.8942,
    timestamp: "12 mins ago",
    status: "active",
    category: "Plumbing Emergency",
    description:
      "Sudden pipe burst in ground-floor bathroom; elderly citizen unable to reach main stopcock valve.",
    notes:
      "Sudden pipe burst in ground-floor bathroom; elderly citizen unable to reach main stopcock valve.",
    bookingRef: "HC-SOS-091",
  },
  {
    id: "sos-102",
    citizenName: "Rohit Bansal",
    citizenPhone: "+91 97665 44332",
    location: "Kalyani Nagar, Near Jogger's Park",
    latitude: 18.5484,
    longitude: 73.9038,
    timestamp: "38 mins ago",
    status: "dispatched",
    category: "Electrical Hazard",
    description: "Sparking sound and burning smell from main distribution board after heavy rain.",
    assignedStaff: "Inspector Vijay Kale (Rapid Safety Patrol #4)",
    notes: "Sparking sound from main distribution board after rain.",
    bookingRef: "HC-SOS-089",
  },
  {
    id: "sos-103",
    citizenName: "Dr. K. Mehta",
    citizenPhone: "+91 98231 11223",
    location: "Ganga Carnation, North Main Road, Koregaon Park",
    latitude: 18.5398,
    longitude: 73.8985,
    timestamp: "1 hour ago",
    status: "resolved",
    category: "Gas Leakage Precaution",
    description:
      "Reported faint LPG gas odor near kitchen regulator pipe. Line purged and valve resealed.",
    assignedStaff: "Ramesh Patil (Master Plumber - Emergency Certified)",
    notes: "LPG smell reported. Safety inspection completed successfully.",
    bookingRef: "HC-SOS-088",
  },
  {
    id: "sos-104",
    citizenName: "Anita Deshmukh",
    citizenPhone: "+91 98901 33445",
    location: "Hermes Heritage, Shastri Nagar, Pune",
    latitude: 18.5521,
    longitude: 73.8912,
    timestamp: "Just now",
    status: "active",
    category: "Water Inundation",
    description:
      "Heavy balcony drain overflow during storm entering living room through sliding doors.",
    notes: "Heavy balcony drain overflow entering residence.",
    bookingRef: "HC-SOS-092",
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Technician Dispatched",
    body: "Ramesh Patil is on the way to your Koregaon Park residence. ETA 18 mins.",
    timestamp: "5m ago",
    read: false,
    roleTarget: "citizen",
    type: "booking",
  },
  {
    id: "notif-2",
    title: "Escrow Held Safely",
    body: "₹418.12 locked in HomeCare Protect escrow. Funds will only release on your sign-off.",
    timestamp: "20m ago",
    read: false,
    roleTarget: "citizen",
    type: "payment",
  },
  {
    id: "notif-3",
    title: "New Service Request Nearby",
    body: "Kitchen sink leak reported in Koregaon Park (1.2 km away). Send your quote.",
    timestamp: "2m ago",
    read: false,
    roleTarget: "technician",
    type: "quotation",
  },
  {
    id: "notif-4",
    title: "Active SOS Alert",
    body: "Elderly resident in Koregaon Park triggered water burst emergency.",
    timestamp: "12m ago",
    read: false,
    roleTarget: "admin",
    type: "sos",
  },
];

export interface AppContextType {
  role: Role;
  setRole: (r: Role) => void;
  language: LanguageCode;
  setLanguage: (l: LanguageCode) => void;
  seniorMode: boolean;
  setSeniorMode: (v: boolean) => void;
  activeScreen: string;
  setActiveScreen: (s: string) => void;

  categories: ServiceCategory[];
  technicians: TechnicianProfile[];
  bookings: Booking[];
  groupBookings: GroupBooking[];
  sosAlerts: SOSAlert[];
  notifications: NotificationItem[];
  currentUser: AppUser;

  // Selected state
  activeBookingId: string;
  setActiveBookingId: (id: string) => void;
  selectedTechId: string | null;
  setSelectedTechId: (id: string | null) => void;

  // Modals & Panels
  isAuthOpen: boolean;
  setIsAuthOpen: (v: boolean) => void;
  isSosOpen: boolean;
  setIsSosOpen: (v: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (v: boolean) => void;
  isServiceRequestOpen: boolean;
  setIsServiceRequestOpen: (v: boolean) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;

  // Actions
  createBooking: (data: Partial<Booking>) => string;
  sendTechnicianQuote: (bookingId: string, price: number, note: string) => void;
  sendChatMessage: (
    bookingId: string,
    sender: "citizen" | "technician",
    text: string,
    photoUrl?: string,
  ) => void;
  markChatAsRead: (bookingId: string, readerRole: "citizen" | "technician") => void;
  setTyping: (bookingId: string, userRole: "citizen" | "technician" | null) => void;
  typingMap: Record<string, "citizen" | "technician" | null>;
  counterOffer: (bookingId: string, quoteId: string, price: number) => void;
  acceptQuote: (bookingId: string, quoteId: string) => void;
  lockEscrowPayment: (bookingId: string, method: string) => void;
  advanceBookingStatus: (bookingId: string, status: BookingStatus) => void;
  acceptTechnicianRequest: (bookingId: string, customPrice?: number) => void;
  rejectTechnicianRequest: (bookingId: string, reason?: string) => void;
  updateTechnicianProfile: (updates: Partial<TechnicianProfile>) => void;
  withdrawTechnicianEarnings: (amount: number, upiId: string) => void;
  saveEvidencePhotos: (
    bookingId: string,
    beforePhotos: string[] | string,
    afterPhotos: string[] | string,
    beforeHash?: string,
    afterHash?: string,
    beforeTimestamp?: string,
    afterTimestamp?: string,
  ) => void;
  releasePaymentAndComplete: (bookingId: string) => void;
  submitReview: (bookingId: string, rating: number, comment: string, photo?: string) => void;
  raiseDispute: (bookingId: string, reason: string) => void;
  triggerSos: (
    dataOrNotes?: string | { category: string; description?: string; location?: string },
  ) => void;
  resolveSos: (sosId: string) => void;
  assignSosResponder: (sosId: string, responder: string) => void;
  verifyTechnician: (techId: string, status: "approved" | "rejected") => void;
  joinGroupBooking: (groupId: string) => void;
  markNotificationsAsRead: () => void;
  resetToDefaults: () => void;
  t: (typeof translations)[LanguageCode];
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => {
    return (localStorage.getItem("hc360-role") as Role) || "citizen";
  });
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem("hc360-lang") as LanguageCode) || "EN";
  });
  const [seniorMode, setSeniorModeState] = useState<boolean>(() => {
    return localStorage.getItem("hc360-senior") === "true";
  });
  const [activeScreen, setActiveScreenState] = useState<string>(() => {
    return localStorage.getItem("hc360-screen") || "home";
  });

  const [categories, setCategories] = useState<ServiceCategory[]>(() => {
    const saved = localStorage.getItem("hc360-categories");
    if (saved) {
      try {
        const parsed: ServiceCategory[] = JSON.parse(saved);
        const missing = initialCategories.filter((ic) => !parsed.some((c) => c.id === ic.id));
        if (missing.length > 0) {
          return [...parsed, ...missing];
        }
        return parsed;
      } catch {
        return initialCategories;
      }
    }
    return initialCategories;
  });

  const [technicians, setTechnicians] = useState<TechnicianProfile[]>(() => {
    const saved = localStorage.getItem("hc360-techs");
    if (saved) {
      try {
        const parsed: TechnicianProfile[] = JSON.parse(saved);
        const missing = initialTechnicians.filter((it) => !parsed.some((t) => t.id === it.id));
        if (missing.length > 0) {
          return [...parsed, ...missing];
        }
        return parsed;
      } catch {
        return initialTechnicians;
      }
    }
    return initialTechnicians;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem("hc360-bookings");
    if (saved) {
      try {
        const parsed: Booking[] = JSON.parse(saved);
        const missing = initialBookings.filter((ib) => !parsed.some((b) => b.id === ib.id));
        if (missing.length > 0) {
          return [...missing, ...parsed];
        }
        return parsed;
      } catch {
        return initialBookings;
      }
    }
    return initialBookings;
  });

  const [groupBookings, setGroupBookings] = useState<GroupBooking[]>(() => {
    const saved = localStorage.getItem("hc360-groups");
    if (saved) {
      try {
        const parsed: GroupBooking[] = JSON.parse(saved);
        const missing = initialGroupBookings.filter((ig) => !parsed.some((g) => g.id === ig.id));
        if (missing.length > 0) {
          return [...parsed, ...missing];
        }
        return parsed;
      } catch {
        return initialGroupBookings;
      }
    }
    return initialGroupBookings;
  });

  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>(() => {
    const saved = localStorage.getItem("hc360-sos");
    return saved ? JSON.parse(saved) : initialSOSAlerts;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem("hc360-notifs");
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [currentUser] = useState<AppUser>({
    id: "user-1",
    name: "Asha Sharma",
    phone: "+91 98221 12345",
    email: "asha.sharma@example.com",
    role: "citizen",
    address: "Flat 402, Ganga Carnation, Koregaon Park",
    city: "Pune",
    isVerified: true,
    joinedDate: "March 2025",
  });

  const [activeBookingId, setActiveBookingId] = useState<string>("HC-2841");
  const [selectedTechId, setSelectedTechId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isServiceRequestOpen, setIsServiceRequestOpen] = useState(false);

  // Chat typing indicator state
  const [typingMap, setTypingMap] = useState<Record<string, "citizen" | "technician" | null>>({});

  const setTyping = (bookingId: string, userRole: "citizen" | "technician" | null) => {
    setTypingMap((prev) => ({ ...prev, [bookingId]: userRole }));
  };

  // Sync to localStorage safely (prevent quota exceptions)
  useEffect(() => {
    try {
      localStorage.setItem("hc360-role", role);
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  }, [role]);

  useEffect(() => {
    try {
      localStorage.setItem("hc360-lang", language);
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem("hc360-senior", String(seniorMode));
    } catch (e) {
      console.warn("Storage warning:", e);
    }
    if (seniorMode) {
      document.body.classList.add("senior-mode");
    } else {
      document.body.classList.remove("senior-mode");
    }
  }, [seniorMode]);

  useEffect(() => {
    try {
      localStorage.setItem("hc360-screen", activeScreen);
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  }, [activeScreen]);

  useEffect(() => {
    try {
      localStorage.setItem("hc360-bookings", JSON.stringify(bookings));
    } catch (err) {
      console.warn("localStorage quota exceeded for bookings, keeping lightweight backup:", err);
      try {
        const lightweight = bookings.map((b) => ({
          ...b,
          issuePhotos: b.issuePhotos.map((p) => (p.length > 30000 ? p.slice(0, 100) : p)),
          beforeWorkPhotos: b.beforeWorkPhotos?.map((p) =>
            p.length > 30000 ? p.slice(0, 100) : p,
          ),
          afterWorkPhotos: b.afterWorkPhotos?.map((p) => (p.length > 30000 ? p.slice(0, 100) : p)),
        }));
        localStorage.setItem("hc360-bookings", JSON.stringify(lightweight));
      } catch (innerErr) {
        console.error("Critical storage fallback error:", innerErr);
      }
    }
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("hc360-techs", JSON.stringify(technicians));
  }, [technicians]);

  useEffect(() => {
    localStorage.setItem("hc360-groups", JSON.stringify(groupBookings));
  }, [groupBookings]);

  useEffect(() => {
    localStorage.setItem("hc360-sos", JSON.stringify(sosAlerts));
  }, [sosAlerts]);

  useEffect(() => {
    localStorage.setItem("hc360-notifs", JSON.stringify(notifications));
  }, [notifications]);

  // Sync initial state with FastAPI backend
  useEffect(() => {
    api.services
      .list()
      .then((srvs) => {
        if (Array.isArray(srvs) && srvs.length > 0) {
          setCategories(srvs);
        }
      })
      .catch(() => {});

    api.bookings
      .list()
      .then((bks) => {
        if (Array.isArray(bks) && bks.length > 0) {
          setBookings(bks);
        }
      })
      .catch(() => {});

    api.groupBookings
      .list()
      .then((grps) => {
        if (Array.isArray(grps) && grps.length > 0) {
          setGroupBookings(grps);
        }
      })
      .catch(() => {});

    api.notifications
      .list()
      .then((notifs) => {
        if (Array.isArray(notifs) && notifs.length > 0) {
          setNotifications(notifs);
        }
      })
      .catch(() => {});
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    if (newRole === "citizen") setActiveScreenState("home");
    else if (newRole === "technician") setActiveScreenState("tech_dashboard");
    else if (newRole === "admin") setActiveScreenState("admin_dashboard");
  };

  const setLanguage = (newLang: LanguageCode) => setLanguageState(newLang);
  const setSeniorMode = (v: boolean) => setSeniorModeState(v);
  const setActiveScreen = (s: string) => {
    setActiveScreenState(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addNotification = (notif: Omit<NotificationItem, "id" | "timestamp" | "read">) => {
    const item: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [item, ...prev]);
  };

  const createBooking = (data: Partial<Booking>): string => {
    const id = `HC-${Math.floor(2800 + Math.random() * 200)}`;
    const category = categories.find((c) => c.id === data.serviceId) || categories[0];
    const tech = technicians.find((t) => t.primaryService === category.id) || technicians[0];
    const baseAmount =
      data.lockedPrice ||
      category.basePrice +
        (category.id === "bodyguard" ? 400 : category.id === "garbage" ? 50 : 140);
    const platformFee = Math.round(baseAmount * 0.05);
    const gst = Math.round((baseAmount + platformFee) * 0.18 * 100) / 100;

    let defaultScope = "Includes standard visit, problem diagnosis, and 7-day guarantee.";
    let defaultLabel = "Best match";
    if (category.id === "garbage") {
      defaultScope =
        "Doorstep segregated waste collection, weighing, and municipal bio-facility transfer with eco receipt.";
      defaultLabel = "PMC Eco-Certified";
    } else if (category.id === "bodyguard") {
      defaultScope =
        "Close protection officer escort, threat assessment, satellite panic sync, and discrete transit.";
      defaultLabel = "PSARA Armed Verified";
    }

    const newBooking: Booking = {
      id,
      serviceId: category.id,
      serviceName: data.serviceName || `${category.name} · Service Request`,
      citizenName: currentUser.name,
      citizenPhone: currentUser.phone,
      citizenAddress: currentUser.address,
      area: "Koregaon Park",
      issueDescription: data.issueDescription || "Service requested at residence.",
      issuePhotos: data.issuePhotos || [],
      urgency: data.urgency || "standard",
      scheduledDate: data.scheduledDate || "Tomorrow",
      scheduledTimeWindow: data.scheduledTimeWindow || "2:00 PM – 4:00 PM",
      status: "request_submitted",
      lockedPrice: baseAmount,
      platformFee,
      gstAmount: gst,
      totalPaid: baseAmount + platformFee + gst,
      createdAt: "Today",
      quotations: [
        {
          id: `q-${Date.now()}-1`,
          technicianId: tech.id,
          technicianName: tech.name,
          technicianRating: tech.rating,
          technicianJobs: tech.totalJobs,
          technicianPhoto: tech.photo,
          originalPrice: baseAmount + 100,
          currentPrice: baseAmount,
          status: "pending",
          eta: `${tech.etaMinutes} min`,
          distanceKm: tech.distanceKm,
          scopeNote: defaultScope,
          warrantyDays: category.id === "bodyguard" ? 1 : 7,
          label: defaultLabel,
          tagColor: "green",
        },
      ],
      chatMessages: [
        {
          id: `msg-${Date.now()}`,
          sender: "system",
          text: `Service request received for ${category.name}. Notified nearby verified technician ${tech.name}. Awaiting acceptance.`,
          timestamp: "Just now",
        },
      ],
      ...data,
    };

    setBookings((prev) => [newBooking, ...prev]);
    setActiveBookingId(id);

    // Sync booking with FastAPI backend
    api.bookings
      .create({
        serviceId: category.id,
        serviceName: data.serviceName,
        issueDescription: data.issueDescription,
        issuePhotos: data.issuePhotos,
        urgency: data.urgency,
        scheduledDate: data.scheduledDate,
        scheduledTimeWindow: data.scheduledTimeWindow,
        citizenAddress: currentUser.address,
        lockedPrice: baseAmount,
        garbageDetails: data.garbageDetails,
        bodyguardRequirements: data.bodyguardRequirements,
      })
      .catch(() => {});

    // Notify technician of incoming job request
    addNotification({
      title: "🚨 New Citizen Service Request!",
      body: `${currentUser.name} requested ${category.name} in Koregaon Park (₹${baseAmount}). Tap to review & accept.`,
      roleTarget: "technician",
      type: "booking",
    });

    // Notify citizen that request is broadcasted
    addNotification({
      title: "📡 Request Dispatched",
      body: `Your request #${id} for ${category.name} has been broadcasted to verified technicians. Awaiting acceptance.`,
      roleTarget: "citizen",
      type: "booking",
    });

    return id;
  };

  const sendTechnicianQuote = (bookingId: string, price: number, note: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const newQuote = {
          id: `q-${Date.now()}`,
          technicianId: "tech-1",
          technicianName: "Ramesh Patil",
          technicianRating: 4.9,
          technicianJobs: 429,
          technicianPhoto:
            "https://images.unsplash.com/photo-1659353587367-61eb5b8c6ef7?crop=faces&fit=crop&w=320&h=320&q=85",
          originalPrice: price,
          currentPrice: price,
          status: "pending" as const,
          eta: "18 min",
          distanceKm: 1.2,
          scopeNote: note || "Full inspection and repair with warranty.",
          warrantyDays: 7,
          label: "Custom quote",
          tagColor: "green" as const,
        };
        return {
          ...b,
          status: "quoted",
          quotations: [newQuote, ...b.quotations],
        };
      }),
    );

    addNotification({
      title: "Quote Sent",
      body: `You sent a quote of ₹${price} for booking ${bookingId}.`,
      roleTarget: "technician",
      type: "quotation",
    });
  };

  const sendChatMessage = (
    bookingId: string,
    sender: "citizen" | "technician",
    text: string,
    photoUrl?: string,
  ) => {
    if (!text.trim() && !photoUrl) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const currentSenderName =
      sender === "citizen" ? currentUser.name : "Ramesh Patil";

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const senderName =
          sender === "citizen" ? currentUser.name : b.technicianName || currentSenderName;

        // Mark previously received messages from opposite party as read
        const updatedChat = b.chatMessages.map((m) =>
          m.sender !== sender ? { ...m, status: "read" as const } : m,
        );

        const newMsg: ChatMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          sender,
          senderName,
          text: text.trim(),
          timestamp: timeStr,
          status: "delivered",
          photoUrl,
        };

        return {
          ...b,
          chatMessages: [...updatedChat, newMsg],
        };
      }),
    );

    // Clear typing state
    setTypingMap((prev) => ({ ...prev, [bookingId]: null }));

    // Sync chat with FastAPI backend
    api.chat
      .sendMessage(bookingId, sender, text.trim(), currentSenderName, photoUrl)
      .catch(() => {});

    if (sender === "citizen") {
      addNotification({
        title: "New Customer Message",
        body: `${currentUser.name}: "${text.slice(0, 45)}${text.length > 45 ? "..." : ""}"`,
        roleTarget: "technician",
        type: "booking",
      });
    } else {
      addNotification({
        title: "Technician Reply Received",
        body: `Ramesh Patil: "${text.slice(0, 45)}${text.length > 45 ? "..." : ""}"`,
        roleTarget: "citizen",
        type: "booking",
      });
    }
  };

  const markChatAsRead = (bookingId: string, readerRole: "citizen" | "technician") => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const hasUnread = b.chatMessages.some(
          (m) => m.sender !== readerRole && m.status !== "read",
        );
        if (!hasUnread) return b;
        return {
          ...b,
          chatMessages: b.chatMessages.map((m) =>
            m.sender !== readerRole ? { ...m, status: "read" as const } : m,
          ),
        };
      }),
    );
  };

  const counterOffer = (bookingId: string, quoteId: string, price: number) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const updatedQuotes = b.quotations.map((q) =>
          q.id === quoteId
            ? { ...q, currentPrice: price, counterPrice: price, status: "counter_offered" as const }
            : q,
        );
        return {
          ...b,
          status: "negotiating",
          quotations: updatedQuotes,
          chatMessages: [
            ...b.chatMessages,
            {
              id: `msg-${Date.now()}`,
              sender: "citizen" as const,
              text: `I would like to offer ₹${price} for this service.`,
              timestamp: "Just now",
            },
          ],
        };
      }),
    );

    addNotification({
      title: "Counter-offer Submitted",
      body: `Asha offered ₹${price} for booking ${bookingId}.`,
      roleTarget: "technician",
      type: "quotation",
    });

    // Sync negotiation with FastAPI backend
    api.negotiation
      .counterOffer(bookingId, price, quoteId)
      .catch(() => {});
  };

  const acceptQuote = (bookingId: string, quoteId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const targetQuote = b.quotations.find((q) => q.id === quoteId) || b.quotations[0];
        const lockedPrice = targetQuote.currentPrice;
        const platformFee = Math.round(lockedPrice * 0.05);
        const gst = Math.round((lockedPrice + platformFee) * 0.18 * 100) / 100;
        const total = lockedPrice + platformFee + gst;

        return {
          ...b,
          status: "quotation_accepted",
          activeQuotationId: quoteId,
          technicianId: targetQuote.technicianId,
          technicianName: targetQuote.technicianName,
          technicianPhoto: targetQuote.technicianPhoto,
          technicianRating: targetQuote.technicianRating,
          lockedPrice,
          platformFee,
          gstAmount: gst,
          totalPaid: total,
          quotations: b.quotations.map((q) =>
            q.id === quoteId
              ? { ...q, status: "accepted" as const }
              : { ...q, status: "rejected" as const },
          ),
        };
      }),
    );
  };

  const lockEscrowPayment = (bookingId: string, method: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: "escrow_locked",
          paymentMethod: method,
          paymentRef: `HC360-ESCROW-${Math.floor(1000 + Math.random() * 9000)}`,
        };
      }),
    );

    addNotification({
      title: "Escrow Locked",
      body: `Payment securely deposited into escrow for booking ${bookingId}. Technician dispatched.`,
      roleTarget: "all",
      type: "payment",
    });

    // Sync lock price with FastAPI backend
    api.escrow
      .lockPrice(bookingId, undefined, method)
      .catch(() => {});

    // Auto-advance to on the way after 1 second for seamless tracking experience
    setTimeout(() => {
      advanceBookingStatus(bookingId, "on_the_way");
    }, 1200);
  };

  const advanceBookingStatus = (bookingId: string, status: BookingStatus) => {
    let isValidTransition = false;
    let completedTimestamp: string | undefined = undefined;

    setBookings((prev) => {
      const target = prev.find((b) => b.id === bookingId);
      if (!target) return prev;

      const current = target.status;
      // Prevent duplicate transitions if already in requested state
      if (current === status) {
        return prev;
      }

      // Enforce sequential progression rules:
      // accepted / escrow_locked / quoted -> on_the_way
      // on_the_way -> arrived
      // arrived -> work_started
      // work_started -> work_completed
      // work_completed -> payment_released
      const isAllowed =
        (status === "on_the_way" &&
          ["quotation_accepted", "escrow_locked", "quoted", "request_submitted"].includes(
            current,
          )) ||
        (status === "arrived" && current === "on_the_way") ||
        (status === "work_started" && current === "arrived") ||
        (status === "work_completed" && current === "work_started") ||
        (status === "payment_released" && current === "work_completed") ||
        status === "disputed" ||
        status === "cancelled";

      if (!isAllowed) {
        console.warn(`[HomeCare 360] Invalid status transition rejected: ${current} -> ${status}`);
        return prev;
      }

      isValidTransition = true;

      if (status === "work_completed") {
        const now = new Date();
        completedTimestamp = `${now.getDate()} ${now.toLocaleString("en-US", { month: "short" })} · ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
      }

      return prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status,
          completedAt: completedTimestamp || b.completedAt,
        };
      });
    });

    if (status === "work_completed") {
      // Increment technician total jobs count
      setTechnicians((prev) =>
        prev.map((t) => (t.id === "tech-1" ? { ...t, totalJobs: t.totalJobs + 1 } : t)),
      );
    }

    const labels: Record<BookingStatus, string> = {
      request_submitted: "Request Submitted",
      quoted: "Quotations Received",
      negotiating: "Negotiating Price",
      quotation_accepted: "Quotation Accepted",
      escrow_locked: "Escrow Locked",
      on_the_way: "Technician is on the way (Live Tracking Active)",
      arrived: "Technician has arrived at doorstep",
      work_started: "Work is in progress",
      work_completed: "Work completed by technician",
      payment_released: "Payment released & warranty activated",
      disputed: "Dispute raised by customer",
      cancelled: "Booking cancelled",
    };

    addNotification({
      title: "Booking Update",
      body: `Booking ${bookingId}: ${labels[status]}`,
      roleTarget: "all",
      type: "booking",
    });

    // Sync status change with FastAPI backend
    api.bookings.updateStatus(bookingId, status).catch(() => {});
  };

  const acceptTechnicianRequest = (bookingId: string, customPrice?: number) => {
    let serviceName = "HomeCare Service";
    let targetBooking: Booking | undefined;

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        targetBooking = b;
        serviceName = b.serviceName;
        const finalPrice = customPrice || b.lockedPrice || 340;
        const platformFee = Math.round(finalPrice * 0.05);
        const gst = Math.round((finalPrice + platformFee) * 0.18 * 100) / 100;

        return {
          ...b,
          status: "quotation_accepted" as const,
          technicianId: "tech-1",
          technicianName: "Ramesh Patil",
          technicianPhone: "+91 98230 45671",
          technicianPhoto:
            "https://images.unsplash.com/photo-1659353587367-61eb5b8c6ef7?crop=faces&fit=crop&w=320&h=320&q=85",
          technicianRating: 4.9,
          lockedPrice: finalPrice,
          platformFee,
          gstAmount: gst,
          totalPaid: finalPrice + platformFee + gst,
          quotations: b.quotations.map((q) => ({
            ...q,
            currentPrice: finalPrice,
            status: "accepted" as const,
          })),
        };
      }),
    );

    // Notify technician
    addNotification({
      title: "Booking Accepted",
      body: `You accepted booking #${bookingId}. Customer notified to review quote and lock price.`,
      roleTarget: "technician",
      type: "booking",
    });

    // Notify citizen that technician accepted and they can proceed!
    addNotification({
      title: "🎉 Request Accepted by Technician!",
      body: `Ramesh Patil has accepted your request #${bookingId} for ${serviceName}! Review quotation and lock price in escrow.`,
      roleTarget: "citizen",
      type: "quotation",
    });

    // Sync with FastAPI backend
    api.bookings.accept(bookingId, customPrice).catch(() => {
      api.bookings.updateStatus(bookingId, "quotation_accepted").catch(() => {});
    });
  };

  const rejectTechnicianRequest = (bookingId: string, reason?: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: "cancelled" as const,
          rejectedReason: reason || "Declined by technician due to schedule or distance.",
        };
      }),
    );
    addNotification({
      title: "Request Declined",
      body: `Booking #${bookingId} has been declined.`,
      roleTarget: "technician",
      type: "booking",
    });
  };

  const updateTechnicianProfile = (updates: Partial<TechnicianProfile>) => {
    setTechnicians((prev) =>
      prev.map((t) => {
        if (t.id !== "tech-1") return t;
        const now = new Date();
        const dateStr = `${now.getDate()} ${now.toLocaleString("en-US", { month: "short", year: "numeric" })}`;
        return {
          ...t,
          ...updates,
          lastUpdated: dateStr,
        };
      }),
    );
    addNotification({
      title: "Profile Updated",
      body: "Your technician profile and skill credentials have been successfully updated.",
      roleTarget: "technician",
      type: "verification",
    });
  };

  const withdrawTechnicianEarnings = (amount: number, upiId: string) => {
    addNotification({
      title: "Withdrawal Initiated",
      body: `₹${amount.toFixed(2)} transfer initiated to ${upiId}. Bank confirmation in 15 mins.`,
      roleTarget: "technician",
      type: "payment",
    });
  };

  const saveEvidencePhotos = (
    bookingId: string,
    beforePhotos: string[] | string,
    afterPhotos: string[] | string,
    beforeHash?: string,
    afterHash?: string,
    beforeTimestamp?: string,
    afterTimestamp?: string,
  ) => {
    const bList = Array.isArray(beforePhotos) ? beforePhotos : beforePhotos ? [beforePhotos] : [];
    const aList = Array.isArray(afterPhotos) ? afterPhotos : afterPhotos ? [afterPhotos] : [];

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const now = new Date();
        const defaultTime = `${now.getDate()} ${now.toLocaleString("en-US", { month: "short" })} · ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;

        const updatedBeforePhotos =
          bList.length > 0
            ? bList
            : b.beforeWorkPhotos || (b.beforeWorkPhoto ? [b.beforeWorkPhoto] : []);
        const updatedAfterPhotos =
          aList.length > 0
            ? aList
            : b.afterWorkPhotos || (b.afterWorkPhoto ? [b.afterWorkPhoto] : []);

        return {
          ...b,
          beforeWorkPhoto: updatedBeforePhotos[0] || b.beforeWorkPhoto,
          afterWorkPhoto: updatedAfterPhotos[0] || b.afterWorkPhoto,
          beforeWorkPhotos: updatedBeforePhotos,
          afterWorkPhotos: updatedAfterPhotos,
          beforeHash: beforeHash || b.beforeHash || "4F9C-8A21-EVID-B4",
          afterHash: afterHash || b.afterHash || "7D32-10AB-EVID-AFT",
          beforeTimestamp: beforeTimestamp || b.beforeTimestamp || defaultTime,
          afterTimestamp: afterTimestamp || b.afterTimestamp || defaultTime,
          aiVerification: {
            confidence: 94,
            verdict: "Job verified with high confidence",
            checks: [
              { title: "Defect repaired according to work description", passed: true },
              { title: "No residual water leak or wire exposure visible", passed: true },
              { title: "Work area sanitized and restored", passed: true },
            ],
          },
        };
      }),
    );

    addNotification({
      title: "Evidence Photos Updated",
      body: `Technician uploaded photographic evidence for ${bookingId}. Inspect in Evidence Vault.`,
      roleTarget: "citizen",
      type: "booking",
    });

    // Sync evidence with FastAPI backend
    if (bList.length > 0) {
      api.evidence.upload(bookingId, bList[0], "before", beforeHash).catch(() => {});
    }
    if (aList.length > 0) {
      api.evidence.upload(bookingId, aList[0], "after", afterHash).catch(() => {});
    }
  };

  const releasePaymentAndComplete = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: "payment_released",
          warrantyActiveUntil: "7 days from today",
        };
      }),
    );

    addNotification({
      title: "Payment Released",
      body: `Escrow released to Ramesh Patil for ${bookingId}. 7-day warranty is now active!`,
      roleTarget: "all",
      type: "payment",
    });

    // Sync release with FastAPI backend
    api.escrow
      .release(bookingId)
      .catch(() => {});
  };

  const submitReview = (bookingId: string, rating: number, comment: string, photo?: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, reviewSubmitted: true } : b)),
    );

    const booking = bookings.find((b) => b.id === bookingId);
    const techId = booking?.technicianId || "tech-1";

    setTechnicians((prev) =>
      prev.map((tech) => {
        if (tech.id !== techId) return tech;
        const newReview = {
          id: `rev-${Date.now()}`,
          citizenName: currentUser.name,
          rating,
          comment,
          date: "Just now",
          serviceName: booking?.serviceName || "Service",
          workPhoto: photo,
        };
        const updatedReviews = [newReview, ...tech.reviews];
        const avg = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;

        return {
          ...tech,
          reviews: updatedReviews,
          rating: Math.round(avg * 10) / 10,
          totalJobs: tech.totalJobs + 1,
        };
      }),
    );

    addNotification({
      title: "Review Submitted",
      body: `Thank you for rating Ramesh Patil with ${rating} stars!`,
      roleTarget: "citizen",
      type: "review",
    });

    // Sync review with FastAPI backend
    api.reviews
      .submit(bookingId, rating, comment, photo)
      .catch(() => {});
  };

  const raiseDispute = (bookingId: string, reason: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: "disputed", disputeReason: reason } : b,
      ),
    );

    addNotification({
      title: "Dispute Escalation",
      body: `Customer raised dispute on ${bookingId}: "${reason}". Support team notified.`,
      roleTarget: "admin",
      type: "sos",
    });
  };

  const triggerSos = (
    dataOrNotes?: string | { category: string; description?: string; location?: string },
  ) => {
    let category = "Emergency Assistance";
    let description = "Immediate safety and repair assistance requested by resident.";
    let location = currentUser.address;

    if (typeof dataOrNotes === "string") {
      description = dataOrNotes;
      if (dataOrNotes.includes(":")) {
        const parts = dataOrNotes.split(":");
        category = parts[0].trim();
        description = parts.slice(1).join(":").trim();
      }
    } else if (dataOrNotes && typeof dataOrNotes === "object") {
      category = dataOrNotes.category || category;
      description = dataOrNotes.description || description;
      location = dataOrNotes.location || location;
    }

    const now = new Date();
    const formattedTime = `${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} · Just now`;

    const newAlert: SOSAlert = {
      id: `sos-${Math.floor(1000 + Math.random() * 9000)}`,
      citizenName: currentUser.name,
      citizenPhone: currentUser.phone,
      location: location,
      latitude: 18.5362,
      longitude: 73.8942,
      timestamp: formattedTime,
      status: "active",
      category: category,
      description: description,
      notes: `[${category}] ${description}`,
    };

    setSosAlerts((prev) => [newAlert, ...prev]);

    addNotification({
      title: `CRITICAL: SOS [${category}]`,
      body: `Emergency alert from ${currentUser.name} at ${location}: "${description.slice(0, 70)}..."`,
      roleTarget: "all",
      type: "sos",
    });

    // Sync SOS with FastAPI backend
    api.sos
      .trigger({ category, description, location })
      .catch(() => {});
  };

  const resolveSos = (sosId: string) => {
    setSosAlerts((prev) => prev.map((s) => (s.id === sosId ? { ...s, status: "resolved" } : s)));
  };

  const assignSosResponder = (sosId: string, responder: string) => {
    setSosAlerts((prev) =>
      prev.map((s) =>
        s.id === sosId ? { ...s, status: "dispatched", assignedStaff: responder } : s,
      ),
    );
    addNotification({
      title: "SOS Unit Dispatched",
      body: `Assigned ${responder} to emergency alert #${sosId}.`,
      roleTarget: "admin",
      type: "sos",
    });
  };

  const verifyTechnician = (techId: string, status: "approved" | "rejected") => {
    setTechnicians((prev) =>
      prev.map((t) =>
        t.id === techId
          ? { ...t, verificationStatus: status, isVerified: status === "approved" }
          : t,
      ),
    );

    addNotification({
      title: `Technician ${status === "approved" ? "Approved" : "Rejected"}`,
      body: `Application for technician ID ${techId} marked as ${status}.`,
      roleTarget: "admin",
      type: "verification",
    });

    // Sync verification with FastAPI backend
    api.admin
      .verifyTechnician(techId, status)
      .catch(() => {});
  };

  const joinGroupBooking = (groupId: string) => {
    setGroupBookings((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        if (g.joinedHouseholds.some((h) => h.name === currentUser.name)) return g;
        const updated = [
          ...g.joinedHouseholds,
          { name: currentUser.name, apt: "Ganga Carnation #402", joinedAt: "Just now" },
        ];
        return {
          ...g,
          joinedHouseholds: updated,
        };
      }),
    );

    // Sync group booking with FastAPI backend
    api.groupBookings
      .join(groupId, currentUser.name)
      .catch(() => {});

    addNotification({
      title: "Joined Group Booking",
      body: "You joined the neighbourhood group! You get up to 61% savings.",
      roleTarget: "citizen",
      type: "booking",
    });
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setRoleState("citizen");
    setLanguageState("EN");
    setSeniorModeState(false);
    setActiveScreenState("home");
    setCategories(initialCategories);
    setTechnicians(initialTechnicians);
    setBookings(initialBookings);
    setGroupBookings(initialGroupBookings);
    setSosAlerts(initialSOSAlerts);
    setNotifications(initialNotifications);
    setActiveBookingId("HC-2841");
    setSelectedTechId(null);
    setSelectedCategoryId(null);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        seniorMode,
        setSeniorMode,
        activeScreen,
        setActiveScreen,
        categories,
        technicians,
        bookings,
        groupBookings,
        sosAlerts,
        notifications,
        currentUser,
        activeBookingId,
        setActiveBookingId,
        selectedTechId,
        setSelectedTechId,
        isAuthOpen,
        setIsAuthOpen,
        isSosOpen,
        setIsSosOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        isServiceRequestOpen,
        setIsServiceRequestOpen,
        selectedCategoryId,
        setSelectedCategoryId,
        createBooking,
        sendTechnicianQuote,
        sendChatMessage,
        markChatAsRead,
        setTyping,
        typingMap,
        counterOffer,
        acceptQuote,
        lockEscrowPayment,
        advanceBookingStatus,
        acceptTechnicianRequest,
        rejectTechnicianRequest,
        updateTechnicianProfile,
        withdrawTechnicianEarnings,
        saveEvidencePhotos,
        releasePaymentAndComplete,
        submitReview,
        raiseDispute,
        triggerSos,
        resolveSos,
        assignSosResponder,
        verifyTechnician,
        joinGroupBooking,
        markNotificationsAsRead,
        resetToDefaults,
        t: translations[language],
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
