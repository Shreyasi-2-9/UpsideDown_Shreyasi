export type Role = "citizen" | "technician" | "admin";

export type LanguageCode = "EN" | "हिं" | "म";

export type ServiceCategoryId =
  | "plumbing"
  | "electrical"
  | "ac_repair"
  | "cleaning"
  | "carpentry"
  | "painting"
  | "appliances"
  | "pest_control"
  | "garbage"
  | "bodyguard";

export type IconName =
  | "home"
  | "grid"
  | "calendar"
  | "user"
  | "search"
  | "bell"
  | "chevron"
  | "sliders"
  | "droplet"
  | "bolt"
  | "sparkles"
  | "paint"
  | "hammer"
  | "snow"
  | "shield"
  | "settings"
  | "arrow"
  | "mic"
  | "phone"
  | "sos"
  | "star"
  | "check"
  | "clock"
  | "pin"
  | "chat"
  | "lock"
  | "camera"
  | "download"
  | "print"
  | "wallet"
  | "briefcase"
  | "chart"
  | "menu"
  | "volume"
  | "close"
  | "alert"
  | "info"
  | "file"
  | "qr"
  | "filter"
  | "refresh"
  | "trash"
  | "external"
  | "users"
  | "truck"
  | "recycle"
  | "guard";

export interface ServiceCategory {
  id: ServiceCategoryId;
  name: string;
  nameHi: string;
  nameMr: string;
  description: string;
  icon: IconName;
  basePrice: number;
  duration: string;
  availableTechs: number;
  tags: string[];
}

export interface TechnicianReview {
  id: string;
  citizenName: string;
  citizenPhoto?: string;
  rating: number;
  comment: string;
  date: string;
  serviceName: string;
  workPhoto?: string;
}

export interface TechnicianProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  photo: string;
  rating: number;
  totalJobs: number;
  experienceYears: number;
  primaryService: ServiceCategoryId;
  skills: string[];
  serviceArea: string;
  startingPrice: number;
  isVerified: boolean;
  verificationStatus: "approved" | "pending" | "rejected";
  trustScore: number;
  distanceKm: number;
  etaMinutes: number;
  isOnline: boolean;
  about: string;
  languages: string[];
  certificates: {
    title: string;
    issuer: string;
    year: string;
  }[];
  portfolio: {
    title: string;
    beforePhoto: string;
    afterPhoto: string;
  }[];
  reviews: TechnicianReview[];
  dob?: string;
  gender?: string;
  address?: {
    houseDetails: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
  };
  specialisations?: string[];
  notificationPreferences?: {
    sms: boolean;
    email: boolean;
    app: boolean;
  };
  languagePreference?: string;
  profileVisibility?: string;
  lastUpdated?: string;
  bankDetails?: {
    accountNumber: string;
    ifsc: string;
    upiId: string;
    accountHolder: string;
  };
  kycDocuments?: {
    id: string;
    name: string;
    type: "aadhaar" | "certificate" | "police" | "bank" | "license";
    status: "verified" | "pending" | "rejected";
    documentNumber?: string;
    issuer?: string;
    date?: string;
    previewUrl?: string;
  }[];
}

export type BookingStatus =
  | "request_submitted"
  | "quoted"
  | "negotiating"
  | "quotation_accepted"
  | "escrow_locked"
  | "on_the_way"
  | "arrived"
  | "work_started"
  | "work_completed"
  | "payment_released"
  | "disputed"
  | "cancelled";

export interface Quotation {
  id: string;
  technicianId: string;
  technicianName: string;
  technicianRating: number;
  technicianJobs: number;
  technicianPhoto: string;
  originalPrice: number;
  currentPrice: number;
  status: "pending" | "accepted" | "rejected" | "counter_offered" | "expired";
  counterPrice?: number;
  eta: string;
  distanceKm: number;
  scopeNote: string;
  warrantyDays: number;
  label?: string;
  tagColor?: "green" | "blue" | "amber";
}

export interface ChatMessage {
  id: string;
  sender: "citizen" | "technician" | "system";
  senderName?: string;
  text: string;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
  photoUrl?: string;
}

export interface GarbageDetails {
  wasteType: string;
  volumeSize: string;
  isSegregated: boolean;
  ecoCertRequested: boolean;
  disposalFacility?: string;
  recycledKg?: number;
  vehicleType?: string;
}

export interface BodyguardRequirements {
  tier: "armed_pso" | "vip_close_protection" | "night_escort" | "event_bouncer";
  attire: "formal_suit" | "tactical_uniform" | "plainclothes";
  exMilitaryRequired: boolean;
  combatCertified: boolean;
  policeVerified: boolean;
  firstAidCertified: boolean;
  minHeight: string;
  genderPreference: "male" | "female" | "any";
  durationHours: number;
  threatLevel: "standard" | "elevated" | "high";
  emergencyBackupRequested: boolean;
  dutyScope: string;
  armsLicenseRequired?: boolean;
}

export interface Booking {
  id: string;
  serviceId: ServiceCategoryId;
  serviceName: string;
  citizenName: string;
  citizenPhone: string;
  citizenAddress: string;
  area: string;
  issueDescription: string;
  issuePhotos: string[];
  urgency: "standard" | "urgent";
  scheduledDate: string;
  scheduledTimeWindow: string;
  status: BookingStatus;
  technicianId?: string;
  technicianName?: string;
  technicianPhone?: string;
  technicianPhoto?: string;
  technicianRating?: number;
  lockedPrice: number;
  materialCharges?: number;
  platformFee: number;
  gstAmount: number;
  totalPaid: number;
  paymentMethod?: string;
  paymentRef?: string;
  createdAt: string;
  quotations: Quotation[];
  activeQuotationId?: string;
  chatMessages: ChatMessage[];
  beforeWorkPhoto?: string;
  afterWorkPhoto?: string;
  beforeWorkPhotos?: string[];
  afterWorkPhotos?: string[];
  beforeHash?: string;
  afterHash?: string;
  beforeTimestamp?: string;
  afterTimestamp?: string;
  aiVerification?: {
    confidence: number;
    verdict: string;
    checks: { title: string; passed: boolean }[];
  };
  reviewSubmitted?: boolean;
  warrantyActiveUntil?: string;
  disputeReason?: string;
  completedAt?: string;
  rejectedReason?: string;
  garbageDetails?: GarbageDetails;
  bodyguardRequirements?: BodyguardRequirements;
}

export interface GroupBooking {
  id: string;
  neighbourhood: string;
  serviceId: ServiceCategoryId;
  serviceName: string;
  discountPercentage: number;
  targetHouseholds: number;
  joinedHouseholds: { name: string; apt: string; joinedAt: string }[];
  expiresInDays: number;
  dateDeadline: string;
  basePrice: number;
  groupPrice: number;
}

export interface SOSAlert {
  id: string;
  citizenName: string;
  citizenPhone: string;
  location: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  status: "active" | "dispatched" | "resolved";
  assignedStaff?: string;
  bookingRef?: string;
  category?: string;
  description?: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  roleTarget: Role | "all";
  type: "booking" | "quotation" | "payment" | "sos" | "verification" | "review";
}

export interface AppUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: Role;
  address: string;
  city: string;
  isVerified: boolean;
  joinedDate: string;
  avatar?: string;
}
