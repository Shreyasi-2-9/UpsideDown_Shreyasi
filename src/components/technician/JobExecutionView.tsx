import { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";
import { processAndStoreImage, validateImageFile } from "../../utils/imageStorage";
import type { Booking } from "../../types";

export function JobExecutionView() {
  const {
    bookings,
    activeBookingId,
    setActiveBookingId,
    advanceBookingStatus,
    saveEvidencePhotos,
    sendChatMessage,
    markChatAsRead,
    setTyping,
    typingMap,
    setActiveScreen,
  } = useApp();

  const [viewTab, setViewTab] = useState<"active" | "history">("active");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Active jobs: only jobs in active, non-completed, non-cancelled states
  const activeJobs = bookings.filter(
    (b) =>
      (b.technicianId === "tech-1" || !b.technicianId) &&
      ["quotation_accepted", "escrow_locked", "on_the_way", "arrived", "work_started"].includes(
        b.status,
      ),
  );

  // Completed jobs: jobs marked work_completed or payment_released
  const completedJobs = bookings.filter(
    (b) => b.technicianId === "tech-1" && ["work_completed", "payment_released"].includes(b.status),
  );

  // Current active job
  const activeJob = activeJobs.find((b) => b.id === activeBookingId) || activeJobs[0];

  // Work notes and material charges state
  const [workNotes, setWorkNotes] = useState(
    "Inspected kitchen drain pipe. Found cracked nylon washer at the S-trap coupling. Replaced with heavy-duty rubber seal and applied teflon tape.",
  );
  const [materialCharge, setMaterialCharge] = useState("0");

  // Evidence Photos State
  const [beforePhotos, setBeforePhotos] = useState<string[]>(
    activeJob?.beforeWorkPhotos?.length
      ? activeJob.beforeWorkPhotos
      : activeJob?.beforeWorkPhoto
        ? [activeJob.beforeWorkPhoto]
        : [],
  );
  const [afterPhotos, setAfterPhotos] = useState<string[]>(
    activeJob?.afterWorkPhotos?.length
      ? activeJob.afterWorkPhotos
      : activeJob?.afterWorkPhoto
        ? [activeJob.afterWorkPhoto]
        : [],
  );
  const [beforeHash, setBeforeHash] = useState(activeJob?.beforeHash || "4F9C-8A21-EVID-B4");
  const [afterHash, setAfterHash] = useState(activeJob?.afterHash || "7D32-10AB-EVID-AFT");

  // Keep photos in sync when activeJob changes
  useEffect(() => {
    if (activeJob) {
      setBeforePhotos(
        activeJob.beforeWorkPhotos?.length
          ? activeJob.beforeWorkPhotos
          : activeJob.beforeWorkPhoto
            ? [activeJob.beforeWorkPhoto]
            : [],
      );
      setAfterPhotos(
        activeJob.afterWorkPhotos?.length
          ? activeJob.afterWorkPhotos
          : activeJob.afterWorkPhoto
            ? [activeJob.afterWorkPhoto]
            : [],
      );
      setBeforeHash(activeJob.beforeHash || "4F9C-8A21-EVID-B4");
      setAfterHash(activeJob.afterHash || "7D32-10AB-EVID-AFT");
    }
  }, [activeJob?.id]);

  // Uploading & Error States
  const [isUploadingBefore, setIsUploadingBefore] = useState(false);
  const [isUploadingAfter, setIsUploadingAfter] = useState(false);
  const [beforeError, setBeforeError] = useState<string | null>(null);
  const [afterError, setAfterError] = useState<string | null>(null);
  const [beforeSuccess, setBeforeSuccess] = useState<string | null>(null);
  const [afterSuccess, setAfterSuccess] = useState<string | null>(null);

  const beforeFileInputRef = useRef<HTMLInputElement>(null);
  const afterFileInputRef = useRef<HTMLInputElement>(null);

  // Chat State
  const [chatText, setChatText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (activeJob) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeJob?.chatMessages, activeJob?.id ? typingMap[activeJob.id] : null]);

  // Mark citizen messages as read when technician views
  useEffect(() => {
    if (activeJob) {
      markChatAsRead(activeJob.id, "technician");
    }
  }, [activeJob?.id, activeJob?.chatMessages?.length]);

  // Stage checks helper
  const currentStatus = activeJob?.status;
  const isAcceptedOrLocked =
    currentStatus === "quotation_accepted" || currentStatus === "escrow_locked";
  const isOnTheWay = currentStatus === "on_the_way";
  const isArrived = currentStatus === "arrived";
  const isWorkStarted = currentStatus === "work_started";
  const isWorkCompleted =
    currentStatus === "work_completed" || currentStatus === "payment_released";

  // Sequential progression handler
  const handleSequentialStatusAdvance = async (targetStatus: Booking["status"]) => {
    if (!activeJob || isProcessing) return;

    // Strict sequential rule validation
    if (targetStatus === "on_the_way" && !isAcceptedOrLocked) return;
    if (targetStatus === "arrived" && !isOnTheWay) return;
    if (targetStatus === "work_started" && !isArrived) return;
    if (targetStatus === "work_completed" && !isWorkStarted) return;

    setIsProcessing(true);
    try {
      advanceBookingStatus(activeJob.id, targetStatus);
      const labels: Record<string, string> = {
        on_the_way: "Status updated: On the Way to customer location.",
        arrived: "Status updated: Arrived at customer doorstep.",
        work_started: "Status updated: Work started.",
        work_completed: "Job completed! Moved to Completed History.",
      };
      setSuccessMessage(labels[targetStatus] || "Status updated.");
      setTimeout(() => setSuccessMessage(null), 3500);

      if (targetStatus === "work_completed") {
        // Save evidence photos right before completing
        saveEvidencePhotos(activeJob.id, beforePhotos, afterPhotos, beforeHash, afterHash);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBeforeFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0 || !activeJob) return;
    const files = Array.from(fileList);

    for (const f of files) {
      const val = validateImageFile(f);
      if (!val.valid) {
        setBeforeError(val.error || "Invalid file format");
        if (beforeFileInputRef.current) beforeFileInputRef.current.value = "";
        return;
      }
    }

    setIsUploadingBefore(true);
    setBeforeError(null);
    setBeforeSuccess(null);

    try {
      const records = await Promise.all(files.map((f) => processAndStoreImage(f)));
      const newUrls = records.map((r) => r.dataUrl);
      const combined = [...beforePhotos, ...newUrls];
      setBeforePhotos(combined);
      setBeforeHash(records[0].hash);
      setBeforeSuccess(
        `Uploaded ${files.length} before-work photo(s) with SHA hash: ${records[0].hash}`,
      );
      setTimeout(() => setBeforeSuccess(null), 3500);

      // Save immediately into booking so citizen can see in real-time
      saveEvidencePhotos(activeJob.id, combined, afterPhotos, records[0].hash, afterHash);
    } catch (err: any) {
      setBeforeError(err.message || "Failed to upload photo. Try another image.");
    } finally {
      setIsUploadingBefore(false);
      if (beforeFileInputRef.current) beforeFileInputRef.current.value = "";
    }
  };

  const handleAfterFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0 || !activeJob) return;
    const files = Array.from(fileList);

    for (const f of files) {
      const val = validateImageFile(f);
      if (!val.valid) {
        setAfterError(val.error || "Invalid file format");
        if (afterFileInputRef.current) afterFileInputRef.current.value = "";
        return;
      }
    }

    setIsUploadingAfter(true);
    setAfterError(null);
    setAfterSuccess(null);

    try {
      const records = await Promise.all(files.map((f) => processAndStoreImage(f)));
      const newUrls = records.map((r) => r.dataUrl);
      const combined = [...afterPhotos, ...newUrls];
      setAfterPhotos(combined);
      setAfterHash(records[0].hash);
      setAfterSuccess(
        `Uploaded ${files.length} after-work photo(s) with SHA hash: ${records[0].hash}`,
      );
      setTimeout(() => setAfterSuccess(null), 3500);

      // Save immediately into booking so citizen can see in real-time
      saveEvidencePhotos(activeJob.id, beforePhotos, combined, beforeHash, records[0].hash);
    } catch (err: any) {
      setAfterError(err.message || "Failed to upload photo. Try another image.");
    } finally {
      setIsUploadingAfter(false);
      if (afterFileInputRef.current) afterFileInputRef.current.value = "";
    }
  };

  const handleRemoveBeforePhoto = (idx: number) => {
    if (!activeJob) return;
    const updated = beforePhotos.filter((_, i) => i !== idx);
    setBeforePhotos(updated);
    saveEvidencePhotos(activeJob.id, updated, afterPhotos, beforeHash, afterHash);
  };

  const handleRemoveAfterPhoto = (idx: number) => {
    if (!activeJob) return;
    const updated = afterPhotos.filter((_, i) => i !== idx);
    setAfterPhotos(updated);
    saveEvidencePhotos(activeJob.id, beforePhotos, updated, beforeHash, afterHash);
  };

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setChatText(val);

    if (activeJob && val.trim()) {
      setTyping(activeJob.id, "technician");
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(activeJob.id, null);
      }, 2500);
    } else if (activeJob) {
      setTyping(activeJob.id, null);
    }
  };

  const handleSendTechMessage = (e?: React.FormEvent, quickReply?: string) => {
    if (e) e.preventDefault();
    if (!activeJob) return;
    const msg = (quickReply || chatText).trim();
    if (!msg) return;

    sendChatMessage(activeJob.id, "technician", msg);
    setChatText("");
    setTyping(activeJob.id, null);
  };

  const isCitizenTyping = activeJob ? typingMap[activeJob.id] === "citizen" : false;

  return (
    <div className="flow-page page-pad active-job-view">
      {/* Top Title & Navigation */}
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
          <span className="section-kicker">ON-SITE EXECUTION & ESCROW VERIFICATION</span>
          <h1>Technician Job Workflow</h1>
          <p>
            Strict sequential on-site milestones, two-way customer chat, and cryptographic
            before/after photo vault.
          </p>
        </div>
      </div>

      {/* View Switcher: Active Jobs vs Completed History */}
      <div className="requests-category-tabs mt-4">
        <button
          type="button"
          className={`category-tab-btn ${viewTab === "active" ? "active" : ""}`}
          onClick={() => setViewTab("active")}
        >
          Active Jobs ({activeJobs.length})
        </button>
        <button
          type="button"
          className={`category-tab-btn ${viewTab === "history" ? "active" : ""}`}
          onClick={() => setViewTab("history")}
        >
          Completed Jobs History ({completedJobs.length})
        </button>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="requests-success-banner mt-3">
          <Icon name="check" size={18} />
          <span>{successMessage}</span>
          <button type="button" onClick={() => setSuccessMessage(null)} className="alert-dismiss">
            ×
          </button>
        </div>
      )}

      {/* TAB 1: ACTIVE JOBS SCREEN */}
      {viewTab === "active" && (
        <>
          {activeJobs.length === 0 ? (
            /* Friendly Empty State when no active jobs remain */
            <div className="card p-8 mt-6 text-center empty-active-jobs-card">
              <div className="empty-job-icon-wrap">
                <Icon name="check" size={48} />
              </div>
              <h2 className="text-2xl font-extrabold text-midnight mt-3">
                All caught up! You have no active jobs right now.
              </h2>
              <p className="text-muted mt-2 max-w-md mx-auto text-sm">
                Completed jobs are automatically archived in your verified history. Browse nearby
                civic requests to accept new service opportunities.
              </p>
              <div className="flex items-center justify-center gap-3 mt-6">
                <Button
                  kind="primary"
                  icon="briefcase"
                  onClick={() => setActiveScreen("tech_requests")}
                >
                  Browse New Requests
                </Button>
                <Button kind="secondary" icon="clock" onClick={() => setViewTab("history")}>
                  View Completed Jobs History ({completedJobs.length})
                </Button>
              </div>
            </div>
          ) : (
            /* Active Job Layout */
            <div className="job-workflow-grid mt-6">
              {/* Left Column: Sequential Milestones & Details */}
              <div className="job-steps-column">
                {/* Step 1: Sequential Status Progression Card */}
                <section className="card p-6 sequential-progress-card">
                  <div className="section-head flex items-center justify-between">
                    <div>
                      <span className="summary-label">STAGE 1 · DESTINATION & PROGRESSION</span>
                      <h3 className="text-lg font-bold text-midnight">Sequential Job Milestones</h3>
                    </div>
                    <span className={`status-badge status-${activeJob.status.replace(/_/g, "-")}`}>
                      {activeJob.status.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </div>

                  {/* Customer Information Block */}
                  <div className="customer-info-box mt-4">
                    <div className="citizen-row">
                      <span className="citizen-avatar sm">
                        {activeJob.citizenName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                      <div className="flex-1">
                        <b>{activeJob.citizenName}</b>
                        <p>{activeJob.citizenPhone}</p>
                        <small className="text-muted block mt-0.5">
                          <Icon name="pin" size={12} /> {activeJob.citizenAddress}
                        </small>
                      </div>
                      <a
                        href={`tel:${activeJob.citizenPhone}`}
                        className="call-quick-btn"
                        title="Call Customer"
                      >
                        <Icon name="phone" size={16} />
                      </a>
                    </div>
                  </div>

                  {/* Sequential Progression Stepper Buttons */}
                  <div className="sequential-buttons-bar mt-5">
                    {/* Stage 1: Accepted / Escrow Locked */}
                    <div className="milestone-step completed">
                      <div className="step-indicator">
                        <span className="step-check">✓</span>
                      </div>
                      <div className="step-meta">
                        <strong>1. Job Accepted</strong>
                        <small>Escrow Locked</small>
                      </div>
                    </div>

                    {/* Stage 2: Mark On The Way */}
                    <button
                      type="button"
                      className={`step-action-button ${
                        isOnTheWay || isArrived || isWorkStarted || isWorkCompleted
                          ? "done"
                          : isAcceptedOrLocked
                            ? "current"
                            : "disabled"
                      }`}
                      disabled={isProcessing || !isAcceptedOrLocked}
                      onClick={() => handleSequentialStatusAdvance("on_the_way")}
                    >
                      <span className="btn-icon">
                        {isOnTheWay || isArrived || isWorkStarted || isWorkCompleted ? (
                          "✓"
                        ) : (
                          <Icon name="pin" size={14} />
                        )}
                      </span>
                      <span className="btn-label">
                        {isOnTheWay || isArrived || isWorkStarted || isWorkCompleted
                          ? "On the Way ✓"
                          : "Mark On the Way"}
                      </span>
                    </button>

                    {/* Stage 3: Mark Arrived */}
                    <button
                      type="button"
                      className={`step-action-button ${
                        isArrived || isWorkStarted || isWorkCompleted
                          ? "done"
                          : isOnTheWay
                            ? "current"
                            : "disabled"
                      }`}
                      disabled={isProcessing || !isOnTheWay}
                      onClick={() => handleSequentialStatusAdvance("arrived")}
                    >
                      <span className="btn-icon">
                        {isArrived || isWorkStarted || isWorkCompleted ? (
                          "✓"
                        ) : (
                          <Icon name="home" size={14} />
                        )}
                      </span>
                      <span className="btn-label">
                        {isArrived || isWorkStarted || isWorkCompleted
                          ? "Arrived ✓"
                          : "Mark Arrived"}
                      </span>
                    </button>

                    {/* Stage 4: Start Work */}
                    <button
                      type="button"
                      className={`step-action-button ${
                        isWorkStarted || isWorkCompleted
                          ? "done"
                          : isArrived
                            ? "current"
                            : "disabled"
                      }`}
                      disabled={isProcessing || !isArrived}
                      onClick={() => handleSequentialStatusAdvance("work_started")}
                    >
                      <span className="btn-icon">
                        {isWorkStarted || isWorkCompleted ? "✓" : <Icon name="hammer" size={14} />}
                      </span>
                      <span className="btn-label">
                        {isWorkStarted || isWorkCompleted ? "Work Started ✓" : "Start Work"}
                      </span>
                    </button>
                  </div>

                  {isProcessing && (
                    <div className="status-updating-loader mt-3">
                      <span className="spinner-mini" /> Updating milestone status...
                    </div>
                  )}
                </section>

                {/* TWO-WAY CUSTOMER CHAT FOR TECHNICIAN */}
                <section className="card p-5 mt-5 tech-chat-panel">
                  <div className="section-head flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="citizen-avatar sm">
                        {activeJob.citizenName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-midnight m-0">
                          Direct Chat with {activeJob.citizenName}
                        </h3>
                        <small className="online-text">
                          <span className="online-dot" /> Live Connected · Homeowner
                        </small>
                      </div>
                    </div>
                    <span className="text-xs text-muted font-mono">Job #{activeJob.id}</span>
                  </div>

                  {/* Technician Quick Reply Chips */}
                  <div className="chat-quick-suggestions mt-3">
                    <button
                      type="button"
                      className="suggestion-chip"
                      onClick={() =>
                        handleSendTechMessage(
                          undefined,
                          "I am on the way, arriving in approx 15 minutes.",
                        )
                      }
                    >
                      On the way (15m)
                    </button>
                    <button
                      type="button"
                      className="suggestion-chip"
                      onClick={() =>
                        handleSendTechMessage(
                          undefined,
                          "I have arrived at your building entrance.",
                        )
                      }
                    >
                      Arrived at gate
                    </button>
                    <button
                      type="button"
                      className="suggestion-chip"
                      onClick={() =>
                        handleSendTechMessage(
                          undefined,
                          "Inspecting the leak now. Will update you shortly.",
                        )
                      }
                    >
                      Inspecting leak
                    </button>
                    <button
                      type="button"
                      className="suggestion-chip"
                      onClick={() =>
                        handleSendTechMessage(
                          undefined,
                          "Work is completed! Please inspect the photos.",
                        )
                      }
                    >
                      Work completed
                    </button>
                  </div>

                  {/* Messages Stream */}
                  <div className="messages-stream tech-stream mt-3">
                    <div className="day-label">TODAY · SECURE MESSAGING</div>
                    {activeJob.chatMessages.map((m) => {
                      const isMine = m.sender === "technician";
                      return (
                        <div
                          key={m.id}
                          className={`bubble ${isMine ? "mine" : m.sender === "system" ? "system-bubble" : "theirs"}`}
                        >
                          <span className="sender-name-label">
                            {m.senderName ||
                              (isMine
                                ? "You (Ramesh Patil)"
                                : `${activeJob.citizenName} (Customer)`)}
                          </span>
                          <p>{m.text}</p>
                          <div className="bubble-footer-meta">
                            <small className="msg-time">{m.timestamp}</small>
                            {isMine && (
                              <span className={`msg-status-tag ${m.status || "delivered"}`}>
                                {m.status === "read"
                                  ? "✓✓ Read"
                                  : m.status === "delivered"
                                    ? "✓✓ Delivered"
                                    : "✓ Sent"}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Typing indicator */}
                    {isCitizenTyping && (
                      <div className="typing-indicator-row theirs">
                        <span className="sender-name-label">{activeJob.citizenName}</span>
                        <div className="typing-bubble">
                          <span className="typing-dot" />
                          <span className="typing-dot" />
                          <span className="typing-dot" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Tech Chat Input Bar */}
                  <form className="chat-input-bar mt-2" onSubmit={(e) => handleSendTechMessage(e)}>
                    <input
                      type="text"
                      value={chatText}
                      onChange={handleChatInputChange}
                      placeholder={`Reply to ${activeJob.citizenName}...`}
                    />
                    <button type="submit" className="chat-send-btn" disabled={!chatText.trim()}>
                      <Icon name="arrow" size={18} />
                    </button>
                  </form>
                </section>

                {/* Step 2: Upload Before-Work Evidence */}
                <section className="card p-5 mt-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-midnight m-0">
                        2. Before-Work Photo Capture
                      </h3>
                      <p className="sub-helper text-xs text-muted mt-1">
                        Take or upload photos showing the defect before you repair.
                      </p>
                    </div>
                    <span className="hash-tag-pill">
                      <Icon name="shield" size={13} /> {beforeHash}
                    </span>
                  </div>

                  {/* Hidden device file input */}
                  <input
                    ref={beforeFileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    style={{ display: "none" }}
                    onChange={handleBeforeFileSelect}
                    disabled={isUploadingBefore}
                  />

                  {beforeError && (
                    <div className="upload-alert-box error mt-3">
                      <Icon name="alert" size={16} />
                      <span>{beforeError}</span>
                      <button
                        type="button"
                        onClick={() => setBeforeError(null)}
                        className="alert-dismiss"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {beforeSuccess && (
                    <div className="upload-alert-box success mt-3">
                      <Icon name="check" size={16} />
                      <span>{beforeSuccess}</span>
                    </div>
                  )}

                  {/* Photo Gallery Grid */}
                  <div className="photos-preview-gallery mt-3">
                    {beforePhotos.map((photoUrl, idx) => (
                      <div key={idx} className="photo-thumb-wrap">
                        <img src={photoUrl} alt={`Before repair ${idx + 1}`} />
                        <button
                          type="button"
                          className="remove-photo-pill"
                          onClick={() => handleRemoveBeforePhoto(idx)}
                          title="Remove photo"
                        >
                          <Icon name="trash" size={14} />
                        </button>
                        <span className="photo-index-badge">Before #{idx + 1}</span>
                      </div>
                    ))}

                    <button
                      type="button"
                      className={`add-photo-btn ${isUploadingBefore ? "uploading-active" : ""}`}
                      onClick={() => beforeFileInputRef.current?.click()}
                      disabled={isUploadingBefore}
                    >
                      {isUploadingBefore ? (
                        <>
                          <span className="upload-spinner" />
                          <span>Uploading...</span>
                          <small>Calculating SHA hash</small>
                        </>
                      ) : (
                        <>
                          <Icon name="camera" size={24} />
                          <span>+ Upload Before Photo</span>
                          <small>JPG, PNG, WEBP</small>
                        </>
                      )}
                    </button>
                  </div>
                </section>

                {/* Step 3: Work Details & Diagnosis */}
                <section className="card p-5 mt-5">
                  <h3 className="text-base font-bold text-midnight m-0">
                    3. Work Details & Material Charges
                  </h3>
                  <p className="sub-helper text-xs text-muted mt-1">
                    Describe the fix and any replacement parts used.
                  </p>

                  <div className="form-group mt-3">
                    <label>Work Summary & Diagnosis</label>
                    <textarea
                      rows={3}
                      value={workNotes}
                      onChange={(e) => setWorkNotes(e.target.value)}
                      placeholder="What parts were replaced? What was the cause of the issue?"
                    />
                  </div>

                  <div className="form-group mt-3">
                    <label>Additional Material / Parts Charge (INR)</label>
                    <div className="price-input-wrap">
                      <span>₹</span>
                      <input
                        type="number"
                        value={materialCharge}
                        onChange={(e) => setMaterialCharge(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <small className="text-muted">
                      Enter ₹0 if standard consumables or customer provided parts.
                    </small>
                  </div>
                </section>

                {/* Step 4: Upload After-Work Evidence */}
                <section className="card p-5 mt-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-midnight m-0">
                        4. After-Work Photo Capture
                      </h3>
                      <p className="sub-helper text-xs text-muted mt-1">
                        Take or upload photos showing the fully repaired, clean, and dry joint.
                      </p>
                    </div>
                    <span className="hash-tag-pill">
                      <Icon name="shield" size={13} /> {afterHash}
                    </span>
                  </div>

                  {/* Hidden device file input */}
                  <input
                    ref={afterFileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    style={{ display: "none" }}
                    onChange={handleAfterFileSelect}
                    disabled={isUploadingAfter}
                  />

                  {afterError && (
                    <div className="upload-alert-box error mt-3">
                      <Icon name="alert" size={16} />
                      <span>{afterError}</span>
                      <button
                        type="button"
                        onClick={() => setAfterError(null)}
                        className="alert-dismiss"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {afterSuccess && (
                    <div className="upload-alert-box success mt-3">
                      <Icon name="check" size={16} />
                      <span>{afterSuccess}</span>
                    </div>
                  )}

                  {/* After Photos Gallery */}
                  <div className="photos-preview-gallery mt-3">
                    {afterPhotos.map((photoUrl, idx) => (
                      <div key={idx} className="photo-thumb-wrap">
                        <img src={photoUrl} alt={`After repair ${idx + 1}`} />
                        <button
                          type="button"
                          className="remove-photo-pill"
                          onClick={() => handleRemoveAfterPhoto(idx)}
                          title="Remove photo"
                        >
                          <Icon name="trash" size={14} />
                        </button>
                        <span className="photo-index-badge">After #{idx + 1}</span>
                      </div>
                    ))}

                    <button
                      type="button"
                      className={`add-photo-btn ${isUploadingAfter ? "uploading-active" : ""}`}
                      onClick={() => afterFileInputRef.current?.click()}
                      disabled={isUploadingAfter}
                    >
                      {isUploadingAfter ? (
                        <>
                          <span className="upload-spinner" />
                          <span>Uploading...</span>
                          <small>Calculating SHA hash</small>
                        </>
                      ) : (
                        <>
                          <Icon name="camera" size={24} />
                          <span>+ Upload After Photo</span>
                          <small>JPG, PNG, WEBP</small>
                        </>
                      )}
                    </button>
                  </div>
                </section>

                {/* Step 5: Mark Work Completed & Submit */}
                <div className="job-submission-box card p-6 mt-5">
                  <div>
                    <h3 className="text-base font-bold text-midnight m-0">
                      5. Finish Job & Submit Sign-off
                    </h3>
                    <p className="text-xs text-muted mt-1">
                      Once submitted, the job is archived from your active screen into Completed
                      Jobs History. Customer is prompted to release escrow payout.
                    </p>

                    <Button
                      kind="primary"
                      icon="check"
                      size="lg"
                      className="w-full mt-4"
                      disabled={isProcessing || !isWorkStarted}
                      onClick={() => handleSequentialStatusAdvance("work_completed")}
                    >
                      {isProcessing
                        ? "Submitting Work Evidence..."
                        : "Mark Work Completed & Submit"}
                    </Button>
                    {!isWorkStarted && (
                      <p className="text-[11px] text-amber-700 mt-2 text-center">
                        ⚠️ Please advance earlier milestones ('On the Way' → 'Arrived' → 'Start
                        Work') before marking completed.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Escrow & Settlement Breakdown */}
              <aside className="job-payout-sidebar">
                <div className="card p-5 sticky top-20">
                  <span className="summary-label">ESCROW SETTLEMENT</span>
                  <h3 className="text-base font-bold text-midnight mt-1">Job Payout Breakdown</h3>

                  <dl className="receipt-dl mt-3">
                    <div>
                      <dt>Agreed Service Fee</dt>
                      <dd>₹{activeJob.lockedPrice.toFixed(2)}</dd>
                    </div>
                    <div>
                      <dt>Material Charges Added</dt>
                      <dd>₹{Number(materialCharge).toFixed(2)}</dd>
                    </div>
                    <div>
                      <dt>Platform Commission (5%)</dt>
                      <dd>-₹{(activeJob.lockedPrice * 0.05).toFixed(2)}</dd>
                    </div>
                    <div className="total-row">
                      <dt>Your Net Payout</dt>
                      <dd className="text-violet">
                        ₹
                        {(
                          activeJob.lockedPrice +
                          Number(materialCharge) -
                          activeJob.lockedPrice * 0.05
                        ).toFixed(2)}
                      </dd>
                    </div>
                  </dl>

                  <div className="escrow-safe-card mt-4">
                    <Icon name="lock" size={20} />
                    <div>
                      <b>Funds Secured in Escrow</b>
                      <small>
                        Credited directly to your UPI/Bank account upon customer verification.
                      </small>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      kind="secondary"
                      icon="shield"
                      className="w-full"
                      onClick={() =>
                        alert(
                          `Job reference: ${activeJob.id} · Escrow secured: ₹${activeJob.lockedPrice}`,
                        )
                      }
                    >
                      Inspect Protection Ledger
                    </Button>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </>
      )}

      {/* TAB 2: COMPLETED JOBS HISTORY */}
      {viewTab === "history" && (
        <div className="completed-jobs-history mt-6">
          {completedJobs.length === 0 ? (
            <div className="card p-8 text-center">
              <Icon name="briefcase" size={40} />
              <h3 className="mt-3">No completed jobs yet</h3>
              <p className="text-muted text-sm mt-1">
                Completed jobs will appear here with timestamps, payouts, and customer reviews.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedJobs.map((cj) => (
                <article key={cj.id} className="card p-5 completed-job-card">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                        ✓
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-midnight m-0">
                            {cj.serviceName}
                          </h3>
                          <span className="req-booking-number">#{cj.id}</span>
                        </div>
                        <p className="text-xs text-muted mt-0.5">
                          Customer: <b>{cj.citizenName}</b> · {cj.citizenAddress}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-violet block">
                        ₹{cj.lockedPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-emerald-700 font-semibold">
                        {cj.status === "payment_released"
                          ? "Payment Released"
                          : "Work Completed · Pending Citizen Release"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-outline flex items-center justify-between text-xs text-muted flex-wrap gap-2">
                    <span>
                      <Icon name="calendar" size={12} /> Completed:{" "}
                      <b>{cj.completedAt || "20 Jun 2026"}</b>
                    </span>
                    <span>
                      <Icon name="shield" size={12} /> Warranty Active Until:{" "}
                      <b>{cj.warrantyActiveUntil || "7 Days"}</b>
                    </span>
                    <span className="text-emerald-700 font-medium">
                      Evidence Hash: {cj.afterHash || "7D32-10AB-EVID"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
