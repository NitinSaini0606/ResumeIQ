





import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  FolderOpen,
  Check,
  Flame,
  RotateCcw,
  Zap,
  Copy,
} from "lucide-react";


function useFonts() {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel  = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap";
    document.head.appendChild(l);
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeUp  { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
      @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes slideIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
      * { box-sizing:border-box; margin:0; padding:0; }
      html { scroll-behavior:smooth; }
      body { background:#f7f5f0; }
    `;
    document.head.appendChild(style);
  }, []);
}

// ── PDF text extractor using pdfjs-dist ───────────────────────────
async function extractPdfText(file) {
  const pdfjsLib = await import("pdfjs-dist");

  // Use CDN worker — no local worker needed
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page    = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(" ");
    fullText += pageText + "\n";
  }

  if (!fullText.trim()) {
    throw new Error("No text found — this may be a scanned/image PDF");
  }

  return fullText.trim();
}



async function roastResume(resumeText) {
  const res = await fetch("http://localhost:8001/roast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resume_text: resumeText,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || `Backend error: ${res.status}`);
  }

  return data.roast;
}

// ── Navbar ────────────────────────────────────────────────────────
function Navbar({ scrolled }) {
  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:300,
      height:62, padding:"0 2.5rem",
      background: scrolled ? "rgba(247,245,240,0.97)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      transition:"all 0.4s cubic-bezier(0.4,0,0.2,1)",
    }}>
      <a href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
        <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 12px rgba(99,102,241,0.3)" }}>
          <Zap size={18} color="#fff" strokeWidth={2.2} />
        </div>
        <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:20, color:"#1c1917", letterSpacing:"-0.5px" }}>ResumeIQ</span>
      </a>
      <div style={{ display:"flex", gap:36 }}>
        {[["Resume Matcher","#",false],["Resume Roast","#",true],["Company Intel","#",false]].map(([label,href,active]) => (
          <a key={label} href={href} style={{ fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:active?600:400, color:active?"#ef4444":"#78716c", textDecoration:"none", borderBottom:active?"2px solid #ef4444":"2px solid transparent", paddingBottom:2, transition:"color 0.2s" }}>{label}</a>
        ))}
      </div>
      <a href="/" style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:500, padding:"8px 18px", borderRadius:20, border:"1px solid #d6d3cd", textDecoration:"none", color:"#57534e", background:"transparent", transition:"all 0.2s", display:"inline-flex", alignItems:"center", gap:6 }}>
        <ArrowLeft size={14} /> Home
      </a>
    </nav>
  );
}

// ── Upload Page ───────────────────────────────────────────────────
function UploadPage({ onRoast, loading, error }) {
  const [resumeText, setResumeText] = useState("");
  const [tab,        setTab]        = useState("paste");
  const [fileName,   setFileName]   = useState(null);
  const [dragging,   setDragging]   = useState(false);
  const [fileError,  setFileError]  = useState(null);
  const [reading,    setReading]    = useState(false);
  const fileRef = useRef();

  // ── FIXED: handles txt AND pdf properly ──────────────────────
  async function handleFile(file) {
    if (!file) return;
    setFileError(null);
    const ext = file.name.split(".").pop().toLowerCase();

    // TXT — plain text, read directly
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
      setReading(true);
      try {
        const text = await extractPdfText(file);
        setResumeText(text);
        setFileName(file.name);
      } catch (err) {
        console.error("PDF error:", err);
        setFileName(null);
        setResumeText("");
        setFileError(`Could not read PDF: ${err.message}. Please use the Paste tab instead.`);
      } finally {
        setReading(false);
      }
      return;
    }

    // DOCX — not supported in browser, tell user to paste
    if (ext === "docx" || ext === "doc") {
      setFileName(null);
      setFileError("DOCX files cannot be read in the browser. Please copy-paste your resume text using the Paste tab.");
      return;
    }

    // Unknown — try plain text as fallback
    setFileName(file.name);
    const r = new FileReader();
    r.onload = e => setResumeText(e.target.result);
    r.readAsText(file);
  }

  const ready = resumeText.length > 50 && !loading && !reading;

  return (
    <div style={{ minHeight:"100vh", background:"#f7f5f0", paddingTop:62 }}>
      <div style={{ textAlign:"center", padding:"64px 2rem 48px", animation:"fadeUp 0.7s ease both" }}>
        <div style={{ display:"inline-block", background:"linear-gradient(135deg,#fff1f2,#fef2f2)", border:"1px solid #fecaca", borderRadius:999, padding:"6px 20px", marginBottom:28 }}>
          <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:12, fontWeight:600, color:"#ef4444", letterSpacing:1.2, textTransform:"uppercase" }}>
            🔥 Savage AI Roaster 
          </span>
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:"clamp(2.4rem,5vw,4rem)", color:"#1c1917", letterSpacing:"-2px", lineHeight:1.05, margin:"0 0 20px" }}>
          Your resume deserves<br />
          <em style={{ color:"#ef4444", fontStyle:"italic" }}>to be roasted.</em>
        </h1>
        <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:17, fontWeight:300, color:"#78716c", maxWidth:500, margin:"0 auto", lineHeight:1.7 }}>
          Upload your resume and let our savage AI tear it apart — with love. Mostly.
        </p>
      </div>

      <div style={{ maxWidth:720, margin:"0 auto", padding:"0 1.5rem 80px", animation:"fadeUp 0.7s 0.15s ease both" }}>
        <div style={{ background:"#fff", borderRadius:24, overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.04)", marginBottom:16 }}>

          {/* Card header */}
          <div style={{ padding:"18px 22px 14px", borderBottom:"1px solid #f5f4f1", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <Flame size={18} color="#ef4444" />
              <div>
                <p style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:15, color:"#1c1917", margin:0 }}>Your Resume</p>
                <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:11, color:"#a8a29e", margin:0, fontWeight:300 }}>paste text or upload TXT / PDF</p>
              </div>
            </div>
            <div style={{ background:"#f5f4f1", borderRadius:10, padding:3, display:"flex" }}>
              {["paste","upload"].map(t => (
                <button key={t} onClick={() => { setTab(t); setFileError(null); }} style={{ fontFamily:"'Outfit',sans-serif", fontSize:12, fontWeight:tab===t?600:400, padding:"5px 14px", borderRadius:8, border:"none", cursor:"pointer", background:tab===t?"#fff":"transparent", color:tab===t?"#1c1917":"#a8a29e", boxShadow:tab===t?"0 1px 4px rgba(0,0,0,0.1)":"none", transition:"all 0.2s" }}>{t}</button>
              ))}
            </div>
          </div>

          {/* Card body */}
          <div style={{ padding:"16px 22px 18px" }}>
            {tab === "paste" ? (
              <textarea
                value={resumeText} onChange={e => setResumeText(e.target.value)}
                placeholder={"Paste your resume here and prepare to cry...\n\nTip: The more skills you list, the more ammo we have. 😈"}
                style={{ width:"100%", height:300, resize:"none", border:"1.5px solid #e7e5e0", borderRadius:14, padding:"14px 16px", fontSize:13, lineHeight:1.7, fontFamily:"'Outfit',sans-serif", fontWeight:300, color:"#1c1917", background:"#fafaf9", outline:"none", transition:"border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor="#ef4444"}
                onBlur={e  => e.target.style.borderColor="#e7e5e0"}
              />
            ) : (
              <>
                <div
                  onClick={() => !reading && fileRef.current.click()}
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
                  style={{ height:300, border:`2px dashed ${dragging?"#ef4444":fileName&&!fileError?"#16a34a":fileError?"#fecaca":"#d6d3cd"}`, borderRadius:14, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:reading?"wait":"pointer", background:dragging?"#fff1f2":fileName&&!fileError?"#f0fdf4":fileError?"#fef2f2":"#fafaf9", transition:"all 0.25s" }}>
                  <input ref={fileRef} type="file" accept=".txt,.pdf" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />

                  {reading ? (
                    <>
                      <div style={{ width:36, height:36, borderRadius:"50%", border:"3px solid #fecaca", borderTopColor:"#ef4444", animation:"spin 0.8s linear infinite", marginBottom:12 }} />
                      <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:14, color:"#78716c", margin:0 }}>Reading PDF...</p>
                    </>
                  ) : fileError ? (
                    <>
                      <span style={{ fontSize:32, marginBottom:10 }}>⚠️</span>
                      <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, color:"#dc2626", margin:0, textAlign:"center", padding:"0 20px" }}>{fileError}</p>
                    </>
                  ) : fileName ? (
                    <>
                      <Check size={36} color="#16a34a" style={{ marginBottom:12 }} />
                      <p style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:15, color:"#16a34a", margin:"0 0 4px" }}>{fileName}</p>
                      <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:12, color:"#a8a29e", fontWeight:300, margin:0 }}>Click to replace</p>
                    </>
                  ) : (
                    <>
                      <FolderOpen size={36} color="#78716c" style={{ marginBottom:12 }} />
                      <p style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:15, color:"#1c1917", margin:"0 0 4px" }}>Drop resume here</p>
                      <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:12, color:"#a8a29e", fontWeight:300, margin:"0 0 8px" }}>TXT · PDF</p>
                      <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:11, color:"#c8c4be", fontWeight:300, margin:0 }}>DOCX not supported — use Paste tab</p>
                    </>
                  )}
                </div>
              </>
            )}

            <div style={{ display:"flex", justifyContent:"space-between", marginTop:8, alignItems:"center" }}>
              <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:12, color:"#a8a29e", fontWeight:300 }}>
                {resumeText.length > 50 ? "✅ Resume loaded — ready for destruction" : "Paste or upload your resume above"}
              </span>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:resumeText.length>100?"#16a34a":"#a8a29e" }}>
                {resumeText.length} chars
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:14, padding:"12px 18px", marginBottom:16, display:"flex", alignItems:"flex-start", gap:10 }}>
          <span style={{ fontSize:16, flexShrink:0 }}>🔥</span>
          <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, color:"#9a3412", fontWeight:400, lineHeight:1.6, margin:0 }}>
            This roast is purely for fun and entertainment. We're savage but we believe in you. Mostly.
          </p>
        </div>

        {/* API error */}
        {error && (
          <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:12, padding:"12px 18px", marginBottom:14, fontFamily:"'Outfit',sans-serif", fontSize:13, color:"#dc2626" }}>
            ⚠️ {error}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => onRoast(resumeText)}
          disabled={!ready}
          style={{ width:"100%", padding:"18px", borderRadius:18, border:"none", fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:18, letterSpacing:"-0.5px", cursor:ready?"pointer":"not-allowed", background:ready?"linear-gradient(135deg,#dc2626,#ef4444)":"#e7e5e0", color:ready?"#fff":"#a8a29e", boxShadow:ready?"0 8px 32px rgba(220,38,38,0.3), 0 2px 8px rgba(220,38,38,0.15)":"none", transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}
          onMouseEnter={e => { if(ready){ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 14px 40px rgba(220,38,38,0.35)"; }}}
          onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=ready?"0 8px 32px rgba(220,38,38,0.3)":"none"; }}
        >
          {loading ? (
            <><div style={{ width:18, height:18, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", animation:"spin 0.8s linear infinite" }} /> Preparing the roast...</>
          ) : reading ? (
            <><div style={{ width:18, height:18, borderRadius:"50%", border:"2px solid rgba(0,0,0,0.1)", borderTopColor:"#a8a29e", animation:"spin 0.8s linear infinite" }} /> Reading file...</>
          ) : ready ? (
            <><Flame size={18} /> Roast My Resume 🔥</>
          ) : (
            "Paste resume to get roasted"
          )}
        </button>
      </div>
    </div>
  );
}

// ── Loading Page ──────────────────────────────────────────────────
const ROAST_STEPS = [
  "Reading your resume...",
  "Wincing at your skills section...",
  "Finding the best insults...",
  "Polishing the savage one-liners...",
  "Preparing your destruction 🔥",
];

function LoadingPage({ step }) {
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f7f5f0", flexDirection:"column" }}>
      <div style={{ textAlign:"center", maxWidth:440, padding:"2rem" }}>
        <div style={{ width:80, height:80, borderRadius:"50%", margin:"0 auto 36px", border:"3px solid #fecaca", borderTopColor:"#ef4444", animation:"spin 1s linear infinite" }} />
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:26, color:"#1c1917", letterSpacing:"-0.8px", marginBottom:8 }}>The roast is cooking 🔥</h2>
        <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:14, color:"#a8a29e", fontWeight:300, marginBottom:40 }}>Our AI is preparing something brutal</p>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {ROAST_STEPS.map((s,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:14, opacity:i<=step?1:0.3, transition:"opacity 0.5s", animation:i===step?"slideIn 0.4s ease both":"none" }}>
              <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Mono',monospace", fontSize:12, fontWeight:500, background:i<step?"#1c1917":i===step?"#ef4444":"#f0ede8", color:i<step||i===step?"#fff":"#a8a29e", transition:"all 0.4s" }}>
                {i<step?"✓":i+1}
              </div>
              <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:14, color:i<=step?"#1c1917":"#a8a29e", fontWeight:i===step?600:300 }}>{s}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop:36, height:3, background:"#e7e5e0", borderRadius:999, overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:999, background:"linear-gradient(90deg,#dc2626,#ef4444)", width:`${Math.min(((step+1)/5)*100,100)}%`, transition:"width 0.6s ease" }} />
        </div>
      </div>
    </div>
  );
}

// ── Markdown parser ───────────────────────────────────────────────
function parseMarkdown(text, accentColor) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <span key={i} style={{ fontWeight:700, color:accentColor||"#ef4444", fontFamily:"'Playfair Display',serif", fontSize:"1.02em" }}>{part.slice(2,-2)}</span>;
    }
    return <span key={i}>{part}</span>;
  });
}

// ── Section parser ────────────────────────────────────────────────
function parseRoastSections(roastText) {
  if (!roastText) return [];

  const COLORS = [
    { glow:"linear-gradient(90deg,#ef4444,#ff6b35)", iconBg:"#fef2f2", iconBorder:"#fecaca", label:"#ef4444", headerBorder:"#fef2f2", accent:"#ef4444", emoji:"🔥" },
    { glow:"linear-gradient(90deg,#3b82f6,#60a5fa)", iconBg:"#eff6ff", iconBorder:"#bfdbfe", label:"#2563eb", headerBorder:"#eff6ff", accent:"#2563eb", emoji:"🛠️" },
    { glow:"linear-gradient(90deg,#a855f7,#c084fc)", iconBg:"#faf5ff", iconBorder:"#e9d5ff", label:"#7c3aed", headerBorder:"#faf5ff", accent:"#7c3aed", emoji:"🚀" },
    { glow:"linear-gradient(90deg,#f59e0b,#fbbf24)", iconBg:"#fffbeb", iconBorder:"#fde68a", label:"#d97706", headerBorder:"#fffbeb", accent:"#d97706", emoji:"🏆" },
    { glow:"linear-gradient(90deg,#22c55e,#4ade80)", iconBg:"#f0fdf4", iconBorder:"#bbf7d0", label:"#16a34a", headerBorder:"#f0fdf4", accent:"#16a34a", emoji:"⚖️" },
    { glow:"linear-gradient(90deg,#ec4899,#f472b6)", iconBg:"#fdf2f8", iconBorder:"#fbcfe8", label:"#db2777", headerBorder:"#fdf2f8", accent:"#db2777", emoji:"💼" },
  ];

  const lines = roastText.split("\n").filter(l => l.trim());
  const sections = [];
  let current = null;
  let colorIdx = 0;

  lines.forEach(line => {
    const trimmed = line.trim();
    const isSectionHeader =
      (trimmed.startsWith("**") && trimmed.endsWith("**") && trimmed.length < 60) ||
      (/^#{1,3}\s/.test(trimmed));

    if (isSectionHeader) {
      const label = trimmed.replace(/\*\*/g,"").replace(/^#+\s*/,"").replace(/:$/,"").trim();
      current = { label, lines:[], color:COLORS[colorIdx % COLORS.length] };
      colorIdx++;
      sections.push(current);
    } else {
      if (!current) {
        current = { label:"The Roast Begins", lines:[], color:COLORS[0] };
        colorIdx++;
        sections.push(current);
      }
      if (trimmed) current.lines.push(trimmed);
    }
  });

  return sections.filter(s => s.lines.length > 0);
}

// ── Roast Meter ───────────────────────────────────────────────────
function RoastMeter({ text }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 500); }, []);

  const score = Math.min(95, Math.max(35, Math.round(40 + (text?.length||0) / 80)));
  const label = score >= 80 ? "Well Done 🔥" : score >= 60 ? "Medium Rare 🥩" : "Lightly Toasted 🍞";

  return (
    <div style={{ background:"#fff", border:"1px solid #e7e5e0", borderRadius:18, padding:"20px 24px", display:"flex", alignItems:"center", gap:20, marginBottom:24, boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
      <div style={{ flex:1 }}>
        <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#a8a29e", letterSpacing:"1.5px", textTransform:"uppercase", margin:"0 0 8px" }}>Roast Intensity</p>
        <div style={{ height:8, background:"#f0ede8", borderRadius:999, overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:999, background:"linear-gradient(90deg,#dc2626,#ef4444)", boxShadow:"0 0 10px rgba(239,68,68,0.35)", width:animated?`${score}%`:"0%", transition:"width 1.4s cubic-bezier(0.4,0,0.2,1)" }} />
        </div>
      </div>
      <div style={{ textAlign:"center", flexShrink:0 }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:30, color:"#ef4444", lineHeight:1 }}>{score}</div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#a8a29e", marginTop:3 }}>{label}</div>
      </div>
    </div>
  );
}

// ── Results Page ──────────────────────────────────────────────────
function ResultsPage({ roastText, onReset }) {
  if (!roastText) return null;
  const [show,   setShow]   = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 80); }, []);

  const sections = parseRoastSections(roastText);

  function handleCopy() {
    navigator.clipboard.writeText(roastText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{ minHeight:"100vh", background:"#f7f5f0", paddingTop:62 }}>
      <div style={{ maxWidth:820, margin:"0 auto", padding:"48px 1.5rem 80px", opacity:show?1:0, transform:show?"none":"translateY(20px)", transition:"all 0.6s ease" }}>

        <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:4 }}>
          <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:999, padding:"6px 16px", fontFamily:"'Outfit',sans-serif", fontSize:12, fontWeight:600, color:"#ef4444", display:"flex", alignItems:"center", gap:6 }}>
            <Flame size={12} /> Roast Complete
          </div>
          <div style={{ background:"#fff", border:"1px solid #e7e5e0", borderRadius:999, padding:"6px 16px", fontFamily:"'DM Mono',monospace", fontSize:11, color:"#78716c" }}>
            {sections.length} sections roasted · LLaMA 3 · Groq
          </div>
        </div>

        <h1 style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:"clamp(2rem,5vw,3.2rem)", color:"#1c1917", letterSpacing:"-2px", lineHeight:1.05, margin:"20px 0 8px" }}>
          The verdict is in.<br />
          <em style={{ color:"#ef4444", fontStyle:"italic" }}>It's not pretty.</em>
        </h1>
        <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:300, color:"#78716c", lineHeight:1.7, marginBottom:32 }}>
          Scroll through the carnage below. Each section has been lovingly destroyed.
        </p>

        <RoastMeter text={roastText} />

        <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:24 }}>
          {sections.map((s,i) => (
            <div key={i} style={{ background:"#fff", borderRadius:20, overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)", border:"1px solid #f0ede8", opacity:show?1:0, transform:show?"none":"translateY(20px)", transition:`all 0.5s ease ${0.15+i*0.08}s` }}>
              <div style={{ height:4, background:s.color.glow }} />
              <div style={{ padding:"22px 26px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, paddingBottom:12, borderBottom:`1px solid ${s.color.headerBorder}` }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:s.color.iconBg, border:`1px solid ${s.color.iconBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>
                    {s.color.emoji}
                  </div>
                  <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:s.color.label }}>{s.label}</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {s.lines.map((line,j) => {
                    const clean = line.replace(/^[-•]\s*/,"").trim();
                    const isBullet = /^[-•]/.test(line);
                    return (
                      <div key={j} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                        {isBullet && <div style={{ width:5, height:5, borderRadius:"50%", background:s.color.accent, flexShrink:0, marginTop:9 }} />}
                        <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:300, color:"#57534e", lineHeight:1.85, margin:0 }}>
                          {parseMarkdown(clean, s.color.accent)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:"#fff", border:"1px solid #e7e5e0", borderRadius:18, padding:"22px 26px", display:"flex", gap:14, alignItems:"flex-start", marginBottom:28, boxShadow:"0 1px 3px rgba(0,0,0,0.03)", opacity:show?1:0, transition:`opacity 0.5s ${0.2+sections.length*0.08}s ease` }}>
          <div style={{ width:40, height:40, borderRadius:12, flexShrink:0, background:"#f0fdf4", border:"1px solid #bbf7d0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>💪</div>
          <div>
            <p style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:15, color:"#1c1917", margin:"0 0 5px" }}>Real talk though —</p>
            <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:300, color:"#78716c", lineHeight:1.7, margin:0 }}>
              This roast is 100% for fun. Your resume shows real work and effort. Take the jokes as motivation to make it even more unroastable. Now go update that thing and apply! 🚀
            </p>
          </div>
        </div>

        <div style={{ display:"flex", gap:12, flexWrap:"wrap", opacity:show?1:0, transition:`opacity 0.5s ${0.3+sections.length*0.08}s ease` }}>
          <button onClick={onReset} style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:14, padding:"13px 26px", borderRadius:14, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#dc2626,#ef4444)", color:"#fff", boxShadow:"0 4px 16px rgba(220,38,38,0.3)", display:"inline-flex", alignItems:"center", gap:8, transition:"all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform="none"}>
            <RotateCcw size={14} /> Roast another
          </button>
          <button onClick={handleCopy} style={{ fontFamily:"'Outfit',sans-serif", fontWeight:500, fontSize:14, padding:"13px 26px", borderRadius:14, cursor:"pointer", background:"#fff", border:"1.5px solid #e7e5e0", color:"#1c1917", display:"inline-flex", alignItems:"center", gap:8, transition:"all 0.2s" }}>
            {copied ? <><Check size={14} color="#16a34a" /> Copied!</> : <><Copy size={14} /> Copy roast</>}
          </button>
          <a href="/matcher" style={{ fontFamily:"'Outfit',sans-serif", fontWeight:500, fontSize:14, padding:"13px 26px", borderRadius:14, textDecoration:"none", background:"#fff", border:"1.5px solid #e7e5e0", color:"#1c1917", display:"inline-flex", alignItems:"center", gap:8, transition:"border-color 0.2s" }}>
            <Zap size={14} /> Check job match
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────
export default function RoastPage() {
  useFonts();

  const [scrolled,  setScrolled]  = useState(false);
  const [phase,     setPhase]     = useState("upload");
  const [loadStep,  setLoadStep]  = useState(0);
  const [roastText, setRoastText] = useState("");
  const [error,     setError]     = useState(null);
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  async function handleRoast(resumeText) {
    setLoading(true);
    setPhase("loading");
    setLoadStep(0);
    setError(null);

    let s = 0;
    const iv = setInterval(() => { s++; setLoadStep(s); if (s >= 4) clearInterval(iv); }, 700);

    try {
      const roast = await roastResume(resumeText);
      clearInterval(iv);
      setLoadStep(5);
      setRoastText(roast);
      setTimeout(() => { setPhase("results"); setLoading(false); }, 400);
    } catch (err) {
      clearInterval(iv);
      setError(err.message || "Failed to connect to Groq API. Check your API key.");
      setPhase("upload");
      setLoading(false);
    }
  }

  function reset() {
    setPhase("upload");
    setRoastText("");
    setError(null);
    setLoadStep(0);
    setLoading(false);
  }

  return (
    <div style={{ minHeight:"100vh", background:"#f7f5f0" }}>
      <Navbar scrolled={scrolled} />
      {phase === "upload"  && <UploadPage onRoast={handleRoast} loading={loading} error={error} />}
      {phase === "loading" && <LoadingPage step={loadStep} />}
      {phase === "results" && roastText && <ResultsPage roastText={roastText} onReset={reset} />}
    </div>
  );
}
