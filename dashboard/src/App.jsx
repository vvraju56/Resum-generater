import { useState, useEffect, useRef, useCallback } from "react";
import SettingsPage from "./SettingsPage.jsx";

const ACCENT = "#3b82f6";
const ACCENT_DARK = "#2563eb";

const NAV_ITEMS = [
  { id: "home", icon: "⊞", label: "Home" },
  { id: "builder", icon: "📄", label: "Resume Builder" },
  { id: "analyzer", icon: "📊", label: "ATS Analyzer" },
  { id: "editor", icon: "🎨", label: "Visual Editor" },
  { id: "templates", icon: "📑", label: "Templates" },
  { id: "export", icon: "📥", label: "Export Center" },
  { id: "settings", icon: "⚙️", label: "Settings" },
  { id: "about", icon: "ℹ️", label: "About" },
];

const SKILLS_OPTIONS = [
  "JavaScript","TypeScript","React","Next.js","Node.js","Express","Python","FastAPI",
  "Django","Vue.js","Angular","HTML/CSS","Tailwind CSS","PostgreSQL","MongoDB","MySQL",
  "Redis","Docker","Kubernetes","AWS","GCP","Azure","Git","GitHub","REST APIs","GraphQL",
  "Jest","Cypress","Figma","Linux","Bash","C++","Java","Rust","Go","Svelte","Remix",
  "Flutter","Swift","Kotlin","React Native","TensorFlow","PyTorch","Scikit-learn",
  "Data Analysis","Machine Learning","DevOps","CI/CD","Agile","Scrum",
];

const TEMPLATES = [
  { id: "modern-dark", name: "Modern Dark", accent: "#3b82f6", category: "Modern", tags: ["Dark", "Creative", "ATS-Friendly"] },
  { id: "classic-light", name: "Classic Light", accent: "#2563eb", category: "Classic", tags: ["Light", "Traditional", "Clean"] },
  { id: "minimal-clean", name: "Minimal Clean", accent: "#333333", category: "Minimal", tags: ["Minimal", "Simple", "ATS-Friendly"] },
  { id: "tech-dark", name: "Tech Dark", accent: "#58a6ff", category: "Tech", tags: ["Developer", "Tech", "Dark"] },
  { id: "blue-professional", name: "Blue Professional", accent: "#3b82f6", category: "Professional", tags: ["Corporate", "Blue", "Clean"] },
  { id: "green-matrix", name: "Matrix Green", accent: "#4ade80", category: "Tech", tags: ["Developer", "Terminal", "Dark"] },
  { id: "ocean-blue", name: "Ocean Blue", accent: "#38bdf8", category: "Modern", tags: ["Creative", "Modern", "Blue"] },
  { id: "sunset-warm", name: "Sunset Warm", accent: "#fb923c", category: "Creative", tags: ["Creative", "Warm", "Modern"] },
  { id: "royal-purple", name: "Royal Purple", accent: "#a855f7", category: "Modern", tags: ["Premium", "Creative", "Dark"] },
  { id: "elegant-gold", name: "Elegant Gold", accent: "#f59e0b", category: "Executive", tags: ["Premium", "Corporate", "Light"] },
  { id: "midnight", name: "Midnight", accent: "#6366f1", category: "Modern", tags: ["Dark", "Tech", "Creative"] },
  { id: "pearl-white", name: "Pearl White", accent: "#f8fafc", category: "Minimal", tags: ["Light", "Clean", "Professional"] },
  { id: "coral-reef", name: "Coral Reef", accent: "#f472b6", category: "Creative", tags: ["Creative", "Modern", "Colorful"] },
  { id: "slate-gray", name: "Slate Gray", accent: "#94a3b8", category: "Professional", tags: ["Corporate", "Clean", "Minimal"] },
  { id: "emerald", name: "Emerald", accent: "#10b981", category: "Modern", tags: ["Clean", "Fresh", "Professional"] },
  { id: "ruby-red", name: "Ruby Red", accent: "#ef4444", category: "Executive", tags: ["Bold", "Corporate", "Premium"] },
];

const ATS_KEYWORDS = {
  "Software Engineer": ["javascript", "typescript", "react", "node.js", "python", "java", "aws", "docker", "kubernetes", "git", "sql", "rest api", "agile", "ci/cd"],
  "Data Scientist": ["python", "machine learning", "tensorflow", "pytorch", "data analysis", "statistics", "sql", "pandas", "numpy", "visualization", "deep learning"],
  "Frontend Developer": ["javascript", "react", "typescript", "css", "html", "webpack", "redux", "responsive design", "ui/ux", "figma"],
  "Backend Developer": ["node.js", "python", "java", "sql", "nosql", "api design", "microservices", "docker", "aws", "postgresql"],
  "DevOps Engineer": ["docker", "kubernetes", "aws", "ci/cd", "terraform", "jenkins", "linux", "scripting", "monitoring", "cloud"],
  "Full Stack Developer": ["javascript", "react", "node.js", "python", "sql", "api", "docker", "git", "agile"],
};

const API = (import.meta.env.VITE_API_URL || "http://localhost:3001") + "/api";
const apiPost = (ep, body) => fetch(`${API}${ep}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json());
const apiGet = (ep) => fetch(`${API}${ep}`).then(r => r.json()).catch(() => null);

function useLocalStorage(key, init) {
  const [val, setVal] = useState(() => { try { const s = localStorage.getItem(key); return s ? { ...init, ...JSON.parse(s) } : init; } catch { return init; } });
  const set = useCallback(v => { setVal(prev => { const next = typeof v === "function" ? v(prev) : v; try { localStorage.setItem(key, JSON.stringify(next)); } catch {}; return next; }); }, [key]);
  return [val, set];
}

function generateSummaryLocally({ name, title, skills = [], education = [], experience = [], projects = [] }) {
  const topSkills = skills.slice(0, 5).join(", ") || "software development";
  const expCount = experience.length;
  const edu = education[0];
  const eduStr = edu ? `${edu.degree || edu.standard} from ${edu.college || edu.school}` : "computer science";
  if (expCount === 0) {
    return `${name || "The candidate"} is a motivated ${title || "Software Developer"} fresher with strong foundation in ${topSkills}. ${edu ? `Completed ${eduStr}.` : ""} Passionate about building clean, well-structured software and eager to contribute to real-world projects. ${projects.length > 0 ? `Developed ${projects.length} personal project${projects.length > 1 ? "s" : ""} demonstrating hands-on technical skills.` : ""}`.trim();
  }
  const yrs = expCount === 1 ? "1 year" : `${expCount}+ years`;
  const cos = experience.map(e => e.company).filter(Boolean).slice(0, 2).join(" and ") || "various companies";
  return `${name || "The candidate"} is an experienced ${title || "Software Developer"} with ${yrs} of hands-on experience in ${topSkills}. Has contributed to production systems at ${cos}, delivering scalable and maintainable solutions. ${projects.length > 0 ? `Built ${projects.length} notable project${projects.length > 1 ? "s" : ""}.` : ""} Committed to writing clean code and continuously improving technical expertise.`.trim();
}

// ── Components ─────────────────────────────────────────────────────────────
function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar" style={{ width: 240, background: "linear-gradient(180deg, #0d0d0d 0%, #151515 100%)", borderRight: "1px solid #1e1e1e", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div className="sidebar-logo" style={{ padding: "24px 20px 20px", borderBottom: "1px solid #1e1e1e" }}>
        <div style={{ fontSize: 20, fontWeight: 900, background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.5px" }}>Resume Creator</div>
        <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>Offline · Free · v2.0</div>
      </div>
      <nav className="sidebar-nav" style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} data-page={item.id} onClick={() => setPage(item.id)}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 13, fontWeight: page === item.id ? 600 : 400, background: page === item.id ? `linear-gradient(135deg, ${ACCENT}20 0%, ${ACCENT_DARK}10 100%)` : "transparent", color: page === item.id ? ACCENT : "#888", transition: "all 0.2s", textAlign: "left" }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "16px 20px", borderTop: "1px solid #1e1e1e" }}>
        <div style={{ fontSize: 11, color: "#444", textAlign: "center" }}>100% Offline · Free Forever</div>
      </div>
    </aside>
  );
}

function Badge({ children, color = ACCENT }) {
  return <span style={{ fontSize: 11, fontWeight: 600, background: `${color}18`, color, border: `1px solid ${color}30`, borderRadius: 6, padding: "3px 10px" }}>{children}</span>;
}

function Card({ children, style = {} }) {
  return <div style={{ background: "linear-gradient(145deg, #111111 0%, #0a0a0a 100%)", border: "1px solid #1e1e1e", borderRadius: 16, padding: 20, ...style }}>{children}</div>;
}

function GlassCard({ children, style = {} }) {
  return <div style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, ...style }}>{children}</div>;
}

function Input({ label, value, onChange, placeholder, type = "text", style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: "#888" }}>{label}</label>}
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type}
        style={{ background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#fff", outline: "none", transition: "all 0.15s" }}
        onFocus={e => { e.target.style.borderColor = ACCENT; e.target.style.boxShadow = `0 0 0 3px ${ACCENT}20`; }}
        onBlur={e => { e.target.style.borderColor = "#2a2a2a"; e.target.style.boxShadow = "none"; }} />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 3, style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: "#888" }}>{label}</label>}
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{ background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#fff", outline: "none", resize: "vertical", fontFamily: "inherit", transition: "all 0.15s" }}
        onFocus={e => { e.target.style.borderColor = ACCENT; e.target.style.boxShadow = `0 0 0 3px ${ACCENT}20`; }}
        onBlur={e => { e.target.style.borderColor = "#2a2a2a"; e.target.style.boxShadow = "none"; }} />
    </div>
  );
}

function Select({ label, value, onChange, options, style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: "#888" }}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#fff", outline: "none", cursor: "pointer", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
        {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, onClick, disabled, variant = "primary", style = {}, icon }) {
  const bg = variant === "primary" ? `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)` : variant === "danger" ? "#ef4444" : "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)";
  const col = variant === "primary" ? "#000" : variant === "danger" ? "#fff" : "#aaa";
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ background: bg, color: col, border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 8, ...style }}>
      {icon && <span>{icon}</span>}{children}
    </button>
  );
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs-container" style={{ display: "flex", gap: 4, padding: "4px", background: "#0a0a0a", borderRadius: 12, border: "1px solid #1e1e1e" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: active === t.id ? `linear-gradient(135deg, ${ACCENT}20 0%, ${ACCENT_DARK}10 100%)` : "transparent", color: active === t.id ? ACCENT : "#666", transition: "all 0.15s" }}>
          {t.icon && <span style={{ marginRight: 6 }}>{t.icon}</span>}{t.label}
        </button>
      ))}
    </div>
  );
}

// ── Home Page ───────────────────────────────────────────────────────────────
function HomePage({ setPage }) {
  const stats = [
    { label: "Resume Themes", value: "16", icon: "🎨" },
    { label: "Templates", value: "100+", icon: "📑" },
    { label: "ATS Score", value: "✓", icon: "📊" },
    { label: "PDF Export", value: "✓", icon: "📥" },
  ];

  const features = [
    { icon: "📄", title: "Resume Builder", desc: "Create stunning resumes with live preview", page: "builder" },
    { icon: "📊", title: "ATS Analyzer", desc: "Check resume score and get improvements", page: "analyzer" },
    { icon: "🎨", title: "Visual Editor", desc: "Drag-and-drop design like Canva", page: "editor" },
    { icon: "📑", title: "Templates", desc: "Browse 100+ professional templates", page: "templates" },
    { icon: "📥", title: "Export Center", desc: "Download PDF, JSON, or templates", page: "export" },
  ];

  return (
    <div className="page-container" style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 40 }}>
        <h1 className="page-title" style={{ fontSize: 42, fontWeight: 900, color: "#fff", marginBottom: 12, letterSpacing: "-1px" }}>
          Welcome to <span style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Resume Creator</span>
        </h1>
        <p className="page-subtitle" style={{ color: "#666", fontSize: 16, lineHeight: 1.7, maxWidth: 600 }}>
          Build professional resumes with ATS analysis, visual editor, and 100+ templates — all offline, all free.
        </p>
      </div>

      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
        {stats.map(s => (
          <Card key={s.label} style={{ textAlign: "center", padding: 24 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>
            <div className="value" style={{ fontSize: 28, fontWeight: 900, color: ACCENT, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 40 }}>
        {features.map(item => (
          <Card key={item.title} style={{ cursor: "pointer", transition: "all 0.2s" }}
            onClick={() => setPage(item.page)}
            onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 30px ${ACCENT}20`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e1e1e"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 6 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>{item.desc}</div>
            <div style={{ marginTop: 12, fontSize: 12, color: ACCENT, fontWeight: 600 }}>Open →</div>
          </Card>
        ))}
      </div>

      <GlassCard>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 4 }}>100% Offline</div>
            <div style={{ fontSize: 13, color: "#666" }}>Your data never leaves your device. Everything runs locally.</div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["Works Offline", "100% Local", "Free Forever", "No API Keys", "Privacy First"].map(tag => (
              <Badge key={tag} color="#4ade80">{tag}</Badge>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

// ── Resume Builder Page ─────────────────────────────────────────────────────
function ResumeBuilderPage() {
  const [resume, setResume] = useLocalStorage("mdrc_resume", {
    name: "", title: "Software Developer", summary: "", phone: "", email: "", address: "", linkedin: "", github: "", portfolio: "",
    skills: [], experience: [], education: [], projects: [], certifications: [],
    isFresher: false, theme: "modern-dark", layout: "single",
  });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("basic");
  const [skillInput, setSkillInput] = useState("");
  const iframeRef = useRef(null);

  const upd = (k) => (v) => setResume(p => ({ ...p, [k]: v }));

  const generatePreview = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiPost("/generate/resume", resume);
      if (data.success) setPreview(data.html);
    } catch {
      const html = generateResumeHTML(resume);
      setPreview(html);
    }
    setLoading(false);
  }, [resume]);

  useEffect(() => { if (resume.name) generatePreview(); }, []);

  const generateSummary = () => upd("summary")(generateSummaryLocally(resume));

  const addSkill = (s) => {
    const sk = s.trim();
    if (sk && !resume.skills.includes(sk)) upd("skills")([...resume.skills, sk]);
    setSkillInput("");
  };

  const addExperience = () => upd("experience")([...resume.experience, { role: "", company: "", period: "", description: "" }]);
  const updExp = (i, k, v) => { const e = [...resume.experience]; e[i] = { ...e[i], [k]: v }; upd("experience")(e); };
  const removeExp = (i) => upd("experience")(resume.experience.filter((_, j) => j !== i));

  const addEducation = () => upd("education")([...resume.education, { degree: "", college: "", year: "", percentage: "" }]);
  const updEdu = (i, k, v) => { const e = [...resume.education]; e[i] = { ...e[i], [k]: v }; upd("education")(e); };

  const addProject = () => upd("projects")([...resume.projects, { name: "", tech: "", location: "", description: "", link: "" }]);
  const updProj = (i, k, v) => { const p = [...resume.projects]; p[i] = { ...p[i], [k]: v }; upd("projects")(p); };

  const addCertification = () => upd("certifications")([...resume.certifications, { name: "", issuer: "", year: "" }]);
  const updCert = (i, k, v) => { const c = [...resume.certifications]; c[i] = { ...c[i], [k]: v }; upd("certifications")(c); };

  const exportPDF = () => {
    const iframe = iframeRef.current;
    if (iframe) iframe.contentWindow.print();
  };

  const saveJSON = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: "basic", label: "Basic", icon: "👤" },
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "projects", label: "Projects", icon: "🚀" },
    { id: "skills", label: "Skills", icon: "⚡" },
    { id: "certifications", label: "Certifications", icon: "🏆" },
    { id: "theme", label: "Theme", icon: "🎨" },
  ];

  return (
    <div className="builder-container" style={{ display: "flex", height: "calc(100vh - 0px)", overflow: "hidden" }}>
      <div className="builder-panel" style={{ width: 420, borderRight: "1px solid #1e1e1e", display: "flex", flexDirection: "column", overflow: "hidden", background: "#0a0a0a" }}>
        <div className="builder-header" style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e1e", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <h2 style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>📄 Resume Builder</h2>
          <div className="builder-actions" style={{ display: "flex", gap: 8 }}>
            <Btn onClick={generatePreview} disabled={loading} style={{ padding: "6px 12px", fontSize: 12 }} icon="🔄">
              {loading ? "..." : "Preview"}
            </Btn>
            <Btn onClick={exportPDF} style={{ padding: "6px 12px", fontSize: 12, background: "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)", color: "#fff" }} icon="📥">
              PDF
            </Btn>
            <Btn onClick={saveJSON} style={{ padding: "6px 12px", fontSize: 12, background: "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)", color: "#fff" }} icon="💾">
              Save
            </Btn>
          </div>
        </div>

        <Tabs tabs={tabs} active={tab} onChange={setTab} />

        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          {tab === "basic" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Input label="Full Name" value={resume.name} onChange={upd("name")} placeholder="Jane Doe" />
              <Input label="Job Title" value={resume.title} onChange={upd("title")} placeholder="Software Developer" />
              <Input label="Phone" value={resume.phone} onChange={upd("phone")} placeholder="+1 234 567 8900" />
              <Input label="Email" value={resume.email} onChange={upd("email")} placeholder="jane@example.com" type="email" />
              <Input label="Address" value={resume.address} onChange={upd("address")} placeholder="City, State" />
              <Input label="LinkedIn URL" value={resume.linkedin} onChange={upd("linkedin")} placeholder="linkedin.com/in/jane" />
              <Input label="GitHub URL" value={resume.github} onChange={upd("github")} placeholder="github.com/jane" />
              <Input label="Portfolio URL" value={resume.portfolio} onChange={upd("portfolio")} placeholder="yourportfolio.com" />

              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px", background: "#111", borderRadius: 10, border: "1px solid #2a2a2a" }}>
                <input type="checkbox" checked={resume.isFresher} onChange={e => upd("isFresher")(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: ACCENT }} />
                <label style={{ fontSize: 13, color: "#aaa" }}>I am a fresher (no work experience)</label>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#888" }}>Professional Summary</label>
                  <button onClick={generateSummary} style={{ fontSize: 11, color: ACCENT, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>✨ Auto-generate</button>
                </div>
                <TextArea value={resume.summary} onChange={upd("summary")} placeholder="Write your professional summary..." rows={4} />
              </div>
            </div>
          )}

          {tab === "experience" && (
            <div>
              {resume.isFresher ? (
                <div style={{ textAlign: "center", padding: 24, color: "#555", fontSize: 13 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
                  Fresher mode enabled. Skip experience or add internships.
                </div>
              ) : (
                <>
                  <Btn onClick={addExperience} style={{ marginBottom: 12, width: "100%", background: "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)", color: "#fff" }}>+ Add Experience</Btn>
                  {resume.experience.length === 0 && (
                    <div style={{ textAlign: "center", padding: "24px 0", color: "#555", fontSize: 13 }}>No experience added yet.</div>
                  )}
                  {resume.experience.map((exp, i) => (
                    <Card key={i} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#888" }}>Experience {i + 1}</span>
                        <button onClick={() => removeExp(i)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 12 }}>Remove</button>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <Input label="Job Title" value={exp.role} onChange={v => updExp(i, "role", v)} placeholder="Software Engineer" />
                        <Input label="Company" value={exp.company} onChange={v => updExp(i, "company", v)} placeholder="Acme Corp" />
                        <Input label="Period" value={exp.period} onChange={v => updExp(i, "period", v)} placeholder="Jan 2022 – Dec 2023" />
                        <TextArea label="Description" value={exp.description} onChange={v => updExp(i, "description", v)} placeholder="Key responsibilities and achievements..." rows={3} />
                      </div>
                    </Card>
                  ))}
                </>
              )}
            </div>
          )}

          {tab === "education" && (
            <div>
              <Btn onClick={addEducation} style={{ marginBottom: 12, width: "100%", background: "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)", color: "#fff" }}>+ Add Education</Btn>
              {resume.education.map((edu, i) => (
                <Card key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 10 }}>Education {i + 1}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Input label="Degree / Standard" value={edu.degree} onChange={v => updEdu(i, "degree", v)} placeholder="B.Tech CSE / 12th Grade" />
                    <Input label="College / School" value={edu.college} onChange={v => updEdu(i, "college", v)} placeholder="MIT" />
                    <Input label="Year" value={edu.year} onChange={v => updEdu(i, "year", v)} placeholder="2020 – 2024" />
                    <Input label="Percentage / CGPA" value={edu.percentage} onChange={v => updEdu(i, "percentage", v)} placeholder="8.5 CGPA / 85%" />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {tab === "projects" && (
            <div>
              <Btn onClick={addProject} style={{ marginBottom: 12, width: "100%", background: "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)", color: "#fff" }}>+ Add Project</Btn>
              {resume.projects.map((proj, i) => (
                <Card key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 10 }}>Project {i + 1}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Input label="Project Name" value={proj.name} onChange={v => updProj(i, "name", v)} placeholder="My Portfolio" />
                    <Input label="Tech Stack" value={proj.tech} onChange={v => updProj(i, "tech", v)} placeholder="React, Node.js" />
                    <Input label="Location / Category" value={proj.location} onChange={v => updProj(i, "location", v)} placeholder="GitHub / Live Demo" />
                    <Input label="Project URL" value={proj.link} onChange={v => updProj(i, "link", v)} placeholder="https://github.com/..." />
                    <TextArea label="Description" value={proj.description} onChange={v => updProj(i, "description", v)} rows={2} />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {tab === "skills" && (
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addSkill(skillInput)}
                  placeholder="Add skill & press Enter" list="skills-list"
                  style={{ flex: 1, background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#fff", outline: "none" }} />
                <datalist id="skills-list">{SKILLS_OPTIONS.map(s => <option key={s} value={s} />)}</datalist>
                <Btn onClick={() => addSkill(skillInput)} style={{ padding: "10px 16px" }}>+</Btn>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {resume.skills.map(s => (
                  <span key={s} style={{ fontSize: 12, background: `linear-gradient(135deg, ${ACCENT}15 0%, ${ACCENT_DARK}10 100%)`, border: `1px solid ${ACCENT}40`, color: ACCENT, borderRadius: 8, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6 }}>
                    {s}
                    <button onClick={() => upd("skills")(resume.skills.filter(x => x !== s))} style={{ background: "none", border: "none", color: ACCENT, cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {tab === "certifications" && (
            <div>
              <Btn onClick={addCertification} style={{ marginBottom: 12, width: "100%", background: "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)", color: "#fff" }}>+ Add Certification</Btn>
              {resume.certifications.map((cert, i) => (
                <Card key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 10 }}>Certification {i + 1}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Input label="Certification Name" value={cert.name} onChange={v => updCert(i, "name", v)} placeholder="AWS Solutions Architect" />
                    <Input label="Issuing Organization" value={cert.issuer} onChange={v => updCert(i, "issuer", v)} placeholder="Amazon Web Services" />
                    <Input label="Year" value={cert.year} onChange={v => updCert(i, "year", v)} placeholder="2024" />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {tab === "theme" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Select label="Layout" value={resume.layout} onChange={upd("layout")} options={[
                { value: "single", label: "Single Column" },
                { value: "two-column", label: "Two Column" },
              ]} />
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "block", marginBottom: 10 }}>Theme</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {TEMPLATES.map(t => (
                    <div key={t.id} onClick={() => upd("theme")(t.id)}
                      style={{ padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${resume.theme === t.id ? t.accent : "#2a2a2a"}`, background: resume.theme === t.id ? `${t.accent}12` : "#0a0a0a", cursor: "pointer", transition: "all 0.15s" }}>
                      <div style={{ width: 20, height: 20, borderRadius: 6, background: t.accent, marginBottom: 8 }} />
                      <div style={{ fontSize: 12, fontWeight: 600, color: resume.theme === t.id ? "#fff" : "#888" }}>{t.name}</div>
                      <div style={{ fontSize: 10, color: "#555", marginTop: 4 }}>{t.category}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="builder-preview" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div className="preview-header" style={{ padding: "12px 16px", borderBottom: "1px solid #1e1e1e", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "#888" }}>Live Preview</span>
          <Badge>{resume.theme}</Badge>
          <Badge color="#60a5fa">{resume.layout}</Badge>
        </div>
        {preview ? (
          <iframe ref={iframeRef} srcDoc={preview} style={{ flex: 1, border: "none", background: "#fff" }} title="Resume Preview" />
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "#444" }}>
            <div style={{ fontSize: 48 }}>📄</div>
            <div style={{ fontSize: 14 }}>Fill in your details and click Preview</div>
            <Btn onClick={generatePreview}>Generate Preview</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ATS Analyzer Page ───────────────────────────────────────────────────────
function ATSAnalyzerPage() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const fileInputRef = useRef(null);

  const analyzeResume = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const content = text || "Sample resume content";
      const score = calculateATSScore(content);
      const keywords = extractKeywords(content);
      const missing = findMissingKeywords(content, jobTitle);
      const sections = checkSections(content);
      const readability = calculateReadability(content);
      
      setResults({
        score,
        keywords,
        missing,
        sections,
        readability,
        suggestions: generateSuggestions(score, missing, sections),
      });
      setAnalyzing(false);
    }, 1500);
  };

  const calculateATSScore = (content) => {
    const length = content.length;
    const wordCount = content.split(/\s+/).length;
    let score = 50;
    if (wordCount > 200 && wordCount < 1000) score += 15;
    if (content.toLowerCase().includes("@")) score += 5;
    if (content.toLowerCase().includes("linkedin")) score += 5;
    if (content.toLowerCase().includes("github")) score += 5;
    const hasSectionHeaders = /education|experience|skills|projects/i.test(content);
    if (hasSectionHeaders) score += 10;
    if (content.includes("•") || content.includes("-")) score += 5;
    const hasBulletPoints = (content.match(/[•\-\*]/g) || []).length > 5;
    if (hasBulletPoints) score += 5;
    return Math.min(100, Math.max(0, score));
  };

  const extractKeywords = (content) => {
    const keywords = [];
    const contentLower = content.toLowerCase();
    SKILLS_OPTIONS.forEach(skill => {
      if (contentLower.includes(skill.toLowerCase())) keywords.push(skill);
    });
    return [...new Set(keywords)].slice(0, 15);
  };

  const findMissingKeywords = (content, job) => {
    const required = ATS_KEYWORDS[job] || ATS_KEYWORDS["Software Engineer"];
    const contentLower = content.toLowerCase();
    return required.filter(k => !contentLower.includes(k)).slice(0, 8);
  };

  const checkSections = (content) => {
    const sections = ["Contact", "Summary", "Experience", "Education", "Skills", "Projects"];
    const found = [];
    if (/@/.test(content)) found.push("Contact");
    if (/summary|objective|profile/i.test(content)) found.push("Summary");
    if (/experience|work|employment/i.test(content)) found.push("Experience");
    if (/education|degree|certificate/i.test(content)) found.push("Education");
    if (/skill|technology|technologies/i.test(content)) found.push("Skills");
    if (/project/i.test(content)) found.push("Projects");
    return { found, missing: sections.filter(s => !found.includes(s)) };
  };

  const calculateReadability = (content) => {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim()).length;
    const words = content.split(/\s+/).length;
    const avgWordsPerSentence = words / Math.max(sentences, 1);
    if (avgWordsPerSentence < 15) return "Good";
    if (avgWordsPerSentence < 25) return "Fair";
    return "Needs Improvement";
  };

  const generateSuggestions = (score, missing, sections) => {
    const suggestions = [];
    if (score < 70) suggestions.push("Improve your ATS score by adding more relevant keywords");
    if (missing.length > 0) suggestions.push(`Add these missing keywords: ${missing.slice(0, 3).join(", ")}`);
    if (sections.missing.length > 0) suggestions.push(`Add missing sections: ${sections.missing.join(", ")}`);
    if (!sections.found.includes("Skills")) suggestions.push("Add a skills section with relevant technologies");
    return suggestions;
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const reader = new FileReader();
      if (uploadedFile.type === "text/plain") {
        reader.onload = (event) => setText(event.target.result);
        reader.readAsText(uploadedFile);
      } else {
        setText(`[Uploaded: ${uploadedFile.name}]\n\nPDF and DOCX parsing would be handled here. For now, enter resume text manually.`);
      }
    }
  };

  return (
    <div className="page-container analyzer-container" style={{ padding: 32, maxWidth: 1000, margin: "0 auto" }}>
      <h1 className="page-title" style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 8 }}>📊 ATS Resume Analyzer</h1>
      <p className="page-subtitle" style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>Check your resume ATS score and get improvement suggestions.</p>

      <div className="analyzer-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 16 }}>Upload Resume</div>
          <div style={{ marginBottom: 16 }}>
            <Select label="Target Job" value={jobTitle} onChange={setJobTitle}
              options={Object.keys(ATS_KEYWORDS).map(j => ({ value: j, label: j }))} />
          </div>
          <div className="file-upload-area" style={{ border: "2px dashed #2a2a2a", borderRadius: 12, padding: 24, textAlign: "center", marginBottom: 16, cursor: "pointer", transition: "all 0.2s" }}
            onClick={() => fileInputRef.current?.click()}
            onMouseEnter={e => e.currentTarget.style.borderColor = ACCENT}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a2a"}>
            <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} style={{ display: "none" }} />
            <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
            <div style={{ fontSize: 13, color: "#888" }}>Click to upload PDF, DOCX, or TXT</div>
            {file && <div style={{ fontSize: 12, color: ACCENT, marginTop: 8 }}>{file.name}</div>}
          </div>
          <TextArea label="Or paste resume text" value={text} onChange={setText} placeholder="Paste your resume text here..." rows={8} />
          <Btn onClick={analyzeResume} disabled={analyzing || (!text && !file)} style={{ width: "100%", marginTop: 16 }} icon={analyzing ? "⏳" : "📊"}>
            {analyzing ? "Analyzing..." : "Analyze Resume"}
          </Btn>
        </Card>

        {results && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 16 }}>ATS Score</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                <div style={{ position: "relative", width: 140, height: 140 }}>
                  <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#1e1e1e" strokeWidth="10" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke={results.score >= 70 ? "#4ade80" : results.score >= 50 ? "#fbbf24" : "#ef4444"} strokeWidth="10"
                      strokeDasharray={`${results.score * 2.83} 283`} strokeLinecap="round" />
                  </svg>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                    <div style={{ fontSize: 36, fontWeight: 900, color: results.score >= 70 ? "#4ade80" : results.score >= 50 ? "#fbbf24" : "#ef4444" }}>{results.score}</div>
                    <div style={{ fontSize: 10, color: "#666" }}>/ 100</div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "center", fontSize: 14, color: results.score >= 70 ? "#4ade80" : results.score >= 50 ? "#fbbf24" : "#ef4444", fontWeight: 600 }}>
                {results.score >= 70 ? "✓ Good ATS Score" : results.score >= 50 ? "⚠ Needs Improvement" : "✗ Low ATS Score"}
              </div>
            </Card>

            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 12 }}>Found Keywords ({results.keywords.length})</div>
              <div className="keywords-cloud" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {results.keywords.length > 0 ? results.keywords.map(k => (
                  <span key={k} style={{ fontSize: 11, background: "#4ade8020", color: "#4ade80", border: "1px solid #4ade8030", borderRadius: 6, padding: "3px 8px" }}>{k}</span>
                )) : <span style={{ fontSize: 12, color: "#555" }}>No keywords found</span>}
              </div>
            </Card>

            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 12 }}>Missing Keywords</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {results.missing.map(k => (
                  <span key={k} style={{ fontSize: 11, background: "#ef444420", color: "#ef4444", border: "1px solid #ef444430", borderRadius: 6, padding: "3px 8px" }}>{k}</span>
                ))}
              </div>
            </Card>

            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 12 }}>Section Analysis</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                {results.sections.found.map(s => (
                  <Badge key={s} color="#4ade80">{s}</Badge>
                ))}
              </div>
              {results.sections.missing.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {results.sections.missing.map(s => (
                    <span key={s} style={{ fontSize: 11, background: "#ef444420", color: "#ef4444", border: "1px solid #ef444430", borderRadius: 6, padding: "3px 8px" }}>{s}</span>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 12 }}>Suggestions</div>
              <div className="suggestions-list">
              {results.suggestions.map((s, i) => (
                <div key={i} style={{ fontSize: 12, color: "#888", marginBottom: 8, display: "flex", gap: 8 }}>
                  <span style={{ color: ACCENT }}>•</span>{s}
                </div>
              ))}
              </div>
            </Card>
          </div>
        )}

        {!results && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GlassCard style={{ textAlign: "center", padding: 48 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 8 }}>No Analysis Yet</div>
              <div style={{ fontSize: 13, color: "#666" }}>Upload a resume or paste text to analyze</div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Visual Editor Page (Canva-style) ────────────────────────────────────────
function VisualEditorPage() {
  const [elements, setElements] = useState([
    { id: 1, type: "header", content: "Your Name", x: 50, y: 40, w: 300, h: 60, fontSize: 32, fontWeight: 900, color: "#fff" },
    { id: 2, type: "text", content: "Software Developer", x: 50, y: 110, w: 250, h: 30, fontSize: 16, fontWeight: 500, color: "#3b82f6" },
    { id: 3, type: "section", content: "About Me", x: 50, y: 160, w: 500, h: 30, fontSize: 14, fontWeight: 700, color: "#3b82f6" },
    { id: 4, type: "text", content: "Passionate developer with experience in building scalable web applications...", x: 50, y: 195, w: 500, h: 60, fontSize: 12, color: "#aaa" },
  ]);
  const [selected, setSelected] = useState(null);
  const [tool, setTool] = useState("select");
  const [zoom, setZoom] = useState(100);
  const [showTemplates, setShowTemplates] = useState(false);
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(null);

  const addElement = (type) => {
    const newEl = {
      id: Date.now(),
      type,
      content: type === "header" ? "New Header" : type === "section" ? "Section Title" : "Text content...",
      x: 50,
      y: 100 + elements.length * 50,
      w: type === "header" ? 300 : 200,
      h: type === "header" ? 50 : type === "section" ? 30 : 40,
      fontSize: type === "header" ? 28 : type === "section" ? 14 : 12,
      fontWeight: type === "header" ? 900 : type === "section" ? 700 : 400,
      color: "#fff",
      bg: "transparent",
    };
    setElements([...elements, newEl]);
    setSelected(newEl.id);
  };

  const updateElement = (id, updates) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const deleteElement = (id) => {
    setElements(elements.filter(el => el.id !== id));
    setSelected(null);
  };

  const handleDragStart = (e, id) => {
    e.stopPropagation();
    setDragging(id);
  };

  const handleDrag = (e) => {
    if (dragging && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (100 / zoom);
      const y = (e.clientY - rect.top) * (100 / zoom);
      updateElement(dragging, { x, y });
    }
  };

  const handleDragEnd = () => {
    setDragging(null);
  };

  const tools = [
    { id: "select", icon: "↖", label: "Select" },
    { id: "text", icon: "T", label: "Text" },
    { id: "header", icon: "H", label: "Header" },
    { id: "section", icon: "▣", label: "Section" },
    { id: "shape", icon: "□", label: "Shape" },
  ];

  return (
    <div style={{ display: "flex", height: "calc(100vh - 0px)", overflow: "hidden" }}>
      {/* Toolbar */}
      <div className="editor-toolbar" style={{ width: 60, background: "#0a0a0a", borderRight: "1px solid #1e1e1e", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {tools.map(t => (
          <button key={t.id} onClick={() => setTool(t.id)}
            style={{ width: 36, height: 36, borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, background: tool === t.id ? `linear-gradient(135deg, ${ACCENT}20 0%, ${ACCENT_DARK}10 100%)` : "#111", color: tool === t.id ? ACCENT : "#666", transition: "all 0.15s" }}>
            {t.icon}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => addElement(tool === "select" ? "text" : tool)} disabled={tool === "select"}
          style={{ width: 36, height: 36, borderRadius: 8, border: "none", cursor: "pointer", fontSize: 20, background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "#fff", fontWeight: 900 }}>
          +
        </button>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#080808" }}>
        <div style={{ padding: "10px 16px", borderBottom: "1px solid #1e1e1e", display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, color: "#888" }}>🎨 Visual Editor</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setZoom(z => Math.max(50, z - 10))} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #2a2a2a", background: "#111", color: "#888", cursor: "pointer" }}>-</button>
            <span style={{ fontSize: 12, color: "#666", minWidth: 50, textAlign: "center" }}>{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(200, z + 10))} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #2a2a2a", background: "#111", color: "#888", cursor: "pointer" }}>+</button>
          </div>
          <div style={{ flex: 1 }} />
          <Btn onClick={() => setShowTemplates(true)} style={{ fontSize: 12, padding: "6px 12px" }}>📑 Templates</Btn>
          <Btn style={{ fontSize: 12, padding: "6px 12px", background: "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)", color: "#fff" }}>📥 Export</Btn>
        </div>

        <div className="editor-canvas-area" style={{ flex: 1, overflow: "auto", padding: 40, display: "flex", justifyContent: "center" }}>
          <div ref={canvasRef}
            onMouseMove={handleDrag}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            style={{
              width: 612 * (zoom / 100),
              height: 792 * (zoom / 100),
              background: "#fff",
              boxShadow: "0 0 40px rgba(0,0,0,0.5)",
              position: "relative",
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center",
            }}>
            {elements.map(el => (
              <div key={el.id} onClick={(e) => { e.stopPropagation(); setSelected(el.id); }}
                onMouseDown={(e) => handleDragStart(e, el.id)}
                style={{
                  position: "absolute",
                  left: el.x * (zoom / 100),
                  top: el.y * (zoom / 100),
                  width: el.w * (zoom / 100),
                  height: el.h * (zoom / 100),
                  fontSize: el.fontSize * (zoom / 100),
                  fontWeight: el.fontWeight,
                  color: el.color,
                  background: el.bg,
                  cursor: "move",
                  border: selected === el.id ? `2px dashed ${ACCENT}` : "none",
                  padding: 4,
                  whiteSpace: "pre-wrap",
                  overflow: "hidden",
                }}>
                {el.content}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      {selected && (
        <div className="editor-properties" style={{ width: 280, background: "#0a0a0a", borderLeft: "1px solid #1e1e1e", padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 16 }}>Properties</div>
          {(() => {
            const el = elements.find(e => e.id === selected);
            return el ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <TextArea label="Content" value={el.content} onChange={v => updateElement(selected, { content: v })} rows={2} />
                <Input label="Font Size" type="number" value={el.fontSize} onChange={v => updateElement(selected, { fontSize: +v })} />
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "block", marginBottom: 6 }}>Font Weight</label>
                  <select value={el.fontWeight} onChange={e => updateElement(selected, { fontWeight: +e.target.value })}
                    style={{ width: "100%", background: "#111", border: "1px solid #2a2a2a", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#fff" }}>
                    <option value={400}>Regular</option>
                    <option value={500}>Medium</option>
                    <option value={600}>Semi Bold</option>
                    <option value={700}>Bold</option>
                    <option value={900}>Black</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "block", marginBottom: 6 }}>Color</label>
                  <input type="color" value={el.color} onChange={e => updateElement(selected, { color: e.target.value })}
                    style={{ width: "100%", height: 36, border: "1px solid #2a2a2a", borderRadius: 8, cursor: "pointer" }} />
                </div>
                <Btn onClick={() => deleteElement(selected)} variant="danger" style={{ marginTop: 8 }}>🗑️ Delete</Btn>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
}

// ── Templates Page ───────────────────────────────────────────────────────────
function TemplatesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", "Modern", "Classic", "Minimal", "Tech", "Professional", "Creative", "Executive"];

  const filtered = TEMPLATES.filter(t =>
    (category === "All" || t.category === category) &&
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container templates-page" style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
      <h1 className="page-title" style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 8 }}>📑 Resume Templates</h1>
      <p className="page-subtitle" style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>Browse and use professional resume templates. All free, all offline.</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates..."
          style={{ flex: 1, minWidth: 200, background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "#fff", outline: "none" }} />
        <div className="category-filters" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", background: category === c ? `linear-gradient(135deg, ${ACCENT}20 0%, ${ACCENT_DARK}10 100%)` : "#111", color: category === c ? ACCENT : "#666", transition: "all 0.1s" }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="templates-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
        {filtered.map(t => (
          <Card key={t.id} className="template-card" style={{ cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 30px ${t.accent}20`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e1e1e"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
            <div className="preview" style={{ height: 140, background: `linear-gradient(145deg, ${t.accent}15 0%, #0a0a0a 100%)`, borderRadius: 10, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 40, color: t.accent }}>📄</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>{t.name}</div>
              <Badge color={t.accent}>{t.category}</Badge>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
              {t.tags.map(tag => <span key={tag} style={{ fontSize: 10, color: "#555", background: "#111", borderRadius: 4, padding: "2px 6px" }}>{tag}</span>)}
            </div>
            <Btn style={{ width: "100%", fontSize: 12, padding: "8px 0" }}>Use Template</Btn>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Export Center Page ──────────────────────────────────────────────────────
function ExportCenterPage() {
  const [resume] = useLocalStorage("mdrc_resume", {});
  const [exporting, setExporting] = useState(false);

  const exportPDF = () => {
    setExporting(true);
    setTimeout(() => {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(generateResumeHTML(resume));
      printWindow.document.close();
      printWindow.print();
      setExporting(false);
    }, 500);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportHistory = () => {
    const history = JSON.parse(localStorage.getItem("mdrc_history") || "[]");
    const all = [resume, ...history].slice(0, 10);
    const blob = new Blob([JSON.stringify(all, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-container" style={{ padding: 32, maxWidth: 800, margin: "0 auto" }}>
      <h1 className="page-title" style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 8 }}>📥 Export Center</h1>
      <p className="page-subtitle" style={{ color: "#666", fontSize: 14, marginBottom: 32 }}>Export your resume in different formats.</p>

      <div className="export-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <Card>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 8 }}>PDF Export</div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>Download your resume as a PDF file ready to print or submit.</div>
          <Btn onClick={exportPDF} disabled={exporting} style={{ width: "100%" }} icon="📥">
            {exporting ? "Exporting..." : "Export PDF"}
          </Btn>
        </Card>

        <Card>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 8 }}>JSON Export</div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>Export your resume data as JSON for backup or migration.</div>
          <Btn onClick={exportJSON} style={{ width: "100%", background: "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)", color: "#fff" }} icon="📦">
            Export JSON
          </Btn>
        </Card>

        <Card>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📜</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 8 }}>Resume History</div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>Download all your saved resume versions.</div>
          <Btn onClick={exportHistory} style={{ width: "100%", background: "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)", color: "#fff" }} icon="📜">
            Export History
          </Btn>
        </Card>

        <Card>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💾</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 8 }}>Templates</div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>Download all resume templates as a package.</div>
          <Btn style={{ width: "100%", background: "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)", color: "#fff" }} icon="💾">
            Download Templates
          </Btn>
        </Card>
      </div>
    </div>
  );
}

// ── Settings Page ───────────────────────────────────────────────────────────
// (imported from SettingsPage.jsx)

// ── About Page ───────────────────────────────────────────────────────────────
function AboutPage() {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="page-container about-page" style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1 className="page-title" style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 8 }}>ℹ️ About</h1>
      <p className="page-subtitle" style={{ color: "#666", fontSize: 14, marginBottom: 32 }}>Learn more about Resume Creator</p>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 12 }}>Resume Creator</div>
        <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, marginBottom: 16 }}>
          Build professional resumes with ATS analysis, visual editor, and 100+ templates. All offline, all free.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="https://vvraju.netlify.app/" target="_blank" rel="noopener noreferrer" 
            style={{ padding: "8px 16px", background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
            <i className="fas fa-globe" style={{ marginRight: 8 }}></i>Website
          </a>
          <a href="https://github.com/vvraju56" target="_blank" rel="noopener noreferrer" 
            style={{ padding: "8px 16px", background: "#1e1e1e", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
            <i className="fab fa-github" style={{ marginRight: 8 }}></i>GitHub
          </a>
          <a href="https://www.linkedin.com/in/vishnuraju-v-757b9929b" target="_blank" rel="noopener noreferrer" 
            style={{ padding: "8px 16px", background: "#1e1e1e", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
            <i className="fab fa-linkedin-in" style={{ marginRight: 8 }}></i>LinkedIn
          </a>
        </div>
      </Card>

      <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 12 }}>Features</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>Resume Builder</li>
            <li style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>ATS Analyzer</li>
            <li style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>Visual Editor</li>
            <li style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>Templates</li>
            <li style={{ fontSize: 12, color: "#94a3b8" }}>PDF Export</li>
          </ul>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 12 }}>Resources</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>Documentation</li>
            <li style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>Template Guide</li>
            <li style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>Resume Tips</li>
            <li style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>ATS Guide</li>
            <li style={{ fontSize: 12, color: "#94a3b8" }}>FAQ</li>
          </ul>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 12 }}>Support</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>Contact Us</li>
            <li style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>Report Bug</li>
            <li style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>Feature Request</li>
            <li style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>Privacy Policy</li>
            <li style={{ fontSize: 12, color: "#94a3b8" }}>Terms of Service</li>
          </ul>
        </Card>
      </div>

      <Card style={{ textAlign: "center", padding: 24 }}>
        <p style={{ fontSize: 13, color: "#64748b" }}>
          © {currentYear} <span style={{ color: "#3b82f6", fontWeight: 600 }}>Resume Creator</span>. All rights reserved. 
          Made with <span style={{ color: "#ef4444" }}>♥</span> by <span style={{ color: "#3b82f6", fontWeight: 600 }}>VV</span>
        </p>
      </Card>
    </div>
  );
}

// ── Resume HTML Generator (local fallback) ─────────────────────────────────
function generateResumeHTML(data) {
  const themes = {
    "modern-dark": { bg: "#0f0f0f", surface: "#1a1a1a", accent: "#3b82f6", text: "#f1f1f1", muted: "#888", border: "#2a2a2a" },
    "classic-light": { bg: "#ffffff", surface: "#f8f8f8", accent: "#2563eb", text: "#1a1a1a", muted: "#666", border: "#e5e5e5" },
    "minimal-clean": { bg: "#fafafa", surface: "#ffffff", accent: "#333333", text: "#111", muted: "#555", border: "#ddd" },
    "tech-dark": { bg: "#0d1117", surface: "#161b22", accent: "#58a6ff", text: "#e6edf3", muted: "#8b949e", border: "#30363d" },
    "blue-professional": { bg: "#f8fafc", surface: "#ffffff", accent: "#3b82f6", text: "#1e293b", muted: "#64748b", border: "#e2e8f0" },
    "green-matrix": { bg: "#0a0f0a", surface: "#0f1a0f", accent: "#4ade80", text: "#f0fdf4", muted: "#86efac", border: "#14532d" },
    "ocean-blue": { bg: "#0c1929", surface: "#132337", accent: "#38bdf8", text: "#e0f2fe", muted: "#7dd3fc", border: "#1e3a5f" },
    "sunset-warm": { bg: "#1a0a00", surface: "#2a1200", accent: "#fb923c", text: "#fff7ed", muted: "#fdba74", border: "#431407" },
    "royal-purple": { bg: "#0a0010", surface: "#130020", accent: "#a855f7", text: "#f3e8ff", muted: "#a78bfa", border: "#2d1457" },
    "elegant-gold": { bg: "#fafaf9", surface: "#ffffff", accent: "#f59e0b", text: "#1c1917", muted: "#78716c", border: "#e7e5e4" },
    "midnight": { bg: "#0f0f23", surface: "#1a1a2e", accent: "#6366f1", text: "#eef2ff", muted: "#a5b4fc", border: "#312e81" },
    "pearl-white": { bg: "#f8fafc", surface: "#ffffff", accent: "#64748b", text: "#1e293b", muted: "#64748b", border: "#e2e8f0" },
    "coral-reef": { bg: "#1a0a0f", surface: "#251015", accent: "#f472b6", text: "#fff1f2", muted: "#fda4af", border: "#4a051d" },
    "slate-gray": { bg: "#1e1e1e", surface: "#2d2d2d", accent: "#94a3b8", text: "#f1f5f9", muted: "#94a3b8", border: "#404040" },
    "emerald": { bg: "#022c22", surface: "#064e3b", accent: "#10b981", text: "#ecfdf5", muted: "#6ee7b7", border: "#065f46" },
    "ruby-red": { bg: "#1a0505", surface: "#2d0a0a", accent: "#ef4444", text: "#fef2f2", muted: "#fca5a5", border: "#450a0a" },
  };
  const t = themes[data.theme] || themes["modern-dark"];
  const e = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Resume - ${e(data.name || "Resume")}</title><style>
*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Inter',system-ui,sans-serif;background:${t.bg};color:${t.text};-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.resume{max-width:860px;margin:0 auto;background:${t.surface};min-height:100vh;}
.header{padding:2.5rem 3rem;background:${t.bg};border-bottom:2px solid ${t.accent};}
h1{font-size:2.5rem;font-weight:900;margin-bottom:0.2rem;}.title{color:${t.accent};font-size:1rem;font-weight:600;margin-bottom:1.2rem;}
.contacts{display:flex;flex-wrap:wrap;gap:0.75rem;font-size:0.82rem;color:${t.muted};}
.contacts a{color:${t.accent};text-decoration:none;}.contacts span::before{content:'· '}.contacts span:first-child::before{content:''}
.body{padding:2rem 3rem;}.section{margin-bottom:2rem;}
.st{font-size:0.65rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${t.accent};padding-bottom:0.4rem;border-bottom:1px solid ${t.border};margin-bottom:1rem;}
.item{margin-bottom:1.2rem;padding-bottom:1.2rem;border-bottom:1px solid ${t.border};}
.item:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0;}
.ih{display:flex;justify-content:space-between;margin-bottom:0.2rem;}
.it{font-weight:700;font-size:0.9rem;}.is{color:${t.accent};font-size:0.8rem;margin-top:0.1rem;}.id{font-size:0.75rem;color:${t.muted};}
.desc{font-size:0.83rem;color:${t.muted};margin-top:0.35rem;line-height:1.65;}
.skills{display:flex;flex-wrap:wrap;gap:0.4rem;}.skill{background:${t.bg};border:1px solid ${t.border};color:${t.text};font-size:0.75rem;padding:0.2rem 0.6rem;border-radius:9999px;}
.cert{font-size:0.8rem;}.ci{font-weight:600;color:${t.accent};}.cy{color:${t.muted};font-size:0.75rem;}
@media print{@page{margin:0;}</style></head><body><div class="resume">
<header class="header"><h1>${e(data.name)}</h1><div class="title">${e(data.title || "Software Developer")}</div>
<div class="contacts">
${data.phone ? `<span>${e(data.phone)}</span>` : ""}
${data.email ? `<span><a href="mailto:${e(data.email)}">${e(data.email)}</a></span>` : ""}
${data.address ? `<span>${e(data.address)}</span>` : ""}
${data.linkedin ? `<span><a href="${e(data.linkedin)}">LinkedIn</a></span>` : ""}
${data.github ? `<span><a href="${e(data.github)}">GitHub</a></span>` : ""}
${data.portfolio ? `<span><a href="${e(data.portfolio)}">Portfolio</a></span>` : ""}
</div></header>
<div class="body">
${data.summary ? `<section class="section"><h2 class="st">Summary</h2><p class="desc">${e(data.summary)}</p></section>` : ""}
${data.skills?.length ? `<section class="section"><h2 class="st">Skills</h2><div class="skills">${data.skills.map(s => `<span class="skill">${e(s)}</span>`).join("")}</div></section>` : ""}
${data.experience?.length && !data.isFresher ? `<section class="section"><h2 class="st">Experience</h2>${data.experience.map(x => `<div class="item"><div class="ih"><div><div class="it">${e(x.role)}</div><div class="is">${e(x.company)}</div></div><div class="id">${e(x.period)}</div></div>${x.description ? `<p class="desc">${e(x.description)}</p>` : ""}</div>`).join("")}</section>` : ""}
${data.education?.length ? `<section class="section"><h2 class="st">Education</h2>${data.education.map(x => `<div class="item"><div class="ih"><div><div class="it">${e(x.degree)}</div><div class="is">${e(x.college)}</div></div><div class="id">${e(x.year)}</div></div>${x.percentage ? `<p class="desc">${e(x.percentage)}</p>` : ""}</div>`).join("")}</section>` : ""}
${data.projects?.length ? `<section class="section"><h2 class="st">Projects</h2>${data.projects.map(x => `<div class="item"><div class="ih"><div><div class="it">${e(x.name)}</div><div class="is">${e(x.location)}</div></div>${x.link ? `<div class="id"><a href="${e(x.link)}" style="color:${t.accent}">Link</a></div>` : ""}</div>${x.tech ? `<p class="desc" style="color:${t.accent};font-size:0.75rem">${e(x.tech)}</p>` : ""}${x.description ? `<p class="desc">${e(x.description)}</p>` : ""}</div>`).join("")}</section>` : ""}
${data.certifications?.length ? `<section class="section"><h2 class="st">Certifications</h2>${data.certifications.map(c => `<div class="item"><div class="ih"><span class="ci">${e(c.name)}</span><span class="cy">${e(c.year)}</span></div>${c.issuer ? `<p class="desc">${e(c.issuer)}</p>` : ""}</div>`).join("")}</section>` : ""}
</div></div></body></html>`;
}

// ── Footer Component ─────────────────────────────────────────────────────────
function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Column 1: About */}
          <div className="footer-column footer-about">
            <h4 className="footer-column-title">About</h4>
            <p className="footer-about-desc">
              Resume Creator - Build professional resumes with ATS analysis, visual editor, and 100+ templates. All offline, all free.
            </p>
            <div className="footer-social">
              <a href="https://vvraju.netlify.app/" target="_blank" rel="noopener noreferrer" className="social-link" title="Website">
                <i className="fas fa-globe"></i>
              </a>
              <a href="https://github.com/vvraju56" target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://www.linkedin.com/in/vishnuraju-v-757b9929b" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Features */}
          <div className="footer-column">
            <h4 className="footer-column-title">Features</h4>
            <ul className="footer-links">
              <li><a href="#">Resume Builder</a></li>
              <li><a href="#">ATS Analyzer</a></li>
              <li><a href="#">Visual Editor</a></li>
              <li><a href="#">Templates</a></li>
              <li><a href="#">PDF Export</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="footer-column">
            <h4 className="footer-column-title">Resources</h4>
            <ul className="footer-links">
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Template Guide</a></li>
              <li><a href="#">Resume Tips</a></li>
              <li><a href="#">ATS Guide</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="footer-column">
            <h4 className="footer-column-title">Support</h4>
            <ul className="footer-links">
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Report Bug</a></li>
              <li><a href="#">Feature Request</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} <span className="brand-name">Resume Creator</span>. All rights reserved. Made with <span className="heart">♥</span> by <span className="author">VV</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── App Root ───────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useLocalStorage("mdrc_page", "home");

  const pages = {
    home: <HomePage setPage={setPage} />,
    builder: <ResumeBuilderPage />,
    analyzer: <ATSAnalyzerPage />,
    editor: <VisualEditorPage />,
    templates: <TemplatesPage />,
    export: <ExportCenterPage />,
    settings: <SettingsPage setPage={setPage} />,
    about: <AboutPage />,
  };

  return (
    <div className="app-container" style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#080808", color: "#f1f1f1", fontFamily: "'Inter', system-ui, sans-serif", overflow: "hidden" }}>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar page={page} setPage={setPage} />
        <main className="main-content" style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
          {pages[page] || pages.home}
        </main>
      </div>
    </div>
  );
}