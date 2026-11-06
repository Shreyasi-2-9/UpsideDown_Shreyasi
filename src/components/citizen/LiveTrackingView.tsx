import { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";
import type { BookingStatus } from "../../types";

export function LiveTrackingView() {
  const { bookings, activeBookingId, advanceBookingStatus, setActiveScreen, setIsSosOpen } =
    useApp();

  const booking = bookings.find((b) => b.id === activeBookingId) || bookings[0];
  const [eta, setEta] = useState(12);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeLayer, setActiveLayer] = useState<"standard" | "traffic">("standard");
  const [selectedPin, setSelectedPin] = useState<"technician" | "home" | null>(null);

  const timelineSteps: { key: BookingStatus; label: string; sub: string }[] = [
    { key: "request_submitted", label: "Request submitted", sub: "10:30 AM · Verified" },
    { key: "quoted", label: "Technician assigned & quoted", sub: "10:42 AM · 3 quotes" },
    { key: "quotation_accepted", label: "Quotation agreed", sub: "10:46 AM · ₹340 locked" },
    { key: "escrow_locked", label: "Payment held in escrow", sub: "10:48 AM · ₹418.12" },
    { key: "on_the_way", label: "Technician on the way", sub: "GPS live tracking active" },
    { key: "arrived", label: "Technician arrived", sub: "Doorstep identity check" },
    { key: "work_started", label: "Work in progress", sub: "Before photos captured" },
    { key: "work_completed", label: "Work completed", sub: "After photos verified" },
    { key: "payment_released", label: "Customer confirmation", sub: "Warranty active 7 days" },
  ];

  const currentStatusIndex = timelineSteps.findIndex((s) => s.key === booking.status);
  const activeIdx = currentStatusIndex >= 0 ? currentStatusIndex : 4; // default on_the_way

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 1.75));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="tracking-page">
      {/* High-Fidelity Street Map Side */}
      <div className="map map-container-enhanced" aria-label="Simulated GPS Live Map">
        {/* Floating Top HUD: ETA Card */}
        <div className="map-hud-top">
          <div className="map-chip-enhanced">
            <span className="live-gps-dot" />
            <div>
              <div className="flex items-center gap-2">
                <span className="eta-badge">{eta} MINS AWAY</span>
                <span className="telemetry-tag">Simulated Live GPS</span>
              </div>
              <small className="route-sub-text">
                1.2 km via North Main Rd → Lane 5 (Traffic: Smooth)
              </small>
            </div>
          </div>
        </div>

        {/* Map Floating Controls: Zoom & Layers */}
        <div className="map-floating-controls" aria-label="Map Controls">
          <button
            type="button"
            className="map-ctrl-btn"
            onClick={handleZoomIn}
            title="Zoom in (+)"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            className="map-ctrl-btn"
            onClick={handleZoomOut}
            title="Zoom out (-)"
            aria-label="Zoom out"
          >
            –
          </button>
          <button
            type="button"
            className="map-ctrl-btn"
            onClick={handleResetZoom}
            title="Reset map view"
            aria-label="Reset zoom"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button
            type="button"
            className={`map-ctrl-btn text-xs ${activeLayer === "traffic" ? "active" : ""}`}
            onClick={() => setActiveLayer(activeLayer === "standard" ? "traffic" : "standard")}
            title="Toggle Traffic Layer"
          >
            🚦
          </button>
        </div>

        {/* Scalable Vector Street Map Canvas for Koregaon Park */}
        <div
          className="map-viewport-scalable"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "center center",
            transition: "transform 0.25s ease",
          }}
        >
          <svg
            viewBox="0 0 1000 680"
            className="koregaon-park-svg-map"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Pattern for building roofs */}
              <pattern id="buildingHatch" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M0 8 L8 0" stroke="#D8D0C3" strokeWidth="1" />
              </pattern>

              {/* Water Wave Pattern */}
              <pattern id="waterWave" width="20" height="12" patternUnits="userSpaceOnUse">
                <path d="M0 6 Q5 0, 10 6 T20 6" fill="none" stroke="#B8D7EF" strokeWidth="1.2" />
              </pattern>

              {/* Clip path for technician avatar pin */}
              <clipPath id="techAvatarClip">
                <circle cx="0" cy="0" r="18" />
              </clipPath>

              {/* Shadow Filters */}
              <filter id="softShadow" x="-15%" y="-15%" width="130%" height="130%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.16" />
              </filter>
              <filter id="markerGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow
                  dx="0"
                  dy="6"
                  stdDeviation="8"
                  floodColor="#5338DE"
                  floodOpacity="0.38"
                />
              </filter>
            </defs>

            {/* Background Canvas: Suburban Fabric */}
            <rect x="0" y="0" width="1000" height="680" fill="#F4F1EA" />

            {/* Mula-Mutha River Along North Edge */}
            <path d="M 0,0 L 1000,0 L 1000,120 Q 750,150 500,110 T 0,135 Z" fill="#D4E7F5" />
            <path
              d="M 0,0 L 1000,0 L 1000,120 Q 750,150 500,110 T 0,135 Z"
              fill="url(#waterWave)"
              opacity="0.6"
            />
            <text x="380" y="65" fill="#3D77A2" fontSize="13" fontWeight="700" letterSpacing="2">
              MULA - MUTHA RIVER · PUNE
            </text>

            {/* Green Spaces & Public Parks */}
            {/* Osho Teerth Park & Meditation Resort */}
            <path
              d="M 120,160 Q 240,140 340,190 T 360,330 Q 260,380 140,320 Z"
              fill="#D5E8CE"
              stroke="#B4D7AA"
              strokeWidth="2"
            />
            <text x="170" y="240" fill="#467E3F" fontSize="12" fontWeight="800" letterSpacing="1">
              OSHO TEERTH PARK
            </text>
            <text x="170" y="258" fill="#5E9657" fontSize="10">
              International Meditation Resort
            </text>

            {/* Bund Garden Promenade */}
            <rect x="0" y="145" width="90" height="180" rx="8" fill="#DBECCE" />
            <text
              x="12"
              y="215"
              fill="#4B8144"
              fontSize="10"
              fontWeight="700"
              transform="rotate(-90 12,215)"
            >
              BUND GARDEN
            </text>

            {/* Jogger's Park Near Lane 6 */}
            <rect
              x="760"
              y="240"
              width="180"
              height="120"
              rx="14"
              fill="#DBECCE"
              stroke="#B4D7AA"
              strokeWidth="1.5"
            />
            <text x="795" y="300" fill="#467E3F" fontSize="11" fontWeight="700">
              JOGGER'S PARK
            </text>
            <text x="800" y="318" fill="#5E9657" fontSize="9">
              Kalyani Nagar Bridge
            </text>

            {/* Building Parcels & Societies (Detailed Urban Grid) */}
            <g fill="#E4DED4" stroke="#D3CBC0" strokeWidth="1">
              {/* Cluster A: North Main Rd Commercial */}
              <rect x="360" y="160" width="85" height="60" rx="4" />
              <rect x="460" y="155" width="110" height="65" rx="4" />
              <rect x="590" y="160" width="95" height="60" rx="4" />
              <rect x="700" y="150" width="120" height="70" rx="4" />

              {/* Cluster B: Lane 5 Society Blocks */}
              <rect x="420" y="330" width="130" height="80" rx="6" />
              <rect x="420" y="430" width="130" height="90" rx="6" />
              <rect x="420" y="540" width="130" height="90" rx="6" />

              {/* Destination Building: GANGA CARNATION (Citizen's Apartment) */}
              <rect
                x="670"
                y="430"
                width="150"
                height="110"
                rx="8"
                fill="#ECE6DD"
                stroke="#5338DE"
                strokeWidth="2.5"
                filter="url(#softShadow)"
              />
              <rect
                x="680"
                y="440"
                width="130"
                height="90"
                fill="url(#buildingHatch)"
                opacity="0.3"
              />

              {/* Hermes Heritage */}
              <rect x="670" y="330" width="150" height="80" rx="6" />
              <rect x="670" y="560" width="150" height="85" rx="6" />
            </g>

            {/* Society Names / Badges */}
            <text x="688" y="475" fill="#211B38" fontSize="11" fontWeight="800">
              GANGA CARNATION
            </text>
            <text x="688" y="492" fill="#5338DE" fontSize="10" fontWeight="700">
              Flat 402 (Your Home)
            </text>
            <text x="688" y="365" fill="#70677F" fontSize="10" fontWeight="600">
              Hermes Heritage
            </text>

            {/* Popular Landmarks Badges */}
            {/* German Bakery Landmark */}
            <g transform="translate(370, 290)">
              <rect
                x="0"
                y="0"
                width="96"
                height="24"
                rx="12"
                fill="#FFFFFF"
                stroke="#DED7EE"
                strokeWidth="1"
                filter="url(#softShadow)"
              />
              <circle cx="12" cy="12" r="7" fill="#FFA985" />
              <text x="10" y="15" fill="#FFFFFF" fontSize="9">
                ☕
              </text>
              <text x="24" y="15" fill="#211B38" fontSize="9" fontWeight="700">
                German Bakery
              </text>
            </g>

            {/* Chabad House Landmark */}
            <g transform="translate(480, 290)">
              <rect
                x="0"
                y="0"
                width="86"
                height="24"
                rx="12"
                fill="#FFFFFF"
                stroke="#DED7EE"
                strokeWidth="1"
                filter="url(#softShadow)"
              />
              <text x="8" y="15" fill="#70677F" fontSize="9" fontWeight="700">
                Chabad House
              </text>
            </g>

            {/* Koregaon Park Plaza Landmark */}
            <g transform="translate(710, 220)">
              <rect
                x="0"
                y="0"
                width="88"
                height="24"
                rx="12"
                fill="#FFFFFF"
                stroke="#DED7EE"
                strokeWidth="1"
                filter="url(#softShadow)"
              />
              <text x="8" y="15" fill="#5338DE" fontSize="9" fontWeight="700">
                KP Plaza Mall
              </text>
            </g>

            {/* ROAD NETWORK CASINGS (Grey background strokes) */}
            <g fill="none" stroke="#DDD7CB" strokeLinecap="round" strokeLinejoin="round">
              {/* North Main Road (Wide Major Arterial) */}
              <path d="M 0,250 L 1000,250" strokeWidth="38" />
              {/* South Main Road */}
              <path d="M 0,660 L 1000,660" strokeWidth="34" />
              {/* Lane 5 (Vertical Connector) */}
              <path d="M 600,250 L 600,660" strokeWidth="30" />
              {/* Lane 4 */}
              <path d="M 370,250 L 370,660" strokeWidth="24" />
              {/* Lane 6 */}
              <path d="M 770,250 L 770,660" strokeWidth="24" />
              {/* Residential access road into Ganga Carnation */}
              <path d="M 600,480 L 740,480" strokeWidth="22" />
            </g>

            {/* ROAD SURFACE (White pavement) */}
            <g fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 0,250 L 1000,250" strokeWidth="30" />
              <path d="M 0,660 L 1000,660" strokeWidth="26" />
              <path d="M 600,250 L 600,660" strokeWidth="22" />
              <path d="M 370,250 L 370,660" strokeWidth="18" />
              <path d="M 770,250 L 770,660" strokeWidth="18" />
              <path d="M 600,480 L 740,480" strokeWidth="16" />
            </g>

            {/* Centerline dashes for North Main Rd */}
            <path
              d="M 0,250 L 1000,250"
              fill="none"
              stroke="#F2E6C2"
              strokeWidth="2"
              strokeDasharray="14 10"
            />
            {/* Centerline dashes for Lane 5 */}
            <path
              d="M 600,260 L 600,660"
              fill="none"
              stroke="#E8E2D5"
              strokeWidth="1.5"
              strokeDasharray="8 6"
            />

            {/* Optional Live Traffic Simulation Overlay */}
            {activeLayer === "traffic" && (
              <g fill="none" strokeLinecap="round" opacity="0.6">
                <path d="M 0,254 L 300,254" stroke="#48BB78" strokeWidth="4" />
                <path d="M 300,254 L 600,254" stroke="#ECC94B" strokeWidth="4" />
                <path d="M 600,254 L 1000,254" stroke="#48BB78" strokeWidth="4" />
                <path d="M 604,260 L 604,480" stroke="#48BB78" strokeWidth="4" />
              </g>
            )}

            {/* Street Name Typography Overlays */}
            <text x="60" y="246" fill="#70677F" fontSize="11" fontWeight="700" letterSpacing="1">
              NORTH MAIN ROAD (KOREGAON PARK)
            </text>
            <text x="60" y="656" fill="#70677F" fontSize="11" fontWeight="700" letterSpacing="1">
              SOUTH MAIN ROAD
            </text>
            <text
              x="608"
              y="320"
              fill="#70677F"
              fontSize="10"
              fontWeight="700"
              transform="rotate(90 608,320)"
            >
              LANE 5
            </text>
            <text
              x="378"
              y="320"
              fill="#70677F"
              fontSize="10"
              fontWeight="700"
              transform="rotate(90 378,320)"
            >
              LANE 4
            </text>
            <text
              x="778"
              y="320"
              fill="#70677F"
              fontSize="10"
              fontWeight="700"
              transform="rotate(90 778,320)"
            >
              LANE 6
            </text>

            {/* CONTRASTING ACTIVE NAVIGATION ROUTE */}
            {/* Outer high-contrast violet path */}
            <path
              d="M 280,250 L 600,250 L 600,480 L 720,480"
              fill="none"
              stroke="#5338DE"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#markerGlow)"
            />
            {/* Inner dynamic animated peach dash */}
            <path
              d="M 280,250 L 600,250 L 600,480 L 720,480"
              fill="none"
              stroke="#FFC1A6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8 6"
              className="animated-route-dash"
            />

            {/* CITIZEN RESIDENCE (HOME PIN) MARKER AT (720, 480) */}
            <g
              transform="translate(720, 480)"
              className="map-home-group cursor-pointer"
              onClick={() => setSelectedPin("home")}
            >
              {/* Pulsing Target Rings */}
              <circle
                cx="0"
                cy="0"
                r="28"
                fill="#5338DE"
                opacity="0.12"
                className="pulse-ring-slow"
              />
              <circle
                cx="0"
                cy="0"
                r="18"
                fill="#5338DE"
                opacity="0.2"
                className="pulse-ring-fast"
              />

              {/* Pin Base */}
              <path
                d="M 0,0 L -14,-26 A 14,14 0 1,1 14,-26 Z"
                fill="#211B38"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                filter="url(#softShadow)"
              />
              <circle cx="0" cy="-26" r="10" fill="#FFC1A6" />
              {/* Home Icon Glyph */}
              <path
                d="M -5,-25 L 0,-29 L 5,-25 L 5,-22 L -5,-22 Z M -3,-22 L -3,-20 L 3,-20 L 3,-22 Z"
                fill="#211B38"
              />

              {/* Tooltip Tag */}
              <g transform="translate(0, -52)">
                <rect x="-80" y="0" width="160" height="22" rx="6" fill="#211B38" />
                <text x="0" y="15" fill="#FFFFFF" fontSize="9" fontWeight="700" textAnchor="middle">
                  YOUR HOME · Flat 402, Ganga Carnation
                </text>
              </g>
            </g>

            {/* TECHNICIAN PRO MARKER AT (280, 250) on North Main Road */}
            <g
              transform="translate(280, 250)"
              className="map-tech-marker cursor-pointer"
              onClick={() => setSelectedPin("technician")}
            >
              {/* Moving Pulse Radar Waves */}
              <circle
                cx="0"
                cy="0"
                r="34"
                fill="#5338DE"
                opacity="0.18"
                className="pulse-radar-wave"
              />
              <circle cx="0" cy="0" r="22" fill="#5338DE" opacity="0.25" />

              {/* Pin Pointer Base */}
              <path
                d="M 0,0 L -18,-30 A 20,20 0 1,1 18,-30 Z"
                fill="#5338DE"
                stroke="#FFFFFF"
                strokeWidth="3"
                filter="url(#markerGlow)"
              />

              {/* Technician Avatar Photo */}
              <g transform="translate(0, -32)">
                <circle cx="0" cy="0" r="18" fill="#FFFFFF" />
                <image
                  href={
                    booking.technicianPhoto ||
                    "https://images.unsplash.com/photo-1659353587367-61eb5b8c6ef7?crop=faces&fit=crop&w=320&h=320&q=85"
                  }
                  x="-18"
                  y="-18"
                  width="36"
                  height="36"
                  clipPath="url(#techAvatarClip)"
                />
                <circle cx="0" cy="0" r="18" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
              </g>

              {/* Vehicle Indicator Badge */}
              <g transform="translate(14, -14)">
                <circle cx="0" cy="0" r="9" fill="#211B38" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="0" y="3" fontSize="9" textAnchor="middle" fill="#FFFFFF">
                  🛵
                </text>
              </g>

              {/* Live Info Label Tooltip */}
              <g transform="translate(0, -68)">
                <rect
                  x="-95"
                  y="0"
                  width="190"
                  height="26"
                  rx="8"
                  fill="#5338DE"
                  filter="url(#softShadow)"
                />
                <text x="0" y="13" fill="#FFFFFF" fontSize="9" fontWeight="800" textAnchor="middle">
                  {booking.technicianName || "Ramesh Patil"} (Technician)
                </text>
                <text x="0" y="22" fill="#FFC1A6" fontSize="8" fontWeight="600" textAnchor="middle">
                  1.2 km away · Moving at 22 km/h
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* Bottom Left Status & Speed Telemetry Bar */}
        <div className="map-bottom-telemetry">
          <div className="telemetry-pill">
            <span className="telemetry-icon">📍</span>
            <span>
              Current: <b>North Main Rd (near Osho Park)</b>
            </span>
          </div>
          <div className="telemetry-pill">
            <span className="telemetry-icon">⚡</span>
            <span>
              Speed: <b>22 km/h</b>
            </span>
          </div>
          <div className="telemetry-pill">
            <span className="telemetry-icon">🛡️</span>
            <span>
              Safety: <b>GPS Verified Route</b>
            </span>
          </div>
        </div>

        {/* Bottom Right Disclaimer */}
        <div className="map-disclaimer-enhanced">
          <Icon name="info" size={13} />
          <span>Simulated GPS Live Telemetry (Demo Environment) · Koregaon Park, Pune</span>
        </div>
      </div>

      {/* Right Details Panel */}
      <aside className="tracking-panel">
        <div className="flow-title">
          <button
            type="button"
            className="back-btn"
            onClick={() => setActiveScreen("home")}
            aria-label="Back to dashboard"
          >
            <Icon name="chevron" size={18} />
          </button>
          <div>
            <span className="section-kicker">STEP 4 OF 8 · LIVE TRACKING</span>
            <h1>{booking.technicianName} is On The Way</h1>
            <p>Live location is securely shared until arrival at Flat 402, Ganga Carnation.</p>
          </div>
        </div>

        {/* Technician / Specialist Card */}
        <div className="tracking-tech">
          <img
            src={
              booking.technicianPhoto ||
              "https://images.unsplash.com/photo-1659353587367-61eb5b8c6ef7?crop=faces&fit=crop&w=320&h=320&q=85"
            }
            alt={booking.technicianName}
          />
          <div className="tech-details">
            <b>{booking.technicianName}</b>
            <span>
              <Icon name="star" size={13} className="star-icon" /> {booking.technicianRating || 4.9}{" "}
              ·{" "}
              {booking.serviceId === "garbage"
                ? "SWM Municipal Specialist"
                : booking.serviceId === "bodyguard"
                  ? "Armed Close Protection Officer (PSO)"
                  : "Master Technician"}
            </span>
            <small>
              {booking.serviceId === "garbage"
                ? "PMC Municipal Bio-Processing Certified · Tipper Fleet"
                : booking.serviceId === "bodyguard"
                  ? "PSARA Grade-I & MHA Form-IV Arms Licensed"
                  : "Government ITI Certified · Pune Board"}
            </small>
          </div>
          <a
            href={`tel:${booking.technicianPhone || "+919823045671"}`}
            className="action-circle-btn"
            title={`Call ${booking.technicianName}`}
          >
            <Icon name="phone" size={16} />
          </a>
          <button
            type="button"
            className="action-circle-btn"
            onClick={() => setActiveScreen("negotiate")}
            title={`Chat with ${booking.technicianName}`}
          >
            <Icon name="chat" size={16} />
          </button>
        </div>

        {/* Specialized Telemetry Banner for Garbage or Bodyguard */}
        {booking.serviceId === "garbage" && booking.garbageDetails && (
          <div className="specialized-tracking-card garbage-tracking mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <Icon name="truck" size={16} />
              <span>CIVIC MUNICIPAL WASTE VEHICLE TELEMETRY</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-emerald-950">
              <div>
                <span className="text-muted-ink block text-[10px]">DISPATCH VEHICLE</span>
                <b>{booking.garbageDetails.vehicleType || "Green Mini-Tipper #MH12-TR-4421"}</b>
              </div>
              <div>
                <span className="text-muted-ink block text-[10px]">WASTE STATUS</span>
                <b>
                  {booking.garbageDetails.isSegregated
                    ? "✓ Pre-Segregated (Eco-Rebate)"
                    : "Mixed (Sort on site)"}
                </b>
              </div>
            </div>
            <div className="mt-2 text-[11px] text-emerald-700 flex items-center gap-1.5">
              <Icon name="recycle" size={13} />
              <span>Designated Facility: {booking.garbageDetails.disposalFacility}</span>
            </div>
          </div>
        )}

        {booking.serviceId === "bodyguard" && booking.bodyguardRequirements && (
          <div className="specialized-tracking-card security-tracking mt-3 p-3 rounded-xl bg-violet-50 border border-violet-200">
            <div className="flex items-center justify-between text-violet-900 font-bold text-xs">
              <span className="flex items-center gap-2">
                <Icon name="guard" size={16} />
                <span>GUARDIAN SATELLITE ESCORT ACTIVE</span>
              </span>
              <span className="bg-violet-700 text-white text-[10px] px-2 py-0.5 rounded-full">
                EN ROUTE
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-violet-950">
              <div>
                <span className="text-muted-ink block text-[10px]">PROTECTION TIER</span>
                <b>
                  {booking.bodyguardRequirements.tier === "armed_pso"
                    ? "Armed PSO (Concealed Carry)"
                    : "VIP Close Protection"}
                </b>
              </div>
              <div>
                <span className="text-muted-ink block text-[10px]">ATTIRE & SPECS</span>
                <b>
                  {booking.bodyguardRequirements.attire === "formal_suit"
                    ? "Dark Suit & Earpiece"
                    : "Tactical Uniform"}{" "}
                  · {booking.bodyguardRequirements.minHeight}
                </b>
              </div>
            </div>
            <div className="mt-2 text-[11px] text-violet-800 flex items-center gap-1.5 font-medium">
              <Icon name="shield" size={13} />
              <span>One-Tap SOS linked to Central Monitoring Desk & Armed Backup</span>
            </div>
          </div>
        )}

        {/* ETA Highlight */}
        <div className="eta-card">
          <span>Estimated arrival time</span>
          <strong>2:38 PM ({eta} mins)</strong>
          <small>Traffic is smooth on Koregaon Park North Main Road</small>
        </div>

        {/* 9-Stage Timeline */}
        <div className="timeline-container">
          <h4>Service Timeline</h4>
          <div className="timeline">
            {timelineSteps.map((stepItem, idx) => {
              const isPast = idx < activeIdx;
              const isCurrent = idx === activeIdx;

              return (
                <div
                  key={stepItem.key}
                  className={`timeline-step ${isPast ? "done" : isCurrent ? "active" : "pending"}`}
                >
                  <span className="step-bullet">
                    {isPast ? <Icon name="check" size={12} /> : idx + 1}
                  </span>
                  <div className="step-info">
                    <b>{stepItem.label}</b>
                    <small>{stepItem.sub}</small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Safety Actions */}
        <div className="tracking-actions">
          <Button
            kind="secondary"
            icon="shield"
            size="sm"
            onClick={() => alert("Backup technician Sanjay Kumar has been notified on standby.")}
          >
            Backup Expert
          </Button>
          <Button kind="danger" icon="sos" size="sm" onClick={() => setIsSosOpen(true)}>
            SOS Help
          </Button>
        </div>

        {/* Simulation Controls for testing complete product flow */}
        <div className="simulation-box mt-4">
          <small className="sim-title">PROTOTYPE WORKFLOW SIMULATOR:</small>
          <div className="sim-buttons-grid">
            <button
              type="button"
              className="sim-btn"
              onClick={() => {
                advanceBookingStatus(booking.id, "arrived");
                setEta(0);
              }}
            >
              1. Mark Arrived
            </button>
            <button
              type="button"
              className="sim-btn"
              onClick={() => {
                advanceBookingStatus(booking.id, "work_started");
              }}
            >
              2. Mark Started
            </button>
            <button
              type="button"
              className="sim-btn highlight"
              onClick={() => {
                advanceBookingStatus(booking.id, "work_completed");
                setActiveScreen("evidence");
              }}
            >
              3. Work Completed → Evidence Vault
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
