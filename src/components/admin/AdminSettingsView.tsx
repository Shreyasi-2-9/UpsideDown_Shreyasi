import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";

export function AdminSettingsView() {
  const { categories, setActiveScreen } = useApp();
  const [platformFee, setPlatformFee] = useState(5);
  const [gstRate, setGstRate] = useState(18);
  const [rapidSurcharge, setRapidSurcharge] = useState(99);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flow-page page-pad narrow-flow">
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
          <span className="section-kicker">CONFIGURATION & RATE CAPS</span>
          <h1>Platform Settings & Trade Pricing</h1>
          <p>
            Configure civic service categories, commission rates, and emergency response parameters.
          </p>
        </div>
      </div>

      <div className="card p-6 mt-6">
        {saved && (
          <div className="success-banner mb-4">
            <Icon name="check" size={16} />
            <span>Platform pricing rules updated across all 8 trades!</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          <h3>Platform Fee & Taxation Parameters</h3>
          <div className="grid grid-cols-3 gap-4 mt-3">
            <div className="form-group">
              <label>Platform Commission (%)</label>
              <input
                type="number"
                value={platformFee}
                onChange={(e) => setPlatformFee(Number(e.target.value))}
                min={1}
                max={20}
              />
            </div>
            <div className="form-group">
              <label>Applicable GST (%)</label>
              <input
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                min={0}
                max={28}
              />
            </div>
            <div className="form-group">
              <label>Priority Rapid Fee (INR)</label>
              <input
                type="number"
                value={rapidSurcharge}
                onChange={(e) => setRapidSurcharge(Number(e.target.value))}
                min={49}
                max={299}
              />
            </div>
          </div>

          <h3 className="mt-6">Civic Service Categories & Base Price Caps</h3>
          <div className="categories-pricing-table mt-3">
            <table>
              <thead>
                <tr>
                  <th>Trade</th>
                  <th>Base Callout Rate</th>
                  <th>Estimated Duration</th>
                  <th>Active Pros</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <b>{cat.name}</b>
                    </td>
                    <td>
                      <span className="text-violet font-semibold">₹{cat.basePrice}</span>
                    </td>
                    <td>{cat.duration}</td>
                    <td>{cat.availableTechs} verified</td>
                    <td>
                      <span className="status completed">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <Button type="submit" kind="primary">
              Save Configuration
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
