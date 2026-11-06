import { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";
import type { SOSAlert } from "../../types";

type SosStatusFilter = "all" | "active" | "dispatched" | "resolved";

// GIS Coordinate Projection for Pune (Koregaon Park & East Metropolitan District)
const MIN_LAT = 18.526;
const MAX_LAT = 18.564;
const MIN_LON = 73.876;
const MAX_LON = 73.92;
const MAP_WIDTH = 920;
const MAP_HEIGHT = 580;

function projectCoords(lat: number, lon: number) {
  const clampedLat = Math.max(MIN_LAT, Math.min(MAX_LAT, lat));
  const clampedLon = Math.max(MIN_LON, Math.min(MAX_LON, lon));
  const x = ((clampedLon - MIN_LON) / (MAX_LON - MIN_LON)) * MAP_WIDTH;
  const y = MAP_HEIGHT - ((clampedLat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * MAP_HEIGHT;
  return { x: Math.round(x), y: Math.round(y) };
}

export function AdminSosView() {
  const { sosAlerts, resolveSos, assignSosResponder, setActiveScreen } = useApp();

  const [selectedAlertId, setSelectedAlertId] = useState<string>(
    sosAlerts.find((s) => s.status === "active")?.id || sosAlerts[0]?.id || "sos-101",
  );
  const [statusFilter, setStatusFilter] = useState<SosStatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [responderName, setResponderName] = useState<string>(
    "Inspector Vijay Kale (Rapid Safety Patrol #4)",
  );
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  // Dynamic status counts
  const totalCount = sosAlerts.length;
  const activeCount = sosAlerts.filter((s) => s.status === "active").length;
  const dispatchedCount = sosAlerts.filter((s) => s.status === "dispatched").length;
  const resolvedCount = sosAlerts.filter((s) => s.status === "resolved").length;

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return sosAlerts.filter((alert) => {
      if (statusFilter !== "all" && alert.status !== statusFilter) return false;
      if (categoryFilter !== "all" && alert.category !== categoryFilter) return false;
      return true;
    });
  }, [sosAlerts, statusFilter, categoryFilter]);

  const currentAlert =
    sosAlerts.find((s) => s.id === selectedAlertId) || filteredAlerts[0] || sosAlerts[0];

  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    sosAlerts.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [sosAlerts]);

  const handleDispatch = () => {
    if (!currentAlert) return;
    assignSosResponder(currentAlert.id, responderName);
    setActionSuccessNotice(
      `Rapid Response Patrol Unit assigned! ${responderName} dispatched to ${currentAlert.citizenName} at ${currentAlert.location}.`,
    );
    setTimeout(() => setActionSuccessNotice(null), 4500);
  };

  const handleResolve = (id: string) => {
    resolveSos(id);
    setActionSuccessNotice(`Emergency Alert #${id} successfully marked as RESOLVED.`);
    setTimeout(() => setActionSuccessNotice(null), 4000);
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(2.2, prev + 0.3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(1, prev - 0.3));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  const getMarkerIcon = (category?: string) => {
    if (!category) return "sos";
    const lower = category.toLowerCase();
    if (lower.includes("plumb") || lower.includes("water")) return "droplet";
    if (lower.includes("elect") || lower.includes("spark")) return "bolt";
    if (lower.includes("gas") || lower.includes("fire")) return "alert";
    return "sos";
  };

  return (
    <div className="flow-page page-pad admin-sos-portal">
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
          <span className="section-kicker">24/7 MUNICIPAL EMERGENCY RESPONSE · CIVIC GIS GRID</span>
          <h1>Admin SOS Operations Center</h1>
          <p>
            Real-time citizen distress beacon monitor with street-level GIS mapping, rapid responder
            dispatch, and incident resolution.
          </p>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessNotice && (
        <div className="requests-success-banner mt-4">
          <Icon name="check" size={18} />
          <span>{actionSuccessNotice}</span>
          <button
            type="button"
            onClick={() => setActionSuccessNotice(null)}
            className="alert-dismiss"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {/* 4E. TOP SECTION: EMERGENCY SUMMARY METRIC CARDS */}
      <div className="admin-booking-summary-grid mt-5">
        {/* Total SOS Alerts */}
        <div
          className={`summary-metric-card ${statusFilter === "all" ? "active" : ""}`}
          onClick={() => setStatusFilter("all")}
          role="button"
          tabIndex={0}
        >
          <span className="summary-card-icon total">
            <Icon name="bell" size={20} />
          </span>
          <div className="summary-card-content">
            <span className="summary-card-label">Total Incidents</span>
            <strong className="summary-card-count">{totalCount}</strong>
            <small className="summary-card-sub">Recorded distress beacons</small>
          </div>
        </div>

        {/* New / Active Critical Alerts */}
        <div
          className={`summary-metric-card ${statusFilter === "active" ? "active" : ""}`}
          onClick={() => setStatusFilter("active")}
          role="button"
          tabIndex={0}
        >
          <span className="summary-card-icon cancelled">
            <Icon name="sos" size={20} />
          </span>
          <div className="summary-card-content">
            <span className="summary-card-label">New / Critical Alarms</span>
            <strong className="summary-card-count text-red-600">{activeCount}</strong>
            <small className="summary-card-sub">Immediate dispatch required</small>
          </div>
        </div>

        {/* Dispatched / In Progress */}
        <div
          className={`summary-metric-card ${statusFilter === "dispatched" ? "active" : ""}`}
          onClick={() => setStatusFilter("dispatched")}
          role="button"
          tabIndex={0}
        >
          <span className="summary-card-icon pending">
            <Icon name="clock" size={20} />
          </span>
          <div className="summary-card-content">
            <span className="summary-card-label">Patrol Dispatched</span>
            <strong className="summary-card-count text-amber-600">{dispatchedCount}</strong>
            <small className="summary-card-sub">Responder en route / on site</small>
          </div>
        </div>

        {/* Resolved Alerts */}
        <div
          className={`summary-metric-card ${statusFilter === "resolved" ? "active" : ""}`}
          onClick={() => setStatusFilter("resolved")}
          role="button"
          tabIndex={0}
        >
          <span className="summary-card-icon completed">
            <Icon name="check" size={20} />
          </span>
          <div className="summary-card-content">
            <span className="summary-card-label">Resolved & Safe</span>
            <strong className="summary-card-count text-emerald-700">{resolvedCount}</strong>
            <small className="summary-card-sub">Hazard safely neutralized</small>
          </div>
        </div>
      </div>

      {/* MAIN SECTION: BALANCED TWO-COLUMN LAYOUT (DESKTOP) / VERTICALLY STACKED (MOBILE) */}
      <div className="admin-sos-main-layout mt-6">
        {/* LEFT COLUMN: INTERACTIVE SOS GIS STREET MAP */}
        <div className="sos-map-column">
          <div className="card sos-map-container shadow-md">
            {/* Map Header Toolbar with GIS Controls */}
            <div className="map-toolbar-strip p-4 border-b border-outline flex items-center justify-between flex-wrap gap-2 bg-paper">
              <div className="flex items-center gap-2">
                <span className="live-gis-indicator" />
                <span className="text-xs font-bold text-midnight uppercase tracking-wider">
                  Koregaon Park & Eastern Pune GIS Grid
                </span>
                <span
                  className="simulated-gis-pill"
                  title="Demonstration coordinates projected to geographic coordinates"
                >
                  PROJECTION LEDGER
                </span>
              </div>

              {/* Map Controls */}
              <div className="flex items-center gap-2">
                {/* Category Dropdown */}
                {categoriesList.length > 0 && (
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="text-xs p-1.5 border rounded-md bg-white font-medium"
                    aria-label="Filter by emergency category"
                  >
                    <option value="all">All Categories</option>
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                )}

                {/* Zoom Buttons */}
                <div className="map-zoom-buttons flex items-center">
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="zoom-btn"
                    title="Zoom In"
                    aria-label="Zoom In"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="zoom-btn"
                    title="Zoom Out"
                    aria-label="Zoom Out"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="zoom-btn reset"
                    title="Reset Map View"
                    aria-label="Reset View"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* SVG Visual Street Map Canvas */}
            <div className="map-canvas-viewport">
              <svg
                viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                className="sos-vector-map"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "center center",
                  transition: "transform 0.25s ease-out",
                }}
              >
                {/* 1. Map Base Landmass Background */}
                <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#FAF8FF" />

                {/* 2. Municipal Zones and Districts subtle fills */}
                <rect x="20" y="20" width="400" height="260" fill="#F4F0FD" rx="12" />
                <rect x="440" y="20" width="460" height="260" fill="#F0EDFB" rx="12" />
                <rect x="20" y="320" width="880" height="240" fill="#F7F5FE" rx="12" />

                {/* 3. Parks & Green Spaces */}
                {/* Jogger's Park Kalyani Nagar */}
                <path
                  d="M520,70 Q560,50 620,80 Q660,120 600,140 Q540,150 510,110 Z"
                  fill="#E6F5E8"
                  stroke="#C3E9C7"
                  strokeWidth="1.5"
                />
                <text x="545" y="105" fontSize="11" fill="#2E7D32" fontWeight="700">
                  Jogger's Park
                </text>

                {/* Osho Teerth Gardens & Park */}
                <path
                  d="M260,360 Q340,340 380,380 Q390,440 320,460 Q250,450 240,400 Z"
                  fill="#E6F5E8"
                  stroke="#C3E9C7"
                  strokeWidth="1.5"
                />
                <text x="275" y="410" fontSize="11" fill="#2E7D32" fontWeight="700">
                  Osho Gardens
                </text>

                {/* Bund Garden Sanctuary */}
                <path
                  d="M60,240 Q130,230 150,280 Q120,310 50,300 Z"
                  fill="#E6F5E8"
                  stroke="#C3E9C7"
                  strokeWidth="1.5"
                />
                <text x="65" y="275" fontSize="10" fill="#2E7D32" fontWeight="700">
                  Bund Garden
                </text>

                {/* 4. Mula-Mutha River Flowing Through District */}
                <path
                  d="M0,285 Q180,265 340,295 T640,280 T920,295"
                  fill="none"
                  stroke="#CCE3FD"
                  strokeWidth="28"
                  strokeLinecap="round"
                />
                <path
                  d="M0,285 Q180,265 340,295 T640,280 T920,295"
                  fill="none"
                  stroke="#99C7FB"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <text
                  x="390"
                  y="290"
                  fontSize="11"
                  fill="#1E40AF"
                  fontWeight="700"
                  letterSpacing="1"
                >
                  ~ MULA-MUTHA RIVER ~
                </text>

                {/* 5. Major Bridges Connecting North & South */}
                {/* Kalyani Nagar Bridge */}
                <rect
                  x="585"
                  y="260"
                  width="16"
                  height="50"
                  fill="#94A3B8"
                  stroke="#475569"
                  strokeWidth="1"
                  rx="2"
                />
                <text x="605" y="288" fontSize="9" fill="#475569" fontWeight="700">
                  Kalyani Bridge
                </text>

                {/* Bund Garden / Fitzgerald Bridge */}
                <rect
                  x="185"
                  y="260"
                  width="16"
                  height="50"
                  fill="#94A3B8"
                  stroke="#475569"
                  strokeWidth="1"
                  rx="2"
                />
                <text x="110" y="288" fontSize="9" fill="#475569" fontWeight="700">
                  Fitzgerald Bridge
                </text>

                {/* 6. Arterial Streets and Roads Grid */}
                {/* Nagar Road (North) */}
                <line x1="0" y1="45" x2="920" y2="45" stroke="#DDD6FE" strokeWidth="6" />
                <text x="40" y="38" fontSize="10" fill="#6B21A8" fontWeight="700">
                  NAGAR ROAD (AHMEDNAGAR HIGHWAY)
                </text>

                {/* North Main Road (Koregaon Park) */}
                <line x1="30" y1="340" x2="900" y2="340" stroke="#EDE8F9" strokeWidth="8" />
                <line
                  x1="30"
                  y1="340"
                  x2="900"
                  y2="340"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  strokeDasharray="6,4"
                />
                <text x="60" y="333" fontSize="10" fill="#5338DE" fontWeight="700">
                  NORTH MAIN ROAD · KOREGAON PARK
                </text>

                {/* South Main Road (Koregaon Park) */}
                <line x1="40" y1="490" x2="900" y2="490" stroke="#EDE8F9" strokeWidth="8" />
                <line
                  x1="40"
                  y1="490"
                  x2="900"
                  y2="490"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  strokeDasharray="6,4"
                />
                <text x="60" y="483" fontSize="10" fill="#5338DE" fontWeight="700">
                  SOUTH MAIN ROAD
                </text>

                {/* Vertical Intersecting Lanes (Lane 1 through Lane 7) */}
                {[
                  { x: 160, label: "Lane 1" },
                  { x: 280, label: "Lane 3" },
                  { x: 400, label: "Lane 5" },
                  { x: 520, label: "Lane 7" },
                  { x: 680, label: "Kalyani Link" },
                  { x: 800, label: "Ghorpadi Rd" },
                ].map((street) => (
                  <g key={street.x}>
                    <line
                      x1={street.x}
                      y1="340"
                      x2={street.x}
                      y2="490"
                      stroke="#E2DCF2"
                      strokeWidth="4"
                    />
                    <text x={street.x + 5} y="420" fontSize="9" fill="#70677F" fontWeight="600">
                      {street.label}
                    </text>
                  </g>
                ))}

                {/* Kalyani Nagar & Shastri Nagar Crossings (North of River) */}
                <line x1="480" y1="45" x2="590" y2="260" stroke="#E2DCF2" strokeWidth="4" />
                <line x1="680" y1="45" x2="700" y2="260" stroke="#E2DCF2" strokeWidth="4" />
                <line x1="200" y1="45" x2="190" y2="260" stroke="#E2DCF2" strokeWidth="4" />

                {/* 7. Locality District Labels */}
                <text
                  x="320"
                  y="540"
                  fontSize="16"
                  fill="#211B38"
                  fontWeight="800"
                  opacity="0.35"
                  letterSpacing="2"
                >
                  KOREGAON PARK
                </text>
                <text
                  x="620"
                  y="180"
                  fontSize="15"
                  fill="#211B38"
                  fontWeight="800"
                  opacity="0.35"
                  letterSpacing="2"
                >
                  KALYANI NAGAR
                </text>
                <text
                  x="180"
                  y="140"
                  fontSize="14"
                  fill="#211B38"
                  fontWeight="800"
                  opacity="0.35"
                  letterSpacing="2"
                >
                  SHASTRI NAGAR
                </text>
                <text
                  x="740"
                  y="530"
                  fontSize="13"
                  fill="#211B38"
                  fontWeight="800"
                  opacity="0.3"
                  letterSpacing="1"
                >
                  GHORPADI
                </text>

                {/* 8. Interactive SOS Alert Markers */}
                {filteredAlerts.map((alert) => {
                  const hasValidCoords = alert.latitude && alert.longitude;
                  if (!hasValidCoords) return null;

                  const { x, y } = projectCoords(alert.latitude, alert.longitude);
                  const isSelected = alert.id === currentAlert?.id;
                  const isActive = alert.status === "active";
                  const isDispatched = alert.status === "dispatched";
                  const isResolved = alert.status === "resolved";

                  const markerFill = isActive ? "#DC2626" : isDispatched ? "#D97706" : "#16A34A";
                  const radarColor = isActive
                    ? "rgba(220, 38, 38, 0.3)"
                    : "rgba(217, 119, 6, 0.25)";

                  return (
                    <g
                      key={alert.id}
                      className="sos-marker-group cursor-pointer"
                      onClick={() => setSelectedAlertId(alert.id)}
                      tabIndex={0}
                    >
                      {/* Animated Radar Waves on Active Critical Alerts */}
                      {isActive && (
                        <>
                          <circle cx={x} cy={y} r="28" fill={radarColor} className="radar-wave-1" />
                          <circle cx={x} cy={y} r="18" fill={radarColor} className="radar-wave-2" />
                        </>
                      )}

                      {/* Selection Highlight Ring */}
                      {isSelected && (
                        <circle
                          cx={x}
                          cy={y}
                          r="22"
                          fill="none"
                          stroke="#5338DE"
                          strokeWidth="3.5"
                          strokeDasharray="4,2"
                        />
                      )}

                      {/* Main Marker Drop Pin */}
                      <circle
                        cx={x}
                        cy={y}
                        r="12"
                        fill={markerFill}
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                        filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.25))"
                      />

                      {/* Icon inside Pin */}
                      <text
                        x={x}
                        y={y + 4}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#FFFFFF"
                        fontWeight="900"
                      >
                        {isResolved ? "✓" : isActive ? "!" : "⏳"}
                      </text>

                      {/* Resident Callout Label */}
                      <rect
                        x={x - 48}
                        y={y - 32}
                        width="96"
                        height="20"
                        rx="5"
                        fill="#211B38"
                        opacity={isSelected ? 1 : 0.85}
                      />
                      <text
                        x={x}
                        y={y - 18}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#FFFFFF"
                        fontWeight="700"
                      >
                        {alert.citizenName.split(" ")[0]} · {alert.id.toUpperCase()}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Map Legend Footer */}
            <div className="map-legend-footer p-3 border-t border-outline flex items-center justify-between flex-wrap gap-2 text-xs bg-paper">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5 font-semibold text-red-600">
                  <span className="legend-marker-dot active" /> Critical Emergency (New)
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-amber-600">
                  <span className="legend-marker-dot dispatched" /> Patrol Dispatched
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                  <span className="legend-marker-dot resolved" /> Resolved & Secured
                </span>
              </div>
              <span className="text-[11px] text-muted font-mono">
                Lat: 18.536°N | Lon: 73.894°E | Sector: Koregaon Park
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ALERT SELECTION & INCIDENT RESPONSE PANEL */}
        <div className="sos-sidebar-column space-y-5">
          {/* Active Incident Details Card */}
          {currentAlert && (
            <section className="card p-5 incident-details-card shadow-md">
              <div className="flex items-center justify-between border-b border-outline pb-3">
                <div className="flex items-center gap-2">
                  <span className={`beacon-pill ${currentAlert.status}`}>
                    <Icon name="sos" size={16} />
                  </span>
                  <div>
                    <span className="text-xs font-mono font-bold text-violet">
                      #{currentAlert.id}
                    </span>
                    <h3 className="text-base font-extrabold text-midnight m-0">
                      {currentAlert.citizenName}
                    </h3>
                  </div>
                </div>
                <span
                  className={`status-pill ${currentAlert.status === "active" ? "status-rejected" : currentAlert.status === "dispatched" ? "status-pending" : "status-completed"}`}
                >
                  {currentAlert.status === "active"
                    ? "CRITICAL ALARM"
                    : currentAlert.status.toUpperCase()}
                </span>
              </div>

              {/* Incident Description */}
              <div className="incident-meta-box mt-3 p-3 bg-paper rounded-xl border border-outline">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-midnight">
                    {currentAlert.category || "Emergency Assistance Request"}
                  </span>
                  <span className="text-muted font-semibold">{currentAlert.timestamp}</span>
                </div>
                <p className="text-xs text-red-900 mt-2 font-medium leading-relaxed">
                  "{currentAlert.description || currentAlert.notes}"
                </p>
                <div className="text-xs text-muted mt-2 pt-2 border-t border-outline/70 flex items-center justify-between">
                  <span>
                    <Icon name="pin" size={12} /> {currentAlert.location}
                  </span>
                  <span className="font-mono text-[11px]">
                    GPS: {currentAlert.latitude?.toFixed(4)}°N, {currentAlert.longitude?.toFixed(4)}
                    °E
                  </span>
                </div>
              </div>

              {/* Assign Rapid Response Unit */}
              <div className="responder-assign-box mt-4">
                <label className="text-xs font-bold text-midnight block mb-1">
                  Assign Rapid Safety Officer / Emergency Master Pro:
                </label>
                <select
                  value={responderName}
                  onChange={(e) => setResponderName(e.target.value)}
                  className="w-full text-xs p-2.5 border rounded-lg bg-white"
                >
                  <option value="Inspector Vijay Kale (Rapid Safety Patrol #4)">
                    Inspector Vijay Kale (Rapid Safety Patrol #4) — 5 mins away
                  </option>
                  <option value="Ramesh Patil (Master Plumber - Emergency Certified)">
                    Ramesh Patil (Master Plumber - Emergency Certified) — 8 mins away
                  </option>
                  <option value="Sanjay Kumar (Master Plumber - Van #2)">
                    Sanjay Kumar (Master Plumber - Van #2) — 12 mins away
                  </option>
                  <option value="Imran Shaikh (Licensed Wireman - Rapid Unit #3)">
                    Imran Shaikh (Licensed Wireman - Rapid Unit #3) — 10 mins away
                  </option>
                </select>
                {currentAlert.assignedStaff && (
                  <small className="text-xs text-emerald-800 font-semibold block mt-1">
                    ✓ Currently assigned: <b>{currentAlert.assignedStaff}</b>
                  </small>
                )}
              </div>

              {/* Incident Actions Row */}
              <div className="incident-action-buttons mt-5 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${currentAlert.citizenPhone}`}
                  className="btn-call-resident flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-bold border border-outline"
                >
                  <Icon name="phone" size={13} /> Call Resident
                </a>

                {currentAlert.status !== "dispatched" && currentAlert.status !== "resolved" && (
                  <Button kind="primary" size="sm" icon="arrow" onClick={handleDispatch}>
                    Dispatch Unit
                  </Button>
                )}

                {currentAlert.status === "dispatched" && (
                  <Button kind="secondary" size="sm" onClick={handleDispatch}>
                    Reassign Unit
                  </Button>
                )}

                {currentAlert.status !== "resolved" && (
                  <Button
                    kind="success"
                    size="sm"
                    icon="check"
                    className="col-span-2"
                    onClick={() => handleResolve(currentAlert.id)}
                  >
                    Mark Incident as Resolved & Safe
                  </Button>
                )}
              </div>
            </section>
          )}

          {/* Incident Feed List (Synchronized with Map) */}
          <section className="card p-4 sos-feed-card shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-outline">
              <h4 className="text-xs font-bold text-midnight uppercase tracking-wider m-0">
                District Emergency Incidents ({filteredAlerts.length})
              </h4>
              <span className="text-[10px] text-muted">Click row to center on map</span>
            </div>

            <div className="sos-incidents-stack mt-3 space-y-2 max-h-[300px] overflow-y-auto">
              {filteredAlerts.map((alert) => {
                const isSelected = alert.id === currentAlert?.id;
                return (
                  <div
                    key={alert.id}
                    className={`sos-feed-item p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-violet/5 border-violet shadow-sm"
                        : "bg-paper/80 border-outline hover:border-violet/60"
                    }`}
                    onClick={() => setSelectedAlertId(alert.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-midnight">{alert.citizenName}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          alert.status === "active"
                            ? "bg-red-100 text-red-700"
                            : alert.status === "dispatched"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {alert.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted truncate mt-1">
                      {alert.category || alert.notes}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-muted mt-1.5">
                      <span>{alert.location}</span>
                      <span className="font-mono">{alert.timestamp}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
