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
      fontSize: "clamp(48px, 12vw, 96px)",
      lineHeight: 1,
      letterSpacing: "-0.04em",
    }}>{prefix}{visible ? count.toLocaleString() : "0"}{suffix}</span>
  );
}

// ─── FAQ ────────────────────────────────────────────────────
function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    { q: "How does this work?", a: "Search for what you need. See local and union options ranked by how much your dollar does for your community. Tap \"I'm Shopping Here\" to commit and share." },
    { q: "Does this actually make a difference?", a: "When you spend $100 at a local business, roughly $73 stays in your community. Spend that same $100 at a national retail chain, and only $27 stays. Do that once a week, and you've redirected over $2,300 a year back into your neighborhood. Now multiply that by everyone using this app." },
    { q: "Is this political?", a: "No. It's economics. This isn't about who you vote for, it's about where your money goes. And you get to decide that right here and right now." },
    { q: "What's the catch?", a: "No catch. 73 cents of every dollar leaves your community. That's a problem worth solving. We can't change that but you can." },
  ];

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      {faqs.map((item, i) => (
        <RevealBlock key={i} delay={i * 0.08}>
          <div style={{ borderBottom: `1px solid ${C.border}` }}>
            <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
              style={{
                width: "100%", padding: "22px 0", background: "none", border: "none",
                cursor: "pointer", display: "flex", justifyContent: "space-between",
                alignItems: "center", textAlign: "left", gap: "16px",
              }}>
              <span style={{
                fontFamily: "'Outfit', sans-serif", fontSize: "17px",
                fontWeight: 600, color: C.white,
              }}>{item.q}</span>
              <span style={{
                fontFamily: "'Outfit', sans-serif", fontSize: "24px",
                fontWeight: 300, color: C.cyan, flexShrink: 0,
                transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
                transition: "transform 0.25s ease",
              }}>+</span>
            </button>
            <div style={{
              maxHeight: openIndex === i ? "300px" : "0",
              overflow: "hidden",
              transition: "max-height 0.4s ease",
            }}>
              <p style={{
                fontFamily: "'Outfit', sans-serif", fontSize: "15px",
                color: C.secondary, lineHeight: 1.7, padding: "0 0 22px 0", margin: 0,
              }}>{item.a}</p>
            </div>
          </div>
        </RevealBlock>
      ))}
    </div>
  );
}

// ─── MAIN LANDING PAGE ──────────────────────────────────────
export default function UWSLanding() {
  const [heroReady, setHeroReady] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => { setTimeout(() => setHeroReady(true), 200); }, []);

  return (
    <div style={{ background: C.bg, color: C.white, minHeight: "100vh", overflowX: "hidden" }}>

      {/* ─── NAV ─── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(8,11,17,0.8)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border}`,
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
            fontSize: "clamp(52px, 11vw, 140px)",
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
            fontFamily: "'Outfit', sans-serif", fontSize: "clamp(17px, 2.5vw, 22px)",
            color: C.secondary, lineHeight: 1.6,
            maxWidth: "560px", margin: "0 auto 48px",
          }}>
            The economy isn't broken. It's working exactly the way it was designed to. Just not for you. We built a tool to change that.
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
            fontWeight: 600, color: C.white,
            textTransform: "uppercase", letterSpacing: "0.2em",
            marginBottom: "24px",
          }}>Every time you shop at a chain</div>
        </RevealBlock>

        <RevealBlock delay={0.15}>
          <div style={{ marginBottom: "24px" }}>
            <AnimatedNumber target={73} suffix="¢" />
          </div>
        </RevealBlock>

        <RevealBlock delay={0.3}>
          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "clamp(20px, 3vw, 28px)",
            color: C.secondary, lineHeight: 1.5,
            maxWidth: "600px", margin: "0 auto",
          }}>
            of every dollar <span style={{ color: C.white, fontWeight: 600 }}>leaves your community</span> and never comes back.
          </p>
        </RevealBlock>
      </section>

      {/* ─── THE FLIP ─── */}
      <section style={{
        padding: "120px 32px", textAlign: "center",
        borderTop: `1px solid ${C.border}`,
      }}>
        <RevealBlock>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: "13px",
            fontWeight: 600, color: C.white,
            textTransform: "uppercase", letterSpacing: "0.2em",
            marginBottom: "24px",
          }}>But when you spend local</div>
        </RevealBlock>

        <RevealBlock delay={0.15}>
          <div style={{
            fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
            fontSize: "clamp(48px, 10vw, 96px)",
            fontWeight: 700, color: C.cyan,
            lineHeight: 1, letterSpacing: "-0.04em",
            marginBottom: "24px",
          }}>3–5x</div>
        </RevealBlock>

        <RevealBlock delay={0.3}>
          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "clamp(20px, 3vw, 28px)",
            color: C.secondary, lineHeight: 1.5,
            maxWidth: "600px", margin: "0 auto",
          }}>
            That same dollar <span style={{ color: C.white, fontWeight: 600 }}>circulates 3–5x through your neighborhood</span> before it leaves. More jobs. More tax base. Better city.
          </p>
        </RevealBlock>
      </section>

      {/* ─── THE MATH ─── */}
      <section style={{ padding: "120px 32px", background: C.bgAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <RevealBlock>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontSize: "13px",
              fontWeight: 600, color: C.cyan,
              textTransform: "uppercase", letterSpacing: "0.2em",
              marginBottom: "16px",
            }}>The math is simple</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
              fontSize: "clamp(32px, 6vw, 56px)",
              fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em",
              maxWidth: "700px", margin: "0 auto",
            }}>Same groceries. Different outcome.</h2>
          </div>
        </RevealBlock>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px", maxWidth: "800px", margin: "0 auto",
        }}>
          <RevealBlock delay={0.1}>
            <div style={{
              background: C.bgCard, border: `1px solid ${C.border}`,
              padding: "40px 32px", textAlign: "center",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: "3px", background: C.muted,
              }} />
              <div style={{
                fontFamily: "'Outfit', sans-serif", fontSize: "12px",
                fontWeight: 700, color: C.muted,
                textTransform: "uppercase", letterSpacing: "0.15em",
                marginBottom: "24px",
              }}>National Retail Chain</div>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "64px", fontWeight: 700, color: C.muted,
                lineHeight: 1, marginBottom: "8px",
              }}>$27</div>
              <div style={{
                fontFamily: "'Outfit', sans-serif", fontSize: "15px",
                color: C.muted, lineHeight: 1.5,
              }}>stays in your community<br />per $100 spent</div>
            </div>
          </RevealBlock>

          <RevealBlock delay={0.25}>
            <div style={{
              background: C.bgCard, border: `1px solid ${C.cyan}22`,
              padding: "40px 32px", textAlign: "center",
              position: "relative", overflow: "hidden",
              boxShadow: `0 0 60px ${C.teal}0A`,
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: "3px", background: C.cyan,
              }} />
              <div style={{
                fontFamily: "'Outfit', sans-serif", fontSize: "12px",
                fontWeight: 700, color: C.cyan,
                textTransform: "uppercase", letterSpacing: "0.15em",
                marginBottom: "24px",
              }}>Local Retail Business</div>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "64px", fontWeight: 700, color: C.cyan,
                lineHeight: 1, marginBottom: "8px",
              }}>$73</div>
              <div style={{
                fontFamily: "'Outfit', sans-serif", fontSize: "15px",
                color: C.secondary, lineHeight: 1.5,
              }}>stays in your community<br />per $100 spent</div>
            </div>
          </RevealBlock>
        </div>

        <RevealBlock delay={0.4}>
          <p style={{
            textAlign: "center", maxWidth: "600px", margin: "48px auto 0",
            fontFamily: "'Outfit', sans-serif", fontSize: "18px",
            color: C.secondary, lineHeight: 1.6,
          }}>
            Do that once a week and you've redirected <span style={{ color: C.cyan, fontWeight: 700 }}>over $2,300 a year</span> back into your neighborhood.
            And because local dollars circulate 3–5 times before they leave, that $2,300 generates up to <span style={{ color: C.cyan, fontWeight: 700 }}>$11,500 in local economic activity</span>.
          </p>
        </RevealBlock>

        <RevealBlock delay={0.55}>
          <p style={{
            textAlign: "center", maxWidth: "600px", margin: "32px auto 0",
            fontFamily: "'Outfit', sans-serif", fontSize: "20px",
            color: C.white, lineHeight: 1.6, fontWeight: 600,
          }}>
            Now multiply that by everyone using this app and the economy starts to work for all of us.
          </p>
        </RevealBlock>
      </section>

      {/* ─── THE COST OF CONVENIENCE ─── */}
      <section style={{
        padding: "120px 32px",
        borderTop: `1px solid ${C.border}`,
      }}>
        <RevealBlock>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontSize: "13px",
              fontWeight: 600, color: C.cyan,
              textTransform: "uppercase", letterSpacing: "0.2em",
              marginBottom: "16px",
            }}>The cost of convenience</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
              fontSize: "clamp(32px, 6vw, 56px)",
              fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em",
              maxWidth: "700px", margin: "0 auto",
            }}>
              Convenience isn't free.<br />You just pay for it later.<br /><span style={{ color: C.cyan }}>And you pay extra.</span>
            </h2>
          </div>
        </RevealBlock>

        <RevealBlock delay={0.2}>
          <p style={{
            textAlign: "center", maxWidth: "620px", margin: "0 auto",
            fontFamily: "'Outfit', sans-serif", fontSize: "18px",
            color: C.secondary, lineHeight: 1.8,
          }}>
            Every dollar that flows to a chain instead of a local business is a job that doesn't get created and a tax dollar that doesn't get collected. Your city still needs funding, so it borrows from the state. The state borrows from the feds. Every layer adds bureaucracy, inefficiency, and politicians rewarding the corporations that funded their campaigns. By the time that money makes it back to your street, most of it is gone.
          </p>
        </RevealBlock>

        <RevealBlock delay={0.4}>
          <p style={{
            textAlign: "center", maxWidth: "620px", margin: "48px auto 0",
            fontFamily: "'Outfit', sans-serif", fontSize: "18px",
            color: C.white, lineHeight: 1.7, fontWeight: 600,
          }}>
            The system made the extractive option the easy option. We're here to make the local option just as easy.
          </p>
        </RevealBlock>
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
              fontSize: "clamp(32px, 6vw, 56px)",
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

      {/* ─── FAQ ─── */}
      <section style={{ padding: "120px 32px" }}>
        <RevealBlock>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontSize: "13px",
              fontWeight: 600, color: C.cyan,
              textTransform: "uppercase", letterSpacing: "0.2em",
              marginBottom: "16px",
            }}>FAQ</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
              fontSize: "clamp(32px, 6vw, 48px)",
              fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em",
            }}>Questions you might have.</h2>
          </div>
        </RevealBlock>
        <FAQ />
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
            fontSize: "clamp(36px, 8vw, 72px)",
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
            Search local and union businesses in St. Paul and Minneapolis. Free. No account needed.
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
            fontSize: "clamp(36px, 8vw, 72px)",
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
