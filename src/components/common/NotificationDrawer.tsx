import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "./Icon";
import { Button } from "./Button";

export function NotificationDrawer() {
  const {
    notifications,
    isNotificationOpen,
    setIsNotificationOpen,
    markNotificationsAsRead,
    setActiveScreen,
    setRole,
  } = useApp();

  const [filterType, setFilterType] = useState<"all" | "booking" | "payment" | "sos">("all");

  if (!isNotificationOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === "all") return true;
    if (filterType === "booking") return n.type === "booking" || n.type === "quotation";
    if (filterType === "payment") return n.type === "payment";
    if (filterType === "sos") return n.type === "sos" || n.type === "verification";
    return true;
  });

  const unreadTotal = notifications.filter((n) => !n.read).length;

  return (
    <div className="drawer-overlay" onClick={() => setIsNotificationOpen(false)}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <div className="header-icon-pill">
              <Icon name="bell" size={20} />
            </div>
            <div>
              <h2>Civic Notifications</h2>
              <p className="text-xs text-muted">
                Real-time alerts, escrow updates, and job milestones
              </p>
            </div>
            {unreadTotal > 0 && <span className="count-badge">{unreadTotal} New</span>}
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setIsNotificationOpen(false)}
            aria-label="Close notifications drawer"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Filter Tabs & Quick Action */}
        <div className="drawer-filter-row">
          <div className="drawer-tabs">
            {[
              { key: "all", label: "All" },
              { key: "booking", label: "Jobs" },
              { key: "payment", label: "Escrow" },
              { key: "sos", label: "Safety" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`drawer-tab-btn ${filterType === tab.key ? "active" : ""}`}
                onClick={() => setFilterType(tab.key as any)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {unreadTotal > 0 && (
            <button
              type="button"
              className="mark-all-read-btn"
              onClick={markNotificationsAsRead}
              title="Mark all notifications as read"
            >
              <Icon name="check" size={13} />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="notification-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-notifs">
              <div className="empty-notifs-icon">
                <Icon name="bell" size={32} />
              </div>
              <h4>No notifications in this filter</h4>
              <p>You are all caught up with your home services and safety alerts.</p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                className={`notif-card ${n.read ? "read" : "unread"}`}
                onClick={() => {
                  if (n.type === "booking") {
                    setActiveScreen("bookings");
                  } else if (n.type === "quotation") {
                    setActiveScreen("offers");
                  } else if (n.type === "payment") {
                    setActiveScreen("escrow");
                  } else if (n.type === "sos") {
                    setRole("admin");
                    setActiveScreen("admin_sos");
                  } else if (n.type === "verification") {
                    setRole("admin");
                    setActiveScreen("admin_verification");
                  }
                  setIsNotificationOpen(false);
                }}
              >
                <div className={`notif-icon-wrap type-${n.type}`}>
                  <Icon
                    name={
                      n.type === "payment"
                        ? "wallet"
                        : n.type === "quotation"
                          ? "chat"
                          : n.type === "sos"
                            ? "sos"
                            : n.type === "verification"
                              ? "shield"
                              : "briefcase"
                    }
                    size={18}
                  />
                </div>
                <div className="notif-body">
                  <div className="notif-top">
                    <h4>{n.title}</h4>
                    <span className="notif-time">{n.timestamp}</span>
                  </div>
                  <p className="notif-desc">{n.body}</p>
                  <span className="notif-action-hint">Click to inspect →</span>
                </div>
                {!n.read && <span className="unread-dot-badge" />}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="drawer-footer">
          <Button kind="secondary" size="sm" onClick={() => setIsNotificationOpen(false)}>
            Close Notifications
          </Button>
        </div>
      </div>
    </div>
  );
}
