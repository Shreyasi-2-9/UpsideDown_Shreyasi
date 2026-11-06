import { useApp } from "../../context/AppContext";
import { Brand } from "../common/Brand";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";
import type { Role } from "../../types";

export function RoleSelect() {
  const { setRole, setActiveScreen } = useApp();

  const roles = [
    {
      title: "I need a service",
      body: "Book trusted experts for your home with protected escrow and live tracking.",
      icon: "home" as const,
      role: "citizen" as Role,
      screen: "home",
      label: "Citizen Experience",
      badgeClass: "violet",
    },
    {
      title: "I provide services",
      body: "Find nearby jobs, submit fair quotations, and build your verified Digital Skill Passport.",
      icon: "briefcase" as const,
      role: "technician" as Role,
      screen: "tech_dashboard",
      label: "Technician Pro",
      badgeClass: "peach",
    },
    {
      title: "Platform operations",
      body: "Monitor live jobs, review technician KYC, manage revenue, and respond to SOS emergencies.",
      icon: "chart" as const,
      role: "admin" as Role,
      screen: "admin_dashboard",
      label: "Civic Administrator",
      badgeClass: "ink",
    },
  ];

  const handleSelectRole = (r: Role, screen: string) => {
    setRole(r);
    setActiveScreen(screen);
  };

  return (
    <main className="role-page">
      <div className="simple-head">
        <Brand onClick={() => setActiveScreen("landing")} />
        <Button kind="ghost" onClick={() => setActiveScreen("landing")}>
          ← Back to Overview
        </Button>
      </div>

      <div className="role-wrap">
        <span className="section-kicker">WELCOME TO HOMECARE 360</span>
        <h1>How will you use HomeCare 360?</h1>
        <p>
          Select your persona to enter the platform. You can switch anytime using the prototype bar.
        </p>

        <div className="role-grid">
          {roles.map((item) => (
            <button
              type="button"
              className="role-card"
              key={item.label}
              onClick={() => handleSelectRole(item.role, item.screen)}
            >
              <span className={`role-label ${item.badgeClass}`}>{item.label.toUpperCase()}</span>
              <div className="role-icon">
                <Icon name={item.icon} size={34} />
              </div>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
              <span className="role-go">
                <Icon name="arrow" size={18} />
              </span>
            </button>
          ))}
        </div>

        <div className="prototype-note">
          <span>PROTOTYPE ENVIRONMENT</span> Multi-role state is synchronized in real-time across
          Citizen, Technician, and Admin views.
        </div>
      </div>
    </main>
  );
}
