import { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";
import type { Booking, BookingStatus } from "../../types";

type BookingTabCategory = "all" | "pending" | "confirmed" | "active" | "completed" | "cancelled";

export function AdminBookingsView() {
  const {
    bookings,
    categories,
    activeBookingId,
    setActiveBookingId,
    advanceBookingStatus,
    setActiveScreen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<BookingTabCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [inspectBookingId, setInspectBookingId] = useState<string | null>(activeBookingId || null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [enlargedPhoto, setEnlargedPhoto] = useState<string | null>(null);

  // Status Category Mapping Helpers
  const isPending = (status: BookingStatus) =>
    ["request_submitted", "quoted", "negotiating"].includes(status);
  const isConfirmed = (status: BookingStatus) =>
    ["quotation_accepted", "escrow_locked"].includes(status);
  const isActive = (status: BookingStatus) =>
    ["on_the_way", "arrived", "work_started"].includes(status);
  const isCompleted = (status: BookingStatus) =>
    ["work_completed", "payment_released"].includes(status);
  const isCancelled = (status: BookingStatus) => ["cancelled", "disputed"].includes(status);

  // Summary Metrics Counts
  const totalCount = bookings.length;
  const pendingCount = bookings.filter((b) => isPending(b.status)).length;
  const confirmedCount = bookings.filter((b) => isConfirmed(b.status)).length;
  const activeCount = bookings.filter((b) => isActive(b.status)).length;
  const completedCount = bookings.filter((b) => isCompleted(b.status)).length;
  const cancelledCount = bookings.filter((b) => isCancelled(b.status)).length;

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Tab filter
      if (activeTab === "pending" && !isPending(b.status)) return false;
      if (activeTab === "confirmed" && !isConfirmed(b.status)) return false;
      if (activeTab === "active" && !isActive(b.status)) return false;
      if (activeTab === "completed" && !isCompleted(b.status)) return false;
      if (activeTab === "cancelled" && !isCancelled(b.status)) return false;

      // Category filter
      if (categoryFilter !== "all" && b.serviceId !== categoryFilter) return false;

      // Urgency filter
      if (urgencyFilter !== "all" && b.urgency !== urgencyFilter) return false;

      // Search query (Booking ID, Customer Name, Technician Name)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = b.id.toLowerCase().includes(q);
        const matchCustomer = b.citizenName.toLowerCase().includes(q);
        const matchTech = (b.technicianName || "").toLowerCase().includes(q);
        const matchService = b.serviceName.toLowerCase().includes(q);
        const matchArea = (b.area || "").toLowerCase().includes(q);
        if (!matchId && !matchCustomer && !matchTech && !matchService && !matchArea) {
          return false;
        }
      }

      return true;
    });
  }, [bookings, activeTab, categoryFilter, urgencyFilter, searchQuery]);

  const inspectBooking = bookings.find((b) => b.id === inspectBookingId) || null;

  const getStatusBadgeConfig = (status: BookingStatus) => {
    switch (status) {
      case "request_submitted":
      case "quoted":
      case "negotiating":
        return {
          label: status.replace(/_/g, " ").toUpperCase(),
          badgeClass: "badge-status-pending",
        };
      case "quotation_accepted":
      case "escrow_locked":
        return { label: "CONFIRMED · ESCROW", badgeClass: "badge-status-confirmed" };
      case "on_the_way":
      case "arrived":
      case "work_started":
        return {
          label: status.replace(/_/g, " ").toUpperCase(),
          badgeClass: "badge-status-active",
        };
      case "work_completed":
      case "payment_released":
        return { label: "COMPLETED", badgeClass: "badge-status-completed" };
      case "disputed":
        return { label: "DISPUTED", badgeClass: "badge-status-cancelled" };
      case "cancelled":
        return { label: "CANCELLED", badgeClass: "badge-status-cancelled" };
      default:
        return { label: status, badgeClass: "badge-status-pending" };
    }
  };

  const handleClearFilters = () => {
    setActiveTab("all");
    setSearchQuery("");
    setCategoryFilter("all");
    setUrgencyFilter("all");
  };

  const handleResolveDispute = (bookingId: string, releaseToTech: boolean) => {
    if (releaseToTech) {
      advanceBookingStatus(bookingId, "payment_released");
      setActionSuccessMsg(
        `Dispute on #${bookingId} resolved in favor of technician. Escrow funds released.`,
      );
    } else {
      advanceBookingStatus(bookingId, "cancelled");
      setActionSuccessMsg(
        `Dispute on #${bookingId} resolved in favor of customer. 100% Escrow refund credited.`,
      );
    }
    setTimeout(() => setActionSuccessMsg(null), 4500);
  };

  const handleAdminCancel = (bookingId: string) => {
    if (
      window.confirm(
        `Are you sure you want to administratively cancel Booking #${bookingId}? Any locked escrow funds will be refunded.`,
      )
    ) {
      advanceBookingStatus(bookingId, "cancelled");
      setActionSuccessMsg(`Booking #${bookingId} has been cancelled by administrative override.`);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="flow-page page-pad admin-bookings-portal">
      {/* Top Header */}
      <div className="flow-title">
        <button
          type="button"
          className="back-btn"
          onClick={() => setActiveScreen("admin_dashboard")}
          aria-label="Back to Admin Dashboard"
        >
          <Icon name="chevron" size={18} />
        </button>
        <div>
          <span className="section-kicker">CIVIC CONTRACT & ESCROW AUDIT DESK</span>
          <h1>All Bookings & Escrow Management</h1>
          <p>
            Monitor real-time service contracts, inspect evidence vaults, trace customer escrow
            deposits, and mediate disputes.
          </p>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMsg && (
        <div className="requests-success-banner mt-4">
          <Icon name="check" size={18} />
          <span>{actionSuccessMsg}</span>
          <button
            type="button"
            onClick={() => setActionSuccessMsg(null)}
            className="alert-dismiss"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {/* 3A. SUMMARY CARDS */}
      <div className="admin-booking-summary-grid mt-5">
        {/* Total Bookings */}
        <div
          className={`summary-metric-card ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
          role="button"
          tabIndex={0}
        >
          <span className="summary-card-icon total">
            <Icon name="briefcase" size={20} />
          </span>
          <div className="summary-card-content">
            <span className="summary-card-label">Total Bookings</span>
            <strong className="summary-card-count">{totalCount}</strong>
            <small className="summary-card-sub">All platform contracts</small>
          </div>
        </div>

        {/* Pending Bookings */}
        <div
          className={`summary-metric-card ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
          role="button"
          tabIndex={0}
        >
          <span className="summary-card-icon pending">
            <Icon name="clock" size={20} />
          </span>
          <div className="summary-card-content">
            <span className="summary-card-label">Pending Bookings</span>
            <strong className="summary-card-count">{pendingCount}</strong>
            <small className="summary-card-sub">Inquiry & quoting phase</small>
          </div>
        </div>

        {/* Active Bookings */}
        <div
          className={`summary-metric-card ${activeTab === "active" ? "active" : ""}`}
          onClick={() => setActiveTab("active")}
          role="button"
          tabIndex={0}
        >
          <span className="summary-card-icon active">
            <Icon name="hammer" size={20} />
          </span>
          <div className="summary-card-content">
            <span className="summary-card-label">Active On-Site</span>
            <strong className="summary-card-count">{activeCount}</strong>
            <small className="summary-card-sub">On the way or working</small>
          </div>
        </div>

        {/* Completed Bookings */}
        <div
          className={`summary-metric-card ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveTab("completed")}
          role="button"
          tabIndex={0}
        >
          <span className="summary-card-icon completed">
            <Icon name="check" size={20} />
          </span>
          <div className="summary-card-content">
            <span className="summary-card-label">Completed</span>
            <strong className="summary-card-count">{completedCount}</strong>
            <small className="summary-card-sub">Signed-off & released</small>
          </div>
        </div>

        {/* Cancelled / Disputed */}
        <div
          className={`summary-metric-card ${activeTab === "cancelled" ? "active" : ""}`}
          onClick={() => setActiveTab("cancelled")}
          role="button"
          tabIndex={0}
        >
          <span className="summary-card-icon cancelled">
            <Icon name="alert" size={20} />
          </span>
          <div className="summary-card-content">
            <span className="summary-card-label">Cancelled / Disputed</span>
            <strong className="summary-card-count">{cancelledCount}</strong>
            <small className="summary-card-sub">Escrow refunded / disputed</small>
          </div>
        </div>
      </div>

      {/* 3B & 3C. FILTER BAR & CATEGORY TABS */}
      <div className="admin-booking-filters-box card p-5 mt-5">
        {/* Category Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-outline">
          <div className="requests-category-tabs">
            <button
              type="button"
              className={`category-tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              className={`category-tab-btn ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              Pending ({pendingCount})
            </button>
            <button
              type="button"
              className={`category-tab-btn ${activeTab === "confirmed" ? "active" : ""}`}
              onClick={() => setActiveTab("confirmed")}
            >
              Confirmed ({confirmedCount})
            </button>
            <button
              type="button"
              className={`category-tab-btn ${activeTab === "active" ? "active" : ""}`}
              onClick={() => setActiveTab("active")}
            >
              Active ({activeCount})
            </button>
            <button
              type="button"
              className={`category-tab-btn ${activeTab === "completed" ? "active" : ""}`}
              onClick={() => setActiveTab("completed")}
            >
              Completed ({completedCount})
            </button>
            <button
              type="button"
              className={`category-tab-btn ${activeTab === "cancelled" ? "active" : ""}`}
              onClick={() => setActiveTab("cancelled")}
            >
              Cancelled ({cancelledCount})
            </button>
          </div>

          {(searchQuery ||
            categoryFilter !== "all" ||
            urgencyFilter !== "all" ||
            activeTab !== "all") && (
            <button type="button" className="clear-all-filters-btn" onClick={handleClearFilters}>
              Clear All Filters
            </button>
          )}
        </div>

        {/* Search and Secondary Filter Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {/* Search by ID, Customer, Tech */}
          <div className="filter-input-wrap lg:col-span-2">
            <Icon name="search" size={16} />
            <input
              type="text"
              placeholder="Search by Booking ID (#HC-...), Customer name, Technician..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
                aria-label="Clear Search"
              >
                ×
              </button>
            )}
          </div>

          {/* Filter by Service Category */}
          <div className="select-filter-wrap">
            <label className="text-[11px] font-bold text-muted uppercase">Service:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs"
            >
              <option value="all">All Service Trades</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Urgency */}
          <div className="select-filter-wrap">
            <label className="text-[11px] font-bold text-muted uppercase">Urgency:</label>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="text-xs"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent (Same Day Rapid)</option>
              <option value="standard">Standard Scheduled</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3D. BOOKINGS DATA PRESENTATION (STRUCTURED TABLE DESKTOP / STACKED MOBILE) */}
      <div className="admin-bookings-table-card card mt-5 overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="empty-bookings-box p-8 text-center">
            <Icon name="briefcase" size={44} />
            <h3 className="text-base font-bold text-midnight mt-3">No matching booking records</h3>
            <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
              No orders matched your active filter settings. Clear or adjust your search to review
              other bookings.
            </p>
            <Button kind="secondary" size="sm" className="mt-4" onClick={handleClearFilters}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop Structured Data Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="admin-data-table w-full text-left text-xs">
                <thead>
                  <tr className="table-header-row">
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Customer Details</th>
                    <th className="py-3 px-4">Assigned Technician</th>
                    <th className="py-3 px-4">Service & Slot</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Amount & Escrow</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline">
                  {filteredBookings.map((b) => {
                    const badge = getStatusBadgeConfig(b.status);
                    return (
                      <tr key={b.id} className="table-data-row hover:bg-paper/60 transition-colors">
                        {/* Booking Ref */}
                        <td className="py-3.5 px-4 font-mono font-bold text-midnight">
                          #{b.id}
                          {b.urgency === "urgent" && (
                            <span className="block mt-1 text-[10px] text-red-600 font-bold uppercase">
                              ⚡ Urgent Rapid
                            </span>
                          )}
                        </td>

                        {/* Customer Information */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="avatar-chip sm">
                              {b.citizenName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                            <div>
                              <strong className="block text-midnight text-xs">
                                {b.citizenName}
                              </strong>
                              <small className="text-muted block text-[11px]">
                                {b.citizenPhone}
                              </small>
                            </div>
                          </div>
                        </td>

                        {/* Assigned Technician */}
                        <td className="py-3.5 px-4">
                          {b.technicianName ? (
                            <div className="flex items-center gap-2">
                              <span className="avatar-chip sm tech">
                                {b.technicianName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                              <div>
                                <strong className="block text-midnight text-xs">
                                  {b.technicianName}
                                </strong>
                                <small className="text-emerald-700 font-semibold block text-[11px]">
                                  {b.technicianRating
                                    ? `${b.technicianRating}★ Verified Pro`
                                    : "Verified"}
                                </small>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted text-[11px] italic">
                              Awaiting Acceptance
                            </span>
                          )}
                        </td>

                        {/* Service & Slot */}
                        <td className="py-3.5 px-4">
                          <strong
                            className="block text-midnight text-xs truncate max-w-[170px]"
                            title={b.serviceName}
                          >
                            {b.serviceName}
                          </strong>
                          <small className="text-muted block text-[11px]">
                            {b.scheduledDate} · {b.scheduledTimeWindow}
                          </small>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4">
                          <span className="area-badge text-[11px] font-semibold">
                            {b.area || "Koregaon Park"}
                          </span>
                          <small
                            className="block text-muted text-[11px] truncate max-w-[140px]"
                            title={b.citizenAddress}
                          >
                            {b.citizenAddress}
                          </small>
                        </td>

                        {/* Amount & Escrow */}
                        <td className="py-3.5 px-4">
                          <strong className="text-violet font-extrabold text-sm block">
                            ₹{b.totalPaid.toFixed(2)}
                          </strong>
                          <small className="text-muted text-[10px] block">
                            Fee: ₹{b.platformFee.toFixed(1)} (5%)
                          </small>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span className={`status-pill ${badge.badgeClass}`}>{badge.label}</span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              kind="secondary"
                              size="sm"
                              onClick={() => setInspectBookingId(b.id)}
                            >
                              View Details
                            </Button>
                            {b.status !== "cancelled" && b.status !== "work_completed" && (
                              <button
                                type="button"
                                className="icon-action-btn-danger"
                                onClick={() => handleAdminCancel(b.id)}
                                title="Admin Cancel / Refund"
                                aria-label="Cancel Booking"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Responsive Cards */}
            <div className="md:hidden divide-y divide-outline">
              {filteredBookings.map((b) => {
                const badge = getStatusBadgeConfig(b.status);
                return (
                  <div key={b.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-violet text-sm">#{b.id}</span>
                      <span className={`status-pill ${badge.badgeClass}`}>{badge.label}</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-midnight">{b.serviceName}</h4>
                      <p className="text-xs text-muted mt-0.5">
                        <Icon name="calendar" size={12} /> {b.scheduledDate} ·{" "}
                        {b.scheduledTimeWindow}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs p-2.5 bg-paper rounded-xl">
                      <div>
                        <span className="text-muted block text-[10px] uppercase">Customer:</span>
                        <strong className="text-midnight">{b.citizenName}</strong>
                      </div>
                      <div>
                        <span className="text-muted block text-[10px] uppercase">Technician:</span>
                        <strong className="text-midnight">
                          {b.technicianName || "Unassigned"}
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] text-muted block">Locked Escrow:</span>
                        <strong className="text-violet font-extrabold text-base">
                          ₹{b.totalPaid.toFixed(2)}
                        </strong>
                      </div>
                      <Button kind="primary" size="sm" onClick={() => setInspectBookingId(b.id)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* 3E. BOOKING DETAILS MODAL / DRAWER */}
      {inspectBooking && (
        <div className="modal-backdrop" onClick={() => setInspectBookingId(null)}>
          <div
            className="booking-modal-drawer card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="drawer-header p-5 border-b border-outline flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-base font-extrabold text-violet bg-paper px-3 py-1 rounded-lg border border-outline">
                  #{inspectBooking.id}
                </span>
                <div>
                  <h2 className="text-base font-extrabold text-midnight m-0">
                    {inspectBooking.serviceName}
                  </h2>
                  <span className="text-xs text-muted block mt-0.5">
                    Created: <b>{inspectBooking.createdAt}</b> · Area: <b>{inspectBooking.area}</b>
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setInspectBookingId(null)}
                aria-label="Close Modal"
              >
                ×
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="drawer-body p-6 space-y-6 overflow-y-auto max-h-[75vh]">
              {/* Status & Contract Overview */}
              <div className="p-4 bg-paper rounded-2xl border border-outline flex items-center justify-between flex-wrap gap-3">
                <div>
                  <span className="text-xs text-muted uppercase font-bold tracking-wider block">
                    Contract Status:
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`status-pill ${getStatusBadgeConfig(inspectBooking.status).badgeClass}`}
                    >
                      {getStatusBadgeConfig(inspectBooking.status).label}
                    </span>
                    {inspectBooking.urgency === "urgent" && (
                      <span className="urgency-pill urgent">
                        <Icon name="bolt" size={12} /> Rapid Priority
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-muted uppercase font-bold tracking-wider block">
                    Total Amount Paid:
                  </span>
                  <strong className="text-xl font-extrabold text-violet">
                    ₹{inspectBooking.totalPaid.toFixed(2)}
                  </strong>
                </div>
              </div>

              {/* Customer & Technician Side-by-Side Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Details */}
                <div className="p-4 bg-white rounded-xl border border-outline">
                  <span className="text-xs font-bold text-muted uppercase block mb-3">
                    Customer Information
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="avatar-chip md">
                      {inspectBooking.citizenName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-midnight m-0">
                        {inspectBooking.citizenName}
                      </h4>
                      <a
                        href={`tel:${inspectBooking.citizenPhone}`}
                        className="text-xs text-violet font-semibold block mt-0.5"
                      >
                        <Icon name="phone" size={11} /> {inspectBooking.citizenPhone}
                      </a>
                    </div>
                  </div>
                  <p className="text-xs text-muted mt-3">
                    <Icon name="pin" size={12} /> {inspectBooking.citizenAddress}
                  </p>
                </div>

                {/* Technician Details */}
                <div className="p-4 bg-white rounded-xl border border-outline">
                  <span className="text-xs font-bold text-muted uppercase block mb-3">
                    Assigned Technician
                  </span>
                  {inspectBooking.technicianName ? (
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="avatar-chip md tech">
                          {inspectBooking.technicianName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-midnight m-0">
                            {inspectBooking.technicianName}
                          </h4>
                          <span className="text-xs text-emerald-700 font-semibold block mt-0.5">
                            {inspectBooking.technicianRating || "4.9"}★ Verified Master Pro
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted mt-3">
                        <Icon name="phone" size={12} />{" "}
                        {inspectBooking.technicianPhone || "+91 98230 45671"}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-paper rounded-lg text-xs text-muted italic">
                      No technician has accepted this request yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Service Details & Problem Description */}
              <div className="p-4 bg-white rounded-xl border border-outline">
                <span className="text-xs font-bold text-muted uppercase block mb-2">
                  Service Information & Reported Problem
                </span>
                <p className="text-sm text-midnight leading-relaxed bg-paper p-3 rounded-lg border border-outline/70">
                  "{inspectBooking.issueDescription}"
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted flex-wrap">
                  <span>
                    <Icon name="calendar" size={13} /> Scheduled:{" "}
                    <b>{inspectBooking.scheduledDate}</b>
                  </span>
                  <span>
                    <Icon name="clock" size={13} /> Window:{" "}
                    <b>{inspectBooking.scheduledTimeWindow}</b>
                  </span>
                  {inspectBooking.completedAt && (
                    <span className="text-emerald-700 font-semibold">
                      <Icon name="check" size={13} /> Completed: <b>{inspectBooking.completedAt}</b>
                    </span>
                  )}
                </div>
              </div>

              {/* Payment & Escrow Breakdown */}
              <div className="p-4 bg-white rounded-xl border border-outline">
                <span className="text-xs font-bold text-muted uppercase block mb-3">
                  Payment Ledger & Escrow Breakdown
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted">Technician Quoted Base Price:</span>
                    <span className="font-semibold text-midnight">
                      ₹{inspectBooking.lockedPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Material / Replacement Parts:</span>
                    <span className="font-semibold text-midnight">
                      ₹{(inspectBooking.materialCharges || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Platform Commission (5%):</span>
                    <span className="font-semibold text-muted">
                      ₹{inspectBooking.platformFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Civic GST (18% on fee):</span>
                    <span className="font-semibold text-muted">
                      ₹{inspectBooking.gstAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-outline text-sm font-extrabold">
                    <span className="text-midnight">Total Locked in Civic Escrow:</span>
                    <span className="text-violet">₹{inspectBooking.totalPaid.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Customer Photo Evidence Vault */}
              {inspectBooking.issuePhotos && inspectBooking.issuePhotos.length > 0 && (
                <div className="p-4 bg-white rounded-xl border border-outline">
                  <span className="text-xs font-bold text-muted uppercase block mb-3">
                    Customer Problem Photos ({inspectBooking.issuePhotos.length})
                  </span>
                  <div className="flex gap-3 flex-wrap">
                    {inspectBooking.issuePhotos.map((url, idx) => (
                      <div
                        key={idx}
                        className="w-20 h-20 rounded-xl overflow-hidden border-2 border-outline cursor-pointer hover:border-violet transition-colors"
                        onClick={() => setEnlargedPhoto(url)}
                        title="Click to enlarge"
                      >
                        <img
                          src={url}
                          alt={`Evidence #${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Work Cryptographic Evidence */}
              {(inspectBooking.beforeWorkPhoto || inspectBooking.afterWorkPhoto) && (
                <div className="p-4 bg-white rounded-xl border border-outline">
                  <span className="text-xs font-bold text-muted uppercase block mb-3">
                    Cryptographic Before / After Completion Evidence
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {inspectBooking.beforeWorkPhoto && (
                      <div className="p-3 bg-paper rounded-xl border border-outline text-center">
                        <img
                          src={inspectBooking.beforeWorkPhoto}
                          alt="Before Work"
                          className="w-full h-36 object-cover rounded-lg cursor-pointer"
                          onClick={() => setEnlargedPhoto(inspectBooking.beforeWorkPhoto!)}
                        />
                        <span className="text-[11px] font-mono text-muted block mt-2">
                          BEFORE · {inspectBooking.beforeHash || "4F9C-8A21-EVID"}
                        </span>
                      </div>
                    )}
                    {inspectBooking.afterWorkPhoto && (
                      <div className="p-3 bg-paper rounded-xl border border-outline text-center">
                        <img
                          src={inspectBooking.afterWorkPhoto}
                          alt="After Work"
                          className="w-full h-36 object-cover rounded-lg cursor-pointer"
                          onClick={() => setEnlargedPhoto(inspectBooking.afterWorkPhoto!)}
                        />
                        <span className="text-[11px] font-mono text-emerald-700 font-bold block mt-2">
                          AFTER · {inspectBooking.afterHash || "7D32-10AB-EVID"} ✓
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Dispute Resolution Section (if disputed) */}
              {inspectBooking.status === "disputed" && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                    <Icon name="alert" size={18} />
                    <span>Active Customer Dispute Escalation</span>
                  </div>
                  <p className="text-xs text-red-900 mt-2">
                    Customer Reason:{" "}
                    <b>"{inspectBooking.disputeReason || "Service quality grievance."}"</b>
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <Button
                      kind="secondary"
                      size="sm"
                      onClick={() => handleResolveDispute(inspectBooking.id, false)}
                    >
                      Refund Escrow (₹{inspectBooking.lockedPrice}) to Customer
                    </Button>
                    <Button
                      kind="primary"
                      size="sm"
                      onClick={() => handleResolveDispute(inspectBooking.id, true)}
                    >
                      Release Escrow to Technician
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="drawer-footer p-4 border-t border-outline flex items-center justify-between bg-paper">
              <span className="text-xs text-muted">
                Audit Log Reference: AUDIT-{inspectBooking.id}-ESCROW-VERIFIED
              </span>
              <div className="flex items-center gap-2">
                <Button kind="secondary" size="sm" onClick={() => setInspectBookingId(null)}>
                  Close
                </Button>
                {inspectBooking.status !== "cancelled" &&
                  inspectBooking.status !== "work_completed" && (
                    <Button
                      kind="danger"
                      size="sm"
                      onClick={() => handleAdminCancel(inspectBooking.id)}
                    >
                      Cancel Booking
                    </Button>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHOTO LIGHTBOX ENLARGE MODAL */}
      {enlargedPhoto && (
        <div className="modal-backdrop" onClick={() => setEnlargedPhoto(null)}>
          <div className="enlarged-photo-box card" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-3 border-b border-outline">
              <span className="text-xs font-bold text-midnight">
                High-Resolution Evidence Photo
              </span>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEnlargedPhoto(null)}
                aria-label="Close Preview"
              >
                ×
              </button>
            </div>
            <div className="p-2 bg-black flex items-center justify-center max-h-[75vh]">
              <img
                src={enlargedPhoto}
                alt="Evidence inspection"
                className="max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
