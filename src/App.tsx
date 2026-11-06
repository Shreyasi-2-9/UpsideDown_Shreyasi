import { useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { AppShell } from "./components/common/AppShell";
import { LandingPage } from "./components/landing/LandingPage";
import { RoleSelect } from "./components/landing/RoleSelect";
import { LoginPage } from "./components/auth/LoginPage";

// Citizen Screens
import { CitizenDashboard } from "./components/citizen/CitizenDashboard";
import { QuotationNegotiationView } from "./components/citizen/QuotationNegotiationView";
import { EscrowPaymentView } from "./components/citizen/EscrowPaymentView";
import { LiveTrackingView } from "./components/citizen/LiveTrackingView";
import { EvidenceVaultView } from "./components/citizen/EvidenceVaultView";
import { AiProofView } from "./components/citizen/AiProofView";
import { DigitalReceiptView } from "./components/citizen/DigitalReceiptView";
import { ReviewModal } from "./components/citizen/ReviewModal";
import { BookingsHistoryView } from "./components/citizen/BookingsHistoryView";
import { GroupBookingView } from "./components/citizen/GroupBookingView";
import { CitizenProfileView } from "./components/citizen/CitizenProfileView";

// Technician Screens
import { TechnicianDashboard } from "./components/technician/TechnicianDashboard";
import { TechnicianRequestsView } from "./components/technician/TechnicianRequestsView";
import { JobExecutionView } from "./components/technician/JobExecutionView";
import { TechnicianEarnings } from "./components/technician/TechnicianEarnings";
import { SkillPassportView } from "./components/technician/SkillPassportView";
import { PublicSkillPassportView } from "./components/technician/PublicSkillPassportView";
import { TechnicianProfileSettingsView } from "./components/technician/TechnicianProfileSettingsView";
import { TechnicianOnboardingModal } from "./components/technician/TechnicianOnboardingModal";

// Admin Screens
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AdminUsersView } from "./components/admin/AdminUsersView";
import { AdminVerificationView } from "./components/admin/AdminVerificationView";
import { AdminBookingsView } from "./components/admin/AdminBookingsView";
import { AdminSosView } from "./components/admin/AdminSosView";
import { AdminRevenueView } from "./components/admin/AdminRevenueView";
import { AdminSettingsView } from "./components/admin/AdminSettingsView";

function MainAppContent() {
  const { activeScreen, setActiveScreen } = useApp();

  useEffect(() => {
    // Check if user arrived via QR code scan or direct verification link
    if (typeof window !== "undefined") {
      const search = window.location.search;
      const hash = window.location.hash;
      if (search.includes("verify") || hash.includes("passport")) {
        setActiveScreen("public_passport");
      }
    }
  }, [setActiveScreen]);

  if (activeScreen === "landing") {
    return <LandingPage />;
  }

  if (activeScreen === "login") {
    return <LoginPage />;
  }

  if (activeScreen === "roles") {
    return <RoleSelect />;
  }

  if (activeScreen === "public_passport") {
    return <PublicSkillPassportView />;
  }

  return (
    <AppShell>
      {/* Citizen Views */}
      {activeScreen === "home" && <CitizenDashboard />}
      {activeScreen === "request" && <CitizenDashboard />}
      {activeScreen === "technician_detail" && <SkillPassportView />}
      {activeScreen === "offers" && <QuotationNegotiationView />}
      {activeScreen === "negotiate" && <QuotationNegotiationView />}
      {activeScreen === "escrow" && <EscrowPaymentView />}
      {activeScreen === "tracking" && <LiveTrackingView />}
      {activeScreen === "evidence" && <EvidenceVaultView />}
      {activeScreen === "proof" && <AiProofView />}
      {activeScreen === "receipt" && <DigitalReceiptView />}
      {activeScreen === "review" && <ReviewModal />}
      {activeScreen === "bookings" && <BookingsHistoryView />}
      {activeScreen === "group_booking" && <GroupBookingView />}
      {activeScreen === "profile" && <CitizenProfileView />}

      {/* Technician Views */}
      {activeScreen === "tech_dashboard" && <TechnicianDashboard />}
      {activeScreen === "tech_requests" && <TechnicianRequestsView />}
      {activeScreen === "tech_job" && <JobExecutionView />}
      {activeScreen === "tech_earnings" && <TechnicianEarnings />}
      {activeScreen === "tech_passport" && <SkillPassportView />}
      {activeScreen === "tech_profile" && <TechnicianProfileSettingsView />}
      {activeScreen === "tech_onboarding" && (
        <TechnicianOnboardingModal
          isOpen={true}
          onClose={() => setActiveScreen("tech_dashboard")}
        />
      )}

      {/* Admin Views */}
      {activeScreen === "admin_dashboard" && <AdminDashboard />}
      {activeScreen === "admin_users" && <AdminUsersView />}
      {activeScreen === "admin_verification" && <AdminVerificationView />}
      {activeScreen === "admin_bookings" && <AdminBookingsView />}
      {activeScreen === "admin_sos" && <AdminSosView />}
      {activeScreen === "admin_revenue" && <AdminRevenueView />}
      {activeScreen === "admin_settings" && <AdminSettingsView />}
    </AppShell>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
