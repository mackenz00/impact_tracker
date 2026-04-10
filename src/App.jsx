import { useState, useEffect, useRef } from "react";

const FONT_URL = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap";

const SEED_GRANTS = [
  { id: "g1", name: "Knight Community News Fund", funder: "Knight Foundation", amount: 150000, start: "2025-09-01", end: "2026-08-31" },
  { id: "g2", name: "Local Accountability Grant", funder: "Press Forward", amount: 80000, start: "2025-06-01", end: "2026-05-31" },
  { id: "g3", name: "Health Equity Reporting", funder: "Robert Wood Johnson Foundation", amount: 60000, start: "2026-01-01", end: "2026-12-31" },
];

const IMPACT_CATEGORIES = [
  { key: "policy", label: "Policy / Legislative", icon: "⚖️", color: "#6366f1" },
  { key: "institutional", label: "Institutional Change", icon: "🏛️", color: "#0891b2" },
  { key: "media", label: "Media Amplification", icon: "📡", color: "#d946ef" },
  { key: "community", label: "Community Action", icon: "👥", color: "#16a34a" },
  { key: "academic", label: "Academic / Research", icon: "🎓", color: "#ca8a04" },
  { key: "individual", label: "Individual Outcome", icon: "🧑", color: "#ea580c" },
  { key: "kindword", label: "Kind Word", icon: "💛", color: "#facc15" },
];

const PIPELINE_STAGES = ["pitch", "reporting", "editing", "published"];
const STAGE_LABELS = { pitch: "Pitch", reporting: "Reporting", editing: "Editing", published: "Published" };

const REPORTERS = [
  { id: "r1", name: "Maya Chen", avatar: "MC", streak: 12, totalImpacts: 14, level: 3, xp: 740 },
  { id: "r2", name: "James Okafor", avatar: "JO", streak: 8, totalImpacts: 11, level: 2, xp: 580 },
  { id: "r3", name: "Sofia Reyes", avatar: "SR", streak: 15, totalImpacts: 18, level: 4, xp: 920 },
  { id: "r4", name: "Carlos Vega", avatar: "CV", streak: 3, totalImpacts: 5, level: 1, xp: 220 },
];

const LEVEL_THRESHOLDS = [
  { level: 1, title: "Seedling", xp: 0, icon: "🌱" },
  { level: 2, title: "Spark", xp: 300, icon: "✨" },
  { level: 3, title: "Catalyst", xp: 600, icon: "🔥" },
  { level: 4, title: "Changemaker", xp: 900, icon: "⚡" },
  { level: 5, title: "Trailblazer", xp: 1200, icon: "🌟" },
];

const BADGES = [
  { id: "b1", name: "First Impact", icon: "🎯", desc: "Logged your first impact event" },
  { id: "b2", name: "Policy Mover", icon: "⚖️", desc: "3+ policy/legislative impacts" },
  { id: "b3", name: "Streak Week", icon: "🔥", desc: "7-day logging streak" },
  { id: "b4", name: "Full Spectrum", icon: "🌈", desc: "Impacts across all 6 categories" },
  { id: "b5", name: "Amplified", icon: "📡", desc: "Story picked up by 3+ outlets" },
  { id: "b6", name: "Community Voice", icon: "💬", desc: "10+ kind words received" },
  { id: "b7", name: "Grant Hero", icon: "🏆", desc: "20+ impacts on a single grant" },
];

const SEED_STORIES = [
  { id: "s1", title: "Shadow Landlords: Who Really Owns Downtown", beat: "Housing", reporter: "Maya Chen", stage: "published", publishDate: "2026-02-14", grantId: "g1", intendedImpact: "Expose LLC shell companies hiding property ownership", pageviews: 24300, timeOnPage: 284, shares: 1820 },
  { id: "s2", title: "The PFAS Pipeline: Contamination in Rural Wells", beat: "Environment", reporter: "James Okafor", stage: "published", publishDate: "2026-03-02", grantId: "g2", intendedImpact: "Force state EPA to test private wells near industrial sites", pageviews: 18700, timeOnPage: 312, shares: 2400 },
  { id: "s3", title: "ER Deserts: When the Nearest Hospital Is 90 Minutes Away", beat: "Health", reporter: "Sofia Reyes", stage: "published", publishDate: "2026-01-20", grantId: "g3", intendedImpact: "Pressure legislature to fund rural emergency care", pageviews: 31200, timeOnPage: 256, shares: 3100 },
  { id: "s4", title: "School Board Spending Under the Microscope", beat: "Education", reporter: "Maya Chen", stage: "editing", grantId: "g1", intendedImpact: "Public transparency of district procurement" },
  { id: "s5", title: "Immigrant Workers and Wage Theft", beat: "Labor", reporter: "Carlos Vega", stage: "reporting", grantId: "g2", intendedImpact: "Enforcement against serial wage-theft offenders" },
  { id: "s6", title: "Maternal Mortality in Black Communities", beat: "Health", reporter: "Sofia Reyes", stage: "pitch", grantId: "g3", intendedImpact: "Hospital policy changes for postpartum monitoring" },
  { id: "s7", title: "Dark Money in City Council Races", beat: "Politics", reporter: "James Okafor", stage: "pitch", grantId: "g2", intendedImpact: "Campaign finance reform at municipal level" },
];

const SEED_IMPACTS = [
  { id: "i1", storyId: "s1", category: "policy", date: "2026-03-01", description: "City council introduced ordinance requiring LLC ownership disclosure for residential properties", magnitude: "major", source: "City Council minutes", reporter: "Maya Chen", via: "manual" },
  { id: "i2", storyId: "s1", category: "media", date: "2026-02-20", description: "Investigation cited by NYT in national housing series", magnitude: "major", source: "New York Times, Feb 20", reporter: "Maya Chen", via: "slack" },
  { id: "i3", storyId: "s1", category: "community", date: "2026-02-28", description: "Tenant coalition formed using data from reporting to challenge evictions", magnitude: "moderate", source: "Coalition organizer", reporter: "Maya Chen", via: "manual" },
  { id: "i4", storyId: "s2", category: "institutional", date: "2026-03-15", description: "State EPA announced emergency testing of 200+ private wells in three counties", magnitude: "major", source: "EPA press release", reporter: "James Okafor", via: "slack" },
  { id: "i5", storyId: "s2", category: "policy", date: "2026-04-02", description: "State senator introduced bill requiring industrial PFAS discharge reporting", magnitude: "major", source: "Senate Bill S-4217", reporter: "James Okafor", via: "manual" },
  { id: "i6", storyId: "s2", category: "individual", date: "2026-03-20", description: "Family in story received donated water filtration system after reader response", magnitude: "moderate", source: "Reporter follow-up", reporter: "James Okafor", via: "email" },
  { id: "i7", storyId: "s3", category: "policy", date: "2026-02-10", description: "Governor referenced reporting in budget address, proposing $12M for rural ER grants", magnitude: "major", source: "Budget address transcript", reporter: "Sofia Reyes", via: "slack" },
  { id: "i8", storyId: "s3", category: "media", date: "2026-01-28", description: "Story republished by AP, reaching 140+ regional outlets", magnitude: "major", source: "AP wire", reporter: "Sofia Reyes", via: "manual" },
  { id: "i9", storyId: "s3", category: "academic", date: "2026-03-10", description: "Dataset cited in Johns Hopkins rural health access study", magnitude: "moderate", source: "JHU working paper", reporter: "Sofia Reyes", via: "email" },
  { id: "i10", storyId: "s3", category: "community", date: "2026-02-05", description: "Three rural communities organized town halls on emergency care access", magnitude: "moderate", source: "Community organizer emails", reporter: "Sofia Reyes", via: "slack" },
  { id: "i11", storyId: "s1", category: "individual", date: "2026-03-12", description: "Tenant won eviction case citing reporting as evidence of landlord fraud", magnitude: "moderate", source: "Court filing", reporter: "Maya Chen", via: "manual" },
  { id: "i12", storyId: "s3", category: "kindword", date: "2026-02-02", description: "\"Your ER story saved my mom's life. We drove to the next county because of your map. Thank you.\" — Reader email from Sarah M.", magnitude: "moderate", source: "Reader email", reporter: "Sofia Reyes", via: "email" },
  { id: "i13", storyId: "s1", category: "kindword", date: "2026-03-05", description: "\"Finally someone is naming these ghost landlords. This story gave us ammunition.\" — Community member at town hall", magnitude: "moderate", source: "Reporter notes", reporter: "Maya Chen", via: "slack" },
  { id: "i14", storyId: "s2", category: "kindword", date: "2026-03-22", description: "\"I'm a teacher in Millbrook County and I've been worried about our water for years. Thank you for proving what we all suspected.\" — Local teacher email", magnitude: "moderate", source: "Forwarded email", reporter: "James Okafor", via: "email" },
];

const SEED_SLACK = [
  { id: "sm1", user: "Sofia Reyes", avatar: "SR", time: "9:12 AM", text: "Just got off the phone with a reader — her mom was in a car accident last month and she used the ER distance map from our story to find the nearest open ER. She said it saved critical time. 😭", storyRef: "ER Deserts", parsed: true, impactType: "individual" },
  { id: "sm2", user: "James Okafor", avatar: "JO", time: "11:45 AM", text: "State Sen. Martinez just introduced SB-4217 requiring industrial PFAS discharge reporting. Her office confirmed our PFAS Pipeline series was the catalyst. This is huge.", storyRef: "PFAS Pipeline", parsed: true, impactType: "policy" },
  { id: "sm3", user: "Maya Chen", avatar: "MC", time: "2:30 PM", text: "Forwarding from the tenant coalition — they're using our LLC ownership data as evidence in 3 pending eviction cases in district court.", storyRef: "Shadow Landlords", parsed: true, impactType: "community" },
  { id: "sm4", user: "Impact Bot", avatar: "🤖", time: "3:00 PM", text: null, isBot: true, highlight: { reporter: "Sofia Reyes", avatar: "SR", story: "ER Deserts: When the Nearest Hospital Is 90 Minutes Away", impactCount: 5, latestImpact: "Governor referenced reporting in budget address, proposing $12M for rural ER grants", streak: 15, kindWord: "\"Your ER story saved my mom's life. We drove to the next county because of your map.\" — Reader email" } },
  { id: "sm5", user: "Carlos Vega", avatar: "CV", time: "4:15 PM", text: "Small win: got an email from a worker featured in the wage theft piece — his employer just paid back $4,200 in stolen wages after our story ran.", storyRef: "Wage Theft", parsed: false },
];

// ── Inject Styles ──
const injectStyles = () => {
  if (document.getElementById("it-styles")) return;
  const link = document.createElement("link"); link.rel = "stylesheet"; link.href = FONT_URL; document.head.appendChild(link);
  const s = document.createElement("style"); s.id = "it-styles";
  s.textContent = `
    :root{--bg:#0c0c0e;--sf:#16161a;--sf2:#1e1e24;--sf3:#26262e;--bd:#2a2a34;--bdl:#35354a;--tx:#e8e6e3;--tx2:#9a9aad;--txm:#5c5c72;--ac:#c8ff00;--acd:rgba(200,255,0,.12);--rd:#ff4d6a;--gn:#22c55e;--yl:#facc15;--se:'Instrument Serif',Georgia,serif;--sa:'DM Sans',-apple-system,sans-serif;--r:10px;--rs:6px}
    *{margin:0;padding:0;box-sizing:border-box}body{background:var(--bg)}::selection{background:var(--ac);color:var(--bg)}
    input,select,textarea{font-family:var(--sa);font-size:13px;color:var(--tx);background:var(--sf);border:1px solid var(--bd);border-radius:var(--rs);padding:8px 12px;outline:none;transition:border-color .2s}
    input:focus,select:focus,textarea:focus{border-color:var(--ac)}textarea{resize:vertical;min-height:60px}select{cursor:pointer}
    @keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes si{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes sg{0%,100%{box-shadow:0 0 8px rgba(200,255,0,.2)}50%{box-shadow:0 0 20px rgba(200,255,0,.5)}}
    .fu{animation:fu .4s ease both}.si{animation:si .35s ease both}.sg{animation:sg 2s ease-in-out infinite}
    .xpb{background:linear-gradient(90deg,var(--ac),#a3e635,var(--ac));background-size:200% 100%;animation:shimmer 3s linear infinite}
  `;
  document.head.appendChild(s);
};

// ── Shared UI ──
const Badge = ({children,color,style:sx}) => <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,fontFamily:"var(--sa)",letterSpacing:".04em",textTransform:"uppercase",padding:"3px 10px",borderRadius:20,background:color?`${color}18`:"var(--acd)",color:color||"var(--ac)",whiteSpace:"nowrap",...sx}}>{children}</span>;
const Btn = ({children,primary,small,style:sx,...p}) => <button {...p} style={{fontFamily:"var(--sa)",fontSize:small?12:13,fontWeight:600,padding:small?"6px 14px":"9px 20px",borderRadius:8,border:primary?"none":"1px solid var(--bd)",background:primary?"var(--ac)":"transparent",color:primary?"var(--bg)":"var(--tx2)",cursor:"pointer",transition:"all .2s",...sx}}>{children}</button>;
const Stat = ({label,value,sub}) => <div style={{padding:"18px 20px",background:"var(--sf)",borderRadius:"var(--r)",border:"1px solid var(--bd)"}}><div style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>{label}</div><div style={{fontFamily:"var(--se)",fontSize:32,color:"var(--tx)",lineHeight:1}}>{value}</div>{sub&&<div style={{fontFamily:"var(--sa)",fontSize:12,color:"var(--tx2)",marginTop:6}}>{sub}</div>}</div>;
const Field = ({label,children}) => <div style={{marginBottom:16}}><label style={{display:"block",fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>{label}</label>{children}</div>;
const Avatar = ({initials,size=32,color:c}) => <div style={{width:size,height:size,borderRadius:"50%",background:c||"var(--sf3)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--sa)",fontSize:size*.38,fontWeight:700,color:"var(--tx)",flexShrink:0}}>{initials}</div>;
const ViaTag = ({via}) => {const c={slack:{l:"Slack",c:"#4A154B",i:"#"},email:{l:"Email",c:"#0891b2",i:"✉"},manual:{l:"Manual",c:"var(--txm)",i:"✎"}}[via]||{l:"Manual",c:"var(--txm)",i:"✎"};return <span style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:10,fontFamily:"var(--sa)",fontWeight:600,padding:"2px 8px",borderRadius:10,background:`${c.c}22`,color:c.c,letterSpacing:".03em"}}>{c.i} {c.l}</span>};
const Modal = ({open,onClose,title,children}) => {if(!open)return null;return <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,.7)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><div className="fu" onClick={e=>e.stopPropagation()} style={{background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:14,width:"100%",maxWidth:520,maxHeight:"85vh",overflow:"auto",padding:28}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><h3 style={{fontFamily:"var(--se)",fontSize:22,color:"var(--tx)"}}>{title}</h3><button onClick={onClose} style={{background:"none",border:"none",color:"var(--txm)",fontSize:20,cursor:"pointer"}}>✕</button></div>{children}</div></div>};

const getLevel = xp => { let l = LEVEL_THRESHOLDS[0]; for(const t of LEVEL_THRESHOLDS) if(xp >= t.xp) l = t; return l; };
const getNext = xp => LEVEL_THRESHOLDS.find(t => t.xp > xp) || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length-1];

// ── Pipeline ──
const PipelineView = ({stories,setStories,grants,onAdd}) => {
  const move = (id,d) => setStories(p => p.map(s => {
    if(s.id!==id) return s; const i = PIPELINE_STAGES.indexOf(s.stage); const n = PIPELINE_STAGES[i+d]; if(!n) return s;
    return{...s,stage:n,...(n==="published"?{publishDate:new Date().toISOString().slice(0,10),pageviews:0,timeOnPage:0,shares:0}:{})};
  }));
  return <div className="fu">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
      <div><h2 style={{fontFamily:"var(--se)",fontSize:30,color:"var(--tx)"}}>Story Pipeline</h2><p style={{fontFamily:"var(--sa)",fontSize:13,color:"var(--txm)",marginTop:4}}>Track stories from pitch through publication. Link each to a grant and define intended impact upfront.</p></div>
      <Btn primary onClick={onAdd}>+ New Story</Btn>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
      {PIPELINE_STAGES.map(stage => <div key={stage}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><span style={{fontFamily:"var(--sa)",fontSize:12,fontWeight:600,color:"var(--tx2)",textTransform:"uppercase",letterSpacing:".06em"}}>{STAGE_LABELS[stage]}</span><span style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)",background:"var(--sf2)",borderRadius:10,padding:"2px 8px"}}>{stories.filter(s=>s.stage===stage).length}</span></div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {stories.filter(s=>s.stage===stage).map((st,i) => {const g=grants.find(x=>x.id===st.grantId);return <div key={st.id} className="si" style={{animationDelay:`${i*.06}s`,background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:"var(--r)",padding:16,transition:"border-color .2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="var(--bdl)"} onMouseLeave={e=>e.currentTarget.style.borderColor="var(--bd)"}>
            <div style={{fontFamily:"var(--se)",fontSize:16,color:"var(--tx)",lineHeight:1.3,marginBottom:8}}>{st.title}</div>
            <div style={{fontFamily:"var(--sa)",fontSize:12,color:"var(--txm)",marginBottom:6}}>{st.reporter} · {st.beat}</div>
            {g&&<Badge>{g.name.split(" ").slice(0,3).join(" ")}</Badge>}
            {st.intendedImpact&&<div style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--tx2)",marginTop:10,padding:"8px 10px",background:"var(--sf2)",borderRadius:6,lineHeight:1.5,borderLeft:"2px solid var(--ac)"}}><span style={{color:"var(--txm)",fontSize:10,textTransform:"uppercase",letterSpacing:".06em"}}>Intended Impact</span><br/>{st.intendedImpact}</div>}
            <div style={{display:"flex",gap:6,marginTop:12}}>
              {PIPELINE_STAGES.indexOf(stage)>0&&<Btn small onClick={()=>move(st.id,-1)}>← Back</Btn>}
              {PIPELINE_STAGES.indexOf(stage)<3&&<Btn small onClick={()=>move(st.id,1)}>Advance →</Btn>}
            </div>
          </div>})}
        </div>
      </div>)}
    </div>
  </div>;
};

// ── Impact Log ──
const ImpactLogView = ({impacts,stories,onAdd}) => {
  const [f,sf] = useState("all");
  const list = f==="all"?impacts:impacts.filter(i=>i.via===f);
  return <div className="fu">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
      <div><h2 style={{fontFamily:"var(--se)",fontSize:30,color:"var(--tx)"}}>Impact Log</h2><p style={{fontFamily:"var(--sa)",fontSize:13,color:"var(--txm)",marginTop:4}}>Every real-world outcome — logged from Slack, email, or manually.</p></div>
      <Btn primary onClick={onAdd}>+ Log Impact</Btn>
    </div>
    <div style={{display:"flex",gap:6,marginBottom:20}}>
      {["all","slack","email","manual"].map(x=><button key={x} onClick={()=>sf(x)} style={{fontFamily:"var(--sa)",fontSize:12,fontWeight:500,padding:"6px 14px",borderRadius:20,border:f===x?"none":"1px solid var(--bd)",background:f===x?"var(--acd)":"transparent",color:f===x?"var(--ac)":"var(--txm)",cursor:"pointer",textTransform:"capitalize"}}>{x==="all"?"All Sources":x}</button>)}
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {[...list].sort((a,b)=>b.date.localeCompare(a.date)).map((im,i)=>{const st=stories.find(s=>s.id===im.storyId);const cat=IMPACT_CATEGORIES.find(c=>c.key===im.category);return <div key={im.id} className="si" style={{animationDelay:`${i*.04}s`,display:"grid",gridTemplateColumns:"140px 1fr",gap:20,padding:20,background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:"var(--r)"}}>
        <div>
          <div style={{fontFamily:"var(--sa)",fontSize:12,color:"var(--txm)",marginBottom:8}}>{new Date(im.date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</div>
          <Badge color={cat?.color}>{cat?.icon} {cat?.label}</Badge>
          <div style={{marginTop:8,display:"flex",gap:6,flexWrap:"wrap"}}><Badge color={im.magnitude==="major"?"var(--rd)":"var(--txm)"}>{im.magnitude}</Badge><ViaTag via={im.via}/></div>
          {im.reporter&&<div style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)",marginTop:8}}>{im.reporter}</div>}
        </div>
        <div>
          <div style={{fontFamily:"var(--se)",fontSize:15,color:"var(--tx)",lineHeight:1.5,marginBottom:8}}>{im.description}</div>
          {st&&<div style={{fontFamily:"var(--sa)",fontSize:12,color:"var(--tx2)"}}>Re: <span style={{color:"var(--ac)"}}>{st.title}</span></div>}
          {im.source&&<div style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)",marginTop:4}}>Source: {im.source}</div>}
        </div>
      </div>})}
    </div>
  </div>;
};

// ── Slack Channel ──
const SlackView = ({onTrack}) => {
  const [msgs, setMsgs] = useState(SEED_SLACK);
  const [val, setVal] = useState("");
  const end = useRef(null);
  const send = () => { if(!val.trim()) return; setMsgs(p=>[...p,{id:`sm${Date.now()}`,user:"You",avatar:"YO",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),text:val,parsed:false}]); setVal(""); setTimeout(()=>end.current?.scrollIntoView({behavior:"smooth"}),100); };
  return <div className="fu">
    <div style={{marginBottom:20}}><h2 style={{fontFamily:"var(--se)",fontSize:30,color:"var(--tx)"}}>Slack Integration</h2><p style={{fontFamily:"var(--sa)",fontSize:13,color:"var(--txm)",marginTop:4}}>Reporters drop impact in <span style={{color:"var(--ac)"}}>#impact-log</span> — the bot parses and tracks it automatically.</p></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:24}}>
      {[{s:"1",t:"Connect Slack",d:"Install the Impact bot and add to #impact-log",done:true},{s:"2",t:"Auto-Parse",d:"AI detects story, impact type, and magnitude from natural messages",done:true},{s:"3",t:"Daily Highlights",d:"Bot posts a celebration of a reporter's impact at 3 PM every day",done:true}].map(x=>
        <div key={x.s} style={{padding:18,background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:"var(--r)"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{width:22,height:22,borderRadius:"50%",background:x.done?"var(--gn)":"var(--ac)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"var(--bg)"}}>{x.done?"✓":x.s}</span><span style={{fontFamily:"var(--sa)",fontSize:13,fontWeight:600,color:"var(--tx)"}}>{x.t}</span></div>
          <p style={{fontFamily:"var(--sa)",fontSize:12,color:"var(--txm)",lineHeight:1.5}}>{x.d}</p>
        </div>
      )}
    </div>
    <div style={{background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:"var(--r)",overflow:"hidden"}}>
      <div style={{padding:"12px 20px",borderBottom:"1px solid var(--bd)",display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontFamily:"var(--sa)",fontSize:15,fontWeight:600,color:"var(--tx)"}}># impact-log</span>
        <span style={{fontFamily:"var(--sa)",fontSize:12,color:"var(--txm)"}}>4 reporters · Impact Bot active</span>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}><span style={{width:8,height:8,borderRadius:"50%",background:"var(--gn)",animation:"pulse 2s infinite"}}/><span style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--gn)"}}>Bot online</span></div>
      </div>
      <div style={{padding:20,maxHeight:520,overflow:"auto",display:"flex",flexDirection:"column",gap:20}}>
        {msgs.map((m,i) => <div key={m.id} className="si" style={{animationDelay:`${i*.05}s`}}>
          {m.isBot && m.highlight ? (
            <div style={{background:"linear-gradient(135deg,rgba(200,255,0,.06),rgba(200,255,0,.02))",border:"1px solid rgba(200,255,0,.2)",borderRadius:12,padding:20,marginLeft:44}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><span style={{fontSize:20}}>🤖</span><span style={{fontFamily:"var(--sa)",fontSize:13,fontWeight:700,color:"var(--ac)"}}>Impact Bot</span><span style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)"}}>{m.time}</span><Badge color="var(--yl)">⭐ Daily Highlight</Badge></div>
              <div style={{background:"var(--sf)",borderRadius:10,padding:18,border:"1px solid var(--bd)"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}><Avatar initials={m.highlight.avatar} size={40} color="var(--acd)"/><div><div style={{fontFamily:"var(--sa)",fontSize:15,fontWeight:700,color:"var(--tx)"}}>🎉 Celebrating {m.highlight.reporter}</div><div style={{fontFamily:"var(--sa)",fontSize:12,color:"var(--txm)"}}>{m.highlight.streak}-day streak · {m.highlight.impactCount} impacts on this story</div></div></div>
                <div style={{fontFamily:"var(--se)",fontSize:16,fontStyle:"italic",color:"var(--tx)",marginBottom:12,lineHeight:1.5}}>"{m.highlight.story}"</div>
                <div style={{padding:"10px 14px",background:"var(--sf2)",borderRadius:8,borderLeft:"3px solid var(--ac)",marginBottom:12}}><div style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>Latest Impact</div><div style={{fontFamily:"var(--sa)",fontSize:13,color:"var(--tx)",lineHeight:1.5}}>{m.highlight.latestImpact}</div></div>
                {m.highlight.kindWord&&<div style={{padding:"10px 14px",background:"rgba(250,204,21,.06)",borderRadius:8,borderLeft:"3px solid var(--yl)"}}><div style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--yl)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>💛 Kind Word</div><div style={{fontFamily:"var(--se)",fontSize:14,fontStyle:"italic",color:"var(--tx)",lineHeight:1.5}}>{m.highlight.kindWord}</div></div>}
              </div>
            </div>
          ) : (
            <div style={{display:"flex",gap:12}}><Avatar initials={m.avatar}/><div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontFamily:"var(--sa)",fontSize:13,fontWeight:700,color:"var(--tx)"}}>{m.user}</span><span style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)"}}>{m.time}</span></div>
              <div style={{fontFamily:"var(--sa)",fontSize:14,color:"var(--tx)",lineHeight:1.6,marginBottom:8}}>{m.text}</div>
              {m.parsed ? (
                <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"rgba(34,197,94,.08)",borderRadius:8,border:"1px solid rgba(34,197,94,.2)",flexWrap:"wrap"}}>
                  <span style={{fontSize:14}}>✅</span><span style={{fontFamily:"var(--sa)",fontSize:12,color:"var(--gn)"}}>Auto-tracked</span>
                  {m.storyRef&&<Badge color="var(--ac)">{m.storyRef}</Badge>}
                  {m.impactType&&<Badge color={IMPACT_CATEGORIES.find(c=>c.key===m.impactType)?.color}>{IMPACT_CATEGORIES.find(c=>c.key===m.impactType)?.label}</Badge>}
                  <span style={{fontFamily:"var(--sa)",fontSize:12,color:"var(--txm)"}}>+50 XP</span>
                </div>
              ) : (
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",background:"rgba(250,204,21,.08)",borderRadius:8,border:"1px solid rgba(250,204,21,.2)"}}><span style={{animation:"pulse 1.5s infinite",fontSize:12}}>🔍</span><span style={{fontFamily:"var(--sa)",fontSize:12,color:"var(--yl)"}}>Needs review</span></div>
                  <Btn small onClick={()=>onTrack(m)}>Confirm & Track</Btn>
                </div>
              )}
            </div></div>
          )}
        </div>)}
        <div ref={end}/>
      </div>
      <div style={{padding:"12px 20px",borderTop:"1px solid var(--bd)",display:"flex",gap:10}}>
        <input style={{flex:1,background:"var(--sf2)"}} placeholder="Share an impact in #impact-log..." value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/>
        <Btn primary small onClick={send}>Send</Btn>
      </div>
    </div>
  </div>;
};

// ── Email Forwarding ──
const EmailView = ({onTrack}) => {
  const emails = [
    { id:"e1", from:"sarah.m.reader@gmail.com", subject:"Re: ER Deserts Story", date:"2026-02-02", body:"Your ER story saved my mom's life. We drove to the next county because of your map. Thank you so much.", reporter:"Sofia Reyes", story:"ER Deserts", tracked:true, category:"kindword" },
    { id:"e2", from:"j.martinez@state.senate.gov", subject:"Re: PFAS Investigation", date:"2026-03-18", body:"Your reporting on PFAS contamination was instrumental in drafting SB-4217. My office would like to invite your team to testify at the committee hearing.", reporter:"James Okafor", story:"PFAS Pipeline", tracked:true, category:"policy" },
    { id:"e3", from:"t.williams@millbrook.k12.edu", subject:"Thank you for the PFAS story", date:"2026-03-22", body:"I'm a teacher in Millbrook County and I've been worried about our water for years. Thank you for proving what we all suspected. Parents are now demanding testing.", reporter:"James Okafor", story:"PFAS Pipeline", tracked:true, category:"kindword" },
    { id:"e4", from:"housing.coalition@gmail.com", subject:"Shadow Landlords Data Request", date:"2026-03-08", body:"We're a tenant coalition using the ownership records from your investigation. Three members have won eviction hearings so far. Can we get the full dataset?", reporter:"Maya Chen", story:"Shadow Landlords", tracked:false },
  ];
  return <div className="fu">
    <div style={{marginBottom:20}}><h2 style={{fontFamily:"var(--se)",fontSize:30,color:"var(--tx)"}}>Email Forwarding</h2><p style={{fontFamily:"var(--sa)",fontSize:13,color:"var(--txm)",marginTop:4}}>Forward reader emails, official responses, and kind words to <span style={{color:"var(--ac)",fontWeight:600}}>impact@yournewsroom.org</span></p></div>
    <div style={{background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:"var(--r)",padding:20,marginBottom:24}}>
      <div style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:14}}>How It Works</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 40px 1fr 40px 1fr",alignItems:"center",gap:8}}>
        {[{i:"✉️",t:"Forward Email",d:"Reporter forwards any email to impact@yournewsroom.org"}, null, {i:"🤖",t:"AI Parses",d:"Detects story, impact type, sentiment, and key quotes"}, null, {i:"✅",t:"Auto-Logged",d:"Impact event created, XP awarded, ready for reports"}].map((x,idx) => x ? <div key={idx} style={{textAlign:"center"}}><div style={{fontSize:24,marginBottom:6}}>{x.i}</div><div style={{fontFamily:"var(--sa)",fontSize:13,fontWeight:600,color:"var(--tx)",marginBottom:4}}>{x.t}</div><div style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)",lineHeight:1.5}}>{x.d}</div></div> : <div key={idx} style={{textAlign:"center",fontFamily:"var(--sa)",fontSize:20,color:"var(--txm)"}}>→</div>)}
      </div>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {emails.map((em,i) => {const cat=IMPACT_CATEGORIES.find(c=>c.key===em.category);return <div key={em.id} className="si" style={{animationDelay:`${i*.06}s`,background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:"var(--r)",padding:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:36,height:36,borderRadius:8,background:"var(--sf2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>✉️</div><div><div style={{fontFamily:"var(--sa)",fontSize:13,fontWeight:600,color:"var(--tx)"}}>{em.subject}</div><div style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)"}}>From: {em.from} · {new Date(em.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})} · Fwd by {em.reporter}</div></div></div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>{em.tracked?<><Badge color="var(--gn)">✅ Tracked</Badge>{cat&&<Badge color={cat.color}>{cat.icon} {cat.label}</Badge>}</>:<Btn small primary onClick={()=>onTrack(em)}>Review & Track</Btn>}</div>
        </div>
        <div style={{fontFamily:"var(--se)",fontSize:14,fontStyle:"italic",color:"var(--tx2)",lineHeight:1.6,padding:"10px 14px",background:"var(--sf2)",borderRadius:8,borderLeft:em.category==="kindword"?"3px solid var(--yl)":"3px solid var(--bd)"}}>"{em.body}"</div>
        {em.story&&<div style={{fontFamily:"var(--sa)",fontSize:12,color:"var(--txm)",marginTop:8}}>Linked to: <span style={{color:"var(--ac)"}}>{em.story}</span></div>}
      </div>})}
    </div>
  </div>;
};

// ── Leaderboard ──
const LeaderboardView = ({reporters,impacts}) => {
  const [sel,setSel] = useState(null);
  return <div className="fu">
    <div style={{marginBottom:24}}><h2 style={{fontFamily:"var(--se)",fontSize:30,color:"var(--tx)"}}>Newsroom Leaderboard</h2><p style={{fontFamily:"var(--sa)",fontSize:13,color:"var(--txm)",marginTop:4}}>Celebrate impact. Major = 100 XP, Moderate = 50, Minor = 25. Keep your streak alive!</p></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16,marginBottom:28}}>
      {[...reporters].sort((a,b)=>b.xp-a.xp).map((r,i)=>{const lv=getLevel(r.xp);const nx=getNext(r.xp);const pct=nx.xp>lv.xp?(r.xp-lv.xp)/(nx.xp-lv.xp):1;const ri=impacts.filter(x=>x.reporter===r.name);const top=i===0;
        return <div key={r.id} onClick={()=>setSel(sel===r.id?null:r.id)} className={top?"sg":""} style={{background:"var(--sf)",border:top?"1px solid rgba(200,255,0,.3)":"1px solid var(--bd)",borderRadius:14,padding:22,cursor:"pointer",transition:"all .3s",position:"relative",overflow:"hidden"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
          {top&&<div style={{position:"absolute",top:12,right:14,fontSize:20}}>👑</div>}
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
            <div style={{position:"relative"}}><Avatar initials={r.avatar} size={48} color={top?"var(--acd)":"var(--sf3)"}/><span style={{position:"absolute",bottom:-4,right:-4,fontSize:16}}>{lv.icon}</span></div>
            <div><div style={{fontFamily:"var(--sa)",fontSize:16,fontWeight:700,color:"var(--tx)"}}>{r.name}</div><div style={{fontFamily:"var(--sa)",fontSize:12,color:"var(--ac)"}}>Lvl {lv.level}: {lv.title}</div></div>
            <div style={{marginLeft:"auto",textAlign:"right"}}><div style={{fontFamily:"var(--se)",fontSize:28,color:top?"var(--ac)":"var(--tx)"}}>{r.xp}</div><div style={{fontFamily:"var(--sa)",fontSize:10,color:"var(--txm)",textTransform:"uppercase"}}>XP</div></div>
          </div>
          <div style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontFamily:"var(--sa)",fontSize:10,color:"var(--txm)"}}>{r.xp-lv.xp} / {nx.xp-lv.xp} XP to {nx.title}</span></div><div style={{height:6,background:"var(--sf2)",borderRadius:3,overflow:"hidden"}}><div className="xpb" style={{height:"100%",width:`${pct*100}%`,borderRadius:3,transition:"width .8s ease"}}/></div></div>
          <div style={{display:"flex",gap:16}}>
            {[["🔥",r.streak,"day streak"],["📊",r.totalImpacts,"impacts"],["💛",ri.filter(x=>x.category==="kindword").length,"kind words"]].map(([ic,v,lb])=><div key={lb} style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:14}}>{ic}</span><span style={{fontFamily:"var(--sa)",fontSize:13,fontWeight:600,color:"var(--tx)"}}>{v}</span><span style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)"}}>{lb}</span></div>)}
          </div>
          {sel===r.id&&<div className="fu" style={{marginTop:16,paddingTop:16,borderTop:"1px solid var(--bd)"}}>
            <div style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:10}}>Badges Earned</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>{BADGES.slice(0,Math.min(r.level+1,BADGES.length)).map(b=><div key={b.id} title={b.desc} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",background:"var(--sf2)",borderRadius:20,fontSize:12,fontFamily:"var(--sa)",color:"var(--tx2)"}}><span>{b.icon}</span> {b.name}</div>)}</div>
            <div style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>Recent</div>
            {ri.slice(-3).reverse().map(im=>{const cat=IMPACT_CATEGORIES.find(c=>c.key===im.category);return <div key={im.id} style={{fontSize:12,fontFamily:"var(--sa)",color:"var(--tx2)",marginBottom:6,display:"flex",gap:6}}><span>{cat?.icon}</span><span style={{lineHeight:1.4}}>{im.description.slice(0,80)}{im.description.length>80?"…":""}</span></div>})}
          </div>}
        </div>})}
    </div>
    <div style={{background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:"var(--r)",padding:22}}>
      <div style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:16}}>All Badges</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12}}>{BADGES.map(b=><div key={b.id} style={{padding:14,background:"var(--sf2)",borderRadius:10,border:"1px solid var(--bd)",textAlign:"center"}}><div style={{fontSize:28,marginBottom:6}}>{b.icon}</div><div style={{fontFamily:"var(--sa)",fontSize:13,fontWeight:600,color:"var(--tx)",marginBottom:4}}>{b.name}</div><div style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)",lineHeight:1.4}}>{b.desc}</div></div>)}</div>
    </div>
  </div>;
};

// ── Dashboard ──
const DashboardView = ({stories,impacts,grants}) => {
  const pub = stories.filter(s=>s.stage==="published");
  const tv = pub.reduce((a,s)=>a+(s.pageviews||0),0);
  const ts = pub.reduce((a,s)=>a+(s.shares||0),0);
  const mj = impacts.filter(i=>i.magnitude==="major").length;
  const byCat = IMPACT_CATEGORIES.map(c=>({...c,count:impacts.filter(i=>i.category===c.key).length}));
  const mx = Math.max(...byCat.map(c=>c.count),1);
  const byVia = ["slack","email","manual"].map(v=>({via:v,count:impacts.filter(i=>i.via===v).length}));
  const tot = impacts.length||1;
  const byGrant = grants.map(g=>{const gs=stories.filter(s=>s.grantId===g.id);const gi=impacts.filter(i=>gs.some(s=>s.id===i.storyId));return{...g,sc:gs.length,ic:gi.length}});
  return <div className="fu">
    <h2 style={{fontFamily:"var(--se)",fontSize:30,color:"var(--tx)",marginBottom:4}}>Dashboard</h2>
    <p style={{fontFamily:"var(--sa)",fontSize:13,color:"var(--txm)",marginBottom:24}}>A bird's-eye view of output and outcomes.</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
      <Stat label="Total Stories" value={stories.length} sub={`${pub.length} published`}/>
      <Stat label="Impact Events" value={impacts.length} sub={`${mj} major`}/>
      <Stat label="Total Reach" value={tv.toLocaleString()} sub="pageviews"/>
      <Stat label="Kind Words" value={impacts.filter(i=>i.category==="kindword").length} sub="reader testimonials"/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:28}}>
      <div style={{background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:"var(--r)",padding:22}}>
        <div style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:18}}>Impacts by Category</div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>{byCat.map(c=><div key={c.key} style={{display:"grid",gridTemplateColumns:"130px 1fr 30px",alignItems:"center",gap:12}}><span style={{fontFamily:"var(--sa)",fontSize:12,color:"var(--tx2)"}}>{c.icon} {c.label}</span><div style={{height:8,background:"var(--sf2)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${(c.count/mx)*100}%`,background:c.color,borderRadius:4,transition:"width .6s ease"}}/></div><span style={{fontFamily:"var(--sa)",fontSize:13,fontWeight:600,color:"var(--tx)",textAlign:"right"}}>{c.count}</span></div>)}</div>
      </div>
      <div style={{background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:"var(--r)",padding:22}}>
        <div style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:18}}>Intake Channel Mix</div>
        <div style={{display:"flex",gap:14,alignItems:"flex-end",height:120,marginBottom:16}}>{byVia.map(s=><div key={s.via} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}><span style={{fontFamily:"var(--sa)",fontSize:16,fontWeight:700,color:"var(--tx)"}}>{s.count}</span><div style={{width:"100%",background:s.via==="slack"?"#4A154B":s.via==="email"?"#0891b2":"var(--txm)",borderRadius:"6px 6px 0 0",height:`${Math.max((s.count/tot)*200,12)}px`,transition:"height .6s ease"}}/><span style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)",textTransform:"capitalize"}}>{s.via}</span></div>)}</div>
        <div style={{fontFamily:"var(--sa)",fontSize:12,color:"var(--tx2)",textAlign:"center",padding:"10px 14px",background:"var(--sf2)",borderRadius:8}}>{Math.round(((byVia.find(s=>s.via==="slack")?.count||0)+(byVia.find(s=>s.via==="email")?.count||0))/tot*100)}% logged via low-friction channels</div>
      </div>
    </div>
    <div style={{background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:"var(--r)",padding:22}}>
      <div style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:18}}>Grant Portfolio</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>{byGrant.map(g=><div key={g.id} style={{padding:18,background:"var(--sf2)",borderRadius:"var(--rs)",border:"1px solid var(--bd)"}}><div style={{fontFamily:"var(--sa)",fontSize:14,fontWeight:600,color:"var(--tx)",marginBottom:4}}>{g.name}</div><div style={{fontFamily:"var(--sa)",fontSize:12,color:"var(--txm)",marginBottom:12}}>{g.funder} · ${(g.amount/1000).toFixed(0)}k</div><div style={{display:"flex",gap:16}}><div><span style={{fontFamily:"var(--se)",fontSize:22,color:"var(--tx)"}}>{g.sc}</span><span style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)",marginLeft:4}}>stories</span></div><div><span style={{fontFamily:"var(--se)",fontSize:22,color:"var(--ac)"}}>{g.ic}</span><span style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)",marginLeft:4}}>impacts</span></div></div></div>)}</div>
    </div>
  </div>;
};

// ── Grant Reports ──
const ReportsView = ({stories,impacts,grants}) => {
  const [sg,ssg] = useState(grants[0]?.id);
  const g = grants.find(x=>x.id===sg); const gs = stories.filter(s=>s.grantId===sg); const gi = impacts.filter(i=>gs.some(s=>s.id===i.storyId)); const pb = gs.filter(s=>s.stage==="published"); const tv = pb.reduce((a,s)=>a+(s.pageviews||0),0); const mc = gi.filter(i=>i.magnitude==="major").length; const kw = gi.filter(i=>i.category==="kindword");
  return <div className="fu">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:28}}>
      <div><h2 style={{fontFamily:"var(--se)",fontSize:30,color:"var(--tx)"}}>Grant Reports</h2><p style={{fontFamily:"var(--sa)",fontSize:13,color:"var(--txm)",marginTop:4}}>Auto-generated impact narratives for funder reports.</p></div>
      <select value={sg} onChange={e=>ssg(e.target.value)} style={{minWidth:220}}>{grants.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select>
    </div>
    {g&&<div style={{background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:"var(--r)",padding:32}}>
      <div style={{borderBottom:"1px solid var(--bd)",paddingBottom:20,marginBottom:24}}>
        <div style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--ac)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Impact Report</div>
        <h3 style={{fontFamily:"var(--se)",fontSize:26,color:"var(--tx)",marginBottom:6}}>{g.name}</h3>
        <div style={{fontFamily:"var(--sa)",fontSize:13,color:"var(--txm)"}}>{g.funder} · ${g.amount.toLocaleString()} · {g.start} → {g.end}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
        <Stat label="Stories" value={gs.length} sub={`${pb.length} published`}/><Stat label="Impacts" value={gi.length} sub={`${mc} major`}/><Stat label="Reach" value={tv.toLocaleString()}/><Stat label="Kind Words" value={kw.length}/>
      </div>
      <div style={{marginBottom:28}}>
        <div style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:12}}>Generated Narrative</div>
        <div style={{fontFamily:"var(--se)",fontSize:17,color:"var(--tx)",lineHeight:1.7,padding:20,background:"var(--sf2)",borderRadius:8,borderLeft:"3px solid var(--ac)"}}>
          Under the <em>{g.name}</em>, our newsroom produced {gs.length} stories ({pb.length} published), generating {gi.length} documented impact events.
          {mc>0&&<> Of these, {mc} were major, including {gi.filter(i=>i.magnitude==="major").slice(0,2).map(i=>i.description.toLowerCase()).join(" and ")}.</>}
          {tv>0&&<> Published work reached {tv.toLocaleString()} readers with an avg time-on-page of {Math.round(pb.reduce((a,s)=>a+(s.timeOnPage||0),0)/(pb.length||1))}s.</>}
          {kw.length>0&&<> We received {kw.length} direct testimonials, including: "{kw[0]?.description.slice(0,100)}…"</>}
          {" "}This reporting drove change across {new Set(gi.map(i=>i.category)).size} categories.
        </div>
      </div>
      <div style={{fontFamily:"var(--sa)",fontSize:11,color:"var(--txm)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:12}}>Timeline</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {[...gi].sort((a,b)=>a.date.localeCompare(b.date)).map(im=>{const cat=IMPACT_CATEGORIES.find(c=>c.key===im.category);return <div key={im.id} style={{display:"grid",gridTemplateColumns:"90px 110px auto 1fr",gap:14,padding:"12px 16px",background:"var(--sf2)",borderRadius:6,alignItems:"center"}}><span style={{fontFamily:"var(--sa)",fontSize:12,color:"var(--txm)"}}>{new Date(im.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span><Badge color={cat?.color}>{cat?.icon} {cat?.label}</Badge><ViaTag via={im.via}/><span style={{fontFamily:"var(--sa)",fontSize:13,color:"var(--tx)"}}>{im.description}</span></div>})}
      </div>
    </div>}
  </div>;
};

// ── AI Scout ──
const SCOUT_SOURCES = [
  { key: "legislation", label: "Government & Policy", icon: "🏛️", color: "#6366f1" },
  { key: "social", label: "Social Media", icon: "💬", color: "#3b82f6" },
  { key: "news", label: "Media Pickup", icon: "📰", color: "#d946ef" },
  { key: "court", label: "Court Filings", icon: "⚖️", color: "#ef4444" },
  { key: "academic", label: "Academic Citations", icon: "🎓", color: "#ca8a04" },
  { key: "public_comment", label: "Public Comments", icon: "📋", color: "#0891b2" },
];

const SEED_SCOUT = [
  { id: "sc1", source: "legislation", confidence: 94, storyId: "s2", date: "2026-04-08", title: "Senate Environment Committee hearing scheduled on SB-4217", description: "The state Senate Environment Committee has scheduled a public hearing on SB-4217 (Industrial PFAS Discharge Reporting Act) for April 22. The bill summary references 'investigative reporting that revealed systemic gaps in private well testing near industrial discharge sites.'", url: "legislature.state.gov/bill/SB-4217", status: "pending", suggestedCategory: "policy", suggestedMagnitude: "major" },
  { id: "sc2", source: "social", confidence: 87, storyId: "s1", date: "2026-04-07", title: "City Councilmember Torres shared Shadow Landlords story", description: "@CouncilTorres on X: 'This is why we need the LLC disclosure ordinance. Every resident deserves to know who owns their building. Read this investigation →' — 2.4K reposts, 8.1K likes", url: "x.com/CouncilTorres/status/...", status: "pending", suggestedCategory: "media", suggestedMagnitude: "moderate" },
  { id: "sc3", source: "court", confidence: 78, storyId: "s1", date: "2026-04-05", title: "Eviction defense cites Shadow Landlords data in motion to dismiss", description: "In Williams v. Greystone Holdings LLC (Case No. 2026-CV-4412), defendant's counsel filed a motion citing the newsroom's LLC ownership database as evidence that the plaintiff entity is a shell company with no legitimate management presence.", url: "courts.state.gov/case/2026-CV-4412", status: "pending", suggestedCategory: "individual", suggestedMagnitude: "major" },
  { id: "sc4", source: "academic", confidence: 91, storyId: "s3", date: "2026-04-06", title: "New England Journal of Medicine cites ER Deserts dataset", description: "A new NEJM study on rural emergency care access (doi:10.1056/NEJMsa2604218) cites the newsroom's ER distance analysis in its methodology section, using it to validate their geographic access model across 12 states.", url: "nejm.org/doi/10.1056/NEJMsa2604218", status: "pending", suggestedCategory: "academic", suggestedMagnitude: "major" },
  { id: "sc5", source: "public_comment", confidence: 82, storyId: "s2", date: "2026-04-04", title: "12 public comments on EPA rule reference PFAS reporting", description: "In the open comment period for proposed EPA Rule 2026-R-0041 (Industrial Discharge Monitoring), 12 of 847 public comments directly reference the PFAS Pipeline investigation, with commenters urging stricter reporting thresholds.", url: "regulations.gov/docket/EPA-2026-R-0041", status: "pending", suggestedCategory: "community", suggestedMagnitude: "moderate" },
  { id: "sc6", source: "news", confidence: 96, storyId: "s3", date: "2026-04-03", title: "PBS NewsHour segment features ER Deserts data", description: "PBS NewsHour aired a 7-minute segment on rural healthcare access, featuring the interactive ER distance map and interviewing two sources from the original reporting. Segment reached an estimated 2.1M viewers.", url: "pbs.org/newshour/health/rural-er-access", status: "pending", suggestedCategory: "media", suggestedMagnitude: "major" },
  { id: "sc7", source: "social", confidence: 72, storyId: "s2", date: "2026-04-02", title: "Reddit thread on r/environment discusses PFAS findings", description: "A post titled 'Local paper just proved our wells are contaminated' on r/environment received 3.2K upvotes. Top comment: 'This is why local journalism matters. Nobody else was testing these wells.' 400+ comments discussing next steps.", url: "reddit.com/r/environment/comments/...", status: "pending", suggestedCategory: "community", suggestedMagnitude: "minor" },
  { id: "sc8", source: "legislation", confidence: 89, storyId: "s1", date: "2026-04-01", title: "HUD issues guidance citing need for LLC transparency", description: "The U.S. Department of Housing and Urban Development published new guidance on rental property ownership transparency, citing 'recent investigative reporting' that exposed how shell LLCs evade tenant protection laws.", url: "hud.gov/guidance/2026-04", status: "confirmed", suggestedCategory: "policy", suggestedMagnitude: "major" },
  { id: "sc9", source: "social", confidence: 68, storyId: "s3", date: "2026-03-30", title: "State Rep. tweeted support for rural ER funding bill", description: "@RepDaniels: 'After reading the ER Deserts investigation, I'm co-sponsoring HB-892. No family should drive 90 minutes in an emergency. This is a crisis.' — 890 reposts", url: "x.com/RepDaniels/status/...", status: "dismissed", suggestedCategory: "policy", suggestedMagnitude: "moderate" },
];

const ScoutView = ({ stories, onConfirm, onDismiss }) => {
  const [items, setItems] = useState(SEED_SCOUT);
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("pending");

  const filtered = items.filter(i =>
    (sourceFilter === "all" || i.source === sourceFilter) &&
    (statusFilter === "all" || i.status === statusFilter)
  );

  const pending = items.filter(i => i.status === "pending").length;
  const confirmed = items.filter(i => i.status === "confirmed").length;

  const handleConfirm = (item) => {
    setItems(p => p.map(i => i.id === item.id ? { ...i, status: "confirmed" } : i));
    onConfirm(item);
  };

  const handleDismiss = (item) => {
    setItems(p => p.map(i => i.id === item.id ? { ...i, status: "dismissed" } : i));
  };

  return (
    <div className="fu">
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ fontFamily: "var(--se)", fontSize: 30, color: "var(--tx)" }}>AI Scout</h2>
            <p style={{ fontFamily: "var(--sa)", fontSize: 13, color: "var(--txm)", marginTop: 4 }}>
              Automated discovery of your reporting's impact across the web. Review, confirm, or dismiss.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ padding: "8px 14px", background: "var(--sf)", border: "1px solid var(--bd)", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--gn)", animation: "pulse 2s infinite" }} />
              <span style={{ fontFamily: "var(--sa)", fontSize: 12, color: "var(--gn)" }}>Last scan: 2h ago</span>
            </div>
            <Btn small style={{ border: "1px solid var(--ac)", color: "var(--ac)" }}>Run Scan Now</Btn>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        <Stat label="Pending Review" value={pending} sub="discoveries awaiting triage" />
        <Stat label="Confirmed" value={confirmed} sub="added to impact log" />
        <Stat label="Sources Scanned" value="6" sub="active channels" />
        <Stat label="Avg Confidence" value={`${Math.round(items.filter(i => i.status === "pending").reduce((a, i) => a + i.confidence, 0) / (pending || 1))}%`} sub="AI match quality" />
      </div>

      {/* Source channel cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 24 }}>
        {SCOUT_SOURCES.map(src => {
          const count = items.filter(i => i.source === src.key && i.status === "pending").length;
          return (
            <div key={src.key}
              onClick={() => setSourceFilter(sourceFilter === src.key ? "all" : src.key)}
              style={{
                padding: 14, background: sourceFilter === src.key ? `${src.color}15` : "var(--sf)",
                border: `1px solid ${sourceFilter === src.key ? src.color : "var(--bd)"}`,
                borderRadius: "var(--r)", cursor: "pointer", textAlign: "center", transition: "all .2s"
              }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{src.icon}</div>
              <div style={{ fontFamily: "var(--sa)", fontSize: 11, fontWeight: 600, color: "var(--tx)", marginBottom: 2 }}>{src.label}</div>
              {count > 0 && <Badge color={src.color}>{count} new</Badge>}
            </div>
          );
        })}
      </div>

      {/* Status filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {["pending", "confirmed", "dismissed", "all"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{
            fontFamily: "var(--sa)", fontSize: 12, fontWeight: 500, padding: "6px 14px", borderRadius: 20,
            border: statusFilter === s ? "none" : "1px solid var(--bd)",
            background: statusFilter === s ? "var(--acd)" : "transparent",
            color: statusFilter === s ? "var(--ac)" : "var(--txm)",
            cursor: "pointer", textTransform: "capitalize"
          }}>
            {s === "pending" ? `Pending (${pending})` : s}
          </button>
        ))}
      </div>

      {/* Discovery feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.sort((a, b) => b.confidence - a.confidence).map((item, idx) => {
          const story = stories.find(s => s.id === item.storyId);
          const src = SCOUT_SOURCES.find(s => s.key === item.source);
          const cat = IMPACT_CATEGORIES.find(c => c.key === item.suggestedCategory);
          return (
            <div key={item.id} className="si" style={{
              animationDelay: `${idx * 0.05}s`,
              background: "var(--sf)", border: "1px solid var(--bd)", borderRadius: "var(--r)",
              padding: 20, opacity: item.status === "dismissed" ? 0.45 : 1,
              transition: "opacity .3s"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: `${src?.color}18`, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 20
                  }}>{src?.icon}</div>
                  <div>
                    <div style={{ fontFamily: "var(--sa)", fontSize: 11, color: src?.color, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em" }}>{src?.label}</div>
                    <div style={{ fontFamily: "var(--se)", fontSize: 17, color: "var(--tx)", lineHeight: 1.3 }}>{item.title}</div>
                  </div>
                </div>
                {/* Confidence meter */}
                <div style={{ textAlign: "center", flexShrink: 0, marginLeft: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    background: `conic-gradient(${item.confidence >= 85 ? "var(--gn)" : item.confidence >= 70 ? "var(--yl)" : "var(--rd)"} ${item.confidence}%, var(--sf2) 0)`,
                    position: "relative"
                  }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: "50%", background: "var(--sf)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--sa)", fontSize: 13, fontWeight: 700, color: "var(--tx)"
                    }}>{item.confidence}</div>
                  </div>
                  <div style={{ fontFamily: "var(--sa)", fontSize: 9, color: "var(--txm)", marginTop: 2, textTransform: "uppercase" }}>conf.</div>
                </div>
              </div>

              <div style={{
                fontFamily: "var(--sa)", fontSize: 13, color: "var(--tx2)", lineHeight: 1.6,
                padding: "12px 14px", background: "var(--sf2)", borderRadius: 8, marginBottom: 12
              }}>{item.description}</div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  {story && <Badge color="var(--ac)">{story.title.length > 25 ? story.title.slice(0, 25) + "…" : story.title}</Badge>}
                  {cat && <Badge color={cat.color}>{cat.icon} {cat.label}</Badge>}
                  <Badge color={item.suggestedMagnitude === "major" ? "var(--rd)" : "var(--txm)"}>{item.suggestedMagnitude}</Badge>
                  <span style={{ fontFamily: "var(--sa)", fontSize: 11, color: "var(--txm)" }}>
                    {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  {item.url && (
                    <span style={{ fontFamily: "var(--sa)", fontSize: 11, color: "var(--txm)", textDecoration: "underline", cursor: "pointer" }}>
                      View source ↗
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {item.status === "pending" && (
                    <>
                      <Btn small onClick={() => handleDismiss(item)} style={{ color: "var(--txm)" }}>Dismiss</Btn>
                      <Btn small primary onClick={() => handleConfirm(item)}>Confirm & Log</Btn>
                    </>
                  )}
                  {item.status === "confirmed" && <Badge color="var(--gn)">✅ Confirmed</Badge>}
                  {item.status === "dismissed" && <Badge color="var(--txm)">Dismissed</Badge>}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "var(--txm)", fontFamily: "var(--sa)", fontSize: 14 }}>
            No discoveries matching this filter.
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main App ──
export default function App() {
  const [tab, setTab] = useState("pipeline");
  const [stories, setStories] = useState(SEED_STORIES);
  const [impacts, setImpacts] = useState(SEED_IMPACTS);
  const [grants] = useState(SEED_GRANTS);
  const [reporters] = useState(REPORTERS);
  const [showSM, setSM] = useState(false);
  const [showIM, setIM] = useState(false);
  const [fd, sfd] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => { injectStyles(); }, []);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); } }, [toast]);

  const addStory = () => { const d=fd; if(!d.title) return; setStories(p=>[...p,{id:`s${Date.now()}`,title:d.title,beat:d.beat||"General",reporter:d.reporter||"Staff",stage:"pitch",grantId:d.grantId||"",intendedImpact:d.intendedImpact||""}]); sfd({}); setSM(false); setToast("Story added to pipeline!"); };
  const addImpact = () => { const d=fd; if(!d.description||!d.storyId) return; setImpacts(p=>[...p,{id:`i${Date.now()}`,storyId:d.storyId,category:d.category||"community",date:d.date||new Date().toISOString().slice(0,10),description:d.description,magnitude:d.magnitude||"moderate",source:d.source||"",reporter:d.reporter||"Staff",via:"manual"}]); sfd({}); setIM(false); setToast(`Impact logged! +${({major:100,moderate:50,minor:25}[fd.magnitude]||50)} XP`); };

  const tabs = [
    {k:"pipeline",l:"Pipeline",i:"◇"},{k:"impacts",l:"Impact Log",i:"◈"},{k:"scout",l:"AI Scout",i:"🔍"},{k:"slack",l:"Slack",i:"#"},{k:"email",l:"Email",i:"✉"},{k:"leaderboard",l:"Leaderboard",i:"🏆"},{k:"dashboard",l:"Dashboard",i:"▦"},{k:"reports",l:"Reports",i:"⊞"},
  ];

  return <div style={{fontFamily:"var(--sa)",background:"var(--bg)",minHeight:"100vh",color:"var(--tx)"}}>
    <header style={{borderBottom:"1px solid var(--bd)",padding:"14px 28px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <div style={{width:32,height:32,borderRadius:8,background:"var(--ac)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:"var(--bg)"}}>I</div>
        <span style={{fontFamily:"var(--se)",fontSize:20,color:"var(--tx)"}}>Impact</span>
        <span style={{fontFamily:"var(--sa)",fontSize:10,color:"var(--txm)",textTransform:"uppercase",letterSpacing:".1em",padding:"3px 8px",border:"1px solid var(--bd)",borderRadius:4}}>v2</span>
      </div>
      <nav style={{display:"flex",gap:2,flexWrap:"wrap"}}>{tabs.map(t=><button key={t.k} onClick={()=>setTab(t.k)} style={{fontFamily:"var(--sa)",fontSize:12,fontWeight:500,padding:"7px 13px",borderRadius:8,border:"none",cursor:"pointer",background:tab===t.k?"var(--sf2)":"transparent",color:tab===t.k?"var(--ac)":"var(--txm)",transition:"all .2s",whiteSpace:"nowrap"}}><span style={{marginRight:5,opacity:.6}}>{t.i}</span>{t.l}</button>)}</nav>
    </header>
    <main style={{maxWidth:1200,margin:"0 auto",padding:"28px 28px 64px"}}>
      {tab==="pipeline"&&<PipelineView stories={stories} setStories={setStories} grants={grants} onAdd={()=>{sfd({});setSM(true)}}/>}
      {tab==="impacts"&&<ImpactLogView impacts={impacts} stories={stories} onAdd={()=>{sfd({});setIM(true)}}/>}
      {tab==="scout"&&<ScoutView stories={stories} onConfirm={item=>setToast(`Confirmed: ${item.title.slice(0,40)}… → Impact Log +${item.suggestedMagnitude==="major"?100:50} XP`)} onDismiss={()=>{}}/>}
      {tab==="slack"&&<SlackView onTrack={m=>setToast(`Tracked from ${m.user}! +50 XP`)}/>}
      {tab==="email"&&<EmailView onTrack={e=>setToast(`Tracked email from ${e.from}!`)}/>}
      {tab==="leaderboard"&&<LeaderboardView reporters={reporters} impacts={impacts}/>}
      {tab==="dashboard"&&<DashboardView stories={stories} impacts={impacts} grants={grants}/>}
      {tab==="reports"&&<ReportsView stories={stories} impacts={impacts} grants={grants}/>}
    </main>
    {toast&&<div className="fu" style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:"var(--ac)",color:"var(--bg)",fontFamily:"var(--sa)",fontSize:14,fontWeight:600,padding:"12px 24px",borderRadius:10,zIndex:2000,boxShadow:"0 8px 30px rgba(200,255,0,.3)"}}>{toast}</div>}
    <Modal open={showSM} onClose={()=>setSM(false)} title="New Story">
      <Field label="Headline"><input style={{width:"100%"}} placeholder="Working headline" value={fd.title||""} onChange={e=>sfd(p=>({...p,title:e.target.value}))}/></Field>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Reporter"><input style={{width:"100%"}} placeholder="Name" value={fd.reporter||""} onChange={e=>sfd(p=>({...p,reporter:e.target.value}))}/></Field><Field label="Beat"><input style={{width:"100%"}} placeholder="e.g. Housing" value={fd.beat||""} onChange={e=>sfd(p=>({...p,beat:e.target.value}))}/></Field></div>
      <Field label="Grant"><select style={{width:"100%"}} value={fd.grantId||""} onChange={e=>sfd(p=>({...p,grantId:e.target.value}))}><option value="">None</option>{grants.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></Field>
      <Field label="Intended Impact"><textarea style={{width:"100%"}} placeholder="What change should this story drive?" value={fd.intendedImpact||""} onChange={e=>sfd(p=>({...p,intendedImpact:e.target.value}))}/></Field>
      <Btn primary onClick={addStory} style={{width:"100%",marginTop:4}}>Add to Pipeline</Btn>
    </Modal>
    <Modal open={showIM} onClose={()=>setIM(false)} title="Log Impact Event">
      <Field label="Story"><select style={{width:"100%"}} value={fd.storyId||""} onChange={e=>sfd(p=>({...p,storyId:e.target.value}))}><option value="">Select…</option>{stories.filter(s=>s.stage==="published").map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select></Field>
      <Field label="Category"><select style={{width:"100%"}} value={fd.category||""} onChange={e=>sfd(p=>({...p,category:e.target.value}))}>{IMPACT_CATEGORIES.map(c=><option key={c.key} value={c.key}>{c.icon} {c.label}</option>)}</select></Field>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Date"><input type="date" style={{width:"100%"}} value={fd.date||new Date().toISOString().slice(0,10)} onChange={e=>sfd(p=>({...p,date:e.target.value}))}/></Field><Field label="Magnitude"><select style={{width:"100%"}} value={fd.magnitude||"moderate"} onChange={e=>sfd(p=>({...p,magnitude:e.target.value}))}><option value="minor">Minor (+25 XP)</option><option value="moderate">Moderate (+50 XP)</option><option value="major">Major (+100 XP)</option></select></Field></div>
      <Field label="What happened?"><textarea style={{width:"100%"}} placeholder="Describe the impact…" value={fd.description||""} onChange={e=>sfd(p=>({...p,description:e.target.value}))}/></Field>
      <Field label="Source"><input style={{width:"100%"}} placeholder="e.g. City Council minutes" value={fd.source||""} onChange={e=>sfd(p=>({...p,source:e.target.value}))}/></Field>
      <Btn primary onClick={addImpact} style={{width:"100%",marginTop:4}}>Log Impact</Btn>
    </Modal>
  </div>;
}
