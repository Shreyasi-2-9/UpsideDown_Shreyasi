import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";

export function CitizenProfileView() {
  const {
    currentUser,
    language,
    setLanguage,
    seniorMode,
    setSeniorMode,
    setActiveScreen,
    setRole,
  } = useApp();
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="flow-page page-pad narrow-flow">
      <div className="flow-title">
        <button
          type="button"
          className="back-btn"
          onClick={() => setActiveScreen("home")}
          aria-label="Back"
        >
          <Icon name="chevron" size={18} />
        </button>
        <div>
          <span className="section-kicker">ACCOUNT & PREFERENCES</span>
          <h1>Citizen Profile & Settings</h1>
          <p>Manage your address book, safety contacts, language, and accessibility modes.</p>
        </div>
      </div>

      <div className="profile-layout-grid">
        {/* Left Column: Profile Card & Quick Actions */}
        <div className="profile-card-left card">
          <div className="profile-avatar-wrap">
            <span className="profile-avatar-large">AS</span>
            <span className="citizen-verified-badge">
              <Icon name="check" size={14} /> Aadhaar Verified
            </span>
          </div>

          <h3>{name}</h3>
          <p className="profile-phone-label">{phone}</p>
          <p className="profile-loc-label">Koregaon Park, Pune</p>

          <div className="profile-quick-stats">
            <div>
              <strong>12</strong>
              <small>Completed Jobs</small>
            </div>
            <div>
              <strong>4.9★</strong>
              <small>Citizen Rating</small>
            </div>
            <div>
              <strong>₹3,840</strong>
              <small>Escrow Paid</small>
            </div>
          </div>

          <div className="profile-role-switcher mt-6">
            <label>Switch Role Perspective:</label>
            <div className="role-switch-btns">
              <Button kind="secondary" size="sm" onClick={() => setRole("technician")}>
                Technician View
              </Button>
              <Button kind="secondary" size="sm" onClick={() => setRole("admin")}>
                Admin View
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Forms & Accessibility */}
        <div className="profile-forms-right card">
          {savedSuccess && (
            <div className="success-banner">
              <Icon name="check" size={16} />
              <span>Profile preferences saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSave}>
            <h3>Personal & Contact Information</h3>
            <div className="form-group mt-3">
              <label>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Mobile Number (OTP Verified)</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Default Home Address</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <h3 className="mt-6">Accessibility & Language</h3>

            <div className="accessibility-row">
              <div className="access-info">
                <strong>Senior Citizen Simplified Mode</strong>
                <p>
                  Enlarges fonts, increases button touch targets to 54px, and simplifies navigation.
                </p>
              </div>
              <button
                type="button"
                className={`switch-toggle ${seniorMode ? "on" : "off"}`}
                onClick={() => setSeniorMode(!seniorMode)}
                aria-pressed={seniorMode}
              >
                <span className="switch-thumb" />
              </button>
            </div>

            <div className="form-group mt-4">
              <label>Interface Language</label>
              <div className="lang-picker-group">
                {[
                  { code: "EN", label: "English" },
                  { code: "हिं", label: "हिंदी (Hindi)" },
                  { code: "म", label: "मराठी (Marathi)" },
                ].map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    className={`lang-choice-btn ${language === l.code ? "selected" : ""}`}
                    onClick={() => setLanguage(l.code as any)}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <h3 className="mt-6">Emergency SOS Contact</h3>
            <div className="form-group mt-2">
              <label>Primary Emergency Contact</label>
              <input type="text" defaultValue="Rajesh Sharma (Son) · +91 98233 44556" />
            </div>

            <div className="form-submit-row mt-6">
              <Button type="submit" kind="primary">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
