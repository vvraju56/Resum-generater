// Rule-based code generator — deterministic, no AI

const GENERATORS = {
  'react-component': generateReactComponent,
  'express-route': generateExpressRoute,
  'crud-api': generateCrudApi,
  'form': generateForm,
  'tailwind-layout': generateTailwindLayout,
  'navbar': generateNavbar,
  'footer': generateFooter,
  'auth-page': generateAuthPage,
  'modal': generateModal,
  'table': generateTable,
  'card-grid': generateCardGrid,
  'sidebar': generateSidebar,
  'hero-section': generateHeroSection,
  'api-client': generateApiClient,
  'custom-hook': generateCustomHook,
};

function generateCode(type, options = {}) {
  const generator = GENERATORS[type];
  if (!generator) throw new Error(`Unknown code type: ${type}`);
  return generator(options);
}

function generateReactComponent({ name = 'MyComponent', hasState = true, hasProps = true, styling = 'tailwind' } = {}) {
  const propsStr = hasProps ? `{ title = '${name}', children }` : '()';
  const stateStr = hasState ? `  const [isActive, setIsActive] = useState(false);\n` : '';
  const stateImport = hasState ? ', useState' : '';

  return `import React${stateImport} from 'react';

interface ${name}Props {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function ${name}(${propsStr}: ${name}Props) {
${stateStr}
  const handleClick = () => {
${hasState ? '    setIsActive(prev => !prev);\n' : '    // handle action\n'}  };

  return (
    <div className="relative flex flex-col gap-4 p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-gray-600 transition-all duration-200">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <button
          onClick={handleClick}
          className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-400 text-white text-sm font-medium transition-colors"
        >
${hasState ? '          {isActive ? \'Active\' : \'Inactive\'}' : "          Action"}
        </button>
      </div>
${hasState ? '      {isActive && (\n        <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-300 text-sm">\n          Component is now active!\n        </div>\n      )}\n' : ''}      {children && (
        <div className="text-gray-400 text-sm leading-relaxed">{children}</div>
      )}
    </div>
  );
}
`;
}

function generateExpressRoute({ resource = 'item', auth = false } = {}) {
  const R = resource.charAt(0).toUpperCase() + resource.slice(1);
  const authMiddleware = auth ? `\nconst { authenticate } = require('../middleware/auth');\n` : '';
  const authUse = auth ? 'authenticate, ' : '';

  return `const { Router } = require('express');
const controller = require('../controllers/${resource}Controller');${authMiddleware}

const router = Router();

// GET /${resource}s — list all
router.get('/', ${authUse}controller.getAll);

// GET /${resource}s/:id — get one
router.get('/:id', ${authUse}controller.getOne);

// POST /${resource}s — create
router.post('/', ${authUse}controller.create);

// PUT /${resource}s/:id — update
router.put('/:id', ${authUse}controller.update);

// PATCH /${resource}s/:id — partial update
router.patch('/:id', ${authUse}controller.partialUpdate);

// DELETE /${resource}s/:id — delete
router.delete('/:id', ${authUse}controller.remove);

module.exports = router;
`;
}

function generateCrudApi({ resource = 'item', storage = 'memory' } = {}) {
  const R = resource.charAt(0).toUpperCase() + resource.slice(1);

  return `// ${R} Controller — CRUD operations
// Storage: ${storage === 'memory' ? 'in-memory array (replace with DB in production)' : 'database'}

let ${resource}s = [
  { id: 1, name: 'Sample ${R}', description: 'First ${resource}', createdAt: new Date().toISOString() },
];
let nextId = 2;

// GET /api/${resource}s
exports.getAll = (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  let data = [...${resource}s];
  
  if (search) {
    const q = search.toLowerCase();
    data = data.filter(item => 
      item.name?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
  }
  
  const start = (parseInt(page) - 1) * parseInt(limit);
  const paginated = data.slice(start, start + parseInt(limit));
  
  res.json({
    success: true,
    data: paginated,
    total: data.length,
    page: parseInt(page),
    limit: parseInt(limit),
    pages: Math.ceil(data.length / parseInt(limit)),
  });
};

// GET /api/${resource}s/:id
exports.getOne = (req, res) => {
  const item = ${resource}s.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ success: false, error: '${R} not found' });
  }
  res.json({ success: true, data: item });
};

// POST /api/${resource}s
exports.create = (req, res) => {
  const { name, description, ...rest } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, error: 'Name is required' });
  }
  const item = {
    id: nextId++,
    name,
    description: description || '',
    ...rest,
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };
  ${resource}s.push(item);
  res.status(201).json({ success: true, data: item });
};

// PUT /api/${resource}s/:id
exports.update = (req, res) => {
  const idx = ${resource}s.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ success: false, error: '${R} not found' });
  }
  ${resource}s[idx] = {
    ...${resource}s[idx],
    ...req.body,
    id: ${resource}s[idx].id,
    updatedAt: new Date().toISOString(),
  };
  res.json({ success: true, data: ${resource}s[idx] });
};

// PATCH /api/${resource}s/:id
exports.partialUpdate = (req, res) => {
  const idx = ${resource}s.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ success: false, error: '${R} not found' });
  }
  Object.assign(${resource}s[idx], req.body, { updatedAt: new Date().toISOString() });
  res.json({ success: true, data: ${resource}s[idx] });
};

// DELETE /api/${resource}s/:id
exports.remove = (req, res) => {
  const idx = ${resource}s.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ success: false, error: '${R} not found' });
  }
  ${resource}s.splice(idx, 1);
  res.json({ success: true, message: '${R} deleted successfully' });
};
`;
}

function generateForm({ fields = ['name', 'email', 'message'], action = 'submit', method = 'POST' } = {}) {
  const fieldComponents = fields.map(field => {
    const label = field.charAt(0).toUpperCase() + field.slice(1);
    const type = field === 'email' ? 'email' : field === 'password' ? 'password' : field === 'message' || field === 'bio' ? 'textarea' : 'text';
    if (type === 'textarea') {
      return `
      <div>
        <label htmlFor="${field}" className="block text-sm font-medium text-gray-300 mb-1">
          ${label}
        </label>
        <textarea
          id="${field}"
          name="${field}"
          value={form.${field}}
          onChange={handleChange}
          rows={4}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-pink-400 focus:outline-none resize-none transition placeholder-gray-600"
          placeholder="Enter ${field}..."
        />
      </div>`;
    }
    return `
      <div>
        <label htmlFor="${field}" className="block text-sm font-medium text-gray-300 mb-1">
          ${label}
        </label>
        <input
          id="${field}"
          name="${field}"
          type="${type}"
          value={form.${field}}
          onChange={handleChange}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-pink-400 focus:outline-none transition placeholder-gray-600"
          placeholder="Enter ${field}..."
        />
      </div>`;
  }).join('\n');

  const initialState = fields.map(f => `${f}: ''`).join(', ');

  return `import React, { useState } from 'react';

export default function ${action.charAt(0).toUpperCase() + action.slice(1)}Form() {
  const [form, setForm] = useState({ ${initialState} });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    ${fields.map(f => `if (!form.${f}.trim()) errs.${f} = '${f.charAt(0).toUpperCase() + f.slice(1)} is required';`).join('\n    ')}
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/${action}', {
        method: '${method}',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setForm({ ${initialState} });
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {status === 'success' && (
        <div className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          ✓ Submitted successfully!
        </div>
      )}
      {status === 'error' && (
        <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          ✕ Something went wrong. Please try again.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
${fieldComponents}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-pink-500 hover:bg-pink-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors"
        >
          {loading ? 'Submitting...' : '${action.charAt(0).toUpperCase() + action.slice(1)}'}
        </button>
      </form>
    </div>
  );
}
`;
}

function generateTailwindLayout({ layout = 'sidebar', theme = 'dark' } = {}) {
  if (layout === 'sidebar') {
    return `<div className="flex min-h-screen bg-gray-950">
  {/* Sidebar */}
  <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
    <div className="p-6 border-b border-gray-800">
      <h1 className="text-xl font-bold text-white">App Name</h1>
    </div>
    <nav className="flex-1 p-4 space-y-1">
      {['Dashboard', 'Analytics', 'Users', 'Settings'].map(item => (
        <button key={item} className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition">
          {item}
        </button>
      ))}
    </nav>
  </aside>
  {/* Main */}
  <main className="flex-1 flex flex-col overflow-hidden">
    <header className="h-16 border-b border-gray-800 flex items-center px-6 gap-4 shrink-0">
      <h2 className="text-lg font-semibold text-white flex-1">Dashboard</h2>
      <button className="px-4 py-2 rounded-lg bg-pink-500 text-white text-sm font-medium hover:bg-pink-400 transition">
        + New
      </button>
    </header>
    <div className="flex-1 p-6 overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Content here */}
      </div>
    </div>
  </main>
</div>`;
  }
  if (layout === 'two-column') {
    return `<div className="min-h-screen bg-gray-950 text-white">
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Column */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h2 className="text-xl font-bold mb-4">Main Content</h2>
          {/* Content */}
        </div>
      </div>
      {/* Side Column */}
      <div className="space-y-4">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
          <h3 className="font-semibold mb-3">Sidebar Widget</h3>
          {/* Widget */}
        </div>
      </div>
    </div>
  </div>
</div>`;
  }
  return `<div className="min-h-screen bg-gray-950 text-white">
  <div className="container mx-auto px-4 py-8">
    {/* Content */}
  </div>
</div>`;
}

function generateNavbar({ brand = 'MyApp', links = ['Home', 'About', 'Projects', 'Contact'] } = {}) {
  return `import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = ${JSON.stringify(links.map(l => ({ label: l, href: l === 'Home' ? '/' : `/${l.toLowerCase()}` })))};

  return (
    <nav className={\`fixed top-0 left-0 right-0 z-50 transition-all duration-300 \${scrolled ? 'bg-gray-950/95 backdrop-blur-md border-b border-gray-800 shadow-xl' : 'bg-transparent'}\`}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-black text-white hover:text-pink-400 transition">
          ${brand}
        </Link>
        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <Link
              key={link.label}
              to={link.href}
              className={\`px-4 py-2 rounded-lg text-sm transition \${location.pathname === link.href ? 'text-white bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}\`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/contact" className="ml-2 px-5 py-2 bg-pink-500 hover:bg-pink-400 text-white rounded-lg text-sm font-semibold transition">
            Get Started
          </Link>
        </div>
        {/* Mobile toggle */}
        <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-950 border-t border-gray-800 px-4 py-4 space-y-1">
          {links.map(link => (
            <Link key={link.label} to={link.href} onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition text-sm">
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
`;
}

function generateFooter({ brand = 'MyApp', year = new Date().getFullYear() } = {}) {
  return `import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const links = {
    Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
    Company: ['About', 'Blog', 'Careers', 'Press'],
    Legal: ['Privacy', 'Terms', 'Cookie Policy'],
  };

  return (
    <footer className="bg-gray-950 border-t border-gray-800 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-xl font-black text-white block mb-3">${brand}</Link>
            <p className="text-sm leading-relaxed">Built with care for developers who want to move fast.</p>
          </div>
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm hover:text-white transition">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">© ${year} ${brand}. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm">
            <a href="#" className="hover:text-white transition">Twitter</a>
            <a href="#" className="hover:text-white transition">GitHub</a>
            <a href="#" className="hover:text-white transition">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
`;
}

function generateAuthPage({ type = 'login' } = {}) {
  const isLogin = type === 'login';
  return `import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ${isLogin ? 'Login' : 'Register'}() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: ''${!isLogin ? ", name: '', confirmPassword: ''" : ''} });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    ${!isLogin ? "if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }" : ''}
    setLoading(true);
    try {
      // Replace with your API call
      await new Promise(r => setTimeout(r, 1000));
      navigate('/dashboard');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">${isLogin ? 'Welcome back' : 'Create account'}</h1>
          <p className="text-gray-400 text-sm">${isLogin ? 'Sign in to your account' : 'Join us today — it\'s free'}</p>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            ${!isLogin ? `<div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} required
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-pink-400 focus:outline-none transition"
                placeholder="John Doe" />
            </div>` : ''}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-pink-400 focus:outline-none transition"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-pink-400 focus:outline-none transition"
                placeholder="••••••••" />
            </div>
            ${!isLogin ? `<div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-pink-400 focus:outline-none transition"
                placeholder="••••••••" />
            </div>` : ''}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-pink-500 hover:bg-pink-400 disabled:opacity-50 text-white font-semibold transition mt-2">
              {loading ? '${isLogin ? 'Signing in' : 'Creating account'}...' : '${isLogin ? 'Sign In' : 'Create Account'}'}
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-6">
            ${isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <Link to="${isLogin ? '/register' : '/login'}" className="text-pink-400 hover:underline font-medium">
              ${isLogin ? 'Sign up' : 'Sign in'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
`;
}

function generateModal({ title = 'Confirm Action' } = {}) {
  return `import React from 'react';

export default function Modal({ isOpen, onClose, onConfirm, title = '${title}', children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition text-xl leading-none">✕</button>
        </div>
        <div className="text-gray-400 text-sm mb-6">{children}</div>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:border-gray-600 text-sm transition">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-400 text-white text-sm font-medium transition">Confirm</button>
        </div>
      </div>
    </div>
  );
}`;
}

function generateTable({ columns = ['Name', 'Email', 'Role', 'Status'] } = {}) {
  return `import React, { useState } from 'react';

const SAMPLE_DATA = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  ${columns.map((c, idx) => `${c.toLowerCase().replace(/\s+/g, '_')}: 'Sample ${c} ${i + 1}'`).join(',\n  ')},
}));

export default function DataTable() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filtered = SAMPLE_DATA.filter(row =>
    Object.values(row).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  );
  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey] ?? ''; const bv = b[sortKey] ?? '';
    return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });
  const paged = sorted.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(sorted.length / perPage);

  const handleSort = key => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const columns = ${JSON.stringify(columns)};

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search..." className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-400 transition" />
        <span className="text-gray-500 text-sm">{filtered.length} results</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              {columns.map(col => (
                <th key={col} onClick={() => handleSort(col.toLowerCase())}
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide cursor-pointer hover:text-white select-none">
                  {col} {sortKey === col.toLowerCase() ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
              ))}
              <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(row => (
              <tr key={row.id} className="border-t border-gray-800 hover:bg-gray-800/30 transition">
                {columns.map(col => (
                  <td key={col} className="px-4 py-3 text-sm text-gray-300">{row[col.toLowerCase().replace(/\\s+/g, '_')]}</td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition">Edit</button>
                    <button className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-800 flex items-center justify-between">
        <span className="text-gray-500 text-sm">Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 text-sm rounded border border-gray-700 disabled:opacity-40 hover:border-gray-500 transition">←</button>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 text-sm rounded border border-gray-700 disabled:opacity-40 hover:border-gray-500 transition">→</button>
        </div>
      </div>
    </div>
  );
}`;
}

function generateCardGrid({ count = 6 } = {}) {
  return `import React from 'react';

const items = Array.from({ length: ${count} }, (_, i) => ({
  id: i + 1, title: \`Card \${i + 1}\`, description: 'A description for this card item goes here.',
  tag: ['React', 'Node.js', 'Design', 'API', 'Mobile', 'Data'][i % 6],
  date: new Date(Date.now() - i * 86400000 * 5).toLocaleDateString(),
}));

export default function CardGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-all duration-200 group cursor-pointer">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-semibold bg-pink-500/15 text-pink-400 px-2 py-1 rounded">{item.tag}</span>
            <span className="text-xs text-gray-600">{item.date}</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-400 transition">{item.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
          <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
            <button className="text-sm text-gray-500 hover:text-white transition">View details →</button>
            <div className="flex gap-2">
              <button className="text-gray-600 hover:text-white transition text-sm">Edit</button>
              <button className="text-gray-600 hover:text-red-400 transition text-sm">Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}`;
}

function generateSidebar({ items = ['Dashboard', 'Projects', 'Analytics', 'Settings'] } = {}) {
  return generateTailwindLayout({ layout: 'sidebar' });
}

function generateHeroSection({ headline = 'Build Faster', subheadline = 'The modern developer platform' } = {}) {
  return `import React from 'react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>
      <div className="relative text-center px-4 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-gray-900/80 border border-gray-700 rounded-full px-4 py-1.5 text-sm text-gray-400 mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Now in public beta
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tight mb-6">
          ${headline}<br/>
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Differently
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          ${subheadline}. Offline-first, AI-free, and completely in your control.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-8 py-4 bg-pink-500 hover:bg-pink-400 text-white rounded-full font-bold text-lg transition-all hover:-translate-y-1 shadow-lg shadow-pink-500/20">
            Get Started Free
          </button>
          <button className="px-8 py-4 border border-gray-700 hover:border-gray-500 text-white rounded-full font-semibold text-lg transition">
            View Demo →
          </button>
        </div>
        <p className="mt-6 text-gray-600 text-sm">No sign-up required. Works offline. Always free.</p>
      </div>
    </section>
  );
}`;
}

function generateApiClient({ baseUrl = 'http://localhost:3001/api' } = {}) {
  return `// API Client — type-safe fetch wrapper
const BASE_URL = '${baseUrl}';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request(endpoint, options = {}) {
  const url = \`\${BASE_URL}\${endpoint}\`;
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  const res = await fetch(url, config);
  const data = await res.json().catch(() => null);

  if (!res.ok) throw new ApiError(data?.error || 'Request failed', res.status, data);
  return data;
}

export const api = {
  get: (endpoint, headers) => request(endpoint, { method: 'GET', headers }),
  post: (endpoint, body, headers) => request(endpoint, { method: 'POST', body, headers }),
  put: (endpoint, body, headers) => request(endpoint, { method: 'PUT', body, headers }),
  patch: (endpoint, body, headers) => request(endpoint, { method: 'PATCH', body, headers }),
  delete: (endpoint, headers) => request(endpoint, { method: 'DELETE', headers }),
};

// Resource factory
export function createResource(path) {
  return {
    getAll: (params) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return api.get(\`\${path}\${qs}\`);
    },
    getOne: (id) => api.get(\`\${path}/\${id}\`),
    create: (data) => api.post(path, data),
    update: (id, data) => api.put(\`\${path}/\${id}\`, data),
    patch: (id, data) => api.patch(\`\${path}/\${id}\`, data),
    remove: (id) => api.delete(\`\${path}/\${id}\`),
  };
}

export { ApiError };
`;
}

function generateCustomHook({ name = 'useData', resource = 'items' } = {}) {
  return `import { useState, useEffect, useCallback } from 'react';

export function ${name}(initialParams = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetch${resource.charAt(0).toUpperCase() + resource.slice(1)} = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(\`/api/${resource}?\${qs}\`);
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      const json = await res.json();
      setData(json.data || json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetch${resource.charAt(0).toUpperCase() + resource.slice(1)}(); }, [fetch${resource.charAt(0).toUpperCase() + resource.slice(1)}]);

  const refetch = () => fetch${resource.charAt(0).toUpperCase() + resource.slice(1)}();
  const updateParams = (newParams) => setParams(p => ({ ...p, ...newParams }));

  return { data, loading, error, refetch, params, updateParams };
}
`;
}

module.exports = { generateCode };
