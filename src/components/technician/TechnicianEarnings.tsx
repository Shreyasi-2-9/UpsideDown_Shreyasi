import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";

interface DayData {
  day: string;
  fullDay: string;
  date: string;
  amount: number;
  jobsCount: number;
  isPeak?: boolean;
}

export function TechnicianEarnings() {
  const { technicians, bookings, setActiveScreen, withdrawTechnicianEarnings } = useApp();
  const tech = technicians[0]; // Ramesh Patil

  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("1500");
  const [withdrawUpi, setWithdrawUpi] = useState(tech.bankDetails?.upiId || "ramesh.patil@upi");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);

  // Dynamic calculations from bookings data
  const completedBookings = bookings.filter((b) =>
    ["work_completed", "payment_released"].includes(b.status),
  );

  const pendingEscrowBookings = bookings.filter((b) =>
    ["quotation_accepted", "escrow_locked", "on_the_way", "arrived", "work_started"].includes(
      b.status,
    ),
  );

  const pendingEscrowTotal = pendingEscrowBookings.reduce(
    (sum, b) => sum + (b.lockedPrice - b.lockedPrice * 0.05),
    0,
  );

  const completedRevenue = completedBookings.reduce(
    (sum, b) => sum + (b.lockedPrice - b.lockedPrice * 0.05),
    0,
  );

  // Weekly data structure (Monday to Sunday)
  const weeklyData: DayData[] = [
    { day: "Mon", fullDay: "Monday", date: "16 Jun", amount: 1450, jobsCount: 3 },
    { day: "Tue", fullDay: "Tuesday", date: "17 Jun", amount: 1820, jobsCount: 4 },
    { day: "Wed", fullDay: "Wednesday", date: "18 Jun", amount: 1200, jobsCount: 2 },
    { day: "Thu", fullDay: "Thursday", date: "19 Jun", amount: 2450, jobsCount: 5, isPeak: true },
    { day: "Fri", fullDay: "Friday", date: "20 Jun", amount: 1650, jobsCount: 3 },
    { day: "Sat", fullDay: "Saturday (Today)", date: "21 Jun", amount: 1840, jobsCount: 4 },
    { day: "Sun", fullDay: "Sunday (Forecast)", date: "22 Jun", amount: 1340, jobsCount: 3 },
  ];

  const thisWeekEarnings = weeklyData.reduce((acc, curr) => acc + curr.amount, 0);
  const totalEarnings = 42650 + completedRevenue;
  const totalCompletedJobs = tech.totalJobs + completedBookings.length;
  const maxBarValue = 2500; // For Y-axis reference scale

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0) return;

    withdrawTechnicianEarnings(amt, withdrawUpi);
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setWithdrawOpen(false);
    }, 2200);
  };

  const earningsHistory = [
    {
      id: "SETTLE-904",
      date: "Today, 12:45 PM",
      job: "HC-2835 · Main Ball Valve Replacement",
      gross: 420.0,
      fee: 21.0,
      net: 399.0,
      status: "Verified in Escrow",
      upi: withdrawUpi,
    },
    {
      id: "SETTLE-903",
      date: "20 Jun 2026",
      job: "HC-2832 · Pipe Leak Detection",
      gross: 340.0,
      fee: 17.0,
      net: 323.0,
      status: "Released to Bank",
      upi: withdrawUpi,
    },
    {
      id: "SETTLE-902",
      date: "19 Jun 2026",
      job: "HC-2825 · Kitchen S-Trap Fitting",
      gross: 249.0,
      fee: 12.45,
      net: 236.55,
      status: "Released to Bank",
      upi: withdrawUpi,
    },
    {
      id: "SETTLE-901",
      date: "18 Jun 2026",
      job: "HC-2819 · Drainage De-clogging",
      gross: 480.0,
      fee: 24.0,
      net: 456.0,
      status: "Released to Bank",
      upi: withdrawUpi,
    },
  ];

  return (
    <div className="flow-page page-pad tech-earnings-view">
      {/* Page Title */}
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
          <span className="section-kicker">FINANCIAL REVENUE & CIVIC ESCROW</span>
          <h1>Technician Earnings & Payouts</h1>
          <p>
            Track released escrow balances, weekly volume trends, and manage instant direct-to-bank
            settlements.
          </p>
        </div>
      </div>

      {/* SUMMARY CARDS (DYNAMIC VALUES) */}
      <div className="stat-grid mt-4">
        {/* Card 1: Total Earnings */}
        <div className="stat-card violet">
          <span className="stat-icon-wrap">
            <Icon name="wallet" size={22} />
          </span>
          <small>Total Lifetime Earnings</small>
          <strong>
            ₹
            {totalEarnings.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </strong>
          <em>428+ verified civic orders</em>
        </div>

        {/* Card 2: This Week's Earnings */}
        <div className="stat-card">
          <span className="stat-icon-wrap">
            <Icon name="chart" size={22} />
          </span>
          <small>This Week's Earnings</small>
          <strong className="text-violet">₹{thisWeekEarnings.toLocaleString("en-IN")}</strong>
          <em>24 jobs · +14% vs last week</em>
        </div>

        {/* Card 3: Pending in Escrow */}
        <div className="stat-card">
          <span className="stat-icon-wrap">
            <Icon name="lock" size={22} />
          </span>
          <small>Pending in Escrow</small>
          <strong className="text-amber-700">₹{pendingEscrowTotal.toFixed(2)}</strong>
          <em>Releases upon customer sign-off</em>
        </div>

        {/* Card 4: Completed Jobs */}
        <div className="stat-card">
          <span className="stat-icon-wrap">
            <Icon name="check" size={22} />
          </span>
          <small>Completed Jobs</small>
          <strong>{totalCompletedJobs}</strong>
          <em>99.4% resolution success rate</em>
        </div>
      </div>

      {/* Instant Payout Action Banner */}
      <div className="payout-action-banner card p-5 mt-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="m-0 text-base font-bold text-midnight">Instant Bank & UPI Withdrawal</h3>
            <span className="status-badge-verified text-[11px] font-bold">5-MIN TRANSFER</span>
          </div>
          <p className="text-xs text-muted mt-1">
            Verified UPI ID: <b>{withdrawUpi}</b> · HDFC Bank A/c ending <b>2834</b> (IFSC:
            HDFC0001244)
          </p>
        </div>
        <Button kind="primary" icon="wallet" onClick={() => setWithdrawOpen(true)}>
          Request Withdrawal
        </Button>
      </div>

      {/* WEEKLY EARNINGS VOLUME BAR CHART */}
      <section className="card chart-card mt-6 p-6">
        <div className="section-head flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="summary-label">PERFORMANCE VOLUME</span>
            <h3 className="text-lg font-bold text-midnight m-0">Weekly Earnings Volume (INR)</h3>
            <p className="text-xs text-muted mt-0.5">
              Net revenue earned Monday through Sunday after standard 5% civic platform commission
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-peak-legend">
              <span className="legend-box peak" /> Peak Day
            </span>
            <span className="badge-standard-legend">
              <span className="legend-box standard" /> Daily Volume
            </span>
            <span className="badge-this-week font-bold">
              Week Total: ₹{thisWeekEarnings.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Clean Chart Container with Y-Axis and Proportional Bars */}
        <div className="weekly-chart-wrapper mt-6">
          {/* Y-Axis Currency Values */}
          <div className="chart-y-axis">
            <span className="y-label">₹2,500</span>
            <span className="y-label">₹2,000</span>
            <span className="y-label">₹1,500</span>
            <span className="y-label">₹1,000</span>
            <span className="y-label">₹500</span>
            <span className="y-label">₹0</span>
          </div>

          {/* Chart Plot Area with Gridlines & Columns */}
          <div className="chart-plot-area">
            {/* Horizontal Gridlines */}
            <div className="chart-gridlines">
              <div className="grid-line" style={{ bottom: "100%" }} />
              <div className="grid-line" style={{ bottom: "80%" }} />
              <div className="grid-line" style={{ bottom: "60%" }} />
              <div className="grid-line" style={{ bottom: "40%" }} />
              <div className="grid-line" style={{ bottom: "20%" }} />
              <div className="grid-line zero-line" style={{ bottom: "0%" }} />
            </div>

            {/* Bars for Mon - Sun */}
            <div className="chart-bars-container">
              {weeklyData.map((item) => {
                const heightPct = Math.min(100, Math.round((item.amount / maxBarValue) * 100));
                const isHovered = hoveredDay?.day === item.day;

                return (
                  <div
                    key={item.day}
                    className={`chart-bar-column ${item.isPeak ? "is-peak" : ""}`}
                    onMouseEnter={() => setHoveredDay(item)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    {/* Tooltip on Hover */}
                    <div className={`bar-hover-tooltip ${isHovered ? "visible" : ""}`}>
                      <strong>₹{item.amount.toLocaleString("en-IN")}</strong>
                      <small>{item.jobsCount} completed jobs</small>
                      <small className="date-tag">{item.date}</small>
                    </div>

                    {/* Bar Pillar */}
                    <div className="bar-track-area">
                      <div
                        className={`bar-fill ${item.isPeak ? "bar-fill-peach" : "bar-fill-violet"}`}
                        style={{ height: `${heightPct}%` }}
                      >
                        {item.isPeak && <span className="peak-star-tag">★ Peak</span>}
                      </div>
                    </div>

                    {/* X-Axis Day Label */}
                    <span className="chart-x-label font-semibold">{item.day}</span>
                    <span className="chart-amount-sub">₹{item.amount}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Interactive Hover Detail Card */}
        {hoveredDay && (
          <div className="chart-hover-detail-banner mt-4">
            <span className="dot-pulse" />
            <span>
              <b>
                {hoveredDay.fullDay} ({hoveredDay.date}):
              </b>{" "}
              Net Earnings <b>₹{hoveredDay.amount.toLocaleString("en-IN")}</b> across{" "}
              <b>{hoveredDay.jobsCount} service requests</b>.
              {hoveredDay.isPeak && " 🚀 Highest earning day of the week!"}
            </span>
          </div>
        )}

        {/* Daily Breakdown Table / List */}
        <div className="daily-breakdown-strip mt-6 pt-4 border-t border-outline">
          <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-3">
            Daily Breakdown & Payout Classification
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {weeklyData.map((d) => (
              <div key={d.day} className={`day-breakdown-card ${d.isPeak ? "peak-card" : ""}`}>
                <span className="day-name">{d.day}</span>
                <strong className="day-val">₹{d.amount}</strong>
                <small className="day-jobs">{d.jobsCount} orders</small>
                <span className="status-tag-mini">Settled ✓</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAYOUT & SETTLEMENT HISTORY TABLE */}
      <section className="card p-6 mt-6">
        <div className="section-head flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-midnight m-0">Recent Escrow Settlements</h3>
            <p className="text-xs text-muted mt-0.5">
              Direct-to-bank settlements for completed service orders with platform fee deductions
            </p>
          </div>
          <span className="text-xs font-mono bg-paper px-3 py-1 rounded-md border border-outline">
            Civic Fee Rate: 5.0%
          </span>
        </div>

        <div className="table-scroll mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline text-left text-xs font-bold text-muted uppercase">
                <th className="py-2.5 px-3">Settlement Ref</th>
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Booking Order</th>
                <th className="py-2.5 px-3">Gross Order</th>
                <th className="py-2.5 px-3">Fee (5%)</th>
                <th className="py-2.5 px-3">Net Payout</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Destination</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {earningsHistory.map((row) => (
                <tr key={row.id} className="hover:bg-paper/50">
                  <td className="py-3 px-3 font-mono font-bold text-midnight">{row.id}</td>
                  <td className="py-3 px-3 text-xs text-muted">{row.date}</td>
                  <td className="py-3 px-3 font-medium text-midnight">{row.job}</td>
                  <td className="py-3 px-3">₹{row.gross.toFixed(2)}</td>
                  <td className="py-3 px-3 text-muted text-xs">-₹{row.fee.toFixed(2)}</td>
                  <td className="py-3 px-3 text-violet font-extrabold">₹{row.net.toFixed(2)}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`status-pill ${row.status.includes("Released") ? "status-completed" : "status-accepted"}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs font-mono text-muted">{row.upi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* WITHDRAWAL MODAL */}
      {withdrawOpen && (
        <div className="modal-backdrop" onClick={() => setWithdrawOpen(false)}>
          <div className="withdraw-modal-card card p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-violet/10 text-violet flex items-center justify-center font-bold">
                  <Icon name="wallet" size={18} />
                </span>
                <h3 className="text-base font-bold text-midnight m-0">
                  Instant Bank & UPI Transfer
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setWithdrawOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-muted mt-2">
              Funds are transferred within 5 minutes via IMPS / UPI direct settlement.
            </p>

            {withdrawSuccess ? (
              <div className="payout-success-box card p-6 mt-4 text-center">
                <span className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-2xl mx-auto">
                  ✓
                </span>
                <h4 className="text-lg font-bold text-midnight mt-3">Transfer Initiated!</h4>
                <p className="text-xs text-muted mt-1">
                  ₹{Number(withdrawAmount).toFixed(2)} is being dispatched to <b>{withdrawUpi}</b>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="mt-4 space-y-4">
                <div className="form-group">
                  <label className="text-xs font-bold text-midnight">Withdrawal Amount (INR)</label>
                  <div className="price-input-wrap mt-1">
                    <span>₹</span>
                    <input
                      type="number"
                      value={withdrawAmount}
                      max="4280"
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      required
                    />
                  </div>
                  <small className="text-muted block mt-1">Available balance: ₹4,280.00</small>
                </div>

                <div className="form-group">
                  <label className="text-xs font-bold text-midnight">Destination UPI ID</label>
                  <input
                    type="text"
                    value={withdrawUpi}
                    onChange={(e) => setWithdrawUpi(e.target.value)}
                    required
                    className="w-full text-sm p-2.5 border rounded-lg mt-1"
                  />
                  <small className="text-muted block mt-1">
                    Linked to HDFC Bank A/c ending 2834
                  </small>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline">
                  <Button kind="secondary" onClick={() => setWithdrawOpen(false)}>
                    Cancel
                  </Button>
                  <Button kind="primary" type="submit" icon="wallet">
                    Confirm Withdrawal (₹{Number(withdrawAmount || 0).toFixed(2)})
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
