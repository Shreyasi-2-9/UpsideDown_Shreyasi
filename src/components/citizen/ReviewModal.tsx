import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";

export function ReviewModal() {
  const { bookings, activeBookingId, submitReview, setActiveScreen } = useApp();
  const booking = bookings.find((b) => b.id === activeBookingId) || bookings[0];

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState(
    "Ramesh was extremely prompt, diagnosed the leaking collar immediately, and fixed it within 40 minutes. Cleaned up all water residue before leaving.",
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Punctual",
    "Cleaned work area",
    "Expert diagnosis",
  ]);
  const [submitted, setSubmitted] = useState(false);

  const availableTags = [
    "Punctual arrival",
    "Cleaned work area",
    "Expert diagnosis",
    "Polite & respectful",
    "Fair transparent pricing",
    "High quality materials",
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = () => {
    const fullComment = `${selectedTags.join(" · ")}. ${comment}`;
    submitReview(booking.id, rating, fullComment, booking.afterWorkPhoto);
    setSubmitted(true);
  };

  return (
    <div className="review-page page-pad">
      {submitted ? (
        <div className="thank-you card">
          <span className="thank-you-orb">
            <Icon name="check" size={36} />
          </span>
          <h1>Thank you, Asha!</h1>
          <p>
            Your honest review has been added to <b>Ramesh Patil's Digital Skill Passport</b> and
            helps your Koregaon Park neighbours hire trusted experts.
          </p>
          <Button kind="primary" onClick={() => setActiveScreen("home")}>
            Back to Home Dashboard
          </Button>
        </div>
      ) : (
        <div className="review-card card">
          <span className="section-kicker">STEP 8 OF 8 · COMMUNITY TRUST</span>
          <h1>How was Ramesh's work?</h1>
          <p>Your review directly shapes technician earnings and civic reputation in Pune.</p>

          <img
            src={
              booking.technicianPhoto ||
              "https://images.unsplash.com/photo-1659353587367-61eb5b8c6ef7?crop=faces&fit=crop&w=320&h=320&q=85"
            }
            alt={booking.technicianName}
            className="review-tech-photo"
          />
          <b>{booking.technicianName}</b>
          <small className="tech-trade-label">Plumbing Specialist · Job #{booking.id}</small>

          {/* Interactive Stars */}
          <div className="stars-row" aria-label="Rating stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${rating >= star ? "active" : ""}`}
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} stars`}
              >
                <Icon name="star" size={36} />
              </button>
            ))}
          </div>

          <span className="rating-verbal-feedback">
            {rating === 5
              ? "★★★★★ Outstanding Quality & Service"
              : rating === 4
                ? "★★★★ Very Good"
                : rating === 3
                  ? "★★★ Satisfactory"
                  : "Needs Improvement"}
          </span>

          {/* Quality Tags */}
          <div className="review-tags-picker">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`review-tag-chip ${selectedTags.includes(tag) ? "selected" : ""}`}
                onClick={() => toggleTag(tag)}
              >
                {selectedTags.includes(tag) && <Icon name="check" size={12} />}
                <span>{tag}</span>
              </button>
            ))}
          </div>

          {/* Text feedback */}
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What went well? Any advice for other homeowners?"
            className="review-textarea"
          />

          <Button
            kind="primary"
            className="w-full mt-4"
            onClick={handleSubmit}
            disabled={rating === 0}
          >
            Submit Review & Rating
          </Button>

          <button type="button" className="skip-review-btn" onClick={() => setActiveScreen("home")}>
            Skip for now
          </button>
        </div>
      )}
    </div>
  );
}
