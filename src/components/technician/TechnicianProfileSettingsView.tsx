import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";
import type { TechnicianProfile } from "../../types";

export function TechnicianProfileSettingsView() {
  const { technicians, categories, updateTechnicianProfile, setActiveScreen } = useApp();
  const tech = technicians[0]; // Ramesh Patil

  // Personal Information State
  const [name, setName] = useState(tech.name);
  const [email, setEmail] = useState(tech.email);
  const [phone, setPhone] = useState(tech.phone);
  const [dob, setDob] = useState(tech.dob || "1988-04-12");
  const [gender, setGender] = useState(tech.gender || "Male");
  const [photo, setPhoto] = useState(tech.photo);

  // Address Information State
  const [houseDetails, setHouseDetails] = useState(
    tech.address?.houseDetails || "House #14, Gurukrupa Niwas",
  );
  const [area, setArea] = useState(tech.address?.area || "Lane 4, Koregaon Park");
  const [city, setCity] = useState(tech.address?.city || "Pune");
  const [state, setState] = useState(tech.address?.state || "Maharashtra");
  const [pincode, setPincode] = useState(tech.address?.pincode || "411001");

  // Professional Information State
  const [primaryService, setPrimaryService] = useState(tech.primaryService);
  const [experienceYears, setExperienceYears] = useState(tech.experienceYears);
  const [about, setAbout] = useState(tech.about);
  const [serviceArea, setServiceArea] = useState(tech.serviceArea);
  const [isOnline, setIsOnline] = useState(tech.isOnline);
  const [specialisations, setSpecialisations] = useState<string[]>(
    tech.specialisations || [
      "Concealed Pipe Leaks",
      "Sanitary & CP Fittings",
      "Pressure Testing",
      "Geyser Plumbing",
    ],
  );
  const [newSkillInput, setNewSkillInput] = useState("");

  // Account Preferences State
  const [notifySms, setNotifySms] = useState(tech.notificationPreferences?.sms ?? true);
  const [notifyEmail, setNotifyEmail] = useState(tech.notificationPreferences?.email ?? true);
  const [notifyApp, setNotifyApp] = useState(tech.notificationPreferences?.app ?? true);
  const [languagePreference, setLanguagePreference] = useState(
    tech.languagePreference || "Marathi",
  );
  const [profileVisibility, setProfileVisibility] = useState(tech.profileVisibility || "public");

  // UI state
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (("key" in e && e.key === "Enter") || !("key" in e)) {
      e.preventDefault();
      const trimmed = newSkillInput.trim();
      if (trimmed && !specialisations.includes(trimmed)) {
        setSpecialisations([...specialisations, trimmed]);
        setNewSkillInput("");
      }
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSpecialisations(specialisations.filter((s) => s !== skillToRemove));
  };

  const handleReset = () => {
    setName(tech.name);
    setEmail(tech.email);
    setPhone(tech.phone);
    setDob(tech.dob || "1988-04-12");
    setGender(tech.gender || "Male");
    setPhoto(tech.photo);
    setHouseDetails(tech.address?.houseDetails || "House #14, Gurukrupa Niwas");
    setArea(tech.address?.area || "Lane 4, Koregaon Park");
    setCity(tech.address?.city || "Pune");
    setState(tech.address?.state || "Maharashtra");
    setPincode(tech.address?.pincode || "411001");
    setPrimaryService(tech.primaryService);
    setExperienceYears(tech.experienceYears);
    setAbout(tech.about);
    setServiceArea(tech.serviceArea);
    setIsOnline(tech.isOnline);
    setSpecialisations(tech.specialisations || ["Concealed Pipe Leaks", "Sanitary & CP Fittings"]);
    setNotifySms(tech.notificationPreferences?.sms ?? true);
    setNotifyEmail(tech.notificationPreferences?.email ?? true);
    setNotifyApp(tech.notificationPreferences?.app ?? true);
    setLanguagePreference(tech.languagePreference || "Marathi");
    setProfileVisibility(tech.profileVisibility || "public");
    setValidationError(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError("Full Name is required.");
      return;
    }
    if (!phone.trim()) {
      setValidationError("Phone number is required.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setValidationError("A valid email address is required.");
      return;
    }
    if (!pincode.trim() || pincode.length !== 6) {
      setValidationError("Please enter a valid 6-digit PIN code.");
      return;
    }

    setValidationError(null);

    const updates: Partial<TechnicianProfile> = {
      name,
      email,
      phone,
      dob,
      gender,
      photo,
      address: {
        houseDetails,
        area,
        city,
        state,
        pincode,
      },
      primaryService,
      experienceYears: Number(experienceYears),
      about,
      serviceArea,
      isOnline,
      specialisations,
      notificationPreferences: {
        sms: notifySms,
        email: notifyEmail,
        app: notifyApp,
      },
      languagePreference,
      profileVisibility,
    };

    updateTechnicianProfile(updates);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="flow-page page-pad tech-settings-view">
      {/* Top Header */}
      <div className="flow-title">
        <button
          type="button"
          className="back-btn"
          onClick={() => setActiveScreen("tech_dashboard")}
          aria-label="Back to Dashboard"
        >
          <Icon name="chevron" size={18} />
        </button>
        <div>
          <span className="section-kicker">CIVIC PROFESSIONAL PROFILE</span>
          <h1>Technician Profile Settings</h1>
          <p>
            Manage your verified personal details, residential address, trade qualifications, and
            notification preferences.
          </p>
        </div>
      </div>

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="requests-success-banner mt-4">
          <Icon name="check" size={18} />
          <span>
            Profile settings successfully saved and synced with your Digital Skill Passport!
          </span>
          <button type="button" onClick={() => setSavedSuccess(false)} className="alert-dismiss">
            ×
          </button>
        </div>
      )}

      {/* Validation Error Alert */}
      {validationError && (
        <div className="upload-alert-box error mt-4">
          <Icon name="alert" size={16} />
          <span>{validationError}</span>
          <button type="button" onClick={() => setValidationError(null)} className="alert-dismiss">
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="settings-form-layout mt-6">
        {/* SECTION A: PERSONAL INFORMATION */}
        <section className="card p-6 settings-section">
          <div className="section-head flex items-center justify-between border-b border-outline pb-3">
            <div className="flex items-center gap-2">
              <span className="section-number-pill">A</span>
              <h2 className="text-base font-bold text-midnight m-0">Personal Information</h2>
            </div>
            <span className="text-xs text-muted">Aadhaar & Police KYC Verified</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
            {/* Photo Preview & Edit */}
            <div className="flex flex-col items-center justify-center p-4 bg-paper rounded-2xl border border-outline/70 text-center">
              <div className="relative">
                <img
                  src={photo}
                  alt={name}
                  className="w-28 h-28 rounded-2xl object-cover border-2 border-violet shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-1 shadow">
                  <Icon name="check" size={13} />
                </span>
              </div>
              <span className="text-xs font-bold text-midnight mt-3 block">Profile Photo</span>
              <div className="w-full mt-2">
                <input
                  type="text"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  placeholder="Photo image URL"
                  className="text-xs p-2 border rounded-lg w-full text-center"
                />
              </div>
              <small className="text-[11px] text-muted mt-1">
                Direct link or civic credential avatar
              </small>
            </div>

            {/* Personal Details Fields */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group sm:col-span-2">
                <label className="text-xs font-bold text-midnight">Full Legal Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh S. Patil"
                  required
                  className="w-full text-sm p-2.5 border rounded-lg mt-1"
                />
              </div>

              <div className="form-group">
                <label className="text-xs font-bold text-midnight">Mobile Phone Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98230 45671"
                  required
                  className="w-full text-sm p-2.5 border rounded-lg mt-1"
                />
              </div>

              <div className="form-group">
                <label className="text-xs font-bold text-midnight">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh.patil@homecare360.in"
                  required
                  className="w-full text-sm p-2.5 border rounded-lg mt-1"
                />
              </div>

              <div className="form-group">
                <label className="text-xs font-bold text-midnight">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full text-sm p-2.5 border rounded-lg mt-1"
                />
              </div>

              <div className="form-group">
                <label className="text-xs font-bold text-midnight">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full text-sm p-2.5 border rounded-lg mt-1"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION B: RESIDENTIAL & BASE ADDRESS */}
        <section className="card p-6 settings-section mt-6">
          <div className="section-head flex items-center justify-between border-b border-outline pb-3">
            <div className="flex items-center gap-2">
              <span className="section-number-pill">B</span>
              <h2 className="text-base font-bold text-midnight m-0">Address & Operational Base</h2>
            </div>
            <span className="text-xs text-muted">Used for GPS matching & distance radius</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
            <div className="form-group sm:col-span-2">
              <label className="text-xs font-bold text-midnight">
                House / Flat / Building Details
              </label>
              <input
                type="text"
                value={houseDetails}
                onChange={(e) => setHouseDetails(e.target.value)}
                placeholder="House #14, Gurukrupa Niwas"
                className="w-full text-sm p-2.5 border rounded-lg mt-1"
              />
            </div>

            <div className="form-group">
              <label className="text-xs font-bold text-midnight">Street / Area / Locality</label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Lane 4, Koregaon Park"
                className="w-full text-sm p-2.5 border rounded-lg mt-1"
              />
            </div>

            <div className="form-group">
              <label className="text-xs font-bold text-midnight">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Pune"
                className="w-full text-sm p-2.5 border rounded-lg mt-1"
              />
            </div>

            <div className="form-group">
              <label className="text-xs font-bold text-midnight">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Maharashtra"
                className="w-full text-sm p-2.5 border rounded-lg mt-1"
              />
            </div>

            <div className="form-group">
              <label className="text-xs font-bold text-midnight">PIN Code *</label>
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="411001"
                required
                className="w-full text-sm p-2.5 border rounded-lg mt-1"
              />
            </div>
          </div>
        </section>

        {/* SECTION C: PROFESSIONAL TRADE INFORMATION */}
        <section className="card p-6 settings-section mt-6">
          <div className="section-head flex items-center justify-between border-b border-outline pb-3">
            <div className="flex items-center gap-2">
              <span className="section-number-pill">C</span>
              <h2 className="text-base font-bold text-midnight m-0">
                Professional Trade & Qualifications
              </h2>
            </div>
            <span className="text-xs text-violet font-bold">
              Maharashtra Vocational Skill Registry
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            <div className="form-group">
              <label className="text-xs font-bold text-midnight">
                Primary Trade / Service Category *
              </label>
              <select
                value={primaryService}
                onChange={(e) => setPrimaryService(e.target.value as any)}
                className="w-full text-sm p-2.5 border rounded-lg mt-1"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="text-xs font-bold text-midnight">
                Years of Professional Experience *
              </label>
              <input
                type="number"
                min={1}
                max={40}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                required
                className="w-full text-sm p-2.5 border rounded-lg mt-1"
              />
            </div>

            <div className="form-group sm:col-span-2">
              <label className="text-xs font-bold text-midnight">
                Service Areas & Coverage (Zones)
              </label>
              <input
                type="text"
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
                placeholder="Koregaon Park, Kalyani Nagar, Viman Nagar, Pune"
                className="w-full text-sm p-2.5 border rounded-lg mt-1"
              />
              <small className="text-muted block mt-1">
                Requests within a 4 km radius are prioritized
              </small>
            </div>

            <div className="form-group sm:col-span-2">
              <label className="text-xs font-bold text-midnight">
                Specialised Skills & Capabilities
              </label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="Type a skill and press Enter or click Add"
                  className="flex-1 text-sm p-2.5 border rounded-lg"
                />
                <Button
                  type="button"
                  kind="secondary"
                  size="sm"
                  onClick={(e) => handleAddSkill(e as any)}
                >
                  + Add Skill
                </Button>
              </div>

              {/* Specialisations Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {specialisations.map((skill) => (
                  <span key={skill} className="skill-pill-tag">
                    <span className="check-dot">✓</span> {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="remove-skill-cross"
                      title="Remove skill"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group sm:col-span-2">
              <label className="text-xs font-bold text-midnight">
                Professional Bio & About Summary
              </label>
              <textarea
                rows={3}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Briefly describe your craftsmanship, tools used, and guarantee..."
                className="w-full text-sm p-2.5 border rounded-lg mt-1"
              />
            </div>

            {/* Online / Offline Availability Toggle */}
            <div className="form-group sm:col-span-2 p-4 bg-paper rounded-xl border border-outline flex items-center justify-between">
              <div>
                <strong className="text-sm text-midnight block">Duty Availability Status</strong>
                <small className="text-xs text-muted">
                  {isOnline
                    ? "You are Online and receiving real-time job requests."
                    : "You are Offline. No new incoming job dispatches."}
                </small>
              </div>
              <div className={`online-toggle ${isOnline ? "online" : "offline"}`}>
                <span className="online-indicator-dot" />
                <span className="text-xs font-bold">{isOnline ? "Online" : "Offline"}</span>
                <button
                  type="button"
                  className="toggle-pill"
                  onClick={() => setIsOnline(!isOnline)}
                  aria-label="Toggle availability"
                >
                  <span className="toggle-circle" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION D: ACCOUNT & NOTIFICATION PREFERENCES */}
        <section className="card p-6 settings-section mt-6">
          <div className="section-head flex items-center justify-between border-b border-outline pb-3">
            <div className="flex items-center gap-2">
              <span className="section-number-pill">D</span>
              <h2 className="text-base font-bold text-midnight m-0">
                Account & Notification Preferences
              </h2>
            </div>
            <span className="text-xs text-muted">Manage communication alerts</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5">
            {/* Notification checkboxes */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-midnight block">
                Dispatch & Settlement Alerts
              </span>
              <label className="flex items-center gap-3 p-2.5 bg-paper rounded-lg border border-outline/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifySms}
                  onChange={(e) => setNotifySms(e.target.checked)}
                  className="w-4 h-4 rounded text-violet"
                />
                <div>
                  <span className="text-sm font-semibold text-midnight block">SMS Alerts</span>
                  <small className="text-xs text-muted">
                    Instant SMS when a nearby homeowner requests service
                  </small>
                </div>
              </label>

              <label className="flex items-center gap-3 p-2.5 bg-paper rounded-lg border border-outline/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="w-4 h-4 rounded text-violet"
                />
                <div>
                  <span className="text-sm font-semibold text-midnight block">
                    Email Invoices & Statements
                  </span>
                  <small className="text-xs text-muted">
                    Weekly tax invoices and bank escrow settlement receipts
                  </small>
                </div>
              </label>

              <label className="flex items-center gap-3 p-2.5 bg-paper rounded-lg border border-outline/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyApp}
                  onChange={(e) => setNotifyApp(e.target.checked)}
                  className="w-4 h-4 rounded text-violet"
                />
                <div>
                  <span className="text-sm font-semibold text-midnight block">
                    In-App Push Notifications
                  </span>
                  <small className="text-xs text-muted">
                    Customer chat messages, ETA updates, and escrow releases
                  </small>
                </div>
              </label>
            </div>

            {/* Language & Visibility */}
            <div className="space-y-4">
              <div className="form-group">
                <label className="text-xs font-bold text-midnight">
                  Preferred Working Language
                </label>
                <select
                  value={languagePreference}
                  onChange={(e) => setLanguagePreference(e.target.value)}
                  className="w-full text-sm p-2.5 border rounded-lg mt-1"
                >
                  <option value="Marathi">Marathi (मराठी)</option>
                  <option value="Hindi">Hindi (हिन्दी)</option>
                  <option value="English">English</option>
                </select>
                <small className="text-muted block mt-1">
                  Interface guidance & voice assistant preference
                </small>
              </div>

              <div className="form-group">
                <label className="text-xs font-bold text-midnight">Public Profile Visibility</label>
                <select
                  value={profileVisibility}
                  onChange={(e) => setProfileVisibility(e.target.value)}
                  className="w-full text-sm p-2.5 border rounded-lg mt-1"
                >
                  <option value="public">Public on Civic Skill Registry (Recommended)</option>
                  <option value="direct">Direct Booking Only (Verified Residents)</option>
                  <option value="private">Hidden / Inactive</option>
                </select>
                <small className="text-muted block mt-1">
                  Controls visibility on Skill Passport QR scans
                </small>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="settings-footer-actions card p-5 mt-6 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Button type="button" kind="secondary" onClick={handleReset}>
              Cancel & Reset
            </Button>
            <Button
              type="button"
              kind="secondary"
              icon="shield"
              onClick={() => setActiveScreen("tech_passport")}
            >
              View Skill Passport
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" kind="primary" icon="check" size="lg">
              Save Profile Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
