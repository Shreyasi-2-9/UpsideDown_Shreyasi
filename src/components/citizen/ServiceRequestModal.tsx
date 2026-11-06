import { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";
import type { ServiceCategoryId, GarbageDetails, BodyguardRequirements } from "../../types";
import { processAndStoreImage, validateImageFile } from "../../utils/imageStorage";

export function ServiceRequestModal() {
  const {
    isServiceRequestOpen,
    setIsServiceRequestOpen,
    categories,
    selectedCategoryId,
    createBooking,
    setActiveScreen,
    currentUser,
    t,
  } = useApp();

  const [step, setStep] = useState(0);
  const [selectedServiceId, setSelectedServiceId] = useState<ServiceCategoryId>(
    (selectedCategoryId as ServiceCategoryId) || "plumbing",
  );

  useEffect(() => {
    if (selectedCategoryId) {
      setSelectedServiceId(selectedCategoryId as ServiceCategoryId);
      if (selectedCategoryId === "garbage") {
        setIssueDescription(
          "4 bags of renovation tile debris and old electronics needing pickup with tipper truck.",
        );
      } else if (selectedCategoryId === "bodyguard") {
        setIssueDescription(
          "Requirement of licensed armed personal security officer (PSO) for executive airport transit and VIP protection.",
        );
      }
    }
  }, [selectedCategoryId]);

  const [issueDescription, setIssueDescription] = useState(
    "The drain pipe under my kitchen sink is leaking whenever water runs.",
  );
  const [isListening, setIsListening] = useState(false);
  const [photos, setPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  ]);
  const [address, setAddress] = useState(currentUser.address);
  const [urgency, setUrgency] = useState<"standard" | "urgent">("standard");
  const [selectedDate, setSelectedDate] = useState("Tomorrow (22 Jun)");
  const [selectedTime, setSelectedTime] = useState("2:00 PM – 4:00 PM");
  const [instructions, setInstructions] = useState(
    "Please ring the doorbell twice. Society parking is available near Tower B.",
  );

  // Garbage Specialized States
  const [wasteType, setWasteType] = useState<string>("renovation");
  const [wasteVolume, setWasteVolume] = useState<"light" | "medium" | "bulk" | "dumpster">(
    "medium",
  );
  const [isSegregated, setIsSegregated] = useState<boolean>(true);
  const [ecoCertRequested, setEcoCertRequested] = useState<boolean>(true);

  // Bodyguard Requirements Specialized States
  const [guardTier, setGuardTier] = useState<
    "armed_pso" | "vip_close_protection" | "night_escort" | "event_bouncer"
  >("armed_pso");
  const [guardAttire, setGuardAttire] = useState<
    "formal_suit" | "tactical_uniform" | "plainclothes"
  >("formal_suit");
  const [exMilitaryRequired, setExMilitaryRequired] = useState<boolean>(true);
  const [combatCertified, setCombatCertified] = useState<boolean>(true);
  const [policeVerified, setPoliceVerified] = useState<boolean>(true);
  const [firstAidCertified, setFirstAidCertified] = useState<boolean>(true);
  const [minHeight, setMinHeight] = useState<string>("6'0\" (183 cm)");
  const [genderPreference, setGenderPreference] = useState<"any" | "male" | "female">("male");
  const [durationHours, setDurationHours] = useState<number>(4);
  const [threatLevel, setThreatLevel] = useState<"standard" | "elevated" | "high">("standard");
  const [emergencyBackup, setEmergencyBackup] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  if (!isServiceRequestOpen) return null;

  const currentCategory = categories.find((c) => c.id === selectedServiceId) || categories[0];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);

    // Validate all selected files
    for (const file of files) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setUploadError(validation.error || "Unsupported file format");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const storedRecords = await Promise.all(files.map((file) => processAndStoreImage(file)));
      const newUrls = storedRecords.map((r) => r.dataUrl);
      setPhotos((prev) => [...prev, ...newUrls]);
      setUploadSuccess(
        `Successfully attached ${files.length} photo${files.length > 1 ? "s" : ""} from your device!`,
      );
      setTimeout(() => setUploadSuccess(null), 3500);
    } catch (err: any) {
      setUploadError(err.message || "Failed to process photo upload. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const getCalculatedPrice = () => {
    let price = currentCategory.basePrice;
    if (selectedServiceId === "garbage") {
      const volumePrices = { light: 99, medium: 180, bulk: 450, dumpster: 890 };
      price = volumePrices[wasteVolume] - (isSegregated ? 20 : 0);
    } else if (selectedServiceId === "bodyguard") {
      const tierRates = {
        armed_pso: 300,
        vip_close_protection: 250,
        night_escort: 200,
        event_bouncer: 180,
      };
      price = tierRates[guardTier] * durationHours;
    }
    if (urgency === "urgent") price += 99;
    return Math.max(price, 50);
  };

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      // Calculate dynamic metadata
      const lockedAmount = getCalculatedPrice();
      let serviceTitle = `${currentCategory.name} · Service Request`;
      let garbData: GarbageDetails | undefined = undefined;
      let bgData: BodyguardRequirements | undefined = undefined;

      if (selectedServiceId === "garbage") {
        const wasteLabels: Record<string, string> = {
          renovation: "Bulk Debris & Rubble",
          household: "Household Daily Waste",
          ewaste: "E-Waste & Appliances",
          garden: "Garden Foliage",
          furniture: "Old Furniture & Bulky",
          hazardous: "Sanitary / Hazardous",
        };
        serviceTitle = `Garbage & Waste · ${wasteLabels[wasteType] || "Waste"} Pickup`;
        garbData = {
          wasteType: wasteLabels[wasteType] || "General Waste",
          volumeSize:
            wasteVolume === "light"
              ? "Light (<15kg)"
              : wasteVolume === "medium"
                ? "Medium (~40kg)"
                : wasteVolume === "bulk"
                  ? "Bulk Tempo (>150kg)"
                  : "Dumpster (>500kg)",
          isSegregated,
          ecoCertRequested,
          disposalFacility: "PMC Municipal Bio-Processing & E-Waste Hub, Hadapsar",
          vehicleType:
            wasteVolume === "bulk" || wasteVolume === "dumpster"
              ? "Commercial Open Tempo #MH12-TR-9941"
              : "Green Mini-Tipper #MH12-TR-4421",
        };
      } else if (selectedServiceId === "bodyguard") {
        const tierLabels: Record<string, string> = {
          armed_pso: "Armed Close Protection (PSO)",
          vip_close_protection: "VIP Executive Protection (CPO)",
          night_escort: "Safe Night Commute Escort",
          event_bouncer: "Event & Venue Security",
        };
        serviceTitle = `Bodyguard · ${tierLabels[guardTier]}`;
        bgData = {
          tier: guardTier,
          attire: guardAttire,
          exMilitaryRequired,
          combatCertified,
          policeVerified,
          firstAidCertified,
          minHeight,
          genderPreference,
          durationHours,
          threatLevel,
          emergencyBackupRequested: emergencyBackup,
          dutyScope: issueDescription || "Executive transit & close protection escort",
          armsLicenseRequired: guardTier === "armed_pso",
        };
      }

      // Submit
      createBooking({
        serviceId: selectedServiceId,
        serviceName: serviceTitle,
        issueDescription,
        issuePhotos: photos,
        urgency,
        scheduledDate: selectedDate,
        scheduledTimeWindow: selectedTime,
        citizenAddress: address,
        lockedPrice: lockedAmount,
        garbageDetails: garbData,
        bodyguardRequirements: bgData,
      });
      setIsServiceRequestOpen(false);
      setStep(0);
      setActiveScreen("offers");
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleAddSamplePhoto = () => {
    setPhotos([
      ...photos,
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const stepTitles = [
    "Select Service",
    "Describe Issue",
    "Upload Photos",
    "Address",
    "Date & Time",
    "Instructions",
    "Review Request",
    "Confirm & Send",
  ];

  return (
    <div className="modal-overlay" onClick={() => setIsServiceRequestOpen(false)}>
      <div className="modal-card request-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="request-modal-header">
          <div>
            <span className="step-indicator">
              STEP {step + 1} OF 8 · {stepTitles[step]}
            </span>
            <h2>Book Verified Expert</h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={() => setIsServiceRequestOpen(false)}
            aria-label="Close modal"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="request-progress-bar">
          {stepTitles.map((_, i) => (
            <div key={i} className={`prog-dot ${i < step ? "done" : i === step ? "active" : ""}`} />
          ))}
        </div>

        <div className="request-modal-body">
          {/* STEP 1: Select Service */}
          {step === 0 && (
            <div className="wizard-step">
              <h3>Which service do you require?</h3>
              <p className="wizard-sub">Choose from verified civic trades in Pune</p>
              <div className="service-picker-grid">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`picker-btn ${selectedServiceId === cat.id ? "selected" : ""}`}
                    onClick={() => setSelectedServiceId(cat.id)}
                  >
                    <Icon name={cat.icon} size={28} />
                    <span className="picker-name">{cat.name}</span>
                    <span className="picker-price">From ₹{cat.basePrice}</span>
                    {selectedServiceId === cat.id && (
                      <span className="check-badge">
                        <Icon name="check" size={12} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Describe Issue + Voice Note OR Specialized Config */}
          {step === 1 && (
            <div className="wizard-step">
              {selectedServiceId === "garbage" ? (
                <div className="specialized-config-pane garbage-config">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3>Garbage & Waste Disposal Specifications</h3>
                      <p className="wizard-sub">
                        Specify waste category, volume load, and segregation details
                      </p>
                    </div>
                    <span className="civic-badge-pill">
                      <Icon name="truck" size={14} /> PMC Municipal Fleet
                    </span>
                  </div>

                  {/* Waste Classification */}
                  <label className="field-section-title">Select Waste Classification:</label>
                  <div className="options-pill-grid mb-4">
                    {[
                      { id: "renovation", label: "Debris & Rubble", sub: "Tiles, plaster, cement" },
                      { id: "household", label: "Daily Household", sub: "Food & dry packing" },
                      { id: "ewaste", label: "E-Waste / Scrap", sub: "Appliances, wires, PCs" },
                      { id: "garden", label: "Garden Foliage", sub: "Leaves, tree prunings" },
                      { id: "furniture", label: "Old Furniture", sub: "Wood, sofa, mattress" },
                      {
                        id: "hazardous",
                        label: "Sanitary / Glass",
                        sub: "Blades, medicine, paint",
                      },
                    ].map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        className={`config-choice-btn ${wasteType === w.id ? "active" : ""}`}
                        onClick={() => setWasteType(w.id)}
                      >
                        <b>{w.label}</b>
                        <small>{w.sub}</small>
                      </button>
                    ))}
                  </div>

                  {/* Volume & Vehicle Dispatch */}
                  <label className="field-section-title">
                    Estimated Volume & Vehicle Dispatch:
                  </label>
                  <div className="volume-selection-cards mb-4">
                    {[
                      {
                        id: "light",
                        title: "Light Pickup",
                        weight: "<15 kg (1-2 bags)",
                        rate: 99,
                        vehicle: "Mini Tipper",
                      },
                      {
                        id: "medium",
                        title: "Standard Load",
                        weight: "~40 kg (3-6 bags)",
                        rate: 180,
                        vehicle: "Heavy Tipper",
                      },
                      {
                        id: "bulk",
                        title: "Bulk Rubble",
                        weight: ">150 kg (Debris)",
                        rate: 450,
                        vehicle: "Commercial Open Tempo",
                      },
                      {
                        id: "dumpster",
                        title: "Society Dumpster",
                        weight: ">500 kg (Full clearance)",
                        rate: 890,
                        vehicle: "Municipal Dump Truck",
                      },
                    ].map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        className={`volume-choice-card ${wasteVolume === v.id ? "active" : ""}`}
                        onClick={() => setWasteVolume(v.id as any)}
                      >
                        <div className="vol-top">
                          <strong>{v.title}</strong>
                          <span className="vol-rate">₹{v.rate}</span>
                        </div>
                        <span className="vol-weight">{v.weight}</span>
                        <small className="vol-veh">
                          <Icon name="truck" size={12} /> {v.vehicle}
                        </small>
                      </button>
                    ))}
                  </div>

                  {/* Segregation & Eco Certificate */}
                  <div className="eco-toggle-box mb-4">
                    <label className="eco-checkbox-row">
                      <input
                        type="checkbox"
                        checked={isSegregated}
                        onChange={(e) => setIsSegregated(e.target.checked)}
                      />
                      <div>
                        <b>Waste is pre-segregated (Wet organic & dry recyclable separated)</b>
                        <p>Qualifies for ₹20 Green Civic Rebate on this booking!</p>
                      </div>
                      <span className="rebate-pill">SAVE ₹20</span>
                    </label>

                    <label className="eco-checkbox-row mt-2">
                      <input
                        type="checkbox"
                        checked={ecoCertRequested}
                        onChange={(e) => setEcoCertRequested(e.target.checked)}
                      />
                      <div>
                        <b>Issue Municipal Eco-Disposal & Recycling Compliance Certificate</b>
                        <p>
                          Provides a tamper-resistant SHA-256 certificate in your Evidence Vault
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="description-input-box">
                    <textarea
                      rows={2}
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                      placeholder="Add any specific pickup details (e.g. 2nd floor, elevator available)..."
                    />
                  </div>
                </div>
              ) : selectedServiceId === "bodyguard" ? (
                <div className="specialized-config-pane bodyguard-config">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3>Bodyguard & Security Officer Requirements</h3>
                      <p className="wizard-sub">
                        Define exact security qualifications, armed status, and duty scope
                      </p>
                    </div>
                    <span className="civic-badge-pill armed">
                      <Icon name="guard" size={14} /> PSARA Grade-I Certified
                    </span>
                  </div>

                  {/* Protection Tier */}
                  <label className="field-section-title">Select Security Protection Tier:</label>
                  <div className="guard-tier-cards-grid mb-4">
                    {[
                      {
                        id: "armed_pso",
                        title: "Armed PSO (Personal Security)",
                        desc: "Concealed firearm carry (MHA Form-IV), VIP escort",
                        rate: 300,
                        icon: "shield",
                      },
                      {
                        id: "vip_close_protection",
                        title: "VIP Close Protection (CPO)",
                        desc: "Executive unarmed combat & martial arts specialist",
                        rate: 250,
                        icon: "user",
                      },
                      {
                        id: "night_escort",
                        title: "Night Commute / Senior Escort",
                        desc: "Safe transit for solo women & elderly citizens",
                        rate: 200,
                        icon: "clock",
                      },
                      {
                        id: "event_bouncer",
                        title: "Event / Venue Security Guard",
                        desc: "Access control, deterrent presence & crowd safety",
                        rate: 180,
                        icon: "users",
                      },
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        className={`guard-tier-btn ${guardTier === tier.id ? "active" : ""}`}
                        onClick={() => setGuardTier(tier.id as any)}
                      >
                        <div className="tier-header">
                          <Icon name={tier.icon as any} size={18} />
                          <strong>{tier.title}</strong>
                          <span className="tier-rate">₹{tier.rate}/hr</span>
                        </div>
                        <p>{tier.desc}</p>
                      </button>
                    ))}
                  </div>

                  {/* Specific Bodyguard Requirements Checklist */}
                  <label className="field-section-title">
                    Strict Personnel Requirements (Toggle Mandatory Standards):
                  </label>
                  <div className="requirements-checklist-grid mb-4">
                    <button
                      type="button"
                      className={`req-toggle-chip ${exMilitaryRequired ? "checked" : ""}`}
                      onClick={() => setExMilitaryRequired(!exMilitaryRequired)}
                    >
                      <Icon name={exMilitaryRequired ? "check" : "close"} size={13} />
                      <span>Ex-Military / Para SF / NSG Commando Background</span>
                    </button>
                    <button
                      type="button"
                      className={`req-toggle-chip ${combatCertified ? "checked" : ""}`}
                      onClick={() => setCombatCertified(!combatCertified)}
                    >
                      <Icon name={combatCertified ? "check" : "close"} size={13} />
                      <span>Black Belt Martial Arts / Krav Maga Combat Certified</span>
                    </button>
                    <button
                      type="button"
                      className={`req-toggle-chip ${policeVerified ? "checked" : ""}`}
                      onClick={() => setPoliceVerified(!policeVerified)}
                    >
                      <Icon name={policeVerified ? "check" : "close"} size={13} />
                      <span>100% Police Verification Record (PVR Clear)</span>
                    </button>
                    <button
                      type="button"
                      className={`req-toggle-chip ${firstAidCertified ? "checked" : ""}`}
                      onClick={() => setFirstAidCertified(!firstAidCertified)}
                    >
                      <Icon name={firstAidCertified ? "check" : "close"} size={13} />
                      <span>Tactical Emergency First Aid & CPR Certified</span>
                    </button>
                  </div>

                  {/* Guard Specs Row: Height, Gender, Attire, Duration */}
                  <div className="guard-specs-row mb-4">
                    <div className="spec-col">
                      <label>Dress Code / Attire:</label>
                      <select
                        value={guardAttire}
                        onChange={(e) => setGuardAttire(e.target.value as any)}
                      >
                        <option value="formal_suit">Black Business Suit & Earpiece</option>
                        <option value="tactical_uniform">Tactical Commando Black</option>
                        <option value="plainclothes">Civilian Plainclothes (Discreet)</option>
                      </select>
                    </div>

                    <div className="spec-col">
                      <label>Minimum Height:</label>
                      <select value={minHeight} onChange={(e) => setMinHeight(e.target.value)}>
                        <option value="5'10&quot; (178 cm)">5'10" (178 cm)+</option>
                        <option value="6'0&quot; (183 cm)">6'0" (183 cm)+ [Command]</option>
                        <option value="6'2&quot; (188 cm)">6'2" (188 cm)+ [Elite]</option>
                      </select>
                    </div>

                    <div className="spec-col">
                      <label>Gender Preference:</label>
                      <select
                        value={genderPreference}
                        onChange={(e) => setGenderPreference(e.target.value as any)}
                      >
                        <option value="male">Male Officer</option>
                        <option value="female">Female Officer</option>
                        <option value="any">No Preference</option>
                      </select>
                    </div>

                    <div className="spec-col">
                      <label>Duty Duration ({durationHours} hrs):</label>
                      <input
                        type="range"
                        min="2"
                        max="16"
                        step="2"
                        value={durationHours}
                        onChange={(e) => setDurationHours(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  {/* Emergency Protocol */}
                  <div className="emergency-protocol-card">
                    <Icon name="shield" size={20} />
                    <div>
                      <b>Satellite Guardian Panic Link & Armed Backup</b>
                      <p>
                        Active live telemetry link between your phone, bodyguard, and central armed
                        rapid-response unit.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h3>Describe what needs to be fixed</h3>
                  <p className="wizard-sub">You can type or speak in English, Hindi, or Marathi</p>

                  <div className="description-input-box">
                    <textarea
                      rows={4}
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                      placeholder="Tell us what is broken, dripping, making sound, or needs replacement..."
                      aria-label="Problem description"
                    />

                    <div className="speech-mic-row">
                      <button
                        type="button"
                        className={`mic-btn ${isListening ? "listening" : ""}`}
                        onClick={() => setIsListening(!isListening)}
                      >
                        <Icon name={isListening ? "close" : "mic"} size={16} />
                        <span>
                          {isListening ? "Listening (Tap to stop)..." : "Speak to describe"}
                        </span>
                      </button>
                      <span className="char-count">{issueDescription.length} chars</span>
                    </div>
                  </div>

                  <div className="ai-detected-pill">
                    <Icon name="check" size={16} />
                    <span>
                      Service Category: <b>{currentCategory.name} · Diagnostic & Work Request</b>
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 3: Upload Photographs */}
          {step === 2 && (
            <div className="wizard-step">
              <h3>Upload Issue Photographs</h3>
              <p className="wizard-sub">
                Attach photos of the issue from your phone or computer for accurate quoting.
              </p>

              {/* Hidden file input for device photo selection */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                multiple
                style={{ display: "none" }}
                onChange={handleFileSelect}
                disabled={isUploading}
              />

              {uploadError && (
                <div className="upload-alert-box error mb-3">
                  <Icon name="alert" size={16} />
                  <span>{uploadError}</span>
                  <button
                    type="button"
                    onClick={() => setUploadError(null)}
                    className="alert-dismiss"
                    aria-label="Dismiss error"
                  >
                    ×
                  </button>
                </div>
              )}

              {uploadSuccess && (
                <div className="upload-alert-box success mb-3">
                  <Icon name="check" size={16} />
                  <span>{uploadSuccess}</span>
                </div>
              )}

              <div className="photos-preview-gallery">
                {photos.map((url, idx) => (
                  <div key={idx} className="photo-thumb-wrap">
                    <img src={url} alt={`Issue photo ${idx + 1}`} />
                    <button
                      type="button"
                      className="remove-photo-pill"
                      onClick={() => handleRemovePhoto(idx)}
                      title="Remove photo"
                      aria-label={`Remove photo ${idx + 1}`}
                    >
                      <Icon name="trash" size={14} />
                    </button>
                    <span className="photo-index-badge">#{idx + 1}</span>
                  </div>
                ))}

                <button
                  type="button"
                  className={`add-photo-btn ${isUploading ? "uploading-active" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <span className="upload-spinner" />
                      <span>Processing...</span>
                      <small>Encrypting image</small>
                    </>
                  ) : (
                    <>
                      <Icon name="camera" size={26} />
                      <span>+ Select from Device</span>
                      <small>JPG, PNG, WEBP up to 10MB</small>
                    </>
                  )}
                </button>
              </div>

              <div className="evidence-vault-notice">
                <Icon name="shield" size={16} />
                <small>
                  Photos will be cryptographically hashed with SHA-256 and stored in your Evidence
                  Vault.
                </small>
              </div>
            </div>
          )}

          {/* STEP 4: Service Address */}
          {step === 3 && (
            <div className="wizard-step">
              <h3>Select Service Address</h3>
              <p className="wizard-sub">Where should the technician arrive?</p>

              <div className="saved-addresses-list">
                <label className="address-card selected">
                  <input type="radio" name="addr" defaultChecked />
                  <div>
                    <strong>Home (Primary)</strong>
                    <p>{currentUser.address}</p>
                    <small>Koregaon Park, Pune · 411001</small>
                  </div>
                </label>

                <label className="address-card">
                  <input type="radio" name="addr" />
                  <div>
                    <strong>Parents' House</strong>
                    <p>Bungalow 14, Lane 4, Kalyani Nagar, Pune</p>
                  </div>
                </label>
              </div>

              <div className="custom-address-field">
                <label>Or edit specific flat/landmark details:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat number, building, landmark"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Date and Time */}
          {step === 4 && (
            <div className="wizard-step">
              <h3>Select Preferred Date & Arrival Window</h3>
              <p className="wizard-sub">Verified experts arrive within your chosen 2-hour slot</p>

              <div className="date-selection-row">
                {["Today\n21 Jun", "Tomorrow\n22 Jun", "Mon\n23 Jun", "Tue\n24 Jun"].map((d) => {
                  const label = d.replace("\n", " ");
                  return (
                    <button
                      key={d}
                      type="button"
                      className={`date-chip ${selectedDate.includes(d.split("\n")[1]) ? "active" : ""}`}
                      onClick={() => setSelectedDate(label)}
                    >
                      <span>{d.split("\n")[0]}</span>
                      <b>{d.split("\n")[1]}</b>
                    </button>
                  );
                })}
              </div>

              <div className="time-slots-grid">
                {[
                  "9:00 AM – 11:00 AM",
                  "11:00 AM – 1:00 PM",
                  "2:00 PM – 4:00 PM",
                  "4:00 PM – 6:00 PM",
                  "6:00 PM – 8:00 PM",
                ].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={`time-chip ${selectedTime === slot ? "active" : ""}`}
                    onClick={() => setSelectedTime(slot)}
                  >
                    <Icon name="clock" size={15} />
                    <span>{slot}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Additional Instructions & Urgency */}
          {step === 5 && (
            <div className="wizard-step">
              <h3>Urgency & Instructions</h3>
              <p className="wizard-sub">Choose visit priority and entry details</p>

              <div className="urgency-toggle-card">
                <button
                  type="button"
                  className={`urgency-choice ${urgency === "standard" ? "active" : ""}`}
                  onClick={() => setUrgency("standard")}
                >
                  <strong>Standard Visit</strong>
                  <p>Guaranteed arrival within scheduled window</p>
                  <span>Regular Rate</span>
                </button>

                <button
                  type="button"
                  className={`urgency-choice urgent ${urgency === "urgent" ? "active" : ""}`}
                  onClick={() => setUrgency("urgent")}
                >
                  <div className="urgent-badge-icon">
                    <Icon name="bolt" size={16} />
                    <strong>Priority Rapid (+₹99)</strong>
                  </div>
                  <p>Technician dispatched immediately within 30 mins</p>
                  <span>Fastest response</span>
                </button>
              </div>

              <div className="form-group mt-4">
                <label>Special Instructions for Technician</label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Gate code, pet at home, parking notes..."
                />
              </div>
            </div>
          )}

          {/* STEP 7: Review Request */}
          {step === 6 && (
            <div className="wizard-step">
              <h3>Review Service Request</h3>
              <p className="wizard-sub">Verify all details before finding experts</p>

              <div className="review-summary-card">
                <div className="review-item">
                  <span className="review-label">Service</span>
                  <span className="review-val">
                    <b>{currentCategory.name}</b>
                  </span>
                </div>

                {selectedServiceId === "garbage" ? (
                  <>
                    <div className="review-item">
                      <span className="review-label">Classification</span>
                      <span className="review-val font-semibold">
                        {wasteType.toUpperCase()} ({wasteVolume.toUpperCase()} LOAD)
                      </span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Segregation</span>
                      <span className="review-val text-green-700 font-bold">
                        {isSegregated
                          ? "✓ Pre-Segregated (₹20 Rebate Applied)"
                          : "Mixed (Site Sorting)"}
                      </span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Eco Certificate</span>
                      <span className="review-val">
                        {ecoCertRequested
                          ? "PMC Municipal Recycling Hash (Included)"
                          : "Not requested"}
                      </span>
                    </div>
                  </>
                ) : selectedServiceId === "bodyguard" ? (
                  <>
                    <div className="review-item">
                      <span className="review-label">Protection Tier</span>
                      <span className="review-val font-bold text-violet-700">
                        {guardTier === "armed_pso"
                          ? "Armed Personal Security Officer (PSO)"
                          : guardTier === "vip_close_protection"
                            ? "VIP Close Protection Officer"
                            : guardTier === "night_escort"
                              ? "Night Commute Escort"
                              : "Event / Venue Bouncer"}
                      </span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Attire & Height</span>
                      <span className="review-val">
                        {guardAttire === "formal_suit"
                          ? "Dark Suit & Earpiece"
                          : guardAttire === "tactical_uniform"
                            ? "Tactical Black"
                            : "Plainclothes"}{" "}
                        · Min {minHeight}
                      </span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Standards</span>
                      <span className="review-val text-xs text-muted-ink">
                        {[
                          exMilitaryRequired ? "Ex-Military" : null,
                          combatCertified ? "Combat/Krav Maga" : null,
                          policeVerified ? "PVR Clean" : null,
                          firstAidCertified ? "First Aid" : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Shift Duration</span>
                      <span className="review-val">
                        {durationHours} Hours (Satellite Guardian Sync Active)
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="review-item">
                    <span className="review-label">Issue</span>
                    <span className="review-val">{issueDescription}</span>
                  </div>
                )}

                <div className="review-item">
                  <span className="review-label">Schedule</span>
                  <span className="review-val">
                    {selectedDate} · {selectedTime}
                  </span>
                </div>
                <div className="review-item">
                  <span className="review-label">Priority</span>
                  <span className="review-val">
                    {urgency === "urgent" ? "⚡ Priority Rapid (+₹99)" : "Standard Visit"}
                  </span>
                </div>
                <div className="review-item">
                  <span className="review-label">Address</span>
                  <span className="review-val">{address}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Photos / Venue</span>
                  <div className="review-photos-col">
                    <span className="review-val">{photos.length} photos attached</span>
                    {photos.length > 0 && (
                      <div className="review-photos-thumbnails-strip mt-2">
                        {photos.map((p, i) => (
                          <img
                            key={i}
                            src={p}
                            alt={`Preview ${i + 1}`}
                            className="review-strip-thumb"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="review-item price-item">
                  <span className="review-label">Calculated Base Fee</span>
                  <span className="review-val price-tag">₹{getCalculatedPrice()}</span>
                </div>
              </div>

              <div className="escrow-badge-pill">
                <Icon name="shield" size={16} />
                <span>
                  Zero upfront charge. Payment held in HomeCare Escrow until you inspect completed
                  work.
                </span>
              </div>
            </div>
          )}

          {/* STEP 8: Confirmation & Dispatch */}
          {step === 7 && (
            <div className="wizard-step text-center">
              <div className="confirm-icon-wrap">
                <Icon name="check" size={36} />
              </div>
              <h3>Ready to Broadcast Request</h3>
              <p className="wizard-sub">
                Your request will be sent to <b>14 verified technicians</b> in Koregaon Park. You
                will receive 3 competitive quotations to compare and negotiate.
              </p>

              <div className="broadcast-features-list">
                <div>
                  <Icon name="shield" size={18} />
                  <span>Only Government ID & Skill certified pros</span>
                </div>
                <div>
                  <Icon name="lock" size={18} />
                  <span>Civic price-lock guarantee</span>
                </div>
                <div>
                  <Icon name="clock" size={18} />
                  <span>Average quote response time: 2 minutes</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="request-modal-footer">
          {step > 0 && (
            <Button kind="secondary" onClick={handleBack}>
              Back
            </Button>
          )}
          <Button
            kind="primary"
            className="ml-auto"
            onClick={handleNext}
            icon={step === 7 ? "arrow" : undefined}
          >
            {step === 7 ? "Broadcast & Compare Quotes" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
