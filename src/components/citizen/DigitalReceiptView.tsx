import { useApp } from "../../context/AppContext";
import { Brand } from "../common/Brand";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";

export function DigitalReceiptView() {
  const { bookings, activeBookingId, setActiveScreen } = useApp();
  const booking = bookings.find((b) => b.id === activeBookingId) || bookings[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    alert("Tax invoice PDF downloaded: HC360-INVOICE-0621.pdf");
  };

  return (
    <div className="flow-page page-pad receipt-page">
      <div className="success-badge">
        <span className="success-icon-orb">
          <Icon name="check" size={32} />
        </span>
        <h2>All done, Asha!</h2>
        <p>
          {booking.serviceId === "garbage"
            ? `Your payment has been released to ${booking.technicianName || "Kailash Jadhav"}. Municipal recycling certificate generated!`
            : booking.serviceId === "bodyguard"
              ? `Your payment has been released to ${booking.technicianName || "Capt. Vikramaditya Rathore"}. Executive escort completed with zero incidents!`
              : `Your payment has been released to ${booking.technicianName || "Ramesh Patil"}. Your 7-day warranty is now active.`}
        </p>
      </div>

      <article className="receipt card" id="printable-receipt">
        <div className="receipt-head">
          <Brand />
          <span className="invoice-pill">TAX INVOICE / RECEIPT</span>
        </div>

        <div className="receipt-tech">
          <img
            src={
              booking.technicianPhoto ||
              "https://images.unsplash.com/photo-1659353587367-61eb5b8c6ef7?crop=faces&fit=crop&w=320&h=320&q=85"
            }
            alt={booking.technicianName}
          />
          <div>
            <b>{booking.serviceName}</b>
            <small>
              {booking.serviceId === "garbage"
                ? `Completed by ${booking.technicianName || "Kailash Jadhav"} · PMC Certified`
                : booking.serviceId === "bodyguard"
                  ? `Completed by ${booking.technicianName || "Capt. Vikramaditya Rathore"} · PSARA Grade-I`
                  : `Completed by ${booking.technicianName || "Ramesh Patil"} · ITI Verified`}
            </small>
          </div>
          <span className="verified">
            <Icon name="check" size={12} /> Verified Service
          </span>
        </div>

        <dl className="receipt-dl">
          <div>
            <dt>Service Labour Charge</dt>
            <dd>₹{booking.lockedPrice.toFixed(2)}</dd>
          </div>
          <div>
            <dt>Materials & Consumables</dt>
            <dd>₹0.00 (Standard washers included)</dd>
          </div>
          <div>
            <dt>HomeCare Protection & Escrow Fee (5%)</dt>
            <dd>₹{booking.platformFee.toFixed(2)}</dd>
          </div>
          <div>
            <dt>GST (18% - CGST 9% + SGST 9%)</dt>
            <dd>₹{booking.gstAmount.toFixed(2)}</dd>
          </div>
          <div className="total-row">
            <dt>Total Amount Paid</dt>
            <dd>₹{booking.totalPaid.toFixed(2)}</dd>
          </div>
        </dl>

        <div className="receipt-ref-box">
          <div>
            <span>Payment Reference</span>
            <b>{booking.paymentRef || "HC360-0621-4F9C"}</b>
          </div>
          <div>
            <span>Payment Method</span>
            <b>{booking.paymentMethod || "UPI (asha@okhdfcbank)"}</b>
          </div>
        </div>

        {/* 7-Day Warranty Guarantee / Compliance Certificate */}
        <div className="warranty-guarantee-card">
          <Icon name="shield" size={24} />
          <div>
            <b>
              {booking.serviceId === "garbage"
                ? "Municipal Solid Waste (SWM) Recycling Compliance Active"
                : booking.serviceId === "bodyguard"
                  ? "PSARA Armed Close Protection Audit Active"
                  : `7-Day Service Warranty Active until ${booking.warrantyActiveUntil || "28 Jun 2026"}`}
            </b>
            <p>
              {booking.serviceId === "garbage"
                ? "Disposal verified by Pune Municipal Corporation (PMC). 100% of collected segregated waste processed at authorized composting & e-waste facilities."
                : booking.serviceId === "bodyguard"
                  ? "Concealed firearm carry verified under Ministry of Home Affairs Form-IV. Route telemetries and incident-free handover logged in Evidence Vault."
                  : "If the issue recurs within 7 days, a verified master expert will revisit and fix it completely free of charge."}
            </p>
          </div>
        </div>

        {/* Receipt Action Buttons */}
        <div className="receipt-actions">
          <Button kind="secondary" icon="download" size="sm" onClick={handleDownloadPdf}>
            Download PDF
          </Button>
          <Button kind="secondary" icon="print" size="sm" onClick={handlePrint}>
            Print Receipt
          </Button>
        </div>
      </article>

      <div className="receipt-bottom-action">
        <Button
          kind="peach"
          icon="star"
          className="w-full"
          onClick={() => setActiveScreen("review")}
        >
          Review {booking.technicianName || "Professional"}'s Work
        </Button>
      </div>
    </div>
  );
}
