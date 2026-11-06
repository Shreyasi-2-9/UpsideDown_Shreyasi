import { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";
import { generateQrCode } from "../../utils/qrCode";

export function SkillPassportView() {
  const { technicians, setActiveScreen, role } = useApp();
  const tech = technicians[0]; // Ramesh Patil

  const [activeTab, setActiveTab] = useState<"all" | "skills" | "certs" | "experience" | "reviews">(
    "all",
  );
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const verificationUrl = useMemo(() => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://homecare360.in";
    return `${origin}/?verify=${tech.id}#passport`;
  }, [tech.id]);

  const qrResult = useMemo(() => {
    return generateQrCode(verificationUrl);
  }, [verificationUrl]);

  const handleShare = () => {
    setCopied(true);
    navigator.clipboard?.writeText(verificationUrl);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQr = () => {
    try {
      const blob = new Blob([qrResult.svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `HomeCare360_QR_${tech.name.replace(/\s+/g, "_")}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (e) {
      console.error("Failed to download QR code", e);
    }
  };

  const skillsData = [
    {
      name: "Pipe Leak Detection & Repair",
      level: "Master",
      exp: "8 Years",
      icon: "droplet",
      jobs: 194,
    },
    {
      name: "Kitchen & Bathroom Sanitary Fittings",
      level: "Master",
      exp: "8 Years",
      icon: "settings",
      jobs: 112,
    },
    {
      name: "Geyser Plumbing & Heating Lines",
      level: "Expert",
      exp: "6 Years",
      icon: "bolt",
      jobs: 86,
    },
    {
      name: "Pressure Testing & Leak Audit",
      level: "Certified Specialist",
      exp: "5 Years",
      icon: "shield",
      jobs: 45,
    },
    {
      name: "Drain Blockage & Hydro-Jetting",
      level: "Expert",
      exp: "5 Years",
      icon: "droplet",
      jobs: 62,
    },
    {
      name: "Gas Geyser Safety Installation",
      level: "Govt. Certified",
      exp: "4 Years",
      icon: "check",
      jobs: 29,
    },
  ];

  const certificationsData = [
    {
      title: "National Trade Certificate (NTC) — Plumbing",
      issuer: "Govt. ITI Aundh, Pune · Directorate General of Training (DGT)",
      date: "July 2017",
      credentialId: "ITI-PUN-PLM-2017-8120",
      status: "Cryptographically Verified",
      verifiedBy: "Maharashtra Vocational Skill Registry",
    },
    {
      title: "Advanced Hydro-Sanitary & Pressure Safety Protocol",
      issuer: "Maharashtra State Skill Development Society (MSSDS)",
      date: "November 2021",
      credentialId: "MSSDS-SAN-2021-4491",
      status: "Authenticated",
      verifiedBy: "Civic Skill Council Pune",
    },
    {
      title: "Municipal Civic Trade License (Residential & Commercial)",
      issuer: "Pune Municipal Corporation (PMC)",
      date: "Valid through March 2027",
      credentialId: "PMC-TRD-2024-9021",
      status: "Active & In Good Standing",
      verifiedBy: "PMC Urban Operations",
    },
  ];

  const experienceData = [
    {
      role: "Independent Master Sanitation Contractor",
      duration: "2021 – Present · 5 Years",
      location: "Koregaon Park & Kalyani Nagar, Pune",
      description:
        "Primary verified technician on HomeCare 360 with 428+ completed jobs. Specialises in residential societies, high-pressure booster systems, and concealed pipe leak detection with acoustic tools.",
    },
    {
      role: "Senior Plumbing Technician",
      duration: "2018 – 2021 · 3 Years",
      location: "Pune East Mechanical & Sanitary Services",
      description:
        "Supervised plumbing installations across 14 new residential developments in Viman Nagar and Kalyani Nagar. Maintained 99.4% first-time resolution rate.",
    },
    {
      role: "Apprentice Plumber",
      duration: "2016 – 2018 · 2 Years",
      location: "Pune Municipal Works Department",
      description:
        "Field apprenticeship training covering municipal mains, drainage conduits, water meter calibrations, and stopcock overhauls.",
    },
  ];

  return (
    <div className="flow-page page-pad narrow-flow">
      {/* Header Bar */}
      <div className="flow-title">
        <button
          type="button"
          className="back-btn"
          onClick={() => setActiveScreen(role === "technician" ? "tech_dashboard" : "home")}
          aria-label="Back to dashboard"
        >
          <Icon name="chevron" size={18} />
        </button>
        <div>
          <span className="section-kicker">CIVIC CREDENTIAL REGISTRY · AUTHENTICATED</span>
          <h1>Technician Digital Skill Passport</h1>
          <p>
            Standardised, tamper-evident digital credential proving verified skills, civic licenses,
            and authentic customer endorsements.
          </p>
        </div>
      </div>

      {/* Main Passport Card */}
      <article className="passport-container card shadow-lg">
        {/* Government Authenticated Header Ribbon */}
        <div className="passport-header-band">
          <div className="passport-gov-badge">
            <Icon name="shield" size={18} />
            <span>MAHARASHTRA VOCATIONAL SKILL REGISTRY · CRYPTOGRAPHICALLY AUTHENTICATED</span>
          </div>
          <span className="passport-id-code">ID: HC-PASSPORT-PUN-0841</span>
        </div>

        {/* SECTION A: TECHNICIAN PROFILE */}
        <section className="passport-section-profile p-6">
          <div className="passport-profile-row">
            <div className="passport-photo-box">
              <img src={tech.photo} alt={tech.name} />
              <span className="seal-badge" title="Government Verified Professional">
                <Icon name="check" size={14} />
              </span>
            </div>

            <div className="passport-bio">
              <div className="flex items-center gap-3 flex-wrap">
                <h2>{tech.name}</h2>
                <span className="master-badge">
                  <Icon name="shield" size={12} /> Verified Master Pro
                </span>
                <span className="status-badge-active">Active on Duty</span>
              </div>
              <p className="passport-trade">
                Certified Master Plumber & Concealed Leak Detection Specialist
              </p>

              <div className="passport-meta-tags mt-3">
                <span className="meta-tag">
                  <Icon name="clock" size={13} /> Experience: <b>{tech.experienceYears} Years</b>
                </span>
                <span className="meta-tag">
                  <Icon name="briefcase" size={13} /> Completed Jobs: <b>{tech.totalJobs}</b>
                </span>
                <span className="meta-tag">
                  <Icon name="star" size={13} className="text-yellow-600" /> Rating:{" "}
                  <b>{tech.rating} / 5.0</b>
                </span>
                <span className="meta-tag">
                  <Icon name="pin" size={13} /> Zone: <b>{tech.serviceArea}</b>
                </span>
              </div>
            </div>

            {/* Functional Scannable QR Code Verification Box */}
            <div className="passport-qr-box">
              <div
                className="qr-real-graphic"
                title="Point smartphone camera to scan and authenticate digital passport on civic registry"
                dangerouslySetInnerHTML={{ __html: qrResult.svg }}
              />
              <div className="qr-meta-wrap">
                <small className="qr-caption">Scan to Verify Official Record</small>
                <div className="flex items-center gap-1.5 mt-1">
                  <button
                    type="button"
                    className="qr-action-btn"
                    onClick={handleDownloadQr}
                    title="Download scannable SVG QR Code"
                  >
                    <Icon name="download" size={11} /> {downloadSuccess ? "Saved!" : "Download QR"}
                  </button>
                  <button
                    type="button"
                    className="qr-action-btn secondary"
                    onClick={() => setActiveScreen("public_passport")}
                    title="Preview public verification page"
                  >
                    View Public
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Badges Row */}
          <div className="passport-badges-grid mt-6">
            <div className="badge-item">
              <Icon name="check" size={18} />
              <div>
                <strong>Aadhaar & Police KYC Verified</strong>
                <small>Clean background verified by Pune Police Commissionerate</small>
              </div>
            </div>
            <div className="badge-item">
              <Icon name="shield" size={18} />
              <div>
                <strong>Govt. ITI Diploma (Grade 1)</strong>
                <small>Plumbing & Sanitary Sanitation (Roll #8120)</small>
              </div>
            </div>
            <div className="badge-item">
              <Icon name="star" size={18} />
              <div>
                <strong>96/100 Civic Trust Index</strong>
                <small>428 verified customer reviews with zero open disputes</small>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Navigation Tabs */}
        <div className="passport-filter-tabs">
          {[
            { key: "all", label: "Overview & All Credentials" },
            { key: "skills", label: "Skills & Specialisations" },
            { key: "certs", label: "Qualifications & Certifications" },
            { key: "experience", label: "Work Experience" },
            { key: "reviews", label: "Performance & Reviews" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={activeTab === tab.key ? "active" : ""}
              onClick={() => setActiveTab(tab.key as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="passport-body p-6">
          {/* SECTION B: SKILLS & SPECIALISATIONS */}
          {(activeTab === "all" || activeTab === "skills") && (
            <section className="passport-section-block">
              <div className="section-title-row">
                <div className="flex items-center gap-2">
                  <span className="section-number-pill">B</span>
                  <h3>Skills & Professional Specialisations</h3>
                </div>
                <span className="text-xs text-muted">
                  All skills authenticated through field audit
                </span>
              </div>

              <div className="skills-cards-grid mt-4">
                {skillsData.map((skill) => (
                  <div key={skill.name} className="skill-spec-card">
                    <div className="skill-card-top">
                      <div className="skill-icon-pill">
                        <Icon name={skill.icon as any} size={18} />
                      </div>
                      <span
                        className={`proficiency-tag ${skill.level.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {skill.level}
                      </span>
                    </div>
                    <h4>{skill.name}</h4>
                    <div className="skill-card-footer">
                      <span>
                        <Icon name="clock" size={12} /> {skill.exp}
                      </span>
                      <span>
                        <Icon name="check" size={12} /> {skill.jobs} Jobs Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION C: QUALIFICATIONS & CERTIFICATIONS */}
          {(activeTab === "all" || activeTab === "certs") && (
            <section className="passport-section-block mt-8">
              <div className="section-title-row">
                <div className="flex items-center gap-2">
                  <span className="section-number-pill">C</span>
                  <h3>Qualifications & Government Certifications</h3>
                </div>
                <span className="text-xs text-muted">No unverified or self-declared claims</span>
              </div>

              <div className="certs-list-stack mt-4">
                {certificationsData.map((cert) => (
                  <div key={cert.credentialId} className="cert-detailed-card">
                    <div className="cert-left-mark">
                      <Icon name="shield" size={24} />
                    </div>
                    <div className="cert-main-info">
                      <div className="cert-title-row">
                        <h4>{cert.title}</h4>
                        <span className="cert-verified-pill">
                          <Icon name="check" size={12} /> {cert.status}
                        </span>
                      </div>
                      <p className="cert-issuer">{cert.issuer}</p>
                      <div className="cert-meta-row">
                        <span>
                          Issued: <b>{cert.date}</b>
                        </span>
                        <span>
                          Credential ID: <code>{cert.credentialId}</code>
                        </span>
                        <span>
                          Registry: <b>{cert.verifiedBy}</b>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION D: WORK EXPERIENCE */}
          {(activeTab === "all" || activeTab === "experience") && (
            <section className="passport-section-block mt-8">
              <div className="section-title-row">
                <div className="flex items-center gap-2">
                  <span className="section-number-pill">D</span>
                  <h3>Professional Work Experience & Track Record</h3>
                </div>
                <span className="text-xs text-muted">
                  8+ Years continuous residential service in Pune East
                </span>
              </div>

              <div className="experience-timeline mt-4">
                {experienceData.map((exp, idx) => (
                  <div key={idx} className="exp-timeline-item">
                    <div className="exp-dot-col">
                      <span className="exp-dot" />
                      {idx < experienceData.length - 1 && <span className="exp-line" />}
                    </div>
                    <div className="exp-content">
                      <div className="exp-header-row">
                        <h4>{exp.role}</h4>
                        <span className="exp-duration-tag">{exp.duration}</span>
                      </div>
                      <p className="exp-location text-xs text-muted">
                        <Icon name="pin" size={12} /> {exp.location}
                      </p>
                      <p className="exp-desc mt-1">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION E: PERFORMANCE & TRUST */}
          {(activeTab === "all" || activeTab === "reviews") && (
            <section className="passport-section-block mt-8">
              <div className="section-title-row">
                <div className="flex items-center gap-2">
                  <span className="section-number-pill">E</span>
                  <h3>Performance Metrics & Verified Customer Feedback</h3>
                </div>
                <span className="text-xs text-muted">
                  Real reviews from authenticated homeowner jobs
                </span>
              </div>

              {/* Performance Stats Cards */}
              <div className="performance-stats-grid mt-4">
                <div className="perf-metric-card">
                  <span className="perf-num">
                    4.9<small>/5.0</small>
                  </span>
                  <div className="stars-row-sm">{"★★★★★"}</div>
                  <p>Overall Customer Rating</p>
                </div>
                <div className="perf-metric-card">
                  <span className="perf-num">428</span>
                  <p>Completed Residential Jobs</p>
                  <small className="text-xs text-muted">Koregaon Park & Kalyani Nagar</small>
                </div>
                <div className="perf-metric-card">
                  <span className="perf-num">99.2%</span>
                  <p>On-Time Arrival Rate</p>
                  <small className="text-xs text-muted">Average response time ~18 mins</small>
                </div>
                <div className="perf-metric-card">
                  <span className="perf-num">0</span>
                  <p>Unresolved Civic Disputes</p>
                  <small className="text-xs text-muted">100% Escrow sign-off rate</small>
                </div>
              </div>

              {/* Customer Reviews List */}
              <div className="reviews-cards-list mt-6">
                <h4 className="text-sm font-bold text-midnight mb-3">
                  Recent Verified Customer Reviews
                </h4>
                {tech.reviews.map((r) => (
                  <div key={r.id} className="review-detailed-item card">
                    <div className="review-item-header">
                      <div>
                        <strong>{r.citizenName}</strong>
                        <span className="review-apt-tag">Koregaon Park Resident</span>
                      </div>
                      <div className="review-rating-stars">
                        {"★".repeat(r.rating)}
                        <span className="review-date-label">{r.date}</span>
                      </div>
                    </div>
                    <p className="review-quote">"{r.comment}"</p>
                    <div className="review-footer-tags">
                      <span className="service-tag-pill">
                        <Icon name="check" size={11} /> {r.serviceName}
                      </span>
                      <span className="verified-job-pill">
                        <Icon name="shield" size={11} /> Verified Escrow Completion
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Passport Footer Actions */}
        <div className="passport-footer-band p-5 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Button kind="secondary" icon="download" size="sm" onClick={handleDownloadQr}>
              {downloadSuccess ? "QR Downloaded!" : "Download Scannable QR"}
            </Button>
            <Button
              kind="secondary"
              icon="shield"
              size="sm"
              onClick={() => setActiveScreen("public_passport")}
            >
              Preview Public Verification View
            </Button>
          </div>
          <Button kind="primary" icon="check" size="sm" onClick={handleShare}>
            {copied ? "Verification Link Copied!" : "Share Verified Passport Link"}
          </Button>
        </div>
      </article>
    </div>
  );
}
