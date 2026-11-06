import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";

export function EscrowPaymentView() {
  const { bookings, activeBookingId, lockEscrowPayment, setActiveScreen } = useApp();
  const booking = bookings.find((b) => b.id === activeBookingId) || bookings[0];

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("asha@okhdfcbank");
  const [isProcessing, setIsProcessing] = useState(false);

  const price = booking?.lockedPrice || 340;
  const platformFee = Math.round(price * 0.05);
  const gst = Math.round((price + platformFee) * 0.18 * 100) / 100;
  const total = price + platformFee + gst;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      lockEscrowPayment(booking.id, `UPI (${upiId})`);
      setIsProcessing(false);
      setActiveScreen("tracking");
    }, 1200);
  };

  return (
    <div className="flow-page page-pad narrow-flow">
      <div className="flow-title">
        <button
          type="button"
          className="back-btn"
          onClick={() => setActiveScreen("negotiate")}
          aria-label="Back"
        >
          <Icon name="chevron" size={18} />
        </button>
        <div>
          <span className="section-kicker">STEP 3 OF 8 · ESCROW DEPOSIT</span>
          <h1>Lock Payment in HomeCare Escrow</h1>
          <p>
            Your money is held in a protected vault. The technician gets paid only when you approve
            the completed job.
          </p>
        </div>
      </div>

      <div className="payment-grid">
        {/* Left: Escrow Graphic Card */}
        <section className="escrow-hero card">
          <div className="lock-orb">
            <Icon name="lock" size={44} />
          </div>
          <span className="summary-label">PROTECTED ESCROW AMOUNT</span>
          <h2>₹{total.toFixed(2)}</h2>
          <p>
            Ramesh Patil gets paid <b>only</b> after you inspect the before/after photos and confirm
            your sink is completely leak-free.
          </p>

          <div className="escrow-visual-route">
            <div className="route-node">
              <span className="node-avatar">AS</span>
              <b>You</b>
            </div>
            <div className="route-connector">
              <span className="lock-badge-icon">
                <Icon name="lock" size={18} />
              </span>
              <small>Protected Escrow</small>
            </div>
            <div className="route-node">
              <span className="node-avatar tech">RP</span>
              <b>Ramesh</b>
            </div>
          </div>

          <div className="demo-mode-tag">
            <Icon name="info" size={14} />
            <span>Interactive Demo: Simulated payment for testing workflow</span>
          </div>
        </section>

        {/* Right: Itemized Summary & Method */}
        <aside className="pay-summary card">
          <h2>Payment Summary</h2>
          <dl className="receipt-dl">
            <div>
              <dt>Locked service price</dt>
              <dd>₹{price.toFixed(2)}</dd>
            </div>
            <div>
              <dt>Parts & materials estimate</dt>
              <dd>₹0.00 (Standard washers included)</dd>
            </div>
            <div>
              <dt>Platform protection fee (5%)</dt>
              <dd>₹{platformFee.toFixed(2)}</dd>
            </div>
            <div>
              <dt>GST (18%)</dt>
              <dd>₹{gst.toFixed(2)}</dd>
            </div>
            <div className="total-row">
              <dt>Total Escrow Deposit</dt>
              <dd>₹{total.toFixed(2)}</dd>
            </div>
          </dl>

          <div className="payment-method-choices">
            <label className={`method-choice ${paymentMethod === "upi" ? "selected" : ""}`}>
              <input
                type="radio"
                name="method"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
              />
              <span className="method-icon upi-tag">UPI</span>
              <div className="method-text">
                <strong>UPI / Instant VPA</strong>
                <small>Google Pay, PhonePe, Paytm, BHIM</small>
              </div>
            </label>

            {paymentMethod === "upi" && (
              <div className="upi-input-box">
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="name@okhdfcbank"
                />
              </div>
            )}

            <label className={`method-choice ${paymentMethod === "card" ? "selected" : ""}`}>
              <input
                type="radio"
                name="method"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              <span className="method-icon">
                <Icon name="wallet" size={18} />
              </span>
              <div className="method-text">
                <strong>Credit or Debit Card</strong>
                <small>Visa, Mastercard, RuPay</small>
              </div>
            </label>

            <label className={`method-choice ${paymentMethod === "netbanking" ? "selected" : ""}`}>
              <input
                type="radio"
                name="method"
                checked={paymentMethod === "netbanking"}
                onChange={() => setPaymentMethod("netbanking")}
              />
              <span className="method-icon">
                <Icon name="check" size={18} />
              </span>
              <div className="method-text">
                <strong>Net Banking</strong>
                <small>HDFC, SBI, ICICI, Axis</small>
              </div>
            </label>
          </div>

          <Button
            kind="primary"
            icon="lock"
            className="w-full mt-4"
            disabled={isProcessing}
            onClick={handlePay}
          >
            {isProcessing
              ? "Depositing into Escrow..."
              : `Deposit ₹${total.toFixed(2)} into Escrow`}
          </Button>

          <div className="security-badges-row">
            <span>
              <Icon name="shield" size={13} /> 256-bit Encrypted
            </span>
            <span>
              <Icon name="check" size={13} /> RBI Compliant
            </span>
            <span>
              <Icon name="lock" size={13} /> 100% Refundable
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
