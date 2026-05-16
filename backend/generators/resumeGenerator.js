const RESUME_THEMES = {
  modern: { bg: '#0f0f0f', surface: '#1a1a1a', accent: '#ff79ee', text: '#f1f1f1', muted: '#888', border: '#2a2a2a', font: 'Inter' },
  classic: { bg: '#ffffff', surface: '#f8f8f8', accent: '#2563eb', text: '#1a1a1a', muted: '#666', border: '#e5e5e5', font: 'Georgia' },
  minimal: { bg: '#fafafa', surface: '#ffffff', accent: '#000000', text: '#111', muted: '#555', border: '#ddd', font: 'Helvetica Neue' },
  dark: { bg: '#0d1117', surface: '#161b22', accent: '#58a6ff', text: '#e6edf3', muted: '#8b949e', border: '#30363d', font: 'Fira Code' },
  purple: { bg: '#0a0010', surface: '#130020', accent: '#c084fc', text: '#f3e8ff', muted: '#a78bfa', border: '#2d1457', font: 'Inter' },
  green: { bg: '#0a0f0a', surface: '#0f1a0f', accent: '#4ade80', text: '#f0fdf4', muted: '#86efac', border: '#14532d', font: 'JetBrains Mono' },
  ocean: { bg: '#0c1929', surface: '#132337', accent: '#38bdf8', text: '#e0f2fe', muted: '#7dd3fc', border: '#1e3a5f', font: 'Inter' },
  sunset: { bg: '#1a0a00', surface: '#2a1200', accent: '#fb923c', text: '#fff7ed', muted: '#fdba74', border: '#431407', font: 'Inter' },
};

function generateResume(data) {
  const theme = RESUME_THEMES[data.theme || 'modern'];
  const layout = data.layout || 'single';
  return layout === 'two-column' ? twoColumnResume(data, theme) : singleColumnResume(data, theme);
}

function singleColumnResume(data, theme) {
  const { name, title, summary, phone, email, address, linkedin, github, skills = [], experience = [], education = [], projects = [] } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escH(name)} - Resume</title>
<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(theme.font)}:wght@400;500;600;700;900&display=swap" rel="stylesheet"/>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: '${theme.font}', sans-serif; background: ${theme.bg}; color: ${theme.text}; line-height: 1.6; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .resume { max-width: 860px; margin: 0 auto; background: ${theme.surface}; min-height: 100vh; }
  .header { padding: 3rem; background: ${theme.bg}; border-bottom: 2px solid ${theme.accent}; }
  .header h1 { font-size: 2.8rem; font-weight: 900; letter-spacing: -0.02em; color: ${theme.text}; margin-bottom: 0.25rem; }
  .header .title { font-size: 1.1rem; color: ${theme.accent}; font-weight: 600; margin-bottom: 1.5rem; }
  .contacts { display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.85rem; color: ${theme.muted}; }
  .contacts a { color: ${theme.accent}; text-decoration: none; }
  .contacts span::before { content: '· '; }
  .contacts span:first-child::before { content: ''; }
  .body { padding: 2.5rem 3rem; }
  .section { margin-bottom: 2.5rem; }
  .section-title { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: ${theme.accent}; padding-bottom: 0.5rem; border-bottom: 1px solid ${theme.border}; margin-bottom: 1.25rem; }
  .summary p { color: ${theme.muted}; font-size: 0.95rem; line-height: 1.8; }
  .exp-item, .edu-item, .proj-item { margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid ${theme.border}; }
  .exp-item:last-child, .edu-item:last-child, .proj-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .item-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.25rem; }
  .item-title { font-weight: 700; font-size: 1rem; color: ${theme.text}; }
  .item-subtitle { color: ${theme.accent}; font-size: 0.875rem; font-weight: 500; }
  .item-date { font-size: 0.8rem; color: ${theme.muted}; white-space: nowrap; margin-left: 1rem; }
  .item-desc { font-size: 0.875rem; color: ${theme.muted}; margin-top: 0.5rem; line-height: 1.7; }
  .item-bullets { list-style: none; margin-top: 0.5rem; }
  .item-bullets li { font-size: 0.875rem; color: ${theme.muted}; padding-left: 1.25rem; position: relative; margin-bottom: 0.25rem; line-height: 1.6; }
  .item-bullets li::before { content: '▸'; color: ${theme.accent}; position: absolute; left: 0; font-size: 0.75rem; top: 0.15rem; }
  .skills-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .skill-tag { background: ${theme.bg}; border: 1px solid ${theme.border}; color: ${theme.text}; font-size: 0.8rem; padding: 0.3rem 0.75rem; border-radius: 9999px; }
  .proj-link { font-size: 0.8rem; color: ${theme.accent}; text-decoration: none; }
  .badge { display: inline-block; background: ${theme.accent}20; color: ${theme.accent}; font-size: 0.7rem; padding: 0.15rem 0.5rem; border-radius: 4px; margin-left: 0.5rem; font-weight: 600; }
  @media print { body { background: white; } .resume { box-shadow: none; } }
</style>
</head>
<body>
<div class="resume">
  <header class="header">
    <h1>${escH(name)}</h1>
    <div class="title">${escH(title || 'Software Developer')}</div>
    <div class="contacts">
      ${phone ? `<span>${escH(phone)}</span>` : ''}
      ${email ? `<span><a href="mailto:${escH(email)}">${escH(email)}</a></span>` : ''}
      ${address ? `<span>${escH(address)}</span>` : ''}
      ${linkedin ? `<span><a href="${escH(linkedin)}" target="_blank">LinkedIn</a></span>` : ''}
      ${github ? `<span><a href="${escH(github)}" target="_blank">GitHub</a></span>` : ''}
    </div>
  </header>
  <div class="body">
    ${summary ? `<section class="section summary"><h2 class="section-title">Summary</h2><p>${escH(summary)}</p></section>` : ''}
    ${skills.length > 0 ? `<section class="section"><h2 class="section-title">Skills</h2><div class="skills-grid">${skills.map(s => `<span class="skill-tag">${escH(s)}</span>`).join('')}</div></section>` : ''}
    ${experience.length > 0 ? `<section class="section"><h2 class="section-title">Experience</h2>${experience.map(exp => `
      <div class="exp-item">
        <div class="item-header">
          <div>
            <div class="item-title">${escH(exp.role || exp.title)}</div>
            <div class="item-subtitle">${escH(exp.company)}</div>
          </div>
          <div class="item-date">${escH(exp.period || exp.date || '')}</div>
        </div>
        ${exp.description ? `<p class="item-desc">${escH(exp.description)}</p>` : ''}
        ${exp.bullets && exp.bullets.length > 0 ? `<ul class="item-bullets">${exp.bullets.map(b => `<li>${escH(b)}</li>`).join('')}</ul>` : ''}
      </div>`).join('')}</section>` : ''}
    ${education.length > 0 ? `<section class="section"><h2 class="section-title">Education</h2>${education.map(edu => `
      <div class="edu-item">
        <div class="item-header">
          <div>
            <div class="item-title">${escH(edu.degree || edu.standard)}</div>
            <div class="item-subtitle">${escH(edu.college || edu.school)}</div>
          </div>
          <div class="item-date">${escH(edu.year || '')}</div>
        </div>
        ${edu.percentage ? `<p class="item-desc">Score / Percentage: <strong>${escH(edu.percentage)}</strong></p>` : ''}
      </div>`).join('')}</section>` : ''}
    ${projects.length > 0 ? `<section class="section"><h2 class="section-title">Projects</h2>${projects.map(proj => `
      <div class="proj-item">
        <div class="item-header">
          <div>
            <div class="item-title">${escH(proj.name)} ${proj.tech ? `<span class="badge">${escH(proj.tech)}</span>` : ''}</div>
            ${proj.location ? `<div class="item-subtitle">${escH(proj.location)}</div>` : ''}
          </div>
          ${proj.link ? `<a href="${escH(proj.link)}" class="proj-link" target="_blank">View →</a>` : ''}
        </div>
        ${proj.description ? `<p class="item-desc">${escH(proj.description)}</p>` : ''}
      </div>`).join('')}</section>` : ''}
  </div>
</div>
</body>
</html>`;
}

function twoColumnResume(data, theme) {
  const { name, title, summary, phone, email, address, linkedin, github, skills = [], experience = [], education = [], projects = [] } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${escH(name)} - Resume</title>
<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(theme.font)}:wght@400;500;600;700;900&display=swap" rel="stylesheet"/>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: '${theme.font}', sans-serif; background: ${theme.bg}; color: ${theme.text}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .resume { display: grid; grid-template-columns: 280px 1fr; min-height: 100vh; max-width: 1000px; margin: 0 auto; background: ${theme.surface}; }
  .sidebar { background: ${theme.bg}; padding: 2.5rem 1.75rem; border-right: 1px solid ${theme.border}; }
  .main { padding: 2.5rem; }
  .avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, ${theme.accent}, ${theme.accent}66); display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 900; color: ${theme.bg}; margin-bottom: 1.25rem; }
  .sidebar h1 { font-size: 1.5rem; font-weight: 900; color: ${theme.text}; margin-bottom: 0.25rem; line-height: 1.2; }
  .sidebar .title { color: ${theme.accent}; font-size: 0.875rem; font-weight: 600; margin-bottom: 2rem; }
  .side-section { margin-bottom: 2rem; }
  .side-title { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: ${theme.accent}; padding-bottom: 0.4rem; border-bottom: 1px solid ${theme.border}; margin-bottom: 0.85rem; }
  .contact-item { display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.8rem; color: ${theme.muted}; margin-bottom: 0.5rem; word-break: break-all; }
  .contact-item a { color: ${theme.accent}; text-decoration: none; }
  .skill-tag { display: inline-block; background: ${theme.surface}; border: 1px solid ${theme.border}; color: ${theme.text}; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 9999px; margin: 0.2rem; }
  .section-title { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: ${theme.accent}; padding-bottom: 0.5rem; border-bottom: 1px solid ${theme.border}; margin-bottom: 1.25rem; }
  .main-section { margin-bottom: 2.25rem; }
  .exp-item { margin-bottom: 1.35rem; padding-bottom: 1.35rem; border-bottom: 1px solid ${theme.border}; }
  .exp-item:last-child { border-bottom: none; }
  .item-header { display: flex; justify-content: space-between; align-items: flex-start; }
  .item-title { font-weight: 700; font-size: 0.95rem; }
  .item-sub { color: ${theme.accent}; font-size: 0.8rem; margin-top: 0.1rem; }
  .item-date { font-size: 0.75rem; color: ${theme.muted}; white-space: nowrap; }
  .item-desc { font-size: 0.825rem; color: ${theme.muted}; margin-top: 0.4rem; line-height: 1.65; }
  .bullets { list-style: none; margin-top: 0.4rem; }
  .bullets li { font-size: 0.825rem; color: ${theme.muted}; padding-left: 1rem; position: relative; margin-bottom: 0.2rem; }
  .bullets li::before { content: '▸'; color: ${theme.accent}; position: absolute; left: 0; font-size: 0.7rem; top: 0.15rem; }
  .badge { background: ${theme.accent}22; color: ${theme.accent}; font-size: 0.65rem; padding: 0.1rem 0.4rem; border-radius: 3px; font-weight: 600; margin-left: 0.4rem; }
</style>
</head>
<body>
<div class="resume">
  <aside class="sidebar">
    <div class="avatar">${escH(name).charAt(0).toUpperCase()}</div>
    <h1>${escH(name)}</h1>
    <div class="title">${escH(title || 'Software Developer')}</div>
    ${(phone || email || address || linkedin || github) ? `
    <div class="side-section">
      <div class="side-title">Contact</div>
      ${phone ? `<div class="contact-item"><span>📞</span><span>${escH(phone)}</span></div>` : ''}
      ${email ? `<div class="contact-item"><span>✉️</span><a href="mailto:${escH(email)}">${escH(email)}</a></div>` : ''}
      ${address ? `<div class="contact-item"><span>📍</span><span>${escH(address)}</span></div>` : ''}
      ${linkedin ? `<div class="contact-item"><span>in</span><a href="${escH(linkedin)}" target="_blank">LinkedIn</a></div>` : ''}
      ${github ? `<div class="contact-item"><span>⌥</span><a href="${escH(github)}" target="_blank">GitHub</a></div>` : ''}
    </div>` : ''}
    ${skills.length > 0 ? `
    <div class="side-section">
      <div class="side-title">Skills</div>
      <div>${skills.map(s => `<span class="skill-tag">${escH(s)}</span>`).join('')}</div>
    </div>` : ''}
    ${education.length > 0 ? `
    <div class="side-section">
      <div class="side-title">Education</div>
      ${education.map(edu => `
        <div style="margin-bottom:1rem;">
          <div style="font-weight:700;font-size:0.85rem;">${escH(edu.degree || edu.standard)}</div>
          <div style="color:${theme.accent};font-size:0.78rem;">${escH(edu.college || edu.school)}</div>
          ${edu.year ? `<div style="color:${theme.muted};font-size:0.75rem;">${escH(edu.year)}</div>` : ''}
          ${edu.percentage ? `<div style="color:${theme.muted};font-size:0.75rem;">${escH(edu.percentage)}</div>` : ''}
        </div>`).join('')}
    </div>` : ''}
  </aside>
  <main class="main">
    ${summary ? `<div class="main-section"><h2 class="section-title">Summary</h2><p style="font-size:0.9rem;color:${theme.muted};line-height:1.8;">${escH(summary)}</p></div>` : ''}
    ${experience.length > 0 ? `
    <div class="main-section">
      <h2 class="section-title">Experience</h2>
      ${experience.map(exp => `
        <div class="exp-item">
          <div class="item-header">
            <div><div class="item-title">${escH(exp.role || exp.title)}</div><div class="item-sub">${escH(exp.company)}</div></div>
            <div class="item-date">${escH(exp.period || exp.date || '')}</div>
          </div>
          ${exp.description ? `<p class="item-desc">${escH(exp.description)}</p>` : ''}
          ${exp.bullets && exp.bullets.length ? `<ul class="bullets">${exp.bullets.map(b => `<li>${escH(b)}</li>`).join('')}</ul>` : ''}
        </div>`).join('')}
    </div>` : ''}
    ${projects.length > 0 ? `
    <div class="main-section">
      <h2 class="section-title">Projects</h2>
      ${projects.map(proj => `
        <div class="exp-item">
          <div class="item-header">
            <div>
              <div class="item-title">${escH(proj.name)}${proj.tech ? `<span class="badge">${escH(proj.tech)}</span>` : ''}</div>
              ${proj.location ? `<div class="item-sub">${escH(proj.location)}</div>` : ''}
            </div>
            ${proj.link ? `<a href="${escH(proj.link)}" style="font-size:0.78rem;color:${theme.accent};text-decoration:none;" target="_blank">View →</a>` : ''}
          </div>
          ${proj.description ? `<p class="item-desc">${escH(proj.description)}</p>` : ''}
        </div>`).join('')}
    </div>` : ''}
  </main>
</div>
</body>
</html>`;
}

function escH(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const RESUME_THEMES_LIST = Object.entries(RESUME_THEMES).map(([id, t]) => ({ id, ...t }));

module.exports = { generateResume, RESUME_THEMES, RESUME_THEMES_LIST };
