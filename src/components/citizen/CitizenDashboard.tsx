import { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";
import { WasteSegregationModal } from "./WasteSegregationModal";
import type { ServiceCategory, TechnicianProfile } from "../../types";

const SERVICE_KEYWORDS_MAP: Record<string, string[]> = {
  plumbing: [
    "plumb",
    "plumber",
    "pipe",
    "leak",
    "tap",
    "faucet",
    "drain",
    "geyser",
    "sink",
    "water",
    "toilet",
    "flush",
    "fitting",
    "blockage",
    "bathroom",
    "sanitary",
  ],
  electrical: [
    "elect",
    "electric",
    "electrician",
    "wire",
    "wiring",
    "switch",
    "switchboard",
    "spark",
    "short circuit",
    "fan",
    "mcb",
    "fuse",
    "light",
    "power",
    "socket",
    "plug",
    "inverter",
  ],
  ac_repair: [
    "ac",
    "air conditioner",
    "cooling",
    "cool",
    "gas",
    "foam",
    "filter",
    "hvac",
    "duct",
    "compressor",
    "servicing",
    "split ac",
    "window ac",
    "coil",
    "freon",
  ],
  cleaning: [
    "clean",
    "cleaning",
    "deep clean",
    "sweep",
    "mop",
    "sofa",
    "kitchen",
    "bathroom",
    "sanitization",
    "wash",
    "degreasing",
    "descaling",
    "carpet",
    "house cleaning",
    "maid",
  ],
  carpentry: [
    "carpent",
    "carpenter",
    "wood",
    "wooden",
    "door",
    "lock",
    "furniture",
    "hinge",
    "cupboard",
    "table",
    "chair",
    "modular kitchen",
    "drawer",
    "handle",
    "almirah",
  ],
  painting: [
    "paint",
    "painting",
    "painter",
    "wall",
    "color",
    "colour",
    "waterproofing",
    "texture",
    "primer",
    "roller",
    "distemper",
    "interior",
    "exterior",
    "whitewash",
  ],
  appliances: [
    "appliance",
    "washing machine",
    "fridge",
    "refrigerator",
    "microwave",
    "oven",
    "ro",
    "water purifier",
    "repair",
    "motor",
    "chimney",
    "mixer",
  ],
  pest_control: [
    "pest",
    "cockroach",
    "termite",
    "bed bug",
    "insect",
    "mosquito",
    "ant",
    "spray",
    "herbal gel",
    "rodent",
    "bugs",
    "rat",
    "pest control",
    "fumigation",
  ],
  garbage: [
    "garbage",
    "waste",
    "trash",
    "rubbish",
    "debris",
    "junk",
    "scrap",
    "dustbin",
    "kachra",
    "safai",
    "dump",
    "disposal",
    "e-waste",
    "ewaste",
    "recycle",
    "compost",
    "tipper",
    "sanitation",
    "rubble",
    "renovation waste",
  ],
  bodyguard: [
    "bodyguard",
    "guard",
    "security",
    "pso",
    "protection",
    "escort",
    "bouncer",
    "armed",
    "vip",
    "safety",
    "commando",
    "patrol",
    "defense",
    "surveillance",
    "close protection",
    "personal protection",
  ],
};

export function CitizenDashboard() {
  const {
    categories,
    technicians,
    bookings,
    activeBookingId,
    setActiveBookingId,
    setActiveScreen,
    setIsServiceRequestOpen,
    setSelectedCategoryId,
    setSelectedTechId,
    setIsSosOpen,
    currentUser,
    t,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedArea, setSelectedArea] = useState("Koregaon Park, Pune");
  const [isSegregationModalOpen, setIsSegregationModalOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Comprehensive case-insensitive search matching against official categories
  const cleanQuery = searchQuery.trim().toLowerCase();

  const searchResults: ServiceCategory[] = cleanQuery
    ? categories.filter((cat) => {
        const nameMatch = cat.name.toLowerCase().includes(cleanQuery);
        const hiMatch = (cat.nameHi || "").toLowerCase().includes(cleanQuery);
        const mrMatch = (cat.nameMr || "").toLowerCase().includes(cleanQuery);
        const descMatch = cat.description.toLowerCase().includes(cleanQuery);
        const tagMatch = cat.tags.some((tag) => tag.toLowerCase().includes(cleanQuery));
        const keywordMatch = (SERVICE_KEYWORDS_MAP[cat.id] || []).some(
          (kw) => kw.includes(cleanQuery) || cleanQuery.includes(kw),
        );
        return nameMatch || hiMatch || mrMatch || descMatch || tagMatch || keywordMatch;
      })
    : [];

  // Filtered categories for the bottom service grid
  const filteredCategories = cleanQuery ? searchResults : categories;

  const activeBooking = bookings.find((b) => b.id === activeBookingId) || bookings[0];

  const handleSelectCategory = (cat: ServiceCategory) => {
    setSelectedCategoryId(cat.id);
    setIsServiceRequestOpen(true);
    setIsSearchFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      e.preventDefault();
      handleSelectCategory(searchResults[0]);
    } else if (e.key === "Escape") {
      setIsSearchFocused(false);
    }
  };

  const handleViewTechnician = (tech: TechnicianProfile) => {
    setSelectedTechId(tech.id);
  };

  return (
    <div className="dashboard page-pad">
      {/* Welcome & Location Row */}
      <section className="welcome-row">
        <div>
          <p className="hello">
            {t.greetingGoodMorning}, {currentUser.name.split(" ")[0]}
          </p>
          <div className="location-select-wrap">
            <span className="loc-icon-pill">
              <Icon name="pin" size={17} />
            </span>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="location-dropdown"
              aria-label="Select delivery area"
            >
              <option value="Koregaon Park, Pune">Koregaon Park, Pune</option>
              <option value="Kalyani Nagar, Pune">Kalyani Nagar, Pune</option>
              <option value="Viman Nagar, Pune">Viman Nagar, Pune</option>
              <option value="Baner, Pune">Baner, Pune</option>
              <option value="Aundh, Pune">Aundh, Pune</option>
              <option value="Kothrud, Pune">Kothrud, Pune</option>
            </select>
          </div>
        </div>

        <div className="safety-pill">
          <Icon name="shield" size={18} />
          <span>
            <b>{t.homeCareProtect}</b>
            <small>{t.protectSub}</small>
          </span>
        </div>
      </section>

      {/* Search Bar with Real-time Service Discovery Dropdown */}
      <section className="dashboard-search-container" ref={searchContainerRef}>
        <div className="dashboard-search">
          <Icon name="search" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchFocused(true);
            }}
            onFocus={() => setIsSearchFocused(true)}
            onKeyDown={handleKeyDown}
            aria-label="Search home services"
            placeholder="Search home services: Plumbing, AC, Electrical, Cleaning..."
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => {
                setSearchQuery("");
                setIsSearchFocused(false);
              }}
              aria-label="Clear search"
            >
              <Icon name="close" size={16} />
            </button>
          )}
          <button
            type="button"
            className="filter-toggle-btn"
            aria-label="Open full service catalogue"
            onClick={() => setActiveScreen("request")}
            title="Browse all categories"
          >
            <Icon name="sliders" size={18} />
          </button>
        </div>

        {/* Real-time Discovery Dropdown */}
        {isSearchFocused && cleanQuery.length > 0 && (
          <div className="search-discovery-dropdown card shadow-2xl">
            {searchResults.length > 0 ? (
              <div className="search-results-list">
                <div className="search-dropdown-header">
                  <span>
                    FOUND {searchResults.length} VERIFIED SERVICE
                    {searchResults.length > 1 ? "S" : ""}
                  </span>
                  <small>Press Enter or Click to Book</small>
                </div>
                {searchResults.map((service) => (
                  <div
                    key={service.id}
                    className="search-result-item"
                    onClick={() => handleSelectCategory(service)}
                  >
                    <div className="result-icon-orb">
                      <Icon name={service.icon} size={22} />
                    </div>
                    <div className="result-details">
                      <div className="result-title-row">
                        <h4>{service.name}</h4>
                        <span className="price-tag">From ₹{service.basePrice}</span>
                      </div>
                      <p className="result-desc">{service.description}</p>
                      <div className="result-tags">
                        <span className="duration-pill">
                          <Icon name="clock" size={12} /> {service.duration}
                        </span>
                        <span className="pros-pill">
                          <Icon name="shield" size={12} /> {service.availableTechs} Verified Pros
                        </span>
                        {service.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="tag-pill">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="book-btn-pill"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCategory(service);
                      }}
                    >
                      Book <Icon name="arrow" size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="search-no-results">
                <div className="no-res-icon">
                  <Icon name="search" size={28} />
                </div>
                <h4>No services found for "{searchQuery}"</h4>
                <p>We only provide verified, rate-capped home services in Pune.</p>
                <div className="suggested-pills">
                  <span>Try searching:</span>
                  {["Plumbing", "AC Repair", "Electrical", "Cleaning", "Painting", "Carpentry"].map(
                    (name) => (
                      <button
                        key={name}
                        type="button"
                        className="suggestion-chip"
                        onClick={() => {
                          setSearchQuery(name);
                          setIsSearchFocused(true);
                        }}
                      >
                        {name}
                      </button>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Suggestion Chips below search */}
        <div className="search-quick-suggestions">
          <span className="quick-label">POPULAR:</span>
          {[
            { label: "Plumbing", query: "plumbing" },
            { label: "AC Care", query: "ac" },
            { label: "Garbage & Debris", query: "garbage" },
            { label: "Bodyguard & Security", query: "bodyguard" },
            { label: "Electrical", query: "electrical" },
            { label: "Deep Clean", query: "cleaning" },
            { label: "Pest Shield", query: "pest" },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              className="quick-search-pill"
              onClick={() => {
                setSearchQuery(item.query);
                setIsSearchFocused(true);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* Active Booking Banner if ongoing */}
      {activeBooking && activeBooking.status !== "payment_released" && (
        <section className="active-booking-banner card">
          <div className="banner-left">
            <span className="live-pulse-badge">
              <span className="pulse-dot" /> ACTIVE JOB: {activeBooking.id}
            </span>
            <h3>{activeBooking.serviceName}</h3>
            <p>
              Status:{" "}
              <b className="status-highlight">
                {activeBooking.status === "on_the_way"
                  ? "Ramesh is on the way (ETA 18 min)"
                  : activeBooking.status === "arrived"
                    ? "Technician arrived at doorstep"
                    : activeBooking.status === "work_started"
                      ? "Work in progress"
                      : activeBooking.status === "escrow_locked"
                        ? "Payment protected in escrow"
                        : "Quotation awaiting approval"}
              </b>
            </p>
          </div>
          <div className="banner-actions">
            <Button
              kind="primary"
              size="sm"
              icon="pin"
              onClick={() => {
                setActiveBookingId(activeBooking.id);
                setActiveScreen("tracking");
              }}
            >
              Track Live Location
            </Button>
            <Button
              kind="secondary"
              size="sm"
              icon="camera"
              onClick={() => {
                setActiveBookingId(activeBooking.id);
                setActiveScreen("evidence");
              }}
            >
              Evidence Vault
            </Button>
          </div>
        </section>
      )}

      {/* Group Booking Promo */}
      <section className="promo">
        <div className="promo-copy">
          <span className="promo-chip">{t.neighbourhoodSavings}</span>
          <h2>
            {t.groupPromoTitle}
            <br />
            <em>{t.groupPromoEm}</em>
          </h2>
          <p>{t.groupPromoSub}</p>
          <button
            type="button"
            className="promo-btn"
            onClick={() => setActiveScreen("group_booking")}
          >
            {t.exploreGroupBooking} <Icon name="arrow" size={16} />
          </button>
        </div>
        <div className="promo-art">
          <div className="discount-tag">
            61<small>%</small>
          </div>
          <div className="mini-home one">
            <Icon name="home" size={42} />
          </div>
          <div className="mini-home two">
            <Icon name="home" size={28} />
          </div>
        </div>
      </section>

      {/* Dedicated Garbage & Bodyguard Civic Feature Showcase */}
      <section className="civic-spotlight-grid mb-6">
        {/* Garbage & Eco-Disposal Card */}
        <div className="spotlight-card garbage-card card">
          <div className="spotlight-icon-circle green-orb">
            <Icon name="truck" size={26} />
          </div>
          <div className="spotlight-content">
            <div className="flex items-center gap-2">
              <span className="spotlight-kicker green">CIVIC SANITATION & RECYCLING</span>
              <span className="rebate-tag">₹20 ECO REBATE</span>
            </div>
            <h3>Garbage, Bulk Debris & E-Waste Pickup</h3>
            <p>
              Doorstep segregated waste collection, renovation rubble tippers, and authorized
              e-waste disposal. Pre-segregated waste unlocks an instant civic rebate!
            </p>
            <div className="spotlight-actions mt-3">
              <Button
                kind="primary"
                size="sm"
                icon="truck"
                onClick={() => {
                  setSelectedCategoryId("garbage");
                  setIsServiceRequestOpen(true);
                }}
              >
                Schedule Pickup (₹99)
              </Button>
              <Button
                kind="secondary"
                size="sm"
                icon="recycle"
                onClick={() => setIsSegregationModalOpen(true)}
              >
                Segregation Guide
              </Button>
            </div>
          </div>
        </div>

        {/* Bodyguard & Security Requirement Desk Card */}
        <div className="spotlight-card security-card card">
          <div className="spotlight-icon-circle violet-orb">
            <Icon name="guard" size={26} />
          </div>
          <div className="spotlight-content">
            <div className="flex items-center gap-2">
              <span className="spotlight-kicker violet">HIGH-TRUST EXECUTIVE PROTECTION</span>
              <span className="armed-tag">MHA FORM-IV LICENSED</span>
            </div>
            <h3>Executive Bodyguard & Personal Security</h3>
            <p>
              Deploy licensed armed PSOs, ex-Para SF commandos, and discreet night travel escorts
              with 24/7 Satellite Guardian Sync and armed backup vehicle standby.
            </p>
            <div className="spotlight-actions mt-3">
              <Button
                kind="primary"
                size="sm"
                icon="shield"
                onClick={() => {
                  setSelectedCategoryId("bodyguard");
                  setIsServiceRequestOpen(true);
                }}
              >
                Define Guard Requirements
              </Button>
              <Button
                kind="secondary"
                size="sm"
                icon="user"
                onClick={() => {
                  setSearchQuery("bodyguard");
                  setIsSearchFocused(true);
                }}
              >
                View Security Pros
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="section-block">
        <div className="section-head">
          <div>
            <span className="section-kicker">GOVERNMENT VERIFIED & RATE-CAPPED</span>
            <h2>{t.popularServices}</h2>
          </div>
          <button type="button" onClick={() => setActiveScreen("request")}>
            {t.viewAll} <Icon name="arrow" size={16} />
          </button>
        </div>

        <div className="service-grid">
          {filteredCategories.map((service) => (
            <button
              className="service-card"
              key={service.id}
              onClick={() => handleSelectCategory(service)}
              type="button"
            >
              <span
                className={`service-art theme-${service.id}`}
              >
                <span className="service-blob" />
                <Icon name={service.icon} size={32} />
              </span>
              <b>{service.name}</b>
              <small>
                From <strong>₹{service.basePrice}</strong> · {service.availableTechs} pros
              </small>
            </button>
          ))}
        </div>
      </section>

      {/* Recommended Verified Technicians */}
      <section className="section-block">
        <div className="section-head">
          <div>
            <span className="section-kicker">TOP RATED IN {selectedArea.toUpperCase()}</span>
            <h2>Recommended Technicians</h2>
          </div>
          <button type="button" onClick={() => setActiveScreen("offers")}>
            Compare quotes <Icon name="arrow" size={16} />
          </button>
        </div>

        <div className="tech-cards-grid">
          {technicians.slice(0, 3).map((tech) => (
            <article className="tech-card card" key={tech.id}>
              <div className="tech-card-header">
                <img src={tech.photo} alt={tech.name} className="tech-avatar" />
                <div>
                  <div className="name-badge-row">
                    <h3>{tech.name}</h3>
                    <span className="verified-badge">
                      <Icon name="check" size={12} /> Verified
                    </span>
                  </div>
                  <div className="rating-row">
                    <Icon name="star" size={14} className="star-icon" />
                    <b>{tech.rating}</b>
                    <span>({tech.totalJobs} jobs)</span>
                    <span className="bullet">·</span>
                    <span>{tech.distanceKm} km away</span>
                  </div>
                </div>
              </div>

              <div className="skills-tags-row">
                {tech.skills.slice(0, 3).map((skill) => (
                  <span key={skill} className="skill-pill">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="tech-card-footer">
                <div>
                  <small>Starting from</small>
                  <strong>₹{tech.startingPrice}</strong>
                </div>
                <div className="tech-card-actions">
                  <Button kind="secondary" size="sm" onClick={() => handleViewTechnician(tech)}>
                    Skill Passport
                  </Button>
                  <Button
                    kind="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedCategoryId(tech.primaryService);
                      setIsServiceRequestOpen(true);
                    }}
                  >
                    Request
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Lower Dashboard: Recent Booking + Senior Assistance */}
      <section className="dashboard-lower">
        <div className="recent card">
          <div className="section-head">
            <h2>{t.recentBooking}</h2>
            <button type="button" onClick={() => setActiveScreen("bookings")}>
              View details
            </button>
          </div>
          <div className="booking-line">
            <span className="booking-icon">
              <Icon name="snow" size={24} />
            </span>
            <div>
              <b>AC service & repair</b>
              <small>Completed · 18 Jun · Sanjay Kumar</small>
            </div>
            <span className="price">₹699</span>
          </div>
          <div className="booking-footer">
            <span>
              <Icon name="shield" size={16} /> Warranty active for 4 days
            </span>
            <Button
              kind="secondary"
              size="sm"
              onClick={() => {
                setSelectedCategoryId("ac_repair");
                setIsServiceRequestOpen(true);
              }}
            >
              Book again
            </Button>
          </div>
        </div>

        {/* Senior Assistance Card */}
        <div className="assist card">
          <div className="assist-icon">
            <Icon name="phone" size={26} />
          </div>
          <div>
            <h2>{t.preferToSpeak}</h2>
            <p>{t.seniorAssistDesc}</p>
          </div>
          <a href="tel:18003604357" className="btn btn-secondary w-full">
            <Icon name="phone" size={16} />
            <span>{t.callToBook} (1800-360-HELP)</span>
          </a>
        </div>
      </section>

      {/* Floating SOS button */}
      <button
        type="button"
        className="sos-float"
        onClick={() => setIsSosOpen(true)}
        aria-label="Emergency SOS assistance"
      >
        <Icon name="sos" size={20} />
        <span>SOS</span>
      </button>

      {/* Waste Segregation Guide Modal */}
      <WasteSegregationModal
        isOpen={isSegregationModalOpen}
        onClose={() => setIsSegregationModalOpen(false)}
        onBookPickup={() => {
          setSelectedCategoryId("garbage");
          setIsServiceRequestOpen(true);
        }}
      />
    </div>
  );
}
