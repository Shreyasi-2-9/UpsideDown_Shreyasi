import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";
import type { TechnicianProfile } from "../../types";

type VerificationFilterTab = "all" | "pending" | "approved" | "rejected";

interface DocumentInspectData {
  techName: string;
  techId: string;
  docTitle: string;
  docType: string;
  issuer: string;
  docNumber: string;
  status: "verified" | "pending" | "rejected";
  previewUrl: string;
}

export function AdminVerificationView() {
  const { technicians, verifyTechnician, setActiveScreen } = useApp();

  const [activeTab, setActiveTab] = useState<VerificationFilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectDoc, setInspectDoc] = useState<DocumentInspectData | null>(null);
  const [rejectingTech, setRejectingTech] = useState<TechnicianProfile | null>(null);
  const [rejectReason, setRejectReason] = useState("Incomplete or unreadable documentation");
  const [customRejectReason, setCustomRejectReason] = useState("");
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  // Dynamic filter counts
  const totalCount = technicians.length;
  const pendingCount = technicians.filter((t) => t.verificationStatus === "pending").length;
  const approvedCount = technicians.filter((t) => t.verificationStatus === "approved").length;
  const rejectedCount = technicians.filter((t) => t.verificationStatus === "rejected").length;

  // Filtered technician profiles
  const filteredTechs = technicians.filter((tech) => {
    if (activeTab !== "all" && tech.verificationStatus !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = tech.name.toLowerCase().includes(q);
      const matchId = tech.id.toLowerCase().includes(q);
      const matchService = tech.primaryService.toLowerCase().includes(q);
      const matchArea = tech.serviceArea.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchService && !matchArea) return false;
    }
    return true;
  });

  const handleApprove = (tech: TechnicianProfile) => {
    verifyTechnician(tech.id, "approved");
    setActionSuccessNotice(
      `Technician ${tech.name} has been APPROVED. Digital Skill Passport issued.`,
    );
    setTimeout(() => setActionSuccessNotice(null), 4000);
  };

  const handleConfirmReject = () => {
    if (!rejectingTech) return;
    const finalReason =
      rejectReason === "other" ? customRejectReason || "Declined by supervisor" : rejectReason;
    verifyTechnician(rejectingTech.id, "rejected");
    setActionSuccessNotice(
      `Technician ${rejectingTech.name} has been REJECTED. Reason: "${finalReason}".`,
    );
    setRejectingTech(null);
    setCustomRejectReason("");
    setTimeout(() => setActionSuccessNotice(null), 4000);
  };

  const handleRequestInfo = (tech: TechnicianProfile) => {
    setActionSuccessNotice(
      `Official SMS & in-app notification sent to ${tech.name} requesting updated documentation.`,
    );
    setTimeout(() => setActionSuccessNotice(null), 3500);
  };

  // Helper to retrieve documents for each technician
  const getTechDocuments = (tech: TechnicianProfile) => {
    if (tech.kycDocuments && tech.kycDocuments.length > 0) {
      return tech.kycDocuments;
    }

    const isPending = tech.verificationStatus === "pending";
    const isRejected = tech.verificationStatus === "rejected";

    return [
      {
        id: `doc-${tech.id}-1`,
        name: "Government Aadhaar KYC",
        type: "aadhaar" as const,
        status: isPending
          ? ("pending" as const)
          : isRejected
            ? ("rejected" as const)
            : ("verified" as const),
        documentNumber: `XXXX-XXXX-${tech.id.slice(-4).padStart(4, "7")}`,
        issuer: "Unique Identification Authority of India (UIDAI)",
        date: "2024 Audit",
        previewUrl:
          "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      },
      {
        id: `doc-${tech.id}-2`,
        name: tech.certificates[0]?.title || "Trade Qualification Certificate",
        type: "certificate" as const,
        status: isPending
          ? ("pending" as const)
          : isRejected
            ? ("rejected" as const)
            : ("verified" as const),
        documentNumber: `CERT-${tech.id.toUpperCase()}-2021`,
        issuer: tech.certificates[0]?.issuer || "Maharashtra State Board of Vocational Education",
        date: tech.certificates[0]?.year || "2021",
        previewUrl:
          "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      },
      {
        id: `doc-${tech.id}-3`,
        name: "Police Character Clearance (PCC)",
        type: "police" as const,
        status: isPending
          ? ("pending" as const)
          : isRejected
            ? ("rejected" as const)
            : ("verified" as const),
        documentNumber: `PCC-PUN-${tech.id.replace(/\D/g, "") || "41"}`,
        issuer: "Pune Police Commissionerate",
        date: "May 2026",
        previewUrl:
          "https://images.unsplash.com/photo-1450133064473-71024230f91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      },
      {
        id: `doc-${tech.id}-4`,
        name: "Bank Payout VPA Verification",
        type: "bank" as const,
        status: "verified" as const,
        documentNumber:
          tech.bankDetails?.upiId || `${tech.name.toLowerCase().replace(/\s+/g, ".")}@upi`,
        issuer: tech.bankDetails?.ifsc || "HDFC Bank (Penny Drop Passed)",
        date: "Active",
        previewUrl:
          "https://images.unsplash.com/photo-1563986768609-322da13575f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      },
    ];
  };

  return (
    <div className="flow-page page-pad admin-verification-portal">
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
          <span className="section-kicker">CIVIC CREDENTIAL REGISTRY · ADMINISTRATIVE DESK</span>
          <h1>Technician Verification Portal</h1>
          <p>
            Review identity credentials, police background clearances, and vocational licenses in a
            structured, side-by-side grid.
          </p>
        </div>
      </div>

      {/* Success Notification Banner */}
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

      {/* TOOLBAR & CATEGORY FILTER TABS */}
      <div className="verification-toolbar card p-4 mt-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Status Tabs with Dynamic Live Counts */}
          <div className="requests-category-tabs">
            <button
              type="button"
              className={`category-tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Applications <span className="tab-pill-count">{totalCount}</span>
            </button>
            <button
              type="button"
              className={`category-tab-btn ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              Pending Review <span className="tab-pill-count">{pendingCount}</span>
            </button>
            <button
              type="button"
              className={`category-tab-btn ${activeTab === "approved" ? "active" : ""}`}
              onClick={() => setActiveTab("approved")}
            >
              Approved <span className="tab-pill-count">{approvedCount}</span>
            </button>
            <button
              type="button"
              className={`category-tab-btn ${activeTab === "rejected" ? "active" : ""}`}
              onClick={() => setActiveTab("rejected")}
            >
              Rejected <span className="tab-pill-count">{rejectedCount}</span>
            </button>
          </div>

          {/* Quick Search Field */}
          <div className="verification-search-wrap">
            <Icon name="search" size={16} />
            <input
              type="text"
              placeholder="Filter by name, ID, trade, area..."
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
        </div>
      </div>

      {/* 3-COLUMN SIDE-BY-SIDE RESPONSIVE VERIFICATION CARD GRID */}
      <div className="verification-cards-grid mt-6">
        {filteredTechs.length === 0 ? (
          <div className="empty-verification-state card p-8 text-center col-span-full">
            <div className="empty-icon-circle mx-auto">
              <Icon name="shield" size={40} />
            </div>
            <h3 className="text-lg font-bold text-midnight mt-3">
              No technician verification records found
            </h3>
            <p className="text-muted text-xs mt-1 max-w-md mx-auto">
              {searchQuery
                ? `No technicians matched your search query "${searchQuery}". Clear your search to see all records.`
                : activeTab === "pending"
                  ? "All technician applications have been reviewed. No pending KYC submissions right now."
                  : "No technician profiles match this filter criteria."}
            </p>
            {(searchQuery || activeTab !== "all") && (
              <Button
                kind="secondary"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setActiveTab("all");
                  setSearchQuery("");
                }}
              >
                View All Applications
              </Button>
            )}
          </div>
        ) : (
          filteredTechs.map((tech) => {
            const docs = getTechDocuments(tech);
            const initials = tech.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2);

            const statusClass =
              tech.verificationStatus === "approved"
                ? "status-verified-pill"
                : tech.verificationStatus === "rejected"
                  ? "status-rejected-pill"
                  : "status-pending-pill";

            const statusLabel =
              tech.verificationStatus === "approved"
                ? "Approved · Licensed"
                : tech.verificationStatus === "rejected"
                  ? "Rejected"
                  : "Pending KYC Audit";

            return (
              <article key={tech.id} className="tech-verification-card card shadow-sm">
                {/* 1. Header: Compact Circular Photo, Name, ID, Status Badge */}
                <div className="card-header-band">
                  <div className="flex items-start gap-3">
                    {/* Compact Circular Profile Image (68px) with Fallback Initials */}
                    <div className="tech-compact-avatar-wrap">
                      {tech.photo ? (
                        <img
                          src={tech.photo}
                          alt={tech.name}
                          className="tech-compact-avatar-img"
                          onError={(e) => {
                            // Fallback to initials if image link breaks
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : null}
                      <span className="tech-avatar-fallback">{initials}</span>
                      {tech.verificationStatus === "approved" && (
                        <span className="avatar-check-badge" title="Authenticated Profile">
                          ✓
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="tech-card-name" title={tech.name}>
                          {tech.name}
                        </h3>
                        <span className="tech-id-tag font-mono">#{tech.id}</span>
                      </div>
                      <span className={`status-badge-compact ${statusClass}`}>{statusLabel}</span>
                      <p className="tech-area-text text-xs text-muted mt-1 truncate">
                        <Icon name="pin" size={11} /> {tech.serviceArea}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Professional Information */}
                <div className="card-professional-section">
                  <div className="flex items-center justify-between text-xs">
                    <span className="category-pill-badge">
                      <Icon name="settings" size={12} /> {tech.primaryService.toUpperCase()}
                    </span>
                    <span className="font-semibold text-midnight">
                      <b>{tech.experienceYears}</b> Yrs Exp · <b>{tech.rating}★</b>
                    </span>
                  </div>

                  {/* Specialisations Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {tech.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="micro-skill-chip">
                        {skill}
                      </span>
                    ))}
                    {tech.skills.length > 3 && (
                      <span className="micro-skill-chip text-violet font-bold">
                        +{tech.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Qualifications */}
                  <div className="qualifications-box mt-2.5">
                    <span className="section-micro-label">Primary Qualification:</span>
                    <p className="qualification-title">
                      {tech.certificates[0]?.title || "National Vocational Trade Certificate"}
                    </p>
                    <small className="qualification-issuer text-muted">
                      {tech.certificates[0]?.issuer || "Directorate General of Training"}
                    </small>
                  </div>
                </div>

                {/* 3. Submitted Documents */}
                <div className="card-documents-section">
                  <div className="flex items-center justify-between mb-2">
                    <span className="section-micro-label uppercase font-bold text-muted">
                      Submitted KYC Documents ({docs.length}):
                    </span>
                    <span className="text-[10px] text-muted">Click to inspect</span>
                  </div>

                  <div className="space-y-1.5">
                    {docs.map((doc) => (
                      <div
                        key={doc.id}
                        className="doc-compact-row"
                        onClick={() =>
                          setInspectDoc({
                            techName: tech.name,
                            techId: tech.id,
                            docTitle: doc.name,
                            docType: doc.type,
                            issuer: doc.issuer || "Official Civic Authority",
                            docNumber: doc.documentNumber || "DOC-8149-VERIFIED",
                            status: doc.status,
                            previewUrl:
                              doc.previewUrl ||
                              "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
                          })
                        }
                        title="Click to view full-size document preview in lightbox modal"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="doc-icon-chip">
                            <Icon
                              name={
                                doc.type === "police"
                                  ? "shield"
                                  : doc.type === "bank"
                                    ? "wallet"
                                    : "file"
                              }
                              size={13}
                            />
                          </span>
                          <span className="doc-name-text truncate text-xs font-semibold text-midnight">
                            {doc.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span
                            className={`doc-status-indicator ${
                              doc.status === "verified"
                                ? "verified"
                                : doc.status === "rejected"
                                  ? "rejected"
                                  : "pending"
                            }`}
                          >
                            {doc.status === "verified"
                              ? "✓"
                              : doc.status === "rejected"
                                ? "×"
                                : "⏳"}
                          </span>
                          <span className="doc-inspect-link text-[11px] font-bold text-violet">
                            Inspect
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Action Buttons consistently aligned at the bottom */}
                <div className="card-actions-bar mt-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {tech.verificationStatus !== "approved" ? (
                      <button
                        type="button"
                        className="btn-verification-action approve"
                        onClick={() => handleApprove(tech)}
                      >
                        <Icon name="check" size={13} /> Approve
                      </button>
                    ) : (
                      <span className="approved-badge-status">✓ Approved Pro</span>
                    )}

                    {tech.verificationStatus !== "rejected" ? (
                      <button
                        type="button"
                        className="btn-verification-action reject"
                        onClick={() => setRejectingTech(tech)}
                      >
                        Reject
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-verification-action approve"
                        onClick={() => handleApprove(tech)}
                      >
                        Re-Approve
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      className="btn-sub-action flex-1"
                      onClick={() => handleRequestInfo(tech)}
                      title="Request missing document resubmission"
                    >
                      Request Info
                    </button>
                    <button
                      type="button"
                      className="btn-sub-action flex-1"
                      onClick={() => setActiveScreen("tech_passport")}
                      title="View Digital Skill Passport"
                    >
                      Skill Passport
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* DOCUMENT LIGHTBOX MODAL */}
      {inspectDoc && (
        <div className="modal-backdrop" onClick={() => setInspectDoc(null)}>
          <div className="doc-lightbox-modal card" onClick={(e) => e.stopPropagation()}>
            <div className="doc-lightbox-header">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-violet/10 text-violet flex items-center justify-center font-bold">
                  <Icon name="shield" size={20} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-midnight m-0">{inspectDoc.docTitle}</h3>
                  <small className="text-xs text-muted">
                    Submitted by <b>{inspectDoc.techName}</b> ({inspectDoc.techId})
                  </small>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setInspectDoc(null)}
                aria-label="Close Preview"
              >
                ×
              </button>
            </div>

            <div className="doc-lightbox-body">
              {/* Image Preview Box */}
              <div className="doc-image-preview-container">
                <img
                  src={inspectDoc.previewUrl}
                  alt={inspectDoc.docTitle}
                  className="doc-preview-large"
                />
                <span className="watermark-seal">
                  MAHARASHTRA VOCATIONAL SKILL REGISTRY · AUTHENTICATED
                </span>
              </div>

              {/* Document Metadata Details */}
              <div className="doc-meta-sidebar mt-4 p-4 bg-paper rounded-xl border border-outline">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-muted block">Document Ref:</span>
                    <strong className="font-mono text-midnight">{inspectDoc.docNumber}</strong>
                  </div>
                  <div>
                    <span className="text-muted block">Issuing Body:</span>
                    <strong className="text-midnight">{inspectDoc.issuer}</strong>
                  </div>
                  <div>
                    <span className="text-muted block">OCR Verification:</span>
                    <strong className="text-emerald-700">99.8% Match Passed</strong>
                  </div>
                  <div>
                    <span className="text-muted block">Current Status:</span>
                    <strong className="capitalize text-violet">{inspectDoc.status}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="doc-lightbox-footer">
              <span className="text-xs text-muted">
                Cryptographic document hash: SHA-256:4F9C-8A21-KYC-AUDITED
              </span>
              <div className="flex items-center gap-2">
                <Button kind="secondary" size="sm" onClick={() => setInspectDoc(null)}>
                  Close Preview
                </Button>
                <Button
                  kind="primary"
                  size="sm"
                  icon="check"
                  onClick={() => {
                    verifyTechnician(inspectDoc.techId, "approved");
                    setInspectDoc(null);
                    setActionSuccessNotice(
                      `Document validated & ${inspectDoc.techName} marked as Approved.`,
                    );
                    setTimeout(() => setActionSuccessNotice(null), 3500);
                  }}
                >
                  Verify & Approve Document
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECT CONFIRMATION MODAL */}
      {rejectingTech && (
        <div className="modal-backdrop" onClick={() => setRejectingTech(null)}>
          <div className="reject-modal-content card p-6" onClick={(e) => e.stopPropagation()}>
            <div className="reject-modal-header">
              <div className="flex items-center gap-2 text-red-600">
                <Icon name="alert" size={24} />
                <h3 className="text-base font-bold text-midnight m-0">
                  Reject Application — {rejectingTech.name}
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setRejectingTech(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-muted mt-2">
              Select the primary non-compliance reason. The technician will receive an official
              notification with instructions to correct and re-upload.
            </p>

            <div className="reject-reasons-list mt-4 space-y-2">
              {[
                "Blurred or unreadable government Aadhaar / PAN scan",
                "Trade certification not recognized by Maharashtra Vocational Board",
                "Police Character Clearance certificate expired or incomplete",
                "Name mismatch between government identity and trade diploma",
                "other",
              ].map((r) => (
                <label key={r} className="reject-reason-option">
                  <input
                    type="radio"
                    name="adminRejectReason"
                    value={r}
                    checked={rejectReason === r}
                    onChange={() => setRejectReason(r)}
                  />
                  <span>{r === "other" ? "Other reason (specify below)" : r}</span>
                </label>
              ))}
            </div>

            {rejectReason === "other" && (
              <div className="form-group mt-3">
                <textarea
                  rows={2}
                  placeholder="State the non-compliance reason for administrative audit log..."
                  value={customRejectReason}
                  onChange={(e) => setCustomRejectReason(e.target.value)}
                  className="w-full text-xs p-2 border rounded-lg"
                />
              </div>
            )}

            <div className="reject-modal-actions mt-6 flex justify-end gap-3">
              <Button kind="secondary" size="sm" onClick={() => setRejectingTech(null)}>
                Cancel
              </Button>
              <button
                type="button"
                className="btn-danger-confirm text-xs"
                onClick={handleConfirmReject}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
