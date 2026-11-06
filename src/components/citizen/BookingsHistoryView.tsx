import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";
import type { BookingStatus } from "../../types";

export function BookingsHistoryView() {
  const {
    bookings,
    setActiveBookingId,
    setActiveScreen,
    setIsServiceRequestOpen,
    setSelectedCategoryId,
  } = useApp();
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "disputed">("all");

  const filteredBookings = bookings.filter((b) => {
    if (filter === "all") return true;
    if (filter === "active")
      return b.status !== "payment_released" && b.status !== "cancelled" && b.status !== "disputed";
    if (filter === "completed") return b.status === "payment_released";
    if (filter === "disputed") return b.status === "disputed";
    return true;
  });

  return (
    <div className="flow-page page-pad">
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
          <span className="section-kicker">MY SERVICE RECORDS</span>
          <h1>Service Bookings History</h1>
          <p>Inspect past and active jobs, evidence archives, and active warranty coverage.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="history-filter-tabs">
        <button
          type="button"
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All Jobs ({bookings.length})
        </button>
        <button
          type="button"
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Active & In-Progress
        </button>
        <button
          type="button"
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button
          type="button"
          className={filter === "disputed" ? "active" : ""}
          onClick={() => setFilter("disputed")}
        >
          Disputed
        </button>
      </div>

      {/* Bookings List */}
      <div className="bookings-cards-stack">
        {filteredBookings.length === 0 ? (
          <div className="empty-bookings-card card">
            <Icon name="calendar" size={38} />
            <h3>No bookings found</h3>
            <p>You have no bookings matching the selected filter.</p>
            <Button kind="primary" onClick={() => setIsServiceRequestOpen(true)}>
              Book a Service
            </Button>
          </div>
        ) : (
          filteredBookings.map((b) => (
            <article key={b.id} className="booking-history-item card">
              <div className="b-head">
                <div>
                  <span className="b-id">{b.id}</span>
                  <h3>{b.serviceName}</h3>
                  <small className="b-date">
                    {b.scheduledDate} · {b.scheduledTimeWindow}
                  </small>
                </div>

                <div className="b-price-status">
                  <span className={`status-badge status-${b.status.replace(/_/g, "-")}`}>
                    {b.status.replace(/_/g, " ").toUpperCase()}
                  </span>
                  <strong>₹{b.totalPaid.toFixed(2)}</strong>
                </div>
              </div>

              <div className="b-tech-row">
                <img
                  src={
                    b.technicianPhoto ||
                    "https://images.unsplash.com/photo-1659353587367-61eb5b8c6ef7?crop=faces&fit=crop&w=320&h=320&q=85"
                  }
                  alt={b.technicianName}
                  className="b-tech-avatar"
                />
                <div className="b-tech-info">
                  <b>{b.technicianName || "Technician matching..."}</b>
                  <p>{b.issueDescription}</p>
                </div>
                {b.warrantyActiveUntil && (
                  <div className="b-warranty-chip">
                    <Icon name="shield" size={13} />
                    <span>Warranty active until {b.warrantyActiveUntil}</span>
                  </div>
                )}
              </div>

              <div className="b-actions-row">
                {b.status === "on_the_way" ||
                b.status === "arrived" ||
                b.status === "work_started" ? (
                  <Button
                    kind="primary"
                    size="sm"
                    icon="pin"
                    onClick={() => {
                      setActiveBookingId(b.id);
                      setActiveScreen("tracking");
                    }}
                  >
                    Track Live Location
                  </Button>
                ) : null}

                {b.beforeWorkPhoto || b.afterWorkPhoto ? (
                  <Button
                    kind="secondary"
                    size="sm"
                    icon="camera"
                    onClick={() => {
                      setActiveBookingId(b.id);
                      setActiveScreen("evidence");
                    }}
                  >
                    Evidence Vault
                  </Button>
                ) : null}

                {b.status === "payment_released" && (
                  <Button
                    kind="secondary"
                    size="sm"
                    icon="file"
                    onClick={() => {
                      setActiveBookingId(b.id);
                      setActiveScreen("receipt");
                    }}
                  >
                    View Tax Invoice
                  </Button>
                )}

                <Button
                  kind="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategoryId(b.serviceId);
                    setIsServiceRequestOpen(true);
                  }}
                >
                  Book Again
                </Button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
