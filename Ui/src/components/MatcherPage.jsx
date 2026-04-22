// import { useState, useEffect, useRef } from "react";

// // ── fonts ─────────────────────────────────────────────────────
// function useFonts() {
//   useEffect(() => {
//     const l = document.createElement("link");
//     l.rel = "stylesheet";
//     l.href = "https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;600&display=swap";
//     document.head.appendChild(l);
//   }, []);
// }

// // ── api ───────────────────────────────────────────────────────
// async function analyzeResume(resumeText, jdText, experience) {
//   const res = await fetch("http://localhost:8000/predict", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ resume_text: resumeText, jd_text: jdText, experience }),
//   });
//   if (!res.ok) throw new Error(`API error: ${res.status}`);
//   return res.json();
// }

// // ── animated counter ──────────────────────────────────────────
// function useCounter(target, duration = 1400, start = false) {
//   const [val, setVal] = useState(0);
//   useEffect(() => {
//     if (!start) return;
//     let s = null;
//     const step = (ts) => {
//       if (!s) s = ts;
//       const p = Math.min((ts - s) / duration, 1);
//       const ease = 1 - Math.pow(1 - p, 3);
//       setVal(Math.floor(ease * target));
//       if (p < 1) requestAnimationFrame(step);
//     };
//     requestAnimationFrame(step);
//   }, [target, start, duration]);
//   return val;
// }

// // ── helpers ───────────────────────────────────────────────────
// function getMatchMeta(prob) {
//   const pct = Math.round(prob * 100);
//   if (pct >= 80) return { label: "Strong Match", color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", ring: "#10b981", grade: "A" };
//   if (pct >= 60) return { label: "Good Match", color: "#0284c7", bg: "#eff6ff", border: "#93c5fd", ring: "#3b82f6", grade: "B" };
//   if (pct >= 40) return { label: "Moderate Fit", color: "#d97706", bg: "#fffbeb", border: "#fcd34d", ring: "#f59e0b", grade: "C" };
//   return { label: "Poor Match", color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", ring: "#ef4444", grade: "D" };
// }

// // ── navbar ────────────────────────────────────────────────────
// function Navbar({ scrolled }) {
//   return (
//     <nav style={{
//       position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
//       height: 60, padding: "0 2rem",
//       background: scrolled ? "rgba(250,249,247,0.96)" : "rgba(250,249,247,0)",
//       backdropFilter: scrolled ? "blur(16px)" : "none",
//       borderBottom: scrolled ? "1px solid #e7e5e0" : "none",
//       display: "flex", alignItems: "center", justifyContent: "space-between",
//       transition: "all 0.35s",
//     }}>
//       <a href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
//         <div style={{
//           width: 32, height: 32, borderRadius: 9,
//           background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
//           display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
//         }}>⚡</div>
//         <span style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 800, fontSize: 17, color: "#1a1814", letterSpacing: "-0.3px" }}>ResumeIQ</span>
//       </a>
//       <div style={{ display: "flex", gap: 32 }}>
//         {[["Resume Matcher", true], ["Resume Roast", false], ["Company Intel", false]].map(([l, active]) => (
//           <a key={l} href="#" style={{
//             fontFamily: "'Instrument Sans',sans-serif", fontSize: 13, fontWeight: active ? 600 : 400,
//             color: active ? "#6366f1" : "#6b6760", textDecoration: "none",
//           }}>{l}</a>
//         ))}
//       </div>
//       <a href="/" style={{
//         fontFamily: "'Instrument Sans',sans-serif", fontWeight: 500, fontSize: 13,
//         padding: "7px 16px", borderRadius: 8, border: "1px solid #e2ddd8",
//         textDecoration: "none", color: "#6b6760", background: "#fff",
//       }}>← Home</a>
//     </nav>
//   );
// }

// // ── upload section ────────────────────────────────────────────
// function UploadSection({ onAnalyze, loading, error }) {
//   const [resumeText, setResumeText] = useState("");
//   const [jdText, setJdText] = useState("");
//   const [resumeExp, setResumeExp] = useState("");
//   const [jdExp, setJdExp] = useState("");
//   const [resumeFile, setResumeFile] = useState(null);
//   const [resumeTab, setResumeTab] = useState("paste");
//   const resumeRef = useRef();

//   function handleResumeFile(file) {
//     if (!file) return;
//     setResumeFile(file.name);
//     const r = new FileReader();
//     r.onload = e => setResumeText(e.target.result);
//     r.readAsText(file);
//   }

//   const expGap = (resumeExp !== "" && jdExp !== "") ? parseInt(resumeExp) - parseInt(jdExp) : null;
//   const ready = resumeText.length > 50 && jdText.length > 50;

//   function handleSubmit() {
//     const gap = expGap !== null ? expGap : 0;
//     onAnalyze(resumeText, jdText, gap);
//   }

//   return (
//     <div style={{ maxWidth: 900, margin: "0 auto", padding: "100px 1.5rem 4rem" }}>

//       {/* page header */}
//       <div style={{ textAlign: "center", marginBottom: "3rem" }}>
//         <div style={{
//           display: "inline-flex", alignItems: "center", gap: 8,
//           background: "#eef2ff", border: "1px solid #c7d2fe",
//           borderRadius: 999, padding: "5px 16px", marginBottom: 20,
//         }}>
//           <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", display: "inline-block" }} />
//           <span style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 12, fontWeight: 600, color: "#6366f1", letterSpacing: 0.3 }}>
//             ML-Powered · spaCy + SBERT · Not just keywords
//           </span>
//         </div>
//         <h1 style={{
//           fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900,
//           fontSize: "clamp(2.2rem,5vw,3.4rem)",
//           color: "#1a1814", letterSpacing: "-1.5px", lineHeight: 1.05,
//           margin: "0 0 16px",
//         }}>
//           How well does your resume<br />
//           <span style={{ color: "#6366f1" }}>actually match</span> the job?
//         </h1>
//         <p style={{
//           fontFamily: "'Instrument Sans',sans-serif", fontSize: 16,
//           color: "#6b6760", maxWidth: 480, margin: "0 auto", lineHeight: 1.7,
//         }}>
//           Paste your resume and any job description. Our ML model scores the match
//           across 3 dimensions — not just keywords.
//         </p>
//       </div>

//       {/* main input grid */}
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

//         {/* resume box */}
//         <div style={{
//           background: "#fff", border: "1px solid #e7e5e0",
//           borderRadius: 18, overflow: "hidden",
//           boxShadow: "0 2px 16px rgba(26,24,20,0.06)",
//         }}>
//           <div style={{
//             padding: "14px 18px", borderBottom: "1px solid #f3f1ee",
//             display: "flex", alignItems: "center", justifyContent: "space-between",
//             background: "linear-gradient(135deg,#fafaf9,#f5f3f0)",
//           }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <div style={{
//                 width: 34, height: 34, borderRadius: 10,
//                 background: "#eef2ff", display: "flex",
//                 alignItems: "center", justifyContent: "center", fontSize: 16,
//               }}>📄</div>
//               <div>
//                 <p style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 700, fontSize: 14, color: "#1a1814", margin: 0 }}>Your Resume</p>
//                 <p style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 11, color: "#9c9890", margin: 0 }}>paste text or upload file</p>
//               </div>
//             </div>
//             <div style={{ display: "flex", gap: 2, background: "#ede8e3", borderRadius: 8, padding: 3 }}>
//               {["paste", "upload"].map(t => (
//                 <button key={t} onClick={() => setResumeTab(t)} style={{
//                   fontFamily: "'Instrument Sans',sans-serif", fontSize: 11, fontWeight: resumeTab === t ? 600 : 400,
//                   padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer",
//                   background: resumeTab === t ? "#fff" : "transparent",
//                   color: resumeTab === t ? "#1a1814" : "#9c9890",
//                   boxShadow: resumeTab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
//                   transition: "all 0.15s",
//                 }}>{t}</button>
//               ))}
//             </div>
//           </div>

//           <div style={{ padding: "14px 18px" }}>
//             {resumeTab === "paste" ? (
//               <textarea
//                 value={resumeText}
//                 onChange={e => setResumeText(e.target.value)}
//                 placeholder={"Paste your complete resume here...\n\nInclude:\n• Skills section\n• Work experience\n• Education\n• Projects"}
//                 style={{
//                   width: "100%", height: 240, resize: "none",
//                   border: "1px solid #e7e5e0", borderRadius: 10,
//                   padding: "12px 14px", fontSize: 12.5, lineHeight: 1.65,
//                   fontFamily: "'Instrument Sans',sans-serif",
//                   color: "#1a1814", background: "#fafaf9",
//                   outline: "none", transition: "border-color 0.2s",
//                   boxSizing: "border-box",
//                 }}
//                 onFocus={e => e.target.style.borderColor = "#6366f1"}
//                 onBlur={e => e.target.style.borderColor = "#e7e5e0"}
//               />
//             ) : (
//               <div
//                 onClick={() => resumeRef.current.click()}
//                 onDragOver={e => e.preventDefault()}
//                 onDrop={e => { e.preventDefault(); handleResumeFile(e.dataTransfer.files[0]); }}
//                 style={{
//                   height: 240, border: `2px dashed ${resumeFile ? "#6366f1" : "#ddd8d0"}`,
//                   borderRadius: 10, display: "flex", flexDirection: "column",
//                   alignItems: "center", justifyContent: "center", cursor: "pointer",
//                   background: resumeFile ? "#eef2ff" : "#fafaf9", transition: "all 0.2s",
//                 }}
//               >
//                 <input ref={resumeRef} type="file" accept=".txt,.pdf,.docx" style={{ display: "none" }} onChange={e => handleResumeFile(e.target.files[0])} />
//                 <div style={{ fontSize: 32, marginBottom: 10 }}>{resumeFile ? "✅" : "📁"}</div>
//                 <p style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 700, fontSize: 14, color: resumeFile ? "#6366f1" : "#1a1814", margin: "0 0 4px" }}>
//                   {resumeFile || "Drop your resume here"}
//                 </p>
//                 <p style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 12, color: "#9c9890", margin: 0 }}>
//                   {resumeFile ? "Click to change" : "TXT · PDF · DOCX"}
//                 </p>
//               </div>
//             )}
//             <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
//               <span style={{
//                 fontFamily: "'JetBrains Mono',monospace", fontSize: 11,
//                 color: resumeText.length > 100 ? "#059669" : "#9c9890",
//               }}>{resumeText.length} chars</span>
//             </div>
//           </div>
//         </div>

//         {/* JD box */}
//         <div style={{
//           background: "#fff", border: "1px solid #e7e5e0",
//           borderRadius: 18, overflow: "hidden",
//           boxShadow: "0 2px 16px rgba(26,24,20,0.06)",
//         }}>
//           <div style={{
//             padding: "14px 18px", borderBottom: "1px solid #f3f1ee",
//             background: "linear-gradient(135deg,#fafaf9,#f5f3f0)",
//             display: "flex", alignItems: "center", gap: 10,
//           }}>
//             <div style={{
//               width: 34, height: 34, borderRadius: 10,
//               background: "#f0fdf4", display: "flex",
//               alignItems: "center", justifyContent: "center", fontSize: 16,
//             }}>🏢</div>
//             <div>
//               <p style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 700, fontSize: 14, color: "#1a1814", margin: 0 }}>Job Description</p>
//               <p style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 11, color: "#9c9890", margin: 0 }}>paste any JD from anywhere</p>
//             </div>
//           </div>
//           <div style={{ padding: "14px 18px" }}>
//             <textarea
//               value={jdText}
//               onChange={e => setJdText(e.target.value)}
//               placeholder={"Paste the job description here...\n\nWorks with any company's JD:\n• Google, Microsoft, Amazon\n• Startups, mid-size companies\n• Any role, any domain"}
//               style={{
//                 width: "100%", height: 240, resize: "none",
//                 border: "1px solid #e7e5e0", borderRadius: 10,
//                 padding: "12px 14px", fontSize: 12.5, lineHeight: 1.65,
//                 fontFamily: "'Instrument Sans',sans-serif",
//                 color: "#1a1814", background: "#fafaf9",
//                 outline: "none", transition: "border-color 0.2s",
//                 boxSizing: "border-box",
//               }}
//               onFocus={e => e.target.style.borderColor = "#6366f1"}
//               onBlur={e => e.target.style.borderColor = "#e7e5e0"}
//             />
//             <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
//               <span style={{
//                 fontFamily: "'JetBrains Mono',monospace", fontSize: 11,
//                 color: jdText.length > 100 ? "#059669" : "#9c9890",
//               }}>{jdText.length} chars</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* experience row */}
//       <div style={{
//         background: "#fff", border: "1px solid #e7e5e0",
//         borderRadius: 14, padding: "16px 20px", marginBottom: 16,
//         display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap",
//         boxShadow: "0 2px 12px rgba(26,24,20,0.04)",
//       }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <span style={{ fontSize: 18 }}>💼</span>
//           <span style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 700, fontSize: 14, color: "#1a1814" }}>Experience</span>
//           <span style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 12, color: "#9c9890" }}>(optional)</span>
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <label style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 13, color: "#6b6760" }}>Your years</label>
//           <input
//             type="number" min="0" max="30" value={resumeExp}
//             onChange={e => setResumeExp(e.target.value)}
//             placeholder="0"
//             style={{
//               width: 64, padding: "6px 10px", borderRadius: 8,
//               border: "1px solid #e7e5e0", fontFamily: "'JetBrains Mono',monospace",
//               fontSize: 14, color: "#1a1814", background: "#fafaf9",
//               outline: "none", textAlign: "center",
//             }}
//           />
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <label style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 13, color: "#6b6760" }}>JD requires</label>
//           <input
//             type="number" min="0" max="30" value={jdExp}
//             onChange={e => setJdExp(e.target.value)}
//             placeholder="0"
//             style={{
//               width: 64, padding: "6px 10px", borderRadius: 8,
//               border: "1px solid #e7e5e0", fontFamily: "'JetBrains Mono',monospace",
//               fontSize: 14, color: "#1a1814", background: "#fafaf9",
//               outline: "none", textAlign: "center",
//             }}
//           />
//         </div>

//         {expGap !== null && (
//           <div style={{
//             display: "flex", alignItems: "center", gap: 8,
//             padding: "6px 14px", borderRadius: 8,
//             background: expGap >= 0 ? "#ecfdf5" : "#fef2f2",
//             border: `1px solid ${expGap >= 0 ? "#6ee7b7" : "#fca5a5"}`,
//           }}>
//             <span style={{ fontSize: 14 }}>{expGap >= 0 ? "✅" : "⚠️"}</span>
//             <span style={{
//               fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600,
//               color: expGap >= 0 ? "#059669" : "#dc2626",
//             }}>
//               {expGap >= 0 ? `+${expGap}` : expGap} yrs {expGap >= 0 ? "above req." : "below req."}
//             </span>
//           </div>
//         )}
//       </div>

//       {/* error */}
//       {error && (
//         <div style={{
//           background: "#fef2f2", border: "1px solid #fca5a5",
//           borderRadius: 10, padding: "12px 16px", marginBottom: 12,
//           fontFamily: "'Instrument Sans',sans-serif", fontSize: 13, color: "#dc2626",
//         }}>❌ {error}</div>
//       )}

//       {/* CTA */}
//       <button
//         onClick={handleSubmit}
//         disabled={!ready || loading}
//         style={{
//           width: "100%", padding: "16px",
//           fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 800, fontSize: 16,
//           letterSpacing: "-0.3px", borderRadius: 14, border: "none",
//           cursor: ready && !loading ? "pointer" : "not-allowed",
//           background: ready && !loading
//             ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
//             : "#f0ede8",
//           color: ready && !loading ? "#fff" : "#b8b4ae",
//           boxShadow: ready && !loading ? "0 8px 28px rgba(99,102,241,0.35)" : "none",
//           transition: "all 0.25s",
//           position: "relative", overflow: "hidden",
//         }}
//       >
//         {loading ? "⏳ Analyzing..." : ready ? "🎯 Analyze Match Score →" : "Paste resume + job description to continue"}
//       </button>

//       <p style={{
//         fontFamily: "'Instrument Sans',sans-serif", fontSize: 12,
//         color: "#b8b4ae", textAlign: "center", marginTop: 10,
//       }}>
//         spaCy NLP · SBERT Semantic · Logistic Regression · 92.9% F1 score
//       </p>
//     </div>
//   );
// }

// // ── loading screen ────────────────────────────────────────────
// const STEPS = [
//   "Running spaCy skill matcher...",
//   "Computing SBERT embeddings...",
//   "Analyzing POS keywords...",
//   "Running ML model...",
//   "Generating skill gap report...",
// ];

// function LoadingScreen({ step }) {
//   return (
//     <div style={{
//       minHeight: "100vh", display: "flex", alignItems: "center",
//       justifyContent: "center", background: "#faf9f7", paddingTop: 60,
//     }}>
//       <div style={{ textAlign: "center", maxWidth: 480, padding: "2rem" }}>
//         <div style={{
//           width: 72, height: 72, borderRadius: "50%",
//           background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
//           display: "flex", alignItems: "center", justifyContent: "center",
//           fontSize: 32, margin: "0 auto 28px",
//           boxShadow: "0 8px 32px rgba(99,102,241,0.35)",
//           animation: "spin 2s linear infinite",
//         }}>🧠</div>

//         <h3 style={{
//           fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 800,
//           fontSize: 22, color: "#1a1814", marginBottom: 8, letterSpacing: "-0.5px",
//         }}>
//           {step < 5 ? STEPS[step] : "Almost done..."}
//         </h3>
//         <p style={{
//           fontFamily: "'Instrument Sans',sans-serif", fontSize: 14,
//           color: "#9c9890", marginBottom: 36,
//         }}>Our ML pipeline is analyzing your match</p>

//         <div style={{ maxWidth: 320, margin: "0 auto 28px", textAlign: "left" }}>
//           {STEPS.map((s, i) => (
//             <div key={i} style={{
//               display: "flex", alignItems: "center", gap: 12,
//               padding: "7px 0", opacity: i <= step ? 1 : 0.3,
//               transition: "opacity 0.4s",
//             }}>
//               <div style={{
//                 width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 fontSize: 11, fontWeight: 700,
//                 background: i < step ? "#ecfdf5" : i === step ? "#eef2ff" : "#f0ede8",
//                 color: i < step ? "#059669" : i === step ? "#6366f1" : "#b8b4ae",
//                 transition: "all 0.4s",
//               }}>
//                 {i < step ? "✓" : i === step ? "●" : i + 1}
//               </div>
//               <span style={{
//                 fontFamily: "'Instrument Sans',sans-serif", fontSize: 13,
//                 color: i <= step ? "#1a1814" : "#b8b4ae",
//               }}>{s}</span>
//             </div>
//           ))}
//         </div>

//         <div style={{ height: 5, background: "#ede8e3", borderRadius: 999, overflow: "hidden" }}>
//           <div style={{
//             height: "100%", borderRadius: 999,
//             background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
//             width: `${Math.min(((step + 1) / 5) * 100, 100)}%`,
//             transition: "width 0.6s ease",
//           }} />
//         </div>
//       </div>

//       <style>{`@keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }`}</style>
//     </div>
//   );
// }

// // ── score ring ────────────────────────────────────────────────
// function ScoreRing({ pct, meta, animating }) {
//   const r = 72, circ = 2 * Math.PI * r;
//   const displayPct = useCounter(pct, 1600, animating);
//   const dashOffset = circ - (displayPct / 100) * circ;

//   // Scoring feature: ring color reacts to live score bands.
//   const scoreVisual = (() => {
//     if (displayPct >= 85) return { ring: "#3b82f6", glow: "rgba(59,130,246,0.35)" };
//     if (displayPct >= 70) return { ring: "#8b5cf6", glow: "rgba(139,92,246,0.35)" };
//     if (displayPct >= 55) return { ring: "#f59e0b", glow: "rgba(245,158,11,0.35)" };
//     return { ring: "#ef4444", glow: "rgba(239,68,68,0.35)" };
//   })();

//   return (
//     <div style={{ position: "relative", width: 180, height: 180, margin: "0 auto" }}>
//       <svg width="180" height="180" style={{ transform: "rotate(-90deg)" }}>
//         <defs>
//           <filter id="scoreGlow" x="-50%" y="-50%" width="200%" height="200%">
//             <feGaussianBlur stdDeviation="2.5" result="blur" />
//             <feMerge>
//               <feMergeNode in="blur" />
//               <feMergeNode in="SourceGraphic" />
//             </feMerge>
//           </filter>
//         </defs>
//         <circle cx="90" cy="90" r={r} fill="none" stroke="#f0ede8" strokeWidth="10" />
//         <circle
//           cx="90" cy="90" r={r} fill="none"
//           stroke={scoreVisual.ring} strokeWidth="10"
//           strokeLinecap="round"
//           strokeDasharray={circ}
//           strokeDashoffset={dashOffset}
//           filter="url(#scoreGlow)"
//           style={{
//             transition: "stroke-dashoffset 0.05s linear, stroke 0.25s ease",
//             filter: `drop-shadow(0 0 6px ${scoreVisual.glow})`,
//           }}
//         />
//       </svg>
//       <div style={{
//         position: "absolute", inset: 0,
//         display: "flex", flexDirection: "column",
//         alignItems: "center", justifyContent: "center",
//       }}>
//         <span style={{
//           fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900,
//           fontSize: 42, lineHeight: 1, color: "#1a1814", letterSpacing: "-2px",
//         }}>{displayPct}</span>
//         <span style={{
//           fontFamily: "'Instrument Sans',sans-serif", fontSize: 13,
//           color: "#9c9890", marginTop: 2,
//         }}>/ 100</span>
//       </div>
//     </div>
//   );
// }

// // ── skill tag ─────────────────────────────────────────────────
// function SkillTag({ skill, type, delay = 0, visible }) {
//   const configs = {
//     matched: { bg: "#ecfdf5", color: "#065f46", border: "#6ee7b7", icon: "✓" },
//     missing: { bg: "#fef2f2", color: "#991b1b", border: "#fca5a5", icon: "✗" },
//     extra:   { bg: "#f8fafc", color: "#475569", border: "#e2e8f0", icon: "+" },
//   };
//   const c = configs[type];
//   return (
//     <span style={{
//       display: "inline-flex", alignItems: "center", gap: 5,
//       padding: "4px 10px", borderRadius: 6,
//       background: c.bg, color: c.color,
//       border: `1px solid ${c.border}`,
//       fontFamily: "'Instrument Sans',sans-serif", fontSize: 12, fontWeight: 500,
//       opacity: visible ? 1 : 0,
//       transform: visible ? "translateY(0)" : "translateY(8px)",
//       transition: `opacity 0.35s ease ${delay}s, transform 0.35s ease ${delay}s`,
//     }}>
//       <span style={{ fontSize: 10, fontWeight: 700 }}>{c.icon}</span>
//       {skill}
//     </span>
//   );
// }

// // ── score dimension card ──────────────────────────────────────
// function DimCard({ icon, label, sublabel, value, color, delay, visible }) {
//   const pct = Math.round(value * 100);
//   const displayed = useCounter(pct, 1200, visible);
//   const exact = Number.isFinite(value) ? value.toFixed(4) : "0.0000";
//   return (
//     <div style={{
//       background: "#fff", border: "1px solid #e7e5e0",
//       borderRadius: 16, padding: "20px",
//       opacity: visible ? 1 : 0,
//       transform: visible ? "translateY(0)" : "translateY(20px)",
//       transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
//       boxShadow: "0 2px 16px rgba(26,24,20,0.05)",
//     }}>
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <span style={{ fontSize: 22 }}>{icon}</span>
//           <div>
//             <p style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 700, fontSize: 14, color: "#1a1814", margin: 0 }}>{label}</p>
//             <p style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 11, color: "#9c9890", margin: 0 }}>{sublabel}</p>
//             <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#9c9890", margin: "3px 0 0" }}>ML: {exact}</p>
//           </div>
//         </div>
//         <span style={{
//           fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900,
//           fontSize: 28, color, letterSpacing: "-1px",
//         }}>{displayed}</span>
//       </div>
//       <div style={{ height: 6, background: "#f0ede8", borderRadius: 999, overflow: "hidden" }}>
//         <div style={{
//           height: "100%", borderRadius: 999,
//           background: color,
//           width: visible ? `${pct}%` : "0%",
//           transition: `width 1.2s cubic-bezier(0.4,0,0.2,1) ${delay + 0.1}s`,
//         }} />
//       </div>
//     </div>
//   );
// }

// // ── results section ───────────────────────────────────────────
// function ResultsSection({ result, onReset }) {
//   const [visible, setVisible] = useState(false);
//   const [skillsVisible, setSkillsVisible] = useState(false);

//   useEffect(() => {
//     const t1 = setTimeout(() => setVisible(true), 100);
//     const t2 = setTimeout(() => setSkillsVisible(true), 800);
//     return () => { clearTimeout(t1); clearTimeout(t2); };
//   }, []);

//   const pct = Math.round(result.probability * 100);
//   const meta = getMatchMeta(result.probability);
//   const isGood = result.label === 1;

//   return (
//     <div style={{ maxWidth: 900, margin: "0 auto", padding: "100px 1.5rem 5rem" }}>

//       {/* ── hero result card ── */}
//       <div style={{
//         background: "#fff", border: "1px solid #e7e5e0",
//         borderRadius: 24, overflow: "hidden", marginBottom: 20,
//         boxShadow: "0 4px 32px rgba(26,24,20,0.08)",
//         opacity: visible ? 1 : 0,
//         transform: visible ? "translateY(0)" : "translateY(24px)",
//         transition: "opacity 0.6s ease, transform 0.6s ease",
//       }}>
//         {/* colored top strip */}
//         <div style={{
//           height: 5,
//           background: `linear-gradient(90deg,${meta.ring},${meta.ring}88)`,
//         }} />

//         <div style={{ padding: "32px 36px", display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap" }}>

//           {/* ring */}
//           <div style={{ flexShrink: 0 }}>
//             <ScoreRing pct={pct} meta={meta} animating={visible} />
//           </div>

//           {/* info */}
//           <div style={{ flex: 1, minWidth: 200 }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
//               <span style={{
//                 fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 800,
//                 fontSize: 15, padding: "5px 14px", borderRadius: 8,
//                 background: meta.bg, color: meta.color,
//                 border: `1px solid ${meta.border}`,
//               }}>{isGood ? "✅" : "❌"} {meta.label}</span>
//               <span style={{
//                 fontFamily: "'JetBrains Mono',monospace", fontSize: 11,
//                 padding: "4px 10px", borderRadius: 6,
//                 background: "#f0ede8", color: "#6b6760",
//               }}>z = {result.z_value}</span>
//             </div>

//             <h2 style={{
//               fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900,
//               fontSize: "clamp(1.6rem,3vw,2.2rem)",
//               color: "#1a1814", letterSpacing: "-0.8px", lineHeight: 1.1,
//               margin: "0 0 10px",
//             }}>
//               {pct}% match probability
//             </h2>

//             <p style={{
//               fontFamily: "'Instrument Sans',sans-serif", fontSize: 14,
//               color: "#6b6760", lineHeight: 1.65, margin: "0 0 20px",
//             }}>
//               {isGood
//                 ? `Your profile is a strong fit. ${result.missing_skills.length === 0 ? "You have all required skills — apply with confidence!" : `You're missing ${result.missing_skills.length} skill${result.missing_skills.length > 1 ? "s" : ""} — worth adding before applying.`}`
//                 : `Your profile needs work for this role. ${result.missing_skills.length > 0 ? `You're missing ${result.missing_skills.length} key skills the JD requires.` : "The semantic fit is low — this may be a domain mismatch."}`
//               }
//             </p>

//             {/* quick stats */}
//             <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
//               {[
//                 { label: "JD skills", val: result.jd_skill_count },
//                 { label: "Your skills", val: result.resume_skill_count },
//                 { label: "Matched", val: result.common_skills.length },
//                 { label: "Missing", val: result.missing_skills.length },
//               ].map(s => (
//                 <div key={s.label}>
//                   <div style={{
//                     fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900,
//                     fontSize: 24, color: "#1a1814", letterSpacing: "-0.5px",
//                   }}>{s.val}</div>
//                   <div style={{
//                     fontFamily: "'Instrument Sans',sans-serif", fontSize: 11,
//                     color: "#9c9890", marginTop: 1,
//                   }}>{s.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* grade badge */}
//           <div style={{
//             width: 80, height: 80, borderRadius: 20, flexShrink: 0,
//             background: meta.bg, border: `2px solid ${meta.border}`,
//             display: "flex", flexDirection: "column",
//             alignItems: "center", justifyContent: "center",
//           }}>
//             <span style={{
//               fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900,
//               fontSize: 36, color: meta.color, lineHeight: 1,
//             }}>{meta.grade}</span>
//             <span style={{
//               fontFamily: "'Instrument Sans',sans-serif", fontSize: 10,
//               color: meta.color, opacity: 0.7,
//             }}>grade</span>
//           </div>
//         </div>
//       </div>

//       {/* ── 3 score dimensions ── */}
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
//         <DimCard icon="🎯" label="Skill Overlap" sublabel="spaCy PhraseMatcher" value={result.skill_overlap} color="#6366f1" delay={0.1} visible={visible} />
//         <DimCard icon="🧠" label="Semantic Match" sublabel="SBERT Embeddings" value={result.sbert_score} color="#8b5cf6" delay={0.2} visible={visible} />
//         <DimCard icon="📝" label="Keyword Density" sublabel="POS Analysis" value={result.pos_score} color="#0ea5e9" delay={0.3} visible={visible} />
//       </div>

//       {/* ── skill gap analysis ── */}
//       <div style={{
//         background: "#fff", border: "1px solid #e7e5e0",
//         borderRadius: 20, padding: "28px 32px", marginBottom: 20,
//         boxShadow: "0 2px 16px rgba(26,24,20,0.05)",
//         opacity: visible ? 1 : 0,
//         transform: visible ? "translateY(0)" : "translateY(20px)",
//         transition: "opacity 0.5s ease 0.4s, transform 0.5s ease 0.4s",
//       }}>
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
//           <div>
//             <h3 style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 800, fontSize: 18, color: "#1a1814", margin: "0 0 3px", letterSpacing: "-0.3px" }}>
//               Skill Gap Analysis
//             </h3>
//             <p style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 13, color: "#9c9890", margin: 0 }}>
//               Based on your skills.txt vocabulary
//             </p>
//           </div>
//           <div style={{ display: "flex", gap: 8 }}>
//             {[
//               { label: `${result.common_skills.length} matched`, bg: "#ecfdf5", color: "#065f46", border: "#6ee7b7" },
//               { label: `${result.missing_skills.length} missing`, bg: "#fef2f2", color: "#991b1b", border: "#fca5a5" },
//               { label: `${result.extra_skills.length} extra`, bg: "#f8fafc", color: "#475569", border: "#e2e8f0" },
//             ].map(b => (
//               <span key={b.label} style={{
//                 fontFamily: "'Instrument Sans',sans-serif", fontSize: 12, fontWeight: 600,
//                 padding: "4px 12px", borderRadius: 8,
//                 background: b.bg, color: b.color, border: `1px solid ${b.border}`,
//               }}>{b.label}</span>
//             ))}
//           </div>
//         </div>

//         {/* missing first — most important */}
//         {result.missing_skills.length > 0 && (
//           <div style={{ marginBottom: 20 }}>
//             <p style={{
//               fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 700, fontSize: 13,
//               color: "#991b1b", margin: "0 0 10px",
//               display: "flex", alignItems: "center", gap: 6,
//             }}>
//               <span>❌</span> Missing Skills — Add these to increase your score
//             </p>
//             <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
//               {result.missing_skills.map((s, i) => (
//                 <SkillTag key={s} skill={s} type="missing" delay={i * 0.04} visible={skillsVisible} />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* matched */}
//         {result.common_skills.length > 0 && (
//           <div style={{ marginBottom: 20 }}>
//             <p style={{
//               fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 700, fontSize: 13,
//               color: "#065f46", margin: "0 0 10px",
//               display: "flex", alignItems: "center", gap: 6,
//             }}>
//               <span>✅</span> Matched Skills — You already have these
//             </p>
//             <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
//               {result.common_skills.map((s, i) => (
//                 <SkillTag key={s} skill={s} type="matched" delay={i * 0.04} visible={skillsVisible} />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* extra */}
//         {result.extra_skills.length > 0 && (
//           <div>
//             <p style={{
//               fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 700, fontSize: 13,
//               color: "#475569", margin: "0 0 10px",
//               display: "flex", alignItems: "center", gap: 6,
//             }}>
//               <span>➕</span> Extra Skills — You have these but JD doesn't require them
//             </p>
//             <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
//               {result.extra_skills.slice(0, 20).map((s, i) => (
//                 <SkillTag key={s} skill={s} type="extra" delay={i * 0.03} visible={skillsVisible} />
//               ))}
//               {result.extra_skills.length > 20 && (
//                 <span style={{
//                   fontFamily: "'Instrument Sans',sans-serif", fontSize: 12,
//                   color: "#9c9890", padding: "4px 10px",
//                 }}>+{result.extra_skills.length - 20} more</span>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ── experience + raw scores ── */}
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>

//         {/* experience */}
//         <div style={{
//           background: "#fff", border: "1px solid #e7e5e0",
//           borderRadius: 18, padding: "22px 24px",
//           boxShadow: "0 2px 12px rgba(26,24,20,0.05)",
//           opacity: visible ? 1 : 0,
//           transition: "opacity 0.5s ease 0.5s",
//         }}>
//           <h3 style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 800, fontSize: 16, color: "#1a1814", margin: "0 0 16px" }}>
//             💼 Experience Gap
//           </h3>
//           <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//             {[
//               { label: "Experience gap", val: result.experience >= 0 ? `+${result.experience} yrs` : `${result.experience} yrs`, good: result.experience >= 0 },
//               { label: "Direction", val: result.exp_flag === 1 ? "Above requirement ✅" : result.exp_flag === 0 ? "Exact match ✅" : "Below requirement ⚠️", good: result.exp_flag >= 0 },
//             ].map(r => (
//               <div key={r.label} style={{
//                 display: "flex", justifyContent: "space-between",
//                 alignItems: "center", padding: "8px 12px",
//                 background: "#fafaf9", borderRadius: 8,
//               }}>
//                 <span style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 13, color: "#6b6760" }}>{r.label}</span>
//                 <span style={{
//                   fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600,
//                   color: r.good ? "#059669" : "#dc2626",
//                 }}>{r.val}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* raw scores */}
//         <div style={{
//           background: "#0f0e0c", border: "1px solid #2a2824",
//           borderRadius: 18, padding: "22px 24px",
//           boxShadow: "0 2px 12px rgba(26,24,20,0.05)",
//           opacity: visible ? 1 : 0,
//           transition: "opacity 0.5s ease 0.55s",
//         }}>
//           <h3 style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 800, fontSize: 16, color: "#f0ede8", margin: "0 0 16px" }}>
//             🔬 Raw Model Output
//           </h3>
//           <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, lineHeight: 2 }}>
//             {[
//               { k: "skill_overlap", v: result.skill_overlap, c: "#a78bfa" },
//               { k: "sbert_score  ", v: result.sbert_score,   c: "#818cf8" },
//               { k: "pos_score    ", v: result.pos_score,     c: "#38bdf8" },
//               { k: "z_value      ", v: result.z_value,       c: "#34d399" },
//               { k: "probability  ", v: result.probability,   c: "#fbbf24" },
//             ].map(r => (
//               <div key={r.k} style={{ display: "flex", justifyContent: "space-between" }}>
//                 <span style={{ color: "#6b6760" }}>{r.k}</span>
//                 <span style={{ color: r.c, fontWeight: 600 }}>{typeof r.v === "number" ? r.v.toFixed(4) : r.v}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── what to do next ── */}
//       <div style={{
//         background: isGood
//           ? "linear-gradient(135deg,#ecfdf5,#f0fdf4)"
//           : "linear-gradient(135deg,#fef2f2,#fff5f5)",
//         border: `1px solid ${isGood ? "#6ee7b7" : "#fca5a5"}`,
//         borderRadius: 20, padding: "28px 32px", marginBottom: 20,
//         opacity: visible ? 1 : 0,
//         transition: "opacity 0.5s ease 0.6s",
//       }}>
//         <h3 style={{
//           fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 800,
//           fontSize: 18, color: "#1a1814", margin: "0 0 12px",
//         }}>
//           {isGood ? "🚀 What to do next" : "🛠️ How to improve this score"}
//         </h3>
//         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//           {isGood ? (
//             <>
//               {result.missing_skills.length === 0 ? (
//                 <p style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 15, color: "#065f46", lineHeight: 1.7, margin: 0 }}>
//                   ✅ You have all required skills. <strong>Apply now</strong> — your profile is a strong fit for this role.
//                 </p>
//               ) : (
//                 <p style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 15, color: "#065f46", lineHeight: 1.7, margin: 0 }}>
//                   ✅ Strong match! Before applying, consider adding <strong>{result.missing_skills.slice(0, 3).join(", ")}</strong>{result.missing_skills.length > 3 ? ` and ${result.missing_skills.length - 3} more` : ""} to your resume to hit near 100%.
//                 </p>
//               )}
//               <p style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 14, color: "#059669", margin: 0 }}>
//                 💡 Tip: Make sure your resume uses the <strong>exact keywords</strong> from the JD — ATS systems do exact matching.
//               </p>
//             </>
//           ) : (
//             <>
//               {result.missing_skills.length > 0 && (
//                 <p style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 15, color: "#991b1b", lineHeight: 1.7, margin: 0 }}>
//                   ❌ Learn or add these skills first: <strong>{result.missing_skills.slice(0, 5).join(", ")}</strong>{result.missing_skills.length > 5 ? ` and ${result.missing_skills.length - 5} more` : ""}.
//                 </p>
//               )}
//               <p style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 14, color: "#dc2626", margin: 0 }}>
//                 💡 Tip: The semantic score ({Math.round(result.sbert_score * 100)}%) suggests your experience domain doesn't closely match this role. Consider applying to roles closer to your background.
//               </p>
//             </>
//           )}
//         </div>
//       </div>

//       {/* ── action buttons ── */}
//       <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
//         <button onClick={onReset} style={{
//           fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 800, fontSize: 14,
//           padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer",
//           background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
//           color: "#fff", boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
//         }}>🔄 Analyze another resume</button>

//         <a href="/roast" style={{
//           fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 700, fontSize: 14,
//           padding: "12px 24px", borderRadius: 10, cursor: "pointer",
//           background: "#fff", border: "1px solid #e7e5e0", color: "#1a1814",
//           textDecoration: "none", display: "inline-flex", alignItems: "center",
//         }}>🔥 Roast my resume</a>

//         <button
//           onClick={() => {
//             const text = `ResumeIQ Match Score: ${pct}%\nMatch: ${meta.label}\nSkill Overlap: ${Math.round(result.skill_overlap * 100)}%\nMissing: ${result.missing_skills.join(", ") || "None"}`;
//             navigator.clipboard.writeText(text);
//             alert("Result copied to clipboard!");
//           }}
//           style={{
//             fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 700, fontSize: 14,
//             padding: "12px 24px", borderRadius: 10, cursor: "pointer",
//             background: "#fff", border: "1px solid #e7e5e0", color: "#1a1814",
//           }}>📋 Copy result</button>
//       </div>
//     </div>
//   );
// }

// // ── main page ─────────────────────────────────────────────────
// export default function MatcherPage() {
//   useFonts();

//   const [scrolled, setScrolled]   = useState(false);
//   const [phase, setPhase]         = useState("upload");
//   const [loadStep, setLoadStep]   = useState(0);
//   const [result, setResult]       = useState(null);
//   const [error, setError]         = useState(null);

//   useEffect(() => {
//     const h = () => setScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", h);
//     return () => window.removeEventListener("scroll", h);
//   }, []);

//   async function handleAnalyze(resumeText, jdText, experience) {
//     setPhase("loading");
//     setLoadStep(0);
//     setError(null);

//     let s = 0;
//     const iv = setInterval(() => { s++; setLoadStep(s); if (s >= 4) clearInterval(iv); }, 600);

//     try {
//       const data = await analyzeResume(resumeText, jdText, experience);
//       clearInterval(iv);
//       setLoadStep(5);
//       setResult(data);
//       setTimeout(() => setPhase("results"), 400);
//     } catch (err) {
//       clearInterval(iv);
//       setError("Could not connect to backend. Make sure the API is running on port 8000.");
//       setPhase("upload");
//     }
//   }

//   function reset() {
//     setPhase("upload");
//     setLoadStep(0);
//     setResult(null);
//     setError(null);
//   }

//   return (
//     <div style={{ minHeight: "100vh", background: "#faf9f7" }}>
//       <Navbar scrolled={scrolled} />

//       {phase === "upload" && (
//         <UploadSection onAnalyze={handleAnalyze} loading={false} error={error} />
//       )}
//       {phase === "loading" && <LoadingScreen step={loadStep} />}
//       {phase === "results" && result && (
//         <ResultsSection result={result} onReset={reset} />
//       )}
//     </div>
//   );
// }




// import { useState, useEffect, useRef } from "react";
// import {
//   AlertTriangle,
//   ArrowLeft,
//   Brain,
//   Briefcase,
//   Building2,
//   Check,
//   Copy,
//   FileText,
//   Flame,
//   FolderOpen,
//   Lightbulb,
//   Plus,
//   Rocket,
//   RotateCcw,
//   Search,
//   Target,
//   Wrench,
//   X,
//   XCircle,
//   Zap,
// } from "lucide-react";

// // ── Google Fonts ──────────────────────────────────────────────
// function useFonts() {
//   useEffect(() => {
//     const l = document.createElement("link");
//     l.rel = "stylesheet";
//     l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap";
//     document.head.appendChild(l);
//     const style = document.createElement("style");
//     style.textContent = `
//       @keyframes fadeUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
//       @keyframes scaleIn { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
//       @keyframes shimmer { 0%,100%{opacity:0.5} 50%{opacity:1} }
//       @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
//       @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
//       @keyframes barGrow { from{width:0} to{width:var(--w)} }
//       @keyframes tagPop { from{opacity:0;transform:scale(0.8) translateY(6px)} to{opacity:1;transform:scale(1) translateY(0)} }
//       * { box-sizing: border-box; margin: 0; padding: 0; }
//       html { scroll-behavior: smooth; }
//       body { background: #f7f5f0; }
//     `;
//     document.head.appendChild(style);
//   }, []);
// }

// // ── API ───────────────────────────────────────────────────────
// async function analyzeResume(resumeText, jdText, experience) {
//   const res = await fetch("http://localhost:8000/predict", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ resume_text: resumeText, jd_text: jdText, experience }),
//   });
//   if (!res.ok) throw new Error(`API error: ${res.status}`);
//   return res.json();
// }

// // ── Animated number ───────────────────────────────────────────
// function useAnimNum(target, duration = 1600, trigger) {
//   const [v, setV] = useState(0);

//   useEffect(() => {
//     if (!trigger) return;

//     let start = null;

//     const raf = (ts) => {
//       if (!start) start = ts;
//       const p = Math.min((ts - start) / duration, 1);
//       const e = 1 - Math.pow(1 - p, 4);

//       setV(Math.floor(e * target));

//       if (p < 1) requestAnimationFrame(raf);
//     };

//     requestAnimationFrame(raf);
//   }, [target, trigger, duration]);

//   return v;
// }

// // ── Score meta ────────────────────────────────────────────────
// function getMeta(prob) {
//   const p = Math.round(prob * 100);
//   if (p >= 80) return { verdict: "Strong Match", accent: "#16a34a", light: "#f0fdf4", mid: "#bbf7d0", grade: "A", icon: Target };
//   if (p >= 60) return { verdict: "Good Fit", accent: "#2563eb", light: "#eff6ff", mid: "#bfdbfe", grade: "B", icon: Check };
//   if (p >= 40) return { verdict: "Partial Match", accent: "#d97706", light: "#fffbeb", mid: "#fde68a", grade: "C", icon: Zap };
//   return { verdict: "Poor Match", accent: "#dc2626", light: "#fef2f2", mid: "#fecaca", grade: "D", icon: X };
// }

// // ─────────────────────────────────────────────────────────────
// // NAVBAR
// // ─────────────────────────────────────────────────────────────
// function Navbar({ scrolled }) {
//   return (
//     <nav style={{
//       position: "fixed", top: 0, left: 0, right: 0, zIndex: 300,
//       height: 62, padding: "0 2.5rem",
//       background: scrolled ? "rgba(247,245,240,0.97)" : "transparent",
//       backdropFilter: scrolled ? "blur(20px)" : "none",
//       borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
//       display: "flex", alignItems: "center", justifyContent: "space-between",
//       transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
//     }}>
//       <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
//         <div style={{
//           width: 34, height: 34, borderRadius: 10,
//           background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
//           display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
//           boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
//         }}><Zap size={18} color="#fff" strokeWidth={2.2} /></div>
//         <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 20, color: "#1c1917", letterSpacing: "-0.5px" }}>ResumeIQ</span>
//       </a>
//       <div style={{ display: "flex", gap: 36 }}>
//         {[["Resume Matcher", "#", true], ["Resume Roast", "#", false], ["Company Intel", "#", false]].map(([label, href, active]) => (
//           <a key={label} href={href} style={{
//             fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: active ? 600 : 400,
//             color: active ? "#6366f1" : "#78716c", textDecoration: "none",
//             borderBottom: active ? "2px solid #6366f1" : "2px solid transparent",
//             paddingBottom: 2, transition: "color 0.2s",
//           }}>{label}</a>
//         ))}
//       </div>
//       <a href="/" style={{
//         fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500,
//         padding: "8px 18px", borderRadius: 20, border: "1px solid #d6d3cd",
//         textDecoration: "none", color: "#57534e", background: "transparent",
//         transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 6,
//       }}><ArrowLeft size={14} /> Home</a>
//     </nav>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // UPLOAD PAGE
// // ─────────────────────────────────────────────────────────────
// function UploadPage({ onAnalyze, error }) {
//   const [resumeText, setResumeText] = useState("");
//   const [jdText, setJdText] = useState("");
//   const [myExp, setMyExp] = useState("");
//   const [jdExp, setJdExp] = useState("");
//   const [tab, setTab] = useState("paste");
//   const [fileName, setFileName] = useState(null);
//   const [dragging, setDragging] = useState(false);
//   const fileRef = useRef();

//   function handleFile(file) {
//     if (!file) return;
//     setFileName(file.name);
//     const r = new FileReader();
//     r.onload = e => setResumeText(e.target.result);
//     r.readAsText(file);
//   }

//   const gap = myExp !== "" && jdExp !== "" ? parseInt(myExp) - parseInt(jdExp) : null;
//   const ready = resumeText.length > 50 && jdText.length > 50;

//   return (
//     <div style={{ minHeight: "100vh", background: "#f7f5f0", paddingTop: 62 }}>

//       {/* hero header */}
//       <div style={{
//         textAlign: "center", padding: "64px 2rem 48px",
//         animation: "fadeUp 0.7s ease both",
//       }}>
//         <div style={{
//           display: "inline-block",
//           background: "linear-gradient(135deg,#eef2ff,#faf5ff)",
//           border: "1px solid #e0e7ff", borderRadius: 999,
//           padding: "6px 20px", marginBottom: 28,
//         }}>
//           <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, color: "#6366f1", letterSpacing: 1.2, textTransform: "uppercase" }}>
//             ML-Powered · spaCy + SBERT · 92.9% F1
//           </span>
//         </div>

//         <h1 style={{
//           fontFamily: "'Playfair Display',serif",
//           fontWeight: 900, fontSize: "clamp(2.4rem,5vw,4rem)",
//           color: "#1c1917", letterSpacing: "-2px", lineHeight: 1.05,
//           margin: "0 0 20px",
//         }}>
//           Does your resume<br />
//           <em style={{ color: "#6366f1", fontStyle: "italic" }}>actually</em> fit the job?
//         </h1>
//         <p style={{
//           fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 300,
//           color: "#78716c", maxWidth: 500, margin: "0 auto", lineHeight: 1.7,
//         }}>
//           Paste your resume and any job description. Three scoring dimensions. Real insight.
//         </p>
//       </div>

//       {/* input area */}
//       <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 1.5rem 80px" }}>

//         {/* two columns */}
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 16, animation: "fadeUp 0.7s 0.15s ease both" }}>

//           {/* resume card */}
//           <div style={{ background: "#fff", borderRadius: 24, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.04)" }}>
//             <div style={{
//               padding: "18px 22px 14px", borderBottom: "1px solid #f5f4f1",
//               display: "flex", alignItems: "center", justifyContent: "space-between",
//             }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                 <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#6366f1" }}><FileText size={18} /></span>
//                 <div>
//                   <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 15, color: "#1c1917", margin: 0 }}>Your Resume</p>
//                   <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#a8a29e", margin: 0, fontWeight: 300 }}>paste text or upload file</p>
//                 </div>
//               </div>
//               {/* tab toggle */}
//               <div style={{ background: "#f5f4f1", borderRadius: 10, padding: 3, display: "flex" }}>
//                 {["paste", "upload"].map(t => (
//                   <button key={t} onClick={() => setTab(t)} style={{
//                     fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: tab === t ? 600 : 400,
//                     padding: "5px 14px", borderRadius: 8, border: "none", cursor: "pointer",
//                     background: tab === t ? "#fff" : "transparent",
//                     color: tab === t ? "#1c1917" : "#a8a29e",
//                     boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
//                     transition: "all 0.2s",
//                   }}>{t}</button>
//                 ))}
//               </div>
//             </div>
//             <div style={{ padding: "16px 22px 18px" }}>
//               {tab === "paste" ? (
//                 <textarea value={resumeText} onChange={e => setResumeText(e.target.value)}
//                   placeholder={"Paste your complete resume here...\n\nTip: Include your full skills section, experience bullets, and education for best results."}
//                   style={{
//                     width: "100%", height: 260, resize: "none",
//                     border: "1.5px solid #e7e5e0", borderRadius: 14,
//                     padding: "14px 16px", fontSize: 13, lineHeight: 1.7,
//                     fontFamily: "'Outfit',sans-serif", fontWeight: 300,
//                     color: "#1c1917", background: "#fafaf9",
//                     outline: "none", transition: "border-color 0.2s",
//                   }}
//                   onFocus={e => e.target.style.borderColor = "#6366f1"}
//                   onBlur={e => e.target.style.borderColor = "#e7e5e0"}
//                 />
//               ) : (
//                 <div onClick={() => fileRef.current.click()}
//                   onDragOver={e => { e.preventDefault(); setDragging(true); }}
//                   onDragLeave={() => setDragging(false)}
//                   onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
//                   style={{
//                     height: 260, border: `2px dashed ${dragging ? "#6366f1" : fileName ? "#16a34a" : "#d6d3cd"}`,
//                     borderRadius: 14, display: "flex", flexDirection: "column",
//                     alignItems: "center", justifyContent: "center", cursor: "pointer",
//                     background: dragging ? "#eef2ff" : fileName ? "#f0fdf4" : "#fafaf9",
//                     transition: "all 0.25s",
//                   }}>
//                   <input ref={fileRef} type="file" accept=".txt,.pdf,.docx" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
//                   <span style={{ marginBottom: 12, display: "inline-flex", alignItems: "center", justifyContent: "center", color: fileName ? "#16a34a" : "#78716c" }}>
//                     {fileName ? <Check size={36} /> : <FolderOpen size={36} />}
//                   </span>
//                   <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 15, color: fileName ? "#16a34a" : "#1c1917", margin: "0 0 4px" }}>
//                     {fileName || "Drop file here"}
//                   </p>
//                   <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#a8a29e", fontWeight: 300, margin: 0 }}>
//                     {fileName ? "Click to replace" : "TXT · DOCX · PDF"}
//                   </p>
//                 </div>
//               )}
//               <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
//                 <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: resumeText.length > 100 ? "#16a34a" : "#a8a29e" }}>
//                   {resumeText.length} chars
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* JD card */}
//           <div style={{ background: "#fff", borderRadius: 24, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.04)" }}>
//             <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid #f5f4f1", display: "flex", alignItems: "center", gap: 10 }}>
//               <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#16a34a" }}><Building2 size={18} /></span>
//               <div>
//                 <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 15, color: "#1c1917", margin: 0 }}>Job Description</p>
//                 <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#a8a29e", margin: 0, fontWeight: 300 }}>any JD from any company</p>
//               </div>
//             </div>
//             <div style={{ padding: "16px 22px 18px" }}>
//               <textarea value={jdText} onChange={e => setJdText(e.target.value)}
//                 placeholder={"Paste the job description here...\n\nWorks with any company:\n• Google, Amazon, Microsoft\n• Startups and mid-size firms\n• Any role, any domain"}
//                 style={{
//                   width: "100%", height: 260, resize: "none",
//                   border: "1.5px solid #e7e5e0", borderRadius: 14,
//                   padding: "14px 16px", fontSize: 13, lineHeight: 1.7,
//                   fontFamily: "'Outfit',sans-serif", fontWeight: 300,
//                   color: "#1c1917", background: "#fafaf9",
//                   outline: "none", transition: "border-color 0.2s",
//                 }}
//                 onFocus={e => e.target.style.borderColor = "#6366f1"}
//                 onBlur={e => e.target.style.borderColor = "#e7e5e0"}
//               />
//               <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
//                 <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: jdText.length > 100 ? "#16a34a" : "#a8a29e" }}>
//                   {jdText.length} chars
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* experience bar */}
//         <div style={{
//           background: "#fff", borderRadius: 18, padding: "18px 24px",
//           marginBottom: 16, display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap",
//           boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
//           animation: "fadeUp 0.7s 0.25s ease both",
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#57534e" }}><Briefcase size={18} /></span>
//             <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 15, color: "#1c1917" }}>Experience</span>
//             <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#a8a29e", fontWeight: 300 }}>optional</span>
//           </div>
//           {[["Your years", myExp, setMyExp], ["JD requires", jdExp, setJdExp]].map(([label, val, setter]) => (
//             <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <label style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#78716c", fontWeight: 400 }}>{label}</label>
//               <input type="number" min="0" max="30" value={val} onChange={e => setter(e.target.value)} placeholder="0"
//                 style={{
//                   width: 68, padding: "7px 10px", borderRadius: 10,
//                   border: "1.5px solid #e7e5e0", fontFamily: "'DM Mono',monospace",
//                   fontSize: 14, color: "#1c1917", background: "#fafaf9",
//                   outline: "none", textAlign: "center",
//                 }} />
//             </div>
//           ))}
//           {gap !== null && (
//             <div style={{
//               padding: "7px 16px", borderRadius: 20,
//               background: gap >= 0 ? "#f0fdf4" : "#fef2f2",
//               border: `1px solid ${gap >= 0 ? "#bbf7d0" : "#fecaca"}`,
//               display: "flex", alignItems: "center", gap: 8,
//             }}>
//               <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", color: gap >= 0 ? "#15803d" : "#dc2626" }}>
//                 {gap >= 0 ? <Check size={14} /> : <AlertTriangle size={14} />}
//               </span>
//               <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 500, color: gap >= 0 ? "#15803d" : "#dc2626" }}>
//                 {gap >= 0 ? `+${gap}` : gap} yrs {gap >= 0 ? "above req." : "below req."}
//               </span>
//             </div>
//           )}
//         </div>

//         {/* error */}
//         {error && (
//           <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "12px 18px", marginBottom: 14, fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#dc2626" }}>
//             <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><XCircle size={14} /> {error}</span>
//           </div>
//         )}

//         {/* analyze button */}
//         <button onClick={() => onAnalyze(resumeText, jdText, gap ?? 0)} disabled={!ready}
//           style={{
//             width: "100%", padding: "18px", borderRadius: 18, border: "none",
//             fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 18,
//             letterSpacing: "-0.5px",
//             cursor: ready ? "pointer" : "not-allowed",
//             background: ready ? "linear-gradient(135deg,#1c1917,#292524)" : "#e7e5e0",
//             color: ready ? "#f7f5f0" : "#a8a29e",
//             boxShadow: ready ? "0 8px 32px rgba(28,25,23,0.25), 0 2px 8px rgba(28,25,23,0.15)" : "none",
//             transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
//             animation: "fadeUp 0.7s 0.35s ease both",
//           }}
//           onMouseEnter={e => { if (ready) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(28,25,23,0.3)"; }}}
//           onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ready ? "0 8px 32px rgba(28,25,23,0.25)" : "none"; }}
//         >
//           {ready ? "Analyze My Resume Match →" : "Paste resume + job description to continue"}
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // LOADING
// // ─────────────────────────────────────────────────────────────
// const STEPS = ["Running spaCy skill matcher", "Computing SBERT embeddings", "Analyzing POS keywords", "Running ML model", "Building your report"];

// function LoadingPage({ step }) {
//   return (
//     <div style={{
//       minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
//       background: "#f7f5f0", flexDirection: "column", gap: 0,
//     }}>
//       <div style={{ textAlign: "center", maxWidth: 440, padding: "2rem" }}>
//         {/* spinner */}
//         <div style={{
//           width: 80, height: 80, borderRadius: "50%", margin: "0 auto 36px",
//           border: "3px solid #e7e5e0", borderTopColor: "#6366f1",
//           animation: "spin 1s linear infinite",
//         }} />
//         <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 26, color: "#1c1917", letterSpacing: "-0.8px", marginBottom: 8 }}>
//           Analyzing your match
//         </h2>
//         <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#a8a29e", fontWeight: 300, marginBottom: 40 }}>
//           Our ML pipeline is crunching the numbers
//         </p>
//         <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//           {STEPS.map((s, i) => (
//             <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, opacity: i <= step ? 1 : 0.3, transition: "opacity 0.5s" }}>
//               <div style={{
//                 width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 fontFamily: "'DM Mono',monospace", fontSize: 12, fontWeight: 500,
//                 background: i < step ? "#1c1917" : i === step ? "#6366f1" : "#f0ede8",
//                 color: i < step || i === step ? "#fff" : "#a8a29e",
//                 transition: "all 0.4s",
//               }}>
//                 {i < step ? "✓" : i + 1}
//               </div>
//               <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: i <= step ? "#1c1917" : "#a8a29e", fontWeight: i === step ? 600 : 300 }}>
//                 {s}
//               </span>
//             </div>
//           ))}
//         </div>
//         <div style={{ marginTop: 36, height: 3, background: "#e7e5e0", borderRadius: 999, overflow: "hidden" }}>
//           <div style={{
//             height: "100%", borderRadius: 999,
//             background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
//             width: `${Math.min(((step + 1) / 5) * 100, 100)}%`,
//             transition: "width 0.6s ease",
//           }} />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // RESULTS PAGE
// // ─────────────────────────────────────────────────────────────
// function ResultsPage({ result, onReset }) {
//   const [show, setShow] = useState(false);
//   const [showTags, setShowTags] = useState(false);

//   useEffect(() => {
//     setTimeout(() => setShow(true), 80);
//     setTimeout(() => setShowTags(true), 900);
//   }, []);

//   const pct = Math.round(result.probability * 100);
//   const meta = getMeta(result.probability);
//   const VerdictIcon = meta.icon;
//   const isGood = result.label === 1;
//   const animPct = useAnimNum(pct, 1800, show);

//   // score ring
//   const R = 70, C = 2 * Math.PI * R;
//   const offset = C - (animPct / 100) * C;

//   return (
//     <div style={{ minHeight: "100vh", background: "#f7f5f0", paddingTop: 62 }}>

//       {/* ═══ HERO ═══ */}
//       <div style={{
//         maxWidth: 1020, margin: "0 auto", padding: "52px 1.5rem 0",
//         opacity: show ? 1 : 0, transform: show ? "none" : "translateY(28px)",
//         transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)",
//       }}>

//         {/* verdict pill */}
//         <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
//           <div style={{
//             background: meta.light, border: `1px solid ${meta.mid}`,
//             borderRadius: 999, padding: "7px 18px",
//             fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600,
//             color: meta.accent, display: "flex", alignItems: "center", gap: 6,
//           }}>
//             <VerdictIcon size={14} /> {meta.verdict}
//           </div>
//           <div style={{
//             background: "#fff", border: "1px solid #e7e5e0",
//             borderRadius: 999, padding: "7px 18px",
//             fontFamily: "'DM Mono',monospace", fontSize: 12,
//             color: "#78716c",
//           }}>
//             z-score = {result.z_value}
//           </div>
//         </div>

//         {/* main hero grid */}
//         <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 48, alignItems: "center", marginBottom: 40, flexWrap: "wrap" }}>

//           {/* ring */}
//           <div style={{ position: "relative", width: 180, height: 180, flexShrink: 0 }}>
//             <svg width="180" height="180" style={{ transform: "rotate(-90deg)" }}>
//               <circle cx="90" cy="90" r={R} fill="none" stroke="#ede9e3" strokeWidth="12" />
//               <circle cx="90" cy="90" r={R} fill="none"
//                 stroke={meta.accent} strokeWidth="12" strokeLinecap="round"
//                 strokeDasharray={C} strokeDashoffset={offset}
//                 style={{ transition: "stroke-dashoffset 0.05s linear, stroke 0.3s", filter: `drop-shadow(0 0 8px ${meta.accent}66)` }}
//               />
//             </svg>
//             <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
//               <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 52, color: "#1c1917", lineHeight: 1, letterSpacing: "-3px" }}>{animPct}</span>
//               <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#a8a29e", fontWeight: 300, marginTop: 2 }}>out of 100</span>
//             </div>
//           </div>

//           {/* headline */}
//           <div>
//             <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(2rem,4vw,3rem)", color: "#1c1917", letterSpacing: "-1.5px", lineHeight: 1.1, margin: "0 0 16px" }}>
//               {isGood
//                 ? result.missing_skills.length === 0
//                   ? <>You're a <em style={{ color: meta.accent, fontStyle: "italic" }}>perfect</em> match.</>
//                   : <>Strong fit.<br /><em style={{ color: meta.accent, fontStyle: "italic" }}>A few gaps</em> to close.</>
//                 : <><em style={{ color: meta.accent, fontStyle: "italic" }}>Not quite</em> there yet.</>
//               }
//             </h1>
//             <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, color: "#78716c", lineHeight: 1.7, fontWeight: 300, maxWidth: 480 }}>
//               {isGood
//                 ? result.missing_skills.length === 0
//                   ? "Your resume covers all required skills. Apply with confidence — you're a strong candidate for this role."
//                   : `Your profile is well-aligned. Adding ${result.missing_skills.length} missing skill${result.missing_skills.length > 1 ? "s" : ""} to your resume could push you to the top of the pile.`
//                 : `This role needs significant alignment. Focus on the missing skills below and consider roles closer to your current profile.`
//               }
//             </p>
//           </div>

//           {/* grade */}
//           <div style={{
//             width: 90, height: 90, borderRadius: 24, flexShrink: 0,
//             background: meta.light, border: `2px solid ${meta.mid}`,
//             display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
//             boxShadow: `0 8px 28px ${meta.accent}22`,
//           }}>
//             <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 44, color: meta.accent, lineHeight: 1 }}>{meta.grade}</span>
//             <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: meta.accent, opacity: 0.6, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 2 }}>grade</span>
//           </div>
//         </div>

//         {/* 4 quick stats */}
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 32 }}>
//           {[
//             { n: result.jd_skill_count,        l: "JD Skills Required",  c: "#6366f1" },
//             { n: result.resume_skill_count,     l: "Skills In Resume",    c: "#8b5cf6" },
//             { n: result.common_skills.length,   l: "Skills Matched",      c: "#16a34a" },
//             { n: result.missing_skills.length,  l: "Skills Missing",      c: result.missing_skills.length > 0 ? "#dc2626" : "#16a34a" },
//           ].map(s => (
//             <div key={s.l} style={{
//               background: "#fff", borderRadius: 18, padding: "20px 22px",
//               boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
//               borderTop: `3px solid ${s.c}`,
//             }}>
//               <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 34, color: "#1c1917", letterSpacing: "-1px", lineHeight: 1 }}>{s.n}</div>
//               <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#a8a29e", fontWeight: 300, marginTop: 6, lineHeight: 1.4 }}>{s.l}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ═══ 3 SCORE SECTIONS ═══ */}
//       <div style={{
//         maxWidth: 1020, margin: "0 auto", padding: "0 1.5rem",
//         display: "flex", flexDirection: "column", gap: 16,
//         opacity: show ? 1 : 0, transition: "opacity 0.7s 0.3s ease",
//       }}>

//         {/* skill overlap section */}
//         <ScoreSection
//           icon={Target} tag="SKILL OVERLAP" tagColor="#6366f1" tagBg="#eef2ff"
//           title="Skill Match Analysis"
//           subtitle="How many skills from the JD are present in your resume"
//           score={Math.round(result.skill_overlap * 100)}
//           scoreColor="#6366f1"
//           description={
//             result.skill_overlap === 1
//               ? "Perfect — your resume contains every skill the JD asks for."
//               : result.skill_overlap >= 0.7
//               ? "Strong coverage. Most required skills are present in your resume."
//               : result.skill_overlap >= 0.4
//               ? "Partial coverage. Several important skills are missing."
//               : "Low coverage. Your resume needs significant skill additions."
//           }
//           tip={result.missing_skills.length > 0
//             ? `Add "${result.missing_skills[0]}"${result.missing_skills[1] ? ` and "${result.missing_skills[1]}"` : ""} to your skills section to improve this score.`
//             : "Great! Keep maintaining this skill breadth for similar roles."
//           }
//           show={show}
//         />

//         {/* semantic match section */}
//         <ScoreSection
//           icon={Brain} tag="SEMANTIC MATCH" tagColor="#7c3aed" tagBg="#faf5ff"
//           title="Semantic Similarity"
//           subtitle="How similar your language and experience domain is to the JD"
//           score={Math.round(result.sbert_score * 100)}
//           scoreColor="#7c3aed"
//           description={
//             result.sbert_score >= 0.7
//               ? "Excellent — your resume language and experience domain closely mirrors this JD."
//               : result.sbert_score >= 0.5
//               ? "Good alignment. Your background is contextually relevant to this role."
//               : result.sbert_score >= 0.35
//               ? "Moderate alignment. Your experience domain partially overlaps with the JD."
//               : "Low alignment. Your background may be in a different domain than this role requires."
//           }
//           tip="Use language and action verbs from the JD in your experience bullets to improve semantic alignment."
//           show={show}
//           delay={0.1}
//         />

//         {/* POS keyword section */}
//         <ScoreSection
//           icon={Search} tag="KEYWORD DENSITY" tagColor="#0369a1" tagBg="#eff6ff"
//           title="Keyword & POS Analysis"
//           subtitle="How well your resume's key terms and noun phrases match the JD"
//           score={Math.round(result.pos_score * 100)}
//           scoreColor="#0369a1"
//           description={
//             result.pos_score >= 0.7
//               ? "Excellent keyword density — your resume uses the same core terminology as the JD."
//               : result.pos_score >= 0.5
//               ? "Good keyword coverage. Your terminology broadly aligns with the job posting."
//               : result.pos_score >= 0.3
//               ? "Moderate keyword match. Adding more domain-specific terms would help."
//               : "Low keyword density. Your resume may use different terminology than this JD."
//           }
//           tip="Mirror exact phrases from the JD requirements section in your bullet points and summary."
//           show={show}
//           delay={0.2}
//         />

//         {/* ═══ SKILL GAP ═══ */}
//         <div style={{
//           background: "#fff", borderRadius: 24,
//           boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
//           overflow: "hidden",
//           opacity: show ? 1 : 0, transform: show ? "none" : "translateY(20px)",
//           transition: "all 0.6s 0.35s ease",
//         }}>
//           <div style={{ padding: "28px 32px 24px", borderBottom: "1px solid #f5f4f1" }}>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
//               <div>
//                 <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
//                   <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 600, color: "#78716c", letterSpacing: 1.5, textTransform: "uppercase" }}>Skill Gap Report</span>
//                 </div>
//                 <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 20, color: "#1c1917", margin: 0, letterSpacing: "-0.5px" }}>
//                   What you have vs. what they need
//                 </h3>
//               </div>
//               <div style={{ display: "flex", gap: 8 }}>
//                 {[
//                   { n: result.common_skills.length, label: "matched", bg: "#f0fdf4", c: "#15803d", border: "#bbf7d0" },
//                   { n: result.missing_skills.length, label: "missing", bg: "#fef2f2", c: "#dc2626", border: "#fecaca" },
//                   { n: result.extra_skills.length, label: "extra", bg: "#fafaf9", c: "#78716c", border: "#e7e5e0" },
//                 ].map(b => (
//                   <div key={b.label} style={{ padding: "6px 14px", borderRadius: 20, background: b.bg, border: `1px solid ${b.border}`, display: "flex", alignItems: "center", gap: 6 }}>
//                     <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 16, color: b.c }}>{b.n}</span>
//                     <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: b.c, fontWeight: 300 }}>{b.label}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div style={{ padding: "24px 32px 28px", display: "flex", flexDirection: "column", gap: 28 }}>
//             {/* missing — most critical */}
//             {result.missing_skills.length > 0 && (
//               <div>
//                 <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
//                   <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#dc2626" }} />
//                   <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, color: "#dc2626", letterSpacing: 1, textTransform: "uppercase" }}>Missing — Add these to increase your score</span>
//                 </div>
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//                   {result.missing_skills.map((s, i) => (
//                     <span key={s} style={{
//                       fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500,
//                       padding: "6px 14px", borderRadius: 20,
//                       background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca",
//                       opacity: showTags ? 1 : 0,
//                       transform: showTags ? "none" : "translateY(6px) scale(0.9)",
//                       transition: `all 0.35s ease ${i * 0.05}s`,
//                     }}><span style={{ display: "inline-flex", alignItems: "center", marginRight: 6, verticalAlign: "text-bottom" }}><X size={12} /></span>{s}</span>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {/* matched */}
//             {result.common_skills.length > 0 && (
//               <div>
//                 <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
//                   <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a" }} />
//                   <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, color: "#16a34a", letterSpacing: 1, textTransform: "uppercase" }}>Matched — Already in your resume</span>
//                 </div>
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//                   {result.common_skills.map((s, i) => (
//                     <span key={s} style={{
//                       fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500,
//                       padding: "6px 14px", borderRadius: 20,
//                       background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0",
//                       opacity: showTags ? 1 : 0,
//                       transform: showTags ? "none" : "translateY(6px) scale(0.9)",
//                       transition: `all 0.35s ease ${i * 0.04 + 0.2}s`,
//                     }}><span style={{ display: "inline-flex", alignItems: "center", marginRight: 6, verticalAlign: "text-bottom" }}><Check size={12} /></span>{s}</span>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {/* extra */}
//             {result.extra_skills.length > 0 && (
//               <div>
//                 <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
//                   <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#a8a29e" }} />
//                   <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, color: "#78716c", letterSpacing: 1, textTransform: "uppercase" }}>Extra — You have these, JD didn't ask</span>
//                 </div>
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//                   {result.extra_skills.slice(0, 18).map((s, i) => (
//                     <span key={s} style={{
//                       fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 400,
//                       padding: "6px 14px", borderRadius: 20,
//                       background: "#fafaf9", color: "#78716c", border: "1px solid #e7e5e0",
//                       opacity: showTags ? 1 : 0,
//                       transform: showTags ? "none" : "translateY(6px) scale(0.9)",
//                       transition: `all 0.35s ease ${i * 0.03 + 0.4}s`,
//                     }}><span style={{ display: "inline-flex", alignItems: "center", marginRight: 6, verticalAlign: "text-bottom" }}><Plus size={12} /></span>{s}</span>
//                   ))}
//                   {result.extra_skills.length > 18 && (
//                     <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#a8a29e", padding: "6px 14px" }}>
//                       +{result.extra_skills.length - 18} more
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ═══ EXPERIENCE ═══ */}
//         <div style={{
//           background: "#fff", borderRadius: 24, padding: "28px 32px",
//           boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
//           opacity: show ? 1 : 0, transition: "opacity 0.6s 0.45s ease",
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
//             <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 600, color: "#78716c", letterSpacing: 1.5, textTransform: "uppercase" }}>Experience Analysis</span>
//           </div>
//           <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 20, color: "#1c1917", margin: "0 0 20px", letterSpacing: "-0.5px" }}>
//             Years of experience
//           </h3>
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
//             {[
//               { label: "Gap (your yrs − JD req)", val: result.experience >= 0 ? `+${result.experience}` : String(result.experience), good: result.experience >= 0 },
//               { label: "Direction", val: result.exp_flag === 1 ? "Above requirement" : result.exp_flag === 0 ? "Exact match" : "Below requirement", good: result.exp_flag >= 0 },
//               { label: "Impact on score", val: result.exp_flag === 1 ? "Positive ↑" : result.exp_flag === 0 ? "Neutral →" : "Negative ↓", good: result.exp_flag >= 0 },
//             ].map(r => (
//               <div key={r.label} style={{ background: "#fafaf9", borderRadius: 14, padding: "16px 18px" }}>
//                 <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#a8a29e", fontWeight: 300, marginBottom: 8, letterSpacing: 0.5 }}>{r.label}</div>
//                 <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 16, fontWeight: 500, color: r.good ? "#15803d" : "#dc2626" }}>{r.val}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ═══ NEXT STEPS ═══ */}
//         <div style={{
//           background: isGood ? "#1c1917" : "#1c1917",
//           borderRadius: 24, padding: "36px 40px",
//           boxShadow: "0 8px 40px rgba(28,25,23,0.2)",
//           opacity: show ? 1 : 0, transition: "opacity 0.6s 0.55s ease",
//         }}>
//           <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 22, color: "#f7f5f0", margin: "0 0 20px", letterSpacing: "-0.5px", display: "flex", alignItems: "center", gap: 8 }}>
//             {isGood ? <Rocket size={18} /> : <Wrench size={18} />} {isGood ? "Your next move" : "How to improve"}
//           </h3>
//           <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//             {isGood ? (
//               <>
//                 <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: "#d6d3cd", lineHeight: 1.75, margin: 0, fontWeight: 300 }}>
//                   {result.missing_skills.length === 0
//                     ? "You have everything this role requires. Submit your application - you are a genuinely strong candidate."
//                     : `Strong match. Before applying, add ${result.missing_skills.slice(0, 3).map(s => `"${s}"`).join(", ")}${result.missing_skills.length > 3 ? ` and ${result.missing_skills.length - 3} more` : ""} to push closer to 100%.`
//                   }
//                 </p>
//                 <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#78716c", margin: 0, fontWeight: 300 }}>
//                   <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Lightbulb size={14} /> Ensure your resume uses the <strong style={{ color: "#a8a29e" }}>exact same keywords</strong> from the JD - ATS systems match literally, not semantically.</span>
//                 </p>
//               </>
//             ) : (
//               <>
//                 {result.missing_skills.length > 0 && (
//                   <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: "#d6d3cd", lineHeight: 1.75, margin: 0, fontWeight: 300 }}>
//                     Priority: Learn or gain experience with {result.missing_skills.slice(0, 5).map(s => `"${s}"`).join(", ")}
//                     {result.missing_skills.length > 5 ? ` and ${result.missing_skills.length - 5} more skills.` : "."}
//                   </p>
//                 )}
//                 <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#78716c", margin: 0, fontWeight: 300 }}>
//                   <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Lightbulb size={14} /> Semantic score: {Math.round(result.sbert_score * 100)}% - your background domain may differ from this role. Consider roles closer to your current experience.</span>
//                 </p>
//               </>
//             )}
//           </div>
//         </div>

//         {/* ═══ ACTION BUTTONS ═══ */}
//         <div style={{ display: "flex", gap: 12, flexWrap: "wrap", paddingBottom: 80 }}>
//           <button onClick={onReset} style={{
//             fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 14,
//             padding: "13px 26px", borderRadius: 14, border: "none", cursor: "pointer",
//             background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
//             color: "#fff", boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
//             transition: "transform 0.2s",
//           }}
//           onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
//           onMouseLeave={e => e.currentTarget.style.transform = "none"}
//           ><span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><RotateCcw size={14} /> Analyze another</span></button>

//           <a href="/roast" style={{
//             fontFamily: "'Outfit',sans-serif", fontWeight: 500, fontSize: 14,
//             padding: "13px 26px", borderRadius: 14, textDecoration: "none",
//             background: "#fff", border: "1.5px solid #e7e5e0", color: "#1c1917",
//             display: "inline-flex", alignItems: "center",
//             transition: "border-color 0.2s",
//           }}><Flame size={14} style={{ marginRight: 8 }} />Roast my resume</a>

//           <button onClick={() => {
//             const t = `ResumeIQ Match: ${pct}% — ${meta.verdict}\nMatched: ${result.common_skills.join(", ") || "none"}\nMissing: ${result.missing_skills.join(", ") || "none"}`;
//             navigator.clipboard.writeText(t).then(() => alert("Copied to clipboard!"));
//           }} style={{
//             fontFamily: "'Outfit',sans-serif", fontWeight: 500, fontSize: 14,
//             padding: "13px 26px", borderRadius: 14, cursor: "pointer",
//             background: "#fff", border: "1.5px solid #e7e5e0", color: "#1c1917",
//             transition: "border-color 0.2s",
//           }}><span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Copy size={14} /> Copy result</span></button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // SCORE SECTION COMPONENT
// // ─────────────────────────────────────────────────────────────
// function ScoreSection({ icon: Icon, tag, tagColor, tagBg, title, subtitle, score, scoreColor, description, tip, show, delay = 0 }) {
//   return (
//     <div style={{
//       background: "#fff", borderRadius: 24,
//       boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
//       overflow: "hidden",
//       opacity: show ? 1 : 0, transform: show ? "none" : "translateY(20px)",
//       transition: `all 0.6s ${delay + 0.2}s ease`,
//     }}>
//       <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, padding: "28px 32px", alignItems: "center" }}>
//         {/* left */}
//         <div>
//           <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
//             <span style={{ display: "inline-flex", alignItems: "center", color: tagColor }}><Icon size={18} /></span>
//             <span style={{
//               fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 700,
//               letterSpacing: 1.8, textTransform: "uppercase",
//               color: tagColor, background: tagBg,
//               padding: "3px 10px", borderRadius: 6,
//             }}>{tag}</span>
//           </div>
//           <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 20, color: "#1c1917", margin: "0 0 5px", letterSpacing: "-0.4px" }}>{title}</h3>
//           <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#a8a29e", fontWeight: 300, margin: "0 0 16px" }}>{subtitle}</p>

//           {/* progress bar */}
//           <div style={{ height: 8, background: "#f0ede8", borderRadius: 999, overflow: "hidden", marginBottom: 16 }}>
//             <div style={{
//               height: "100%", borderRadius: 999, background: scoreColor,
//               width: show ? `${score}%` : "0%",
//               transition: `width 1.4s cubic-bezier(0.4,0,0.2,1) ${delay + 0.4}s`,
//               boxShadow: `0 0 12px ${scoreColor}55`,
//             }} />
//           </div>

//           <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#57534e", lineHeight: 1.7, fontWeight: 300, margin: "0 0 12px" }}>{description}</p>
//           <div style={{
//             background: "#fafaf9", borderLeft: `3px solid ${scoreColor}`,
//             borderRadius: "0 10px 10px 0", padding: "10px 14px",
//           }}>
//             <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#78716c", fontWeight: 400, margin: 0, lineHeight: 1.6 }}>
//               <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Lightbulb size={14} /> {tip}</span>
//             </p>
//           </div>
//         </div>

//         {/* right — big score */}
//         <div style={{ textAlign: "center", minWidth: 100 }}>
//           <div style={{
//             fontFamily: "'Playfair Display',serif", fontWeight: 900,
//             fontSize: 64, color: scoreColor, lineHeight: 1,
//             letterSpacing: "-3px",
//           }}>{score}</div>
//           <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#a8a29e", fontWeight: 300, marginTop: 4 }}>/ 100</div>
//           <div style={{
//             marginTop: 12, padding: "5px 14px", borderRadius: 20,
//             background: score >= 70 ? "#f0fdf4" : score >= 40 ? "#fffbeb" : "#fef2f2",
//             border: `1px solid ${score >= 70 ? "#bbf7d0" : score >= 40 ? "#fde68a" : "#fecaca"}`,
//           }}>
//             <span style={{
//               fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600,
//               color: score >= 70 ? "#15803d" : score >= 40 ? "#d97706" : "#dc2626",
//             }}>
//               {score >= 70 ? "Strong" : score >= 40 ? "Moderate" : "Weak"}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // ROOT
// // ─────────────────────────────────────────────────────────────
// export default function MatcherPage() {
//   useFonts();
//   const [scrolled, setScrolled] = useState(false);
//   const [phase, setPhase]       = useState("upload");
//   const [loadStep, setLoadStep] = useState(0);
//   const [result, setResult]     = useState(null);
//   const [error, setError]       = useState(null);

//   useEffect(() => {
//     const h = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", h);
//     return () => window.removeEventListener("scroll", h);
//   }, []);

//   async function handleAnalyze(resumeText, jdText, experience) {
//     setPhase("loading"); setLoadStep(0); setError(null);
//     let s = 0;
//     const iv = setInterval(() => { s++; setLoadStep(s); if (s >= 4) clearInterval(iv); }, 650);
//     try {
//       const data = await analyzeResume(resumeText, jdText, experience);
//       clearInterval(iv); setLoadStep(5); setResult(data);
//       setTimeout(() => setPhase("results"), 350);
//     } catch (err) {
//       clearInterval(iv);
//       setError("Cannot connect to API. Make sure the backend is running on port 8000.");
//       setPhase("upload");
//     }
//   }

//   function reset() { setPhase("upload"); setResult(null); setError(null); setLoadStep(0); }

//   return (
//     <div style={{ minHeight: "100vh", background: "#f7f5f0" }}>
//       <Navbar scrolled={scrolled} />
//       {phase === "upload"  && <UploadPage onAnalyze={handleAnalyze} error={error} />}
//       {phase === "loading" && <LoadingPage step={loadStep} />}
//       {phase === "results" && result && <ResultsPage result={result} onReset={reset} />}
//     </div>
//   );
// }



import { useState, useEffect, useRef } from "react";
import {
  AlertTriangle, ArrowLeft, Brain, Briefcase, Building2,
  Check, Copy, FileText, Flame, FolderOpen, Lightbulb,
  Plus, Rocket, RotateCcw, Search, Target, Wrench, X, XCircle, Zap,
} from "lucide-react";

function useFonts() {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap";
    document.head.appendChild(l);
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
      @keyframes spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      * { box-sizing:border-box; margin:0; padding:0; }
      html { scroll-behavior:smooth; }
      body { background:#f7f5f0; }
    `;
    document.head.appendChild(style);
  }, []);
}

async function analyzeResume(resumeText, jdText, experience) {
  const res = await fetch("http://localhost:8000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume_text: resumeText, jd_text: jdText, experience }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

function useAnimNum(target, duration = 1600, trigger) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = null;
    const raf = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setV(Math.floor((1 - Math.pow(1 - p, 4)) * target));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [target, trigger, duration]);
  return v;
}

// ── CHANGE 1: getMeta now detects domain mismatch ─────────────
// Before: only 4 tiers based on probability
// Now: 5th tier "Domain Mismatch" when score < 20 but skills > 30%
// This prevents showing brutal 3% to someone who is skilled
// but just applying to wrong domain
function getMeta(prob, skillOverlap = 0) {
  const p = Math.round(prob * 100);

  // Domain mismatch = low probability BUT decent skill overlap
  // Means: person has skills, just wrong domain
  if (p < 20 && skillOverlap > 0.3) {
    return {
      verdict: "Domain Mismatch", accent: "#7c3aed",
      light: "#faf5ff", mid: "#e9d5ff", grade: "~",
      icon: RotateCcw, isDomainMismatch: true,
    };
  }

  if (p >= 80) return { verdict: "Strong Match", accent: "#16a34a", light: "#f0fdf4", mid: "#bbf7d0", grade: "A", icon: Target,       isDomainMismatch: false };
  if (p >= 60) return { verdict: "Good Fit",      accent: "#2563eb", light: "#eff6ff", mid: "#bfdbfe", grade: "B", icon: Check,        isDomainMismatch: false };
  if (p >= 40) return { verdict: "Partial Match", accent: "#d97706", light: "#fffbeb", mid: "#fde68a", grade: "C", icon: Zap,          isDomainMismatch: false };
  return              { verdict: "Poor Match",    accent: "#dc2626", light: "#fef2f2", mid: "#fecaca", grade: "D", icon: X,            isDomainMismatch: false };
}

// ── CHANGE 2: detect what domain extra skills suggest ─────────
// Before: nothing
// Now: looks at extra skills to guess user's actual domain
// So we can suggest "You should apply for ML Engineer" etc.
function detectDomain(extraSkills) {
  const s = extraSkills.map(x => x.toLowerCase());
  const mlKw    = ["tensorflow","pytorch","keras","sklearn","scikit","xgboost","nlp","bert","rag","llm","spark","airflow","hadoop","machine learning","deep learning","transformers"];
  const beKw    = ["spring boot","django","flask","fastapi","kafka","redis","microservices","kubernetes","jenkins","rabbitmq"];
  const feKw    = ["react","vue","angular","next","nuxt","tailwind","sass","webpack","typescript","redux"];
  const dataKw  = ["pandas","numpy","matplotlib","sql","tableau","power bi","bigquery","dbt","airflow"];

  const score = (kws) => kws.filter(k => s.some(e => e.includes(k))).length;
  const scores = { "AI / ML Engineer": score(mlKw), "Backend Engineer": score(beKw), "Frontend Developer": score(feKw), "Data Engineer / Analyst": score(dataKw) };
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]).filter(([, v]) => v > 0);
  return sorted.slice(0, 3).map(([label]) => label);
}

// ─────────────────────────────────────────────────────────────
// NAVBAR — unchanged
// ─────────────────────────────────────────────────────────────
function Navbar({ scrolled }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 300,
      height: 62, padding: "0 2.5rem",
      background: scrolled ? "rgba(247,245,240,0.97)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
    }}>
      <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}>
          <Zap size={18} color="#fff" strokeWidth={2.2} />
        </div>
        <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 20, color: "#1c1917", letterSpacing: "-0.5px" }}>ResumeIQ</span>
      </a>
      <div style={{ display: "flex", gap: 36 }}>
        {[["Resume Matcher", "#", true], ["Resume Roast", "#", false], ["Company Intel", "#", false]].map(([label, href, active]) => (
          <a key={label} href={href} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: active ? 600 : 400, color: active ? "#6366f1" : "#78716c", textDecoration: "none", borderBottom: active ? "2px solid #6366f1" : "2px solid transparent", paddingBottom: 2 }}>{label}</a>
        ))}
      </div>
      <a href="/" style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500, padding: "8px 18px", borderRadius: 20, border: "1px solid #d6d3cd", textDecoration: "none", color: "#57534e", display: "inline-flex", alignItems: "center", gap: 6 }}>
        <ArrowLeft size={14} /> Home
      </a>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────
// UPLOAD PAGE — unchanged
// ─────────────────────────────────────────────────────────────
function UploadPage({ onAnalyze, error }) {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [myExp, setMyExp] = useState("");
  const [jdExp, setJdExp] = useState("");
  const [tab, setTab] = useState("paste");
  const [fileName, setFileName] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  // function handleFile(file) {
  //   if (!file) return;
  //   setFileName(file.name);
  //   const r = new FileReader();
  //   r.onload = e => setResumeText(e.target.result);
  //   r.readAsText(file);
  // }
  

  async function handleFile(file) {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();

    // TXT — read directly
    if (ext === "txt") {
      setFileName(file.name);
      const r = new FileReader();
      r.onload = e => setResumeText(e.target.result);
      r.readAsText(file);
      return;
    }

    // PDF — extract text with pdfjs
    if (ext === "pdf") {
      setFileName(`${file.name} (reading...)`);
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map(item => item.str).join(" ") + "\n";
        }

        if (!fullText.trim()) throw new Error("No text found in PDF");
        setResumeText(fullText.trim());
        setFileName(file.name);
      } catch (err) {
        setFileName(null);
        alert(`Could not read PDF: ${err.message}. Please use the Paste tab.`);
      }
      return;
    }

    // DOCX — not supported
    if (ext === "docx" || ext === "doc") {
      setFileName(null);
      alert("DOCX not supported in browser. Please use the Paste tab.");
      return;
    }

    // Fallback
    setFileName(file.name);
    const r = new FileReader();
    r.onload = e => setResumeText(e.target.result);
    r.readAsText(file);
  }


  const gap = myExp !== "" && jdExp !== "" ? parseInt(myExp) - parseInt(jdExp) : null;
  const ready = resumeText.length > 50 && jdText.length > 50;

  return (
    <div style={{ minHeight: "100vh", background: "#f7f5f0", paddingTop: 62 }}>
      <div style={{ textAlign: "center", padding: "64px 2rem 48px", animation: "fadeUp 0.7s ease both" }}>
        <div style={{ display: "inline-block", background: "linear-gradient(135deg,#eef2ff,#faf5ff)", border: "1px solid #e0e7ff", borderRadius: 999, padding: "6px 20px", marginBottom: 28 }}>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, color: "#6366f1", letterSpacing: 1.2, textTransform: "uppercase" }}>ML-Powered · spaCy + SBERT · 92.9% F1</span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(2.4rem,5vw,4rem)", color: "#1c1917", letterSpacing: "-2px", lineHeight: 1.05, margin: "0 0 20px" }}>
          Does your resume<br /><em style={{ color: "#6366f1" }}>actually</em> fit the job?
        </h1>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 300, color: "#78716c", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
          Paste your resume and any job description. Four scoring dimensions. Real insight.
        </p>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 1.5rem 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 16, animation: "fadeUp 0.7s 0.15s ease both" }}>

          {/* resume card */}
          <div style={{ background: "#fff", borderRadius: 24, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.04)" }}>
            <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid #f5f4f1", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FileText size={18} color="#6366f1" />
                <div>
                  <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 15, color: "#1c1917", margin: 0 }}>Your Resume</p>
                  <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#a8a29e", margin: 0, fontWeight: 300 }}>paste text or upload file</p>
                </div>
              </div>
              <div style={{ background: "#f5f4f1", borderRadius: 10, padding: 3, display: "flex" }}>
                {["paste", "upload"].map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: tab === t ? 600 : 400, padding: "5px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: tab === t ? "#fff" : "transparent", color: tab === t ? "#1c1917" : "#a8a29e", boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s" }}>{t}</button>
                ))}
              </div>
            </div>
            <div style={{ padding: "16px 22px 18px" }}>
              {tab === "paste" ? (
                <textarea value={resumeText} onChange={e => setResumeText(e.target.value)}
                  placeholder={"Paste your complete resume here...\n\nTip: Include your full skills section, experience bullets, and education for best results."}
                  style={{ width: "100%", height: 260, resize: "none", border: "1.5px solid #e7e5e0", borderRadius: 14, padding: "14px 16px", fontSize: 13, lineHeight: 1.7, fontFamily: "'Outfit',sans-serif", fontWeight: 300, color: "#1c1917", background: "#fafaf9", outline: "none", transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e7e5e0"} />
              ) : (
                <div onClick={() => fileRef.current.click()} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
                  style={{ height: 260, border: `2px dashed ${dragging ? "#6366f1" : fileName ? "#16a34a" : "#d6d3cd"}`, borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: dragging ? "#eef2ff" : fileName ? "#f0fdf4" : "#fafaf9", transition: "all 0.25s" }}>
                  <input ref={fileRef} type="file" accept=".txt,.pdf,.docx" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
                  {fileName ? <Check size={36} color="#16a34a" style={{ marginBottom: 12 }} /> : <FolderOpen size={36} color="#78716c" style={{ marginBottom: 12 }} />}
                  <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 15, color: fileName ? "#16a34a" : "#1c1917", margin: "0 0 4px" }}>{fileName || "Drop file here"}</p>
                  <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#a8a29e", fontWeight: 300, margin: 0 }}>{fileName ? "Click to replace" : "TXT · DOCX · PDF"}</p>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: resumeText.length > 100 ? "#16a34a" : "#a8a29e" }}>{resumeText.length} chars</span>
              </div>
            </div>
          </div>

          {/* JD card */}
          <div style={{ background: "#fff", borderRadius: 24, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.04)" }}>
            <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid #f5f4f1", display: "flex", alignItems: "center", gap: 10 }}>
              <Building2 size={18} color="#16a34a" />
              <div>
                <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 15, color: "#1c1917", margin: 0 }}>Job Description</p>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#a8a29e", margin: 0, fontWeight: 300 }}>any JD from any company</p>
              </div>
            </div>
            <div style={{ padding: "16px 22px 18px" }}>
              <textarea value={jdText} onChange={e => setJdText(e.target.value)}
                placeholder={"Paste the job description here...\n\nWorks with any company:\n• Google, Amazon, Microsoft\n• Startups and mid-size firms\n• Any role, any domain"}
                style={{ width: "100%", height: 260, resize: "none", border: "1.5px solid #e7e5e0", borderRadius: 14, padding: "14px 16px", fontSize: 13, lineHeight: 1.7, fontFamily: "'Outfit',sans-serif", fontWeight: 300, color: "#1c1917", background: "#fafaf9", outline: "none", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e7e5e0"} />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: jdText.length > 100 ? "#16a34a" : "#a8a29e" }}>{jdText.length} chars</span>
              </div>
            </div>
          </div>
        </div>

        {/* experience bar */}
        <div style={{ background: "#fff", borderRadius: 18, padding: "18px 24px", marginBottom: 16, display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", animation: "fadeUp 0.7s 0.25s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Briefcase size={18} color="#57534e" />
            <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 15, color: "#1c1917" }}>Experience</span>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#a8a29e", fontWeight: 300 }}>optional</span>
          </div>
          {[["Your years", myExp, setMyExp], ["JD requires", jdExp, setJdExp]].map(([label, val, setter]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <label style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#78716c" }}>{label}</label>
              <input type="number" min="0" max="30" value={val} onChange={e => setter(e.target.value)} placeholder="0"
                style={{ width: 68, padding: "7px 10px", borderRadius: 10, border: "1.5px solid #e7e5e0", fontFamily: "'DM Mono',monospace", fontSize: 14, color: "#1c1917", background: "#fafaf9", outline: "none", textAlign: "center" }} />
            </div>
          ))}
          {gap !== null && (
            <div style={{ padding: "7px 16px", borderRadius: 20, background: gap >= 0 ? "#f0fdf4" : "#fef2f2", border: `1px solid ${gap >= 0 ? "#bbf7d0" : "#fecaca"}`, display: "flex", alignItems: "center", gap: 8 }}>
              {gap >= 0 ? <Check size={14} color="#15803d" /> : <AlertTriangle size={14} color="#dc2626" />}
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 500, color: gap >= 0 ? "#15803d" : "#dc2626" }}>{gap >= 0 ? `+${gap}` : gap} yrs {gap >= 0 ? "above req." : "below req."}</span>
            </div>
          )}
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "12px 18px", marginBottom: 14, fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#dc2626", display: "flex", alignItems: "center", gap: 8 }}>
            <XCircle size={14} /> {error}
          </div>
        )}

        <button onClick={() => onAnalyze(resumeText, jdText, gap ?? 0)} disabled={!ready}
          style={{ width: "100%", padding: "18px", borderRadius: 18, border: "none", fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 18, letterSpacing: "-0.5px", cursor: ready ? "pointer" : "not-allowed", background: ready ? "linear-gradient(135deg,#1c1917,#292524)" : "#e7e5e0", color: ready ? "#f7f5f0" : "#a8a29e", boxShadow: ready ? "0 8px 32px rgba(28,25,23,0.25)" : "none", transition: "all 0.3s", animation: "fadeUp 0.7s 0.35s ease both" }}
          onMouseEnter={e => { if (ready) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(28,25,23,0.3)"; }}}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ready ? "0 8px 32px rgba(28,25,23,0.25)" : "none"; }}>
          {ready ? "Analyze My Resume Match →" : "Paste resume + job description to continue"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LOADING — unchanged
// ─────────────────────────────────────────────────────────────
const STEPS = ["Running spaCy skill matcher", "Computing SBERT embeddings", "Analyzing POS keywords", "Running ML model", "Building your report"];

function LoadingPage({ step }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f5f0" }}>
      <div style={{ textAlign: "center", maxWidth: 440, padding: "2rem" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", margin: "0 auto 36px", border: "3px solid #e7e5e0", borderTopColor: "#6366f1", animation: "spin 1s linear infinite" }} />
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 26, color: "#1c1917", letterSpacing: "-0.8px", marginBottom: 8 }}>Analyzing your match</h2>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#a8a29e", fontWeight: 300, marginBottom: 40 }}>Our ML pipeline is crunching the numbers</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, opacity: i <= step ? 1 : 0.3, transition: "opacity 0.5s" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono',monospace", fontSize: 12, fontWeight: 500, background: i < step ? "#1c1917" : i === step ? "#6366f1" : "#f0ede8", color: i < step || i === step ? "#fff" : "#a8a29e", transition: "all 0.4s" }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: i <= step ? "#1c1917" : "#a8a29e", fontWeight: i === step ? 600 : 300 }}>{s}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 36, height: 3, background: "#e7e5e0", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", width: `${Math.min(((step + 1) / 5) * 100, 100)}%`, transition: "width 0.6s ease" }} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RESULTS PAGE — all 6 changes applied here
// ─────────────────────────────────────────────────────────────
function ResultsPage({ result, onReset }) {
  const [show, setShow] = useState(false);
  const [showTags, setShowTags] = useState(false);
  useEffect(() => {
    setTimeout(() => setShow(true), 80);
    setTimeout(() => setShowTags(true), 900);
  }, []);

  const pct     = Math.round(result.probability * 100);

  // CHANGE 1 applied: pass skillOverlap to getMeta
  const meta    = getMeta(result.probability, result.skill_overlap);
  const VerdictIcon = meta.icon;
  const isGood  = result.label === 1;
  const isMismatch = meta.isDomainMismatch; // NEW flag

  // CHANGE 2: ring doesn't animate to tiny number on mismatch
  // Only animate when NOT mismatch, otherwise stays at 0 visually
  const animPct = useAnimNum(isMismatch ? 0 : pct, 1800, show);
  const R = 70, C = 2 * Math.PI * R;

  // CHANGE 2: ring color goes grey on mismatch, not red
  const ringColor = isMismatch ? "#d4d0ca" : meta.accent;
  const offset = C - ((isMismatch ? 30 : animPct) / 100) * C;

  // CHANGE 5: detect what domain user is actually in
  const suggestedRoles = isMismatch ? detectDomain(result.extra_skills) : [];

  return (
    <div style={{ minHeight: "100vh", background: "#f7f5f0", paddingTop: 62 }}>
      <div style={{ maxWidth: 1020, margin: "0 auto", padding: "52px 1.5rem 0", opacity: show ? 1 : 0, transform: show ? "none" : "translateY(28px)", transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)" }}>

        {/* verdict pill */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ background: meta.light, border: `1px solid ${meta.mid}`, borderRadius: 999, padding: "7px 18px", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, color: meta.accent, display: "flex", alignItems: "center", gap: 6 }}>
            <VerdictIcon size={14} /> {meta.verdict}
          </div>
          <div style={{ background: "#fff", border: "1px solid #e7e5e0", borderRadius: 999, padding: "7px 18px", fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#78716c" }}>
            z-score = {result.z_value}
          </div>
          {/* CHANGE 2: show extra context badge on mismatch */}
          {isMismatch && (
            <div style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 999, padding: "7px 18px", fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 500, color: "#7c3aed", display: "flex", alignItems: "center", gap: 6 }}>
              <AlertTriangle size={12} /> Your skills are strong — just for a different role
            </div>
          )}
        </div>

        {/* hero grid */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 48, alignItems: "center", marginBottom: 40 }}>

          {/* CHANGE 2: ring shows icon+text on mismatch instead of tiny number */}
          <div style={{ position: "relative", width: 180, height: 180, flexShrink: 0 }}>
            <svg width="180" height="180" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="90" cy="90" r={R} fill="none" stroke="#ede9e3" strokeWidth="12" />
              <circle cx="90" cy="90" r={R} fill="none" stroke={ringColor} strokeWidth="12" strokeLinecap="round"
                strokeDasharray={C} strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 0.05s linear", filter: isMismatch ? "none" : `drop-shadow(0 0 8px ${meta.accent}66)` }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              {isMismatch ? (
                // Mismatch: show icon + label, NOT the brutal 3%
                <>
                  <RotateCcw size={32} color="#7c3aed" style={{ marginBottom: 6 }} />
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#7c3aed", fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}>domain<br />gap</span>
                </>
              ) : (
                // Normal: show animated number
                <>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 52, color: "#1c1917", lineHeight: 1, letterSpacing: "-3px" }}>{animPct}</span>
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#a8a29e", fontWeight: 300, marginTop: 2 }}>out of 100</span>
                </>
              )}
            </div>
          </div>

          {/* CHANGE 3: headline and description differ on mismatch */}
          <div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "clamp(2rem,4vw,3rem)", color: "#1c1917", letterSpacing: "-1.5px", lineHeight: 1.1, margin: "0 0 16px" }}>
              {isMismatch ? (
                // Different headline — not "not quite there yet"
                <>Strong profile,<br /><em style={{ color: "#7c3aed", fontStyle: "italic" }}>different domain.</em></>
              ) : isGood ? (
                result.missing_skills.length === 0
                  ? <>You're a <em style={{ color: meta.accent, fontStyle: "italic" }}>perfect</em> match.</>
                  : <>Strong fit.<br /><em style={{ color: meta.accent, fontStyle: "italic" }}>A few gaps</em> to close.</>
              ) : (
                <><em style={{ color: meta.accent, fontStyle: "italic" }}>Not quite</em> there yet.</>
              )}
            </h1>

            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, color: "#78716c", lineHeight: 1.7, fontWeight: 300, maxWidth: 480 }}>
              {isMismatch ? (
                // CHANGE 4: explain domain mismatch clearly
                `You matched ${result.common_skills.length} of ${result.jd_skill_count} required skills — that shows real breadth. But your ${result.extra_skills.length} additional skills point to a different specialisation than this JD requires. Your expertise is better suited for a different role type.`
              ) : isGood ? (
                result.missing_skills.length === 0
                  ? "Your resume covers all required skills. Apply with confidence — you're a strong candidate for this role."
                  : `Your profile is well-aligned. Adding ${result.missing_skills.length} missing skill${result.missing_skills.length > 1 ? "s" : ""} to your resume could push you to the top of the pile.`
              ) : (
                `This role needs significant alignment. Focus on the missing skills below and consider roles closer to your current profile.`
              )}
            </p>
          </div>

          {/* grade badge — shows ~ on mismatch */}
          <div style={{ width: 90, height: 90, borderRadius: 24, flexShrink: 0, background: meta.light, border: `2px solid ${meta.mid}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 28px ${meta.accent}22` }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 44, color: meta.accent, lineHeight: 1 }}>{meta.grade}</span>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: meta.accent, opacity: 0.6, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 2 }}>grade</span>
          </div>
        </div>

        {/* 4 quick stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 32 }}>
          {[
            { n: result.jd_skill_count,       l: "JD Skills Required", c: "#6366f1" },
            { n: result.resume_skill_count,    l: "Skills In Resume",   c: "#8b5cf6" },
            { n: result.common_skills.length,  l: "Skills Matched",     c: "#16a34a" },
            { n: result.missing_skills.length, l: "Skills Missing",     c: result.missing_skills.length > 0 ? "#dc2626" : "#16a34a" },
          ].map(s => (
            <div key={s.l} style={{ background: "#fff", borderRadius: 18, padding: "20px 22px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", borderTop: `3px solid ${s.c}` }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 34, color: "#1c1917", letterSpacing: "-1px", lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#a8a29e", fontWeight: 300, marginTop: 6, lineHeight: 1.4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ SCORE SECTIONS ═══ */}
      <div style={{ maxWidth: 1020, margin: "0 auto", padding: "0 1.5rem", display: "flex", flexDirection: "column", gap: 16, opacity: show ? 1 : 0, transition: "opacity 0.7s 0.3s ease" }}>

        <ScoreSection icon={Target} tag="SKILL OVERLAP" tagColor="#6366f1" tagBg="#eef2ff"
          title="Skill Match Analysis" subtitle="How many skills from the JD are present in your resume"
          score={Math.round(result.skill_overlap * 100)} scoreColor="#6366f1"
          description={result.skill_overlap === 1 ? "Perfect — your resume contains every skill the JD asks for." : result.skill_overlap >= 0.7 ? "Strong coverage. Most required skills are present." : result.skill_overlap >= 0.4 ? "Partial coverage. Several important skills are missing." : "Low coverage. Your resume needs significant skill additions."}
          tip={result.missing_skills.length > 0 ? `Add "${result.missing_skills[0]}"${result.missing_skills[1] ? ` and "${result.missing_skills[1]}"` : ""} to your skills section to improve this score.` : "Great! Keep maintaining this skill breadth for similar roles."}
          show={show} />

        <ScoreSection icon={Brain} tag="SEMANTIC MATCH" tagColor="#7c3aed" tagBg="#faf5ff"
          title="Semantic Similarity" subtitle="How similar your language and experience domain is to the JD"
          score={Math.round(result.sbert_score * 100)} scoreColor="#7c3aed"
          description={result.sbert_score >= 0.7 ? "Excellent — your resume language closely mirrors this JD." : result.sbert_score >= 0.5 ? "Good alignment. Your background is contextually relevant." : result.sbert_score >= 0.35 ? "Moderate alignment. Your experience domain partially overlaps." : "Low alignment. Your background may be in a different domain."}
          tip="Use language and action verbs from the JD in your experience bullets to improve semantic alignment."
          show={show} delay={0.1} />

        <ScoreSection icon={Search} tag="KEYWORD DENSITY" tagColor="#0369a1" tagBg="#eff6ff"
          title="Keyword & POS Analysis" subtitle="How well your resume's key terms and noun phrases match the JD"
          score={Math.round(result.pos_score * 100)} scoreColor="#0369a1"
          description={result.pos_score >= 0.7 ? "Excellent keyword density — your resume uses the same core terminology." : result.pos_score >= 0.5 ? "Good keyword coverage. Your terminology broadly aligns." : result.pos_score >= 0.3 ? "Moderate keyword match. Adding domain-specific terms would help." : "Low keyword density. Your resume may use different terminology than this JD."}
          tip="Mirror exact phrases from the JD requirements section in your bullet points and summary."
          show={show} delay={0.2} />

        {/* ═══ SKILL GAP ═══ */}
        <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)", overflow: "hidden", opacity: show ? 1 : 0, transform: show ? "none" : "translateY(20px)", transition: "all 0.6s 0.35s ease" }}>
          <div style={{ padding: "28px 32px 24px", borderBottom: "1px solid #f5f4f1" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 600, color: "#78716c", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Skill Gap Report</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 20, color: "#1c1917", margin: 0, letterSpacing: "-0.5px" }}>What you have vs. what they need</h3>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[{ n: result.common_skills.length, label: "matched", bg: "#f0fdf4", c: "#15803d", border: "#bbf7d0" }, { n: result.missing_skills.length, label: "missing", bg: "#fef2f2", c: "#dc2626", border: "#fecaca" }, { n: result.extra_skills.length, label: "extra", bg: "#fafaf9", c: "#78716c", border: "#e7e5e0" }].map(b => (
                  <div key={b.label} style={{ padding: "6px 14px", borderRadius: 20, background: b.bg, border: `1px solid ${b.border}`, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 16, color: b.c }}>{b.n}</span>
                    <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: b.c, fontWeight: 300 }}>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ padding: "24px 32px 28px", display: "flex", flexDirection: "column", gap: 28 }}>
            {result.missing_skills.length > 0 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#dc2626" }} />
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, color: "#dc2626", letterSpacing: 1, textTransform: "uppercase" }}>Missing — Add these to increase your score</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {result.missing_skills.map((s, i) => (
                    <span key={s} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500, padding: "6px 14px", borderRadius: 20, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", display: "inline-flex", alignItems: "center", gap: 6, opacity: showTags ? 1 : 0, transform: showTags ? "none" : "translateY(6px) scale(0.9)", transition: `all 0.35s ease ${i * 0.05}s` }}>
                      <X size={12} /> {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {result.common_skills.length > 0 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a" }} />
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, color: "#16a34a", letterSpacing: 1, textTransform: "uppercase" }}>Matched — Already in your resume</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {result.common_skills.map((s, i) => (
                    <span key={s} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500, padding: "6px 14px", borderRadius: 20, background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", display: "inline-flex", alignItems: "center", gap: 6, opacity: showTags ? 1 : 0, transform: showTags ? "none" : "translateY(6px) scale(0.9)", transition: `all 0.35s ease ${i * 0.04 + 0.2}s` }}>
                      <Check size={12} /> {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {result.extra_skills.length > 0 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#a8a29e" }} />
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, color: "#78716c", letterSpacing: 1, textTransform: "uppercase" }}>Extra — You have these, JD didn't ask</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {result.extra_skills.slice(0, 18).map((s, i) => (
                    <span key={s} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 400, padding: "6px 14px", borderRadius: 20, background: "#fafaf9", color: "#78716c", border: "1px solid #e7e5e0", display: "inline-flex", alignItems: "center", gap: 6, opacity: showTags ? 1 : 0, transform: showTags ? "none" : "translateY(6px) scale(0.9)", transition: `all 0.35s ease ${i * 0.03 + 0.4}s` }}>
                      <Plus size={12} /> {s}
                    </span>
                  ))}
                  {result.extra_skills.length > 18 && <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#a8a29e", padding: "6px 14px" }}>+{result.extra_skills.length - 18} more</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CHANGE 5: Better Roles card — only shown on domain mismatch */}
        {isMismatch && suggestedRoles.length > 0 && (
          <div style={{ background: "linear-gradient(135deg,#faf5ff,#eef2ff)", border: "1px solid #e9d5ff", borderRadius: 24, padding: "28px 32px", opacity: show ? 1 : 0, transition: "opacity 0.6s 0.4s ease" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "#fff", border: "1px solid #e9d5ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(124,58,237,0.1)" }}>
                <RotateCcw size={20} color="#7c3aed" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 18, color: "#1c1917", margin: "0 0 8px", letterSpacing: "-0.4px" }}>
                  Your skills point to a different role
                </h3>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#57534e", lineHeight: 1.7, margin: "0 0 18px", fontWeight: 300 }}>
                  Based on your {result.extra_skills.length} additional skills, your profile is a much stronger fit for these roles. Try matching your resume against one of these JDs instead:
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {suggestedRoles.map(role => (
                    <span key={role} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, padding: "8px 18px", borderRadius: 20, background: "#fff", border: "1.5px solid #c4b5fd", color: "#7c3aed", display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <Rocket size={13} /> {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ EXPERIENCE ═══ */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "28px 32px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", opacity: show ? 1 : 0, transition: "opacity 0.6s 0.45s ease" }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 600, color: "#78716c", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Experience Analysis</div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 20, color: "#1c1917", margin: "0 0 20px", letterSpacing: "-0.5px" }}>Years of experience</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              { label: "Gap (your yrs − JD req)", val: result.experience >= 0 ? `+${result.experience}` : String(result.experience), good: result.experience >= 0 },
              { label: "Direction", val: result.exp_flag === 1 ? "Above requirement" : result.exp_flag === 0 ? "Exact match" : "Below requirement", good: result.exp_flag >= 0 },
              { label: "Impact on score", val: result.exp_flag === 1 ? "Positive ↑" : result.exp_flag === 0 ? "Neutral →" : "Negative ↓", good: result.exp_flag >= 0 },
            ].map(r => (
              <div key={r.label} style={{ background: "#fafaf9", borderRadius: 14, padding: "16px 18px" }}>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#a8a29e", fontWeight: 300, marginBottom: 8 }}>{r.label}</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 16, fontWeight: 500, color: r.good ? "#15803d" : "#dc2626" }}>{r.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CHANGE 6: next steps differ on mismatch */}
        <div style={{ background: "#1c1917", borderRadius: 24, padding: "36px 40px", boxShadow: "0 8px 40px rgba(28,25,23,0.2)", opacity: show ? 1 : 0, transition: "opacity 0.6s 0.55s ease" }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 22, color: "#f7f5f0", margin: "0 0 20px", letterSpacing: "-0.5px", display: "flex", alignItems: "center", gap: 8 }}>
            {isMismatch ? <RotateCcw size={18} color="#c4b5fd" /> : isGood ? <Rocket size={18} /> : <Wrench size={18} />}
            {isMismatch ? "How to use your skills better" : isGood ? "Your next move" : "How to improve"}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {isMismatch ? (
              // CHANGE 6: completely different advice for domain mismatch
              <>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: "#d6d3cd", lineHeight: 1.75, margin: 0, fontWeight: 300 }}>
                  Your profile has real depth — {result.common_skills.length} matched skills and {result.resume_skill_count} total skills is strong. The issue is domain alignment, not skill level. This role needs a different specialisation than what you've built.
                </p>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#78716c", margin: 0, fontWeight: 300, display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <Lightbulb size={14} style={{ flexShrink: 0, marginTop: 2, color: "#a8a29e" }} />
                  Try matching your resume against a {suggestedRoles[0] || "role in your domain"} JD. Your {result.extra_skills.length} specialised skills will shine in the right context.
                </p>
              </>
            ) : isGood ? (
              <>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: "#d6d3cd", lineHeight: 1.75, margin: 0, fontWeight: 300 }}>
                  {result.missing_skills.length === 0 ? "You have everything this role requires. Submit your application — you are a genuinely strong candidate." : `Strong match. Before applying, add ${result.missing_skills.slice(0, 3).map(s => `"${s}"`).join(", ")}${result.missing_skills.length > 3 ? ` and ${result.missing_skills.length - 3} more` : ""} to push closer to 100%.`}
                </p>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#78716c", margin: 0, fontWeight: 300, display: "flex", alignItems: "center", gap: 8 }}>
                  <Lightbulb size={14} color="#a8a29e" /> Ensure your resume uses the <strong style={{ color: "#a8a29e" }}>exact same keywords</strong> from the JD — ATS systems match literally, not semantically.
                </p>
              </>
            ) : (
              <>
                {result.missing_skills.length > 0 && (
                  <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: "#d6d3cd", lineHeight: 1.75, margin: 0, fontWeight: 300 }}>
                    Priority: Learn or gain experience with {result.missing_skills.slice(0, 5).map(s => `"${s}"`).join(", ")}{result.missing_skills.length > 5 ? ` and ${result.missing_skills.length - 5} more.` : "."}
                  </p>
                )}
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#78716c", margin: 0, fontWeight: 300, display: "flex", alignItems: "center", gap: 8 }}>
                  <Lightbulb size={14} color="#a8a29e" /> Semantic score: {Math.round(result.sbert_score * 100)}% — consider roles closer to your current experience domain.
                </p>
              </>
            )}
          </div>
        </div>

        {/* action buttons */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", paddingBottom: 80 }}>
          <button onClick={onReset} style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 14, padding: "13px 26px", borderRadius: 14, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", boxShadow: "0 4px 16px rgba(99,102,241,0.3)", display: "inline-flex", alignItems: "center", gap: 8 }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
            <RotateCcw size={14} /> Analyze another
          </button>
          <a href="/roast" style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 500, fontSize: 14, padding: "13px 26px", borderRadius: 14, textDecoration: "none", background: "#fff", border: "1.5px solid #e7e5e0", color: "#1c1917", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Flame size={14} /> Roast my resume
          </a>
          <button onClick={() => { const t = `ResumeIQ Match: ${pct}% — ${meta.verdict}\nMatched: ${result.common_skills.join(", ") || "none"}\nMissing: ${result.missing_skills.join(", ") || "none"}`; navigator.clipboard.writeText(t).then(() => alert("Copied!")); }}
            style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 500, fontSize: 14, padding: "13px 26px", borderRadius: 14, cursor: "pointer", background: "#fff", border: "1.5px solid #e7e5e0", color: "#1c1917", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Copy size={14} /> Copy result
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCORE SECTION — unchanged
// ─────────────────────────────────────────────────────────────
function ScoreSection({ icon: Icon, tag, tagColor, tagBg, title, subtitle, score, scoreColor, description, tip, show, delay = 0 }) {
  return (
    <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)", overflow: "hidden", opacity: show ? 1 : 0, transform: show ? "none" : "translateY(20px)", transition: `all 0.6s ${delay + 0.2}s ease` }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, padding: "28px 32px", alignItems: "center" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Icon size={18} color={tagColor} />
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.8, textTransform: "uppercase", color: tagColor, background: tagBg, padding: "3px 10px", borderRadius: 6 }}>{tag}</span>
          </div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 20, color: "#1c1917", margin: "0 0 5px", letterSpacing: "-0.4px" }}>{title}</h3>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#a8a29e", fontWeight: 300, margin: "0 0 16px" }}>{subtitle}</p>
          <div style={{ height: 8, background: "#f0ede8", borderRadius: 999, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ height: "100%", borderRadius: 999, background: scoreColor, width: show ? `${score}%` : "0%", transition: `width 1.4s cubic-bezier(0.4,0,0.2,1) ${delay + 0.4}s`, boxShadow: `0 0 12px ${scoreColor}55` }} />
          </div>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#57534e", lineHeight: 1.7, fontWeight: 300, margin: "0 0 12px" }}>{description}</p>
          <div style={{ background: "#fafaf9", borderLeft: `3px solid ${scoreColor}`, borderRadius: "0 10px 10px 0", padding: "10px 14px" }}>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#78716c", fontWeight: 400, margin: 0, lineHeight: 1.6, display: "flex", alignItems: "center", gap: 6 }}>
              <Lightbulb size={13} color={scoreColor} /> {tip}
            </p>
          </div>
        </div>
        <div style={{ textAlign: "center", minWidth: 100 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 64, color: scoreColor, lineHeight: 1, letterSpacing: "-3px" }}>{score}</div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#a8a29e", fontWeight: 300, marginTop: 4 }}>/ 100</div>
          <div style={{ marginTop: 12, padding: "5px 14px", borderRadius: 20, background: score >= 70 ? "#f0fdf4" : score >= 40 ? "#fffbeb" : "#fef2f2", border: `1px solid ${score >= 70 ? "#bbf7d0" : score >= 40 ? "#fde68a" : "#fecaca"}` }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, color: score >= 70 ? "#15803d" : score >= 40 ? "#d97706" : "#dc2626" }}>
              {score >= 70 ? "Strong" : score >= 40 ? "Moderate" : "Weak"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT — unchanged
// ─────────────────────────────────────────────────────────────
export default function MatcherPage() {
  useFonts();
  const [scrolled, setScrolled] = useState(false);
  const [phase, setPhase]       = useState("upload");
  const [loadStep, setLoadStep] = useState(0);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  async function handleAnalyze(resumeText, jdText, experience) {
    setPhase("loading"); setLoadStep(0); setError(null);
    let s = 0;
    const iv = setInterval(() => { s++; setLoadStep(s); if (s >= 4) clearInterval(iv); }, 650);
    try {
      const data = await analyzeResume(resumeText, jdText, experience);
      clearInterval(iv); setLoadStep(5); setResult(data);
      setTimeout(() => setPhase("results"), 350);
    } catch (err) {
      clearInterval(iv);
      setError("Cannot connect to API. Make sure the backend is running on port 8000.");
      setPhase("upload");
    }
  }

  function reset() { setPhase("upload"); setResult(null); setError(null); setLoadStep(0); }

  return (
    <div style={{ minHeight: "100vh", background: "#f7f5f0" }}>
      <Navbar scrolled={scrolled} />
      {phase === "upload"  && <UploadPage onAnalyze={handleAnalyze} error={error} />}
      {phase === "loading" && <LoadingPage step={loadStep} />}
      {phase === "results" && result && <ResultsPage result={result} onReset={reset} />}
    </div>
  );
}