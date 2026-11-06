import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";

export function TechnicianProfileModal() {
  const {
    selectedTechId,
    setSelectedTechId,
    technicians,
    setIsServiceRequestOpen,
    setSelectedCategoryId,
  } = useApp();

  if (!selectedTechId) return null;

  const tech = technicians.find((t) => t.id === selectedTechId) || technicians[0];

  const handleClose = () => setSelectedTechId(null);

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card tech-profile-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={handleClose}>
          <Icon name="close" size={18} />
        </button>

        {/* Profile Hero Header */}
        <div className="tech-profile-header">
          <div className="tech-profile-photo-wrap">
            <img src={tech.photo} alt={tech.name} />
            <span className="online-badge" />
          </div>

          <div className="tech-profile-main-info">
            <div className="name-and-status">
              <h2>{tech.name}</h2>
              <span className="verified-passport-tag">
                <Icon name="shield" size={14} /> Digital Skill Passport Verified
              </span>
            </div>

            <p className="trade-title">
              Master {tech.primaryService.charAt(0).toUpperCase() + tech.primaryService.slice(1)}{" "}
              Specialist · {tech.experienceYears} Years Experience
            </p>

            <div className="stat-pills-row">
              <div className="stat-pill">
                <Icon name="star" size={15} className="star-icon" />
                <b>{tech.rating}</b>
                <small>/ 5.0 ({tech.totalJobs} jobs)</small>
              </div>
              <div className="stat-pill">
                <Icon name="pin" size={15} />
                <span>{tech.serviceArea}</span>
              </div>
              <div className="stat-pill">
                <Icon name="clock" size={15} />
                <span>ETA ~{tech.etaMinutes} mins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="tech-profile-scroll-body">
          {/* About Section */}
          <section className="profile-section">
            <h4>About the Expert</h4>
            <p className="about-text">{tech.about}</p>
            <div className="languages-spoken">
              <span>Languages spoken:</span>
              {tech.languages.map((lang) => (
                <span key={lang} className="lang-tag">
                  {lang}
                </span>
              ))}
            </div>
          </section>

          {/* Digital Skill Passport */}
          <section className="profile-section passport-section">
            <div className="section-title-between">
              <h4>Digital Skill Passport & Verifications</h4>
              <span className="passport-qr-icon">
                <Icon name="qr" size={18} /> Verified by Govt. Registry
              </span>
            </div>

            <div className="certificates-grid">
              {tech.certificates.map((cert) => (
                <div key={cert.title} className="cert-card">
                  <div className="cert-icon">
                    <Icon name="shield" size={20} />
                  </div>
                  <div>
                    <h5>{cert.title}</h5>
                    <p>
                      {cert.issuer} · {cert.year}
                    </p>
                    <span className="cert-check">
                      <Icon name="check" size={11} /> Cryptographically Authenticated
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills Breakdown */}
          <section className="profile-section">
            <h4>Verified Competencies</h4>
            <div className="skills-chips-wrap">
              {tech.skills.map((skill) => (
                <span key={skill} className="skill-chip">
                  <Icon name="check" size={13} /> {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Work Portfolio: Before and After */}
          {tech.portfolio.length > 0 && (
            <section className="profile-section">
              <h4>Work Portfolio · Before & After</h4>
              <div className="portfolio-gallery">
                {tech.portfolio.map((item, idx) => (
                  <div key={idx} className="portfolio-item-card">
                    <h5>{item.title}</h5>
                    <div className="before-after-duo">
                      <div className="photo-box">
                        <img src={item.beforePhoto} alt="Before work" />
                        <span className="tag before">BEFORE</span>
                      </div>
                      <div className="photo-box">
                        <img src={item.afterPhoto} alt="After work" />
                        <span className="tag after">AFTER</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Customer Reviews */}
          <section className="profile-section">
            <div className="section-title-between">
              <h4>Customer Reviews ({tech.reviews.length})</h4>
              <span className="avg-rating">
                <Icon name="star" size={14} className="star-icon" /> {tech.rating} overall
              </span>
            </div>

            <div className="reviews-list">
              {tech.reviews.length === 0 ? (
                <p className="no-reviews">No reviews yet for this area.</p>
              ) : (
                tech.reviews.map((rev) => (
                  <div key={rev.id} className="review-card-item">
                    <div className="review-item-header">
                      <strong>{rev.citizenName}</strong>
                      <div className="review-stars">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Icon
                            key={s}
                            name="star"
                            size={13}
                            className={s <= rev.rating ? "star-active" : "star-dim"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="review-text">"{rev.comment}"</p>
                    <small className="review-date">
                      {rev.serviceName} · {rev.date}
                    </small>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Profile Footer Actions */}
        <div className="tech-profile-footer">
          <div>
            <small>Civic Base Rate</small>
            <strong>₹{tech.startingPrice}</strong>
          </div>
          <div className="footer-btns">
            <a href={`tel:${tech.phone}`} className="btn btn-secondary">
              <Icon name="phone" size={16} />
              <span>Call Expert</span>
            </a>
            <Button
              kind="primary"
              icon="arrow"
              onClick={() => {
                setSelectedCategoryId(tech.primaryService);
                handleClose();
                setIsServiceRequestOpen(true);
              }}
            >
              Book Service
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
