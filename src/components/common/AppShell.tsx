import type { ReactNode } from "react";
import { useApp } from "../../context/AppContext";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { DemoRoleBar } from "./DemoRoleBar";
import { NotificationDrawer } from "./NotificationDrawer";
import { SosModal } from "./SosModal";
import { AuthModal } from "../auth/AuthModal";
import { ServiceRequestModal } from "../citizen/ServiceRequestModal";
import { TechnicianProfileModal } from "../citizen/TechnicianProfileModal";
import { ProjectBackgroundAnimation } from "./ProjectBackgroundAnimation";
import { Icon } from "./Icon";
import type { IconName } from "../../types";

export function AppShell({ children }: { children: ReactNode }) {
  const { role, activeScreen, setActiveScreen, t } = useApp();

  const citizenNavItems: { screen: string; label: string; icon: IconName }[] = [
    { screen: "home", label: t.navHome, icon: "home" },
    { screen: "request", label: t.navServices, icon: "grid" },
    { screen: "bookings", label: t.navBookings, icon: "calendar" },
    { screen: "group_booking", label: t.navGroupBooking, icon: "users" },
    { screen: "tracking", label: "Tracking", icon: "pin" },
    { screen: "evidence", label: "Evidence", icon: "camera" },
    { screen: "profile", label: t.navProfile, icon: "user" },
  ];

  const techNavItems: { screen: string; label: string; icon: IconName }[] = [
    { screen: "tech_dashboard", label: t.navOverview, icon: "grid" },
    { screen: "tech_requests", label: "Requests", icon: "pin" },
    { screen: "tech_job", label: "Active Job", icon: "briefcase" },
    { screen: "tech_earnings", label: t.navEarnings, icon: "wallet" },
    { screen: "tech_passport", label: t.navPassport, icon: "shield" },
    { screen: "tech_profile", label: t.navSettings, icon: "settings" },
  ];

  const adminNavItems: { screen: string; label: string; icon: IconName }[] = [
    { screen: "admin_dashboard", label: t.navOverview, icon: "chart" },
    { screen: "admin_users", label: t.navUsers, icon: "user" },
    { screen: "admin_verification", label: t.navVerification, icon: "shield" },
    { screen: "admin_bookings", label: "All Bookings", icon: "briefcase" },
    { screen: "admin_sos", label: t.navSos, icon: "sos" },
    { screen: "admin_revenue", label: "Revenue", icon: "wallet" },
    { screen: "admin_settings", label: t.navSettings, icon: "settings" },
  ];

  const navItems =
    role === "citizen" ? citizenNavItems : role === "technician" ? techNavItems : adminNavItems;

  return (
    <div className={`app-shell role-${role}`}>
      <ProjectBackgroundAnimation />
      <TopBar />

      {/* Desktop Vertical Sidebar */}
      <aside className={`sidebar sidebar-${role}`} aria-label="Sidebar Navigation">
        {navItems.map((item) => (
          <button
            key={item.screen}
            type="button"
            className={activeScreen === item.screen ? "active" : ""}
            onClick={() => setActiveScreen(item.screen)}
            title={item.label}
          >
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </aside>

      {/* Main Screen Content */}
      <main className="app-content">{children}</main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Floating Demo Persona Switcher */}
      <DemoRoleBar />

      {/* Global Overlays & Modals */}
      <NotificationDrawer />
      <SosModal />
      <AuthModal />
      <ServiceRequestModal />
      <TechnicianProfileModal />
    </div>
  );
}
