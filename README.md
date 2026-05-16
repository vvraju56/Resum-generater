# MD Dev Studio

> **Offline · AI-Free · Developer Platform**

A fully offline, production-ready developer assistant platform inspired by Windsurf, Warp and Replit — **but without any AI, cloud services, or API keys.**

Everything runs locally on your machine. Free forever.

---

## Screenshots

```
┌─────────────────────────────────────────────────────────┐
│  MD DEV STUDIO    ·  Offline · AI-Free · v1.0           │
├──────────┬──────────────────────────────────────────────┤
│ ⊞ Home   │                                              │
│ ⚡ Gen    │   ⚡ Project Generator                       │
│ 📄 Resume│                                              │
│ 🧬 Code  │   ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐  │
│ 🎨 Tmpl  │   │ ⚛️ React│ │▲ Next │ │🟢 API │ │🎨 Port│  │
│ 📝 Editor│   └───────┘ └───────┘ └───────┘ └───────┘  │
│ ⌨️ Term  │                                              │
│ ⚙️ Sett  │   Configure → Generate → Download ZIP        │
└──────────┴──────────────────────────────────────────────┘
```

---

## ✅ No AI Policy

| ❌ Never Used          | ✅ Always Used              |
|------------------------|------------------------------|
| OpenAI / ChatGPT       | Rule-based logic             |
| Anthropic / Claude     | Template engines             |
| Google Gemini          | Static file generation       |
| HuggingFace inference  | Deterministic text templates |
| Any ML model           | JSON config-driven system    |
| External API keys      | 100% local file system       |

---

## 🚀 Quick Start

### 1. Install

```bash
git clone https://github.com/your-username/md-dev-studio
cd md-dev-studio
npm install
cd dashboard && npm install
cd ../backend && npm install
```

### 2. Run

```bash
# From root — starts both dashboard and backend
npm run dev

# Dashboard → http://localhost:5173
# Backend   → http://localhost:3001
```

### 3. Use the CLI

```bash
# Make the CLI globally available
npm link

# Create projects from your terminal
mdstudio create react-app my-app
mdstudio create portfolio jane-portfolio
mdstudio create express-api task-manager
mdstudio list
mdstudio help
```

---

## 📁 Project Structure

```
md-dev-studio/
│
├── dashboard/                  # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx             # Main app with all pages
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── public/
│   │   └── favicon.svg
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                    # Node.js + Express API
│   ├── server.js               # Express server
│   ├── generators/
│   │   ├── projectGenerator.js # Project scaffolding engine
│   │   ├── resumeGenerator.js  # HTML resume generator (8 themes)
│   │   ├── codeGenerator.js    # Rule-based code generator (14 types)
│   │   └── summaryGenerator.js # Deterministic summary generator
│   ├── tests/
│   │   ├── generators.test.js  # Unit tests for all generators
│   │   └── api.test.js         # API integration tests
│   ├── jest.config.json
│   └── package.json
│
├── cli/                        # mdstudio CLI tool
│   ├── run.js                  # CLI entry point
│   ├── commands/
│   │   ├── create.js           # `mdstudio create` command
│   │   └── list.js             # `mdstudio list` command
│   └── package.json
│
├── templates/                  # Project template configs
│   ├── react-app/config.json
│   ├── nextjs-app/config.json
│   ├── express-api/config.json
│   ├── portfolio/config.json
│   ├── admin-dashboard/config.json
│   ├── landing-page/config.json
│   ├── blog/config.json
│   ├── docs-site/config.json
│   ├── resume-builder/config.json
│   └── tailwind-website/config.json
│
├── shared/
│   └── constants.js            # Shared constants (project types, themes, etc.)
│
├── projects/                   # Generated projects land here (auto-created)
│
├── package.json                # Root workspace
└── README.md
```

---

## 🔧 How the Generators Work

### Project Generator

The project generator uses **JSON template configs + static file templates** with variable replacement:

```
User picks type → Collects config → Selects file templates →
Replaces {{PLACEHOLDERS}} → Writes files to disk → Returns ZIP
```

Variables replaced: `{{PROJECT_NAME}}`, `{{DISPLAY_NAME}}`, `{{DESCRIPTION}}`,
`{{AUTHOR}}`, `{{YEAR}}`, `{{ACCENT_COLOR}}`, `{{FONT}}`, `{{PORT}}`

### Template Config Format

```json
{
  "name": "My Template",
  "type": "react-app",
  "layout": "single-page",
  "font": "Inter",
  "accent": "#ff79ee",
  "darkMode": true,
  "features": ["React 18", "Vite", "Tailwind CSS"],
  "stack": ["React", "Vite", "Tailwind CSS"],
  "commands": {
    "install": "npm install",
    "dev": "npm run dev",
    "build": "npm run build"
  }
}
```

### Summary Generator

The summary generator is **fully deterministic** — no AI, no random output:

```
Input: { name, title, skills, experience, education, projects }
   ↓
Detect level (fresher / junior / senior) based on experience years
   ↓
Pick template from SUMMARY_TEMPLATES[level]
   ↓
Replace {NAME}, {TITLE}, {TOP_SKILLS}, {EDUCATION}, {EXP_YEARS}, etc.
   ↓
Output: Professional summary string
```

### Code Generator

14 code generators, all rule-based:

| Type | Output |
|------|--------|
| `react-component` | Full React functional component with optional state/props |
| `express-route` | Express router with all REST methods |
| `crud-api` | Full CRUD controller with pagination and search |
| `form` | React form with validation and API submission |
| `tailwind-layout` | Sidebar or two-column Tailwind layout |
| `navbar` | Responsive sticky navbar with mobile menu |
| `footer` | Multi-column footer with links |
| `auth-page` | Login or Register page with validation |
| `modal` | Accessible modal with backdrop |
| `table` | Sortable, searchable, paginated data table |
| `card-grid` | Responsive card grid |
| `hero-section` | Full-page hero with CTA buttons |
| `api-client` | Type-safe fetch wrapper with resource factory |
| `custom-hook` | Data-fetching hook with loading/error/refetch |

### Resume Generator

Generates complete HTML resumes from structured data:

```
Resume data (JSON) → Theme selection → Layout choice →
HTML template assembly → CSS injection → Complete HTML document
```

**8 Themes:** Modern Dark, Classic Light, Minimal, Dark Code, Purple, Green, Ocean, Sunset

**2 Layouts:** Single Column, Two Column (with sidebar)

**PDF Export:** Uses `window.print()` (iframe) — works in any browser offline.

---

## 🌐 API Reference

All endpoints run at `http://localhost:3001`

### Project Generation

```http
POST /api/generate/project
Content-Type: application/json

{
  "type": "react-app",
  "config": {
    "name": "my-app",
    "displayName": "My App",
    "description": "A great app",
    "author": "Jane Doe",
    "accentColor": "#ff79ee",
    "font": "Inter"
  }
}
```

Response:
```json
{
  "success": true,
  "projectName": "my-app",
  "projectPath": "/path/to/projects/my-app",
  "fileCount": 14,
  "type": "react-app",
  "installCmd": "cd my-app && npm install",
  "devCmd": "npm run dev"
}
```

### Resume Generation

```http
POST /api/generate/resume
Content-Type: application/json

{
  "name": "Jane Doe",
  "title": "Software Developer",
  "theme": "modern",
  "layout": "two-column",
  "skills": ["React", "Node.js"],
  "experience": [...],
  "education": [...],
  "projects": [...]
}
```

### Summary Generation

```http
POST /api/generate/summary
Content-Type: application/json

{
  "name": "Jane Doe",
  "title": "Developer",
  "skills": ["React", "Node.js"],
  "experience": [],
  "education": [...]
}
```

### Code Generation

```http
POST /api/generate/code
Content-Type: application/json

{
  "type": "react-component",
  "options": {
    "name": "MyButton",
    "hasState": true,
    "hasProps": true
  }
}
```

### Other Endpoints

```http
GET  /api/health              # Health check
GET  /api/projects            # List generated projects
GET  /api/projects/:name/download  # Download project as ZIP
DELETE /api/projects/:name    # Delete a project
GET  /api/templates           # List available templates
GET  /api/files?path=...      # Browse project files
GET  /api/files/read?path=... # Read file content
POST /api/files/write         # Write file content
```

---

## 🖥️ CLI Reference

```bash
mdstudio create <type> [name]   # Create a new project
mdstudio list                   # List all project types
mdstudio help                   # Show help
mdstudio version                # Show version
```

### Supported Types

```
react-app          React + Vite + Tailwind starter
nextjs-app         Next.js 14 with App Router
express-api        Express REST API with CRUD
portfolio          Personal portfolio website
admin-dashboard    Admin panel with charts
landing-page       Static HTML landing page
blog               Blog with markdown posts
docs-site          Documentation website
resume-builder     Resume builder app
tailwind-website   Tailwind CSS website
```

---

## 🧪 Running Tests

```bash
cd backend
npm test

# With coverage
npm test -- --coverage
```

Tests cover:
- Summary generator (fresher / junior / senior detection, skill bullets, project descriptions)
- Code generator (all 14 types, validation, edge cases)
- Resume generator (all 8 themes, both layouts, XSS escaping, empty fields)
- API endpoints (health, summary, code, resume, templates, projects)

---

## 🚀 Deployment

### Localhost (default)
```bash
npm run dev
```

### Vercel (dashboard only)
```bash
cd dashboard
npm run build
vercel deploy dist/
```

### Netlify (dashboard only)
```bash
cd dashboard
npm run build
# Drag dist/ to Netlify dashboard, or:
netlify deploy --prod --dir=dist
```

### Replit
1. Import the repo into Replit
2. Set run command to: `npm run dev`
3. Replit will expose ports automatically

---

## 🔌 Plugin System

Extend MD Dev Studio by adding new generators:

1. Add a function to `backend/generators/codeGenerator.js`
2. Register it in the `GENERATORS` map
3. Add its metadata to `shared/constants.js` in `CODE_TYPES`
4. It appears automatically in the Code Gen UI

---

## 📦 Storage

All data is stored locally:

| Data | Storage |
|------|---------|
| Resume drafts | `localStorage` (`mdds_resume`) |
| Generated projects list | `localStorage` (`mdds_projects`) |
| Editor files | `localStorage` (`mdds_editor_files`) |
| App settings | `localStorage` (`mdds_settings`) |
| Current page | `localStorage` (`mdds_page`) |
| Generated project files | File system (`/projects/`) |

---

## 💻 Tech Stack

**Frontend:** React 18 · Vite 5 · CSS-in-JS (inline styles)
**Backend:** Node.js · Express 4 · fs-extra · JSZip
**CLI:** Node.js · readline (built-in)
**Testing:** Jest · Supertest
**Storage:** localStorage · File system

---

## 📄 License

MIT — Use freely, modify freely, ship freely.

---

Built with ❤️ by **MD Dev Studio**  
*Offline · AI-Free · Free Forever*
