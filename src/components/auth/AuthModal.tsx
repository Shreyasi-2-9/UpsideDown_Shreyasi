import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";
import type { Role } from "../../types";
import { api, setTokens } from "../../lib/api";

export function AuthModal() {
  const { isAuthOpen, setIsAuthOpen, role, setRole, setActiveScreen } = useApp();
  const [selectedRole, setSelectedRole] = useState<Role>(role);
  const [mode, setMode] = useState<"login" | "signup" | "otp">("login");
  const [phone, setPhone] = useState("+91 98221 12345");
  const [name, setName] = useState("Asha Sharma");
  const [otp, setOtp] = useState(["4", "9", "2", "1"]);
  const [adminPin, setAdminPin] = useState("3600");
  const [adminEmail, setAdminEmail] = useState("admin@homecare360.gov.in");

  if (!isAuthOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setMode("otp");
  };

  const handleVerifySuccess = async () => {
    try {
      if (selectedRole === "admin") {
        const res = await api.auth.login(adminEmail, adminPin, "admin");
        if (res?.access_token) {
          setTokens(res.access_token, res.refresh_token);
        }
      } else if (mode === "signup") {
        const res = await api.auth.register({
          name,
          phone,
          password: "password123",
          role: selectedRole,
        });
        if (res?.access_token) {
          setTokens(res.access_token, res.refresh_token);
        }
      } else {
        const res = await api.auth.login(phone, "password123", selectedRole);
        if (res?.access_token) {
          setTokens(res.access_token, res.refresh_token);
        }
      }
    } catch (err) {
      console.warn("Backend auth offline/fallback, continuing in demo mode:", err);
    }

    setRole(selectedRole);
    setIsAuthOpen(false);
    if (selectedRole === "citizen") setActiveScreen("home");
    else if (selectedRole === "technician") setActiveScreen("tech_dashboard");
    else setActiveScreen("admin_dashboard");
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthOpen(false)}>
      <div className="modal-card auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-header">
          <div className="auth-brand-badge">
            <Icon name="home" size={24} />
          </div>
          <h2>Welcome to HomeCare 360</h2>
          <p>India's trusted civic platform for verified home care</p>
          <button type="button" className="modal-close-btn" onClick={() => setIsAuthOpen(false)}>
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Role Selection Tabs */}
        <div className="auth-role-tabs">
          <button
            type="button"
            className={selectedRole === "citizen" ? "active" : ""}
            onClick={() => setSelectedRole("citizen")}
          >
            <Icon name="user" size={16} />
            <span>Citizen</span>
          </button>
          <button
            type="button"
            className={selectedRole === "technician" ? "active" : ""}
            onClick={() => setSelectedRole("technician")}
          >
            <Icon name="briefcase" size={16} />
            <span>Technician</span>
          </button>
          <button
            type="button"
            className={selectedRole === "admin" ? "active" : ""}
            onClick={() => setSelectedRole("admin")}
          >
            <Icon name="chart" size={16} />
            <span>Admin</span>
          </button>
        </div>

        {selectedRole === "admin" ? (
          <form
            className="auth-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleVerifySuccess();
            }}
          >
            <div className="form-group">
              <label>Administrator Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Security PIN</label>
              <input
                type="password"
                maxLength={6}
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                required
              />
            </div>
            <div className="demo-hint-box">
              <small>
                Demo credential auto-filled: PIN <b>3600</b>
              </small>
            </div>
            <Button type="submit" kind="primary" className="w-full">
              Access Admin Operations
            </Button>
          </form>
        ) : mode === "login" || mode === "signup" ? (
          <form className="auth-form" onSubmit={handleSendOtp}>
            {mode === "signup" && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label>Mobile Number (for instant OTP login)</label>
              <div className="phone-input-wrap">
                <span className="country-code">+91</span>
                <input
                  type="tel"
                  value={phone.replace("+91 ", "")}
                  onChange={(e) => setPhone("+91 " + e.target.value)}
                  placeholder="98221 XXXXX"
                  required
                />
              </div>
            </div>
            <div className="demo-hint-box">
              <small>Demo phone verified for testing. One-click instant login.</small>
            </div>
            <Button type="submit" kind="primary" className="w-full">
              Get OTP via SMS & WhatsApp
            </Button>
            <div className="auth-switch-link">
              {mode === "login" ? (
                <span>
                  New to HomeCare 360?{" "}
                  <button type="button" onClick={() => setMode("signup")}>
                    Create account
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{" "}
                  <button type="button" onClick={() => setMode("login")}>
                    Sign in
                  </button>
                </span>
              )}
            </div>
          </form>
        ) : (
          <div className="otp-view">
            <p className="otp-notice">
              Enter 4-digit OTP sent to <b>{phone}</b>
            </p>
            <div className="otp-inputs">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[idx] = e.target.value;
                    setOtp(newOtp);
                  }}
                  className="otp-cell"
                />
              ))}
            </div>
            <Button kind="primary" className="w-full" onClick={handleVerifySuccess}>
              Verify & Continue
            </Button>
            <button type="button" className="resend-otp-btn" onClick={() => setMode("login")}>
              Change number
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
