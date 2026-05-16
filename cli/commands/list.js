const COLORS = {
  reset: '\x1b[0m', bright: '\x1b[1m', cyan: '\x1b[36m',
  green: '\x1b[32m', yellow: '\x1b[33m', gray: '\x1b[90m', magenta: '\x1b[35m',
};
const c = (color, text) => `${COLORS[color]}${text}${COLORS.reset}`;

const TYPES = [
  { type: 'react-app', label: 'React App', desc: 'React + Vite + Tailwind starter with routing', stack: 'React · Vite · Tailwind · React Router' },
  { type: 'nextjs-app', label: 'Next.js App', desc: 'Full-stack Next.js 14 with App Router', stack: 'Next.js · React · Tailwind' },
  { type: 'express-api', label: 'Express REST API', desc: 'Express API with CRUD, routes & controllers', stack: 'Node.js · Express · CORS · Morgan' },
  { type: 'portfolio', label: 'Portfolio Website', desc: 'Personal portfolio with hero, projects & contact', stack: 'React · Tailwind · Framer Motion' },
  { type: 'admin-dashboard', label: 'Admin Dashboard', desc: 'Full admin panel with sidebar, tables & stats', stack: 'React · Tailwind · Recharts' },
  { type: 'landing-page', label: 'Landing Page', desc: 'Static HTML landing page with features grid', stack: 'HTML · CSS · No dependencies' },
  { type: 'blog', label: 'Blog Template', desc: 'Blog with post listing, detail pages & tags', stack: 'React · Tailwind · React Router' },
  { type: 'docs-site', label: 'Documentation Site', desc: 'Docs site with sidebar navigation & search', stack: 'React · Tailwind · React Markdown' },
  { type: 'resume-builder', label: 'Resume Builder App', desc: 'Resume builder with PDF export', stack: 'React · Tailwind · jsPDF · html2canvas' },
  { type: 'tailwind-website', label: 'Tailwind Website', desc: 'Multi-section website with Tailwind CSS', stack: 'HTML · Tailwind CSS · PostCSS' },
];

async function list() {
  console.log('');
  console.log(c('magenta', '  ◆ Available Project Templates'));
  console.log('');

  TYPES.forEach(({ type, label, desc, stack }, i) => {
    const num = c('gray', String(i + 1).padStart(2) + '.');
    const cmd = c('cyan', `mdstudio create ${type}`);
    console.log(`  ${num} ${c('bright', label)}`);
    console.log(`     ${c('gray', desc)}`);
    console.log(`     ${c('yellow', 'Stack:')} ${c('gray', stack)}`);
    console.log(`     ${c('green', cmd)}`);
    console.log('');
  });
}

module.exports = list;
