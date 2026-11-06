import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";

export function TechnicianDashboard() {
  const {
    bookings,
    technicians,
    activeBookingId,
    setActiveBookingId,
    sendTechnicianQuote,
    acceptTechnicianRequest,
    setActiveScreen,
  } = useApp();

  const tech = technicians[0]; // Ramesh Patil
  const [isOnline, setIsOnline] = useState(tech.isOnline);
  const [quoteInput, setQuoteInput] = useState("340");
  const [quoteSent, setQuoteSent] = useState(false);

  const pendingNewRequests = bookings.filter((b) => b.status === "request_submitted");

  const activeJob = bookings.find(
    (b) =>
      (b.technicianId === "tech-1" || !b.technicianId) &&
      ["quotation_accepted", "escrow_locked", "on_the_way", "arrived", "work_started"].includes(
        b.status,
      ),
  );

  const handleSendQuickQuote = () => {
    if (!activeJob) return;
    sendTechnicianQuote(
      activeJob.id,
      Number(quoteInput),
      "Standard visit and pipe leak fix with 7-day warranty.",
    );
    setQuoteSent(true);
    setTimeout(() => setQuoteSent(false), 3000);
  };

  return (
    <div className="pro-main page-pad">
      {/* Top Greeting */}
      <div className="pro-greeting">
        <div>
          <span className="section-kicker">SATURDAY, 21 JUNE · KOREGAON PARK ZONE</span>
          <h1>Good morning, {tech.name.split(" ")[0]}</h1>
          <p>
            There are <b>6 verified service requests</b> in your service radius today.
          </p>
        </div>

        {/* Online/Offline Toggle */}
        <div className={`online-toggle ${isOnline ? "online" : "offline"}`}>
          <span className="online-indicator-dot" />
          <span>{isOnline ? "Receiving Jobs" : "Offline"}</span>
          <button
            type="button"
            className="toggle-pill"
            onClick={() => setIsOnline(!isOnline)}
            aria-label="Toggle availability"
          >
            <span className="toggle-circle" />
          </button>
        </div>
      </div>

      {/* High-Priority Alert Banner for New Citizen Request */}
      {pendingNewRequests.length > 0 && (
        <section className="tech-new-request-alert-banner card mt-4 border-2 border-amber-500/30 bg-amber-50/50 p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold animate-pulse">
                <Icon name="bell" size={20} />
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  {pendingNewRequests.length} New Citizen Service Request Waiting for Acceptance
                </span>
                <h3 className="text-base font-bold text-slate-900 m-0">
                  {pendingNewRequests[0].citizenName} · {pendingNewRequests[0].serviceName}
                </h3>
                <p className="text-xs text-slate-600 m-0">
                  {pendingNewRequests[0].area} · Quoted Price: <b>₹{pendingNewRequests[0].lockedPrice}</b> · "{pendingNewRequests[0].issueDescription}"
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                kind="primary"
                icon="check"
                onClick={() => {
                  acceptTechnicianRequest(pendingNewRequests[0].id);
                  setActiveBookingId(pendingNewRequests[0].id);
                }}
              >
                Accept Request (₹{pendingNewRequests[0].lockedPrice})
              </Button>
              <Button
                kind="secondary"
                icon="arrow"
                onClick={() => {
                  setActiveBookingId(pendingNewRequests[0].id);
                  setActiveScreen("tech_requests");
                }}
              >
                View in Requests
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* KPI Stats Grid */}
      <div className="stat-grid">
        <div className="stat-card violet">
          <span className="stat-icon-wrap">
            <Icon name="wallet" size={22} />
          </span>
          <small>Today's Earnings</small>
          <strong>₹1,840</strong>
          <em>+12% vs last Saturday</em>
        </div>

        <div className="stat-card">
          <span className="stat-icon-wrap">
            <Icon name="briefcase" size={22} />
          </span>
          <small>Jobs Today</small>
          <strong>4</strong>
          <em>2 completed · 2 upcoming</em>
        </div>

        <div className="stat-card">
          <span className="stat-icon-wrap">
            <Icon name="star" size={22} className="star-icon" />
          </span>
          <small>Average Rating</small>
          <strong>{tech.rating}★</strong>
          <em>Top 5% in Pune ({tech.totalJobs} jobs)</em>
        </div>

        <div className="stat-card">
          <span className="stat-icon-wrap">
            <Icon name="chart" size={22} />
          </span>
          <small>Quote Acceptance</small>
          <strong>92%</strong>
          <em>Excellent response speed</em>
        </div>
      </div>

      {/* Active Job In-Progress Quick Card */}
      {activeJob ? (
        <section className="tech-active-job-banner card mt-6">
          <div className="tech-banner-content">
            <span className="job-badge active">IN PROGRESS · JOB #{activeJob.id}</span>
            <h3>{activeJob.serviceName}</h3>
            <p>
              Customer: <b>{activeJob.citizenName}</b> · {activeJob.citizenAddress}
            </p>
            <div className="job-meta-chips">
              <span>
                Status: <b className="capitalize">{activeJob.status.replace(/_/g, " ")}</b>
              </span>
              <span>
                Locked: <b>₹{activeJob.lockedPrice}</b> in Escrow
              </span>
              <span>
                Slot:{" "}
                <b>
                  {activeJob.scheduledDate}, {activeJob.scheduledTimeWindow}
                </b>
              </span>
            </div>
          </div>
          <div className="tech-banner-btn flex gap-2">
            <Button
              kind="secondary"
              icon="chat"
              onClick={() => {
                setActiveBookingId(activeJob.id);
                setActiveScreen("tech_job");
              }}
            >
              Chat with Customer ({activeJob.chatMessages.length})
            </Button>
            <Button
              kind="primary"
              icon="arrow"
              onClick={() => {
                setActiveBookingId(activeJob.id);
                setActiveScreen("tech_job");
              }}
            >
              Open Job Workflow
            </Button>
          </div>
        </section>
      ) : (
        <section className="tech-no-active-job-banner card p-5 mt-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-violet/10 text-violet flex items-center justify-center font-bold">
              <Icon name="check" size={20} />
            </span>
            <div>
              <h3 className="text-base font-bold text-midnight m-0">No active job in progress</h3>
              <p className="text-xs text-muted mt-0.5">
                All assigned work is completed. Inspect incoming homeowner requests to accept your
                next booking.
              </p>
            </div>
          </div>
          <Button kind="primary" icon="briefcase" onClick={() => setActiveScreen("tech_requests")}>
            Browse Service Requests
          </Button>
        </section>
      )}

      {/* Lower Columns: Nearby Radar & Incoming Request */}
      <div className="pro-columns mt-6">
        {/* Radar Map */}
        <section className="card nearby">
          <div className="section-head">
            <div>
              <h2>Nearby Requests Radar</h2>
              <p>Within 4 km of your current GPS location</p>
            </div>
            <button type="button" onClick={() => setActiveScreen("tech_requests")}>
              View all (6)
            </button>
          </div>

          <div className="radar">
            <div className="radar-ring a" />
            <div className="radar-ring b" />
            <span className="me" title="Your GPS Location">
              <img src={tech.photo} alt="Ramesh Patil" />
            </span>
            <button
              type="button"
              className="job j1"
              onClick={() => setActiveScreen("tech_requests")}
              title="Job: Kitchen pipe leak - ₹340"
            >
              ₹340 · 1.2km
            </button>
            <button
              type="button"
              className="job j2"
              onClick={() => setActiveScreen("tech_requests")}
              title="Job: Bathroom geyser plumbing - ₹480"
            >
              ₹480 · 2.5km
            </button>
            <button
              type="button"
              className="job j3"
              onClick={() => setActiveScreen("tech_requests")}
              title="Job: Tap washer replace - ₹260"
            >
              ₹260 · 3.1km
            </button>
          </div>
        </section>

        {/* Incoming Request Card */}
        <section className="card incoming">
          <span className="hot">
            <span className="hot-dot" /> NEW REQUEST · 2 MIN AGO
          </span>
          <h2>Kitchen Pipe is Leaking</h2>
          <p className="request-quote-text">
            “The drain pipe under my kitchen sink is dripping continuously whenever water runs. Need
            help tomorrow afternoon.”
          </p>

          <div className="request-meta">
            <span>
              <Icon name="pin" size={14} /> 1.2 km (Koregaon Park)
            </span>
            <span>
              <Icon name="calendar" size={14} /> Tomorrow, 2–4 PM
            </span>
            <span>
              <Icon name="shield" size={14} /> Escrow Protected
            </span>
          </div>

          <div className="citizen-row">
            <span className="citizen-avatar">AS</span>
            <div>
              <b>Asha Sharma</b>
              <small>4.9 citizen rating · 12 completed platform jobs</small>
            </div>
          </div>

          {/* Quick Quote Submission */}
          <div className="quote-box-wrap">
            <label>Send Itemized Quotation (INR):</label>
            <div className="quote-input">
              <span className="currency">₹</span>
              <input
                type="number"
                value={quoteInput}
                onChange={(e) => setQuoteInput(e.target.value)}
                placeholder="340"
              />
              <button type="button" className="voice-quote-btn" title="Add voice note to quote">
                <Icon name="mic" size={16} />
              </button>
            </div>
          </div>

          {quoteSent ? (
            <div className="quote-success-pill">
              <Icon name="check" size={16} />
              <span>Quote of ₹{quoteInput} sent to Asha Sharma!</span>
            </div>
          ) : (
            <div className="pro-actions">
              <Button kind="secondary" onClick={() => alert("Request skipped.")}>
                Skip
              </Button>
              <Button kind="primary" onClick={handleSendQuickQuote}>
                Send Quotation
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
