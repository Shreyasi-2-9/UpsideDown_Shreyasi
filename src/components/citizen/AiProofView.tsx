import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";

export function AiProofView() {
  const { bookings, activeBookingId, releasePaymentAndComplete, raiseDispute, setActiveScreen } =
    useApp();

  const booking = bookings.find((b) => b.id === activeBookingId) || bookings[0];
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeText, setDisputeText] = useState("");

  const beforePhoto =
    booking.beforeWorkPhotos?.[0] ||
    booking.beforeWorkPhoto ||
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400";
  const afterPhoto =
    booking.afterWorkPhotos?.[0] ||
    booking.afterWorkPhoto ||
    "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400";

  const handleConfirmRelease = () => {
    releasePaymentAndComplete(booking.id);
    setActiveScreen("receipt");
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeText.trim()) return;
    raiseDispute(booking.id, disputeText);
    setDisputeOpen(false);
    alert(
      "Dispute reported to HomeCare 360 Support. Escrow funds held indefinitely pending mediation.",
    );
    setActiveScreen("bookings");
  };

  return (
    <div className="flow-page page-pad narrow-flow">
      <div className="flow-title">
        <button
          type="button"
          className="back-btn"
          onClick={() => setActiveScreen("evidence")}
          aria-label="Back"
        >
          <Icon name="chevron" size={18} />
        </button>
        <div>
          <span className="section-kicker">STEP 6 OF 8 · WORK QUALITY AUDIT</span>
          <h1>Work Inspection & Quality Audit</h1>
          <p>
            Systematic visual audit comparing before-and-after photographic evidence. You maintain
            complete and final authorization before escrow funds are released.
          </p>
        </div>
      </div>

      <div className="proof-grid">
        {/* Left: Comparison Cards */}
        <section className="comparison card">
          <div className="compare-pane">
            <span className="pane-title">BEFORE WORK</span>
            <div className="evidence-image-small">
              <img src={beforePhoto} alt="Before repair" />
            </div>
            <small>
              {booking.serviceId === "garbage"
                ? "Cluttered rubble, tile debris & unsegregated e-waste"
                : booking.serviceId === "bodyguard"
                  ? "Threat assessment initiated & route perimeter secured"
                  : "Active water drip & eroded clamp"}
            </small>
          </div>

          <div className="compare-arrow">
            <Icon name="arrow" size={20} />
          </div>

          <div className="compare-pane">
            <span className="pane-title">AFTER WORK</span>
            <div className="evidence-image-small">
              <img src={afterPhoto} alt="After repair" />
            </div>
            <small>
              {booking.serviceId === "garbage"
                ? "Debris cleared, ground swept & recycled at PMC hub"
                : booking.serviceId === "bodyguard"
                  ? "VIP escort destination completed & zero-incident transit verified"
                  : "New P-trap & silicone sealed collar"}
            </small>
          </div>
        </section>

        {/* Right: AI Verdict Scorecard */}
        <aside className="verdict card">
          <div className="verdict-head">
            <span className="verdict-icon">
              <Icon name="check" size={26} />
            </span>
            <div>
              <small>QUALITY AUDIT</small>
              <h2>Standards Verified</h2>
            </div>
            <strong className="confidence-num">96%</strong>
          </div>

          <div className="confidence-bar-wrap">
            <div className="confidence-bar-fill" style={{ width: "96%" }} />
          </div>
          <p className="confidence-label">Compliance Verification Score</p>

          <ul className="verdict-checklist">
            {booking.serviceId === "garbage" ? (
              <>
                <li>
                  <Icon name="check" size={16} />
                  <span>All debris sacks and appliances removed from site</span>
                </li>
                <li>
                  <Icon name="check" size={16} />
                  <span>Ground floor wiped dry and swept clean</span>
                </li>
                <li>
                  <Icon name="check" size={16} />
                  <span>PMC municipal bio-processing receipt authenticated</span>
                </li>
              </>
            ) : booking.serviceId === "bodyguard" ? (
              <>
                <li>
                  <Icon name="check" size={16} />
                  <span>Licensed Armed PSO presence verified throughout transit</span>
                </li>
                <li>
                  <Icon name="check" size={16} />
                  <span>Continuous satellite GPS telemetries logged without route deviation</span>
                </li>
                <li>
                  <Icon name="check" size={16} />
                  <span>Safe destination arrival & zero-incident handover confirmed</span>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Icon name="check" size={16} />
                  <span>Active pipe drip no longer detected</span>
                </li>
                <li>
                  <Icon name="check" size={16} />
                  <span>Coupling washer tightened and sealed</span>
                </li>
                <li>
                  <Icon name="check" size={16} />
                  <span>Surrounding cabinet wiped dry & clean</span>
                </li>
              </>
            )}
          </ul>

          <div className="ai-disclaimer-box">
            <Icon name="info" size={15} />
            <small>
              Automated visual audit is a quality safeguard. Please physically inspect the completed work before releasing escrow payment.
            </small>
          </div>
        </aside>
      </div>

      {/* Escrow Release Action Card */}
      <div className="release-card card">
        <div className="release-info">
          <Icon name="shield" size={28} />
          <div>
            <b>₹{booking.lockedPrice.toFixed(2)} is currently protected in escrow</b>
            <small>
              Release funds only if you are completely satisfied with{" "}
              {booking.technicianName || "the professional"}'s work.
            </small>
          </div>
        </div>

        <div className="release-buttons">
          <Button kind="danger" size="sm" onClick={() => setDisputeOpen(true)}>
            Raise a Dispute
          </Button>
          <Button kind="primary" icon="check" onClick={handleConfirmRelease}>
            Confirm & Release Payment
          </Button>
        </div>
      </div>

      {/* Dispute Modal Dialog */}
      {disputeOpen && (
        <div className="modal-overlay" onClick={() => setDisputeOpen(false)}>
          <div className="modal-card dispute-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <Icon name="alert" size={22} className="danger-icon" />
              <h3>Raise a Service Dispute</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setDisputeOpen(false)}
              >
                <Icon name="close" size={16} />
              </button>
            </div>
            <form onSubmit={handleDisputeSubmit}>
              <p className="dispute-sub">
                Escrow funds of <b>₹{booking.lockedPrice}</b> will be frozen immediately. A HomeCare
                360 resolution officer will inspect the evidence within 2 hours.
              </p>
              <div className="form-group mt-3">
                <label>Reason for Dispute</label>
                <textarea
                  rows={3}
                  value={disputeText}
                  onChange={(e) => setDisputeText(e.target.value)}
                  placeholder="Explain why the work is unsatisfactory (e.g. pipe still dripping, scratches on tiles)..."
                  required
                />
              </div>
              <div className="modal-footer-btns mt-4">
                <Button kind="secondary" onClick={() => setDisputeOpen(false)}>
                  Cancel
                </Button>
                <Button kind="danger" type="submit">
                  Freeze Escrow & Submit Dispute
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
