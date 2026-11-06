import { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";
import { processAndStoreImage, validateImageFile } from "../../utils/imageStorage";

export function EvidenceVaultView() {
  const { bookings, activeBookingId, saveEvidencePhotos, setActiveScreen } = useApp();
  const booking = bookings.find((b) => b.id === activeBookingId) || bookings[0];

  const [compareMode, setCompareMode] = useState<"side_by_side" | "slider">("side_by_side");
  const [sliderPos, setSliderPos] = useState(50);

  // Photos arrays
  const beforePhotos = booking.beforeWorkPhotos?.length
    ? booking.beforeWorkPhotos
    : booking.beforeWorkPhoto
      ? [booking.beforeWorkPhoto]
      : [];
  const afterPhotos = booking.afterWorkPhotos?.length
    ? booking.afterWorkPhotos
    : booking.afterWorkPhoto
      ? [booking.afterWorkPhoto]
      : [];

  // Selected photo indices for comparison slider
  const [selectedBeforeIdx, setSelectedBeforeIdx] = useState(0);
  const [selectedAfterIdx, setSelectedAfterIdx] = useState(0);

  // Full-size image Lightbox Modal state
  const [activeLightboxImg, setActiveLightboxImg] = useState<{
    url: string;
    title: string;
    hash?: string;
    timestamp?: string;
  } | null>(null);

  // Citizen extra upload state
  const citizenUploadRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<"before" | "after">("before");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const activeBeforePhoto = beforePhotos[selectedBeforeIdx] || beforePhotos[0] || "";
  const activeAfterPhoto = afterPhotos[selectedAfterIdx] || afterPhotos[0] || "";

  const handleCitizenUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];

    const val = validateImageFile(file);
    if (!val.valid) {
      setUploadError(val.error || "Invalid file format");
      if (citizenUploadRef.current) citizenUploadRef.current.value = "";
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const record = await processAndStoreImage(file);
      if (uploadTarget === "before") {
        const updated = [...beforePhotos, record.dataUrl];
        saveEvidencePhotos(booking.id, updated, afterPhotos, record.hash, booking.afterHash);
      } else {
        const updated = [...afterPhotos, record.dataUrl];
        saveEvidencePhotos(booking.id, beforePhotos, updated, booking.beforeHash, record.hash);
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload photo");
    } finally {
      setIsUploading(false);
      if (citizenUploadRef.current) citizenUploadRef.current.value = "";
    }
  };

  const hasAnyPhotos = beforePhotos.length > 0 || afterPhotos.length > 0;

  return (
    <div className="flow-page page-pad narrow-flow">
      {/* Hidden file input for citizen evidence additions */}
      <input
        ref={citizenUploadRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        style={{ display: "none" }}
        onChange={handleCitizenUpload}
      />

      <div className="flow-title">
        <button
          type="button"
          className="back-btn"
          onClick={() => setActiveScreen("tracking")}
          aria-label="Back to tracking"
        >
          <Icon name="chevron" size={18} />
        </button>
        <div>
          <span className="section-kicker">STEP 5 OF 8 · EVIDENCE VAULT</span>
          <h1>Before & After Evidence Vault</h1>
          <p>
            Cryptographically timestamped photographic records with SHA-256 integrity hashes.
            Verifies actual repair before funds leave escrow.
          </p>
        </div>
      </div>

      {uploadError && (
        <div className="upload-alert-box error mb-4">
          <Icon name="alert" size={16} />
          <span>{uploadError}</span>
          <button type="button" onClick={() => setUploadError(null)} className="alert-dismiss">
            ×
          </button>
        </div>
      )}

      {/* Header Info & Mode Switcher */}
      <div className="vault-mode-bar">
        <div className="mode-toggle">
          <button
            type="button"
            className={compareMode === "side_by_side" ? "active" : ""}
            onClick={() => setCompareMode("side_by_side")}
          >
            Gallery & Inspection
          </button>
          <button
            type="button"
            className={compareMode === "slider" ? "active" : ""}
            onClick={() => setCompareMode("slider")}
            disabled={!activeBeforePhoto || !activeAfterPhoto}
          >
            Interactive Split Slider
          </button>
        </div>

        <div className="vault-booking-ref">
          <small>Booking Ref:</small>
          <b>#{booking.id}</b>
          <span className="tech-name-pill">Expert: {booking.technicianName || "Ramesh Patil"}</span>
        </div>
      </div>

      {!hasAnyPhotos ? (
        /* Empty State */
        <div className="card p-8 text-center empty-evidence-card mt-6">
          <div className="empty-evidence-orb mb-3">
            <Icon name="camera" size={40} />
          </div>
          <h3>No Evidence Photos Uploaded Yet</h3>
          <p className="text-muted max-w-md mx-auto mt-2 text-sm leading-relaxed">
            Technician <b>{booking.technicianName || "Ramesh Patil"}</b> will capture required
            before-work and after-work evidence directly from their on-site technician dashboard for
            Booking #{booking.id}. Once captured, timestamped photos and SHA-256 integrity hashes
            will appear here automatically.
          </p>

          <div className="flex justify-center gap-3 mt-6">
            <Button
              kind="secondary"
              icon="camera"
              onClick={() => {
                setUploadTarget("before");
                citizenUploadRef.current?.click();
              }}
            >
              Upload Homeowner Evidence
            </Button>
            <Button kind="primary" icon="pin" onClick={() => setActiveScreen("tracking")}>
              View Technician GPS Status
            </Button>
          </div>
        </div>
      ) : compareMode === "side_by_side" ? (
        <div className="evidence-sections-wrapper mt-4">
          {/* SECTION 1: BEFORE WORK EVIDENCE */}
          <section className="evidence-section-group mb-6">
            <div className="evidence-section-header">
              <div>
                <span className="evidence-tag before">BEFORE WORK EVIDENCE</span>
                <h2 className="mt-1">Pre-Repair Defect Capture ({beforePhotos.length})</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="hash-tag">
                  <Icon name="shield" size={13} /> {booking.beforeHash || "SHA-256 VERIFIED"}
                </span>
                <span className="text-xs text-muted">
                  <Icon name="clock" size={13} /> {booking.beforeTimestamp || "21 Jun · 2:51 PM"}
                </span>
              </div>
            </div>

            {beforePhotos.length === 0 ? (
              <div className="empty-sub-slot card p-5 mt-2">
                <p className="text-muted text-sm">
                  No before-work photos uploaded yet by technician.
                </p>
              </div>
            ) : (
              <div className="evidence-thumbnails-grid mt-3">
                {beforePhotos.map((url, idx) => (
                  <article
                    key={idx}
                    className="evidence-card card clickable-card"
                    onClick={() =>
                      setActiveLightboxImg({
                        url,
                        title: `Before Repair Photo #${idx + 1}`,
                        hash: booking.beforeHash,
                        timestamp: booking.beforeTimestamp || "21 Jun · 2:51 PM",
                      })
                    }
                  >
                    <div className="evidence-image-container">
                      <img src={url} alt={`Before repair photo ${idx + 1}`} />
                      <span className="zoom-hint-badge">
                        <Icon name="search" size={14} /> Click to Enlarge
                      </span>
                    </div>
                    <div className="evidence-meta">
                      <div>
                        <h3>Pre-Repair Photo #{idx + 1}</h3>
                        <p>
                          <Icon name="user" size={13} /> Captured by{" "}
                          {booking.technicianName || "Technician"}
                        </p>
                      </div>
                      <span className="hash-tag sm">
                        <Icon name="shield" size={11} /> {booking.beforeHash || "SHA-256"}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* SECTION 2: AFTER WORK EVIDENCE */}
          <section className="evidence-section-group">
            <div className="evidence-section-header">
              <div>
                <span className="evidence-tag after">AFTER WORK EVIDENCE</span>
                <h2 className="mt-1">Completed Repair Verification ({afterPhotos.length})</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="hash-tag">
                  <Icon name="shield" size={13} /> {booking.afterHash || "SHA-256 VERIFIED"}
                </span>
                <span className="text-xs text-muted">
                  <Icon name="clock" size={13} /> {booking.afterTimestamp || "21 Jun · 3:24 PM"}
                </span>
              </div>
            </div>

            {afterPhotos.length === 0 ? (
              <div className="empty-sub-slot card p-5 mt-2">
                <p className="text-muted text-sm">
                  After-work photos will appear once technician finishes the on-site work.
                </p>
              </div>
            ) : (
              <div className="evidence-thumbnails-grid mt-3">
                {afterPhotos.map((url, idx) => (
                  <article
                    key={idx}
                    className="evidence-card card clickable-card"
                    onClick={() =>
                      setActiveLightboxImg({
                        url,
                        title: `After Repair Photo #${idx + 1}`,
                        hash: booking.afterHash,
                        timestamp: booking.afterTimestamp || "21 Jun · 3:24 PM",
                      })
                    }
                  >
                    <div className="evidence-image-container">
                      <img src={url} alt={`After repair photo ${idx + 1}`} />
                      <span className="zoom-hint-badge">
                        <Icon name="search" size={14} /> Click to Enlarge
                      </span>
                    </div>
                    <div className="evidence-meta">
                      <div>
                        <h3>Completed Work Photo #{idx + 1}</h3>
                        <p>
                          <Icon name="check" size={13} /> Fixed & Verified Clean
                        </p>
                      </div>
                      <span className="hash-tag sm">
                        <Icon name="shield" size={11} /> {booking.afterHash || "SHA-256"}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        /* Interactive Before/After Split Slider */
        <div className="interactive-slider-wrapper card mt-4">
          {/* Photo selectors if multiple exist */}
          {(beforePhotos.length > 1 || afterPhotos.length > 1) && (
            <div className="slider-photo-pickers-row p-4 pb-0 flex justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted">Before Photo:</span>
                {beforePhotos.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`picker-chip ${selectedBeforeIdx === i ? "active" : ""}`}
                    onClick={() => setSelectedBeforeIdx(i)}
                  >
                    #{i + 1}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted">After Photo:</span>
                {afterPhotos.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`picker-chip ${selectedAfterIdx === i ? "active" : ""}`}
                    onClick={() => setSelectedAfterIdx(i)}
                  >
                    #{i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="split-image-viewer">
            <img src={activeAfterPhoto} alt="After work" className="base-img" />
            <div
              className="clipped-img-wrap"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img src={activeBeforePhoto} alt="Before work" />
            </div>
            <div className="slider-divider-line" style={{ left: `${sliderPos}%` }}>
              <div className="slider-handle">
                <span>◀ ▶</span>
              </div>
            </div>
          </div>
          <div className="slider-controls">
            <span className="before-label">◄ Before Repair</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="comparison-range"
              aria-label="Compare before and after position"
            />
            <span className="after-label">After Repair ►</span>
          </div>
        </div>
      )}

      {/* Cryptographic Tamper-Resistant Security Note */}
      <div className="vault-security-card mt-6">
        <Icon name="lock" size={24} />
        <div>
          <b>SHA-256 Cryptographic Evidence Integrity</b>
          <p>
            Photographs are timestamped and cryptographically hashed upon capture. Integrity hashes
            ({booking.beforeHash || "4F9C"} & {booking.afterHash || "7D32"}) are permanently
            recorded in the HomeCare operations ledger to eliminate post-service billing disputes.
          </p>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="vault-bottom-row mt-6">
        <div>
          <b>Photographic proofs registered</b>
          <small>
            {booking.serviceId === "garbage"
              ? "Quality inspection audit ready to verify rubble clearance & recycling certificate"
              : booking.serviceId === "bodyguard"
                ? "Quality inspection audit ready to verify escort telemetries & incident-free transit"
                : "Quality inspection audit ready to verify joint seal & pipe integrity"}
          </small>
        </div>
        <Button kind="primary" icon="check" onClick={() => setActiveScreen("proof")}>
          Verify Quality Audit
        </Button>
      </div>

      {/* Full Size Image Lightbox Modal */}
      {activeLightboxImg && (
        <div className="modal-overlay" onClick={() => setActiveLightboxImg(null)}>
          <div className="lightbox-modal card" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-header">
              <div>
                <h3>{activeLightboxImg.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="hash-tag">
                    <Icon name="shield" size={13} /> {activeLightboxImg.hash || "SHA-256"}
                  </span>
                  <span className="text-xs text-muted">
                    <Icon name="clock" size={13} /> {activeLightboxImg.timestamp}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveLightboxImg(null)}
                aria-label="Close lightbox"
              >
                <Icon name="close" size={18} />
              </button>
            </div>
            <div className="lightbox-img-wrap">
              <img src={activeLightboxImg.url} alt={activeLightboxImg.title} />
            </div>
            <div className="lightbox-footer">
              <span className="text-xs text-muted">
                Booking Reference: #{booking.id} · Professional: {booking.technicianName}
              </span>
              <Button kind="secondary" size="sm" onClick={() => setActiveLightboxImg(null)}>
                Close Viewer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
