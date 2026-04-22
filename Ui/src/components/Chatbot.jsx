import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Zap, Send } from "lucide-react";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// ── Google Fonts ──────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap";
    document.head.appendChild(l);
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      @keyframes msgIn   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes scanline{ 0%{left:-100%} 100%{left:200%} }
      @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.3} }
      @keyframes cardPop { from{opacity:0;transform:scale(0.97) translateY(6px)} to{opacity:1;transform:scale(1) translateY(0)} }
      * { box-sizing:border-box; margin:0; padding:0; }
      body { background:#f7f5f0; }
      .iscroll::-webkit-scrollbar{width:3px;}
      .iscroll::-webkit-scrollbar-thumb{background:#e2ddd6;border-radius:999px;}
      .iscroll::-webkit-scrollbar-track{background:transparent;}
      .co-hover{transition:all 0.2s cubic-bezier(0.4,0,0.2,1);}
      .co-hover:hover{transform:translateY(-1px);box-shadow:0 4px 20px rgba(0,0,0,0.08);}
      .chip-hover{transition:all 0.15s ease;}
      .chip-hover:hover{background:#f0ede8!important;border-color:#a8a29e!important;color:#1c1917!important;}
      .send-hover{transition:all 0.15s ease;}
      .send-hover:hover{background:#1e293b!important;transform:scale(1.04);}
      .pill-hover{transition:all 0.15s ease;cursor:pointer;}
    `;
    document.head.appendChild(style);
  }, []);
}

// ── Company data ──────────────────────────────────────────────────
const COMPANIES = [
  { id:"google",   name:"Google",   logo:"https://tse1.mm.bing.net/th/id/OIP.AfKMLf4rKX7EqOSAVpujIQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",   roles:"SWE · PM · Data Science",  tags:["FAANG","DSA Heavy","Remote"],   accent:"#4285f4", lightBg:"#e8f0fe", stats:[{n:"5–6",l:"Rounds"},{n:"$185k",l:"Base L4"},{n:"~8%",l:"Offer rate"},{n:"45d",l:"Timeline"}], welcome:"Google is one of the most rigorous FAANG companies. Expect heavy DSA focus, system design for senior roles, and a Googleyness round. Ask me anything — rounds, compensation, culture, or prep strategy." },
  { id:"amazon",   name:"Amazon",   logo:"https://th.bing.com/th/id/OIP.douAQqLQCydHXDqsPfOcpwHaEK?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",                roles:"SDE · PM · ML Engineer",   tags:["FAANG","LP Focus","Hybrid"],    accent:"#ff9900", lightBg:"#fff8ee", stats:[{n:"4–5",l:"Rounds"},{n:"$170k",l:"Base SDE2"},{n:"14 LPs",l:"Must know"},{n:"30d",l:"Timeline"}], welcome:"Amazon's interview is unique — Leadership Principles dominate every round. I have deep intel on all 14 LPs, the bar raiser process, SDE levels, and total compensation." },
  { id:"microsoft",name:"Microsoft",logo:"https://tse3.mm.bing.net/th/id/OIP.7IgX6OczyQrC3djWBE8xnwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",          roles:"SWE · PM · Azure Eng",     tags:["FAANG","Balanced","Hybrid"],    accent:"#00a4ef", lightBg:"#e6f4fe", stats:[{n:"4–5",l:"Rounds"},{n:"$180k",l:"Base SWE2"},{n:"Growth",l:"Focus"},{n:"21d",l:"Timeline"}], welcome:"Microsoft is known for a balanced, less adversarial culture. Strong growth across Azure, AI, and gaming. Ask about rounds, the as-is loop, or team matching." },
  { id:"meta",     name:"Meta",     logo:"https://tse1.mm.bing.net/th/id/OIP.lQ9JvL9Rxhx_s-VKQNEidgHaEK?rs=1&pid=ImgDetMain&o=7&rm=3", roles:"SWE · PM · AI Research", tags:["FAANG","Move Fast","Onsite"], accent:"#0082fb", lightBg:"#eff6ff", stats:[{n:"4–5",l:"Rounds"},{n:"$190k",l:"Base E4"},{n:"Top 5%",l:"Bar"},{n:"60d",l:"Timeline"}], welcome:"Meta moves fast and the bar is extremely high. Heavy coding rounds, product sense for PM, and systems thinking for SWE. I have intel on the full process." },
  { id:"apple",    name:"Apple",    logo:"https://tse2.mm.bing.net/th/id/OIP.RlBfAHo0ukrKBNgMLLTOuwHaEw?rs=1&pid=ImgDetMain&o=7&rm=3",       roles:"SWE · Design · PM",        tags:["FAANG","Secretive","Onsite"],   accent:"#555555", lightBg:"#f5f5f7", stats:[{n:"6–8",l:"Rounds"},{n:"$195k",l:"Base ICT3"},{n:"Niche",l:"Teams"},{n:"90d",l:"Long process"}], welcome:"Apple is notoriously secretive — vague JDs, long timelines, siloed teams. But the comp and prestige are top-tier. Ask me what I know about cracking it." },
  { id:"stripe",   name:"Stripe",   logo:"https://tse3.mm.bing.net/th/id/OIP.B3DucQCkYKONZUNIWt6xhQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3", roles:"Engineer · PM · Data", tags:["Fintech","Writing Heavy","Remote"], accent:"#635bff", lightBg:"#f0efff", stats:[{n:"5–6",l:"Rounds"},{n:"$200k",l:"Base L3"},{n:"Writing",l:"Key skill"},{n:"45d",l:"Timeline"}], welcome:"Stripe is a writing-first culture — written communication is evaluated in interviews. Very high technical bar with deep focus on API design and systems thinking." },
  { id:"openai",   name:"OpenAI",   logo:"https://tse1.mm.bing.net/th/id/OIP.rGJmE3TC0tntzTFXJIsUQwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",                roles:"Research · Eng · PM",       tags:["AI Lab","Mission Driven","Hybrid"], accent:"#10a37f", lightBg:"#f0fdf9", stats:[{n:"4–5",l:"Rounds"},{n:"$210k",l:"Base SWE"},{n:"ML Req",l:"Most roles"},{n:"60d",l:"Timeline"}], welcome:"OpenAI is mission-driven and moves at AI speed. Most roles require ML/AI background. They value research taste, systems thinking, and mission alignment." },
  { id:"flipkart", name:"Flipkart", logo:"https://tse3.mm.bing.net/th/id/OIP.vBmeNfhXI1Sue8fAfAmKWAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",                  roles:"SDE · PM · Data Eng",       tags:["India Top","E-Commerce","Bangalore"], accent:"#F5A623", lightBg:"#fff8ee", stats:[{n:"4–5",l:"Rounds"},{n:"₹30–50L",l:"CTC SDE2"},{n:"DSA+SD",l:"Focus"},{n:"30d",l:"Timeline"}], welcome:"Flipkart is one of India's top tech employers. Strong DSA + system design bar, good work-life balance vs FAANG. Ask about rounds, CTC, and culture." },
];

const FILTER_PILLS = ["All", "Interview", "Salary", "Culture", "System Design"];

const ACCENT = {
  blue:   { label:"#0369a1", bg:"#e6f4fe", border:"#bfdbfe" },
  green:  { label:"#15803d", bg:"#f0fdf4", border:"#bbf7d0" },
  amber:  { label:"#b45309", bg:"#fffbeb", border:"#fde68a" },
  purple: { label:"#6d28d9", bg:"#faf5ff", border:"#e9d5ff" },
};

const REPLIES = {
  salary:    { type:"intel", section:"Compensation Intel",  icon:"💰", ak:"green",  body:"Compensation packages are <strong>highly competitive</strong> with significant equity components. Base salary is just one part — RSU grants and signing bonuses often double the total package.", stats:[{n:"$160k+",l:"Avg base"},{n:"$80k",l:"RSU/yr"},{n:"4yr",l:"Vest"},{n:"$30k",l:"Signing"}], prose:"Total comp (TC) is what matters — always negotiate on RSUs. Ask about refresh grants after year one." },
  interview: { type:"intel", section:"Interview Roadmap",   icon:"🗺️", ak:"amber",  body:"<strong>Round 1–2:</strong> Phone screens — 45 mins of LeetCode medium/hard. Edge cases and communication matter.<br><br><strong>Round 3–5 (Onsite):</strong> 2 coding rounds, 1 system design (L4+), 1 behavioural culture-fit round.", stats:[{n:"5–6",l:"Total rounds"},{n:"45min",l:"Per round"},{n:"Med/Hard",l:"LC level"},{n:"3–4wk",l:"Decision"}], prose:"Interviewers score your <strong>communication as much as correctness</strong>. Start brute force, then optimise." },
  culture:   { type:"prose", section:"Culture Signals",     icon:"🏢", ak:"blue",   body:"Culture varies by team. Core values like <strong>ownership and technical rigour</strong> are universal, but work-life balance ranges from intense (growth teams) to sustainable (platform teams).", prose:"Employees consistently rate <strong>peer quality</strong> as exceptional. High expectations but enormous learning." },
  dsa:       { type:"intel", section:"DSA Prep Intel",      icon:"🧠", ak:"purple", body:"Focus on: <strong>Graphs & BFS/DFS</strong> (very common), <strong>Dynamic Programming</strong> (med–hard), <strong>Trees & recursion</strong>, <strong>Two pointers / sliding window</strong> for arrays.", stats:[{n:"Graph",l:"#1 topic"},{n:"DP",l:"#2 topic"},{n:"Trees",l:"#3 topic"},{n:"350+",l:"LC to solve"}], prose:"LeetCode Medium is the baseline. Aim 300–400 problems — focus on patterns, not memorisation." },
  default:   { type:"intel", section:"Company Intel",       icon:"📋", ak:"blue",   body:"Based on our RAG knowledge base, this company uses a <strong>structured multi-round format</strong>. Each round has a specific purpose — coding, system design, behavioural, and culture fit.", stats:[{n:"4–6",l:"Rounds"},{n:"60min",l:"Per round"},{n:"2–4wk",l:"Decision"},{n:"Top 10%",l:"Accept rate"}], prose:"Start your prep 6–8 weeks out. Mock interviews, system design, and a behavioural story bank are the three pillars." },
};

// function pickReply(text) {
//   const t = text.toLowerCase();
//   if (t.includes("salary")||t.includes("comp")||t.includes("pay")||t.includes("ctc")) return REPLIES.salary;
//   if (t.includes("interview")||t.includes("round")||t.includes("process")||t.includes("step")) return REPLIES.interview;
//   if (t.includes("culture")||t.includes("work")||t.includes("balance")||t.includes("team")) return REPLIES.culture;
//   if (t.includes("dsa")||t.includes("algo")||t.includes("leetcode")||t.includes("prep")||t.includes("topic")) return REPLIES.dsa;
//   return REPLIES.default;
// }
// const res = await fetch("http://localhost:8001/chat", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ query: text, company: activeCo.id, top_k: 3 }),
// });
// const data = await res.json();
// data.answer is the LLM response string

// ── Sub-components ────────────────────────────────────────────────
function LogoImg({ src, alt, accent, size = 32 }) {
  const [err, setErr] = useState(false);
  if (err) return <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize: size * 0.38, color: accent }}>{alt[0]}</span>;
  return <img src={src} alt={alt} onError={() => setErr(true)} style={{ width:"78%", height:"78%", objectFit:"contain" }} />;
}

function CompanyCard({ co, active, onClick }) {
  return (
    <div className="co-hover" onClick={onClick} style={{ borderRadius:16, padding:"12px 14px", cursor:"pointer", border: active ? `2px solid ${co.accent}` : "1.5px solid #ede9e3", background: active ? "#fff" : "#fafaf9", boxShadow: active ? `0 2px 16px ${co.accent}22` : "none", animation:"cardPop 0.4s ease both" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:9 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:co.lightBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, overflow:"hidden", border:`1px solid ${co.accent}22` }}>
          <LogoImg src={co.logo} alt={co.name} accent={co.accent} size={36} />
        </div>
        <div style={{ minWidth:0 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:"#1c1917", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{co.name}</div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#a8a29e", marginTop:1 }}>{co.roles}</div>
        </div>
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
        {co.tags.map(t => (
          <span key={t} style={{ fontFamily:"'Outfit',sans-serif", fontSize:10, fontWeight:500, padding:"2px 8px", borderRadius:999, background: active ? `${co.accent}15` : "#f0ede8", color: active ? co.accent : "#78716c", border: active ? `1px solid ${co.accent}30` : "1px solid transparent" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function WelcomeCard({ co }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8, animation:"msgIn 0.5s ease both" }}>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#a8a29e", letterSpacing:"1.5px", textTransform:"uppercase", paddingLeft:2 }}>Intel briefing</div>
      <div style={{ background:"#fff", border:"1px solid #ede9e3", borderRadius:18, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ height:3, background:`linear-gradient(90deg,${co.accent},${co.accent}66)` }} />
        <div style={{ padding:"12px 16px 10px", borderBottom:"1px solid #f5f4f1", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:co.lightBg, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", border:`1px solid ${co.accent}22`, flexShrink:0 }}>
            <LogoImg src={co.logo} alt={co.name} accent={co.accent} size={28} />
          </div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:"#1c1917" }}>{co.name} — Company Intelligence</span>
        </div>
        <div style={{ padding:"12px 16px", fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:300, color:"#44403c", lineHeight:1.8 }}>{co.welcome}</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8, padding:"0 16px 14px" }}>
          {co.stats.map((s,i) => (
            <div key={i} style={{ background:"#fafaf9", border:"1px solid #f0ede8", borderRadius:10, padding:"8px 10px" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:16, color:"#1c1917", lineHeight:1 }}>{s.n}</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#a8a29e", marginTop:3 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IntelCard({ data, co }) {
  const c = ACCENT[data.ak] || ACCENT.blue;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8, animation:"msgIn 0.4s ease both" }}>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#a8a29e", letterSpacing:"1.5px", textTransform:"uppercase", paddingLeft:2 }}>Intel response</div>
      <div style={{ background:"#fff", border:"1px solid #ede9e3", borderRadius:18, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ height:3, background:`linear-gradient(90deg,${co.accent},${c.label})` }} />
        <div style={{ padding:"11px 16px 10px", borderBottom:"1px solid #f5f4f1", display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:24, height:24, borderRadius:7, background:c.bg, border:`1px solid ${c.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12 }}>{data.icon}</div>
          <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"1.8px", textTransform:"uppercase", color:c.label }}>{data.section}</span>
        </div>
        <div style={{ padding:"12px 16px", fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:300, color:"#44403c", lineHeight:1.8 }} dangerouslySetInnerHTML={{ __html:data.body }} />
        {data.stats && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8, padding:"0 16px 14px" }}>
            {data.stats.map((s,i) => (
              <div key={i} style={{ background:"#fafaf9", border:"1px solid #f0ede8", borderRadius:10, padding:"8px 10px" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:15, color:"#1c1917", lineHeight:1 }}>{s.n}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#a8a29e", marginTop:3 }}>{s.l}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {data.prose && (
        <div style={{ background:"#fff", border:"1px solid #ede9e3", borderRadius:"4px 16px 16px 16px", padding:"11px 15px", fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:300, color:"#57534e", lineHeight:1.75, maxWidth:"90%" }}>
          💡 <span dangerouslySetInnerHTML={{ __html:data.prose }} />
        </div>
      )}
    </div>
  );
}

// function ProseBubble({ data }) {
//   return (
//     <div style={{ display:"flex", flexDirection:"column", gap:6, animation:"msgIn 0.4s ease both" }}>
//       <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#a8a29e", letterSpacing:"1.5px", textTransform:"uppercase", paddingLeft:2 }}>Intel note</div>
//       <div style={{ background:"#fff", border:"1px solid #ede9e3", borderRadius:"4px 16px 16px 16px", padding:"13px 16px", fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:300, color:"#44403c", lineHeight:1.8, maxWidth:"88%", boxShadow:"0 1px 4px rgba(0,0,0,0.03)" }} dangerouslySetInnerHTML={{ __html:data.body }} />
//       {data.prose && (
//         <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:"4px 12px 12px 12px", padding:"9px 14px", fontFamily:"'Outfit',sans-serif", fontSize:12, fontWeight:400, color:"#92400e", lineHeight:1.7, maxWidth:"85%" }} dangerouslySetInnerHTML={{ __html:data.prose }} />
//       )}
//     </div>
//   );
// }

// WITH THIS:
function ProseBubble({ data }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6, animation:"msgIn 0.4s ease both" }}>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#a8a29e", letterSpacing:"1.5px", textTransform:"uppercase", paddingLeft:2 }}>Intel note</div>
      <div style={{ background:"#fff", border:"1px solid #ede9e3", borderRadius:"4px 16px 16px 16px", padding:"13px 16px", maxWidth:"88%", boxShadow:"0 1px 4px rgba(0,0,0,0.03)" }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p:      ({node, ...props}) => <p      style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:300, color:"#44403c", lineHeight:1.8, marginBottom:8 }} {...props} />,
            strong: ({node, ...props}) => <strong style={{ fontWeight:600, color:"#1c1917" }} {...props} />,
            h1:     ({node, ...props}) => <h1     style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16, color:"#1c1917", marginBottom:8, marginTop:10 }} {...props} />,
            h2:     ({node, ...props}) => <h2     style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:"#1c1917", marginBottom:6, marginTop:10 }} {...props} />,
            h3:     ({node, ...props}) => <h3     style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:13, color:"#1c1917", marginBottom:4, marginTop:8 }} {...props} />,
            ul:     ({node, ...props}) => <ul     style={{ paddingLeft:18, marginBottom:8 }} {...props} />,
            ol:     ({node, ...props}) => <ol     style={{ paddingLeft:18, marginBottom:8 }} {...props} />,
            li:     ({node, ...props}) => <li     style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:300, color:"#44403c", lineHeight:1.8, marginBottom:3 }} {...props} />,
            code:   ({node, ...props}) => <code   style={{ fontFamily:"'DM Mono',monospace", fontSize:11, background:"#f0ede8", padding:"1px 5px", borderRadius:4, color:"#1c1917" }} {...props} />,
            hr:     ({node, ...props}) => <hr     style={{ border:"none", borderTop:"1px solid #f0ede8", margin:"10px 0" }} {...props} />,
          }}
        >
          {data.body}
        </ReactMarkdown>
      </div>
      {data.prose && (
        <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:"4px 12px 12px 12px", padding:"9px 14px", fontFamily:"'Outfit',sans-serif", fontSize:12, fontWeight:400, color:"#92400e", lineHeight:1.7, maxWidth:"85%" }}>
          {data.prose}
        </div>
      )}
    </div>
  );
}

function UserMsg({ text }) {
  return (
    <div style={{ display:"flex", justifyContent:"flex-end", animation:"msgIn 0.3s ease both" }}>
      <div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#94a3b8", marginBottom:4, textAlign:"right", letterSpacing:"1.2px", textTransform:"uppercase" }}>Your query</div>
        <div style={{ background:"#0f172a", color:"#f8fafc", fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:400, lineHeight:1.65, padding:"10px 15px", borderRadius:"16px 16px 4px 16px", maxWidth:360 }}>{text}</div>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6, animation:"msgIn 0.3s ease both" }}>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#a8a29e", letterSpacing:"1.5px", textTransform:"uppercase", paddingLeft:2 }}>Compiling intel</div>
      <div style={{ background:"#fff", border:"1px solid #ede9e3", borderRadius:"4px 16px 16px 16px", padding:"11px 16px", display:"flex", alignItems:"center", gap:12, width:"fit-content" }}>
        <div style={{ width:52, height:2, background:"#f0ede8", borderRadius:999, overflow:"hidden", position:"relative" }}>
          <div style={{ position:"absolute", top:0, left:0, width:"50%", height:"100%", background:"#0f172a", borderRadius:999, animation:"scanline 1.2s linear infinite" }} />
        </div>
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#a8a29e", letterSpacing:"0.5px" }}>Searching RAG database...</span>
      </div>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────
function Navbar({ scrolled }) {
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:300, height:62, padding:"0 2.5rem", background: scrolled?"rgba(247,245,240,0.97)":"transparent", backdropFilter: scrolled?"blur(20px)":"none", borderBottom: scrolled?"1px solid rgba(0,0,0,0.06)":"none", display:"flex", alignItems:"center", justifyContent:"space-between", transition:"all 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
      <a href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
        <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 12px rgba(99,102,241,0.3)" }}><Zap size={18} color="#fff" strokeWidth={2.2} /></div>
        <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:20, color:"#1c1917", letterSpacing:"-0.5px" }}>ResumeIQ</span>
      </a>
      <div style={{ display:"flex", gap:36 }}>
        {[["Resume Matcher","#",false],["Resume Roast","#",false],["Company Intel","#",true]].map(([label,href,active]) => (
          <a key={label} href={href} style={{ fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:active?600:400, color:active?"#6366f1":"#78716c", textDecoration:"none", borderBottom:active?"2px solid #6366f1":"2px solid transparent", paddingBottom:2, transition:"color 0.2s" }}>{label}</a>
        ))}
      </div>
      <a href="/" style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:500, padding:"8px 18px", borderRadius:20, border:"1px solid #d6d3cd", textDecoration:"none", color:"#57534e", background:"transparent", display:"inline-flex", alignItems:"center", gap:6 }}><ArrowLeft size={14} /> Home</a>
    </nav>
  );
}

// ── Root page ─────────────────────────────────────────────────────
export default function CompanyIntelPage() {
  useFonts();
  const [scrolled,      setScrolled]      = useState(false);
  const [activeCo,      setActiveCo]      = useState(COMPANIES[0]);
  const [messages,      setMessages]      = useState([{ type:"welcome", co:COMPANIES[0] }]);
  const [input,         setInput]         = useState("");
  const [typing,        setTyping]        = useState(false);
  const [activeFilter,  setActiveFilter]  = useState("All");
  const endRef   = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => { setMessages([{ type:"welcome", co:activeCo }]); }, [activeCo.id]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, typing]);

  // async function send() {
  //   const text = input.trim();
  //   if (!text || typing) return;
  //   setInput("");
  //   setMessages(p => [...p, { type:"user", text }]);
  //   setTyping(true);
  //   await new Promise(r => setTimeout(r, 1500));
  //   setTyping(false);
  //   const reply = pickReply(text);
  //   setMessages(p => [...p, { type:"ai", data:reply }]);
  // }

    async function send() {
    const text = input.trim();
    if (!text || typing) return;

    setInput("");
    setMessages(p => [...p, { type: "user", text }]);
    setTyping(true);

    try {
      const res = await fetch("http://localhost:8001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: text,
          // company: activeCo.name, 
          company: activeCo.id,
          top_k: 6,
        }),
      });

      const data = await res.json();

      setTyping(false);

      setMessages(p => [
        ...p,
        {
          type: "ai",
          data: {
            type: "prose",
            body: data.answer || "No response",
          },
        },
      ]);

    } catch (err) {
      setTyping(false);
      console.error(err);

      setMessages(p => [
        ...p,
        {
          type: "ai",
          data: {
            type: "prose",
            body: "❌ Backend error. Check server.",
          },
        },
      ]);
    }
  }

  const CHIPS = ["What's the interview process?","Salary & comp breakdown","DSA topics to prep","Culture & work-life balance","System design tips","How to get a referral?"];

  return (
    <div style={{ minHeight:"100vh", background:"#f7f5f0", paddingTop:62 }}>
      <Navbar scrolled={scrolled} />

      {/* Hero */}
      <div style={{ textAlign:"center", padding:"44px 2rem 28px", animation:"fadeUp 0.6s ease both" }}>
        <div style={{ display:"inline-block", background:"linear-gradient(135deg,#eef2ff,#faf5ff)", border:"1px solid #e0e7ff", borderRadius:999, padding:"5px 18px", marginBottom:20 }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, fontWeight:500, color:"#6366f1", letterSpacing:"1.2px", textTransform:"uppercase" }}>RAG-Powered · Company Intelligence</span>
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:"clamp(2rem,4vw,3rem)", color:"#1c1917", letterSpacing:"-2px", lineHeight:1.05, margin:"0 0 14px" }}>
          Crack your dream company<br /><em style={{ color:"#6366f1", fontStyle:"italic" }}>with insider intel.</em>
        </h1>
        <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:300, color:"#78716c", maxWidth:480, margin:"0 auto", lineHeight:1.7 }}>
          Select a company, ask anything. Deep knowledge on interviews, salaries, culture, and prep strategy.
        </p>
      </div>

      {/* Two-panel */}
      <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 1.5rem 60px", display:"grid", gridTemplateColumns:"272px 1fr", gap:20, animation:"fadeUp 0.6s 0.15s ease both" }}>

        {/* LEFT sidebar */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ background:"#fff", borderRadius:16, padding:"14px 16px 12px", border:"1px solid #ede9e3", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, color:"#1c1917", marginBottom:2 }}>Select Company</div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#a8a29e", letterSpacing:"1px", textTransform:"uppercase" }}>Pick your target</div>
          </div>

          <div className="iscroll" style={{ display:"flex", flexDirection:"column", gap:7, maxHeight:520, overflowY:"auto", paddingRight:2 }}>
            {COMPANIES.map((co,i) => (
              <div key={co.id} style={{ animationDelay:`${i*0.04}s` }}>
                <CompanyCard co={co} active={activeCo.id===co.id} onClick={() => setActiveCo(co)} />
              </div>
            ))}
          </div>

          <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:14, padding:"10px 14px", display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e", flexShrink:0, animation:"pulse 2s infinite" }} />
            <div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#15803d", letterSpacing:"1px", textTransform:"uppercase" }}>RAG Intel Live</div>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:11, color:"#16a34a", fontWeight:300, marginTop:1 }}>{COMPANIES.length} companies indexed</div>
            </div>
          </div>
        </div>

        {/* RIGHT chat panel */}
        <div style={{ background:"#fff", borderRadius:20, border:"1px solid #ede9e3", boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 8px 32px rgba(0,0,0,0.03)", display:"flex", flexDirection:"column", height:680, overflow:"hidden" }}>

          {/* Chat header */}
          <div style={{ padding:"13px 20px", borderBottom:"1px solid #f0ede8", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, background:"#fff" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:38, height:38, borderRadius:11, background:activeCo.lightBg, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", border:`1.5px solid ${activeCo.accent}33`, flexShrink:0 }}>
                <LogoImg src={activeCo.logo} alt={activeCo.name} accent={activeCo.accent} size={38} />
              </div>
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:"#1c1917" }}>{activeCo.name}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#a8a29e", letterSpacing:"0.5px", marginTop:1 }}>{activeCo.roles}</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:5 }}>
              {FILTER_PILLS.map(f => (
                <button key={f} className="pill-hover" onClick={() => setActiveFilter(f)} style={{ fontFamily:"'DM Mono',monospace", fontSize:9, padding:"4px 10px", borderRadius:999, border: activeFilter===f ? `1.5px solid ${activeCo.accent}` : "1px solid #e7e5e0", background: activeFilter===f ? activeCo.accent : "#fff", color: activeFilter===f ? "#fff" : "#78716c", letterSpacing:"0.5px" }}>{f}</button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="iscroll" style={{ flex:1, overflowY:"auto", padding:"18px 20px", display:"flex", flexDirection:"column", gap:16, background:"#f7f5f0" }}>
            {messages.map((msg,i) => {
              if (msg.type==="welcome") return <WelcomeCard key={i} co={msg.co} />;
              if (msg.type==="user")    return <UserMsg key={i} text={msg.text} />;
              if (msg.type==="ai") {
                if (msg.data.type==="intel") return <IntelCard key={i} data={msg.data} co={activeCo} />;
                if (msg.data.type==="prose") return <ProseBubble key={i} data={msg.data} />;
              }
              return null;
            })}
            {typing && <TypingBubble />}
            <div ref={endRef} />
          </div>

          {/* Quick chips */}
          <div style={{ padding:"9px 16px 6px", background:"#fff", borderTop:"1px solid #f0ede8", display:"flex", gap:6, flexWrap:"wrap", flexShrink:0 }}>
            {CHIPS.map(chip => (
              <button key={chip} className="chip-hover" onClick={() => { setInput(chip); inputRef.current?.focus(); }} style={{ fontFamily:"'Outfit',sans-serif", fontSize:11, fontWeight:500, padding:"5px 12px", borderRadius:999, border:"1px solid #e7e5e0", color:"#57534e", background:"#fafaf9", cursor:"pointer", whiteSpace:"nowrap" }}>{chip}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding:"10px 16px 14px", background:"#fff", display:"flex", gap:10, alignItems:"flex-end", flexShrink:0 }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} }}
              placeholder={`Ask anything about ${activeCo.name}...`}
              rows={1}
              style={{ flex:1, border:"1.5px solid #e7e5e0", borderRadius:14, padding:"10px 14px", fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:300, color:"#1c1917", background:"#fafaf9", outline:"none", resize:"none", height:44, lineHeight:1.5, transition:"border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor=activeCo.accent}
              onBlur={e  => e.target.style.borderColor="#e7e5e0"}
            />
            <button className="send-hover" onClick={send} disabled={!input.trim()||typing} style={{ width:44, height:44, borderRadius:13, background:input.trim()?"#0f172a":"#e7e5e0", border:"none", cursor:input.trim()?"pointer":"not-allowed", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Send size={16} color={input.trim()?"#fff":"#a8a29e"} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}