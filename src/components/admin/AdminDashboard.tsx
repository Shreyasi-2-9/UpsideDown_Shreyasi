import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";

export function AdminDashboard() {
  const { bookings, technicians, sosAlerts, setActiveScreen, setActiveBookingId } = useApp();
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredJobs = bookings.filter((b) => {
    if (statusFilter === "all") return true;
    return b.status === statusFilter;
  });

  const activeSosCount = sosAlerts.filter((s) => s.status === "active").length;
  const pendingTechCount = technicians.filter((t) => t.verificationStatus === "pending").length;

  return (
    <div className="admin-main page-pad">
      {/* Top Bar */}
      <div className="admin-top">
        <div>
          <span className="section-kicker">CENTRAL CIVIC OPERATIONS DESK · PUNE</span>
          <h1>Good morning, Administrator</h1>
          <p>
            Real-time platform activity, escrow security, technician verifications, and SOS
            monitors.
          </p>
        </div>

        <div className="admin-top-actions">
          {activeSosCount > 0 && (
            <button
              type="button"
              className="admin-sos-pill-alert"
              onClick={() => setActiveScreen("admin_sos")}
            >
              <Icon name="sos" size={16} />
              <span>{activeSosCount} Active Emergency SOS</span>
            </button>
          )}

          <div className="admin-profile-chip">
            <span className="admin-avatar">AD</span>
            <span>Operations Supervisor</span>
          </div>
        </div>
      </div>

      {/* Admin Operations Quick Navigation Ribbon */}
      <div className="admin-quick-nav-ribbon card p-3 mt-4 flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
          <Icon name="grid" size={14} /> Operations Modules:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            className="admin-module-chip"
            onClick={() => setActiveScreen("admin_verification")}
          >
            <Icon name="shield" size={13} />
            <span>KYC Verification ({pendingTechCount} pending)</span>
          </button>
          <button
            type="button"
            className="admin-module-chip"
            onClick={() => setActiveScreen("admin_bookings")}
          >
            <Icon name="briefcase" size={13} />
            <span>All Bookings & Escrow ({bookings.length})</span>
          </button>
          <button
            type="button"
            className="admin-module-chip danger"
            onClick={() => setActiveScreen("admin_sos")}
          >
            <Icon name="sos" size={13} />
            <span>SOS Monitor ({activeSosCount} active)</span>
          </button>
          <button
            type="button"
            className="admin-module-chip"
            onClick={() => setActiveScreen("admin_users")}
          >
            <Icon name="users" size={13} />
            <span>User Directory</span>
          </button>
          <button
            type="button"
            className="admin-module-chip"
            onClick={() => setActiveScreen("admin_revenue")}
          >
            <Icon name="wallet" size={13} />
            <span>Revenue</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="admin-stats mt-4">
        <div className="admin-stat card">
          <span className="admin-stat-icon">
            <Icon name="user" size={20} />
          </span>
          <div>
            <small>Registered Citizens</small>
            <strong>24,892</strong>
            <em>+8.4% this month</em>
          </div>
        </div>

        <div className="admin-stat card">
          <span className="admin-stat-icon">
            <Icon name="shield" size={20} />
          </span>
          <div>
            <small>Verified Technicians</small>
            <strong>3,416</strong>
            <em
              className="cursor-pointer text-violet"
              onClick={() => setActiveScreen("admin_verification")}
            >
              {pendingTechCount} pending KYC
            </em>
          </div>
        </div>

        <div className="admin-stat card">
          <span className="admin-stat-icon">
            <Icon name="briefcase" size={20} />
          </span>
          <div>
            <small>Live Platform Jobs</small>
            <strong>184</strong>
            <em>32 urgent Rapid priority</em>
          </div>
        </div>

        <div className="admin-stat card">
          <span className="admin-stat-icon">
            <Icon name="wallet" size={20} />
          </span>
          <div>
            <small>Gross Value (GMV Today)</small>
            <strong>₹18.4L</strong>
            <em>₹92,000 platform commission (5%)</em>
          </div>
        </div>
      </div>

      {/* Charts & Health Section */}
      <div className="admin-charts mt-6">
        {/* Weekly Service Volume Bar Chart */}
        <section className="card chart-card">
          <div className="section-head">
            <div>
              <h3>Completed Service Orders Volume</h3>
              <p>Weekly trend across all 8 civic trades</p>
            </div>
            <span className="text-muted text-xs">Total this week: 1,420 jobs</span>
          </div>

          <div className="bar-chart mt-4">
            {[
              { day: "Mon", h: 48, label: "180" },
              { day: "Tue", h: 65, label: "220" },
              { day: "Wed", h: 52, label: "195" },
              { day: "Thu", h: 78, label: "260" },
              { day: "Fri", h: 70, label: "245" },
              { day: "Sat", h: 92, label: "310" },
              { day: "Sun", h: 66, label: "230" },
            ].map((col, i) => (
              <div key={i}>
                <span style={{ height: `${col.h}%` }} title={`${col.day}: ${col.label} jobs`} />
                <small>{col.day}</small>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Health Scorecard */}
        <section className="card health-card">
          <div className="section-head">
            <div>
              <h3>Platform Health</h3>
              <p>Quality and safety metrics</p>
            </div>
            <span className="healthy">
              <span className="healthy-dot" /> Operational
            </span>
          </div>

          <div className="health-metrics-list mt-3">
            <div className="health-row">
              <span>Successful Job Rate</span>
              <strong>96.8%</strong>
            </div>
            <div className="health-row">
              <span>Avg. Technician Response Time</span>
              <strong>4m 12s</strong>
            </div>
            <div className="health-row">
              <span>Escrow Dispute Rate</span>
              <strong className="text-amber-600">0.8% (2 active)</strong>
            </div>
            <div className="health-row">
              <span>Active Emergency SOS Alerts</span>
              <strong className={activeSosCount > 0 ? "text-danger" : ""}>{activeSosCount}</strong>
            </div>
            <div className="health-row">
              <span>Pending Technician KYC</span>
              <strong className="text-violet">{pendingTechCount}</strong>
            </div>
          </div>
        </section>
      </div>

      {/* Live Jobs Data Table */}
      <section className="card jobs-table mt-6">
        <div className="section-head">
          <div>
            <h3>Live Platform Service Jobs</h3>
            <p>Real-time monitoring across Pune municipal zones</p>
          </div>

          <div className="table-filter-btns">
            <button
              type="button"
              className={`filter-chip ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              All ({bookings.length})
            </button>
            <button
              type="button"
              className={`filter-chip ${statusFilter === "on_the_way" ? "active" : ""}`}
              onClick={() => setStatusFilter("on_the_way")}
            >
              On the Way
            </button>
            <button
              type="button"
              className={`filter-chip ${statusFilter === "payment_released" ? "active" : ""}`}
              onClick={() => setStatusFilter("payment_released")}
            >
              Completed
            </button>
            <button
              type="button"
              className={`filter-chip ${statusFilter === "disputed" ? "active" : ""}`}
              onClick={() => setStatusFilter("disputed")}
            >
              Disputed
            </button>
          </div>
        </div>

        <div className="table-scroll mt-3">
          <table>
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Citizen</th>
                <th>Assigned Technician</th>
                <th>Trade</th>
                <th>Location</th>
                <th>Status</th>
                <th>Locked Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((b) => (
                <tr key={b.id}>
                  <td>
                    <b>{b.id}</b>
                  </td>
                  <td>{b.citizenName}</td>
                  <td>{b.technicianName || "Matching..."}</td>
                  <td>{b.serviceId}</td>
                  <td>{b.area || "Koregaon Park"}</td>
                  <td>
                    <span className={`status ${b.status.replace(/_/g, "-")}`}>
                      {b.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td>
                    <b>₹{b.totalPaid.toFixed(2)}</b>
                  </td>
                  <td>
                    <Button
                      kind="secondary"
                      size="sm"
                      onClick={() => {
                        setActiveBookingId(b.id);
                        setActiveScreen("admin_bookings");
                      }}
                    >
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
