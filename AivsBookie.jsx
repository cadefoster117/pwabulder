import { useState, useEffect } from "react";

const TOKEN = "c856e7f4def835bb1b2e448e6ccda8b47ed188ac";
const BASE = "https://sports.bzzoiro.com/api";

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Syne:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#030a05;--bg2:#050f08;--bg3:#081510;--bg4:#0a1c12;
  --bdr:#0e2016;--bdr2:#163024;
  --g1:#00e676;--g2:#00c853;--g3:#00ff87;
  --ga:rgba(0,230,118,0.12);--gb:rgba(0,230,118,0.06);
  --t1:#e2f9ee;--t2:#7eb893;--t3:#3a6449;--t4:#1e3c2a;
  --red:#ff5252;--yel:#ffd740;--ora:#ff9040;--pur:#b388ff;
}
body{background:var(--bg);color:var(--t1);font-family:'Syne',sans-serif;-webkit-font-smoothing:antialiased;}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--bdr2);border-radius:2px;}

@keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes glowPulse{0%,100%{text-shadow:0 0 8px rgba(0,230,118,0.4);}50%{text-shadow:0 0 24px rgba(0,230,118,0.9),0 0 40px rgba(0,230,118,0.3);}}
@keyframes scanLine{0%{top:-2px;}100%{top:100%;}}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0.2;}}
@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
@keyframes progressFill{from{width:0%;}to{width:var(--target);}}
@keyframes hexFade{0%,100%{opacity:0.03;}50%{opacity:0.07;}}
@keyframes matrixDrop{0%{transform:translateY(-8px);opacity:0;}20%{opacity:0.6;}80%{opacity:0.6;}100%{transform:translateY(8px);opacity:0;}}

.fade-up{animation:fadeUp 0.45s ease both;}
.fade-in{animation:fadeIn 0.3s ease both;}
.glow{animation:glowPulse 2.5s ease infinite;}

.nav-btn{
  background:none;border:none;cursor:pointer;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:3px;flex:1;padding:9px 4px;
  border-top:2px solid transparent;
  transition:all 0.2s;color:var(--t4);
  font-family:'Orbitron',monospace;font-size:8px;letter-spacing:1.5px;font-weight:600;
}
.nav-btn.on{border-top-color:var(--g1);color:var(--g1);}
.nav-btn:hover:not(.on){color:var(--t3);}

.card{
  background:var(--bg2);
  border:1px solid var(--bdr);
  border-radius:13px;
  overflow:hidden;
  transition:border-color 0.2s,transform 0.15s;
}
.card:hover{border-color:var(--bdr2);}

.pbar{height:3px;background:var(--bdr);border-radius:2px;overflow:hidden;}
.pbar-fill{height:100%;border-radius:2px;transition:width 1.4s cubic-bezier(0.4,0,0.2,1);}

.chip{display:inline-flex;align-items:center;border-radius:6px;padding:3px 9px;font-size:9px;font-weight:700;border:1px solid;letter-spacing:0.8px;white-space:nowrap;}
.chip-g{background:rgba(0,230,118,0.12);color:var(--g1);border-color:rgba(0,230,118,0.35);}
.chip-y{background:rgba(255,215,64,0.1);color:var(--yel);border-color:rgba(255,215,64,0.3);}
.chip-r{background:rgba(255,82,82,0.1);color:var(--red);border-color:rgba(255,82,82,0.3);}
.chip-o{background:rgba(255,144,64,0.1);color:var(--ora);border-color:rgba(255,144,64,0.3);}
.chip-dim{background:var(--bdr);color:var(--t3);border-color:var(--bdr2);}

.filter-btn{
  background:var(--bg2);color:var(--t4);border:1px solid var(--bdr);
  border-radius:7px;padding:5px 11px;font-size:9px;
  font-family:'Orbitron',monospace;font-weight:700;letter-spacing:1px;
  cursor:pointer;white-space:nowrap;transition:all 0.15s;
}
.filter-btn:hover{color:var(--t2);border-color:var(--bdr2);}
.filter-btn.active-g{background:rgba(0,230,118,0.15);color:var(--g1);border-color:rgba(0,230,118,0.4);}
.filter-btn.active-y{background:rgba(255,215,64,0.12);color:var(--yel);border-color:rgba(255,215,64,0.35);}
.filter-btn.active-r{background:rgba(255,82,82,0.12);color:var(--red);border-color:rgba(255,82,82,0.35);}
.filter-btn.active-d{background:var(--ga);color:var(--g1);border-color:rgba(0,230,118,0.3);}

.retry-btn{
  background:var(--g1);color:var(--bg);border:none;border-radius:9px;
  padding:11px 28px;font-family:'Orbitron',monospace;font-weight:700;font-size:11px;
  letter-spacing:1.5px;cursor:pointer;transition:all 0.2s;
}
.retry-btn:hover{background:var(--g2);transform:translateY(-1px);}
`;

/* ─── helpers ─────────────────────────────────────────────────────────────── */
const fmt = (n, d = 2) => (n != null && !isNaN(parseFloat(n))) ? parseFloat(n).toFixed(d) : "—";
const fmtTime = iso => { try { return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); } catch { return "TBD"; } };
const fmtDate = iso => { try { return new Date(iso).toLocaleDateString("en-GB", { weekday: "short", month: "short", day: "numeric" }); } catch { return ""; } };
const riskCls = r => r === "LOW" ? "chip chip-g" : r === "MEDIUM" ? "chip chip-y" : "chip chip-r";
const scoreColor = s => s >= 80 ? "#00e676" : s >= 65 ? "#ffd740" : "#ff9040";

/* ─── Logo ────────────────────────────────────────────────────────────────── */
function Logo({ sm }) {
  const sz = sm ? 26 : 34;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={sz} height={sz} viewBox="0 0 34 34" fill="none">
        <rect width="34" height="34" rx="7" fill="#04100a"/>
        <rect x="0.75" y="0.75" width="32.5" height="32.5" rx="6.25" stroke="#00e676" strokeWidth="1.5"/>
        <rect x="10" y="10" width="14" height="14" rx="2" stroke="#00e676" strokeWidth="1.2" fill="none"/>
        <rect x="13.5" y="13.5" width="7" height="7" rx="1" fill="#00e676" opacity="0.18"/>
        <circle cx="17" cy="17" r="2.2" fill="#00e676"/>
        <line x1="0.75" y1="17" x2="9.5" y2="17" stroke="#00e676" strokeWidth="1.5"/>
        <line x1="24.5" y1="17" x2="33.25" y2="17" stroke="#00e676" strokeWidth="1.5"/>
        <line x1="17" y1="0.75" x2="17" y2="9.5" stroke="#00e676" strokeWidth="1.5"/>
        <line x1="17" y1="24.5" x2="17" y2="33.25" stroke="#00e676" strokeWidth="1.5"/>
        <circle cx="10" cy="10" r="1.5" fill="#00e676" opacity="0.55"/>
        <circle cx="24" cy="10" r="1.5" fill="#00e676" opacity="0.55"/>
        <circle cx="10" cy="24" r="1.5" fill="#00e676" opacity="0.55"/>
        <circle cx="24" cy="24" r="1.5" fill="#00e676" opacity="0.55"/>
        <line x1="10" y1="10" x2="10" y2="5" stroke="#00e676" strokeWidth="1" opacity="0.35"/>
        <line x1="24" y1="10" x2="24" y2="5" stroke="#00e676" strokeWidth="1" opacity="0.35"/>
        <line x1="10" y1="24" x2="10" y2="29" stroke="#00e676" strokeWidth="1" opacity="0.35"/>
        <line x1="24" y1="24" x2="24" y2="29" stroke="#00e676" strokeWidth="1" opacity="0.35"/>
      </svg>
      {!sm && (
        <span style={{ fontFamily: "'Orbitron',monospace", letterSpacing: 1, lineHeight: 1, fontSize: 16 }}>
          <span style={{ color: "#00e676", fontWeight: 900 }}>Ai</span>
          <span style={{ color: "#7eb893", fontWeight: 400, fontSize: 14 }}>vs</span>
          <span style={{ color: "#e2f9ee", fontWeight: 700 }}>Bookie</span>
        </span>
      )}
    </div>
  );
}

/* ─── Loading Screen ─────────────────────────────────────────────────────── */
const STEPS = ["Connecting...", "Fetching fixtures...", "Processing predictions...", "AI analysis...", "Building accas..."];
function Loading({ step }) {
  const idx = STEPS.findIndex(s => step.toLowerCase().includes(s.toLowerCase().split("...")[0]));
  const activeIdx = idx < 0 ? 0 : idx;
  const matrixVals = ["prob_home:0.72","conf:87","model:v4.1","edge:+0.14","risk:LOW","o25:0.58","btts:0.44","val:+0.09","form:A","h2h:2-1"];
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32, padding: 24, position: "relative", overflow: "hidden" }}>
      {/* BG grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,230,118,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,230,118,0.04) 1px,transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }}/>
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", inset: -12, borderRadius: "50%", border: "1px dashed rgba(0,230,118,0.2)", animation: "spin 8s linear infinite" }}/>
          <Logo />
        </div>
        <div style={{ textAlign: "center" }}>
          <div className="glow" style={{ fontFamily: "'Orbitron',monospace", color: "#00e676", fontSize: 10, letterSpacing: 4, marginBottom: 12 }}>
            MULTI-MODEL AI ANALYSIS
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 12, color: "#7eb893", letterSpacing: 0.5 }}>{step}</div>
        </div>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ width: i <= activeIdx ? 22 : 7, height: 7, borderRadius: 4, background: i <= activeIdx ? "#00e676" : "#0e2016", transition: "all 0.5s ease", boxShadow: i === activeIdx ? "0 0 8px #00e676" : "none" }}/>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 8px", maxWidth: 300, justifyContent: "center" }}>
          {matrixVals.map((v, i) => (
            <span key={i} style={{ fontFamily: "monospace", fontSize: 9, color: "#1a3d26", animation: `matrixDrop ${1.5 + i * 0.3}s ease infinite`, animationDelay: `${i * 0.2}s` }}>{v}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Pick Card ──────────────────────────────────────────────────────────── */
function PickCard({ pick, rank, delay = 0 }) {
  const { home_team, away_team, league, country, kickoff, composite_score, best_bet, odds, reasoning, risk_level, prob_home_win, prob_draw, prob_away_win, model_votes } = pick;
  const isTop = rank <= 3;
  const sc = parseFloat(composite_score) || 70;
  const sColor = scoreColor(sc);
  const modelMap = { probability: "PROB", value: "VAL", confidence: "CONF", composite: "COMP", p: "PROB", v: "VAL", c: "CONF", m: "COMP" };

  return (
    <div className="card fade-up" style={{ animationDelay: `${delay}s`, ...(isTop ? { boxShadow: "0 0 24px rgba(0,230,118,0.06)", borderColor: "rgba(0,230,118,0.22)" } : {}) }}>
      {/* Top accent */}
      <div style={{ height: 2, background: isTop ? `linear-gradient(90deg,${sColor},transparent)` : "linear-gradient(90deg,#0e2016,transparent)" }}/>
      <div style={{ padding: "12px 14px 14px" }}>
        {/* Row 1: rank + datetime + score */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontFamily: "'Orbitron',monospace", fontSize: 9, color: isTop ? "#00e676" : "#3a6449", letterSpacing: 1, fontWeight: 700 }}>#{rank}</span>
            <span style={{ fontSize: 10, color: "#3a6449" }}>{fmtDate(kickoff)} · {fmtTime(kickoff)}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 26, fontWeight: 900, color: sColor, lineHeight: 1, textShadow: `0 0 16px ${sColor}55` }}>{sc}</div>
            <div style={{ fontSize: 8, color: "#3a6449", letterSpacing: 1.5 }}>AI SCORE</div>
          </div>
        </div>
        {/* Teams */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#e2f9ee" }}>{home_team}</div>
          <div style={{ fontSize: 10, color: "#3a6449", margin: "3px 0 3px 0" }}>vs</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#e2f9ee" }}>{away_team}</div>
          <div style={{ fontSize: 10, color: "#7eb893", marginTop: 5 }}>
            {league}{country ? ` · ${country}` : ""}
          </div>
        </div>
        {/* Prediction chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          <span className="chip" style={{ background: "rgba(0,230,118,0.15)", color: "#00e676", borderColor: "rgba(0,230,118,0.45)", fontFamily: "'Orbitron',monospace", fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>
            {best_bet}
          </span>
          <span className="chip chip-o" style={{ fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: 11 }}>
            @ {fmt(odds)}
          </span>
          <span className={riskCls(risk_level)} style={{ fontFamily: "'Orbitron',monospace", letterSpacing: 1 }}>
            {risk_level}
          </span>
        </div>
        {/* Prob bars */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[
            { l: "HOME", v: prob_home_win, c: "#00e676" },
            { l: "DRAW", v: prob_draw, c: "#7eb893" },
            { l: "AWAY", v: prob_away_win, c: "#ffd740" },
          ].map(({ l, v, c }) => (
            <div key={l}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, letterSpacing: 1, color: "#3a6449", marginBottom: 4 }}>
                <span>{l}</span>
                <span style={{ color: c, fontWeight: 700 }}>{fmt(v, 0)}%</span>
              </div>
              <div className="pbar">
                <div className="pbar-fill" style={{ width: `${Math.min(100, parseFloat(v) || 0)}%`, background: c }} />
              </div>
            </div>
          ))}
        </div>
        {/* Model votes */}
        {model_votes && Object.keys(model_votes).length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
            {Object.entries(model_votes).map(([k, v]) => {
              const isMatch = String(v).includes(best_bet?.split(" ")[0]) || v === best_bet;
              return (
                <span key={k} style={{ background: "#040d08", border: "1px solid #0e2016", borderRadius: 4, padding: "2px 7px", fontSize: 8, color: isMatch ? "#00e676" : "#3a6449", fontFamily: "monospace", letterSpacing: 0.5 }}>
                  {modelMap[k] || k}: <span style={{ fontWeight: 700 }}>{String(v).replace(" Win", "").replace("Home", "H").replace("Away", "A")}</span>
                </span>
              );
            })}
          </div>
        )}
        {/* Reasoning */}
        <div style={{ fontSize: 11, color: "#7eb893", lineHeight: 1.65, borderTop: "1px solid #0e2016", paddingTop: 10 }}>
          {reasoning}
        </div>
      </div>
    </div>
  );
}

/* ─── Acca Card ──────────────────────────────────────────────────────────── */
function AccaCard({ title, subtitle, icon, acca, headerGrad, oddsColor }) {
  if (!acca) return (
    <div className="card" style={{ padding: 24, textAlign: "center" }}>
      <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 10, color: "#3a6449", letterSpacing: 2 }}>BUILDING...</div>
    </div>
  );
  const { label, combined_odds, picks = [] } = acca;
  return (
    <div className="card fade-up">
      <div style={{ background: headerGrad, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "40%", background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.2))" }}/>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 24, marginBottom: 5 }}>{icon}</div>
          <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: 12, color: "#fff", letterSpacing: 1.5 }}>{title}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>{label || subtitle}</div>
        </div>
        <div style={{ textAlign: "right", position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1, textShadow: `0 0 20px ${oddsColor}88` }}>
            {fmt(combined_odds)}
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, marginTop: 3 }}>COMBINED ODDS</div>
        </div>
      </div>
      <div style={{ padding: "10px 12px" }}>
        {picks.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 9px", background: i % 2 === 0 ? "#040d08" : "transparent", borderRadius: 8, marginBottom: 3 }}>
            <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#e2f9ee", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {p.home_team} <span style={{ color: "#3a6449" }}>vs</span> {p.away_team}
              </div>
              <div style={{ fontSize: 9, color: "#7eb893", marginTop: 2, letterSpacing: 0.5 }}>{p.bet || p.best_bet}</div>
            </div>
            <span style={{ fontFamily: "'Orbitron',monospace", fontSize: 13, fontWeight: 700, color: oddsColor, whiteSpace: "nowrap" }}>
              {fmt(p.odds)}
            </span>
          </div>
        ))}
      </div>
      <div style={{ padding: "8px 12px 10px", borderTop: "1px solid #0e2016", display: "flex", justifyContent: "space-between", fontSize: 9, color: "#3a6449", letterSpacing: 0.8 }}>
        <span>{picks.length} selections</span>
        <span>AI · Refreshed daily</span>
      </div>
    </div>
  );
}

/* ─── Live Page ──────────────────────────────────────────────────────────── */
function LivePage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ts, setTs] = useState(null);
  const load = async () => {
    try {
      const r = await fetch(`${BASE}/live/`, { headers: { Authorization: `Token ${TOKEN}` } });
      if (r.ok) { const d = await r.json(); setGames(d.results || d || []); }
    } catch {}
    setLoading(false);
    setTs(new Date());
  };
  useEffect(() => { load(); const t = setInterval(load, 60000); return () => clearInterval(t); }, []);
  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontFamily: "'Orbitron',monospace", fontSize: 15, fontWeight: 700, letterSpacing: 1 }}>
          LIVE <span style={{ color: "#ff5252", animation: "glowPulse 1.5s infinite" }}>NOW</span>
        </h1>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <div style={{ fontSize: 11, color: "#7eb893" }}>Real-time scores · Auto-updates 60s</div>
          {ts && <div style={{ fontSize: 10, color: "#3a6449", fontFamily: "monospace" }}>{ts.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</div>}
        </div>
      </div>
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, fontFamily: "'Orbitron',monospace", fontSize: 10, color: "#3a6449", letterSpacing: 2 }}>LOADING...</div>
      ) : games.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>⚽</div>
          <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 12, color: "#3a6449", letterSpacing: 3 }}>NO LIVE MATCHES</div>
          <div style={{ fontSize: 11, color: "#3a6449", marginTop: 10, lineHeight: 1.7 }}>Check back during match times.<br/>Live scores appear here automatically.</div>
          <button onClick={load} style={{ marginTop: 20, background: "transparent", border: "1px solid #163024", borderRadius: 8, color: "#7eb893", fontFamily: "'Orbitron',monospace", fontSize: 9, letterSpacing: 1.5, padding: "8px 18px", cursor: "pointer" }}>↻ REFRESH</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {games.map((g, i) => (
            <div key={g.id || i} className="card fade-up" style={{ animationDelay: `${i * 0.04}s`, padding: "12px 14px" }}>
              <div style={{ fontSize: 9, color: "#7eb893", marginBottom: 8, letterSpacing: 0.5 }}>{g.league?.name}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#e2f9ee" }}>{g.home_team}</div>
                </div>
                <div style={{ textAlign: "center", minWidth: 80 }}>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 22, fontWeight: 900, color: "#00e676" }}>
                    {g.home_score ?? 0} <span style={{ color: "#3a6449" }}>—</span> {g.away_score ?? 0}
                  </div>
                  <div style={{ fontSize: 9, color: "#ff5252", letterSpacing: 2, animation: "blink 1.4s infinite", marginTop: 3 }}>
                    {g.minute ? `${g.minute}'` : "● LIVE"}
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#e2f9ee" }}>{g.away_team}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ─── Main App ────────────────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("picks");
  const [picks, setPicks] = useState([]);
  const [accas, setAccas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState("Connecting...");
  const [error, setError] = useState(null);
  const [updated, setUpdated] = useState(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = GLOBAL_CSS;
    document.head.appendChild(s);
    return () => s.remove();
  }, []);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const d1 = now.toISOString().split("T")[0];
      const d2 = new Date(now.getTime() + 48 * 36e5).toISOString().split("T")[0];
      const hdrs = { Authorization: `Token ${TOKEN}`, Accept: "application/json" };

      setStep("Fetching fixtures...");
      const [evR, prR] = await Promise.all([
        fetch(`${BASE}/events/?date_from=${d1}&date_to=${d2}&status=notstarted`, { headers: hdrs }),
        fetch(`${BASE}/predictions/?upcoming=true`, { headers: hdrs }),
      ]);

      if (!evR.ok) throw new Error(`Events API: ${evR.status} ${evR.statusText}`);
      if (!prR.ok) throw new Error(`Predictions API: ${prR.status} ${prR.statusText}`);

      setStep("Processing predictions...");
      const [evD, prD] = await Promise.all([evR.json(), prR.json()]);
      const events = evD.results || [];
      const preds = prD.results || [];

      const pmap = {};
      preds.forEach(p => {
        const eid = p.event?.id ?? p.event_id ?? null;
        if (eid != null) pmap[eid] = p;
      });

      let games = events
        .filter(e => pmap[e.id])
        .map(e => {
          const p = pmap[e.id];
          const od = e.odds || {};
          return {
            id: e.id,
            home: e.home_team, away: e.away_team,
            league: e.league?.name || "Unknown", country: e.league?.country || "",
            ko: e.event_date,
            o1: od.home ?? od["1"] ?? e.odds_home ?? e.odd_1 ?? null,
            ox: od.draw ?? od.x ?? e.odds_draw ?? e.odd_x ?? null,
            o2: od.away ?? od["2"] ?? e.odds_away ?? e.odd_2 ?? null,
            o25: od.over_25 ?? e.odds_over_25 ?? e.over_25 ?? null,
            u25: od.under_25 ?? e.odds_under_25 ?? e.under_25 ?? null,
            btts: od.btts_yes ?? e.odds_btts ?? null,
            ph: p.prob_home_win, pd: p.prob_draw, pa: p.prob_away_win,
            po: p.prob_over_25, pb: p.prob_btts_yes,
            conf: p.confidence, pred: p.predicted_result,
          };
        })
        .slice(0, 70);

      if (games.length < 5) {
        games = preds.slice(0, 60).map(p => ({
          id: p.event?.id, home: p.event?.home_team || "Home", away: p.event?.away_team || "Away",
          league: p.event?.league?.name || "Unknown", country: p.event?.league?.country || "",
          ko: p.event?.event_date || new Date().toISOString(),
          o1: null, ox: null, o2: null, o25: null, u25: null, btts: null,
          ph: p.prob_home_win, pd: p.prob_draw, pa: p.prob_away_win,
          po: p.prob_over_25, pb: p.prob_btts_yes, conf: p.confidence, pred: p.predicted_result,
        }));
      }

      await runAnalysis(games);
      setUpdated(new Date());
      setLoading(false);
    } catch (err) {
      setError(err.message.includes("Failed to fetch")
        ? "Could not reach the sports data API. Please check your connection and try again."
        : err.message);
      setLoading(false);
    }
  }

  async function runAnalysis(games) {
    setStep("AI analysis...");
    const picksPrompt = `You are AivsBookie's elite AI prediction engine. Analyze ${games.length} football matches and select the TOP 15-20 best predictions using 4 models simultaneously:

MODEL 1 – PROBABILITY: Highest win/draw/loss probability margin (prefer outcomes >60%)
MODEL 2 – VALUE: Find bets where ML probability > bookmaker implied probability (value bets)
MODEL 3 – CONFIDENCE: Prioritize high confidence scores (>50), reject weak signals
MODEL 4 – COMPOSITE: Combine all signals into a final reliability score

MATCH DATA:
${JSON.stringify(games)}

Return ONLY raw JSON (absolutely no markdown, no code fences, no explanation):
{"picks":[{"event_id":1,"home_team":"Arsenal","away_team":"Chelsea","league":"Premier League","country":"England","kickoff":"2026-03-29T15:00:00","composite_score":87,"best_bet":"Home Win","odds":1.85,"reasoning":"Arsenal hold 72% win probability driven by strong home form. Market odds offer genuine value against the ML edge.","risk_level":"LOW","prob_home_win":72.0,"prob_draw":18.0,"prob_away_win":10.0,"model_votes":{"probability":"Home Win","value":"Home Win","confidence":"Home Win","composite":"Home Win"}}]}

STRICT RULES:
- best_bet MUST be one of: "Home Win","Away Win","Draw","Over 2.5","Under 2.5","BTTS Yes"
- risk_level MUST be one of: "LOW","MEDIUM","HIGH"
- Sort picks by composite_score DESC
- composite_score: integer 1-100
- If odds are null, estimate: odds = round(100 / prob * 1.08, 2)
- reasoning: max 2 sentences
- Include 15-20 picks only`;

    const pr = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{ role: "user", content: picksPrompt }],
      }),
    });
    const pj = await pr.json();
    const pt = (pj.content || []).map(b => b.text || "").join("").replace(/```json|```/gi, "").trim();
    const pd = JSON.parse(pt);
    const topPicks = pd.picks || [];
    setPicks(topPicks);

    setStep("Building accas...");
    const accaPrompt = `Build 4 football accumulator bets from these top picks:
${JSON.stringify(topPicks.map(p => ({ id: p.event_id, h: p.home_team, a: p.away_team, bet: p.best_bet, odds: p.odds, score: p.composite_score, risk: p.risk_level })))}

Return ONLY raw JSON (no code fences, no markdown):
{"safe2":{"label":"Safe Double","combined_odds":2.1,"picks":[{"event_id":1,"home_team":"Arsenal","away_team":"Chelsea","bet":"Home Win","odds":1.45},{"event_id":2,"home_team":"Bayern","away_team":"Dortmund","bet":"Home Win","odds":1.55}]},"safe5":{"label":"Safety Fivefold","combined_odds":5.3,"picks":[...4-5 picks...]},"safe10":{"label":"Power Acca","combined_odds":10.4,"picks":[...5-7 picks...]},"big":{"label":"Big Bang Parlay","combined_odds":38.5,"picks":[...7-10 picks...]}}

RULES:
- safe2: exactly 2-3 LOW risk picks, combined_odds between 1.8-2.5
- safe5: 4-5 LOW or MEDIUM picks, combined_odds between 4.5-6.0
- safe10: 5-7 picks, combined_odds between 8-13
- big: 7-10 picks including MEDIUM/HIGH, combined_odds between 30-50
- combined_odds = product of all individual odds (recalculate precisely)
- Include FULL home_team and away_team names (not abbreviations)
- Only use picks from the provided list`;

    const ar = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: accaPrompt }],
      }),
    });
    const aj = await ar.json();
    const at = (aj.content || []).map(b => b.text || "").join("").replace(/```json|```/gi, "").trim();
    setAccas(JSON.parse(at));
  }

  const filtered = filter === "ALL" ? picks : picks.filter(p => p.risk_level === filter);
  const lowCount = picks.filter(p => p.risk_level === "LOW").length;
  const medCount = picks.filter(p => p.risk_level === "MEDIUM").length;
  const highCount = picks.filter(p => p.risk_level === "HIGH").length;

  if (loading) return <Loading step={step} />;

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22, padding: 28, position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,230,118,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,230,118,0.03) 1px,transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }}/>
      <Logo />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "'Orbitron',monospace", color: "#ff5252", fontSize: 11, letterSpacing: 2.5, marginBottom: 10 }}>CONNECTION ERROR</div>
        <div style={{ fontSize: 12, color: "#7eb893", maxWidth: 300, lineHeight: 1.7 }}>{error}</div>
      </div>
      <button className="retry-btn" onClick={loadAll}>↻ RETRY</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* BG grid */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(0,230,118,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,230,118,0.025) 1px,transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none", zIndex: 0 }}/>

      {/* Header */}
      <header style={{ padding: "13px 18px 11px", borderBottom: "1px solid #0e2016", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, background: "rgba(3,10,5,0.96)", backdropFilter: "blur(20px)" }}>
        <Logo />
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 8, color: "#3a6449", letterSpacing: 2 }}>UPDATED</div>
            <div style={{ fontSize: 10, color: "#7eb893", fontFamily: "monospace" }}>
              {updated ? updated.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "—"}
            </div>
          </div>
          <button onClick={loadAll} style={{ background: "transparent", border: "1px solid #163024", borderRadius: 7, color: "#7eb893", fontFamily: "'Orbitron',monospace", fontSize: 9, letterSpacing: 1, padding: "6px 10px", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => e.target.style.borderColor = "#00e676"} onMouseLeave={e => e.target.style.borderColor = "#163024"}>
            ↻
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, padding: "16px 15px 88px", position: "relative", zIndex: 1 }}>

        {/* ── PICKS PAGE ─────────────────────────────────────────────────────── */}
        {page === "picks" && (
          <>
            <div style={{ marginBottom: 14 }}>
              <h1 style={{ fontFamily: "'Orbitron',monospace", fontSize: 14, fontWeight: 700, letterSpacing: 1.5 }}>
                AI PICKS <span style={{ color: "#00e676" }}>TODAY</span>
              </h1>
              <div style={{ fontSize: 11, color: "#7eb893", marginTop: 4 }}>
                {picks.length} predictions · 4-model analysis · Next 24-48h
              </div>
            </div>

            {/* Filter row */}
            <div style={{ display: "flex", gap: 5, marginBottom: 14, overflowX: "auto", paddingBottom: 2 }}>
              {[
                { k: "ALL", label: `ALL (${picks.length})`, cls: filter === "ALL" ? "filter-btn active-d" : "filter-btn" },
                { k: "LOW", label: `🛡 LOW (${lowCount})`, cls: filter === "LOW" ? "filter-btn active-g" : "filter-btn" },
                { k: "MEDIUM", label: `⚡ MED (${medCount})`, cls: filter === "MEDIUM" ? "filter-btn active-y" : "filter-btn" },
                { k: "HIGH", label: `🔥 HIGH (${highCount})`, cls: filter === "HIGH" ? "filter-btn active-r" : "filter-btn" },
              ].map(f => (
                <button key={f.k} className={f.cls} onClick={() => setFilter(f.k)}>{f.label}</button>
              ))}
            </div>

            {/* Stats summary */}
            {picks.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                {[
                  { label: "AVG SCORE", val: `${Math.round(picks.reduce((a, p) => a + (parseFloat(p.composite_score) || 0), 0) / picks.length)}`, color: "#00e676" },
                  { label: "TOP PICK", val: picks[0]?.best_bet?.split(" ")[0] || "—", color: "#ffd740" },
                  { label: "LOW RISK", val: `${lowCount}/${picks.length}`, color: "#7eb893" },
                ].map(s => (
                  <div key={s.label} style={{ background: "#050f08", border: "1px solid #0e2016", borderRadius: 9, padding: "9px 10px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 14, fontWeight: 700, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 8, color: "#3a6449", letterSpacing: 1, marginTop: 3 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map((p, i) => (
                <PickCard key={p.event_id || i} pick={p} rank={picks.indexOf(p) + 1} delay={i * 0.04} />
              ))}
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: 40, fontFamily: "'Orbitron',monospace", fontSize: 10, color: "#3a6449", letterSpacing: 2 }}>
                  NO {filter} RISK PICKS
                </div>
              )}
            </div>

            <div style={{ marginTop: 20, padding: "11px 14px", background: "#050f08", border: "1px solid #0e2016", borderRadius: 10, fontSize: 10, color: "#3a6449", lineHeight: 1.8, textAlign: "center" }}>
              ⚠️ AI predictions are generated for entertainment purposes only.<br />Please gamble responsibly. Never bet more than you can afford to lose.
            </div>
          </>
        )}

        {/* ── ACCAS PAGE ─────────────────────────────────────────────────────── */}
        {page === "accas" && (
          <>
            <div style={{ marginBottom: 14 }}>
              <h1 style={{ fontFamily: "'Orbitron',monospace", fontSize: 14, fontWeight: 700, letterSpacing: 1.5 }}>
                DAILY <span style={{ color: "#00e676" }}>ACCAS</span>
              </h1>
              <div style={{ fontSize: 11, color: "#7eb893", marginTop: 4 }}>4 AI-built accumulator bets · Refreshed daily</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <AccaCard title="SAFE DOUBLE" subtitle="~2 odds · 2-3 LOW risk picks" icon="🛡️" acca={accas?.safe2} headerGrad="linear-gradient(135deg,#0a2c1a 0%,#0f4a2b 100%)" oddsColor="#00e676" />
              <AccaCard title="SAFETY FIVEFOLD" subtitle="~5 odds · 4-5 picks" icon="⚡" acca={accas?.safe5} headerGrad="linear-gradient(135deg,#14280a 0%,#254a12 100%)" oddsColor="#7ed957" />
              <AccaCard title="POWER ACCA" subtitle="~10 odds · 5-7 picks" icon="💚" acca={accas?.safe10} headerGrad="linear-gradient(135deg,#0a2820 0%,#184a38 100%)" oddsColor="#ffd740" />
              <AccaCard title="BIG ODDS PARLAY" subtitle="30-50 odds · 7-10 picks" icon="🔥" acca={accas?.big} headerGrad="linear-gradient(135deg,#281008 0%,#4a2010 100%)" oddsColor="#ff9040" />
            </div>
            <div style={{ marginTop: 20, padding: "11px 14px", background: "#050f08", border: "1px solid #0e2016", borderRadius: 10, fontSize: 10, color: "#3a6449", lineHeight: 1.8, textAlign: "center" }}>
              ⚠️ Accumulators carry significantly higher risk. AI-generated for entertainment purposes only.<br />Please gamble responsibly.
            </div>
          </>
        )}

        {/* ── LIVE PAGE ──────────────────────────────────────────────────────── */}
        {page === "live" && <LivePage />}

      </main>

      {/* Bottom Nav */}
      <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 500, background: "rgba(3,10,5,0.97)", borderTop: "1px solid #0e2016", backdropFilter: "blur(20px)", display: "flex", zIndex: 100 }}>
        {[
          { id: "picks", icon: "🎯", label: "PICKS" },
          { id: "accas", icon: "📋", label: "ACCAS" },
          { id: "live", icon: "🔴", label: "LIVE" },
        ].map(t => (
          <button key={t.id} className={`nav-btn ${page === t.id ? "on" : ""}`} onClick={() => setPage(t.id)}>
            <span style={{ fontSize: 22 }}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
