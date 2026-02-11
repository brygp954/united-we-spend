"use client";
import { useState, useEffect, useRef } from "react";

// ─── PALETTE ────────────────────────────────────────────────
const C = {
  // Dark sections (header, hero, footer, overlays)
  dark: "#0F172A",
  darkGrad: "linear-gradient(180deg, #0F172A 0%, #164E63 100%)",
  darkCard: "rgba(255,255,255,0.06)",
  darkBorder: "rgba(255,255,255,0.1)",
  darkText: "#FFFFFF",
  darkSecondary: "rgba(255,255,255,0.65)",
  darkMuted: "rgba(255,255,255,0.35)",
  // Light sections (body, cards)
  light: "#F4F7FA",
  card: "#FFFFFF",
  cardBorder: "rgba(15,23,42,0.07)",
  lightText: "#0F172A",
  lightSecondary: "#475569",
  lightMuted: "#94A3B8",
  // Brand
  cyan: "#22D3EE",
  teal: "#0891B2",
  tealDeep: "#0E7490",
  tealSubtle: "rgba(8,145,178,0.08)",
  tealGhost: "rgba(8,145,178,0.04)",
  // Tiers
  tierTopBg: "#0891B2",
  tierTopText: "#FFFFFF",
  tierMidBg: "rgba(8,145,178,0.1)",
  tierMidText: "#0891B2",
  tierLowBg: "#E2E8F0",
  tierLowText: "#475569",
  // Functional
  slate100: "#F1F5F9",
  slate200: "#E2E8F0",
  // New: accent greens for positive stats
  green: "#10B981",
  greenSubtle: "rgba(16,185,129,0.08)",
  greenBorder: "rgba(16,185,129,0.2)",
};

// ─── FONTS ──────────────────────────────────────────────────
const F = {
  display: "'Plus Jakarta Sans', 'Outfit', sans-serif",
  body: "'Outfit', sans-serif",
};

// ─── DATA ───────────────────────────────────────────────────
const UNION_BUSINESSES = [
  { name: "Kowalski's Markets", address: "1261 Grand Ave, St. Paul", category: "groceries", union: "UFCW Local 1189", distance: "0.8 mi", type: "Grocery", tier: "union-local", tierLabel: "Union & Local" },
  { name: "Kowalski's Markets", address: "30 Fairview Ave S, St. Paul", category: "groceries", union: "UFCW Local 1189", distance: "1.6 mi", type: "Grocery", tier: "union-local", tierLabel: "Union & Local" },
  { name: "Mississippi Market Co-op", address: "1500 W 7th St, St. Paul", category: "groceries", union: null, distance: "1.3 mi", type: "Grocery Co-op", tier: "local", tierLabel: "Local" },
  { name: "Mississippi Market Co-op", address: "622 Selby Ave, St. Paul", category: "groceries", union: null, distance: "0.9 mi", type: "Grocery Co-op", tier: "local", tierLabel: "Local" },
  { name: "Cub Foods", address: "1440 University Ave W, St. Paul", category: "groceries", union: "UFCW Local 1189", distance: "1.1 mi", type: "Grocery", tier: "union", tierLabel: "Union" },
  { name: "Lunds & Byerlys", address: "1650 W 7th St, St. Paul", category: "groceries", union: "UFCW Local 1189", distance: "1.4 mi", type: "Grocery", tier: "union", tierLabel: "Union" },
  { name: "Cub Foods", address: "1201 Larpenteur Ave W, Roseville", category: "groceries", union: "UFCW Local 1189", distance: "3.2 mi", type: "Grocery", tier: "union", tierLabel: "Union" },
  { name: "Lloyd's Pharmacy", address: "341 Snelling Ave S, St. Paul", category: "pharmacy", union: null, distance: "1.0 mi", type: "Pharmacy", tier: "local", tierLabel: "Local" },
  { name: "Setzer Pharmacy", address: "1685 W 7th St, St. Paul", category: "pharmacy", union: null, distance: "1.5 mi", type: "Pharmacy", tier: "local", tierLabel: "Local" },
  { name: "Cub Pharmacy", address: "1440 University Ave W, St. Paul", category: "pharmacy", union: "UFCW Local 1189", distance: "1.1 mi", type: "Pharmacy", tier: "union", tierLabel: "Union" },
  { name: "Green Goods", address: "512 Robert St N, St. Paul", category: "cannabis", union: "UFCW Local 1189", distance: "0.9 mi", type: "Dispensary", tier: "union-local", tierLabel: "Union & Local" },
  { name: "Nothing But Hemp", address: "1045 Payne Ave, St. Paul", category: "cannabis", union: null, distance: "2.4 mi", type: "CBD & Wellness", tier: "local", tierLabel: "Local" },
  { name: "Ace Hardware", address: "976 Payne Ave, St. Paul", category: "hardware", union: null, distance: "2.3 mi", type: "Hardware", tier: "local", tierLabel: "Local" },
  { name: "Como Park True Value", address: "785 Lexington Pkwy N, St. Paul", category: "hardware", union: null, distance: "2.8 mi", type: "Hardware", tier: "local", tierLabel: "Local" },
  { name: "Target", address: "1300 University Ave W, St. Paul", category: "general", union: "UFCW Local 1189", distance: "1.0 mi", type: "General Merchandise", tier: "union", tierLabel: "Union" },
  { name: "Affinity Plus Federal Credit Union", address: "175 W Lafayette Frontage Rd, St. Paul", category: "banking", union: null, distance: "0.7 mi", type: "Credit Union", tier: "local", tierLabel: "Local" },
  { name: "Hiway Federal Credit Union", address: "840 Westminster St, St. Paul", category: "banking", union: null, distance: "1.2 mi", type: "Credit Union", tier: "local", tierLabel: "Local" },
  { name: "Sunrise Banks", address: "2300 Como Ave, St. Paul", category: "banking", union: null, distance: "2.1 mi", type: "Community Bank", tier: "local", tierLabel: "Local" },
  { name: "Dogwood Coffee", address: "825 Carleton St, St. Paul", category: "coffee", union: null, distance: "0.6 mi", type: "Coffee Shop", tier: "local", tierLabel: "Local" },
  { name: "Claddagh Coffee", address: "459 Selby Ave, St. Paul", category: "coffee", union: null, distance: "0.8 mi", type: "Coffee Shop", tier: "local", tierLabel: "Local" },
  { name: "Roots Roasting", address: "1849 Marshall Ave, St. Paul", category: "coffee", union: null, distance: "1.4 mi", type: "Coffee Roaster", tier: "local", tierLabel: "Local" },
];

const TIER_ORDER = ["union-local", "union", "local"];

const TIER_STYLES = {
  "union-local": {
    border: C.teal, badge: C.tierTopBg, badgeText: C.tierTopText,
    label: "Union & Local",
    description: "Union workers. Locally owned. Profits stay here.",
  },
  union: {
    border: C.teal, badge: C.tierMidBg, badgeText: C.tierMidText,
    label: "Union",
    description: "Union workers with wages, benefits, and a voice on the job.",
  },
  local: {
    border: C.lightSecondary, badge: C.tierLowBg, badgeText: C.tierLowText,
    label: "Local",
    description: "Locally owned. Profits stay in your community.",
  },
};

const CATEGORY_MAP = {
  groceries: ["grocery", "groceries", "food", "produce", "meat", "milk", "bread", "eggs", "fruit", "vegetables", "snacks", "cereal", "cheese", "butter", "yogurt", "chicken", "beef", "fish"],
  pharmacy: ["pharmacy", "prescription", "medicine", "medication", "drug", "health", "vitamins", "supplements", "first aid", "cold medicine", "tylenol", "advil", "bandages"],
  cannabis: ["cannabis", "cbd", "dispensary", "marijuana", "weed", "thc", "edibles", "gummies", "vape", "tincture", "wellness", "cbd/cannabis"],
  hardware: ["hardware", "tools", "nails", "screws", "paint", "lumber", "drill", "hammer", "wrench", "plumbing", "electrical", "lightbulb", "batteries"],
  coffee: ["coffee", "cafe", "espresso", "latte", "cappuccino", "tea", "coffee shop"],
  banking: ["banking", "bank", "credit union", "checking", "savings", "loan", "mortgage", "financial"],
  general: ["general", "clothes", "electronics", "headphones", "office", "supplies", "household", "cleaning", "laundry", "detergent", "soap", "shampoo", "toothpaste", "paper towels", "trash bags"],
  fitness: ["fitness", "gym", "workout", "exercise", "yoga", "pilates", "crossfit", "training"],
};

// ─── ROTATING QUESTIONS (THV evidence layer data collection) ─
const ROTATING_QUESTIONS = [
  {
    id: "frequency",
    question: "How often do you shop here?",
    options: ["First time", "Monthly", "Weekly", "Regular"],
  },
  {
    id: "switch_from",
    question: "What are you switching from?",
    options: ["Amazon", "Walmart", "Target", "Other chain", "N/A"],
  },
  {
    id: "discovery",
    question: "How'd you find this business?",
    options: ["This app", "Word of mouth", "Drove past", "Already knew"],
  },
  {
    id: "motivation",
    question: "What matters most to you?",
    options: ["Keep $ local", "Better quality", "Union jobs", "Convenience"],
  },
  {
    id: "likelihood",
    question: "Will you come back?",
    options: ["Definitely", "Probably", "Maybe", "Not sure"],
  },
  {
    id: "influence",
    question: "Would you tell a friend?",
    options: ["Already did", "Absolutely", "Maybe", "Probably not"],
  },
];

const SHARE_MESSAGES = [
  (biz, amount) => `I just put $${amount} into ${biz} instead of a chain. 73¢ of every dollar stays local. 🫠`,
  (biz, amount) => `$${amount} at ${biz}. That's $${Math.round(amount * 0.73)} that stays in my city instead of leaving. ✌️`,
  (biz, amount) => `Just redirected $${amount} to ${biz}. My money, my neighborhood. 🧮`,
  (biz, amount) => `Most boring radical act of my life: $${amount} at ${biz} instead of a chain. 🫡`,
  (biz, amount) => `$${amount} at ${biz}. That's $${Math.round(amount * 0.73)} staying local vs $${Math.round(amount * 0.27)} at a chain. Easy math. 💅`,
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getCurrentWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000));
}

// Simulated community stats — seeded by week for consistency
function getCommunityStats() {
  const week = getCurrentWeekNumber();
  const seed = (week * 137 + 42) % 1000;
  return {
    peopleThisWeek: 1027 + (seed % 80),
    dollarsThisWeek: 26000 + (seed % 3000),
    totalPeople: 4847 + seed,
    totalDollars: 342600 + (seed * 73),
    businesses: 24 + (seed % 8),
  };
}

function matchBusinesses(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  let matchedCategories = new Set();
  for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
    for (const keyword of keywords) {
      if (q.includes(keyword) || keyword.includes(q)) matchedCategories.add(category);
    }
  }
  let matched = matchedCategories.size === 0
    ? UNION_BUSINESSES.filter((b) => b.name.toLowerCase().includes(q) || b.type.toLowerCase().includes(q))
    : UNION_BUSINESSES.filter((b) => matchedCategories.has(b.category));
  return matched.sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));
}

// ─── ICONS ──────────────────────────────────────────────────
function MapPinIcon({ size = 14 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>);
}
function SearchIcon() {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
}
function ShieldIcon({ size = 13 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>);
}
function HomeIcon({ size = 13 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>);
}
function CheckIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);
}
function ShareIcon() {
  return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>);
}
function CloseIcon() {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
}
function FlagIcon() {
  return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>);
}

// ─── GLOBAL STYLES ──────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes cardIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
  @keyframes revealLine { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes countPulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes numberDrop {
    0% { opacity: 1; transform: translateY(0) scale(1); }
    40% { opacity: 1; transform: translateY(60px) scale(0.8); }
    60% { opacity: 0.6; transform: translateY(60px) scale(0.6); }
    100% { opacity: 0; transform: translateY(60px) scale(0.3); }
  }
  @keyframes totalPulse {
    0% { transform: scale(1); }
    15% { transform: scale(1.08); }
    30% { transform: scale(1); }
    100% { transform: scale(1); }
  }
  @keyframes glowRing {
    0% { box-shadow: 0 0 0 0 rgba(34,211,238,0.3); }
    70% { box-shadow: 0 0 0 12px rgba(34,211,238,0); }
    100% { box-shadow: 0 0 0 0 rgba(34,211,238,0); }
  }
  @keyframes barGrow {
    from { width: 0; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes liveDot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  * { box-sizing: border-box; }
  input::placeholder { color: ${C.lightMuted}; }
`;

// ─── OVERLAY BASE ───────────────────────────────────────────
const overlayBase = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  zIndex: 1000, display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center", padding: "24px",
  animation: "fadeIn 0.3s ease",
};

// ═══════════════════════════════════════════════════════════
// NEW COMMIT FLOW — Multi-step overlay
// ═══════════════════════════════════════════════════════════
function CommitFlow({ business, onComplete, onClose }) {
  const [step, setStep] = useState(1);
  // 1: enter spend amount
  // 2: rotating question
  // 3: animate into total
  // 4: share card

  const [spendAmount, setSpendAmount] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [animatingTotal, setAnimatingTotal] = useState(false);
  const [totalAnimDone, setTotalAnimDone] = useState(false);
  const [currentQuestion] = useState(() => getRandomItem(ROTATING_QUESTIONS));

  const stats = getCommunityStats();
  const tierStyle = TIER_STYLES[business.tier];
  const amount = parseInt(spendAmount) || 0;

  const handleAmountSubmit = () => {
    if (amount > 0) setStep(2);
  };

  // Chain all step 3 timing from the event handler to avoid useEffect re-render loops
  const handleQuestionAnswer = (answer) => {
    setSelectedAnswer(answer);
    setTimeout(() => {
      setStep(3);
      setAnimatingTotal(true);
      setTimeout(() => {
        setAnimatingTotal(false);
        setTotalAnimDone(true);
        setTimeout(() => setStep(4), 1200);
      }, 1600);
    }, 600);
  };

  const shareMessage = getRandomItem(SHARE_MESSAGES)(business.name, amount || 50);

  // ─── STEP 1: Enter Spend Amount ──────────
  if (step === 1) {
    return (
      <div style={{ ...overlayBase, background: "rgba(15,23,42,0.97)", zIndex: 1001 }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "20px", right: "20px", background: "none",
          border: "none", cursor: "pointer", color: C.darkMuted, padding: "8px",
        }}><CloseIcon /></button>

        <div style={{ maxWidth: "400px", width: "100%", textAlign: "center", animation: "fadeUp 0.5s ease" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: C.darkCard, padding: "6px 14px", marginBottom: "24px",
            border: `1px solid ${C.darkBorder}`,
          }}>
            {business.tier === "union-local" && <><ShieldIcon size={11} /><HomeIcon size={11} /></>}
            {business.tier === "union" && <ShieldIcon size={11} />}
            {business.tier === "local" && <HomeIcon size={11} />}
            <span style={{
              fontFamily: F.body, fontSize: "12px", fontWeight: 700,
              color: C.cyan, textTransform: "uppercase", letterSpacing: "0.04em",
            }}>{business.name}</span>
          </div>

          <h2 style={{
            fontFamily: F.display, fontSize: "clamp(24px, 6vw, 32px)",
            fontWeight: 700, color: C.darkText, lineHeight: 1.2,
            margin: "0 0 8px 0",
          }}>How much are you spending?</h2>
          <p style={{
            fontFamily: F.body, fontSize: "15px", color: C.darkMuted,
            margin: "0 0 32px 0",
          }}>Rough estimate is fine. This stays anonymous.</p>

          {/* Amount input */}
          <div style={{ position: "relative", maxWidth: "240px", margin: "0 auto 16px" }}>
            <span style={{
              position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)",
              fontFamily: F.display, fontSize: "32px", fontWeight: 700,
              color: C.darkMuted,
            }}>$</span>
            <input
              type="number"
              inputMode="numeric"
              value={spendAmount}
              onChange={(e) => setSpendAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAmountSubmit()}
              autoFocus
              placeholder="0"
              style={{
                width: "100%", padding: "18px 20px 18px 48px",
                background: C.darkCard, border: `2px solid ${amount > 0 ? C.teal : C.darkBorder}`,
                outline: "none", fontFamily: F.display, fontSize: "32px",
                fontWeight: 700, color: C.darkText, textAlign: "center",
                transition: "border-color 0.2s ease",
              }}
            />
          </div>

          {/* Quick amount buttons */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "32px" }}>
            {[25, 50, 100, 200].map((amt) => (
              <button key={amt} onClick={() => setSpendAmount(String(amt))} style={{
                background: spendAmount === String(amt) ? C.teal : C.darkCard,
                border: `1px solid ${spendAmount === String(amt) ? C.teal : C.darkBorder}`,
                color: spendAmount === String(amt) ? "#FFFFFF" : C.darkSecondary,
                padding: "8px 16px", cursor: "pointer",
                fontFamily: F.body, fontSize: "14px", fontWeight: 600,
                transition: "all 0.15s ease",
              }}>${amt}</button>
            ))}
          </div>

          <button onClick={handleAmountSubmit} disabled={amount <= 0} style={{
            background: amount > 0 ? C.teal : C.darkCard,
            border: "none", padding: "16px 48px", cursor: amount > 0 ? "pointer" : "default",
            fontFamily: F.body, fontSize: "15px", fontWeight: 700,
            color: amount > 0 ? "#FFFFFF" : C.darkMuted,
            textTransform: "uppercase", letterSpacing: "0.06em",
            transition: "all 0.2s ease",
            opacity: amount > 0 ? 1 : 0.5,
          }}>Next →</button>
        </div>
      </div>
    );
  }

  // ─── STEP 2: Rotating Question ───────────
  if (step === 2) {
    return (
      <div style={{ ...overlayBase, background: "rgba(15,23,42,0.97)", zIndex: 1001 }}>
        <div style={{ maxWidth: "420px", width: "100%", textAlign: "center", animation: "fadeUp 0.5s ease" }}>
          <div style={{
            fontFamily: F.body, fontSize: "12px", fontWeight: 700,
            color: C.teal, textTransform: "uppercase", letterSpacing: "0.15em",
            marginBottom: "24px",
          }}>Quick question</div>

          <h2 style={{
            fontFamily: F.display, fontSize: "clamp(22px, 5.5vw, 28px)",
            fontWeight: 700, color: C.darkText, lineHeight: 1.3,
            margin: "0 0 32px 0",
          }}>{currentQuestion.question}</h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: currentQuestion.options.length <= 4 ? "1fr 1fr" : "1fr 1fr",
            gap: "10px", maxWidth: "340px", margin: "0 auto",
          }}>
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleQuestionAnswer(option)}
                style={{
                  background: selectedAnswer === option ? C.teal : C.darkCard,
                  border: `1.5px solid ${selectedAnswer === option ? C.teal : C.darkBorder}`,
                  padding: "14px 12px", cursor: "pointer",
                  fontFamily: F.body, fontSize: "14px", fontWeight: 600,
                  color: selectedAnswer === option ? "#FFFFFF" : C.darkSecondary,
                  transition: "all 0.15s ease",
                  transform: selectedAnswer === option ? "scale(0.97)" : "scale(1)",
                }}
              >{option}</button>
            ))}
          </div>

          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: F.body, fontSize: "13px", color: C.darkMuted,
            marginTop: "24px", padding: "8px 16px",
          }}>Skip</button>
        </div>
      </div>
    );
  }

  // ─── STEP 3: Animate Amount Into Total ───
  if (step === 3) {
    const newTotal = stats.dollarsThisWeek + amount;
    return (
      <div style={{ ...overlayBase, background: "rgba(15,23,42,0.97)", zIndex: 1001 }}>
        <div style={{ maxWidth: "440px", width: "100%", textAlign: "center", position: "relative" }}>

          {/* The user's amount — drops down and fades */}
          {animatingTotal && (
            <div style={{
              position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)",
              fontFamily: F.display, fontSize: "clamp(40px, 10vw, 56px)",
              fontWeight: 800, color: C.cyan,
              animation: "numberDrop 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
            }}>+${amount}</div>
          )}

          {/* Running total */}
          <div style={{
            marginTop: "100px",
            animation: totalAnimDone ? "none" : undefined,
          }}>
            <div style={{
              fontFamily: F.body, fontSize: "14px", fontWeight: 600,
              color: C.darkMuted, textTransform: "uppercase",
              letterSpacing: "0.12em", marginBottom: "12px",
            }}>Kept local this week</div>
            <div style={{
              fontFamily: F.display, fontSize: "clamp(48px, 12vw, 72px)",
              fontWeight: 800, color: C.darkText, lineHeight: 1,
              animation: totalAnimDone ? "totalPulse 0.6s ease" : "none",
            }}>
              ${totalAnimDone ? newTotal.toLocaleString() : stats.dollarsThisWeek.toLocaleString()}
            </div>
            {totalAnimDone && (
              <div style={{
                fontFamily: F.body, fontSize: "16px", color: C.green,
                marginTop: "12px", fontWeight: 600,
                animation: "fadeUp 0.4s ease",
              }}>
                +${amount} from you ✓
              </div>
            )}
          </div>

          {totalAnimDone && (
            <div style={{
              marginTop: "20px",
              fontFamily: F.body, fontSize: "15px", color: C.darkMuted,
              fontStyle: "italic", animation: "fadeUp 0.5s ease 0.3s both",
            }}>Every dollar counts. Yours just did.</div>
          )}
        </div>
      </div>
    );
  }

  // ─── STEP 4: Personalized Share Card ─────
  if (step === 4) {
    const localImpact = Math.round(amount * 0.73 * 4);
    return (
      <div style={{ ...overlayBase, background: "rgba(15,23,42,0.92)", backdropFilter: "blur(12px)", zIndex: 1001 }}>
        <button onClick={() => onComplete(false, amount)} style={{
          position: "absolute", top: "20px", right: "20px", background: "none",
          border: "none", cursor: "pointer", color: C.darkMuted, padding: "8px",
        }}><CloseIcon /></button>

        {/* Receipt Share Card */}
        <div style={{
          maxWidth: "320px", width: "100%", position: "relative",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          animation: "cardIn 0.5s ease",
        }}>
          {/* Top half - dark */}
          <div style={{
            background: C.dark, padding: "32px 28px 24px",
            textAlign: "center",
          }}>
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: "10px", fontWeight: 700,
              letterSpacing: "0.2em", color: C.teal,
              textTransform: "uppercase", marginBottom: "16px",
            }}>United We Spend</div>

            <div style={{
              position: "relative", display: "inline-block",
              padding: "28px 40px", margin: "0 auto 4px",
            }}>
              {/* Ripple rings */}
              {[80, 56, 36].map((size, i) => (
                <div key={i} style={{
                  position: "absolute",
                  top: "50%", left: "50%",
                  width: `${size * 2}px`, height: `${size * 2}px`,
                  borderRadius: "50%",
                  border: `${1 + i * 0.5}px solid rgba(34,211,238,${0.12 + i * 0.12})`,
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                }} />
              ))}
              {/* Glow */}
              <div style={{
                position: "absolute",
                top: "50%", left: "50%",
                width: "100px", height: "100px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }} />
              <div style={{
                fontFamily: F.display, fontSize: "48px", fontWeight: 800,
                color: "#FFFFFF", lineHeight: 1, position: "relative",
                transform: "translateX(-0.2em)",
              }}>${amount}</div>
            </div>

            <div style={{
              fontFamily: F.body, fontSize: "12px", fontWeight: 600,
              color: "rgba(255,255,255,0.45)", marginTop: "4px",
              textTransform: "uppercase", letterSpacing: "0.12em",
            }}>spent locally at</div>

            <div style={{
              fontFamily: F.display, fontSize: "18px", fontWeight: 600,
              color: "rgba(255,255,255,0.65)",
            }}>{business.name}</div>
            <div style={{
              fontFamily: F.body, fontSize: "12px", fontWeight: 600,
              color: C.cyan, marginTop: "8px",
              textTransform: "uppercase", letterSpacing: "0.06em",
            }}>★ {tierStyle.label}</div>
          </div>

          {/* Bottom half - receipt paper */}
          <div style={{
            background: "#FFFEF5", padding: "24px 28px 28px",
          }}>
            {/* Local Economic Impact */}
            <div style={{
              textAlign: "center",
              marginBottom: "16px", padding: "18px 16px",
              background: "rgba(8,145,178,0.08)",
              border: "1px solid rgba(8,145,178,0.15)",
            }}>
              <div style={{
                fontFamily: "'Space Mono', monospace", fontSize: "10px", color: C.teal,
                textTransform: "uppercase", letterSpacing: "0.14em",
                marginBottom: "6px", fontWeight: 700,
              }}>Local Economic Impact</div>
              <div style={{
                fontFamily: F.display, fontSize: "38px", fontWeight: 800,
                color: C.teal, lineHeight: 1,
              }}>${localImpact}</div>
            </div>

            {/* Tagline */}
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: F.display, fontSize: "15px", fontWeight: 700,
                color: "#1A1A1A", lineHeight: 1.5,
              }}>
                I'm changing my spending<br />habits and bringing receipts. 🧾
              </div>
              <div style={{
                fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#AAA",
                marginTop: "12px", letterSpacing: "0.1em",
              }}>unitedwespend.com</div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          <button onClick={() => onComplete(true, amount)} style={{
            background: C.teal, border: "none", padding: "14px 32px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "8px", color: "#FFFFFF",
            fontFamily: F.body, fontSize: "14px", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.06em",
          }}><ShareIcon /> Share</button>
          <button onClick={() => onComplete(false, amount)} style={{
            background: "transparent", border: `1px solid ${C.darkBorder}`,
            padding: "14px 24px", cursor: "pointer", color: C.darkMuted,
            fontFamily: F.body, fontSize: "14px", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.06em",
          }}>Done</button>
        </div>
      </div>
    );
  }

  return null;
}

// ─── COUNT UP COMPONENT ─────────────────────────────────────
function CountUp({ target, duration = 1500 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let current = 0;
    const steps = 40;
    const increment = target / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count.toLocaleString()}</>;
}

// ─── OPT-IN SCREEN ──────────────────────────────────────────
function OptInScreen({ onSubmit, onSkip, optedIn, didShare, spendAmount }) {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (phone.trim()) {
      setSubmitted(true);
      onSubmit(phone.trim());
      setTimeout(() => onSkip(), 1500);
    }
  };

  if (optedIn || submitted) {
    return (
      <div style={{ ...overlayBase, background: "rgba(15,23,42,0.97)", zIndex: 999 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: F.body, fontSize: "18px", fontWeight: 700,
            color: C.cyan, marginBottom: "24px",
          }}>✓ You're in. Good things coming.</div>
          <button onClick={onSkip} style={{
            background: C.teal, border: "none", padding: "14px 32px",
            cursor: "pointer", color: "#FFFFFF", fontFamily: F.body,
            fontSize: "14px", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}>Continue</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...overlayBase, background: "rgba(15,23,42,0.97)", zIndex: 999 }}>
      <div style={{ maxWidth: "420px", width: "100%", textAlign: "center" }}>
        {didShare ? (
          <>
            <div style={{
              fontFamily: F.display, fontSize: "32px", fontWeight: 700,
              color: C.darkText, marginBottom: "20px",
            }}>Legend. 😎</div>
            <div style={{
              fontFamily: F.body, fontSize: "16px", color: C.darkSecondary,
              lineHeight: 1.7, marginBottom: "16px",
            }}>When you shared, you showed everyone that there's another way to spend. Some of them will try it. Some of them will share it. That's how local businesses survive.</div>
            <div style={{
              fontFamily: F.body, fontSize: "16px", color: C.darkText,
              lineHeight: 1.7, marginBottom: "32px", fontStyle: "italic",
            }}>Keep it up. Your city notices.</div>
            <div style={{
              fontFamily: F.body, fontSize: "16px", color: C.darkSecondary, marginBottom: "20px",
            }}>Can we stay in touch? One text per week, max. Weekly reminders and giveaways.</div>
          </>
        ) : (
          <>
            <div style={{
              fontFamily: F.display, fontSize: "28px", fontWeight: 700,
              color: C.darkText, marginBottom: "20px", lineHeight: 1.2,
            }}>You didn't share but we still love you.</div>
            <div style={{
              fontFamily: F.body, fontSize: "16px", color: C.darkSecondary,
              lineHeight: 1.7, marginBottom: "16px",
            }}>
              ${spendAmount} at a local business? You totally nailed the important part.
            </div>
            <div style={{
              fontFamily: F.body, fontSize: "16px", color: C.darkSecondary,
              lineHeight: 1.7, marginBottom: "16px",
            }}>Do that once a week? That's ${(spendAmount * 52).toLocaleString()} a year that stays local. Multiply by everyone doing it? That's how economies actually change.</div>
            <div style={{
              fontFamily: F.body, fontSize: "16px", color: C.darkSecondary, marginBottom: "20px",
            }}>Can we stay in touch? One text per week, max. Weekly reminders and giveaways.</div>
          </>
        )}
        <div style={{
          display: "flex", maxWidth: "360px", margin: "0 auto",
          background: C.darkCard, border: `1px solid ${C.darkBorder}`, overflow: "hidden",
        }}>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="(612) 555-0000"
            style={{
              flex: 1, padding: "14px 16px", border: "none", outline: "none",
              fontFamily: F.body, fontSize: "15px", color: C.darkText, background: "transparent",
            }}
          />
          <button onClick={handleSubmit} style={{
            background: C.teal, border: "none", padding: "14px 24px",
            cursor: "pointer", color: "#FFFFFF", fontFamily: F.body,
            fontSize: "13px", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.06em", whiteSpace: "nowrap",
          }}>I'm In</button>
        </div>
        <button onClick={onSkip} style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: F.body, fontSize: "14px", color: C.darkMuted,
          marginTop: "20px", padding: "12px 24px",
        }}>{didShare ? "Maybe later" : "I'm good"}</button>
      </div>
    </div>
  );
}

// ─── LOCATION MODAL ─────────────────────────────────────────
function LocationModal({ onClose }) {
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email.trim()) { setSubmitted(true); setTimeout(() => onClose(), 2000); }
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", marginBottom: "12px",
    border: `1px solid ${C.darkBorder}`, outline: "none",
    background: C.darkCard, fontFamily: F.body, fontSize: "15px",
    color: C.darkText, boxSizing: "border-box",
  };

  return (
    <div style={{ ...overlayBase, background: "rgba(15,23,42,0.92)", backdropFilter: "blur(12px)" }}>
      <button onClick={onClose} style={{
        position: "absolute", top: "20px", right: "20px", background: "none",
        border: "none", cursor: "pointer", color: C.darkMuted, padding: "8px",
      }}><CloseIcon /></button>

      <div style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}>
        {submitted ? (
          <>
            <div style={{ fontFamily: F.display, fontSize: "28px", fontWeight: 700, color: C.darkText, marginBottom: "16px" }}>
              You're on the list. 🎉
            </div>
            <div style={{ fontFamily: F.body, fontSize: "16px", color: C.darkSecondary, lineHeight: 1.6 }}>
              We'll let you know when we launch near you.
            </div>
          </>
        ) : (
          <>
            <div style={{ fontFamily: F.display, fontSize: "28px", fontWeight: 700, color: C.darkText, marginBottom: "12px", lineHeight: 1.2 }}>
              We're in the Twin Cities. For now.
            </div>
            <div style={{ fontFamily: F.body, fontSize: "16px", color: C.darkSecondary, lineHeight: 1.6, marginBottom: "32px" }}>
              Not your city? Tell us where you are and we'll let you know when we get there.
            </div>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Your city or ZIP" style={inputStyle} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Email address" style={{ ...inputStyle, marginBottom: "20px" }}
            />
            <button onClick={handleSubmit} style={{
              width: "100%", background: C.teal, border: "none", padding: "14px 24px",
              cursor: "pointer", color: "#FFFFFF", fontFamily: F.body,
              fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
            }}>Let Me Know →</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── REQUEST MODAL ──────────────────────────────────────────
function RequestModal({ onClose }) {
  const [business, setBusiness] = useState("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email.trim()) { setSubmitted(true); setTimeout(() => onClose(), 2000); }
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", marginBottom: "12px",
    border: `1px solid ${C.darkBorder}`, outline: "none",
    background: C.darkCard, fontFamily: F.body, fontSize: "15px",
    color: C.darkText, boxSizing: "border-box",
  };

  return (
    <div style={{ ...overlayBase, background: "rgba(15,23,42,0.92)", backdropFilter: "blur(12px)" }}>
      <button onClick={onClose} style={{
        position: "absolute", top: "20px", right: "20px", background: "none",
        border: "none", cursor: "pointer", color: C.darkMuted, padding: "8px",
      }}><CloseIcon /></button>

      <div style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}>
        {submitted ? (
          <>
            <div style={{ fontFamily: F.display, fontSize: "28px", fontWeight: 700, color: C.darkText, marginBottom: "16px" }}>Got it. 👍</div>
            <div style={{ fontFamily: F.body, fontSize: "16px", color: C.darkSecondary, lineHeight: 1.6 }}>We'll let you know when we add it.</div>
          </>
        ) : (
          <>
            <div style={{ fontFamily: F.display, fontSize: "28px", fontWeight: 700, color: C.darkText, marginBottom: "12px", lineHeight: 1.2 }}>Help us build this.</div>
            <div style={{ fontFamily: F.body, fontSize: "16px", color: C.darkSecondary, lineHeight: 1.6, marginBottom: "32px" }}>Tell us what's missing and we'll add it.</div>
            <input type="text" value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Business name (optional)" style={inputStyle} />
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category (e.g., auto repair, bakery)" style={inputStyle} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Email address" style={{ ...inputStyle, marginBottom: "20px" }}
            />
            <button onClick={handleSubmit} style={{
              width: "100%", background: C.teal, border: "none", padding: "14px 24px",
              cursor: "pointer", color: "#FFFFFF", fontFamily: F.body,
              fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
            }}>Send Request →</button>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SPENDING THIS WEEK — replaces FAQ
// ═══════════════════════════════════════════════════════════
function SpendingThisWeek({ onRequestBusiness }) {
  const stats = getCommunityStats();
  const [visibleItems, setVisibleItems] = useState(4);

  const feedItems = [
    { neighborhood: "Cathedral Hill", business: "Claddagh Coffee", amount: 12, ago: "2m", tier: "local" },
    { neighborhood: "West 7th", business: "Mississippi Market", amount: 87, ago: "4m", tier: "local" },
    { neighborhood: "Midway", business: "Kowalski's", amount: 134, ago: "6m", tier: "union-local" },
    { neighborhood: "Como Park", business: "Lloyd's Pharmacy", amount: 28, ago: "11m", tier: "local" },
    { neighborhood: "Selby-Dale", business: "Dogwood Coffee", amount: 8, ago: "14m", tier: "local" },
    { neighborhood: "Highland Park", business: "Lunds & Byerlys", amount: 96, ago: "18m", tier: "union" },
    { neighborhood: "Payne-Phalen", business: "Green Goods", amount: 45, ago: "22m", tier: "union-local" },
    { neighborhood: "North End", business: "Cub Foods", amount: 112, ago: "31m", tier: "union" },
  ];

  const tierDot = (tier) => ({
    "union-local": C.teal,
    "union": C.tealDeep,
    "local": C.lightMuted,
  })[tier] || C.lightMuted;

  const localImpact = Math.round(stats.dollarsThisWeek * 0.73 * 4);
  const dollarsFormatted = stats.dollarsThisWeek >= 1000
    ? `$${(stats.dollarsThisWeek / 1000).toFixed(1)}K`
    : `$${stats.dollarsThisWeek}`;
  const impactFormatted = localImpact >= 1000
    ? `$${(localImpact / 1000).toFixed(0)}K`
    : `$${localImpact}`;

  return (
    <div style={{ marginBottom: "32px" }}>

      {/* ── 1. LIVE FEED ── */}
      <div style={{ marginBottom: "36px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          marginBottom: "14px",
        }}>
          <span style={{
            display: "inline-block", width: "7px", height: "7px",
            borderRadius: "50%", background: C.green,
            animation: "liveDot 1.5s ease infinite",
          }} />
          <span style={{
            fontFamily: F.body, fontSize: "12px", fontWeight: 700,
            color: C.green, textTransform: "uppercase", letterSpacing: "0.1em",
          }}>Live</span>
        </div>

        <h2 style={{
          fontFamily: F.display, fontSize: "22px", fontWeight: 700,
          color: C.lightText, margin: "0 0 16px 0",
          letterSpacing: "-0.01em",
        }}>Spending locally right now. NBD. 💅</h2>

        {feedItems.slice(0, visibleItems).map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "baseline", gap: "14px",
            padding: "14px 0",
            borderBottom: i < visibleItems - 1 ? `1px solid ${C.cardBorder}` : "none",
            animation: `slideUp 0.35s ease ${i * 0.06}s both`,
          }}>
            <div style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: tierDot(item.tier), flexShrink: 0,
              marginTop: "2px",
            }} />
            <div style={{ flex: 1 }}>
              <span style={{
                fontFamily: F.display, fontSize: "15px", fontWeight: 500,
                color: C.lightText, lineHeight: 1.5,
              }}>
                <span style={{ fontWeight: 700 }}>${item.amount}</span>
                {" → "}
                <span style={{ fontWeight: 600 }}>{item.business}</span>
              </span>
              <span style={{
                fontFamily: F.body, fontSize: "13px", color: C.lightMuted,
                marginLeft: "6px",
              }}>{item.neighborhood}</span>
            </div>
            <span style={{
              fontFamily: F.body, fontSize: "12px", color: C.lightMuted,
              flexShrink: 0,
            }}>{item.ago}</span>
          </div>
        ))}

        {visibleItems < feedItems.length && (
          <button onClick={() => setVisibleItems(feedItems.length)} style={{
            width: "100%", background: "none", border: "none",
            padding: "14px 0", cursor: "pointer",
            fontFamily: F.display, fontSize: "14px", fontWeight: 600,
            color: C.teal, textAlign: "left",
          }}>See more ↓</button>
        )}
      </div>

      {/* ── 2. STATS (dark boxes with accents) ── */}
      <div style={{ marginBottom: "36px" }}>
        <h3 style={{
          fontFamily: F.display, fontSize: "22px", fontWeight: 700,
          color: C.lightText, margin: "0 0 14px 0",
          letterSpacing: "-0.01em",
        }}>We see you, Twin Cities. You're having a week! 🔥</h3>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: "10px",
        }}>
          <div style={{
            background: C.dark, padding: "20px 14px", textAlign: "center",
            borderTop: `3px solid ${C.teal}`,
          }}>
            <div style={{
              fontFamily: F.display, fontSize: "28px", fontWeight: 800,
              color: C.cyan, lineHeight: 1,
            }}>{stats.peopleThisWeek}</div>
            <div style={{
              fontFamily: F.display, fontSize: "11px", fontWeight: 600,
              color: C.darkSecondary, marginTop: "6px",
              textTransform: "uppercase", letterSpacing: "0.04em",
            }}>shifted spending</div>
          </div>
          <div style={{
            background: C.dark, padding: "20px 14px", textAlign: "center",
            borderTop: `3px solid ${C.cyan}`,
          }}>
            <div style={{
              fontFamily: F.display, fontSize: "28px", fontWeight: 800,
              color: C.cyan, lineHeight: 1,
            }}>{dollarsFormatted}</div>
            <div style={{
              fontFamily: F.display, fontSize: "11px", fontWeight: 600,
              color: C.darkSecondary, marginTop: "6px",
              textTransform: "uppercase", letterSpacing: "0.04em",
            }}>kept local</div>
          </div>
          <div style={{
            background: C.dark, padding: "20px 14px", textAlign: "center",
            borderTop: `3px solid ${C.teal}`,
          }}>
            <div style={{
              fontFamily: F.display, fontSize: "28px", fontWeight: 800,
              color: C.cyan, lineHeight: 1,
            }}>{impactFormatted}</div>
            <div style={{
              fontFamily: F.display, fontSize: "11px", fontWeight: 600,
              color: C.darkSecondary, marginTop: "6px",
              textTransform: "uppercase", letterSpacing: "0.04em",
            }}>local impact</div>
          </div>
        </div>
      </div>

      {/* ── 3. MILESTONE ── */}
      <div style={{
        padding: "20px 24px",
        background: C.tealSubtle,
        marginBottom: "16px",
      }}>
        <div style={{
          fontFamily: F.display, fontSize: "16px", fontWeight: 600,
          color: C.lightText, lineHeight: 1.5, marginBottom: "12px",
        }}>
          ${stats.totalDollars.toLocaleString()} redirected since launch.{" "}
          <span style={{ color: C.teal }}>Next goal: $500K.</span>
        </div>
        <div style={{
          height: "5px", background: C.slate200,
          borderRadius: "3px", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", borderRadius: "3px",
            width: `${Math.min(100, (stats.totalDollars / 500000) * 100)}%`,
            background: `linear-gradient(90deg, ${C.teal}, ${C.cyan})`,
            animation: "barGrow 1.2s cubic-bezier(0.16, 1, 0.3, 1) both",
          }} />
        </div>
      </div>

      {/* Request */}
      <div style={{ textAlign: "center" }}>
        <button onClick={onRequestBusiness} style={{
          background: "none", border: "none", cursor: "pointer", padding: "8px 16px",
          fontFamily: F.display, fontSize: "14px", color: C.teal, fontWeight: 600,
        }}>Are we missing a local business? Let us know →</button>
      </div>
    </div>
  );
}

// ─── IMPACT DASHBOARD ───────────────────────────────────────
function ImpactDashboard({ userName, onClose }) {
  const mockData = {
    totalPowered: 12, businessesSupported: 6, streak: 4, topCategory: "Groceries",
    recentBusinesses: [
      { name: "Kowalski's Markets", count: 5, tier: "union-local" },
      { name: "Dogwood Coffee", count: 4, tier: "local" },
      { name: "Lloyd's Pharmacy", count: 2, tier: "local" },
      { name: "Green Goods", count: 1, tier: "union-local" },
    ],
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: C.light, zIndex: 1000, overflowY: "auto" }}>
      <header style={{ background: C.dark, borderBottom: `2px solid ${C.cyan}` }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: C.darkMuted,
            fontFamily: F.body, fontSize: "14px", cursor: "pointer",
          }}>← Back</button>
          <span style={{
            fontFamily: F.body, fontSize: "13px", fontWeight: 700,
            color: C.darkText, textTransform: "uppercase", letterSpacing: "0.08em",
          }}>Your Impact</span>
          <div style={{ width: "50px" }} />
        </div>
      </header>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontFamily: F.body, fontSize: "16px", color: C.lightSecondary, marginBottom: "8px" }}>
            Look at you, {userName}.
          </div>
          <div style={{ fontFamily: F.display, fontSize: "56px", fontWeight: 700, color: C.teal, lineHeight: 1 }}>
            {mockData.totalPowered}
          </div>
          <div style={{ fontFamily: F.body, fontSize: "18px", color: C.lightSecondary, marginTop: "8px" }}>
            local businesses powered
          </div>
          <div style={{ fontFamily: F.body, fontSize: "14px", color: C.lightMuted, marginTop: "4px", fontStyle: "italic" }}>
            Not all heroes wear capes. Some just shop local.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, padding: "24px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ fontFamily: F.body, fontSize: "36px", fontWeight: 900, color: C.teal }}>{mockData.businessesSupported}</div>
            <div style={{ fontFamily: F.body, fontSize: "14px", color: C.lightMuted }}>unique businesses</div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, padding: "24px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ fontFamily: F.body, fontSize: "36px", fontWeight: 900, color: C.teal }}>{mockData.streak}</div>
            <div style={{ fontFamily: F.body, fontSize: "14px", color: C.lightMuted }}>week streak 🔥</div>
          </div>
        </div>

        <div style={{ background: C.dark, padding: "24px", textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontFamily: F.body, fontSize: "14px", color: C.darkSecondary, marginBottom: "8px" }}>You're in the top</div>
          <div style={{ fontFamily: F.display, fontSize: "48px", fontWeight: 700, color: C.cyan }}>15%</div>
          <div style={{ fontFamily: F.body, fontSize: "14px", color: C.darkSecondary }}>of people powering the local economy</div>
          <div style={{ fontFamily: F.body, fontSize: "12px", color: C.darkMuted, marginTop: "8px", fontStyle: "italic" }}>At this rate, your neighborhood's getting a raise.</div>
        </div>

        <h2 style={{
          fontFamily: F.body, fontSize: "12px", fontWeight: 700, color: C.teal,
          textTransform: "uppercase", letterSpacing: "0.1em",
          margin: "0 0 16px 0", borderBottom: `2px solid ${C.teal}`, paddingBottom: "12px",
        }}>Businesses You've Powered</h2>

        {mockData.recentBusinesses.map((biz, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "16px 0", borderBottom: `1px solid ${C.cardBorder}`,
          }}>
            <div>
              <div style={{ fontFamily: F.body, fontSize: "16px", fontWeight: 600, color: C.lightText }}>{biz.name}</div>
              <span style={{
                fontSize: "10px", fontFamily: F.body, fontWeight: 700,
                color: biz.tier === "union-local" ? C.tierTopText : C.tierMidText,
                background: biz.tier === "union-local" ? C.tierTopBg : C.tierMidBg,
                padding: "2px 8px", textTransform: "uppercase",
              }}>{biz.tier === "union-local" ? "Union & Local" : "Local"}</span>
            </div>
            <div style={{ fontFamily: F.body, fontSize: "14px", fontWeight: 600, color: C.lightMuted }}>{biz.count}x</div>
          </div>
        ))}

        <button style={{
          width: "100%", background: C.teal, border: "none", padding: "16px", marginTop: "32px",
          fontFamily: F.body, fontSize: "14px", fontWeight: 700, color: "#FFFFFF",
          textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
        }}><ShareIcon /> Share Your Impact</button>
      </div>
    </div>
  );
}

// ─── BUSINESS CARD ──────────────────────────────────────────
function BusinessCard({ business, onCommit, committed }) {
  const tierStyle = TIER_STYLES[business.tier];
  const businessKey = `${business.name}-${business.address}`;

  return (
    <div style={{
      background: C.card, border: `1px solid ${C.cardBorder}`,
      borderLeft: `3px solid ${committed ? C.teal : tierStyle.border}`,
      padding: "20px 24px", marginBottom: "12px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.2s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ fontFamily: F.body, fontSize: "17px", fontWeight: 700, color: C.lightText, margin: "0 0 5px 0" }}>
            {business.name}
          </h3>
          <div style={{
            display: "flex", alignItems: "center", gap: "5px",
            color: C.lightSecondary, fontSize: "14px", fontFamily: F.body, marginBottom: "10px",
          }}>
            <MapPinIcon size={12} />{business.address}
          </div>
        </div>
        <span style={{ fontFamily: F.body, fontSize: "13px", fontWeight: 600, color: C.lightMuted }}>
          {business.distance}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "4px",
          background: tierStyle.badge, color: tierStyle.badgeText,
          fontSize: "10px", fontFamily: F.body, fontWeight: 700,
          padding: "4px 10px", textTransform: "uppercase", letterSpacing: "0.06em",
        }}>
          {business.tier === "union-local" && <><ShieldIcon /><HomeIcon /></>}
          {business.tier === "union" && <ShieldIcon />}
          {business.tier === "local" && <HomeIcon />}
          {tierStyle.label}
        </span>
        <span style={{
          display: "inline-flex", background: C.slate100, color: C.lightMuted,
          fontSize: "10px", fontFamily: F.body, fontWeight: 600,
          padding: "4px 10px", textTransform: "uppercase", letterSpacing: "0.05em",
        }}>{business.type}</span>
        {business.union && (
          <span style={{ fontSize: "12px", fontFamily: F.body, color: C.tealDeep, fontStyle: "italic" }}>
            {business.union}
          </span>
        )}
      </div>

      <button onClick={() => onCommit(businessKey, business)} style={{
        width: "100%",
        background: committed ? C.teal : "transparent",
        border: `2px solid ${C.teal}`,
        padding: "10px 16px", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
        color: committed ? "#FFFFFF" : C.teal,
        fontFamily: F.body, fontSize: "13px", fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.06em",
        transition: "all 0.2s ease",
      }}>
        {committed ? <><CheckIcon /> Powered — Tap to Share</> : <><FlagIcon /> I'm Shopping Here</>}
      </button>
    </div>
  );
}

// ─── TIER LEGEND ────────────────────────────────────────────
function TierLegend() {
  return (
    <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
      {TIER_ORDER.map((tier) => {
        const style = TIER_STYLES[tier];
        return (
          <div key={tier} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "12px", height: "12px",
              background: tier === "union-local" ? C.teal : "transparent",
              border: `2px solid ${style.border}`,
            }} />
            <span style={{
              fontFamily: F.body, fontSize: "12px", fontWeight: 700,
              color: C.lightText, textTransform: "uppercase", letterSpacing: "0.04em",
            }}>{style.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────
export default function UnitedWeSpend() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [commitments, setCommitments] = useState({});
  const [commitFlowBusiness, setCommitFlowBusiness] = useState(null);
  const [showOptIn, setShowOptIn] = useState(false);
  const [didShare, setDidShare] = useState(false);
  const [lastSpendAmount, setLastSpendAmount] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [optedIn, setOptedIn] = useState(false);
  const [showTierInfo, setShowTierInfo] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { setTimeout(() => setHeroVisible(true), 100); }, []);

  const handleSearch = () => {
    if (query.trim()) { setResults(matchBusinesses(query)); setSearched(true); }
  };
  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

  const quickSearches = [
    ["Coffee", "Groceries", "Hardware", "CBD/Cannabis"],
    ["Pharmacy", "Fitness", "Banking"],
  ];

  const handleQuickSearch = (term) => {
    setQuery(term);
    setResults(matchBusinesses(term));
    setSearched(true);
    setTimeout(() => { window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' }); }, 100);
  };

  const handleCommit = (key, business) => {
    if (commitments[key]) {
      // Already committed — re-open commit flow to share again
      setCommitFlowBusiness(business);
    } else {
      setCommitments((prev) => ({ ...prev, [key]: business }));
      setCommitFlowBusiness(business);
    }
  };

  const handleCommitFlowComplete = (shared, amount) => {
    setCommitFlowBusiness(null);
    setDidShare(shared);
    setLastSpendAmount(amount || 0);
  };

  const handleCommitFlowClose = () => {
    setCommitFlowBusiness(null);
  };

  const handleOptIn = (phone) => { setOptedIn(true); };
  const handleOptInClose = () => { setShowOptIn(false); setDidShare(false); };

  return (
    <div style={{ minHeight: "100vh", background: C.light, fontFamily: F.body }}>
      <style>{GLOBAL_CSS}</style>

      {/* Overlays */}
      {commitFlowBusiness && (
        <CommitFlow
          business={commitFlowBusiness}
          onComplete={handleCommitFlowComplete}
          onClose={handleCommitFlowClose}
        />
      )}
      {showOptIn && (
        <OptInScreen
          optedIn={optedIn}
          onSubmit={handleOptIn}
          onSkip={handleOptInClose}
          didShare={didShare}
          spendAmount={lastSpendAmount}
        />
      )}
      {showDashboard && <ImpactDashboard userName="Sarah" onClose={() => setShowDashboard(false)} />}
      {showLocationModal && <LocationModal onClose={() => setShowLocationModal(false)} />}
      {showRequestModal && <RequestModal onClose={() => setShowRequestModal(false)} />}

      {/* ─── HEADER (DARK) ─── */}
      <header style={{ background: C.dark, borderBottom: `2px solid ${C.cyan}` }}>
        <div style={{
          maxWidth: "800px", margin: "0 auto", padding: "14px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <button
            onClick={() => { setSearched(false); setResults([]); setQuery(""); setCommitments({}); setCommitFlowBusiness(null); setShowOptIn(false); setDidShare(false); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: F.display, fontSize: "18px", fontWeight: 700,
              color: C.darkText, letterSpacing: "-0.01em", textTransform: "uppercase",
            }}
          >United We <span style={{ color: C.cyan }}>Spend</span></button>
          <button onClick={() => setShowLocationModal(true)} style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "none", border: `1px solid ${C.cyan}44`,
            cursor: "pointer", padding: "5px 10px", color: C.cyan,
          }}>
            <MapPinIcon size={12} />
            <span style={{ fontFamily: F.body, fontSize: "12px", fontWeight: 700 }}>Twin Cities, MN</span>
            <span style={{ fontSize: "9px", opacity: 0.7 }}>▼</span>
          </button>
        </div>
      </header>

      {/* ─── HERO (DARK GRADIENT) ─── */}
      <div style={{
        background: C.dark, padding: "56px 24px 48px", textAlign: "center",
        opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(-10px)",
        transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <h1 style={{
            fontFamily: F.display, fontSize: "clamp(28px, 6vw, 46px)",
            fontWeight: 700, color: C.darkText, lineHeight: 1.1,
            margin: "0 0 20px 0", letterSpacing: "-0.03em",
          }}>
            Your money has power.<br /><span style={{ color: C.cyan }}>Use it.</span>
          </h1>

          <p style={{
            fontFamily: F.body, fontSize: "17px", color: C.darkSecondary,
            lineHeight: 1.6, margin: "0 0 28px 0", maxWidth: "500px",
            marginLeft: "auto", marginRight: "auto",
          }}>
            Search local. Keep your money where you live.
          </p>

          {/* Search bar */}
          <div style={{
            display: "flex", maxWidth: "520px", margin: "0 auto",
            background: C.card, overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            border: `1px solid rgba(255,255,255,0.1)`,
          }}>
            <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What do you need? (groceries, pharmacy, CBD...)"
              style={{
                flex: 1, padding: "16px 20px", border: "none", outline: "none",
                fontFamily: F.body, fontSize: "15px", color: C.lightText, background: "transparent",
              }}
            />
            <button onClick={handleSearch} style={{
              background: C.teal, border: "none", padding: "16px 24px",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", color: "#FFFFFF",
            }}><SearchIcon /></button>
          </div>

          {/* Quick search pills */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center", marginTop: "16px", alignItems: "center" }}>
            {quickSearches.map((row, ri) => (
              <div key={ri} style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
                {ri === 0 && (
                  <span style={{
                    fontFamily: F.body, fontSize: "11px", fontWeight: 700,
                    color: C.darkMuted, textTransform: "uppercase",
                    letterSpacing: "0.08em", marginRight: "4px",
                  }}>Quick Search:</span>
                )}
                {row.map((term) => (
                  <button key={term} onClick={() => handleQuickSearch(term)} style={{
                    background: C.darkCard, border: `1px solid ${C.darkBorder}`,
                    color: C.darkSecondary, padding: "6px 14px", fontFamily: F.body,
                    fontSize: "13px", fontWeight: 600, cursor: "pointer",
                    transition: "border-color 0.2s ease",
                  }}>{term}</button>
                ))}
              </div>
            ))}
          </div>

          {/* Tier info link */}
          <div style={{ marginTop: "14px", textAlign: "center" }}>
            <button onClick={() => setShowTierInfo(!showTierInfo)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: F.body, fontSize: "12px", fontWeight: 600,
              color: C.darkSecondary, display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "4px 8px", transition: "color 0.2s ease",
            }}>
              <ShieldIcon size={11} />
              How we rate businesses
              <span style={{
                fontSize: "10px", transition: "transform 0.2s ease",
                transform: showTierInfo ? "rotate(180deg)" : "rotate(0deg)",
              }}>▼</span>
            </button>

            {showTierInfo && (
              <div style={{
                maxWidth: "420px", margin: "12px auto 0", textAlign: "left",
                animation: "fadeUp 0.3s ease",
              }}>
                <div style={{
                  fontFamily: F.body, fontSize: "13px", color: C.darkSecondary,
                  marginBottom: "10px", paddingBottom: "8px",
                  borderBottom: `1px solid ${C.darkBorder}`,
                  textAlign: "center",
                }}>Businesses rated on local economic impact</div>
                {TIER_ORDER.map((tier) => {
                  const style = TIER_STYLES[tier];
                  return (
                    <div key={tier} style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "8px 0", borderBottom: `1px solid ${C.darkBorder}`,
                    }}>
                      <div style={{
                        minWidth: "110px", display: "inline-flex", alignItems: "center", gap: "4px",
                        background: style.badge, color: style.badgeText, fontSize: "10px",
                        fontFamily: F.body, fontWeight: 700, padding: "4px 10px",
                        textTransform: "uppercase", letterSpacing: "0.06em", justifyContent: "center",
                      }}>
                        {tier === "union-local" && <><ShieldIcon size={11} /><HomeIcon size={11} /></>}
                        {tier === "union" && <ShieldIcon size={11} />}
                        {tier === "local" && <HomeIcon size={11} />}
                        {style.label}
                      </div>
                      <span style={{ fontFamily: F.body, fontSize: "12px", color: C.darkSecondary, lineHeight: 1.4 }}>
                        {style.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── BODY (LIGHT) ─── */}
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 24px 64px" }}>
        {searched && results.length > 0 && (
          <>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              marginBottom: "16px", borderBottom: `2px solid ${C.teal}`, paddingBottom: "12px",
            }}>
              <h2 style={{
                fontFamily: F.body, fontSize: "12px", fontWeight: 700, color: C.teal,
                textTransform: "uppercase", letterSpacing: "0.1em", margin: 0,
              }}>
                {results.length} {results.length === 1 ? "Business" : "Businesses"} Found
              </h2>
              <span style={{ fontFamily: F.body, fontSize: "13px", color: C.lightMuted, fontStyle: "italic" }}>St. Paul, MN</span>
            </div>
            <TierLegend />
            {results.map((business) => (
              <BusinessCard
                key={`${business.name}-${business.address}`}
                business={business}
                onCommit={handleCommit}
                committed={!!commitments[`${business.name}-${business.address}`]}
              />
            ))}
            <div style={{
              background: C.tealSubtle, border: `1px solid ${C.cardBorder}`,
              padding: "20px 24px", marginTop: "24px", textAlign: "center",
            }}>
              <p style={{
                fontFamily: F.body, fontSize: "15px", color: C.lightSecondary,
                margin: "0 0 4px 0", lineHeight: 1.5,
              }}>Every purchase is a choice. You just chose your community.</p>
              <p style={{
                fontFamily: F.body, fontSize: "12px", color: C.teal, margin: 0,
                fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
              }}>Your money has power. Use it.</p>
            </div>
          </>
        )}

        {searched && results.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 24px" }}>
            <p style={{ fontFamily: F.body, fontSize: "18px", color: C.lightSecondary, marginBottom: "8px" }}>
              We're still building our directory for that category.
            </p>
            <p style={{ fontFamily: F.body, fontSize: "15px", color: C.lightMuted }}>
              Try searching for groceries, pharmacy, hardware, or CBD & wellness.
            </p>
          </div>
        )}

        {!searched && (
          <SpendingThisWeek onRequestBusiness={() => setShowRequestModal(true)} />
        )}
      </div>

      {/* ─── FOOTER (DARK) ─── */}
      <footer style={{ background: C.dark, borderTop: `2px solid ${C.cyan}`, padding: "32px 24px", textAlign: "center" }}>
        <div style={{
          fontFamily: F.body, fontSize: "13px", fontWeight: 700,
          color: C.darkText, textTransform: "uppercase",
          letterSpacing: "0.06em", marginBottom: "12px", lineHeight: 1.6,
        }}>Your money has power. Use it.</div>
        <div style={{ height: "1px", background: C.darkBorder, maxWidth: "200px", margin: "0 auto 12px" }} />
        <p style={{
          fontFamily: F.body, fontSize: "13px", color: "rgba(255,255,255,0.5)",
          margin: "0", letterSpacing: "0.05em",
        }}>
          A project of The Human Variable, LLC &middot; [ <span style={{ color: C.cyan }}>x</span> = human ]
        </p>
      </footer>
    </div>
  );
}
