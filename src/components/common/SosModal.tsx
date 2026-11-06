import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "./Icon";
import { Button } from "./Button";
import type { IconName } from "../../types";

interface EmergencyCategory {
  id: string;
  label: string;
  icon: IconName;
  description: string;
  severity: "critical" | "high" | "urgent";
}

const EMERGENCY_CATEGORIES: EmergencyCategory[] = [
  {
    id: "medical",
    label: "Medical Emergency",
    icon: "shield",
    description: "Senior fall, sudden illness, or urgent first-aid care needed",
    severity: "critical",
  },
  {
    id: "electrical",
    label: "Electrical Hazard",
    icon: "bolt",
    description: "Sparking switchboard, short circuit, or wire burning odor",
    severity: "critical",
  },
  {
    id: "gas",
    label: "Gas Leakage",
    icon: "alert",
    description: "LPG cylinder smell or regulator valve failure detected",
    severity: "critical",
  },
  {
    id: "fire",
    label: "Fire or Smoke",
    icon: "alert",
    description: "Visible smoke or containment needed for electrical fire",
    severity: "critical",
  },
  {
    id: "flooding",
    label: "Water Leakage / Flooding",
    icon: "droplet",
    description: "Main pipe burst or heavy water ingress flooding rooms",
    severity: "high",
  },
  {
    id: "security",
    label: "Security Concern",
    icon: "lock",
    description: "Broken main lock, door latch failure, or suspicious entry",
    severity: "high",
  },
  {
    id: "other",
    label: "Other Emergency",
    icon: "info",
    description: "Any other urgent home safety or structural hazard",
    severity: "urgent",
  },
];

export function SosModal() {
  const { isSosOpen, setIsSosOpen, triggerSos, currentUser, setActiveScreen, setRole } = useApp();

  // State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [emergencyAddress, setEmergencyAddress] = useState(currentUser.address);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAlertRef, setSubmittedAlertRef] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isSosOpen) return null;

  const selectedCategory = EMERGENCY_CATEGORIES.find((c) => c.id === selectedCategoryId);

  // Validation logic
  const isDescriptionRequired = selectedCategoryId === "other";
  const isDescriptionValid = !isDescriptionRequired || description.trim().length >= 5;
  const isFormValid = selectedCategoryId !== null && isDescriptionValid;

  const handleClose = () => {
    setIsSosOpen(false);
    setSelectedCategoryId(null);
    setDescription("");
    setValidationError(null);
    setSubmittedAlertRef(null);
    setIsSubmitting(false);
  };

  const handleSendSos = () => {
    if (!selectedCategory) {
      setValidationError("Please select an emergency category.");
      return;
    }

    if (isDescriptionRequired && description.trim().length < 5) {
      setValidationError("Please describe what happened (at least 5 characters).");
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);

    const refCode = `SOS-PUN-${Math.floor(1000 + Math.random() * 9000)}`;

    // Store in global AppContext
    triggerSos({
      category: selectedCategory.label,
      description:
        description.trim() || `Priority ${selectedCategory.label} reported at residence.`,
      location: emergencyAddress,
    });

    setSubmittedAlertRef(refCode);
    setIsSubmitting(false);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card sos-modal card shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Modal Standard Header */}
        <div className="sos-modal-header">
          <div className="sos-header-badge">
            <Icon name="sos" size={26} />
          </div>
          <div className="sos-header-titles">
            <h2>{submittedAlertRef ? "Emergency Alert Confirmed" : "How can we help?"}</h2>
            <p>
              {submittedAlertRef
                ? "Your emergency alert has been logged with the HomeCare 360 Pune Operations Center."
                : "Tell us what is happening so we can send the appropriate alert."}
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="Close emergency modal"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Content Mode: Form or Success */}
        {!submittedAlertRef ? (
          <div className="sos-modal-content">
            {/* Warning banner */}
            <div className="sos-banner-note">
              <Icon name="alert" size={18} />
              <div>
                <strong>Civic Rapid Safety Response Protocol</strong>
                <p>
                  Select your emergency category. Our operations team and nearby verified
                  technicians will be notified immediately.
                </p>
              </div>
            </div>

            {validationError && (
              <div className="sos-validation-alert">
                <Icon name="alert" size={16} />
                <span>{validationError}</span>
              </div>
            )}

            {/* Step 2: Emergency Categories Grid */}
            <div className="sos-section">
              <div className="section-label-row">
                <label className="sos-field-label">
                  1. SELECT EMERGENCY CATEGORY <span className="text-danger">*</span>
                </label>
                <span className="text-xs text-muted">Select one category</span>
              </div>

              <div className="sos-category-cards-grid">
                {EMERGENCY_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`sos-cat-card ${isSelected ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedCategoryId(cat.id);
                        setValidationError(null);
                      }}
                    >
                      <div className="cat-icon-orb">
                        <Icon name={cat.icon} size={20} />
                      </div>
                      <div className="cat-text-wrap">
                        <span className="cat-title">{cat.label}</span>
                        <small className="cat-sub">{cat.description}</small>
                      </div>
                      {isSelected && (
                        <span className="cat-selected-check">
                          <Icon name="check" size={14} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Describe the Problem */}
            <div className="sos-section">
              <div className="section-label-row">
                <label className="sos-field-label">
                  2. DESCRIBE WHAT HAPPENED{" "}
                  {isDescriptionRequired ? (
                    <span className="text-danger">* (Required for Other)</span>
                  ) : (
                    <span className="text-muted">(Optional)</span>
                  )}
                </label>
                <span className="char-counter">{description.length} / 500 chars</span>
              </div>

              <textarea
                className={`sos-textarea ${isDescriptionRequired && !description.trim() ? "warn-border" : ""}`}
                rows={3}
                maxLength={500}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="Briefly explain the emergency so we can understand the situation..."
              />
            </div>

            {/* Step 4: Emergency Location */}
            <div className="sos-section">
              <div className="section-label-row">
                <label className="sos-field-label">3. EMERGENCY INCIDENT LOCATION</label>
                <button
                  type="button"
                  className="edit-loc-toggle"
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                >
                  {isEditingAddress ? "Save Address" : "Edit Address"}
                </button>
              </div>

              <div className="sos-location-box">
                <div className="loc-pin-icon">
                  <Icon name="pin" size={20} />
                </div>
                <div className="loc-info-text">
                  <strong>
                    {currentUser.name} ({currentUser.phone})
                  </strong>
                  {isEditingAddress ? (
                    <input
                      type="text"
                      className="edit-address-input"
                      value={emergencyAddress}
                      onChange={(e) => setEmergencyAddress(e.target.value)}
                      placeholder="Enter flat / building / street name"
                    />
                  ) : (
                    <p className="address-text">{emergencyAddress}, Koregaon Park, Pune</p>
                  )}
                  <small className="demo-loc-note">
                    * Simulated location for demo environment. In a real emergency, verified GPS
                    coordinates are dispatched.
                  </small>
                </div>
              </div>
            </div>

            {/* Step 5: Footer Actions */}
            <div className="sos-modal-footer">
              <Button kind="secondary" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                kind="danger"
                icon="sos"
                onClick={handleSendSos}
                disabled={!isFormValid || isSubmitting}
                className="send-sos-cta"
              >
                {isSubmitting ? "Dispatching Alert..." : "Send SOS Alert"}
              </Button>
            </div>
          </div>
        ) : (
          /* Success State View */
          <div className="sos-success-view">
            <div className="sos-success-hero">
              <div className="success-pulse-orb">
                <Icon name="check" size={36} />
              </div>
              <h3>SOS Alert Submitted Successfully</h3>
              <span className="sos-ref-tag">Reference: #{submittedAlertRef}</span>
              <p className="sos-success-msg">
                Your emergency request for <b>{selectedCategory?.label}</b> has been received. Our
                Operations Team has logged priority response for <b>{emergencyAddress}</b>.
              </p>
            </div>

            {/* Dispatch Timeline */}
            <div className="sos-timeline-card card">
              <div className="timeline-item done">
                <span className="dot">✓</span>
                <div>
                  <strong>Incident Logged</strong>
                  <p>Pune Civic Operations Center alerted with incident category and address.</p>
                </div>
              </div>
              <div className="timeline-item done">
                <span className="dot">✓</span>
                <div>
                  <strong>Nearby Verified Experts Alerted</strong>
                  <p>Technicians on standby in Koregaon Park notified for emergency assistance.</p>
                </div>
              </div>
              <div className="timeline-item pending">
                <span className="dot">3</span>
                <div>
                  <strong>Safety Desk Follow-Up</strong>
                  <p>Operations staff will reach out to your phone if needed.</p>
                </div>
              </div>
            </div>

            {/* Helpline Box */}
            <div className="sos-helpline-card">
              <Icon name="phone" size={24} />
              <div className="helpline-text">
                <strong>24x7 Direct Support Helpline: 1800-360-HELP</strong>
                <p>Call toll-free for active incident status updates</p>
              </div>
              <a href="tel:18003604357" className="btn btn-primary btn-sm">
                Call Now
              </a>
            </div>

            {/* Strict Prototype Disclaimer */}
            <div className="demo-disclaimer-box">
              <Icon name="shield" size={16} />
              <small>
                <strong>DEMO ENVIRONMENT NOTICE:</strong> This alert is registered in your HomeCare
                360 prototype operations ledger. In a real life-threatening emergency, always dial{" "}
                <b>112 (National Emergency)</b>, <b>101 (Fire)</b>, or <b>108 (Ambulance)</b>{" "}
                immediately.
              </small>
            </div>

            <div className="sos-modal-footer">
              <Button
                kind="secondary"
                size="sm"
                onClick={() => {
                  setRole("admin");
                  setActiveScreen("admin_sos");
                  handleClose();
                }}
              >
                Inspect in Admin Operations Center
              </Button>
              <Button kind="primary" size="sm" onClick={handleClose}>
                Close & Return to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
