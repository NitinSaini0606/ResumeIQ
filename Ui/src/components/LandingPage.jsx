import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── Font loader ─────────────────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;600;700&display=swap";
    document.head.appendChild(l);
  }, []);
}

// ─── InView hook ─────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return [ref, vis];
}

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({ target, suffix = "", duration = 1800 }) {
  const [val, setVal] = useState(0);
  const [ref, vis] = useInView(0.3);
  useEffect(() => {
    if (!vis) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [vis, target, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Typewriter ───────────────────────────────────────────────────────────────
function Typewriter({ lines, speed = 60 }) {
  const [display, setDisplay] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) {
      const t = setTimeout(() => { setPaused(false); setLineIdx(0); setCharIdx(0); setDisplay(""); }, 2200);
      return () => clearTimeout(t);
    }
    if (lineIdx >= lines.length) { setPaused(true); return; }
    const full = lines[lineIdx];
    if (charIdx < full.length) {
      const t = setTimeout(() => { setDisplay(d => d + full[charIdx]); setCharIdx(c => c + 1); }, speed);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setDisplay(d => d + "\n"); setLineIdx(l => l + 1); setCharIdx(0); }, 420);
      return () => clearTimeout(t);
    }
  }, [charIdx, lineIdx, paused, lines, speed]);
  return (
    <span style={{ whiteSpace: "pre-wrap" }}>
      {display}
      <span style={{ borderRight: "3px solid #6366f1", animation: "blink 1s step-end infinite", marginLeft: 1 }} />
    </span>
  );
}

// ─── Scoring Terminal ─────────────────────────────────────────────────────────
const TERM_STEPS = [
  { label: "Computing skill overlap...",   val: "0.75", pct: 75, color: "#6366f1" },
  { label: "Semantic similarity (SBERT)...",val: "0.66", pct: 66, color: "#8b5cf6" },
  { label: "POS keyword analysis...",      val: "0.40", pct: 40, color: "#a855f7" },
  { label: "Experience factor...",         val: "+2",   pct: 80, color: "#6366f1" },
];
const TAGS = [
  { t: "React",      ok: true  }, { t: "TypeScript", ok: true  },
  { t: "Node.js",    ok: true  }, { t: "MongoDB",    ok: true  },
  { t: "Redux",      ok: false }, { t: "Jest",       ok: false },
  { t: "Docker",     ok: false }, { t: "CI/CD",      ok: true  },
];

function ScoringTerminal() {
  const [bars,      setBars]      = useState([0,0,0,0]);
  const [tags,      setTags]      = useState([]);
  const [score,     setScore]     = useState(0);
  const [showRes,   setShowRes]   = useState(false);
  const [phase,     setPhase]     = useState(0);

  const run = () => {
    setPhase(1); setBars([0,0,0,0]); setTags([]); setScore(0); setShowRes(false);
    TERM_STEPS.forEach((s, i) => setTimeout(() => setBars(b => { const n=[...b]; n[i]=s.pct; return n; }), 500 + i*650));
    setTimeout(() => { TAGS.forEach((_, i) => setTimeout(() => setTags(t=>[...t,TAGS[i]]), i*110)); }, 3200);
    setTimeout(() => {
      let s = 0;
      const iv = setInterval(() => {
        s += 2; setScore(s);
        if (s >= 82) { setScore(82); clearInterval(iv); setShowRes(true); setPhase(2); }
      }, 20);
    }, 4400);
  };

  useEffect(() => { run(); const iv = setInterval(run, 8500); return () => clearInterval(iv); }, []);

  return (
    <div style={{ background:"#0d1117", borderRadius:18, overflow:"hidden", boxShadow:"0 28px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.2)", fontFamily:"'JetBrains Mono',monospace", fontSize:12, maxWidth:430, width:"100%" }}>
      {/* titlebar */}
      <div style={{ background:"#161b22", padding:"10px 16px", display:"flex", alignItems:"center", gap:8, borderBottom:"1px solid #21262d" }}>
        {["#ff5f57","#febc2e","#28c840"].map(c=><span key={c} style={{ width:11, height:11, borderRadius:"50%", background:c, display:"inline-block" }}/>)}
        <span style={{ marginLeft:10, color:"#484f58", fontSize:10 }}>resume_analyzer — ml_scorer.py</span>
      </div>

      <div style={{ padding:"20px 20px 24px" }}>
        {/* command */}
        <div style={{ color:"#484f58", marginBottom:14 }}>
          <span style={{ color:"#6366f1" }}>▶</span>
          <span style={{ color:"#58a6ff", marginLeft:6 }}>python</span>
          <span style={{ color:"#c9d1d9" }}> predict.py</span>
          <span style={{ color:"#8b949e" }}> rahul.txt jdfullstack.txt</span>
        </div>

        {phase>=1 && <div style={{ color:"#3fb950", marginBottom:16, fontSize:11 }}>✓ model.pkl loaded &nbsp;·&nbsp; <span style={{ color:"#e3b341" }}>analyzing...</span></div>}

        {/* bars */}
        {TERM_STEPS.map((s,i)=>(
          <div key={i} style={{ marginBottom:10, opacity:bars[i]>0?1:0, transition:"opacity 0.3s" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ color:"#8b949e" }}>{s.label}</span>
              <span style={{ color:s.color, fontWeight:700 }}>{s.val}</span>
            </div>
            <div style={{ height:5, background:"#21262d", borderRadius:3, overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:3, background:`linear-gradient(90deg,${s.color},${s.color}88)`, width:`${bars[i]}%`, transition:"width 0.9s cubic-bezier(0.4,0,0.2,1)" }}/>
            </div>
          </div>
        ))}

        {/* tags */}
        {tags.length>0 && (
          <div style={{ marginTop:16, marginBottom:14 }}>
            <div style={{ color:"#484f58", marginBottom:8, fontSize:10 }}>── skill gap ──</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {tags.map((tg,i)=>(
                <span key={i} style={{ padding:"2px 8px", borderRadius:4, fontSize:10, fontWeight:600, background:tg.ok?"rgba(63,185,80,0.12)":"rgba(248,81,73,0.12)", color:tg.ok?"#3fb950":"#f85149", border:`1px solid ${tg.ok?"rgba(63,185,80,0.25)":"rgba(248,81,73,0.25)"}` }}>
                  {tg.ok?"✓":"✗"} {tg.t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* result */}
        {score>0 && (
          <div style={{ marginTop:16, padding:"14px 16px", borderRadius:10, border:`1px solid ${showRes?"rgba(99,102,241,0.4)":"#21262d"}`, background:showRes?"rgba(99,102,241,0.08)":"transparent", transition:"all 0.5s" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ color:"#8b949e", fontSize:10, marginBottom:4 }}>MATCH SCORE</div>
                <div style={{ fontFamily:"'Sora',sans-serif", fontSize:30, fontWeight:800, color:score>=70?"#3fb950":"#e3b341", lineHeight:1 }}>{score}%</div>
              </div>
              {showRes && (
                <div style={{ textAlign:"right" }}>
                  <div style={{ background:"#3fb950", color:"#fff", padding:"4px 12px", borderRadius:6, fontSize:11, fontWeight:700, marginBottom:4 }}>✅ GOOD MATCH</div>
                  <div style={{ color:"#484f58", fontSize:10 }}>sigmoid = 0.8255</div>
                </div>
              )}
            </div>
            {score>0 && <div style={{ marginTop:10, height:6, background:"#21262d", borderRadius:3, overflow:"hidden" }}><div style={{ height:"100%", background:"linear-gradient(90deg,#6366f1,#3fb950)", width:`${score}%`, borderRadius:3, transition:"width 0.04s linear" }}/></div>}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Reveal wrapper ───────────────────────────────────────────────────────────
function Reveal({ children, delay=0, y=28 }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} style={{ opacity:vis?1:0, transform:vis?"translateY(0)":`translateY(${y}px)`, transition:`opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
      {children}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ sc, onMatcherClick, onRoastClick, onCompanyIntelClick = () => {} }) {
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, background:sc?"rgba(255,255,255,0.93)":"transparent", backdropFilter:sc?"blur(14px)":"none", borderBottom:sc?"1px solid #e2e8f0":"none", transition:"all 0.3s", padding:"0 2rem" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
          <div style={{ width:34, height:34, borderRadius:9, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, boxShadow:"0 4px 14px rgba(99,102,241,0.4)" }}>⚡</div>
          <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:18, color:"#0f172a", letterSpacing:"-0.5px" }}>ResumeIQ</span>
        </div>
        <div style={{ display:"flex", gap:34 }}>
          {[["Resume Matcher","/matcher"],["Resume Roast","/roast"],["Company Intel","/company-intel"],["How It Works","#how"]].map(([l,h])=>(
            <a
              key={l}
              href={h}
              style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:500, color:"#475569", textDecoration:"none", transition:"color 0.2s" }}
              onClick={e => {
                if (l === "Resume Matcher") {
                  e.preventDefault();
                  onMatcherClick();
                } else if (h === "/roast") {
                  e.preventDefault();
                  onRoastClick();
                } else if (h === "/company-intel") {
                  e.preventDefault();
                  onCompanyIntelClick();
                }
              }}
              onMouseEnter={e=>e.target.style.color="#6366f1"}
              onMouseLeave={e=>e.target.style.color="#475569"}
            >{l}</a>
          ))}
        </div>
        <button style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13, padding:"9px 22px", borderRadius:8, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", boxShadow:"0 4px 14px rgba(99,102,241,0.35)", transition:"all 0.2s" }}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 8px 22px rgba(99,102,241,0.45)"}}
          onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 4px 14px rgba(99,102,241,0.35)"}}
        >Get Started Free</button>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onMatcherClick }) {
  return (
    <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", background:"linear-gradient(160deg,#fafbff 0%,#f0f0ff 45%,#fdf4ff 100%)", padding:"88px 2rem 60px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-160, right:-100, width:560, height:560, borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,0.13) 0%,transparent 65%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:-100, left:-80, width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(168,85,247,0.09) 0%,transparent 65%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(99,102,241,0.07) 1px,transparent 1px)", backgroundSize:"32px 32px", pointerEvents:"none" }}/>

      <div style={{ maxWidth:1200, margin:"0 auto", width:"100%", display:"flex", alignItems:"center", gap:60, position:"relative" }}>
        {/* LEFT */}
        <div style={{ flex:"0 0 50%", maxWidth:560 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(99,102,241,0.07)", border:"1px solid rgba(99,102,241,0.18)", borderRadius:999, padding:"5px 14px", marginBottom:28 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#6366f1", display:"inline-block", animation:"pulse 2s infinite" }}/>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:"#6366f1", letterSpacing:0.3 }}>ML-Powered Resume Intelligence</span>
          </div>

          <h1 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"clamp(2.2rem,4vw,3.3rem)", lineHeight:1.1, color:"#0f172a", margin:"0 0 8px", letterSpacing:"-1.5px", minHeight:"5.2em" }}>
            <Typewriter lines={["Match Smarter.","Score Higher.","Get Hired Faster."]} speed={58}/>
          </h1>

          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:16, lineHeight:1.75, color:"#64748b", margin:"24px 0 32px", maxWidth:460 }}>
            Sometimes the difference isn’t skill — it’s perception.
          </p>

          {/* <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:36 }}>
            {["spaCy NLP","SBERT Semantic","Logistic Regression","91% F1 Score","200+ Training Pairs"].map(c=>(
              <span key={c} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, padding:"4px 11px", borderRadius:6, background:"#fff", border:"1px solid #e2e8f0", color:"#64748b", letterSpacing:0.2, boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>{c}</span>
            ))}
          </div> */}

          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <button style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:15, padding:"13px 28px", borderRadius:10, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", boxShadow:"0 6px 22px rgba(99,102,241,0.4)", transition:"all 0.25s" }}
              onClick={onMatcherClick}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(99,102,241,0.5)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 6px 22px rgba(99,102,241,0.4)"}}
            >Analyze My Resume →</button>
            <button style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:15, padding:"13px 26px", borderRadius:10, cursor:"pointer", background:"#fff", border:"1.5px solid #e2e8f0", color:"#374151", boxShadow:"0 1px 6px rgba(0,0,0,0.06)", transition:"all 0.2s", display:"flex", alignItems:"center", gap:8 }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#6366f1";e.currentTarget.style.color="#6366f1"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#e2e8f0";e.currentTarget.style.color="#374151"}}
            >Free Match Score &nbsp;<span style={{ fontSize:10, fontWeight:800, background:"#10b981", color:"#fff", padding:"2px 7px", borderRadius:4 }}>FREE</span></button>
          </div>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#94a3b8", marginTop:14 }}>No signup · Built for BTech placements</p>
        </div>

        {/* RIGHT — terminal */}
        <div style={{ flex:1, display:"flex", justifyContent:"center", alignItems:"center" }}>
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute", inset:-30, borderRadius:30, background:"radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 65%)", filter:"blur(24px)", pointerEvents:"none" }}/>
            <ScoringTerminal/>
            <div style={{ position:"absolute", bottom:-20, left:"50%", transform:"translateX(-50%)", fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:500, color:"#94a3b8", whiteSpace:"nowrap" }}>Live demo · reruns every 8s</div>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div style={{ position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:5, opacity:0.4 }}>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#64748b" }}>scroll</span>
        <div style={{ width:1, height:28, background:"linear-gradient(to bottom,#6366f1,transparent)" }}/>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
// function Stats() {
//   return (
//     <section style={{ background:"#0f172a", padding:"64px 2rem" }}>
//       <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:24 }}>
//         {[{v:91,s:"%",l:"Model F1 Score"},{v:200,s:"+",l:"Training Pairs"},{v:5,s:"×",l:"Scoring Dimensions"}].map((s,i)=>(
//           <Reveal key={s.l} delay={i*0.1}>
//             <div style={{ textAlign:"center" }}>
//               <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"2.6rem", lineHeight:1, background:"linear-gradient(135deg,#6366f1,#a855f7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
//                 <Counter target={s.v} suffix={s.s}/>
//               </div>
//               <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#475569", marginTop:6, fontWeight:500 }}>{s.l}</div>
//             </div>
//           </Reveal>
//         ))}
//       </div>
//     </section>
//   );
// }

// ─── Mission ──────────────────────────────────────────────────────────────────
// function Mission() {
//   return (
//     <section style={{ background:"#fff", padding:"110px 2rem" }}>
//       <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", gap:80, alignItems:"center", flexWrap:"wrap" }}>
//         <Reveal style={{ flex:"0 0 380px" }}>
//           <div>
//             <div style={{ fontFamily:"'Sora',sans-serif", fontSize:"5rem", color:"#6366f1", lineHeight:0.8, marginBottom:16, fontWeight:800 }}>"</div>
//             <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"1.45rem", color:"#0f172a", lineHeight:1.4, margin:0, letterSpacing:"-0.4px" }}>
//               We didn't want to build<br/>another keyword counter.<br/>
//               <span style={{ color:"#6366f1" }}>We built a real ML system.</span>
//             </p>
//           </div>
//         </Reveal>
//         <Reveal delay={0.15} style={{ flex:1, minWidth:280 }}>
//           <div>
//             <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:2.5, color:"#6366f1", textTransform:"uppercase" }}>Our Mission</span>
//             <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"clamp(1.5rem,2.5vw,2rem)", color:"#0f172a", margin:"14px 0 20px", letterSpacing:"-0.5px", lineHeight:1.3 }}>Built by a BTech student,<br/>for every BTech student.</h2>
//             <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"#475569", lineHeight:1.8, margin:"0 0 16px" }}>
//               Every placement season, thousands of students send resumes without knowing if they pass the ATS filter.
//               We've been there — applying blindly, getting rejected with zero feedback, wondering what went wrong.
//             </p>
//             <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"#475569", lineHeight:1.8, margin:0 }}>
//               ResumeIQ changes that with a trained Logistic Regression model, SBERT semantic scoring, and honest
//               AI feedback — telling you exactly what's missing and why.
//             </p>
//             <div style={{ marginTop:32, display:"flex", flexDirection:"column", gap:14 }}>
//               {[["🎓","Started as a final year ML project"],["📊","Trained on 116 real resume-JD pairs"],["🚀","Expanded into a full product for students"]].map(([ic,t])=>(
//                 <div key={t} style={{ display:"flex", alignItems:"center", gap:14 }}>
//                   <div style={{ width:36, height:36, borderRadius:10, background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{ic}</div>
//                   <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"#374151", fontWeight:500 }}>{t}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </Reveal>
//       </div>
//     </section>
//   );
// }

// ─── Features ─────────────────────────────────────────────────────────────────
const FEATS = [
  { icon:"🎯", badge:"FREE",  bc:"#6366f1", title:"Resume Matcher",       tag:"ML-powered. Not just keywords.",  desc:"Upload your resume and any JD. Our model scores the match using spaCy skill overlap, SBERT semantic similarity, and POS keyword analysis — returning a real probability.", pts:["Skill gap analysis","Semantic matching","Experience scoring"] },
  { icon:"🔥", badge:"AI",    bc:"#f59e0b", title:"Resume Roast",         tag:"Brutal. Honest. Actionable.",      desc:"Get ruthlessly honest AI feedback on your resume. No fluff — just clear, prioritised insights powered by Gemini that actually help you land interviews.", pts:["AI-powered critique","Score out of 100","Improvement roadmap"] },
  { icon:"🏢", badge:"RAG",   bc:"#10b981", title:"Company Intelligence",  tag:"Know before you apply.",           desc:"Deep dive into how top companies like Google, Microsoft, Amazon, and Adobe actually hire — sourced from real career pages, powered by RAG.", pts:["Hiring process breakdown","Ideal skill profiles","AI chat assistant"] },
];

function Features({ onMatcherClick, onRoastClick, onCompanyIntelClick = () => {} }) {
  return (
    <section id="features" style={{ background:"#f8fafc", padding:"110px 2rem" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <Reveal>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:2.5, color:"#6366f1", textTransform:"uppercase" }}>Features</span>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"clamp(1.8rem,3vw,2.4rem)", color:"#0f172a", margin:"14px 0 12px", letterSpacing:"-0.8px" }}>Three tools. One unfair advantage.</h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"#64748b", maxWidth:480, margin:"0 auto" }}>Everything you need to go from confused applicant to confident candidate.</p>
          </div>
        </Reveal>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:22 }}>
          {FEATS.map((f,i)=>(
            <Reveal key={f.title} delay={i*0.12}>
              <div style={{ background:"#fff", borderRadius:18, padding:"34px 28px", border:"1px solid #e8edf2", position:"relative", boxShadow:"0 4px 24px rgba(15,23,42,0.05)", transition:"transform 0.25s,box-shadow 0.25s", overflow:"hidden" }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow="0 16px 48px rgba(15,23,42,0.11)"}}
                onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 4px 24px rgba(15,23,42,0.05)"}}
              >
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${f.bc},${f.bc}44)`, borderRadius:"18px 18px 0 0" }}/>
                <div style={{ position:"absolute", top:18, right:18, background:f.bc, color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:800, padding:"3px 10px", borderRadius:5, letterSpacing:0.8 }}>{f.badge}</div>
                <div style={{ width:52, height:52, borderRadius:14, background:`${f.bc}12`, border:`1px solid ${f.bc}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:20 }}>{f.icon}</div>
                <h3 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:19, color:"#0f172a", margin:"0 0 5px", letterSpacing:"-0.3px" }}>{f.title}</h3>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:f.bc, fontWeight:600, margin:"0 0 14px", fontStyle:"italic" }}>{f.tag}</p>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"#475569", lineHeight:1.7, margin:"0 0 20px" }}>{f.desc}</p>
                <ul style={{ listStyle:"none", padding:0, margin:"0 0 24px" }}>
                  {f.pts.map(p=>(
                    <li key={p} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#374151", fontWeight:500, display:"flex", alignItems:"center", gap:9, marginBottom:8 }}>
                      <span style={{ width:5, height:5, borderRadius:"50%", background:f.bc, flexShrink:0 }}/>{p}
                    </li>
                  ))}
                </ul>
                <button style={{ width:"100%", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13, padding:"10px", borderRadius:8, cursor:"pointer", background:"transparent", border:"1.5px solid #e2e8f0", color:"#374151", transition:"all 0.2s" }}
                  onClick={() => {
                    if (f.title === "Resume Matcher") {
                      onMatcherClick();
                    } else if (f.title === "Resume Roast") {
                      onRoastClick();
                    }
                    else if (f.title === "Company Intelligence") {
                      onCompanyIntelClick();
                    }
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=f.bc;e.currentTarget.style.color=f.bc;e.currentTarget.style.background=`${f.bc}08`}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#e2e8f0";e.currentTarget.style.color="#374151";e.currentTarget.style.background="transparent"}}
                >Explore →</button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n:"01", title:"Upload Resume & JD",        body:"Drop your resume and paste any job description. Our pipeline preprocesses both — cleaning, normalising, and extracting skills." },
    { n:"02", title:"ML Model Scores The Match",  body:"spaCy computes skill overlap. SBERT captures semantic meaning. POS analysis finds keyword density. All fed into our trained Logistic Regression model." },
    { n:"03", title:"Get Actionable Insights",    body:"See your match probability, exactly which skills you have, which are missing, and what to add to maximise your shortlisting chances." },
  ];
  return (
    <section id="how" style={{ background:"#fff", padding:"110px 2rem" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", gap:80, alignItems:"flex-start", flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 340px" }}>
          <Reveal>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:2.5, color:"#6366f1", textTransform:"uppercase" }}>How It Works</span>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"clamp(1.7rem,2.5vw,2.2rem)", color:"#0f172a", margin:"14px 0 20px", letterSpacing:"-0.6px", lineHeight:1.2 }}>From upload to insight in seconds</h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"#64748b", lineHeight:1.75, margin:0 }}>Three steps is all it takes to understand your resume-JD fit with ML precision.</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ marginTop:36, background:"#0d1117", borderRadius:12, padding:"18px 20px", border:"1px solid #21262d", fontFamily:"'JetBrains Mono',monospace", fontSize:11 }}>
              <div style={{ color:"#484f58", marginBottom:8, fontSize:10 }}># sample output</div>
              <div><span style={{ color:"#79c0ff" }}>skill_overlap</span><span style={{ color:"#c9d1d9" }}> = </span><span style={{ color:"#79c0ff" }}>0.75</span></div>
              <div><span style={{ color:"#79c0ff" }}>sbert_score</span><span style={{ color:"#c9d1d9" }}>  = </span><span style={{ color:"#79c0ff" }}>0.66</span></div>
              <div><span style={{ color:"#79c0ff" }}>pos_score</span><span style={{ color:"#c9d1d9" }}>    = </span><span style={{ color:"#79c0ff" }}>0.40</span></div>
              <div style={{ marginTop:8 }}><span style={{ color:"#3fb950" }}>probability</span><span style={{ color:"#c9d1d9" }}>  = </span><span style={{ color:"#3fb950", fontWeight:700 }}>0.8255</span></div>
              <div><span style={{ color:"#3fb950" }}>prediction</span><span style={{ color:"#c9d1d9" }}>   = </span><span style={{ color:"#3fb950", fontWeight:700 }}>"GOOD MATCH"</span></div>
            </div>
          </Reveal>
        </div>
        <div style={{ flex:1, minWidth:280 }}>
          {steps.map((s,i)=>(
            <Reveal key={s.n} delay={i*0.15}>
              <div style={{ display:"flex", gap:24, paddingBottom:44 }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                  <div style={{ width:50, height:50, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:14, color:"#fff", boxShadow:"0 4px 18px rgba(99,102,241,0.35)" }}>{s.n}</div>
                  {i<steps.length-1 && <div style={{ width:2, flex:1, background:"linear-gradient(to bottom,#6366f133,transparent)", minHeight:32, marginTop:8 }}/>}
                </div>
                <div style={{ paddingTop:11 }}>
                  <h3 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:17, color:"#0f172a", margin:"0 0 10px", letterSpacing:"-0.3px" }}>{s.title}</h3>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"#475569", lineHeight:1.75, margin:0 }}>{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why ──────────────────────────────────────────────────────────────────────
function Why() {
  const pts = [
    { icon:"🧠", title:"Real ML Model",          body:"Not keyword counting. Trained Logistic Regression with 91% F1 on real resume-JD pairs." },
    { icon:"📐", title:"Semantic Understanding", body:"SBERT embeddings capture meaning — even when you use different words than the JD." },
    { icon:"🎯", title:"JD-Specific Scoring",    body:"Every score is relative to the actual job description you upload — not a generic rubric." },
    { icon:"🔍", title:"Skill Gap Clarity",      body:"See exactly which skills the JD requires, which you have, and which are missing." },
  ];
  return (
    <section style={{ background:"#0f172a", padding:"110px 2rem" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <Reveal>
          <div style={{ textAlign:"center", marginBottom:60 }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:2.5, color:"#6366f1", textTransform:"uppercase" }}>Why ResumeIQ</span>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"clamp(1.8rem,3vw,2.4rem)", color:"#f8fafc", margin:"14px 0 0", letterSpacing:"-0.8px" }}>Not another keyword checker</h2>
          </div>
        </Reveal>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:18 }}>
          {pts.map((p,i)=>(
            <Reveal key={p.title} delay={i*0.1}>
              <div style={{ background:"#1e293b", borderRadius:14, padding:"26px 22px", border:"1px solid #334155", transition:"border-color 0.2s,transform 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#6366f1";e.currentTarget.style.transform="translateY(-3px)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#334155";e.currentTarget.style.transform=""}}
              >
                <div style={{ fontSize:26, marginBottom:12 }}>{p.icon}</div>
                <h3 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:15, color:"#f1f5f9", margin:"0 0 9px" }}>{p.title}</h3>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#64748b", lineHeight:1.7, margin:0 }}>{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTA({ onMatcherClick }) {
  return (
    <section style={{ background:"#f8fafc", padding:"110px 2rem" }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <Reveal>
          <div style={{ background:"linear-gradient(135deg,#eef2ff 0%,#faf5ff 100%)", borderRadius:24, padding:"64px 48px", border:"1px solid rgba(99,102,241,0.15)", boxShadow:"0 20px 64px rgba(99,102,241,0.1)", textAlign:"center", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(99,102,241,0.06) 1px,transparent 1px)", backgroundSize:"24px 24px", pointerEvents:"none" }}/>
            <div style={{ position:"relative" }}>
              <div style={{ fontSize:44, marginBottom:18 }}>🚀</div>
              <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"clamp(1.5rem,3vw,2rem)", color:"#0f172a", margin:"0 0 16px", letterSpacing:"-0.7px" }}>Ready to match smarter?</h2>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"#475569", lineHeight:1.75, margin:"0 0 32px" }}>Upload your resume and any job description. Get your ML match score, skill gap analysis, and AI feedback in seconds — completely free.</p>
              <button style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:16, padding:"14px 38px", borderRadius:10, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", boxShadow:"0 8px 28px rgba(99,102,241,0.4)", transition:"all 0.25s" }}
                onClick={onMatcherClick}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 14px 36px rgba(99,102,241,0.5)"}}
                onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 8px 28px rgba(99,102,241,0.4)"}}
              >Analyze My Resume — It's Free →</button>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#94a3b8", marginTop:14, marginBottom:0 }}>No account needed · Built for BTech placement season</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background:"#0f172a", borderTop:"1px solid #1e293b", padding:"44px 2rem" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:7, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>⚡</div>
          <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:15, color:"#f1f5f9" }}>ResumeIQ</span>
        </div>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#334155", margin:0 }}>spaCy · SBERT · Logistic Regression · FastAPI · React</p>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#334155", margin:0 }}>© 2025 ResumeIQ · Final Year Project</p>
      </div>
    </footer>
  );
}

// ─── Global CSS ───────────────────────────────────────────────────────────────
const CSS = `
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0.4)} 50%{box-shadow:0 0 0 7px rgba(99,102,241,0)} }
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{overflow-x:hidden}
`;

// ─── App ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  useFonts();
  const [sc, setSc] = useState(false);
  const goToMatcher = () => navigate("/matcher");
  const goToRoast = () => navigate("/roast");
  const goToCompanyIntel = () => navigate("/company-intel");
  useEffect(() => {
    const h = () => setSc(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <>
      <style>{CSS}</style>
      <div style={{ background:"#fff", minHeight:"100vh" }}>
        <Navbar sc={sc} onMatcherClick={goToMatcher} onRoastClick={goToRoast} onCompanyIntelClick={goToCompanyIntel}/>
        <Hero onMatcherClick={goToMatcher}/>
        {/* <Stats/> */}
        {/* <Mission/> */}
        <Features onMatcherClick={goToMatcher} onRoastClick={goToRoast} onCompanyIntelClick={goToCompanyIntel}/>
        <HowItWorks/>
        <Why/>
        <CTA onMatcherClick={goToMatcher}/>
        <Footer/>
      </div>
    </>
  );
}