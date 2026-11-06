import { useState, useRef, useEffect, useCallback } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";
import { FindingTechnicianModal, type FindingTechnicianOptions } from "./FindingTechnicianModal";
import { api } from "../../lib/api";

const SERVICE_BENCHMARK_CONFIG: Record<
  string,
  { min: number; max: number; benchmark: number; count: number; name: string }
> = {
  plumbing: { min: 300, max: 420, benchmark: 340, count: 186, name: "plumbing repairs" },
  electrical: { min: 180, max: 280, benchmark: 210, count: 142, name: "electrical repairs" },
  ac_repair: { min: 450, max: 650, benchmark: 520, count: 98, name: "AC care services" },
  cleaning: { min: 350, max: 550, benchmark: 420, count: 115, name: "deep cleanings" },
  carpentry: { min: 280, max: 400, benchmark: 320, count: 74, name: "carpentry jobs" },
  painting: { min: 550, max: 800, benchmark: 650, count: 62, name: "painting requests" },
  appliances: { min: 320, max: 480, benchmark: 380, count: 89, name: "appliance fixes" },
  pest_control: { min: 650, max: 900, benchmark: 720, count: 53, name: "pest treatments" },
  garbage: { min: 120, max: 220, benchmark: 140, count: 210, name: "waste collections" },
  bodyguard: { min: 850, max: 1300, benchmark: 950, count: 38, name: "security escorts" },
};

export function QuotationNegotiationView() {
  const {
    bookings,
    activeBookingId,
    counterOffer,
    sendChatMessage,
    markChatAsRead,
    setTyping,
    typingMap,
    acceptQuote,
    acceptTechnicianRequest,
    setActiveScreen,
    setSelectedTechId,
    seniorMode,
    t,
  } = useApp();

  const booking = bookings.find((b) => b.id === activeBookingId) || bookings[0];
  const serviceKey = booking?.serviceId || "plumbing";
  const bm = SERVICE_BENCHMARK_CONFIG[serviceKey] || SERVICE_BENCHMARK_CONFIG.plumbing;

  const [selectedQuoteId, setSelectedQuoteId] = useState(
    booking?.activeQuotationId || booking?.quotations[0]?.id || "q-1",
  );
  const activeQuote =
    booking?.quotations.find((q) => q.id === selectedQuoteId) || booking?.quotations[0];

  const [sliderPrice, setSliderPrice] = useState(
    activeQuote?.currentPrice ?? bm.benchmark,
  );

  useEffect(() => {
    if (activeQuote?.currentPrice) {
      setSliderPrice(activeQuote.currentPrice);
    } else {
      setSliderPrice(bm.benchmark);
    }
  }, [booking?.id, activeQuote?.id, bm.benchmark]);

  const [newChatText, setNewChatText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);

  // Finding Technician Loading Modal state (supports ALL services)
  const [isFinding, setIsFinding] = useState(false);
  const [findingDetails, setFindingDetails] = useState<FindingTechnicianOptions>({
    technicianName: activeQuote?.technicianName || "Verified Specialist",
    price: activeQuote?.currentPrice ?? bm.benchmark,
    eta: activeQuote?.eta || "18 min",
  });
  const [isAgreedPulse, setIsAgreedPulse] = useState(false);

  // Reusable function as required: showFindingOverlay({ technicianName, price, eta, onComplete })
  const showFindingOverlay = useCallback(
    ({
      technicianName = activeQuote?.technicianName || "Ramesh Patil",
      price = activeQuote?.currentPrice ?? 199,
      eta = activeQuote?.eta || "18 min",
      onComplete,
    }: FindingTechnicianOptions = {}) => {
      if (isFinding) return; // Prevent double-trigger guard
      setIsFinding(true);
      setFindingDetails({
        technicianName,
        price,
        eta,
        onComplete: () => {
          setIsAgreedPulse(true);
          if (onComplete) {
            onComplete();
          }
        },
      });
    },
    [isFinding, activeQuote],
  );

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [booking?.chatMessages, typingMap[booking?.id]]);

  // Mark technician messages as read when citizen views chat
  useEffect(() => {
    if (booking?.id) {
      markChatAsRead(booking.id, "citizen");
    }
  }, [booking?.id, booking?.chatMessages?.length]);

  // Periodic polling for live messages from backend
  useEffect(() => {
    if (!booking?.id) return;
    const interval = setInterval(async () => {
      try {
        const liveMsgs = await api.chat.getMessages(booking.id);
        if (Array.isArray(liveMsgs) && liveMsgs.length > booking.chatMessages.length) {
          // If new messages arrived from technician, update chat
          liveMsgs.forEach((lm: any) => {
            if (!booking.chatMessages.some((m) => m.id === lm.id)) {
              booking.chatMessages.push({
                id: lm.id,
                sender: lm.sender as any,
                senderName: lm.senderName,
                text: lm.text,
                timestamp: lm.timestamp,
                status: lm.status as any,
              });
            }
          });
        }
      } catch {}
    }, 4000);
    return () => clearInterval(interval);
  }, [booking?.id, booking?.chatMessages]);

  const handleSendCounter = () => {
    if (activeQuote) {
      counterOffer(booking.id, activeQuote.id, sliderPrice);
    }
  };

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewChatText(val);

    if (val.trim()) {
      setTyping(booking.id, "citizen");
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(booking.id, null);
      }, 2500);
    } else {
      setTyping(booking.id, null);
    }
  };

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText || newChatText).trim();
    if (!textToSend || !booking) return;

    sendChatMessage(booking.id, "citizen", textToSend);
    setNewChatText("");
    setTyping(booking.id, null);
  };

  // Lock Price Handler triggering the 4.5s finding experience for ALL services
  const handleLockPrice = (quoteId: string) => {
    if (isFinding) return; // Guard against duplicate calls
    if (booking?.status === "request_submitted") {
      alert("Technician has not accepted the request yet. Please wait for the technician to review and accept, or click 'Simulate Technician Accept' above to proceed.");
      return;
    }
    const targetQuote = booking?.quotations.find((q) => q.id === quoteId) || activeQuote;
    const targetPrice = targetQuote?.currentPrice ?? bm.benchmark;
    const targetTech = targetQuote?.technicianName || "Verified Specialist";
    const targetEta = targetQuote?.eta || "18 min";

    // Call API in parallel
    api.escrow.lockPrice(booking.id, quoteId).catch(() => {});

    showFindingOverlay({
      technicianName: targetTech,
      price: targetPrice,
      eta: targetEta,
      onComplete: () => {
        // 1. Accept quotation and bind escrow
        acceptQuote(booking.id, quoteId);

        // 2. Add confirmation chat message in conversation
        sendChatMessage(
          booking.id,
          "technician",
          `Namaste! Booking confirmed at ₹${targetPrice}. ${targetTech} is on the way (ETA ${targetEta}).`,
        );

        // 3. Navigate seamlessly to Live Tracking screen
        setActiveScreen("tracking");
      },
    });
  };

  const isTechnicianTyping = typingMap[booking?.id] === "technician";

  return (
    <div className="flow-page page-pad">
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
          <span className="section-kicker">STEP 2 OF 8 · QUOTATIONS & NEGOTIATION</span>
          <h1>Compare Verified Offers & Agree on Fair Price</h1>
          <p>
            Technicians reviewed your issue photos and submitted itemized quotes. Chat and lock
            price before work begins.
          </p>
        </div>
      </div>

      {/* Citizen Flow State: Awaiting Technician Acceptance vs Accepted */}
      {booking?.status === "request_submitted" ? (
        <section className="card p-5 mb-6 border-2 border-amber-500/40 bg-amber-50/70 rounded-xl shadow-sm">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-start gap-3.5 max-w-2xl">
              <span className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-lg animate-pulse shrink-0 mt-0.5">
                <Icon name="bell" size={20} />
              </span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded bg-amber-200 text-amber-900 tracking-wider">
                    Awaiting Technician Acceptance
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Job #{booking.id}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 m-0">
                  Request Broadcasted · Technician Notified
                </h3>
                <p className="text-sm text-slate-700 mt-1 mb-2">
                  We have dispatched your request to <b>Ramesh Patil</b> (+ verified specialists in {booking.area || "Koregaon Park"}). As soon as the technician accepts, price negotiation and lock price will be enabled.
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-600 bg-white/90 p-2.5 rounded-lg border border-amber-200">
                  <Icon name="info" size={15} className="text-amber-600 shrink-0" />
                  <span>
                    <b>Role Switcher Tip:</b> Switch to <b>Technician</b> role in the top Prototype Switcher to view this alert and click <b>"Accept Request"</b>, or simulate instant acceptance right here:
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Button
                kind="primary"
                icon="check"
                onClick={() => {
                  acceptTechnicianRequest(booking.id);
                }}
              >
                Simulate Technician Accept
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <section className="card p-4 mb-6 border border-emerald-500/30 bg-emerald-50/60 rounded-xl flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <Icon name="check" size={18} />
            </span>
            <div>
              <span className="text-xs font-bold uppercase text-emerald-800">
                Technician Accepted · Proceed to Price Lock
              </span>
              <h3 className="text-sm font-bold text-slate-900 m-0">
                {booking.technicianName || "Ramesh Patil"} accepted your booking
              </h3>
              <p className="text-xs text-slate-600 m-0">
                Quoted: ₹{booking.lockedPrice} · Chat active · Funds remain protected in Escrow until you release them.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            Quote Active · Ready to Lock
          </span>
        </section>
      )}

      <div className="offers-and-negotiate-layout">
        {/* Left Column: Quotes List & In-App Chat */}
        <div className="quotes-column">
          <div className="quotes-toolbar">
            <span>
              <Icon name="shield" size={15} /> All technicians are Government ID & Skill Verified
            </span>
            <span className="local-price-guide-pill">
              Local market range: <b>₹{bm.min} – ₹{bm.max}</b>
            </span>
          </div>

          <div className="quotes-cards-list">
            {booking?.quotations.map((quote) => (
              <article
                key={quote.id}
                className={`offer-card card ${selectedQuoteId === quote.id ? "selected-quote featured" : ""}`}
                onClick={() => setSelectedQuoteId(quote.id)}
              >
                {quote.label && (
                  <span className={`best-match ${quote.tagColor || "green"}`}>
                    {quote.label.toUpperCase()}
                  </span>
                )}

                <div className="tech-main">
                  <div className="tech-photo">
                    <img src={quote.technicianPhoto} alt={quote.technicianName} />
                  </div>
                  <div className="tech-info">
                    <div className="name-line">
                      <h2>{quote.technicianName}</h2>
                      <span className="verified">
                        <Icon name="check" size={11} /> Verified Master
                      </span>
                    </div>

                    <div className="rating">
                      <Icon name="star" size={14} className="star-icon" />
                      <b>{quote.technicianRating}</b>
                      <span>({quote.technicianJobs} jobs)</span>
                      <span className="bullet">·</span>
                      <span>{quote.distanceKm} km away</span>
                      <span className="bullet">·</span>
                      <span>ETA {quote.eta}</span>
                    </div>

                    <p className="quote-scope-note">"{quote.scopeNote}"</p>

                    <div className="warranty-tag">
                      <Icon name="shield" size={12} /> {quote.warrantyDays}-day HomeCare Warranty
                      included
                    </div>
                  </div>

                  <div className="quote-pricing">
                    <span className="price-status-badge">
                      {quote.status === "counter_offered" ? "Counter-offer" : "Fixed Quote"}
                    </span>
                    <strong>₹{quote.currentPrice}</strong>
                    <small>All-inclusive</small>
                  </div>
                </div>

                <div className="offer-actions">
                  <button
                    type="button"
                    className="view-passport-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTechId(quote.technicianId);
                    }}
                  >
                    View Skill Passport
                  </button>
                  <Button
                    kind={selectedQuoteId === quote.id ? "primary" : "secondary"}
                    size="sm"
                    disabled={isFinding}
                    onClick={() => handleLockPrice(quote.id)}
                  >
                    {isFinding && selectedQuoteId === quote.id
                      ? "Securing..."
                      : booking?.status === "request_submitted"
                        ? `Awaiting Tech Acceptance (₹${quote.currentPrice})`
                        : `Accept & Lock ₹${quote.currentPrice}`}
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {/* In-App Direct Chat with Technician */}
          <section className="chat-card card mt-6">
            <div className="chat-head">
              <img src={activeQuote?.technicianPhoto} alt={activeQuote?.technicianName} />
              <div>
                <b>Chat with {activeQuote?.technicianName}</b>
                <small className="online-text">
                  <span className="online-dot" /> Online now · ITI Certified Pro · Job #
                  {booking?.id}
                </small>
              </div>
              <a href="tel:+919823045671" className="call-btn-circle" title="Call technician">
                <Icon name="phone" size={16} />
              </a>
            </div>

            {/* Quick Discussion Prompt Chips */}
            <div className="chat-quick-suggestions">
              <button
                type="button"
                className="suggestion-chip"
                onClick={() =>
                  handleSendMessage(undefined, "What is your estimated arrival time tomorrow?")
                }
              >
                Estimated arrival?
              </button>
              <button
                type="button"
                className="suggestion-chip"
                onClick={() =>
                  handleSendMessage(
                    undefined,
                    "Do I need to arrange replacement washers beforehand?",
                  )
                }
              >
                Should I buy parts?
              </button>
              <button
                type="button"
                className="suggestion-chip"
                onClick={() =>
                  handleSendMessage(undefined, "Society parking is available near Gate 2.")
                }
              >
                Parking info
              </button>
            </div>

            <div className="messages-stream">
              <div className="day-label">TODAY · DIRECT SECURE CONVERSATION</div>
              {booking?.chatMessages.map((m) => {
                const isMine = m.sender === "citizen";
                return (
                  <div
                    key={m.id}
                    className={`bubble ${isMine ? "mine" : m.sender === "system" ? "system-bubble" : "theirs"}`}
                  >
                    <span className="sender-name-label">
                      {m.senderName ||
                        (isMine ? "You (Asha)" : activeQuote?.technicianName || "Ramesh Patil")}
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

              {/* Real-time Typing Indicator */}
              {isTechnicianTyping && (
                <div className="typing-indicator-row theirs">
                  <span className="sender-name-label">
                    {activeQuote?.technicianName || "Ramesh"}
                  </span>
                  <div className="typing-bubble">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-bar" onSubmit={(e) => handleSendMessage(e)}>
              <input
                type="text"
                value={newChatText}
                onChange={handleChatInputChange}
                placeholder={`Message ${activeQuote?.technicianName || "technician"}...`}
              />
              <button type="submit" className="chat-send-btn" disabled={!newChatText.trim()}>
                <Icon name="arrow" size={18} />
              </button>
            </form>
          </section>
        </div>

        {/* Right Column: Counter-Offer Slider & Price Lock Widget */}
        <aside className="counter-column">
          <div className="counter card">
            <span className="summary-label">FAIR CIVIC NEGOTIATION</span>
            <h2>Make a Counter-Offer</h2>
            <p className="counter-intro">
              Propose a reasonable price within the local civic rate benchmark.
            </p>

            <div className="counter-price-display">
              <span className="currency">₹</span>
              <span className="amount">{sliderPrice}</span>
            </div>

            <input
              type="range"
              min={bm.min}
              max={bm.max}
              step="10"
              value={sliderPrice}
              onChange={(e) => setSliderPrice(Number(e.target.value))}
              className="range-slider"
              aria-label="Counter offer price slider"
            />

            <div className="range-labels">
              <span>₹{bm.min} (Discount)</span>
              <span>Fair Benchmark (₹{bm.benchmark})</span>
              <span>₹{bm.max} (Cap)</span>
            </div>

            <div className="fair-box">
              <Icon name="check" size={18} />
              <div>
                <b>Fair civic rate recommendation</b>
                <small>
                  ₹{sliderPrice} aligns with {bm.count} similar {bm.name} in Koregaon Park.
                </small>
              </div>
            </div>

            <Button kind="secondary" icon="chat" className="w-full" onClick={handleSendCounter}>
              Send ₹{sliderPrice} Counter-Offer
            </Button>

            <div className={`accepted-card mt-6 ${isAgreedPulse ? "pulse-highlight" : ""}`}>
              <div className="check-orb">
                <Icon name="check" size={18} />
              </div>
              <div>
                <small>CURRENT AGREED AMOUNT</small>
                <strong>₹{activeQuote?.currentPrice ?? 199}</strong>
              </div>
            </div>

            <Button
              kind="primary"
              icon="lock"
              className="w-full mt-3"
              disabled={isFinding}
              onClick={() => handleLockPrice(activeQuote?.id || "q-1")}
            >
              {isFinding
                ? `Securing ₹${activeQuote?.currentPrice ?? 199}...`
                : booking?.status === "request_submitted"
                  ? `Awaiting Tech Acceptance (₹${activeQuote?.currentPrice ?? 199})`
                  : `Lock Price ₹${activeQuote?.currentPrice ?? 199}`}
            </Button>

            <small className="protected-notice mt-3">
              <Icon name="shield" size={14} /> HomeCare Escrow Protection: Funds released only after
              work is verified.
            </small>
          </div>
        </aside>
      </div>

      {/* Finding Technician Full-Screen Loading Experience Modal */}
      <FindingTechnicianModal
        isOpen={isFinding}
        technicianName={findingDetails.technicianName}
        price={findingDetails.price}
        eta={findingDetails.eta}
        seniorMode={seniorMode}
        onClose={() => setIsFinding(false)}
        onComplete={findingDetails.onComplete}
      />
    </div>
  );
}
