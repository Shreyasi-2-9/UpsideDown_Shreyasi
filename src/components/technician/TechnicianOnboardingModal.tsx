import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";

export function TechnicianOnboardingModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { categories, setRole, setActiveScreen } = useApp();
  const [step, setStep] = useState(0);

  const [name, setName] = useState("Ramesh Patil");
  const [trade, setTrade] = useState("plumbing");
  const [experience, setExperience] = useState("8");
  const [serviceArea, setServiceArea] = useState("Koregaon Park & Kalyani Nagar");
  const [upi, setUpi] = useState("ramesh.patil@upi");
  const [bankAcc, setBankAcc] = useState("918200192834");
  const [ifsc, setIfsc] = useState("HDFC0001244");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleFinish = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      setRole("technician");
      onClose();
      setActiveScreen("tech_dashboard");
    }, 2000);
  };

  const steps = [
    "Personal & Trade",
    "Service Area & Experience",
    "KYC Document Upload",
    "Bank & Payout Details",
    "Verification Status",
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card tech-onboard-modal" onClick={(e) => e.stopPropagation()}>
        <div className="onboard-header">
          <div>
            <span className="step-tag">
              STEP {step + 1} OF 5 · {steps[step]}
            </span>
            <h2>Technician Partner Registration</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="onboard-progress-bar">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`onboard-dot ${i < step ? "done" : i === step ? "active" : ""}`}
            />
          ))}
        </div>

        <div className="onboard-body p-6">
          {step === 0 && (
            <div className="wizard-step">
              <h3>Personal Details & Primary Trade</h3>
              <p className="sub-helper">
                Your details will be registered with the Maharashtra Civic Skills Registry.
              </p>
              <div className="form-group mt-3">
                <label>Full Legal Name (as per Aadhaar)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mt-3">
                <label>Select Primary Trade Specialty</label>
                <select value={trade} onChange={(e) => setTrade(e.target.value)}>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="wizard-step">
              <h3>Experience & Service Coverage Area</h3>
              <div className="form-group mt-3">
                <label>Years of Professional Trade Experience</label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  min={1}
                  max={40}
                />
              </div>
              <div className="form-group mt-3">
                <label>Preferred Operating Neighbourhoods in Pune</label>
                <input
                  type="text"
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                  placeholder="E.g. Koregaon Park, Viman Nagar, Camp"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="wizard-step">
              <h3>Identity & Trade Certification (KYC)</h3>
              <p className="sub-helper">
                Upload photo of your Government ID and Technical Certification.
              </p>
              <div className="kyc-upload-boxes mt-3">
                <div className="kyc-box">
                  <Icon name="file" size={24} />
                  <strong>1. Aadhaar Card (Front & Back)</strong>
                  <span className="file-ready">aadhaar_verified_0841.pdf</span>
                </div>
                <div className="kyc-box">
                  <Icon name="shield" size={24} />
                  <strong>2. Govt. ITI Trade Certificate</strong>
                  <span className="file-ready">iti_plumbing_diploma.pdf</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="wizard-step">
              <h3>Bank Account & Instant UPI for Payouts</h3>
              <p className="sub-helper">Where should your escrow payments be settled?</p>
              <div className="form-group mt-3">
                <label>UPI ID (Google Pay, PhonePe, BHIM)</label>
                <input
                  type="text"
                  value={upi}
                  onChange={(e) => setUpi(e.target.value)}
                  placeholder="name@upi"
                />
              </div>
              <div className="form-group mt-3">
                <label>Bank Account Number</label>
                <input type="text" value={bankAcc} onChange={(e) => setBankAcc(e.target.value)} />
              </div>
              <div className="form-group mt-3">
                <label>Bank IFSC Code</label>
                <input type="text" value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="wizard-step text-center">
              <div className="success-badge-circle">
                <Icon name="check" size={36} />
              </div>
              <h3>Application Submitted for Verification</h3>
              <p className="sub-helper mt-2">
                Your credentials have been submitted to the Pune Civic Operations desk. You are
                approved to accept jobs in prototype demo mode!
              </p>
              <div className="approved-pill mt-4">
                <Icon name="shield" size={16} />
                <span>
                  Verification Status: <b>APPROVED (PROTOTYPE VERIFIED)</b>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="onboard-footer p-5">
          {step > 0 && step < 4 && (
            <Button kind="secondary" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button kind="primary" className="ml-auto" onClick={() => setStep(step + 1)}>
              Continue
            </Button>
          ) : step === 3 ? (
            <Button kind="primary" className="ml-auto" onClick={() => setStep(4)}>
              Submit Application
            </Button>
          ) : (
            <Button kind="primary" className="w-full" onClick={handleFinish}>
              Enter Technician Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
