import type { LanguageCode } from "../types";

export interface TranslationDictionary {
  brandName: string;
  tagline: string;
  getStarted: string;
  exploreServices: string;
  signIn: string;
  signUp: string;
  switchRole: string;
  rolesTitle: string;
  rolesSub: string;
  citizenRole: string;
  citizenRoleDesc: string;
  technicianRole: string;
  technicianRoleDesc: string;
  adminRole: string;
  adminRoleDesc: string;

  // Nav
  navHome: string;
  navServices: string;
  navBookings: string;
  navGroupBooking: string;
  navProfile: string;
  navSupport: string;
  navEarnings: string;
  navPassport: string;
  navOverview: string;
  navUsers: string;
  navVerification: string;
  navSos: string;
  navSettings: string;

  // Dashboard
  greetingGoodMorning: string;
  greetingAsha: string;
  locationDefault: string;
  homeCareProtect: string;
  protectSub: string;
  searchPlaceholder: string;
  popularServices: string;
  viewAll: string;
  recentBooking: string;
  preferToSpeak: string;
  callToBook: string;
  seniorAssistDesc: string;
  seniorModeToggle: string;
  sosEmergency: string;

  // Group booking
  groupPromoTitle: string;
  groupPromoEm: string;
  groupPromoSub: string;
  exploreGroupBooking: string;
  joinGroup: string;
  neighbourhoodSavings: string;

  // Request flow
  stepOf: string;
  chooseService: string;
  describeProblem: string;
  typeOrSpeak: string;
  voiceHelp: string;
  whenNeedHelp: string;
  standard: string;
  urgentFee: string;
  addPhoto: string;
  photoHelper: string;
  estimatedFrom: string;
  findExperts: string;
  escrowProtectionNotice: string;

  // Tracking & Evidence
  techOnTheWay: string;
  liveLocationNotice: string;
  evidenceVault: string;
  evidenceSub: string;
  aiProofCheck: string;
  aiProofSub: string;
  runAiProof: string;
  jobComplete: string;
  paymentReleased: string;
  reviewTechnician: string;

  // Statuses
  statusPending: string;
  statusOnTheWay: string;
  statusArrived: string;
  statusInProgress: string;
  statusCompleted: string;
  statusDisputed: string;
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  EN: {
    brandName: "HomeCare 360",
    tagline: "Trusted experts for your home needs.",
    getStarted: "Get started",
    exploreServices: "Explore services",
    signIn: "Sign in",
    signUp: "Register",
    switchRole: "Switch role",
    rolesTitle: "How will you use HomeCare?",
    rolesSub: "Choose your role. You can switch anytime in prototype mode.",
    citizenRole: "I need a service",
    citizenRoleDesc: "Book trusted experts for your home with protected escrow.",
    technicianRole: "I provide services",
    technicianRoleDesc: "Find nearby jobs, send fair quotes, and grow your income.",
    adminRole: "Platform operations",
    adminRoleDesc: "Monitor jobs, verify technicians, ensure safety and disputes.",

    navHome: "Home",
    navServices: "Services",
    navBookings: "Bookings",
    navGroupBooking: "Group Booking",
    navProfile: "Profile",
    navSupport: "Support",
    navEarnings: "Earnings",
    navPassport: "Skill Passport",
    navOverview: "Overview",
    navUsers: "Users",
    navVerification: "Verification",
    navSos: "SOS Monitor",
    navSettings: "Settings",

    greetingGoodMorning: "Good morning",
    greetingAsha: "Good morning, Asha",
    locationDefault: "Koregaon Park, Pune",
    homeCareProtect: "HomeCare Protect",
    protectSub: "Every booking is covered with 7-day warranty",
    searchPlaceholder: "What does your home need today? (Plumber, AC, Electrician...)",
    popularServices: "Popular services",
    viewAll: "View all",
    recentBooking: "Recent booking",
    preferToSpeak: "Prefer to speak?",
    callToBook: "Call to book",
    seniorAssistDesc: "Our senior assistance team can book and guide you step-by-step.",
    seniorModeToggle: "Senior Citizen Mode",
    sosEmergency: "SOS Emergency",

    groupPromoTitle: "Book together.",
    groupPromoEm: "Save up to 61%",
    groupPromoSub: "Invite neighbours and pay significantly less together for common home care.",
    exploreGroupBooking: "Explore group booking",
    joinGroup: "Join neighbourhood group",
    neighbourhoodSavings: "NEIGHBOURHOOD SAVINGS",

    stepOf: "STEP",
    chooseService: "Choose a service",
    describeProblem: "Describe your issue",
    typeOrSpeak: "Type or speak in any language",
    voiceHelp: "Voice help",
    whenNeedHelp: "When do you need help?",
    standard: "Standard",
    urgentFee: "Urgent · +₹99",
    addPhoto: "Add a photo",
    photoHelper: "Helps experts quote accurately",
    estimatedFrom: "Estimated from",
    findExperts: "Find verified experts",
    escrowProtectionNotice: "Payment protected by HomeCare escrow until you approve",

    techOnTheWay: "Technician is on the way",
    liveLocationNotice: "Live GPS location shared securely until arrival.",
    evidenceVault: "Evidence Vault",
    evidenceSub: "Before and after photos create a clear, tamper-resistant job record.",
    aiProofCheck: "AI Proof Check",
    aiProofSub: "Assistive comparison of before and after work. You make the final call.",
    runAiProof: "Run AI proof check",
    jobComplete: "Job complete & verified",
    paymentReleased: "Payment released. Your 7-day service warranty is now active.",
    reviewTechnician: "Review technician's work",

    statusPending: "Pending",
    statusOnTheWay: "On the way",
    statusArrived: "Arrived",
    statusInProgress: "In progress",
    statusCompleted: "Completed",
    statusDisputed: "Disputed",
  },

  हिं: {
    brandName: "होमकेयर 360",
    tagline: "आपके घर की ज़रूरतों के लिए विश्वसनीय विशेषज्ञ।",
    getStarted: "शुरू करें",
    exploreServices: "सेवाएं देखें",
    signIn: "लॉग इन",
    signUp: "रजिस्टर करें",
    switchRole: "भूमिका बदलें",
    rolesTitle: "आप होमकेयर का उपयोग कैसे करेंगे?",
    rolesSub: "अपनी भूमिका चुनें। आप कभी भी बदल सकते हैं।",
    citizenRole: "मुझे सेवा चाहिए",
    citizenRoleDesc: "सुरक्षित एस्क्रो के साथ अपने घर के लिए विश्वसनीय विशेषज्ञ बुक करें।",
    technicianRole: "मैं सेवा प्रदान करता हूँ",
    technicianRoleDesc: "आस-पास के काम ढूंढें, उचित कोटेशन भेजें और अपनी आय बढ़ाएं।",
    adminRole: "प्लेटफ़ॉर्म संचालन",
    adminRoleDesc: "काम की निगरानी करें, तकनीशियनों का सत्यापन करें और सुरक्षा देखें।",

    navHome: "होम",
    navServices: "सेवाएं",
    navBookings: "बुकिंग्स",
    navGroupBooking: "ग्रुप बुकिंग",
    navProfile: "प्रोफ़ाइल",
    navSupport: "सहायता",
    navEarnings: "कमाई",
    navPassport: "स्किल पासपोर्ट",
    navOverview: "अवलोकन",
    navUsers: "उपयोगकर्ता",
    navVerification: "सत्यापन",
    navSos: "एसओएस मॉनिटर",
    navSettings: "सेटिंग्स",

    greetingGoodMorning: "सुप्रभात",
    greetingAsha: "सुप्रभात, आशा",
    locationDefault: "कोरेगांव पार्क, पुणे",
    homeCareProtect: "होमकेयर सुरक्षा",
    protectSub: "प्रत्येक बुकिंग 7 दिनों की वारंटी के साथ सुरक्षित है",
    searchPlaceholder: "आज आपके घर को किसकी ज़रूरत है? (प्लंबर, एसी, इलेक्ट्रीशियन...)",
    popularServices: "लोकप्रिय सेवाएं",
    viewAll: "सभी देखें",
    recentBooking: "हाल की बुकिंग",
    preferToSpeak: "बात करना पसंद करते हैं?",
    callToBook: "कॉल करके बुक करें",
    seniorAssistDesc: "हमारी वरिष्ठ सहायता टीम आपके लिए फोन पर बुकिंग कर सकती है।",
    seniorModeToggle: "वरिष्ठ नागरिक मोड",
    sosEmergency: "एसओएस आपातकाल",

    groupPromoTitle: "साथ मिलकर बुक करें।",
    groupPromoEm: "61% तक की बचत करें",
    groupPromoSub: "पड़ोसियों को आमंत्रित करें और साथ मिलकर कम भुगतान करें।",
    exploreGroupBooking: "ग्रुप बुकिंग देखें",
    joinGroup: "पड़ोस ग्रुप से जुड़ें",
    neighbourhoodSavings: "पड़ोस बचत योजना",

    stepOf: "चरण",
    chooseService: "सेवा चुनें",
    describeProblem: "अपनी समस्या बताएं",
    typeOrSpeak: "किसी भी भाषा में टाइप करें या बोलें",
    voiceHelp: "आवाज सहायता",
    whenNeedHelp: "आपको मदद कब चाहिए?",
    standard: "मानक",
    urgentFee: "आपातकालीन · +₹99",
    addPhoto: "फ़ोटो जोड़ें",
    photoHelper: "विशेषज्ञों को सटीक मूल्य अनुमान लगाने में मदद करता है",
    estimatedFrom: "अनुमानित दर",
    findExperts: "सत्यापित विशेषज्ञ खोजें",
    escrowProtectionNotice: "भुगतान होमकेयर एस्क्रो में सुरक्षित है जब तक आप संतुष्ट न हों",

    techOnTheWay: "तकनीशियन रास्ते में है",
    liveLocationNotice: "आगमन तक लाइव जीपीएस स्थान साझा किया गया है।",
    evidenceVault: "सबूत वॉल्ट (एविडेंस)",
    evidenceSub: "पहले और बाद की तस्वीरें स्पष्ट और छेड़छाड़-रहित रिकॉर्ड बनाती हैं।",
    aiProofCheck: "एआई प्रूफ जांच",
    aiProofSub: "कार्य पूर्णता की स्मार्ट जांच। अंतिम निर्णय आपका होगा।",
    runAiProof: "एआई जांच चलाएं",
    jobComplete: "काम पूरा हुआ और सत्यापित",
    paymentReleased: "भुगतान जारी किया गया। आपकी 7-दिन की वारंटी अब सक्रिय है।",
    reviewTechnician: "तकनीशियन के काम की समीक्षा करें",

    statusPending: "लंबित",
    statusOnTheWay: "रास्ते में",
    statusArrived: "पहुंच गए",
    statusInProgress: "प्रगति पर",
    statusCompleted: "पूर्ण",
    statusDisputed: "विवादित",
  },

  म: {
    brandName: "होमकेअर 360",
    tagline: "तुमच्या घराच्या गरजांसाठी विश्वासू तज्ञ.",
    getStarted: "सुरू करा",
    exploreServices: "सेवा एक्सप्लोर करा",
    signIn: "साइन इन",
    signUp: "नोंदणी करा",
    switchRole: "भूमिका बदला",
    rolesTitle: "तुम्ही होमकेअर कसे वापराल?",
    rolesSub: "तुमची भूमिका निवडा. तुम्ही कधीही बदलू शकता.",
    citizenRole: "मला सेवा हवी आहे",
    citizenRoleDesc: "सुरक्षित एस्क्रो पेमेंटसह विश्वासू तज्ञ बुक करा.",
    technicianRole: "मी सेवा देतो",
    technicianRoleDesc: "जवळची कामे मिळवा, वाजवी दर पाठवा आणि उत्पन्न वाढवा.",
    adminRole: "प्लॅटफॉर्म व्यवस्थापन",
    adminRoleDesc: "कामे, तंत्रज्ञ पडताळणी आणि सुरक्षिततेचे निरीक्षण करा.",

    navHome: "होम",
    navServices: "सेवा",
    navBookings: "बुकिंग्ज",
    navGroupBooking: "ग्रुप बुकिंग",
    navProfile: "प्रोफाइल",
    navSupport: "मदत",
    navEarnings: "कमाई",
    navPassport: "कौशल्य पासपोर्ट",
    navOverview: "आढावा",
    navUsers: "वापरकर्ते",
    navVerification: "पडताळणी",
    navSos: "एसओएस नियंत्रण",
    navSettings: "सेटिंग्ज",

    greetingGoodMorning: "शुभ प्रभात",
    greetingAsha: "शुभ प्रभात, आशा",
    locationDefault: "कोरेगाव पार्क, पुणे",
    homeCareProtect: "होमकेअर सुरक्षा",
    protectSub: "प्रत्येक बुकिंग 7 दिवसांच्या वॉरंटीसह सुरक्षित",
    searchPlaceholder: "आज तुमच्या घरासाठी काय हवे आहे? (प्लंबर, एसी, वायरमन...)",
    popularServices: "लोकप्रिय सेवा",
    viewAll: "सर्व पहा",
    recentBooking: "अलीकडील बुकिंग",
    preferToSpeak: "बोलणे पसंत कराल?",
    callToBook: "कॉल करून बुक करा",
    seniorAssistDesc: "आमची ज्येष्ठ नागरिक सहाय्यता टीम तुमच्यासाठी बुकिंग करू शकते.",
    seniorModeToggle: "ज्येष्ठ नागरिक मोड",
    sosEmergency: "एसओएस आपत्कालीन",

    groupPromoTitle: "एकत्र बुक करा.",
    groupPromoEm: "61% पर्यंत बचत करा",
    groupPromoSub: "शेजाऱ्यांना आमंत्रित करा आणि एकत्र कमी पैसे द्या.",
    exploreGroupBooking: "ग्रुप बुकिंग पहा",
    joinGroup: "परिसर ग्रुपमध्ये सामील व्हा",
    neighbourhoodSavings: "परिसर बचत योजना",

    stepOf: "टप्पा",
    chooseService: "सेवा निवडा",
    describeProblem: "तुमची समस्या सांगा",
    typeOrSpeak: "कोणत्याही भाषेत टाइप करा किंवा बोला",
    voiceHelp: "आवाज मदत",
    whenNeedHelp: "तुम्हाला मदत कधी हवी आहे?",
    standard: "सामान्य",
    urgentFee: "तातडीचे · +₹99",
    addPhoto: "फोटो जोडा",
    photoHelper: "तज्ञांना अचूक कोटेशन देण्यास मदत होते",
    estimatedFrom: "अंदाजे दर",
    findExperts: "सत्यापित तज्ञ शोधा",
    escrowProtectionNotice: "तुम्ही काम मंजूर करेपर्यंत पेमेंट होमकेअर एस्क्रोमध्ये सुरक्षित",

    techOnTheWay: "तंत्रज्ञ रस्त्यावर आहे",
    liveLocationNotice: "येईपर्यंत थेट जीपीएस स्थान सुरक्षितपणे शेअर केले आहे.",
    evidenceVault: "पुरावा वॉल्ट",
    evidenceSub: "कामाआधीचे आणि नंतरचे फोटो पारदर्शक रेकॉर्ड तयार करतात.",
    aiProofCheck: "एआय प्रूफ तपासणी",
    aiProofSub: "कामाची अचूक तपासणी. अंतिम निर्णय तुमचाच असेल.",
    runAiProof: "एआय तपासणी करा",
    jobComplete: "काम पूर्ण आणि सत्यापित",
    paymentReleased: "पैसे हस्तांतरित केले. तुमची 7 दिवसांची वॉरंटी सुरू झाली.",
    reviewTechnician: "तंत्रज्ञांच्या कामाचे पुनरावलोकन करा",

    statusPending: "प्रलंबित",
    statusOnTheWay: "रस्त्यावर",
    statusArrived: "पोहोचले",
    statusInProgress: "सुरू आहे",
    statusCompleted: "पूर्ण",
    statusDisputed: "तक्रार नोंदवली",
  },
};
