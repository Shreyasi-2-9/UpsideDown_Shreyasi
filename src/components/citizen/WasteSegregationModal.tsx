import { useState } from "react";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";

interface WasteCategoryInfo {
  id: "wet" | "dry" | "hazardous" | "ewaste";
  name: string;
  colorName: string;
  binColor: string;
  bgTint: string;
  icon: "droplet" | "recycle" | "alert" | "bolt";
  itemsIncluded: string[];
  itemsExcluded: string[];
  handlingTip: string;
  disposalDestination: string;
}

const WASTE_CATEGORIES: WasteCategoryInfo[] = [
  {
    id: "wet",
    name: "Wet / Biodegradable Waste",
    colorName: "Green Bin",
    binColor: "#1E874B",
    bgTint: "#EBF8F0",
    icon: "droplet",
    itemsIncluded: [
      "Fruit & vegetable peels",
      "Cooked and leftover food",
      "Egg shells & bones",
      "Tea bags & coffee grounds",
      "Rotten garden leaves & flowers",
      "Soiled paper napkins / tissues",
    ],
    itemsExcluded: [
      "Plastic wraps or cling film",
      "Sanitary pads / diapers",
      "Batteries or chemicals",
    ],
    handlingTip:
      "Do not use plastic bin liners. Drain excess liquid before placing in green bucket. Converted directly to organic compost.",
    disposalDestination: "PMC Municipal Bio-Methanation & Composting Plant, Hadapsar",
  },
  {
    id: "dry",
    name: "Dry / Recyclable Waste",
    colorName: "Blue Bin",
    binColor: "#2B6CB0",
    bgTint: "#EBF4FF",
    icon: "recycle",
    itemsIncluded: [
      "Newspapers, magazines, books",
      "Cardboard boxes & Amazon packaging",
      "Rinsed plastic bottles & milk pouches",
      "Metal beverage cans & tins",
      "Glass bottles & jars (intact)",
      "Tetra paks (washed and flattened)",
    ],
    itemsExcluded: ["Wet food remains", "Used tissues or soiled wrappers", "Ceramic crockery"],
    handlingTip:
      "Rinse food containers clean and flatten cardboard to save space. 100% recycled through authorized PMC sorting facilities.",
    disposalDestination: "PMC Authorized Material Recovery Facility (MRF), Koregaon Park",
  },
  {
    id: "hazardous",
    name: "Domestic Sanitary & Hazardous",
    colorName: "Red / Black Bin",
    binColor: "#C53030",
    bgTint: "#FFF5F5",
    icon: "alert",
    itemsIncluded: [
      "Diapers & sanitary pads (wrap in newspaper)",
      "Expired medicines & injections",
      "Mosquito coils, repellant tins",
      "Broken glass, razor blades, needles",
      "Paint cans, thinners & solvents",
      "Disinfectant & pesticide bottles",
    ],
    itemsExcluded: ["Regular household dry plastic", "Organic vegetable waste"],
    handlingTip:
      "Always wrap sharp glass and sanitary waste securely in newspaper marked with a red cross for safety of sanitation workers.",
    disposalDestination: "Specialized Incinerator & Biomedical Disposal Plant",
  },
  {
    id: "ewaste",
    name: "E-Waste & High-Value Scrap",
    colorName: "Yellow Bin",
    binColor: "#D69E2E",
    bgTint: "#FEFCBF",
    icon: "bolt",
    itemsIncluded: [
      "Old cellphones & tablet devices",
      "Damaged chargers, USB cords & adapters",
      "Dead dry batteries & power banks",
      "Tube lights, CFLs & LED bulbs",
      "Defunct microwaves, mixers & irons",
      "Computer keyboards, mice & motherboards",
    ],
    itemsExcluded: [
      "Alkaline vehicle acid batteries (return to dealer)",
      "Unbroken tube glass loose in normal bins",
    ],
    handlingTip:
      "Never discard electronics into normal garbage bins. Hazardous heavy metals (lead, cadmium) poison municipal groundwater.",
    disposalDestination: "MPCB Certified Safe E-Waste Dismantler & Precious Metal Extractor",
  },
];

export function WasteSegregationModal({
  isOpen,
  onClose,
  onBookPickup,
}: {
  isOpen: boolean;
  onClose: () => void;
  onBookPickup: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"wet" | "dry" | "hazardous" | "ewaste">("wet");
  const [calculatorBags, setCalculatorBags] = useState<number>(3);
  const [isPreSegregated, setIsPreSegregated] = useState<boolean>(true);

  if (!isOpen) return null;

  const currentCategory = WASTE_CATEGORIES.find((c) => c.id === activeTab) || WASTE_CATEGORIES[0];
  const ecoPointsEarned = calculatorBags * (isPreSegregated ? 50 : 15);
  const estimatedKg = calculatorBags * 8;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card segregation-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="segregation-modal-header">
          <div className="flex items-center gap-3">
            <span className="seg-icon-orb">
              <Icon name="recycle" size={24} />
            </span>
            <div>
              <span className="step-indicator">PUNE MUNICIPAL CIVIC ECO-GUIDE</span>
              <h2>Waste Segregation & Recycling Guide</h2>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="segregation-modal-body">
          {/* Top Banner */}
          <div className="segregation-hero-banner">
            <div>
              <h3>Earn ₹20 Civic Rebate & 150 Eco-Points</h3>
              <p>
                Pune Municipal Corporation requires 100% source segregation. When our green tippers
                collect your pre-segregated waste, your booking unlocks an instant discount!
              </p>
            </div>
            <div className="eco-badge-card">
              <strong>{ecoPointsEarned}</strong>
              <small>Eco-Points / Pickup</small>
            </div>
          </div>

          {/* Color Tabs */}
          <div className="segregation-tabs-row" role="tablist">
            {WASTE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`seg-tab-btn ${activeTab === cat.id ? "active" : ""}`}
                style={{
                  borderColor: activeTab === cat.id ? cat.binColor : "transparent",
                  backgroundColor: activeTab === cat.id ? cat.bgTint : "transparent",
                }}
                onClick={() => setActiveTab(cat.id)}
              >
                <span className="tab-color-dot" style={{ backgroundColor: cat.binColor }} />
                <span className="tab-bin-name">{cat.colorName}</span>
                <span className="tab-waste-name">{cat.id.toUpperCase()}</span>
              </button>
            ))}
          </div>

          {/* Active Category Detail Panel */}
          <div
            className="segregation-detail-card"
            style={{ borderColor: currentCategory.binColor }}
          >
            <div className="detail-head-strip" style={{ backgroundColor: currentCategory.bgTint }}>
              <div className="flex items-center gap-2">
                <span
                  className="category-pill-badge"
                  style={{ backgroundColor: currentCategory.binColor, color: "#FFFFFF" }}
                >
                  {currentCategory.colorName}
                </span>
                <h4 style={{ color: currentCategory.binColor }}>{currentCategory.name}</h4>
              </div>
              <span className="destination-badge">
                <Icon name="shield" size={12} /> Authorized Facility
              </span>
            </div>

            <div className="detail-columns-grid">
              {/* Items included */}
              <div className="items-column included">
                <h5>
                  <Icon name="check" size={14} /> What Goes In:
                </h5>
                <ul>
                  {currentCategory.itemsIncluded.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Items excluded */}
              <div className="items-column excluded">
                <h5>
                  <Icon name="close" size={14} /> NEVER Put In:
                </h5>
                <ul>
                  {currentCategory.itemsExcluded.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Handling tip */}
            <div className="handling-tip-box">
              <Icon name="info" size={18} />
              <div>
                <b>Pro Tip for Home:</b>
                <p>{currentCategory.handlingTip}</p>
                <small className="destination-note">
                  Destination: <b>{currentCategory.disposalDestination}</b>
                </small>
              </div>
            </div>
          </div>

          {/* Interactive Eco-Impact & Volume Calculator */}
          <div className="eco-calculator-card card mt-4">
            <div className="calc-header">
              <Icon name="chart" size={18} />
              <div>
                <h4>Your Waste Footprint Calculator</h4>
                <p>Estimate how much landfill waste you divert per collection</p>
              </div>
            </div>

            <div className="calc-controls mt-3">
              <div className="calc-slider-wrap">
                <label>Number of Standard Bags / Bins:</label>
                <div className="slider-row">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={calculatorBags}
                    onChange={(e) => setCalculatorBags(Number(e.target.value))}
                  />
                  <span className="slider-num">{calculatorBags} Bags</span>
                </div>
              </div>

              <label className="segregated-toggle-label">
                <input
                  type="checkbox"
                  checked={isPreSegregated}
                  onChange={(e) => setIsPreSegregated(e.target.checked)}
                />
                <span>
                  Pre-segregated (Wet/Dry sorted) — Unlocks +35 Bonus Eco-Points & ₹20 Rebate!
                </span>
              </label>

              <div className="calc-results-strip">
                <div className="res-stat">
                  <span>Diverted Landfill</span>
                  <strong>~{estimatedKg} kg</strong>
                </div>
                <div className="res-stat">
                  <span>Compost Generated</span>
                  <strong>~{Math.round(estimatedKg * 0.45)} kg</strong>
                </div>
                <div className="res-stat">
                  <span>Carbon Offset</span>
                  <strong>~{(estimatedKg * 0.8).toFixed(1)} kg CO₂e</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="segregation-modal-footer">
          <Button kind="secondary" onClick={onClose}>
            Close Guide
          </Button>
          <Button
            kind="primary"
            icon="truck"
            onClick={() => {
              onClose();
              onBookPickup();
            }}
          >
            Schedule Garbage Pickup Now (From ₹99)
          </Button>
        </div>
      </div>
    </div>
  );
}
