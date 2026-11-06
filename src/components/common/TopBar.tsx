import { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Brand } from "./Brand";
import { Icon } from "./Icon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "./Button";

export function TopBar() {
  const {
    role,
    setRole,
    activeScreen,
    setActiveScreen,
    seniorMode,
    setSeniorMode,
    notifications,
    setIsNotificationOpen,
    setIsSosOpen,
    currentUser,
    language,
    setLanguage,
    t,
  } = useApp();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSeniorModalOpen, setIsSeniorModalOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileMenuOpen]);

  return (
    <header className="topbar">
      <div className="topbar-brand-group">
        <Brand
          onClick={() =>
            setActiveScreen(
              role === "citizen"
                ? "home"
                : role === "technician"
                  ? "tech_dashboard"
                  : "admin_dashboard",
            )
          }
        />

        {/* Role Badge */}
        <div className="role-pill-badge">
          <span className={`role-dot ${role}`} />
          <span className="role-title">
            {role === "citizen"
              ? "Citizen"
              : role === "technician"
                ? "Technician Pro"
                : "Admin Operations"}
          </span>
        </div>
      </div>

      {/* Desktop Links: Top navigation links cleanly hidden across roles; full access preserved in Profile dropdown & Dashboards */}
      <nav className="desktop-links" aria-label="Main Navigation">
        {/* Navigation items removed per requirements; preserved in dashboard cards and Profile menu */}
      </nav>

      {/* Top Actions: Retaining Senior Mode, Language, SOS, Notifications, Profile */}
      <div className="top-actions">
        {/* Senior Citizen Mode button with interactive settings modal */}
        <button
          type="button"
          className={`senior-mode-btn ${seniorMode ? "active" : ""}`}
          onClick={() => setSeniorMode(!seniorMode)}
          onContextMenu={(e) => {
            e.preventDefault();
            setIsSeniorModalOpen(true);
          }}
          title="Toggle Senior Citizen accessible mode (Right-click for settings)"
          aria-pressed={seniorMode}
        >
          <Icon name="volume" size={17} />
          <span>{seniorMode ? "Senior Mode ON" : "Senior Mode"}</span>
          <span
            className="senior-info-pill"
            onClick={(e) => {
              e.stopPropagation();
              setIsSeniorModalOpen(true);
            }}
            title="Senior mode settings & info"
          >
            ?
          </span>
        </button>

        <LanguageSwitcher />

        {/* SOS Emergency button */}
        <button
          type="button"
          className="top-sos-btn"
          onClick={() => setIsSosOpen(true)}
          title="Emergency SOS assistance"
        >
          <Icon name="sos" size={18} />
          <span>SOS</span>
        </button>

        {/* Notifications button */}
        <button
          type="button"
          className="icon-btn notification"
          onClick={() => setIsNotificationOpen(true)}
          aria-label="View notifications"
        >
          <Icon name="bell" size={19} />
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>

        {/* User profile / Avatar with Rich Dropdown Popup */}
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            className="user-profile-btn"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            title="Account profile & quick navigation"
            aria-expanded={isProfileMenuOpen}
          >
            <span className="user-avatar-initials">
              {role === "citizen" ? "AS" : role === "technician" ? "RP" : "AD"}
            </span>
            <span className="user-name-label">
              {role === "citizen"
                ? currentUser.name.split(" ")[0]
                : role === "technician"
                  ? "Ramesh"
                  : "Admin"}
            </span>
            <Icon name="chevron" size={14} className={isProfileMenuOpen ? "rotate-180" : ""} />
          </button>

          {/* Profile Dropdown Popup Card */}
          {isProfileMenuOpen && (
            <div className="profile-popup-card card shadow-xl">
              <div className="profile-popup-header">
                <div className="flex items-center gap-3">
                  <div className="popup-avatar-circle">
                    {role === "citizen" ? "AS" : role === "technician" ? "RP" : "AD"}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-midnight leading-tight">
                      {role === "citizen"
                        ? currentUser.name
                        : role === "technician"
                          ? "Ramesh Patil"
                          : "Administrator"}
                    </h3>
                    <p className="text-xs text-muted leading-tight mt-0.5">
                      {role === "citizen"
                        ? currentUser.phone
                        : role === "technician"
                          ? "+91 98230 45671"
                          : "admin@homecare360.in"}
                    </p>
                  </div>
                </div>
                <span className="civic-verified-pill">
                  <Icon name="shield" size={12} /> Verified
                </span>
              </div>

              <div className="profile-popup-location">
                <Icon name="pin" size={14} />
                <span className="text-xs text-midnight font-medium truncate">
                  {currentUser.address}, Koregaon Park, Pune
                </span>
              </div>

              {/* Quick Navigation Links */}
              <div className="profile-popup-links">
                <span className="popup-section-title">QUICK ACCESS</span>
                {role === "citizen" ? (
                  <>
                    <button
                      type="button"
                      className="popup-nav-item"
                      onClick={() => {
                        setActiveScreen("bookings");
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      <Icon name="calendar" size={16} />
                      <span>My Service Bookings</span>
                    </button>
                    <button
                      type="button"
                      className="popup-nav-item"
                      onClick={() => {
                        setActiveScreen("tracking");
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      <Icon name="pin" size={16} />
                      <span>Live Technician Tracking</span>
                    </button>
                    <button
                      type="button"
                      className="popup-nav-item"
                      onClick={() => {
                        setActiveScreen("evidence");
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      <Icon name="camera" size={16} />
                      <span>Digital Evidence Vault</span>
                    </button>
                    <button
                      type="button"
                      className="popup-nav-item"
                      onClick={() => {
                        setActiveScreen("group_booking");
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      <Icon name="users" size={16} />
                      <span>Neighbourhood Group Savings</span>
                    </button>
                    <button
                      type="button"
                      className="popup-nav-item"
                      onClick={() => {
                        setActiveScreen("profile");
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      <Icon name="user" size={16} />
                      <span>Full Account Profile & Addresses</span>
                    </button>
                  </>
                ) : role === "technician" ? (
                  <>
                    <button
                      type="button"
                      className="popup-nav-item"
                      onClick={() => {
                        setActiveScreen("tech_dashboard");
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      <Icon name="grid" size={16} />
                      <span>Overview Dashboard</span>
                    </button>
                    <button
                      type="button"
                      className="popup-nav-item"
                      onClick={() => {
                        setActiveScreen("tech_requests");
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      <Icon name="pin" size={16} />
                      <span>Incoming Requests</span>
                    </button>
                    <button
                      type="button"
                      className="popup-nav-item"
                      onClick={() => {
                        setActiveScreen("tech_job");
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      <Icon name="briefcase" size={16} />
                      <span>Active On-Site Job</span>
                    </button>
                    <button
                      type="button"
                      className="popup-nav-item"
                      onClick={() => {
                        setActiveScreen("tech_earnings");
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      <Icon name="wallet" size={16} />
                      <span>Earnings & Payouts</span>
                    </button>
                    <button
                      type="button"
                      className="popup-nav-item"
                      onClick={() => {
                        setActiveScreen("tech_passport");
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      <Icon name="shield" size={16} />
                      <span>Digital Skill Passport</span>
                    </button>
                    <button
                      type="button"
                      className="popup-nav-item"
                      onClick={() => {
                        setActiveScreen("tech_profile");
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      <Icon name="settings" size={16} />
                      <span>Profile & Trade Settings</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="popup-nav-item"
                      onClick={() => {
                        setActiveScreen("admin_dashboard");
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      <Icon name="chart" size={16} />
                      <span>Operations Overview</span>
                    </button>
                    <button
                      type="button"
                      className="popup-nav-item"
                      onClick={() => {
                        setActiveScreen("admin_users");
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      <Icon name="users" size={16} />
                      <span>User Directory & Accounts</span>
                    </button>
                    <button
                      type="button"
                      className="popup-nav-item"
                      onClick={() => {
                        setActiveScreen("admin_verification");
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      <Icon name="shield" size={16} />
                      <span>Technician Verification (KYC)</span>
                    </button>
                    <button
                      type="button"
                      className="popup-nav-item"
                      onClick={() => {
                        setActiveScreen("admin_bookings");
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      <Icon name="briefcase" size={16} />
                      <span>All Bookings & Escrow Audit</span>
                    </button>
                    <button
                      type="button"
                      className="popup-nav-item"
                      onClick={() => {
                        setActiveScreen("admin_sos");
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      <Icon name="sos" size={16} />
                      <span>Emergency SOS Monitor</span>
                    </button>
                    <button
                      type="button"
                      className="popup-nav-item"
                      onClick={() => {
                        setActiveScreen("admin_revenue");
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      <Icon name="wallet" size={16} />
                      <span>Revenue & Escrow Ledger</span>
                    </button>
                    <button
                      type="button"
                      className="popup-nav-item"
                      onClick={() => {
                        setActiveScreen("admin_settings");
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      <Icon name="settings" size={16} />
                      <span>System & Platform Settings</span>
                    </button>
                  </>
                )}
              </div>

              {/* Accessibility & Language Quick Switcher */}
              <div className="profile-popup-toggles">
                <div className="popup-toggle-row">
                  <div className="flex items-center gap-2">
                    <Icon name="volume" size={15} />
                    <span className="text-xs font-semibold text-midnight">Senior Mode</span>
                  </div>
                  <button
                    type="button"
                    className={`toggle-switch-btn ${seniorMode ? "on" : "off"}`}
                    onClick={() => setSeniorMode(!seniorMode)}
                  >
                    <span className="toggle-thumb" />
                  </button>
                </div>
              </div>

              <div className="profile-popup-footer">
                <Button
                  kind="secondary"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setActiveScreen("landing");
                  }}
                >
                  Switch Role / Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Senior Mode Information & Settings Modal */}
      {isSeniorModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSeniorModalOpen(false)}>
          <div className="modal-card senior-mode-modal card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-standard-header">
              <div className="modal-header-icon violet">
                <Icon name="volume" size={24} />
              </div>
              <div>
                <h2>Senior Citizen Friendly Mode</h2>
                <p>Enhanced readability, larger tap targets, and voice assistance for seniors.</p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsSeniorModalOpen(false)}
                aria-label="Close"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="senior-modal-body p-6">
              <div className="senior-feature-list">
                <div className="feature-item">
                  <span className="feat-check">✓</span>
                  <div>
                    <strong>20% Larger Typography</strong>
                    <p>
                      All service prices, addresses, and instructions rendered in large
                      high-contrast text.
                    </p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feat-check">✓</span>
                  <div>
                    <strong>High Contrast Dark Ink</strong>
                    <p>
                      Subtle grays upgraded to rich contrast for easy daylight reading without eye
                      strain.
                    </p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feat-check">✓</span>
                  <div>
                    <strong>1-Tap Emergency Assistance</strong>
                    <p>
                      Immediate doorstep technician phone dialer and direct operations center
                      connection.
                    </p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feat-check">✓</span>
                  <div>
                    <strong>Voice Note Descriptions</strong>
                    <p>
                      Speak in Marathi, Hindi, or English instead of typing out home maintenance
                      problems.
                    </p>
                  </div>
                </div>
              </div>

              <div className="senior-toggle-banner mt-6">
                <div>
                  <strong>
                    Current Status: {seniorMode ? "ACTIVE (Senior Mode ON)" : "Standard View"}
                  </strong>
                  <p className="text-xs text-muted">
                    You can toggle this on or off anytime from the top bar.
                  </p>
                </div>
                <button
                  type="button"
                  className={`btn ${seniorMode ? "btn-peach" : "btn-primary"} btn-sm`}
                  onClick={() => setSeniorMode(!seniorMode)}
                >
                  {seniorMode ? "Turn Senior Mode OFF" : "Turn Senior Mode ON"}
                </button>
              </div>
            </div>

            <div className="modal-footer-standard">
              <Button kind="secondary" size="sm" onClick={() => setIsSeniorModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
