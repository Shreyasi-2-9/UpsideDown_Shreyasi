import { useApp } from "../../context/AppContext";
import { Icon } from "./Icon";

export function BottomNav() {
  const { role, activeScreen, setActiveScreen, setIsSosOpen } = useApp();

  if (role === "admin") return null;

  return (
    <nav className="bottom-nav" aria-label="Mobile Bottom Navigation">
      {role === "citizen" ? (
        <>
          <button
            type="button"
            className={activeScreen === "home" ? "active" : ""}
            onClick={() => setActiveScreen("home")}
          >
            <Icon name="home" size={20} />
            <span>Home</span>
          </button>
          <button
            type="button"
            className={activeScreen === "request" || activeScreen === "offers" ? "active" : ""}
            onClick={() => setActiveScreen("request")}
          >
            <Icon name="grid" size={20} />
            <span>Services</span>
          </button>
          <button
            type="button"
            className={activeScreen === "bookings" ? "active" : ""}
            onClick={() => setActiveScreen("bookings")}
          >
            <Icon name="calendar" size={20} />
            <span>Bookings</span>
          </button>
          <button
            type="button"
            className={activeScreen === "group_booking" ? "active" : ""}
            onClick={() => setActiveScreen("group_booking")}
          >
            <Icon name="users" size={20} />
            <span>Groups</span>
          </button>
          <button
            type="button"
            className={activeScreen === "profile" ? "active" : ""}
            onClick={() => setActiveScreen("profile")}
          >
            <Icon name="user" size={20} />
            <span>Profile</span>
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            className={activeScreen === "tech_dashboard" ? "active" : ""}
            onClick={() => setActiveScreen("tech_dashboard")}
          >
            <Icon name="home" size={20} />
            <span>Overview</span>
          </button>
          <button
            type="button"
            className={activeScreen === "tech_requests" ? "active" : ""}
            onClick={() => setActiveScreen("tech_requests")}
          >
            <Icon name="pin" size={20} />
            <span>Requests</span>
          </button>
          <button
            type="button"
            className={activeScreen === "tech_job" ? "active" : ""}
            onClick={() => setActiveScreen("tech_job")}
          >
            <Icon name="briefcase" size={20} />
            <span>Job</span>
          </button>
          <button
            type="button"
            className={activeScreen === "tech_earnings" ? "active" : ""}
            onClick={() => setActiveScreen("tech_earnings")}
          >
            <Icon name="wallet" size={20} />
            <span>Earnings</span>
          </button>
          <button
            type="button"
            className={activeScreen === "tech_passport" ? "active" : ""}
            onClick={() => setActiveScreen("tech_passport")}
          >
            <Icon name="shield" size={20} />
            <span>Passport</span>
          </button>
        </>
      )}
    </nav>
  );
}
