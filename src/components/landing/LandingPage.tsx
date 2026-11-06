import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { AuthModal } from "../auth/AuthModal";
export function LandingPage() {
  const {
    setRole,
    setActiveScreen,
    setSelectedCategoryId,
    isAuthOpen,
    setIsAuthOpen,
    language,
    setLanguage,
  } = useApp();


  const [counterPrice, setCounterPrice] = useState(179);

  const handleSelectService = (serviceId: string) => {
    setSelectedCategoryId(serviceId);
    setRole("citizen");
    setActiveScreen("home");
  };

  const handleBookTechnician = () => {
    setRole("citizen");
    setActiveScreen("home");
  };

  const handleJoinTechnician = () => {
    setRole("technician");
    setActiveScreen("tech_dashboard");
  };

  const scrollToServices = () => {
    const el = document.getElementById("services-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1e1b4b] font-sans antialiased selection:bg-[#5b42f3]/15">
      {/* 1. TOP NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#ece8e1]">
        <div className="max-w-[1220px] mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="w-9 h-9 rounded-xl bg-[#5b42f3] text-white flex items-center justify-center shadow-sm">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 11 9-8 9 8" />
                <path d="M5 10v10h14V10M9 20v-6h6v6" />
              </svg>
            </span>
            <span className="text-xl font-bold tracking-tight text-[#1e1b4b]">HomeCare 360</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[14.5px] font-medium text-[#475569]">
            <button
              type="button"
              onClick={scrollToServices}
              className="hover:text-[#5b42f3] transition-colors"
            >
              Services
            </button>
            <button
              type="button"
              onClick={handleBookTechnician}
              className="hover:text-[#5b42f3] transition-colors"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={handleBookTechnician}
              className="hover:text-[#5b42f3] transition-colors"
            >
              Safety
            </button>
            <button
              type="button"
              onClick={handleJoinTechnician}
              className="hover:text-[#5b42f3] transition-colors"
            >
              For Technicians
            </button>
            <button
              type="button"
              onClick={scrollToServices}
              className="hover:text-[#5b42f3] transition-colors"
            >
              Pricing
            </button>
          </nav>

          {/* Right Actions: Language Switcher, Log In, Get Started */}
          <div className="flex items-center gap-5">
            <div className="hidden sm:flex items-center text-xs font-semibold text-[#64748b] bg-[#f1ede6] px-2.5 py-1 rounded-full">
              <button
                type="button"
                className={`hover:text-[#1e1b4b] ${language === "EN" ? "text-[#5b42f3] font-bold" : ""}`}
                onClick={() => setLanguage("EN")}
              >
                EN
              </button>
              <span className="mx-1 text-[#cbd5e1]">|</span>
              <button
                type="button"
                className={`hover:text-[#1e1b4b] ${language === "हिं" ? "text-[#5b42f3] font-bold" : ""}`}
                onClick={() => setLanguage("हिं")}
              >
                हि
              </button>
              <span className="mx-1 text-[#cbd5e1]">|</span>
              <button
                type="button"
                className={`hover:text-[#1e1b4b] ${language === "म" ? "text-[#5b42f3] font-bold" : ""}`}
                onClick={() => setLanguage("म")}
              >
                म
              </button>
            </div>

            <button
              type="button"
              className="text-[14px] font-semibold text-[#1e1b4b] hover:text-[#5b42f3] transition-colors"
              onClick={() => setActiveScreen("login")}
            >
              Log in
            </button>

            <button
              type="button"
              onClick={handleBookTechnician}
              className="bg-[#5b42f3] hover:bg-[#4f36e2] text-white text-[14px] font-semibold px-5 py-2.5 rounded-full shadow-sm transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="max-w-[1220px] mx-auto px-6 pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 pr-0 lg:pr-6">
            {/* Kicker */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-5 h-[1.5px] bg-[#64748b]" />
              <span className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-[#64748b]">
                Better Homes, Stronger Communities.
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-[44px] sm:text-[54px] lg:text-[62px] font-extrabold tracking-[-0.03em] leading-[1.08] text-[#0f172a] mb-6">
              Trusted home
              <br />
              services. Fair prices.
              <br />
              <span className="text-[#5b42f3]">Zero stress.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[16.5px] sm:text-[17.5px] text-[#475569] leading-[1.65] max-w-[540px] mb-8 font-normal">
              Book verified technicians, negotiate a fair civic rate, and pay through escrow. Funds
              are released only after the work is verified.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                type="button"
                onClick={handleBookTechnician}
                className="inline-flex items-center gap-2 bg-[#5b42f3] hover:bg-[#4f36e2] text-white text-[15px] font-semibold px-6 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Book a Technician</span>
                <span className="text-lg leading-none">→</span>
              </button>

              <button
                type="button"
                onClick={handleJoinTechnician}
                className="bg-white hover:bg-[#f1ede6] text-[#0f172a] border border-[#e2dcce] text-[15px] font-semibold px-6 py-3.5 rounded-full transition-all hover:border-[#cbd5e1] active:scale-[0.98]"
              >
                Join as Technician
              </button>
            </div>

            {/* Trust Checkmarks */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[13px] font-semibold text-[#475569]">
              <div className="flex items-center gap-1.5 text-[#16a34a]">
                <Icon name="check" size={16} />
                <span className="text-[#334155]">Government ID Verified</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#16a34a]">
                <Icon name="check" size={16} />
                <span className="text-[#334155]">7-day Warranty</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#16a34a]">
                <Icon name="lock" size={15} />
                <span className="text-[#334155]">Escrow Protected</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Hero Mockup Card Graphic */}
          <div className="lg:col-span-5 relative">
            {/* Outer Soft Lilac Canvas Container */}
            <div className="relative rounded-[32px] bg-[#ede9fe]/70 p-6 sm:p-8 pt-10 pb-12 border border-[#ddd6fe]/60 shadow-[0_8px_30px_rgb(91,66,243,0.06)]">
              {/* Floating Service Pill Badges */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full text-xs font-semibold text-[#5b42f3] shadow-sm border border-[#e2dcce]/40">
                  <span>🔧</span>
                  <span>Plumbing Care</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full text-xs font-semibold text-[#5b42f3] shadow-sm border border-[#e2dcce]/40">
                  <span>🛡️</span>
                  <span>Bodyguard Protection</span>
                </span>
              </div>

              {/* Foreground Card 1: Ramesh Patil Verified Quotation */}
              <div className="bg-white rounded-2xl p-5 shadow-[0_10px_35px_rgba(0,0,0,0.06)] border border-[#ede9fe] relative z-10">
                {/* Verified Pill & Options */}
                <div className="flex items-center justify-between mb-3.5">
                  <span className="inline-flex items-center gap-1.5 bg-[#dcfce7] text-[#15803d] text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                    ID & Skill Verified
                  </span>
                  <span className="text-[#94a3b8] text-base leading-none cursor-pointer">•••</span>
                </div>

                {/* Technician Profile Row */}
                <div className="flex items-center gap-3.5 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1659353587367-61eb5b8c6ef7?crop=faces&fit=crop&w=320&h=320&q=85"
                    alt="Ramesh Patil"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h3 className="text-base font-bold text-[#0f172a] m-0 leading-tight">
                      Ramesh Patil
                    </h3>
                    <p className="text-xs text-[#64748b] m-0 mt-0.5">
                      Plumbing specialist · 6 yrs exp.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-[#64748b] mt-0.5">
                      <span className="text-[#eab308]">★</span>
                      <b className="text-[#0f172a] font-bold">4.9</b>
                      <span>(129 reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Job & Price Row */}
                <div className="flex items-end justify-between py-3 border-t border-[#f1f5f9] mb-3.5">
                  <div>
                    <span className="text-[13.5px] font-bold text-[#0f172a] block">
                      Leaking tap repair
                    </span>
                    <span className="text-xs text-[#64748b]">Arrives in 18 min</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#0f172a] block leading-none">
                      ₹199
                    </span>
                    <span className="text-[10.5px] text-[#94a3b8]">Suggested civic rate</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={handleBookTechnician}
                  className="w-full bg-[#5b42f3] hover:bg-[#4f36e2] text-white text-[14px] font-bold py-3 rounded-full shadow-sm transition-all text-center block active:scale-[0.98]"
                >
                  Accept & Lock ₹199
                </button>

                {/* Escrow Sub-Note */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#64748b] mt-2.5">
                  <Icon name="lock" size={11} className="text-[#16a34a]" />
                  <span>Payment held safely until you verify the work</span>
                </div>
              </div>

              {/* Floating Garbage Pill on Left */}
              <div className="mt-3 flex items-center justify-start">
                <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full text-xs font-semibold text-[#5b42f3] shadow-sm border border-[#e2dcce]/40">
                  <span>♻️</span>
                  <span>Garbage Eco-Fleet</span>
                </span>
              </div>

              {/* Overlapping Card 2: Interactive Counter-Offer Slider (Bottom Right) */}
              <div className="absolute -bottom-6 right-2 sm:right-4 w-[280px] sm:w-[310px] bg-white rounded-2xl p-4 shadow-[0_14px_35px_rgba(0,0,0,0.09)] border border-[#ede9fe] z-20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#0f172a]">Make a Counter-Offer</span>
                  <Icon name="sliders" size={14} className="text-[#5b42f3]" />
                </div>
                <div className="flex items-center justify-between text-xs text-[#64748b] mb-2">
                  <span>Your price. Your say.</span>
                  <span className="text-base font-extrabold text-[#5b42f3]">₹{counterPrice}</span>
                </div>

                {/* Interactive Range Slider */}
                <input
                  type="range"
                  min="140"
                  max="220"
                  step="5"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(Number(e.target.value))}
                  className="w-full accent-[#5b42f3] cursor-pointer h-1.5 bg-[#ede9fe] rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-[#94a3b8] mt-1 font-semibold">
                  <span>₹140</span>
                  <span>₹220</span>
                </div>

                {/* Friendly Mascot Bunny Illustration at corner */}
                <div className="absolute -bottom-3 -right-3 w-11 h-11 bg-white rounded-full p-1 shadow-md border border-[#ede9fe] flex items-center justify-center pointer-events-none">
                  <span className="text-xl">🐰</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. IMPACT STATS BAR */}
      <section className="bg-white border-y border-[#ece8e1] py-12">
        <div className="max-w-[1220px] mx-auto px-6 text-center">
          {/* Kicker */}
          <div className="flex items-center justify-center gap-1.5 mb-8">
            <span className="text-[#16a34a] text-xs">●</span>
            <span className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-[#64748b]">
              Small jobs. A big difference.
            </span>
          </div>

          {/* 4 Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            <div>
              <strong className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] block tracking-tight">
                10,000+
              </strong>
              <span className="text-sm font-medium text-[#64748b] mt-1 block">Jobs Completed</span>
            </div>
            <div>
              <strong className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] block tracking-tight">
                2,500+
              </strong>
              <span className="text-sm font-medium text-[#64748b] mt-1 block">
                Verified Technicians
              </span>
            </div>
            <div>
              <strong className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] block tracking-tight">
                4.8
              </strong>
              <span className="text-sm font-medium text-[#64748b] mt-1 block">Average Rating</span>
            </div>
            <div>
              <strong className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] block tracking-tight">
                18 min
              </strong>
              <span className="text-sm font-medium text-[#64748b] mt-1 block">Average Arrival</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "WHAT CAN WE HELP YOU WITH?" (SERVICES GRID) */}
      <section id="services-section" className="py-20 max-w-[1220px] mx-auto px-6">
        <div className="mb-12">
          {/* Kicker */}
          <span className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-[#5b42f3] block mb-2">
            A little help, right around the corner
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight mb-3">
            What can we help you with?
          </h2>
          <p className="text-base text-[#64748b] max-w-2xl font-normal">
            From quick home fixes to a cleaner, safer neighbourhood. Find your verified expert.
          </p>
        </div>

        {/* 6 Service Cards (2 Rows of 3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Plumbing */}
          <div
            onClick={() => handleSelectService("plumbing")}
            className="group bg-white rounded-2xl p-6 border border-[#ece8e1] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(91,66,243,0.08)] hover:border-[#ddd6fe] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="w-11 h-11 rounded-xl bg-[#f5f3ff] text-[#5b42f3] flex items-center justify-center text-lg">
                  🔧
                </span>
                <span className="text-[#94a3b8] group-hover:text-[#5b42f3] transition-colors text-lg">
                  ↗
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#0f172a] mb-1.5 group-hover:text-[#5b42f3] transition-colors">
                Plumbing
              </h3>
              <p className="text-sm text-[#64748b] leading-relaxed">
                Leaks, taps & everyday repairs.
              </p>
            </div>
            <div className="pt-5 mt-4 border-t border-[#f8fafc]">
              <span className="text-xs font-bold text-[#5b42f3]">From ₹199</span>
            </div>
          </div>

          {/* Card 2: Electrical */}
          <div
            onClick={() => handleSelectService("electrical")}
            className="group bg-white rounded-2xl p-6 border border-[#ece8e1] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(91,66,243,0.08)] hover:border-[#ddd6fe] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="w-11 h-11 rounded-xl bg-[#f5f3ff] text-[#5b42f3] flex items-center justify-center text-lg">
                  ⚡
                </span>
                <span className="text-[#94a3b8] group-hover:text-[#5b42f3] transition-colors text-lg">
                  ↗
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#0f172a] mb-1.5 group-hover:text-[#5b42f3] transition-colors">
                Electrical
              </h3>
              <p className="text-sm text-[#64748b] leading-relaxed">
                Safe fixes for a brighter home.
              </p>
            </div>
            <div className="pt-5 mt-4 border-t border-[#f8fafc]">
              <span className="text-xs font-bold text-[#5b42f3]">From ₹249</span>
            </div>
          </div>

          {/* Card 3: Carpentry */}
          <div
            onClick={() => handleSelectService("carpentry")}
            className="group bg-white rounded-2xl p-6 border border-[#ece8e1] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(91,66,243,0.08)] hover:border-[#ddd6fe] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="w-11 h-11 rounded-xl bg-[#f5f3ff] text-[#5b42f3] flex items-center justify-center text-lg">
                  🔨
                </span>
                <span className="text-[#94a3b8] group-hover:text-[#5b42f3] transition-colors text-lg">
                  ↗
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#0f172a] mb-1.5 group-hover:text-[#5b42f3] transition-colors">
                Carpentry
              </h3>
              <p className="text-sm text-[#64748b] leading-relaxed">
                Furniture fixes & fittings.
              </p>
            </div>
            <div className="pt-5 mt-4 border-t border-[#f8fafc]">
              <span className="text-xs font-bold text-[#5b42f3]">From ₹299</span>
            </div>
          </div>

          {/* Card 4: Cleaning */}
          <div
            onClick={() => handleSelectService("cleaning")}
            className="group bg-white rounded-2xl p-6 border border-[#ece8e1] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(91,66,243,0.08)] hover:border-[#ddd6fe] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="w-11 h-11 rounded-xl bg-[#f5f3ff] text-[#5b42f3] flex items-center justify-center text-lg">
                  ✨
                </span>
                <span className="text-[#94a3b8] group-hover:text-[#5b42f3] transition-colors text-lg">
                  ↗
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#0f172a] mb-1.5 group-hover:text-[#5b42f3] transition-colors">
                Cleaning
              </h3>
              <p className="text-sm text-[#64748b] leading-relaxed">
                Fresh spaces, without the effort.
              </p>
            </div>
            <div className="pt-5 mt-4 border-t border-[#f8fafc]">
              <span className="text-xs font-bold text-[#5b42f3]">From ₹399</span>
            </div>
          </div>

          {/* Card 5: Bodyguard Protection */}
          <div
            onClick={() => handleSelectService("bodyguard")}
            className="group bg-white rounded-2xl p-6 border border-[#ece8e1] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(91,66,243,0.08)] hover:border-[#ddd6fe] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="w-11 h-11 rounded-xl bg-[#f5f3ff] text-[#5b42f3] flex items-center justify-center text-lg">
                  🛡️
                </span>
                <span className="text-[#94a3b8] group-hover:text-[#5b42f3] transition-colors text-lg">
                  ↗
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#0f172a] mb-1.5 group-hover:text-[#5b42f3] transition-colors">
                Bodyguard Protection
              </h3>
              <p className="text-sm text-[#64748b] leading-relaxed">
                Verified support for your safety.
              </p>
            </div>
            <div className="pt-5 mt-4 border-t border-[#f8fafc]">
              <span className="text-xs font-bold text-[#5b42f3]">Request a quote</span>
            </div>
          </div>

          {/* Card 6: Garbage Eco-Fleet */}
          <div
            onClick={() => handleSelectService("garbage")}
            className="group bg-white rounded-2xl p-6 border border-[#ece8e1] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(91,66,243,0.08)] hover:border-[#ddd6fe] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="w-11 h-11 rounded-xl bg-[#f5f3ff] text-[#5b42f3] flex items-center justify-center text-lg">
                  ♻️
                </span>
                <span className="text-[#94a3b8] group-hover:text-[#5b42f3] transition-colors text-lg">
                  ↗
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#0f172a] mb-1.5 group-hover:text-[#5b42f3] transition-colors">
                Garbage Eco-Fleet
              </h3>
              <p className="text-sm text-[#64748b] leading-relaxed">
                Responsible pickup. Cleaner streets.
              </p>
            </div>
            <div className="pt-5 mt-4 border-t border-[#f8fafc]">
              <span className="text-xs font-bold text-[#5b42f3]">Schedule a pickup</span>
            </div>
          </div>
        </div>

        {/* Notice Pill Below Services */}
        <div className="inline-flex items-center gap-2 bg-[#f5f3ff] border border-[#ede9fe] px-4 py-2.5 rounded-full text-xs font-semibold text-[#5b42f3]">
          <span>⚖️</span>
          <span>A fair starting point, not a fixed bill. Agree on your price before any work begins.</span>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="border-t border-[#ece8e1] py-8 bg-[#faf8f5]">
        <div className="max-w-[1220px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748b]">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="w-6 h-6 rounded-lg bg-[#5b42f3] text-white flex items-center justify-center">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 11 9-8 9 8" />
                <path d="M5 10v10h14V10M9 20v-6h6v6" />
              </svg>
            </span>
            <span className="font-bold text-[#1e1b4b]">HomeCare 360</span>
          </div>

          {/* Copyright */}
          <div>© 2026 HomeCare 360. Care for every home.</div>

          {/* Legal Links */}
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={handleBookTechnician}
              className="hover:text-[#5b42f3] transition-colors"
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={handleBookTechnician}
              className="hover:text-[#5b42f3] transition-colors"
            >
              Terms
            </button>
            <button
              type="button"
              onClick={handleBookTechnician}
              className="hover:text-[#5b42f3] transition-colors"
            >
              Help & support
            </button>
          </div>
        </div>
      </footer>

      {/* Auth Modal Support */}
      <AuthModal />
    </div>
  );
}
