import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";

export function AdminRevenueView() {
  const { bookings, setActiveScreen } = useApp();

  const handleApproveBatch = () => {
    alert(
      "Batch payout of ₹42,850 approved. Automated IMPS payouts initiated to verified technician bank accounts.",
    );
  };

  return (
    <div className="flow-page page-pad">
      <div className="flow-title">
        <button
          type="button"
          className="back-btn"
          onClick={() => setActiveScreen("admin_dashboard")}
          aria-label="Back"
        >
          <Icon name="chevron" size={18} />
        </button>
        <div>
          <span className="section-kicker">FINANCIAL REVENUE & ESCROW AUDIT</span>
          <h1>Platform Revenue & Payouts Ledger</h1>
          <p>
            Transparent accounting of gross order volume, 5% platform fees, GST liability, and
            technician disbursements.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid mt-4">
        <div className="stat-card violet">
          <span className="stat-icon-wrap">
            <Icon name="wallet" size={22} />
          </span>
          <small>Gross Marketplace Volume</small>
          <strong>₹18,42,850</strong>
          <em>Month-to-date (June 2026)</em>
        </div>

        <div className="stat-card">
          <span className="stat-icon-wrap">
            <Icon name="chart" size={22} />
          </span>
          <small>HomeCare 5% Fee Revenue</small>
          <strong>₹92,142</strong>
          <em>Net platform operating income</em>
        </div>

        <div className="stat-card">
          <span className="stat-icon-wrap">
            <Icon name="file" size={22} />
          </span>
          <small>GST Remittance (18%)</small>
          <strong>₹16,585</strong>
          <em>Compliant with Indian Tax Code</em>
        </div>

        <div className="stat-card">
          <span className="stat-icon-wrap">
            <Icon name="shield" size={22} />
          </span>
          <small>Active Escrow Reserve</small>
          <strong>₹4,820</strong>
          <em>100% backed in RBI-partner vault</em>
        </div>
      </div>

      {/* Batch Payout Action Banner */}
      <div className="payout-action-banner card p-5 mt-5">
        <div>
          <h3>Pending Technician Disbursements</h3>
          <p>42 verified jobs ready for direct-to-bank settlement batch.</p>
        </div>
        <Button kind="primary" icon="check" onClick={handleApproveBatch}>
          Approve Batch Payout (₹42,850)
        </Button>
      </div>

      {/* Transactions Ledger */}
      <section className="card p-6 mt-6">
        <h3>Master Transactions Ledger</h3>
        <div className="table-scroll mt-3">
          <table>
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Citizen</th>
                <th>Technician</th>
                <th>Gross Paid</th>
                <th>Platform Fee (5%)</th>
                <th>GST (18%)</th>
                <th>Net to Tech</th>
                <th>Payment Mode</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <b>{b.id}</b>
                  </td>
                  <td>{b.citizenName}</td>
                  <td>{b.technicianName || "—"}</td>
                  <td>
                    <b>₹{b.totalPaid.toFixed(2)}</b>
                  </td>
                  <td>₹{b.platformFee.toFixed(2)}</td>
                  <td>₹{b.gstAmount.toFixed(2)}</td>
                  <td className="text-violet font-bold">
                    ₹{(b.lockedPrice - b.platformFee).toFixed(2)}
                  </td>
                  <td>{b.paymentMethod || "UPI"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
