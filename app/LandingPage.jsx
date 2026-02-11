"use client";
import { useState, useEffect, useRef } from "react";

// ─── PALETTE ────────────────────────────────────────────────
const C = {
  bg: "#080B11",
  bgAlt: "#0C1018",
  bgCard: "#111620",
  cyan: "#22D3EE",
  teal: "#0891B2",
  tealDeep: "#0E7490",
  white: "#FFFFFF",
  secondary: "rgba(255,255,255,0.6)",
  muted: "rgba(255,255,255,0.3)",
  faint: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.06)",
};

// ─── SCROLL REVEAL HOOK ─────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function RevealBlock({ children, delay = 0, style = {} }) {
  const [ref, visible] = useReveal(0.12);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(40px)",
      transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

// ─── COUNTER ANIMATION ──────────────────────────────────────
function AnimatedNumber({ target, prefix = "", suffix = "", color = C.cyan }) {
  const [ref, visible] = useReveal(0.3);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let current = 0;
    const steps = 50;
    const increment = target / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 30);
    return () => clearInterval(timer);
  }, [visible, target]);

  return (
    <span ref={ref} style={{
      fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
      fontWeight: 700, color,
      fontSize: "clamp(64px, 14vw, 96px)",
      lineHeight: 1,
      letterSpacing: "-0.04em",
    }}>{prefix}{visible ? count.toLocaleString() : "0"}{suffix}</span>
  );
}

// ─── MAIN LANDING PAGE ──────────────────────────────────────
export default function UWSLanding() {
  const [heroReady, setHeroReady] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [rippleStep, setRippleStep] = useState(0);
  const rippleRef = useRef(null);
  const rippleStarted = useRef(false);

  useEffect(() => { setTimeout(() => setHeroReady(true), 200); }, []);

  // Ripple scroll trigger
  useEffect(() => {
    const el = rippleRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !rippleStarted.current) { rippleStarted.current = true; setRippleStep(1); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Ripple step timer
  useEffect(() => {
    if (rippleStep > 0 && rippleStep < 5) {
      const t = setTimeout(() => setRippleStep(s => s + 1), 1200);
      return () => clearTimeout(t);
    }
  }, [rippleStep]);

  return (
    <div style={{ background: C.bg, color: C.white, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes ringExpand {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes ringPulseAnim {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.03); }
        }
        @keyframes dropIn {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes ripplePulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.08); }
        }
        @keyframes labelPop {
          0% { transform: translateX(-50%) scale(0.5); opacity: 0; }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }
      `}</style>

      {/* ─── NAV ─── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(8,11,17,0.8)", backdropFilter: "blur(20px)",
        borderBottom: `2px solid ${C.cyan}`,
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto", padding: "16px 32px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "18px", fontWeight: 700, color: C.white,
            textTransform: "uppercase", letterSpacing: "-0.01em",
          }}>United We <span style={{ color: C.cyan }}>Spend</span></span>
          <a href="/search" style={{
            fontFamily: "'Outfit', sans-serif", fontSize: "13px",
            fontWeight: 700, color: C.bg, background: C.cyan,
            padding: "10px 24px", textDecoration: "none",
            textTransform: "uppercase", letterSpacing: "0.06em",
            transition: "background 0.2s ease",
          }}>Find Local →</a>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "120px 32px 80px", position: "relative",
        textAlign: "center",
      }}>
        {/* Subtle radial glow */}
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "600px",
          background: `radial-gradient(ellipse, ${C.teal}08 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div style={{
          opacity: heroReady ? 1 : 0,
          transform: heroReady ? "translateY(0)" : "translateY(30px)",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: "13px",
            fontWeight: 600, color: C.cyan,
            textTransform: "uppercase", letterSpacing: "0.2em",
            marginBottom: "32px",
          }}>Your money has power</div>

          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
            fontSize: "clamp(72px, 15vw, 140px)",
            fontWeight: 700, lineHeight: 0.95,
            letterSpacing: "-0.04em",
            margin: "0 0 32px 0",
            maxWidth: "900px",
          }}>
            <span style={{ color: C.white }}>Use</span>{" "}
            <span style={{ color: C.cyan }}>it.</span>
          </h1>
        </div>

        <div style={{
          opacity: heroReady ? 1 : 0,
          transform: heroReady ? "translateY(0)" : "translateY(20px)",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
        }}>
          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: "clamp(18px, 3vw, 22px)",
            color: C.secondary, lineHeight: 1.6,
            maxWidth: "560px", margin: "0 auto 48px",
          }}>
            The economy isn't broken. It was designed to work for corporations, not people. We built a tool to change that.
          </p>

          <a href="/search" style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            fontFamily: "'Outfit', sans-serif", fontSize: "16px",
            fontWeight: 700, color: C.bg, background: C.cyan,
            padding: "18px 40px", textDecoration: "none",
            textTransform: "uppercase", letterSpacing: "0.06em",
            transition: "all 0.2s ease",
            boxShadow: `0 0 40px ${C.teal}33`,
          }}>Find Local Businesses →</a>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: "40px", left: "50%",
          transform: "translateX(-50%)",
          opacity: heroReady ? 1 : 0,
          transition: "opacity 1.5s ease 1s",
        }}>
          <div style={{
            width: "1px", height: "48px", background: `linear-gradient(180deg, ${C.cyan}, transparent)`,
            margin: "0 auto 8px",
            animation: "pulse 2s ease infinite",
          }} />
          <span style={{
            fontFamily: "'Outfit', sans-serif", fontSize: "10px",
            color: C.muted, textTransform: "uppercase", letterSpacing: "0.15em",
          }}>Scroll</span>
        </div>
      </section>

      {/* ─── THE STAT ─── */}
      <section style={{
        padding: "120px 32px", textAlign: "center",
        background: C.bgAlt,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <RevealBlock>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: "13px",
            fontWeight: 600, color: C.cyan,
            textTransform: "uppercase", letterSpacing: "0.2em",
            marginBottom: "24px",
          }}>The Problem</div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
            fontSize: "clamp(32px, 7vw, 48px)",
            fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em",
            color: C.white, margin: "0",
          }}>Every time you shop at a chain...</h2>
        </RevealBlock>

        <RevealBlock delay={0.15}>
          <div style={{ marginBottom: "24px" }}>
            <AnimatedNumber target={73} suffix="¢" />
          </div>
        </RevealBlock>

        <RevealBlock delay={0.3}>
          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "clamp(22px, 3.5vw, 28px)",
            color: C.secondary, lineHeight: 1.5,
            maxWidth: "600px", margin: "0 auto",
          }}>
            of every dollar <span style={{ color: C.white, fontWeight: 600 }}>leaves your community</span> and never comes back.
          </p>
        </RevealBlock>
      </section>

      {/* ─── THE MATH ─── */}
      <section ref={rippleRef} style={{ padding: "120px 32px", background: C.bgAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <RevealBlock>
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontSize: "13px",
              fontWeight: 600, color: C.cyan,
              textTransform: "uppercase", letterSpacing: "0.2em",
              marginBottom: "24px",
            }}>The Solution</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
              fontSize: "clamp(40px, 8vw, 56px)",
              fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em",
              maxWidth: "700px", margin: "0 auto",
            }}>Spend $100 locally:<br /><span style={{ color: C.cyan }}>it circulates.</span></h2>
          </div>
        </RevealBlock>

        {/* Ripple Visualization */}
        <div style={{
          position: "relative",
          width: "min(420px, 92vw)", height: "min(420px, 92vw)",
          margin: "48px auto 0",
        }}>
          {/* Background glow */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "130%", height: "130%", borderRadius: "50%",
            background: `radial-gradient(circle, ${C.teal}22 0%, transparent 70%)`,
            pointerEvents: "none",
            animation: rippleStep >= 1 ? "glowPulse 3s ease-in-out infinite" : "none",
            opacity: rippleStep >= 1 ? undefined : 0,
          }} />

          {/* Rings */}
          {[
            { amount: 100, label: "Your purchase" },
            { amount: 200, label: "2nd circulation" },
            { amount: 300, label: "3rd circulation" },
            { amount: 400, label: "4th circulation" },
            { amount: 500, label: "5th circulation" },
          ].reverse().map((ring, ri) => {
            const i = 4 - ri;
            const sizes = [22, 38, 55, 72, 90];
            const size = sizes[i];
            const active = rippleStep >= i + 1;
            const opacity = 1 - i * 0.2;
            const borderWidth = Math.max(1, 2.5 - i * 0.4);

            return active ? (
              <div key={i} style={{
                position: "absolute", top: "50%", left: "50%",
                width: `${size}%`, height: `${size}%`,
                borderRadius: "50%",
                border: `${borderWidth}px solid ${C.cyan}`,
                opacity: opacity,
                animation: `ringExpand 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, ringPulseAnim 4s ease-in-out 0.8s infinite`,
              }} />
            ) : null;
          })}

          {/* Center $73 */}
          {rippleStep >= 1 && (
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              width: "22%", height: "22%", borderRadius: "50%",
              background: `radial-gradient(circle, ${C.teal}66 0%, ${C.teal}22 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transform: "translate(-50%, -50%)",
              animation: "dropIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, ripplePulse 2.5s ease-in-out 0.7s infinite",
            }}>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(20px, 4.5vw, 28px)",
                fontWeight: 800, color: C.white,
              }}>$100</div>
            </div>
          )}

          {/* Amount labels on rings */}
          {[200, 300, 400, 500].map((amount, i) => {
            const active = rippleStep >= i + 2;
            if (!active) return null;
            const sizes = [22, 38, 55, 72, 90];
            const ringSize = sizes[i + 1];
            const topPercent = 50 - ringSize / 2;

            return (
              <div key={`label-${i}`} style={{
                position: "absolute",
                top: `${topPercent}%`, left: "50%",
                transform: "translateX(-50%)",
                animation: "labelPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                animationDelay: "0.2s",
                opacity: 0,
                zIndex: 10,
              }}>
                <div style={{
                  padding: "5px 14px",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "clamp(14px, 3vw, 18px)",
                    fontWeight: 700, color: C.cyan,
                  }}>${amount}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div style={{
          marginTop: "48px", textAlign: "center",
          opacity: rippleStep >= 5 ? 1 : 0,
          transform: rippleStep >= 5 ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.8s ease",
        }}>
          <p style={{
            fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
            fontSize: "clamp(20px, 4vw, 28px)",
            fontWeight: 700, color: C.white, marginBottom: "8px",
          }}>
            One purchase. <span style={{ color: C.cyan }}>Five ripples. $500</span> in local impact.
          </p>
          <p style={{
            textAlign: "center", maxWidth: "600px", margin: "32px auto 0",
            fontFamily: "'Outfit', sans-serif", fontSize: "20px",
            color: C.white, lineHeight: 1.6, fontWeight: 600,
          }}>
            Now multiply that by everyone using this app and the economy starts to work for all of us.
          </p>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ padding: "120px 32px", background: C.bgAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <RevealBlock>
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontSize: "13px",
              fontWeight: 600, color: C.cyan,
              textTransform: "uppercase", letterSpacing: "0.2em",
              marginBottom: "16px",
            }}>How it works</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
              fontSize: "clamp(40px, 8vw, 56px)",
              fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em",
            }}>Three taps. That's it.</h2>
          </div>
        </RevealBlock>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "32px", maxWidth: "900px", margin: "0 auto",
        }}>
          {[
            { num: "01", title: "Search", desc: "Type what you need. Groceries, pharmacy, coffee, hardware — whatever." },
            { num: "02", title: "Choose", desc: "See local and union businesses ranked by how much your dollar does for your community." },
            { num: "03", title: "Share", desc: "Tap \"I'm Shopping Here.\" Tell your people. The more who join, the bigger the shift." },
          ].map((step, i) => (
            <RevealBlock key={i} delay={i * 0.15}>
              <div style={{ padding: "8px 0" }}>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "48px", fontWeight: 700, color: `${C.cyan}55`,
                  lineHeight: 1, marginBottom: "16px",
                }}>{step.num}</div>
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "24px", fontWeight: 600, color: C.white,
                  marginBottom: "12px",
                }}>{step.title}</h3>
                <p style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: "15px",
                  color: C.secondary, lineHeight: 1.6,
                }}>{step.desc}</p>
              </div>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section id="cta" style={{
        padding: "120px 32px",
        textAlign: "center",
        position: "relative",
        borderTop: `1px solid ${C.border}`,
        background: `linear-gradient(180deg, ${C.bgAlt} 0%, ${C.bg} 100%)`,
      }}>
        {/* Glow */}
        <div style={{
          position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "400px",
          background: `radial-gradient(ellipse, ${C.teal}0C 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <RevealBlock>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: "13px",
            fontWeight: 600, color: C.cyan,
            textTransform: "uppercase", letterSpacing: "0.2em",
            marginBottom: "24px",
          }}>Now live in the Twin Cities</div>
        </RevealBlock>

        <RevealBlock delay={0.15}>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
            fontSize: "clamp(44px, 10vw, 72px)",
            fontWeight: 700, lineHeight: 1,
            letterSpacing: "-0.04em",
            margin: "0 0 24px 0",
          }}>
            Keep more of your money<br />
            <span style={{ color: C.cyan }}>where you live.</span>
          </h2>
        </RevealBlock>

        <RevealBlock delay={0.3}>
          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: "18px",
            color: C.secondary, maxWidth: "480px", margin: "0 auto 40px",
            lineHeight: 1.6,
          }}>
            Find local and union businesses in Minneapolis and St. Paul. Free. No account needed.
          </p>

          <a href="/search" style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            fontFamily: "'Outfit', sans-serif", fontSize: "17px",
            fontWeight: 700, color: C.bg, background: C.cyan,
            padding: "20px 48px", textDecoration: "none",
            textTransform: "uppercase", letterSpacing: "0.06em",
            boxShadow: `0 0 60px ${C.teal}33`,
            transition: "all 0.2s ease",
          }}>Start Searching →</a>
        </RevealBlock>
      </section>

      {/* ─── WHERE NEXT ─── */}
      <section style={{
        padding: "120px 32px",
        textAlign: "center",
        background: C.bgAlt,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <RevealBlock>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: "13px",
            fontWeight: 600, color: C.cyan,
            textTransform: "uppercase", letterSpacing: "0.2em",
            marginBottom: "24px",
          }}>Expanding soon</div>
        </RevealBlock>

        <RevealBlock delay={0.15}>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
            fontSize: "clamp(44px, 10vw, 72px)",
            fontWeight: 700, lineHeight: 1,
            letterSpacing: "-0.04em",
            margin: "0 0 16px 0",
          }}>
            Where should we<br /><span style={{ color: C.cyan }}>go next?</span>
          </h2>
        </RevealBlock>

        <RevealBlock delay={0.3}>
          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: "18px",
            color: C.secondary, maxWidth: "480px", margin: "0 auto 48px",
            lineHeight: 1.6,
          }}>
            Vote for your city. We'll build where the demand is.
          </p>
        </RevealBlock>

        <RevealBlock delay={0.4}>
          {emailSubmitted ? (
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontSize: "20px",
              color: C.cyan, fontWeight: 600, padding: "24px 0",
            }}>✓ Vote counted. We'll let you know when we get there.</div>
          ) : (
            <div style={{ maxWidth: "480px", margin: "0 auto" }}>
              <input type="text" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}
                placeholder="Your city"
                style={{
                  width: "100%", padding: "16px 20px", marginBottom: "12px",
                  border: `1px solid ${C.border}`, outline: "none",
                  background: C.bgCard, fontFamily: "'Outfit', sans-serif",
                  fontSize: "16px", color: C.white, boxSizing: "border-box",
                }}
              />
              <div style={{
                display: "flex", overflow: "hidden",
                border: `1px solid ${C.border}`,
              }}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && email.trim() && selectedCity && setEmailSubmitted(true)}
                  placeholder="Email for notification"
                  style={{
                    flex: 1, padding: "16px 20px", border: "none", outline: "none",
                    background: C.bgCard, fontFamily: "'Outfit', sans-serif",
                    fontSize: "16px", color: C.white,
                  }}
                />
                <button onClick={() => email.trim() && selectedCity && setEmailSubmitted(true)} style={{
                  background: C.teal, border: "none", padding: "16px 32px",
                  cursor: "pointer", color: "#FFFFFF", fontFamily: "'Outfit', sans-serif",
                  fontSize: "14px", fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.06em", whiteSpace: "nowrap",
                }}>Vote</button>
              </div>
            </div>
          )}
        </RevealBlock>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        borderTop: `2px solid ${C.cyan}`,
        padding: "40px 32px", textAlign: "center",
      }}>
        <div style={{
          fontFamily: "'Outfit', sans-serif", fontSize: "13px",
          fontWeight: 700, color: C.white,
          textTransform: "uppercase", letterSpacing: "0.06em",
          marginBottom: "16px",
        }}>Your money has power. Use it.</div>
        <div style={{
          height: "1px", background: C.border,
          maxWidth: "200px", margin: "0 auto 16px",
        }} />
        <p style={{
          fontFamily: "'Outfit', sans-serif", fontSize: "13px",
          color: "rgba(255,255,255,0.5)", margin: "0", letterSpacing: "0.05em",
        }}>
          A project of The Human Variable, LLC · [ <span style={{ color: C.cyan }}>x</span> = human ]
        </p>
      </footer>
    </div>
  );
}
