import { useState, useEffect, useRef } from "react";
import { Icon } from "../common/Icon";

export interface FindingTechnicianOptions {
  technicianName?: string;
  price?: number;
  eta?: string;
  onComplete?: () => void;
}

export interface FindingTechnicianModalProps {
  isOpen: boolean;
  technicianName?: string;
  price?: number;
  eta?: string;
  onClose?: () => void;
  onComplete?: () => void;
  seniorMode?: boolean;
}

export function FindingTechnicianModal({
  isOpen,
  technicianName = "Ramesh Patil",
  price = 199,
  eta = "18 min",
  onClose,
  onComplete,
  seniorMode = false,
}: FindingTechnicianModalProps) {
  const [statusIndex, setStatusIndex] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [statusFade, setStatusFade] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<any[]>([]);

  // Check prefers-reduced-motion media query
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // Status messages array (cycles every 1.2s)
  const statusMessages = [
    `Securing ₹${price} in escrow...`,
    `Verifying ${technicianName}'s Skill Passport...`,
    "Confirming 7-day warranty...",
    "Technician is on the way!",
  ];

  // Lifecycle when overlay opens
  useEffect(() => {
    if (!isOpen) {
      // Clear timers and reset
      timerRef.current.forEach(clearTimeout);
      timerRef.current = [];
      setStatusIndex(0);
      setIsSuccess(false);
      setIsMuted(true);
      return;
    }

    // Play video safely
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay was prevented or postponed:", err);
      });
    }

    // Status rotation every 1.2s with fade transition
    const rotateInterval = setInterval(() => {
      setStatusFade(false);
      const fadeTimeout = setTimeout(() => {
        setStatusIndex((prev) => (prev + 1) % statusMessages.length);
        setStatusFade(true);
      }, 180);
      timerRef.current.push(fadeTimeout);
    }, 1200);

    // After 4.5 seconds -> Switch to success state
    const successTimer = setTimeout(() => {
      clearInterval(rotateInterval);
      setIsSuccess(true);

      // Auto-complete after additional 1.5 seconds in success state
      const completeTimer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
        if (onClose) {
          onClose();
        }
      }, 1500);

      timerRef.current.push(completeTimer);
    }, 4500);

    timerRef.current.push(rotateInterval);
    timerRef.current.push(successTimer);

    // Guard against escape key press closing abruptly during transaction
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      timerRef.current.forEach(clearTimeout);
      clearInterval(rotateInterval);
    };
  }, [isOpen, statusMessages.length, onComplete, onClose]);

  // Audio mute/unmute toggle
  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  if (!isOpen) {
    // Hidden video tag to guarantee instant preload before button is clicked
    return (
      <video
        src="/assets/video/finding-technician.mp4"
        preload="auto"
        className="hidden"
        aria-hidden="true"
        muted
        playsInline
      />
    );
  }

  return (
    <div
      className="finding-overlay-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Finding technician loading screen"
    >
      <div className={`finding-modal-card ${seniorMode ? "senior-active" : ""}`}>
        {/* Speaker Unmute/Mute Toggle in Top Corner */}
        {!isSuccess && !prefersReducedMotion && (
          <button
            type="button"
            className="finding-speaker-toggle"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
            title={isMuted ? "Unmute sound" : "Mute sound"}
          >
            <Icon name="volume" size={16} />
            {isMuted && <span className="speaker-mute-slash" />}
          </button>
        )}

        {/* Video / Checkmark Area */}
        <div className="finding-media-container">
          {!isSuccess ? (
            prefersReducedMotion ? (
              /* Reduced motion fallback: Clean modern spinner */
              <div className="finding-spinner-fallback" aria-label="Loading indicator">
                <div className="finding-ring-spinner" />
                <Icon name="shield" size={32} className="spinner-center-icon" />
              </div>
            ) : (
              /* High-Quality Video Container */
              <div className="finding-video-frame">
                <video
                  ref={videoRef}
                  src="/assets/video/finding-technician.mp4"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  preload="auto"
                  className="finding-video-player"
                />
              </div>
            )
          ) : (
            /* Animated Green Checkmark on Success */
            <div className="finding-success-icon-wrap" aria-label="Success checkmark">
              <svg className="finding-checkmark-svg" viewBox="0 0 52 52" aria-hidden="true">
                <circle className="finding-checkmark-circle" cx="26" cy="26" r="23" fill="none" />
                <path
                  className="finding-checkmark-check"
                  fill="none"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Text Area */}
        <div className="finding-text-body">
          {!isSuccess ? (
            <>
              <h2 className="finding-title">Finding your technician...</h2>

              {/* Status rotation with aria-live */}
              <div
                className={`finding-status-container ${statusFade ? "fade-in" : "fade-out"}`}
                aria-live="polite"
                aria-atomic="true"
              >
                <p className="finding-status-text">{statusMessages[statusIndex]}</p>
              </div>

              {/* Indeterminate Brand Purple Progress Bar */}
              <div className="finding-progress-track">
                <div className="finding-progress-bar" />
              </div>
            </>
          ) : (
            <div className="finding-success-text-group animate-pop-in">
              <h2 className="finding-title success">Price Locked at ₹{price} ✓</h2>
              <p className="finding-success-sub">
                <b>{technicianName}</b> is arriving in <b>{eta}</b>
              </p>
              <div className="finding-escrow-pill">
                <Icon name="shield" size={14} />
                <span>₹{price} protected in HomeCare Escrow</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
