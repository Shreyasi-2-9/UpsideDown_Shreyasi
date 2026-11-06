import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "./Icon";

export function DemoRoleBar() {
  const {
    role,
    setRole,
    activeScreen,
    setActiveScreen,
    seniorMode,
    setSeniorMode,
    resetToDefaults,
    bookings,
  } = useApp();

  const [expanded, setExpanded] = useState(false);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);

  const pendingNewRequests = bookings.filter((b) => b.status === "request_submitted");

  useEffect(() => {
    // Ping backend health check
    const checkApi = async () => {
      try {
        const res = await fetch("http://localhost:8000/", { method: "GET" });
        if (res.ok) {
          setBackendConnected(true);
        } else {
          setBackendConnected(false);
        }
      } catch {
        setBackendConnected(false);
      }
    };
    checkApi();
    const interval = setInterval(checkApi, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="demo-floating-bar" aria-label="Role & Prototype Switcher">
      <div className="demo-bar-inner">
        <div className="demo-brand-tag">
          <span className="live-dot" />
          <span>PROTOTYPE SWITCHER</span>
        </div>

        <div
          className={`backend-status-chip ${backendConnected ? "connected" : "offline"}`}
          title={
            backendConnected
              ? "FastAPI Civic Backend connected at http://localhost:8000/api/v1 (SQLite / PostgreSQL active)"
              : "Backend offline: running on local state with automated fallback. Start server with: python -m uvicorn app.main:app"
          }
        >
          <span className="status-dot" />
          <span>{backendConnected ? "FastAPI Live" : "Demo Mode"}</span>
        </div>

        <div className="role-buttons-group">
          <button
            type="button"
            className={`role-tab ${role === "citizen" ? "active" : ""}`}
            onClick={() => setRole("citizen")}
          >
            <Icon name="user" size={15} />
            <span>Citizen</span>
          </button>
          <button
            type="button"
            className={`role-tab ${role === "technician" ? "active" : ""}`}
            onClick={() => setRole("technician")}
          >
            <Icon name="briefcase" size={15} />
            <span>Technician</span>
            {pendingNewRequests.length > 0 && (
              <span
                style={{
                  marginLeft: "4px",
                  padding: "1px 5px",
                  fontSize: "10px",
                  fontWeight: "bold",
                  borderRadius: "999px",
                  backgroundColor: "#ea580c",
                  color: "#ffffff",
                }}
                title={`${pendingNewRequests.length} new citizen request(s) waiting for acceptance`}
              >
                {pendingNewRequests.length}
              </span>
            )}
          </button>
          <button
            type="button"
            className={`role-tab ${role === "admin" ? "active" : ""}`}
            onClick={() => setRole("admin")}
          >
            <Icon name="chart" size={15} />
            <span>Admin</span>
          </button>
        </div>

        <button
          type="button"
          className={`senior-chip ${seniorMode ? "active" : ""}`}
          onClick={() => setSeniorMode(!seniorMode)}
          title="Toggle high-contrast senior citizen UI"
        >
          <Icon name="volume" size={14} />
          <span>Senior Mode</span>
        </button>

        <button
          type="button"
          className="demo-expand-toggle"
          onClick={() => setExpanded(!expanded)}
          title="Jump to specific workflow screen"
        >
          <span>Jump to Screen</span>
          <Icon name="chevron" size={14} className={expanded ? "rotate-180" : ""} />
        </button>

        <button
          type="button"
          className="reset-btn"
          onClick={() => {
            if (confirm("Reset prototype state to initial verified demo data?")) {
              resetToDefaults();
            }
          }}
          title="Reset data to defaults"
        >
          <Icon name="refresh" size={13} />
          <span>Reset</span>
        </button>
      </div>

      {expanded && (
        <div className="demo-quick-screens">
          <div className="screen-category">
            <span className="screen-cat-title">Public & Access</span>
            <div className="screen-links">
              <button onClick={() => setActiveScreen("landing")}>Landing Page</button>
              <button onClick={() => setActiveScreen("login")}>Login / Sign In</button>
              <button onClick={() => setActiveScreen("public_passport")}>Public QR Passport</button>
            </div>
          </div>

          <div className="screen-category">
            <span className="screen-cat-title">Citizen Flow</span>
            <div className="screen-links">
              <button onClick={() => setActiveScreen("home")}>Dashboard</button>
              <button onClick={() => setActiveScreen("request")}>Create Request</button>
              <button onClick={() => setActiveScreen("offers")}>Compare Offers</button>
              <button onClick={() => setActiveScreen("negotiate")}>Price Negotiation</button>
              <button onClick={() => setActiveScreen("escrow")}>Escrow Payment</button>
              <button onClick={() => setActiveScreen("tracking")}>Live Tracking</button>
              <button onClick={() => setActiveScreen("evidence")}>Evidence Vault</button>
              <button onClick={() => setActiveScreen("proof")}>Work Quality Audit</button>
              <button onClick={() => setActiveScreen("receipt")}>Digital Receipt</button>
              <button onClick={() => setActiveScreen("review")}>Review & Rating</button>
              <button onClick={() => setActiveScreen("bookings")}>Booking History</button>
              <button onClick={() => setActiveScreen("group_booking")}>Group Booking</button>
              <button onClick={() => setActiveScreen("profile")}>Citizen Profile</button>
            </div>
          </div>

          <div className="screen-category">
            <span className="screen-cat-title">Technician Flow</span>
            <div className="screen-links">
              <button
                onClick={() => {
                  setRole("technician");
                  setActiveScreen("tech_dashboard");
                }}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setRole("technician");
                  setActiveScreen("tech_requests");
                }}
              >
                Incoming Requests
              </button>
              <button
                onClick={() => {
                  setRole("technician");
                  setActiveScreen("tech_job");
                }}
              >
                Job Execution Workflow
              </button>
              <button
                onClick={() => {
                  setRole("technician");
                  setActiveScreen("tech_earnings");
                }}
              >
                Earnings & Payouts
              </button>
              <button
                onClick={() => {
                  setRole("technician");
                  setActiveScreen("tech_passport");
                }}
              >
                Skill Passport & QR
              </button>
              <button
                onClick={() => {
                  setRole("technician");
                  setActiveScreen("tech_onboarding");
                }}
              >
                Onboarding & KYC
              </button>
              <button
                onClick={() => {
                  setRole("technician");
                  setActiveScreen("tech_profile");
                }}
              >
                Technician Profile
              </button>
            </div>
          </div>

          <div className="screen-category">
            <span className="screen-cat-title">Admin Flow</span>
            <div className="screen-links">
              <button
                onClick={() => {
                  setRole("admin");
                  setActiveScreen("admin_dashboard");
                }}
              >
                KPI Overview
              </button>
              <button
                onClick={() => {
                  setRole("admin");
                  setActiveScreen("admin_users");
                }}
              >
                User Directory
              </button>
              <button
                onClick={() => {
                  setRole("admin");
                  setActiveScreen("admin_verification");
                }}
              >
                KYC & Verification
              </button>
              <button
                onClick={() => {
                  setRole("admin");
                  setActiveScreen("admin_bookings");
                }}
              >
                All Bookings
              </button>
              <button
                onClick={() => {
                  setRole("admin");
                  setActiveScreen("admin_sos");
                }}
              >
                SOS Operations Room
              </button>
              <button
                onClick={() => {
                  setRole("admin");
                  setActiveScreen("admin_revenue");
                }}
              >
                Platform Revenue
              </button>
              <button
                onClick={() => {
                  setRole("admin");
                  setActiveScreen("admin_settings");
                }}
              >
                Service Categories
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
