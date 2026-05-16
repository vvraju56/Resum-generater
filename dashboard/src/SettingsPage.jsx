import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PINK = "#3b82f6";
const PINK_DARK = "#2563eb";
const PINK_GLOW = "rgba(59, 130, 246, 0.3)";

const CATEGORIES = [
  { id: "appearance", icon: "✨", label: "Appearance" },
  { id: "editor", icon: "✏️", label: "Editor" },
  { id: "ats", icon: "📊", label: "ATS Analyzer" },
  { id: "export", icon: "📥", label: "Export" },
  { id: "backup", icon: "💾", label: "Backup & Sync" },
  { id: "privacy", icon: "🔒", label: "Privacy" },
  { id: "accessibility", icon: "♿", label: "Accessibility" },
  { id: "notifications", icon: "🔔", label: "Notifications" },
  { id: "danger", icon: "⚠️", label: "Danger Zone" },
];

const FONT_OPTIONS = [
  "Inter", "System UI", "Roboto", "Poppins", "SF Pro",
  "JetBrains Mono", "Playfair Display", "Space Grotesk",
];

const PAGE_SIZES = ["A4", "Letter", "Legal", "Tabloid"];

const EXPORT_FORMATS = ["PDF", "JSON", "DOCX", "TXT", "Markdown"];

const PDF_QUALITIES = ["Standard", "High", "Premium"];

const SAVE_INTERVALS = ["30s", "1 min", "2 min", "5 min", "10 min"];

const ATS_STRICTNESS = ["Relaxed", "Moderate", "Strict", "Very Strict"];

const FILENAME_FORMATS = [
  "Resume_{name}_{date}",
  "{name}_Resume_{date}",
  "Resume_{name}",
  "{name}_CV_{date}",
  "{name}_Resume",
];

const NAV_ITEMS_SETTINGS = [
  { id: "home", icon: "⊞", label: "Home" },
  { id: "builder", icon: "📄", label: "Resume Builder" },
  { id: "analyzer", icon: "📊", label: "ATS Analyzer" },
  { id: "editor", icon: "🎨", label: "Visual Editor" },
  { id: "templates", icon: "📑", label: "Templates" },
  { id: "export", icon: "📥", label: "Export Center" },
  { id: "settings", icon: "⚙️", label: "Settings" },
  { id: "about", icon: "ℹ️", label: "About" },
];

function useLocalStorage(key, init) {
  const [val, setVal] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? { ...init, ...JSON.parse(s) } : init;
    }
    catch { return init; }
  });
  const set = useCallback(v => {
    setVal(prev => {
      const next = typeof v === "function" ? v(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); }
      catch {}
      return next;
    });
  }, [key]);
  return [val, set];
}

function Toggle({ checked, onChange, label, tooltip }) {
  return (
    <div className="settings-field-row">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, color: "#c0c0c0" }}>{label}</span>
        {tooltip && (
          <span className="settings-tooltip" title={tooltip} style={{ fontSize: 11, color: "#555", cursor: "help", border: "1px solid #333", borderRadius: "50%", width: 16, height: 16, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>?</span>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={checked ? "toggle-on" : "toggle-off"}
        style={{
          width: 44, height: 24, borderRadius: 12, border: "none",
          cursor: "pointer", position: "relative", transition: "all 0.25s ease",
          background: checked ? PINK : "#2a2a2a",
          boxShadow: checked ? `0 0 8px ${PINK_GLOW}` : "none",
        }}
        aria-label={label}
      >
        <span style={{
          position: "absolute", top: 3, left: checked ? 23 : 3,
          width: 18, height: 18, borderRadius: "50%",
          background: "#fff", transition: "all 0.25s ease",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }} />
      </button>
    </div>
  );
}

function RangeSlider({ label, value, onChange, min, max, step = 1, unit = "" }) {
  return (
    <div className="settings-field-row">
      <span style={{ fontSize: 13, color: "#c0c0c0" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <input
          type="range" min={min} max={max} step={step}
          value={value} onChange={e => onChange(+e.target.value)}
          style={{
            width: 100, height: 4, borderRadius: 2,
            accentColor: PINK, cursor: "pointer",
          }}
        />
        <span style={{
          fontSize: 12, color: "#fff", minWidth: 36, textAlign: "right",
          fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
        }}>
          {value}{unit}
        </span>
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options, tooltip }) {
  return (
    <div className="settings-field-row">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, color: "#c0c0c0" }}>{label}</span>
        {tooltip && (
          <span className="settings-tooltip" title={tooltip} style={{ fontSize: 11, color: "#555", cursor: "help", border: "1px solid #333", borderRadius: "50%", width: 16, height: 16, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>?</span>
        )}
      </div>
      <select
        value={value} onChange={e => onChange(e.target.value)}
        style={{
          background: "#111", border: "1px solid #2a2a2a",
          borderRadius: 8, padding: "6px 28px 6px 10px",
          fontSize: 12, color: "#fff", cursor: "pointer",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%233b82f6' d='M5 7L1 3h8z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 8px center",
          outline: "none",
        }}
      >
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function StatusChip({ label, color = "#4ade80" }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "0.05em",
      background: `${color}18`, color,
      border: `1px solid ${color}30`,
      borderRadius: 9999, padding: "2px 10px",
    }}>
      {label}
    </span>
  );
}

function GlassCard({ children, style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 20, padding: 24,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

function SectionCard({ title, icon, chip, children }) {
  return (
    <GlassCard style={{ marginBottom: 16 }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 20, flexWrap: "wrap", gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{title}</span>
        </div>
        {chip && <StatusChip label={chip} />}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {children}
      </div>
    </GlassCard>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "rgba(255,255,255,0.04)", margin: "4px 0" }} />;
}

function Toast({ message, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
            border: `1px solid ${PINK}30`,
            borderRadius: 12, padding: "12px 24px",
            boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${PINK_GLOW}`,
            display: "flex", alignItems: "center", gap: 10,
            zIndex: 9999,
          }}
        >
          <span style={{ color: PINK, fontSize: 16 }}>✓</span>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function SettingsPage({ setPage }) {
  const [settings, setSettings] = useLocalStorage("mdrc_settings", {
    theme: "dark",
    accentColor: "#3b82f6",
    fontFamily: "Inter",
    compactMode: false,
    enableAnimations: true,
    glassmorphism: true,
    fontSize: 14,
    autoPreview: true,
    autoSave: true,
    autoSaveInterval: "1 min",
    spellCheck: true,
    grammarSuggestions: true,
    pageSize: "A4",
    dragDropSections: true,
    atsScoring: true,
    keywordAnalysis: true,
    atsStrictness: "Moderate",
    readabilityScore: true,
    actionVerbDetection: true,
    defaultExportFormat: "PDF",
    pdfQuality: "High",
    includeHyperlinks: true,
    embedFonts: false,
    filenameFormat: "Resume_{name}_{date}",
    enableLocalBackup: true,
    cloudSync: false,
    localStorageOnly: true,
    encryptData: false,
    passwordProtection: false,
    analyticsOptIn: false,
    crashReportSharing: false,
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    screenReader: false,
    exportNotifications: true,
    atsAlerts: true,
    updateNotifications: true,
    completionReminders: false,
  });

  const [category, setCategory] = useState("appearance");
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const searchRef = useRef(null);
  const contentRef = useRef(null);

  const upd = (key) => (val) => {
    setSettings(prev => ({ ...prev, [key]: val }));
  };

  const showToast = (msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: "" }), 2500);
  };

  const saveSettings = () => {
    setSaved(true);
    showToast("Settings saved successfully");
    setTimeout(() => setSaved(false), 2000);
  };

  const clearAllData = () => {
    if (window.confirm("Clear all local data? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const resetAllSettings = () => {
    if (window.confirm("Reset all settings to defaults?")) {
      localStorage.removeItem("mdrc_settings");
      window.location.reload();
    }
  };

  const resetSection = (section) => {
    setSettings(prev => ({ ...prev, [section]: undefined }));
    showToast(`${section} settings reset`);
  };

  const filteredCategories = CATEGORIES.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  const activeCategory = filteredCategories.length > 0
    ? (filteredCategories.some(c => c.id === category) ? category : filteredCategories[0].id)
    : category;

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setSearch("");
      searchRef.current?.blur();
    }
  };

  useEffect(() => {
    if (search && contentRef.current) {
      const firstSection = contentRef.current.querySelector("[data-category]");
      if (firstSection) {
        const id = firstSection.getAttribute("data-category");
        if (filteredCategories.some(c => c.id === id)) setCategory(id);
      }
    }
  }, [search]);

  return (
    <div className="settings-page-root" style={{
      minHeight: "calc(100vh - 56px)",
      background: "#080808",
      backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(255,121,238,0.03) 0%, transparent 60%)",
    }}>
      {/* ── Header ── */}
      <div style={{
        padding: "28px 32px 0", maxWidth: 1280, margin: "0 auto",
      }}>
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16, marginBottom: 24,
        }}>
          <div>
            <h1 style={{
              fontSize: 28, fontWeight: 900, color: "#fff",
              letterSpacing: "-0.5px", marginBottom: 4,
            }}>
              ⚙️ Settings
            </h1>
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
              Configure your Resume Creator experience
            </p>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "6px 16px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 10,
          }}>
            <StatusChip label="Synced" color="#4ade80" />
            <StatusChip label="Secure" color="#60a5fa" />
            <StatusChip label="Optimized" color={PINK} />
          </div>
        </div>

        {/* ── Search ── */}
        <div className="settings-search-bar" style={{
          position: "relative", marginBottom: 28,
        }}>
          <span style={{
            position: "absolute", left: 14, top: "50%",
            transform: "translateY(-50%)",
            fontSize: 14, color: "#555", pointerEvents: "none",
          }}>🔍</span>
          <input
            ref={searchRef}
            value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search settings..."
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: "12px 16px 12px 40px",
              fontSize: 13, color: "#fff", outline: "none",
              transition: "all 0.2s",
            }}
            onFocus={e => { e.target.style.borderColor = PINK; e.target.style.boxShadow = `0 0 0 3px ${PINK}15`; }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute", right: 12, top: "50%",
                transform: "translateY(-50%)",
                background: "none", border: "none",
                color: "#666", cursor: "pointer", fontSize: 14,
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div style={{
        display: "flex", gap: 24, maxWidth: 1280, margin: "0 auto",
        padding: "0 32px 32px",
      }}>
        {/* ── Settings Sidebar ── */}
        <aside className="settings-sidebar" style={{
          width: 200, flexShrink: 0,
          display: "flex", flexDirection: "column", gap: 2,
          position: "sticky", top: 80, alignSelf: "flex-start",
          maxHeight: "calc(100vh - 140px)", overflowY: "auto",
        }}>
          {filteredCategories.map(cat => (
            <motion.button
              key={cat.id}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCategory(cat.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", borderRadius: 10,
                border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: activeCategory === cat.id ? 600 : 400,
                background: activeCategory === cat.id
                  ? `linear-gradient(135deg, ${PINK}15 0%, ${PINK_DARK}08 100%)`
                  : "transparent",
                color: activeCategory === cat.id ? PINK : "#777",
                textAlign: "left", transition: "all 0.15s",
                borderLeft: activeCategory === cat.id ? `2px solid ${PINK}` : "2px solid transparent",
              }}
            >
              <span style={{ fontSize: 14 }}>{cat.icon}</span>
              <span>{cat.label}</span>
            </motion.button>
          ))}
          {filteredCategories.length === 0 && (
            <div style={{ fontSize: 12, color: "#555", padding: 20, textAlign: "center" }}>
              No categories match "{search}"
            </div>
          )}
        </aside>

        {/* ── Main Content ── */}
        <main ref={contentRef} className="settings-main" style={{
          flex: 1, minWidth: 0,
        }}>
          {activeCategory === "appearance" && (
            <SectionCard title="Appearance" icon="✨" chip="Theme">
              <SelectField label="Theme Mode" value={settings.theme} onChange={upd("theme")}
                options={["Dark", "Light", "System"]} />
              <Divider />
              <div className="settings-field-row">
                <span style={{ fontSize: 13, color: "#c0c0c0" }}>Accent Color</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {["#000000", "#3b82f6", "#4ade80", "#f59e0b", "#ef4444", "#a855f7", "#06b6d4", "#f97316"].map(c => (
                    <button
                      key={c}
                      onClick={() => upd("accentColor")(c)}
                      style={{
                        width: 24, height: 24, borderRadius: "50%",
                        background: c, border: settings.accentColor === c ? "2px solid #fff" : "2px solid transparent",
                        cursor: "pointer", transition: "all 0.15s",
                        boxShadow: settings.accentColor === c ? `0 0 10px ${c}60` : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
              <Divider />
              <SelectField label="Font Family" value={settings.fontFamily} onChange={upd("fontFamily")} options={FONT_OPTIONS} />
              <Divider />
              <Toggle label="Compact Mode" checked={settings.compactMode} onChange={upd("compactMode")} tooltip="Reduces spacing for a denser layout" />
              <Divider />
              <Toggle label="Enable Animations" checked={settings.enableAnimations} onChange={upd("enableAnimations")} />
              <Divider />
              <Toggle label="Glassmorphism Effects" checked={settings.glassmorphism} onChange={upd("glassmorphism")} tooltip="Adds frosted glass backdrop effects" />
            </SectionCard>
          )}

          {activeCategory === "editor" && (
            <SectionCard title="Editor Preferences" icon="✏️" chip="Editor">
              <RangeSlider label="Font Size" value={settings.fontSize} onChange={upd("fontSize")} min={10} max={24} unit="px" />
              <Divider />
              <Toggle label="Auto Preview" checked={settings.autoPreview} onChange={upd("autoPreview")} tooltip="Automatically generate preview on changes" />
              <Divider />
              <Toggle label="Auto Save" checked={settings.autoSave} onChange={upd("autoSave")} />
              <Divider />
              <SelectField label="Auto Save Interval" value={settings.autoSaveInterval} onChange={upd("autoSaveInterval")} options={SAVE_INTERVALS} tooltip="How often to auto-save your work" />
              <Divider />
              <Toggle label="Spell Check" checked={settings.spellCheck} onChange={upd("spellCheck")} />
              <Divider />
              <Toggle label="Grammar Suggestions" checked={settings.grammarSuggestions} onChange={upd("grammarSuggestions")} />
              <Divider />
              <SelectField label="Page Size" value={settings.pageSize} onChange={upd("pageSize")} options={PAGE_SIZES} />
              <Divider />
              <Toggle label="Enable Drag & Drop Sections" checked={settings.dragDropSections} onChange={upd("dragDropSections")} tooltip="Reorder sections by dragging" />
            </SectionCard>
          )}

          {activeCategory === "ats" && (
            <SectionCard title="ATS Analyzer" icon="📊" chip="Analysis">
              <Toggle label="Enable ATS Scoring" checked={settings.atsScoring} onChange={upd("atsScoring")} />
              <Divider />
              <Toggle label="Keyword Analysis" checked={settings.keywordAnalysis} onChange={upd("keywordAnalysis")} />
              <Divider />
              <SelectField label="ATS Strictness" value={settings.atsStrictness} onChange={upd("atsStrictness")} options={ATS_STRICTNESS} tooltip="How strictly ATS scoring criteria are applied" />
              <Divider />
              <Toggle label="Resume Readability Score" checked={settings.readabilityScore} onChange={upd("readabilityScore")} />
              <Divider />
              <Toggle label="Action Verb Detection" checked={settings.actionVerbDetection} onChange={upd("actionVerbDetection")} tooltip="Detects strong action verbs in your resume" />
            </SectionCard>
          )}

          {activeCategory === "export" && (
            <SectionCard title="Export Settings" icon="📥" chip="Export">
              <SelectField label="Default Export Format" value={settings.defaultExportFormat} onChange={upd("defaultExportFormat")} options={EXPORT_FORMATS} />
              <Divider />
              <SelectField label="PDF Quality" value={settings.pdfQuality} onChange={upd("pdfQuality")} options={PDF_QUALITIES} tooltip="Higher quality = larger file size" />
              <Divider />
              <Toggle label="Include Hyperlinks" checked={settings.includeHyperlinks} onChange={upd("includeHyperlinks")} />
              <Divider />
              <Toggle label="Embed Fonts in PDF" checked={settings.embedFonts} onChange={upd("embedFonts")} tooltip="Embeds fonts for consistent rendering" />
              <Divider />
              <SelectField label="Filename Format" value={settings.filenameFormat} onChange={upd("filenameFormat")} options={FILENAME_FORMATS} />
            </SectionCard>
          )}

          {activeCategory === "backup" && (
            <SectionCard title="Backup & Sync" icon="💾" chip="Data">
              <Toggle label="Enable Local Backup" checked={settings.enableLocalBackup} onChange={upd("enableLocalBackup")} tooltip="Automatically backup resumes locally" />
              <Divider />
              <Toggle label="Cloud Sync" checked={settings.cloudSync} onChange={upd("cloudSync")} tooltip="Sync across devices (coming soon)" />
              <Divider />
              <div className="settings-field-row">
                <span style={{ fontSize: 13, color: "#c0c0c0" }}>Import Backup</span>
                <button
                  onClick={() => showToast("Import feature coming soon")}
                  style={{
                    background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
                    border: "1px solid #2a2a2a", borderRadius: 8,
                    padding: "6px 14px", fontSize: 11, fontWeight: 600,
                    color: "#aaa", cursor: "pointer",
                  }}
                >
                  📥 Import
                </button>
              </div>
              <Divider />
              <div className="settings-field-row">
                <span style={{ fontSize: 13, color: "#c0c0c0" }}>Export Backup</span>
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url; a.download = `resume-settings-backup-${Date.now()}.json`; a.click();
                    URL.revokeObjectURL(url);
                    showToast("Backup exported");
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${PINK} 0%, ${PINK_DARK} 100%)`,
                    border: "none", borderRadius: 8,
                    padding: "6px 14px", fontSize: 11, fontWeight: 700,
                    color: "#000", cursor: "pointer",
                  }}
                >
                  📤 Export
                </button>
              </div>
              <Divider />
              <div className="settings-field-row">
                <span style={{ fontSize: 13, color: "#c0c0c0" }}>Restore Previous</span>
                <button
                  onClick={() => showToast("No previous version found")}
                  style={{
                    background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
                    border: "1px solid #2a2a2a", borderRadius: 8,
                    padding: "6px 14px", fontSize: 11, fontWeight: 600,
                    color: "#aaa", cursor: "pointer",
                  }}
                >
                  🔄 Restore
                </button>
              </div>
            </SectionCard>
          )}

          {activeCategory === "privacy" && (
            <SectionCard title="Privacy & Security" icon="🔒" chip="Protected">
              <Toggle label="Local Storage Only" checked={settings.localStorageOnly} onChange={upd("localStorageOnly")} tooltip="Keep all data on your device only" />
              <Divider />
              <Toggle label="Encrypt Resume Data" checked={settings.encryptData} onChange={upd("encryptData")} tooltip="Encrypt sensitive resume data at rest" />
              <Divider />
              <Toggle label="Password Protection" checked={settings.passwordProtection} onChange={upd("passwordProtection")} tooltip="Protect access with a password" />
              <Divider />
              <Toggle label="Analytics Opt-in" checked={settings.analyticsOptIn} onChange={upd("analyticsOptIn")} tooltip="Help improve the app with anonymous usage data" />
              <Divider />
              <Toggle label="Crash Report Sharing" checked={settings.crashReportSharing} onChange={upd("crashReportSharing")} tooltip="Automatically share crash reports" />
            </SectionCard>
          )}

          {activeCategory === "accessibility" && (
            <SectionCard title="Accessibility" icon="♿" chip="Inclusive">
              <Toggle label="High Contrast Mode" checked={settings.highContrast} onChange={upd("highContrast")} tooltip="Increases color contrast for better visibility" />
              <Divider />
              <Toggle label="Reduced Motion" checked={settings.reducedMotion} onChange={upd("reducedMotion")} tooltip="Minimizes animations and transitions" />
              <Divider />
              <Toggle label="Large Text Mode" checked={settings.largeText} onChange={upd("largeText")} tooltip="Increases default text size" />
              <Divider />
              <Toggle label="Screen Reader Optimization" checked={settings.screenReader} onChange={upd("screenReader")} tooltip="Optimizes content for screen readers" />
            </SectionCard>
          )}

          {activeCategory === "notifications" && (
            <SectionCard title="Notifications" icon="🔔" chip="Alerts">
              <Toggle label="Export Notifications" checked={settings.exportNotifications} onChange={upd("exportNotifications")} tooltip="Notify when exports complete" />
              <Divider />
              <Toggle label="ATS Improvement Alerts" checked={settings.atsAlerts} onChange={upd("atsAlerts")} tooltip="Get notified of ATS score improvements" />
              <Divider />
              <Toggle label="Update Notifications" checked={settings.updateNotifications} onChange={upd("updateNotifications")} />
              <Divider />
              <Toggle label="Resume Completion Reminders" checked={settings.completionReminders} onChange={upd("completionReminders")} tooltip="Remind to complete unfinished resumes" />
            </SectionCard>
          )}

          {activeCategory === "danger" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: "linear-gradient(145deg, rgba(239,68,68,0.06) 0%, rgba(239,68,68,0.02) 100%)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 20, padding: 24,
                boxShadow: "0 0 30px rgba(239,68,68,0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>⚠️</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#ef4444" }}>Danger Zone</span>
              </div>
              <p style={{ fontSize: 12, color: "#888", marginBottom: 20, lineHeight: 1.6 }}>
                These actions are irreversible. Please proceed with caution.
              </p>

              <div style={{
                background: "rgba(239,68,68,0.04)",
                border: "1px solid rgba(239,68,68,0.12)",
                borderRadius: 14, padding: 16, marginBottom: 12,
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#ef4444", marginBottom: 4 }}>Clear All Local Data</div>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 12 }}>
                  Removes all resumes, templates, and settings permanently.
                </div>
                <button
                  onClick={clearAllData}
                  style={{
                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    border: "none", borderRadius: 10,
                    padding: "10px 20px", fontSize: 12, fontWeight: 700,
                    color: "#fff", cursor: "pointer", width: "100%",
                  }}
                >
                  🗑️ Clear All Local Data
                </button>
              </div>

              <div style={{
                background: "rgba(239,68,68,0.04)",
                border: "1px solid rgba(239,68,68,0.12)",
                borderRadius: 14, padding: 16,
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#ef4444", marginBottom: 4 }}>Reset All Settings</div>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 12 }}>
                  Restore all settings to their default values.
                </div>
                <button
                  onClick={resetAllSettings}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: 10,
                    padding: "10px 20px", fontSize: 12, fontWeight: 700,
                    color: "#ef4444", cursor: "pointer", width: "100%",
                  }}
                >
                  🔄 Reset All Settings
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Save Button ── */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={saveSettings}
            style={{
              width: "100%",
              background: `linear-gradient(135deg, ${PINK} 0%, ${PINK_DARK} 100%)`,
              border: "none", borderRadius: 14,
              padding: "14px 24px", fontSize: 14, fontWeight: 800,
              color: "#000", cursor: "pointer",
              boxShadow: `0 4px 20px ${PINK_GLOW}`,
              marginTop: 8, marginBottom: 40,
              letterSpacing: "-0.3px",
            }}
          >
            {saved ? "✓ Saved!" : "💾 Save Settings"}
          </motion.button>
        </main>
      </div>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: "1px solid rgba(255,121,238,0.08)",
        padding: "48px 32px 0", marginTop: 0,
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 32, paddingBottom: 32,
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}>
            <div style={{ maxWidth: 300 }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                Resume Creator
              </h4>
              <p style={{ fontSize: 13, color: "#777", lineHeight: 1.7, marginBottom: 16 }}>
                Build professional resumes with ATS analysis, visual editor, and 100+ templates. All offline, all free.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <a href="https://vvraju.netlify.app/" target="_blank" rel="noopener noreferrer"
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#aaa", textDecoration: "none", fontSize: 14,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = PINK; e.currentTarget.style.color = PINK; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#aaa"; }}
                >
                  🌐
                </a>
                <a href="https://github.com/vvraju56" target="_blank" rel="noopener noreferrer"
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#aaa", textDecoration: "none", fontSize: 14,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = PINK; e.currentTarget.style.color = PINK; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#aaa"; }}
                >
                  💻
                </a>
                <a href="https://www.linkedin.com/in/vishnuraju-v-757b9929b" target="_blank" rel="noopener noreferrer"
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#aaa", textDecoration: "none", fontSize: 14,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = PINK; e.currentTarget.style.color = PINK; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#aaa"; }}
                >
                  🔗
                </a>
              </div>
            </div>
            {[
              { title: "Features", links: ["Resume Builder", "ATS Analyzer", "Visual Editor", "Templates", "PDF Export"] },
              { title: "Resources", links: ["Documentation", "Template Guide", "Resume Tips", "ATS Guide", "FAQ"] },
              { title: "Support", links: ["Contact Us", "Report Bug", "Feature Request", "Privacy Policy", "Terms of Service"] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 11, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                  {col.title}
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {col.links.map(link => (
                    <li key={link} style={{ marginBottom: 8 }}>
                      <a href="#" style={{
                        fontSize: 13, color: "#666", textDecoration: "none",
                        transition: "color 0.15s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.color = PINK; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#666"; }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ padding: "24px 0", textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "#555" }}>
              © {new Date().getFullYear()}{" "}
              <span style={{ color: PINK, fontWeight: 700 }}>Resume Creator</span>.
              All rights reserved. Made with{" "}
              <span style={{ color: "#ef4444" }}>♥</span> by{" "}
              <span style={{ color: PINK, fontWeight: 700 }}>VV</span>
            </p>
          </div>
        </div>
      </footer>

      {/* ── Toast ── */}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
