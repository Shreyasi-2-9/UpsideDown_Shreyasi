import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";

export function GroupBookingView() {
  const { groupBookings, joinGroupBooking, setActiveScreen, currentUser } = useApp();
  const [selectedGroup, setSelectedGroup] = useState(groupBookings[0]);
  const [isJoined, setIsJoined] = useState(
    selectedGroup?.joinedHouseholds.some((h) => h.name === currentUser.name),
  );

  const handleJoin = (groupId: string) => {
    joinGroupBooking(groupId);
    setIsJoined(true);
    alert(
      "You have successfully joined the neighbourhood group! When the deadline closes on 24 Jun, bulk rate discount applies automatically.",
    );
  };

  return (
    <div className="flow-page page-pad">
      <div className="flow-title">
        <button
          type="button"
          className="back-btn"
          onClick={() => setActiveScreen("home")}
          aria-label="Back"
        >
          <Icon name="chevron" size={18} />
        </button>
        <div>
          <span className="section-kicker">COMMUNITY CIVIC SAVINGS</span>
          <h1>Neighbourhood Group Bookings</h1>
          <p>
            Pool recurring home services with your apartment society or lane. More homes booking
            together unlocks up to <b>61% group discount</b>.
          </p>
        </div>
      </div>

      <div className="group-booking-layout">
        {/* Left Column: Active Group Campaigns */}
        <div className="groups-list-column">
          {groupBookings.map((grp) => {
            const hasJoined = grp.joinedHouseholds.some((h) => h.name === currentUser.name);
            const progressPct = Math.round(
              (grp.joinedHouseholds.length / grp.targetHouseholds) * 100,
            );

            return (
              <article
                key={grp.id}
                className={`group-campaign-card card ${selectedGroup.id === grp.id ? "selected-group" : ""}`}
                onClick={() => {
                  setSelectedGroup(grp);
                  setIsJoined(hasJoined);
                }}
              >
                <div className="group-card-top">
                  <div>
                    <span className="neighbourhood-pill">
                      <Icon name="pin" size={13} /> {grp.neighbourhood}
                    </span>
                    <h3>{grp.serviceName}</h3>
                  </div>

                  <div className="group-discount-badge">
                    <span>SAVE</span>
                    <strong>{grp.discountPercentage}%</strong>
                  </div>
                </div>

                <div className="group-progress-wrap">
                  <div className="progress-labels">
                    <span>
                      <b>{grp.joinedHouseholds.length}</b> of {grp.targetHouseholds} households
                      joined
                    </span>
                    <span className="days-left">
                      <Icon name="clock" size={13} /> {grp.expiresInDays} days left
                    </span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>

                <div className="group-price-row">
                  <div>
                    <span className="regular-price-crossed">Regular: ₹{grp.basePrice}</span>
                    <strong className="group-price">Group Price: ₹{grp.groupPrice}</strong>
                  </div>

                  {hasJoined ? (
                    <span className="joined-badge">
                      <Icon name="check" size={13} /> Joined
                    </span>
                  ) : (
                    <Button
                      kind="peach"
                      size="sm"
                      onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
                        e?.stopPropagation();
                        handleJoin(grp.id);
                      }}
                    >
                      Join Group
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Right Column: Group Campaign Inspector & Participating Households */}
        <aside className="group-detail-column">
          <div className="group-detail-card card">
            <span className="summary-label">CAMPAIGN DETAILS</span>
            <h2>{selectedGroup.serviceName}</h2>
            <p className="society-name">{selectedGroup.neighbourhood}</p>

            {/* Savings Ladder */}
            <div className="savings-ladder">
              <h4>Neighbourhood Tier Ladder</h4>
              <div className="ladder-step reached">
                <span className="step-circle">✓</span>
                <span>Tier 1: 5 Households</span>
                <b>20% OFF</b>
              </div>
              <div className="ladder-step reached">
                <span className="step-circle">✓</span>
                <span>Tier 2: 10 Households</span>
                <b>40% OFF</b>
              </div>
              <div className="ladder-step target">
                <span className="step-circle">★</span>
                <span>Tier 3: 20 Households (Target)</span>
                <b>61% OFF (₹{selectedGroup.groupPrice})</b>
              </div>
            </div>

            {/* Participating Households */}
            <div className="participating-section">
              <h4>Participating Neighbours ({selectedGroup.joinedHouseholds.length})</h4>
              <div className="households-list">
                {selectedGroup.joinedHouseholds.map((h, i) => (
                  <div key={i} className="household-row">
                    <span className="house-icon">
                      <Icon name="home" size={14} />
                    </span>
                    <div className="house-info">
                      <b>{h.name}</b>
                      <small>{h.apt}</small>
                    </div>
                    <span className="join-time">{h.joinedAt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="group-actions-bottom">
              {isJoined ? (
                <div className="already-joined-box">
                  <Icon name="check" size={18} />
                  <span>You are enrolled in this neighbourhood group!</span>
                </div>
              ) : (
                <Button
                  kind="primary"
                  className="w-full"
                  onClick={() => handleJoin(selectedGroup.id)}
                >
                  Join Group Booking for ₹{selectedGroup.groupPrice}
                </Button>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
