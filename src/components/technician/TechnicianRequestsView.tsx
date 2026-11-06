import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";
import type { Booking } from "../../types";

type RequestCategoryTab = "all" | "new" | "pending" | "accepted" | "rejected";

export function TechnicianRequestsView() {
  const {
    bookings,
    sendTechnicianQuote,
    acceptTechnicianRequest,
    rejectTechnicianRequest,
    setActiveBookingId,
    setActiveScreen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<RequestCategoryTab>("all");
  const [lightboxPhoto, setLightboxPhoto] = useState<{
    url: string;
    index: number;
    total: number;
  } | null>(null);
  const [rejectingBookingId, setRejectingBookingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("Location is outside service radius");
  const [customRejectReason, setCustomRejectReason] = useState("");
  const [quoteInputs, setQuoteInputs] = useState<Record<string, string>>({});
  const [quoteNotesMap, setQuoteNotesMap] = useState<Record<string, string>>({});
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Dynamic status category counts
  const newRequestsCount = bookings.filter((b) => b.status === "request_submitted").length;
  const pendingRequestsCount = bookings.filter(
    (b) => b.status === "quoted" || b.status === "negotiating",
  ).length;
  const acceptedRequestsCount = bookings.filter((b) =>
    [
      "quotation_accepted",
      "escrow_locked",
      "on_the_way",
      "arrived",
      "work_started",
      "work_completed",
      "payment_released",
    ].includes(b.status),
  ).length;
  const rejectedRequestsCount = bookings.filter((b) => b.status === "cancelled").length;
  const totalCount = bookings.length;

  // Filtered bookings based on activeTab
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "all") return true;
    if (activeTab === "new") return b.status === "request_submitted";
    if (activeTab === "pending") return b.status === "quoted" || b.status === "negotiating";
    if (activeTab === "accepted") {
      return [
        "quotation_accepted",
        "escrow_locked",
        "on_the_way",
        "arrived",
        "work_started",
        "work_completed",
        "payment_released",
      ].includes(b.status);
    }
    if (activeTab === "rejected") return b.status === "cancelled";
    return true;
  });

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "request_submitted":
        return { label: "NEW REQUEST", class: "status-new" };
      case "quoted":
      case "negotiating":
        return { label: "PENDING REVIEW", class: "status-pending" };
      case "quotation_accepted":
      case "escrow_locked":
        return { label: "ACCEPTED · ESCROW LOCKED", class: "status-accepted" };
      case "on_the_way":
      case "arrived":
      case "work_started":
        return { label: "IN PROGRESS", class: "status-in-progress" };
      case "work_completed":
      case "payment_released":
        return { label: "COMPLETED", class: "status-completed" };
      case "cancelled":
        return { label: "DECLINED / REJECTED", class: "status-rejected" };
      default:
        return { label: status.replace(/_/g, " ").toUpperCase(), class: "status-default" };
    }
  };

  const handleAccept = (bookingId: string) => {
    const customPrice = quoteInputs[bookingId] ? Number(quoteInputs[bookingId]) : undefined;
    acceptTechnicianRequest(bookingId, customPrice);
    setSuccessNotice(`Request #${bookingId} accepted! Check Active Jobs to start journey.`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleConfirmReject = () => {
    if (!rejectingBookingId) return;
    const finalReason =
      rejectReason === "other" ? customRejectReason || "Declined by technician" : rejectReason;
    rejectTechnicianRequest(rejectingBookingId, finalReason);
    setRejectingBookingId(null);
    setCustomRejectReason("");
    setSuccessNotice(`Request #${rejectingBookingId} declined.`);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleSendCustomQuote = (bookingId: string) => {
    const price = Number(quoteInputs[bookingId] || 340);
    const note =
      quoteNotesMap[bookingId] ||
      "Standard site visit, diagnostic inspection, and repair with 7-day warranty.";
    sendTechnicianQuote(bookingId, price, note);
    setSuccessNotice(`Quotation of ₹${price} sent for Request #${bookingId}!`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  return (
    <div className="flow-page page-pad tech-requests-view">
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
          <span className="section-kicker">COMMUNITY SERVICE DEMAND · KOREGAON PARK</span>
          <h1>Technician Service Requests</h1>
          <p>
            Review customer service inquiries, inspect photo evidence, prepare quotes, and manage
            bookings.
          </p>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successNotice && (
        <div className="requests-success-banner mt-3">
          <Icon name="check" size={18} />
          <span>{successNotice}</span>
          <button type="button" onClick={() => setSuccessNotice(null)} className="alert-dismiss">
            ×
          </button>
        </div>
      )}

      {/* SUMMARY METRIC CARDS */}
      <div className="requests-summary-grid mt-4">
        {/* Card 1: New Requests */}
        <div
          className={`req-summary-card card-new ${activeTab === "new" ? "active-filter" : ""}`}
          onClick={() => setActiveTab("new")}
          role="button"
          tabIndex={0}
        >
          <div className="req-summary-icon">
            <Icon name="bell" size={22} />
          </div>
          <div className="req-summary-info">
            <span className="req-summary-label">New Requests</span>
            <strong className="req-summary-count">{newRequestsCount}</strong>
            <small className="req-summary-sub">Awaiting your response</small>
          </div>
        </div>

        {/* Card 2: Pending Requests */}
        <div
          className={`req-summary-card card-pending ${activeTab === "pending" ? "active-filter" : ""}`}
          onClick={() => setActiveTab("pending")}
          role="button"
          tabIndex={0}
        >
          <div className="req-summary-icon">
            <Icon name="clock" size={22} />
          </div>
          <div className="req-summary-info">
            <span className="req-summary-label">Pending Requests</span>
            <strong className="req-summary-count">{pendingRequestsCount}</strong>
            <small className="req-summary-sub">Quotes under customer review</small>
          </div>
        </div>

        {/* Card 3: Accepted Requests */}
        <div
          className={`req-summary-card card-accepted ${activeTab === "accepted" ? "active-filter" : ""}`}
          onClick={() => setActiveTab("accepted")}
          role="button"
          tabIndex={0}
        >
          <div className="req-summary-icon">
            <Icon name="check" size={22} />
          </div>
          <div className="req-summary-info">
            <span className="req-summary-label">Accepted Requests</span>
            <strong className="req-summary-count">{acceptedRequestsCount}</strong>
            <small className="req-summary-sub">Booked & active jobs</small>
          </div>
        </div>

        {/* Card 4: Rejected Requests */}
        <div
          className={`req-summary-card card-rejected ${activeTab === "rejected" ? "active-filter" : ""}`}
          onClick={() => setActiveTab("rejected")}
          role="button"
          tabIndex={0}
        >
          <div className="req-summary-icon">
            <Icon name="alert" size={22} />
          </div>
          <div className="req-summary-info">
            <span className="req-summary-label">Rejected Requests</span>
            <strong className="req-summary-count">{rejectedRequestsCount}</strong>
            <small className="req-summary-sub">Declined or cancelled</small>
          </div>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="requests-category-tabs mt-6">
        <button
          type="button"
          className={`category-tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Requests <span className="tab-pill-count">{totalCount}</span>
        </button>
        <button
          type="button"
          className={`category-tab-btn ${activeTab === "new" ? "active" : ""}`}
          onClick={() => setActiveTab("new")}
        >
          New Requests <span className="tab-pill-count">{newRequestsCount}</span>
        </button>
        <button
          type="button"
          className={`category-tab-btn ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending <span className="tab-pill-count">{pendingRequestsCount}</span>
        </button>
        <button
          type="button"
          className={`category-tab-btn ${activeTab === "accepted" ? "active" : ""}`}
          onClick={() => setActiveTab("accepted")}
        >
          Accepted <span className="tab-pill-count">{acceptedRequestsCount}</span>
        </button>
        <button
          type="button"
          className={`category-tab-btn ${activeTab === "rejected" ? "active" : ""}`}
          onClick={() => setActiveTab("rejected")}
        >
          Rejected <span className="tab-pill-count">{rejectedRequestsCount}</span>
        </button>
      </div>

      {/* REQUESTS LIST / CARDS */}
      <div className="requests-list-container mt-5">
        {filteredBookings.length === 0 ? (
          <div className="empty-requests-card card p-8 text-center">
            <div className="empty-requests-icon">
              <Icon name="briefcase" size={44} />
            </div>
            <h3>No {activeTab !== "all" ? `${activeTab} ` : ""}requests found</h3>
            <p className="text-muted mt-2 max-w-md mx-auto">
              {activeTab === "new" &&
                "You have responded to all new incoming requests. New civic customer bookings will appear here automatically."}
              {activeTab === "pending" &&
                "There are no pending quotations awaiting citizen confirmation right now."}
              {activeTab === "accepted" &&
                "No accepted requests found. Accept an incoming request to start a job workflow."}
              {activeTab === "rejected" &&
                "You haven't declined any service requests in this period."}
              {activeTab === "all" && "No requests available in your area at the moment."}
            </p>
            {activeTab !== "all" && (
              <Button
                kind="secondary"
                size="sm"
                className="mt-4"
                onClick={() => setActiveTab("all")}
              >
                View All Requests
              </Button>
            )}
          </div>
        ) : (
          filteredBookings.map((b) => {
            const badge = getStatusBadge(b.status);
            const isNew = b.status === "request_submitted";
            const isQuoted = b.status === "quoted" || b.status === "negotiating";
            const isAccepted = [
              "quotation_accepted",
              "escrow_locked",
              "on_the_way",
              "arrived",
              "work_started",
              "work_completed",
              "payment_released",
            ].includes(b.status);
            const isRejected = b.status === "cancelled";

            return (
              <article key={b.id} className="req-detailed-card card shadow-sm">
                {/* Header Strip */}
                <div className="req-card-strip">
                  <div className="flex items-center gap-2">
                    <span className="req-booking-number">#{b.id}</span>
                    <span className={`status-pill ${badge.class}`}>{badge.label}</span>
                    {b.urgency === "urgent" && (
                      <span className="urgency-pill urgent">
                        <Icon name="bolt" size={12} /> URGENT (Same Day)
                      </span>
                    )}
                  </div>
                  <span className="req-created-time">
                    <Icon name="clock" size={12} /> {b.createdAt}
                  </span>
                </div>

                <div className="req-sections-grid">
                  {/* SECTION 1: CUSTOMER INFORMATION */}
                  <div className="req-section sec-customer">
                    <span className="section-mini-heading">1. Customer Information</span>
                    <div className="customer-profile-block mt-2">
                      <div className="customer-avatar-box">
                        <span className="avatar-initials">
                          {b.citizenName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="customer-details">
                        <h4 className="customer-name">{b.citizenName}</h4>
                        <p className="customer-address">
                          <Icon name="pin" size={13} /> {b.citizenAddress}
                        </p>
                        <div className="customer-contact-row mt-1">
                          <a href={`tel:${b.citizenPhone}`} className="contact-link">
                            <Icon name="phone" size={12} /> {b.citizenPhone}
                          </a>
                          <span className="area-tag">{b.area || "Koregaon Park"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: SERVICE INFORMATION */}
                  <div className="req-section sec-service">
                    <span className="section-mini-heading">2. Service Information</span>
                    <div className="service-details-block mt-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="service-name-text">{b.serviceName}</h4>
                        <span className="category-chip">
                          <Icon name="settings" size={12} /> {b.serviceId || "Plumbing"}
                        </span>
                      </div>
                      <p className="problem-description mt-2">{b.issueDescription}</p>

                      {/* Specialized Garbage Requirements for Technicians */}
                      {b.garbageDetails && (
                        <div className="mt-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                          <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                            <Icon name="truck" size={13} /> SWM Waste Fleet Specifications
                          </span>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap text-emerald-900">
                            <span>
                              <b>Load:</b> {b.garbageDetails.volumeSize}
                            </span>
                            <span>
                              <b>Vehicle:</b> {b.garbageDetails.vehicleType}
                            </span>
                            <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px]">
                              {b.garbageDetails.isSegregated
                                ? "Pre-Segregated (₹20 Rebate)"
                                : "Mixed Load"}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Specialized Bodyguard Requirements for Technicians */}
                      {b.bodyguardRequirements && (
                        <div className="mt-2 p-2.5 rounded-lg bg-violet-50 border border-violet-200 text-xs">
                          <span className="font-bold text-violet-800 flex items-center gap-1.5">
                            <Icon name="guard" size={13} /> Security Brief & Personnel
                            Specifications
                          </span>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap text-violet-950">
                            <span>
                              <b>Tier:</b>{" "}
                              {b.bodyguardRequirements.tier === "armed_pso"
                                ? "Armed PSO"
                                : "VIP Close Protection"}
                            </span>
                            <span>
                              <b>Attire:</b>{" "}
                              {b.bodyguardRequirements.attire === "formal_suit"
                                ? "Dark Suit"
                                : "Tactical Uniform"}
                            </span>
                            <span>
                              <b>Shift:</b> {b.bodyguardRequirements.durationHours} Hours
                            </span>
                            <span>
                              <b>Min Height:</b> {b.bodyguardRequirements.minHeight}
                            </span>
                            <span className="bg-violet-700 text-white px-2 py-0.5 rounded-full text-[10px]">
                              {b.bodyguardRequirements.armsLicenseRequired
                                ? "MHA Form-IV Arms Carry"
                                : "Unarmed"}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="schedule-meta-row mt-2">
                        <span className="meta-item">
                          <Icon name="calendar" size={13} /> <b>Date:</b> {b.scheduledDate}
                        </span>
                        <span className="meta-item">
                          <Icon name="clock" size={13} /> <b>Slot:</b> {b.scheduledTimeWindow}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: CUSTOMER EVIDENCE */}
                  <div className="req-section sec-evidence">
                    <div className="flex items-center justify-between">
                      <span className="section-mini-heading">3. Customer Evidence</span>
                      <span className="evidence-count-badge">
                        <Icon name="camera" size={12} />
                        {b.issuePhotos.length} {b.issuePhotos.length === 1 ? "Photo" : "Photos"}
                      </span>
                    </div>

                    {b.issuePhotos.length > 0 ? (
                      <div className="evidence-thumbnails-grid mt-2">
                        {b.issuePhotos.map((photoUrl, pIdx) => (
                          <div
                            key={pIdx}
                            className="evidence-thumb-container"
                            onClick={() =>
                              setLightboxPhoto({
                                url: photoUrl,
                                index: pIdx + 1,
                                total: b.issuePhotos.length,
                              })
                            }
                            title="Click to enlarge photo evidence"
                          >
                            <img src={photoUrl} alt={`Problem Evidence #${pIdx + 1}`} />
                            <div className="thumb-hover-overlay">
                              <Icon name="search" size={16} />
                            </div>
                            <span className="thumb-index-tag">#{pIdx + 1}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-photos-box mt-2">
                        <Icon name="camera" size={18} />
                        <span>No customer photographs attached</span>
                      </div>
                    )}
                  </div>

                  {/* SECTION 4: BOOKING INFORMATION */}
                  <div className="req-section sec-booking">
                    <span className="section-mini-heading">4. Booking Information</span>
                    <div className="booking-info-table mt-2">
                      <div className="booking-info-row">
                        <span className="info-key">Booking Reference:</span>
                        <span className="info-val font-mono">#{b.id}</span>
                      </div>
                      <div className="booking-info-row">
                        <span className="info-key">Estimated Duration:</span>
                        <span className="info-val">45 – 60 Minutes</span>
                      </div>
                      <div className="booking-info-row">
                        <span className="info-key">Locked Escrow Price:</span>
                        <span className="info-val price-highlight">
                          ₹{b.lockedPrice.toFixed(2)}
                        </span>
                      </div>
                      {isRejected && b.rejectedReason && (
                        <div className="booking-info-row rejection-note-row">
                          <span className="info-key">Decline Reason:</span>
                          <span className="info-val text-red-600">{b.rejectedReason}</span>
                        </div>
                      )}
                      {b.completedAt && (
                        <div className="booking-info-row">
                          <span className="info-key">Completed At:</span>
                          <span className="info-val text-emerald-700">{b.completedAt}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* SECTION 5: ACTIONS BAR */}
                <div className="req-section sec-actions">
                  <div className="actions-bar-inner">
                    {isNew && (
                      <div className="new-request-actions-row">
                        {/* Quick Quote Input */}
                        <div className="quote-input-group">
                          <span className="currency-prefix">₹</span>
                          <input
                            type="number"
                            value={quoteInputs[b.id] ?? b.lockedPrice}
                            onChange={(e) =>
                              setQuoteInputs({ ...quoteInputs, [b.id]: e.target.value })
                            }
                            placeholder="Quote Amount"
                            className="quote-amount-field"
                          />
                        </div>

                        <Button kind="primary" icon="check" onClick={() => handleAccept(b.id)}>
                          Accept Request
                        </Button>

                        <Button
                          kind="secondary"
                          icon="arrow"
                          onClick={() => handleSendCustomQuote(b.id)}
                        >
                          Send Custom Quote
                        </Button>

                        <button
                          type="button"
                          className="reject-link-btn"
                          onClick={() => setRejectingBookingId(b.id)}
                        >
                          Decline Request
                        </button>

                        <Button
                          kind="secondary"
                          icon="chat"
                          onClick={() => {
                            setActiveBookingId(b.id);
                            setActiveScreen("negotiate");
                          }}
                        >
                          Chat with Customer
                        </Button>
                      </div>
                    )}

                    {isQuoted && (
                      <div className="pending-actions-row">
                        <div className="flex items-center gap-2">
                          <span className="status-indicator-dot pending" />
                          <span className="text-sm text-muted">
                            Quotation sent. Awaiting homeowner's escrow lock.
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button kind="primary" icon="check" onClick={() => handleAccept(b.id)}>
                            Accept Immediately
                          </Button>

                          <Button
                            kind="secondary"
                            icon="chat"
                            onClick={() => {
                              setActiveBookingId(b.id);
                              setActiveScreen("negotiate");
                            }}
                          >
                            Chat & Negotiate ({b.chatMessages.length})
                          </Button>

                          <button
                            type="button"
                            className="reject-link-btn"
                            onClick={() => setRejectingBookingId(b.id)}
                          >
                            Withdraw Quote
                          </button>
                        </div>
                      </div>
                    )}

                    {isAccepted && (
                      <div className="accepted-actions-row">
                        <div className="flex items-center gap-2">
                          <span className="status-indicator-dot online" />
                          <span className="text-sm font-semibold text-emerald-800">
                            Active Booking · Funds locked in Escrow (₹{b.lockedPrice})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            kind="primary"
                            icon="arrow"
                            onClick={() => {
                              setActiveBookingId(b.id);
                              setActiveScreen("tech_job");
                            }}
                          >
                            Open Active Job Execution
                          </Button>

                          <Button
                            kind="secondary"
                            icon="chat"
                            onClick={() => {
                              setActiveBookingId(b.id);
                              setActiveScreen("tech_job");
                            }}
                          >
                            Direct Chat
                          </Button>
                        </div>
                      </div>
                    )}

                    {isRejected && (
                      <div className="rejected-actions-row">
                        <span className="text-xs text-muted">
                          This request was declined. You can re-open quotes if customer re-invites.
                        </span>
                        <Button kind="secondary" size="sm" onClick={() => handleAccept(b.id)}>
                          Reconsider & Accept
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* LIGHTBOX MODAL PREVIEW */}
      {lightboxPhoto && (
        <div className="modal-backdrop" onClick={() => setLightboxPhoto(null)}>
          <div className="lightbox-modal-content card" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-header">
              <span className="lightbox-title">
                <Icon name="camera" size={16} /> Customer Photo Evidence ({lightboxPhoto.index} of{" "}
                {lightboxPhoto.total})
              </span>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setLightboxPhoto(null)}
                aria-label="Close Preview"
              >
                ×
              </button>
            </div>
            <div className="lightbox-image-wrap">
              <img src={lightboxPhoto.url} alt="Enlarged issue evidence" />
            </div>
            <div className="lightbox-footer">
              <span className="text-xs text-muted">
                High-resolution civic photographic inspection evidence
              </span>
              <Button kind="secondary" size="sm" onClick={() => setLightboxPhoto(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT CONFIRMATION MODAL */}
      {rejectingBookingId && (
        <div className="modal-backdrop" onClick={() => setRejectingBookingId(null)}>
          <div className="reject-modal-content card p-6" onClick={(e) => e.stopPropagation()}>
            <div className="reject-modal-header">
              <div className="flex items-center gap-2 text-red-600">
                <Icon name="alert" size={24} />
                <h3>Decline Service Request #{rejectingBookingId}</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setRejectingBookingId(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <p className="text-sm text-muted mt-2">
              Please choose a reason for declining this request. This helps the citizen find
              alternative trade technicians quickly.
            </p>

            <div className="reject-reasons-list mt-4 space-y-2">
              {[
                "Location is outside technician's 4 km service zone",
                "Schedule conflict during the requested date/time slot",
                "Job requires specialized heavy machinery or scaffolding",
                "Materials/parts required are currently out of stock",
                "other",
              ].map((r) => (
                <label key={r} className="reject-reason-option">
                  <input
                    type="radio"
                    name="rejectReason"
                    value={r}
                    checked={rejectReason === r}
                    onChange={() => setRejectReason(r)}
                  />
                  <span>{r === "other" ? "Other reason (specify below)" : r}</span>
                </label>
              ))}
            </div>

            {rejectReason === "other" && (
              <div className="form-group mt-3">
                <textarea
                  rows={2}
                  placeholder="State the reason for declining..."
                  value={customRejectReason}
                  onChange={(e) => setCustomRejectReason(e.target.value)}
                  className="w-full text-sm p-2 border rounded-lg"
                />
              </div>
            )}

            <div className="reject-modal-actions mt-6 flex justify-end gap-3">
              <Button kind="secondary" onClick={() => setRejectingBookingId(null)}>
                Keep Request
              </Button>
              <button type="button" className="btn-danger-confirm" onClick={handleConfirmReject}>
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
