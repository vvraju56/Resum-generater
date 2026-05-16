/**
 * MD Dev Studio — Shared Constants
 * Used by dashboard, backend, and CLI.
 */

const PROJECT_TYPES = [
  {
    id: 'react-app',
    label: 'React App',
    icon: '⚛️',
    description: 'React 18 + Vite + Tailwind CSS + React Router',
    color: '#61dafb',
    category: 'frontend',
    entryCommand: 'npm run dev',
    buildCommand: 'npm run build',
    runtime: 'browser',
  },
  {
    id: 'nextjs-app',
    label: 'Next.js App',
    icon: '▲',
    description: 'Next.js 14 with App Router and Tailwind CSS',
    color: '#ffffff',
    category: 'fullstack',
    entryCommand: 'npm run dev',
    buildCommand: 'npm run build',
    runtime: 'node',
  },
  {
    id: 'express-api',
    label: 'Express REST API',
    icon: '🟢',
    description: 'Node.js REST API with CRUD, controller pattern and error handling',
    color: '#68d391',
    category: 'backend',
    entryCommand: 'npm run dev',
    buildCommand: null,
    runtime: 'node',
  },
  {
    id: 'portfolio',
    label: 'Portfolio Website',
    icon: '🎨',
    description: 'Personal portfolio with hero, projects, skills and contact',
    color: '#f6ad55',
    category: 'frontend',
    entryCommand: 'npm run dev',
    buildCommand: 'npm run build',
    runtime: 'browser',
  },
  {
    id: 'admin-dashboard',
    label: 'Admin Dashboard',
    icon: '📊',
    description: 'Full admin panel with sidebar, stats cards and user management',
    color: '#a78bfa',
    category: 'frontend',
    entryCommand: 'npm run dev',
    buildCommand: 'npm run build',
    runtime: 'browser',
  },
  {
    id: 'landing-page',
    label: 'Landing Page',
    icon: '🚀',
    description: 'Static HTML landing page — zero dependencies, open instantly',
    color: '#ff79ee',
    category: 'static',
    entryCommand: 'open index.html',
    buildCommand: null,
    runtime: 'browser',
  },
  {
    id: 'blog',
    label: 'Blog Template',
    icon: '📝',
    description: 'React blog with post listing, detail pages and tag filtering',
    color: '#f59e0b',
    category: 'frontend',
    entryCommand: 'npm run dev',
    buildCommand: 'npm run build',
    runtime: 'browser',
  },
  {
    id: 'docs-site',
    label: 'Documentation Site',
    icon: '📚',
    description: 'Docs site with sidebar navigation, search and markdown rendering',
    color: '#60a5fa',
    category: 'frontend',
    entryCommand: 'npm run dev',
    buildCommand: 'npm run build',
    runtime: 'browser',
  },
  {
    id: 'resume-builder',
    label: 'Resume Builder App',
    icon: '📄',
    description: 'Full resume builder with 8 themes, live preview and PDF export',
    color: '#f87171',
    category: 'frontend',
    entryCommand: 'npm run dev',
    buildCommand: 'npm run build',
    runtime: 'browser',
  },
  {
    id: 'tailwind-website',
    label: 'Tailwind Website',
    icon: '💨',
    description: 'Static multi-section website built with Tailwind CSS and PostCSS',
    color: '#38bdf8',
    category: 'static',
    entryCommand: 'npx tailwindcss --watch',
    buildCommand: 'npx tailwindcss --minify',
    runtime: 'browser',
  },
];

const CODE_TYPES = [
  { id: 'react-component', label: 'React Component', category: 'frontend' },
  { id: 'express-route', label: 'Express Route', category: 'backend' },
  { id: 'crud-api', label: 'CRUD Controller', category: 'backend' },
  { id: 'form', label: 'Form Component', category: 'frontend' },
  { id: 'tailwind-layout', label: 'Tailwind Layout', category: 'frontend' },
  { id: 'navbar', label: 'Navbar', category: 'frontend' },
  { id: 'footer', label: 'Footer', category: 'frontend' },
  { id: 'auth-page', label: 'Auth Page', category: 'frontend' },
  { id: 'modal', label: 'Modal', category: 'frontend' },
  { id: 'table', label: 'Data Table', category: 'frontend' },
  { id: 'card-grid', label: 'Card Grid', category: 'frontend' },
  { id: 'sidebar', label: 'Sidebar', category: 'frontend' },
  { id: 'hero-section', label: 'Hero Section', category: 'frontend' },
  { id: 'api-client', label: 'API Client', category: 'utility' },
  { id: 'custom-hook', label: 'Custom Hook', category: 'utility' },
];

const RESUME_THEMES = [
  { id: 'modern', label: 'Modern Dark', accent: '#ff79ee', dark: true },
  { id: 'classic', label: 'Classic Light', accent: '#2563eb', dark: false },
  { id: 'minimal', label: 'Minimal', accent: '#000000', dark: false },
  { id: 'dark', label: 'Dark Code', accent: '#58a6ff', dark: true },
  { id: 'purple', label: 'Purple', accent: '#c084fc', dark: true },
  { id: 'green', label: 'Matrix Green', accent: '#4ade80', dark: true },
  { id: 'ocean', label: 'Ocean', accent: '#38bdf8', dark: true },
  { id: 'sunset', label: 'Sunset', accent: '#fb923c', dark: true },
];

const RESUME_LAYOUTS = [
  { id: 'single', label: 'Single Column' },
  { id: 'two-column', label: 'Two Column' },
];

const FONTS = [
  'Inter', 'Roboto', 'Poppins', 'DM Sans', 'Plus Jakarta Sans',
  'Lato', 'Nunito', 'Raleway', 'Montserrat', 'Open Sans',
  'Georgia', 'Merriweather', 'Playfair Display',
  'JetBrains Mono', 'Fira Code', 'Source Code Pro', 'Inconsolata',
];

const ACCENT_COLORS = [
  '#ff79ee', '#60a5fa', '#4ade80', '#f59e0b', '#a78bfa',
  '#f87171', '#38bdf8', '#fb923c', '#2dd4bf', '#e879f9',
];

const SKILLS_SUGGESTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte',
  'Node.js', 'Express', 'Fastify', 'NestJS', 'Python', 'Django', 'FastAPI', 'Flask',
  'Java', 'Spring Boot', 'Go', 'Rust', 'C++', 'C#', '.NET',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Firebase',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Vercel', 'Netlify',
  'Git', 'GitHub', 'GitLab', 'CI/CD', 'GitHub Actions', 'Jenkins',
  'GraphQL', 'REST APIs', 'WebSockets', 'gRPC', 'tRPC',
  'Tailwind CSS', 'SASS/SCSS', 'CSS Modules', 'Styled Components',
  'Jest', 'Vitest', 'Cypress', 'Playwright', 'React Testing Library',
  'Figma', 'Adobe XD', 'Storybook', 'Electron', 'React Native',
  'Linux', 'Bash', 'Terraform', 'Ansible', 'Nginx',
];

const BACKEND_URL_DEFAULT = 'http://localhost:3001';
const DASHBOARD_PORT = 5173;
const BACKEND_PORT = 3001;

const VERSION = '1.0.0';
const PLATFORM_NAME = 'MD Dev Studio';
const PLATFORM_TAGLINE = 'Offline · AI-Free · Developer Platform';

// Export for Node.js (backend / CLI)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PROJECT_TYPES,
    CODE_TYPES,
    RESUME_THEMES,
    RESUME_LAYOUTS,
    FONTS,
    ACCENT_COLORS,
    SKILLS_SUGGESTIONS,
    BACKEND_URL_DEFAULT,
    DASHBOARD_PORT,
    BACKEND_PORT,
    VERSION,
    PLATFORM_NAME,
    PLATFORM_TAGLINE,
  };
}
