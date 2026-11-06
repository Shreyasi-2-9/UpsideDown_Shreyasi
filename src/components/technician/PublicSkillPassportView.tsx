import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";

export function PublicSkillPassportView() {
  const { technicians, setActiveScreen } = useApp();
  const tech = technicians[0]; // Ramesh Patil

  return (
    <div className="public-passport-page">
      {/* Top Civic Authenticity Banner */}
      <header className="public-passport-header">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="gov-emblem-badge">🏛️</span>
            <div>
              <span className="text-xs font-bold tracking-wider text-white uppercase block">
                MAHARASHTRA VOCATIONAL SKILL REGISTRY
              </span>
              <span className="text-[10px] text-white/75 block">
                Official Digital Credential Authentication Portal
              </span>
            </div>
          </div>
          <span className="verified-status-chip">
            <Icon name="check" size={12} /> SECURE VERIFIED
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 md:p-6">
        {/* Verification Card */}
        <article className="card shadow-2xl rounded-2xl overflow-hidden bg-white border border-outline">
          {/* Header Ribbon */}
          <div className="p-4 bg-paper border-b border-outline flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-extrabold text-violet uppercase tracking-wider block">
                CIVIC CREDENTIAL ID: HC-PASSPORT-PUN-0841
              </span>
              <span className="text-xs text-muted">
                Last Verified & Updated: <b>{tech.lastUpdated || "21 Jun 2026"}</b>
              </span>
            </div>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
              <Icon name="shield" size={13} /> Authenticated
            </span>
          </div>

          {/* Section 1: Professional Identity */}
          <div className="p-6 border-b border-outline">
            <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
              <div className="relative flex-shrink-0">
                <img
                  src={tech.photo}
                  alt={tech.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-violet shadow-md"
                />
                <span className="absolute -bottom-2 -right-2 bg-emerald-600 text-white rounded-full p-1.5 shadow">
                  <Icon name="check" size={14} />
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-extrabold text-midnight m-0">{tech.name}</h1>
                  <span className="bg-violet text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                    Master Pro
                  </span>
                </div>
                <p className="text-sm font-semibold text-violet mt-1">
                  Certified Master Plumber & Sanitation Contractor
                </p>
                <p className="text-xs text-muted mt-2 leading-relaxed">{tech.about}</p>

                {/* Public Badges */}
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <span className="text-xs bg-paper border border-outline px-3 py-1 rounded-lg text-midnight font-medium">
                    ⭐ <b>{tech.rating}</b> / 5.0 Rating
                  </span>
                  <span className="text-xs bg-paper border border-outline px-3 py-1 rounded-lg text-midnight font-medium">
                    💼 <b>{tech.totalJobs}</b> Verified Jobs Completed
                  </span>
                  <span className="text-xs bg-paper border border-outline px-3 py-1 rounded-lg text-midnight font-medium">
                    📍 Service Zone: <b>{tech.serviceArea}</b>
                  </span>
                  <span className="text-xs bg-paper border border-outline px-3 py-1 rounded-lg text-midnight font-medium">
                    ⏱️ Experience: <b>{tech.experienceYears} Years</b>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Verified Skills & Specialisations */}
          <div className="p-6 border-b border-outline">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-midnight flex items-center gap-2 m-0">
                <span className="w-6 h-6 rounded-md bg-lavender text-violet flex items-center justify-center text-xs font-bold">
                  B
                </span>
                Verified Trade Skills
              </h2>
              <span className="text-xs text-muted">Field audit confirmed</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tech.skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-3 p-3 bg-paper rounded-xl border border-outline/70"
                >
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    ✓
                  </span>
                  <div>
                    <span className="text-sm font-bold text-midnight block">{skill}</span>
                    <span className="text-xs text-muted">
                      Master Proficiency · {tech.experienceYears} Yrs Experience
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Government Certifications */}
          <div className="p-6 border-b border-outline">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-midnight flex items-center gap-2 m-0">
                <span className="w-6 h-6 rounded-md bg-lavender text-violet flex items-center justify-center text-xs font-bold">
                  C
                </span>
                Qualifications & Official Registrations
              </h2>
              <span className="text-xs text-emerald-700 font-bold">
                100% Cryptographically Verified
              </span>
            </div>

            <div className="space-y-3">
              {tech.certificates.map((cert) => (
                <div
                  key={cert.title}
                  className="p-4 bg-paper rounded-xl border border-outline flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-violet/10 text-violet flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name="shield" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-midnight m-0">{cert.title}</h3>
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-1">
                      {cert.issuer} · Year of Issue: {cert.year}
                    </p>
                    <span className="text-[11px] text-violet font-mono mt-1 block">
                      Registry Seal: SHA256:4F9C-8A21-ITI-AUTHENTICATED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Verified Performance Endorsements */}
          <div className="p-6 border-b border-outline">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-midnight flex items-center gap-2 m-0">
                <span className="w-6 h-6 rounded-md bg-lavender text-violet flex items-center justify-center text-xs font-bold">
                  E
                </span>
                Recent Authenticated Homeowner Reviews
              </h2>
              <span className="text-xs text-muted">From completed escrow jobs</span>
            </div>

            <div className="space-y-3">
              {tech.reviews.map((r) => (
                <div key={r.id} className="p-3.5 bg-paper rounded-xl border border-outline">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-midnight">{r.citizenName}</span>
                    <span className="text-amber-500 text-xs">{"★".repeat(r.rating)}</span>
                  </div>
                  <p className="text-xs text-midnight italic mt-1.5">"{r.comment}"</p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-muted">
                    <span>{r.serviceName}</span>
                    <span>·</span>
                    <span>{r.date}</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-semibold">✓ Verified Resident</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Public Notice & Privacy Protection */}
          <div className="p-5 bg-paper/60 flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs text-muted max-w-lg">
              <p className="m-0">
                🔒 <b>Privacy Protection Notice:</b> Private citizen contact information, home
                addresses, and government ID numbers are redacted in accordance with the Digital
                Personal Data Protection (DPDP) Act.
              </p>
            </div>
            <Button kind="primary" size="sm" onClick={() => setActiveScreen("home")}>
              Open HomeCare 360 App
            </Button>
          </div>
        </article>
      </main>
    </div>
  );
}
