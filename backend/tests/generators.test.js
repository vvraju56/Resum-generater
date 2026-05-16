// MD Dev Studio — Generator Test Suite
// Run: cd backend && npm test

const { generateSummary, generateSkillsBullets, generateProjectDescription } = require('../generators/summaryGenerator');
const { generateCode } = require('../generators/codeGenerator');
const { generateResume } = require('../generators/resumeGenerator');

// ── Summary Generator Tests ─────────────────────────────────────────────
describe('Summary Generator', () => {
  test('generates fresher summary with no experience', () => {
    const result = generateSummary({
      name: 'Alice Smith',
      title: 'Software Developer',
      skills: ['React', 'Node.js', 'JavaScript'],
      experience: [],
      education: [{ degree: 'B.Tech CSE', college: 'MIT', year: '2024', percentage: '85%' }],
      projects: [{ name: 'Portfolio', tech: 'React' }],
    });
    expect(result.summary).toBeTruthy();
    expect(result.summary).toContain('Alice Smith');
    expect(result.level).toBe('fresher');
  });

  test('generates junior summary with 1 year experience', () => {
    const result = generateSummary({
      name: 'Bob Jones',
      title: 'Frontend Developer',
      skills: ['React', 'TypeScript', 'CSS'],
      experience: [{ role: 'Developer', company: 'Acme', period: '1 year', startYear: '2023', endYear: '2024' }],
      education: [],
      projects: [],
    });
    expect(result.summary).toBeTruthy();
    expect(result.summary).toContain('Bob Jones');
    expect(['fresher', 'junior']).toContain(result.level);
  });

  test('generates senior summary with many years experience', () => {
    const result = generateSummary({
      name: 'Carol White',
      title: 'Senior Engineer',
      skills: ['Go', 'Kubernetes', 'AWS'],
      experience: [
        { role: 'Lead Dev', company: 'BigCo', startYear: '2016', endYear: '2024' },
        { role: 'Senior Dev', company: 'StartupXYZ', startYear: '2014', endYear: '2016' },
      ],
      education: [],
      projects: [],
    });
    expect(result.summary).toBeTruthy();
    expect(result.expYears).toBeGreaterThanOrEqual(8);
    expect(result.level).toBe('senior');
  });

  test('summary contains top skills', () => {
    const skills = ['Python', 'Django', 'PostgreSQL', 'Docker', 'Redis'];
    const result = generateSummary({ name: 'Dev', skills, experience: [], education: [], projects: [] });
    const topFour = skills.slice(0, 4);
    const hasSkill = topFour.some(s => result.summary.includes(s));
    expect(hasSkill).toBe(true);
  });

  test('generates skill bullets', () => {
    const bullets = generateSkillsBullets(['React', 'Vite', 'Tailwind'], 'frontend');
    expect(Array.isArray(bullets)).toBe(true);
    expect(bullets.length).toBeGreaterThan(0);
    bullets.forEach(b => expect(typeof b).toBe('string'));
  });

  test('generates project description', () => {
    const desc = generateProjectDescription('MyApp', 'React + Node.js', 'webapp');
    expect(desc).toContain('MyApp');
    expect(desc).toContain('React + Node.js');
  });

  test('handles missing optional fields gracefully', () => {
    const result = generateSummary({ name: 'Jane' });
    expect(result.summary).toBeTruthy();
    expect(result.summary).toContain('Jane');
  });
});

// ── Code Generator Tests ────────────────────────────────────────────────
describe('Code Generator', () => {
  test('generates valid React component', () => {
    const code = generateCode('react-component', { name: 'TestCard', hasState: true, hasProps: true });
    expect(code).toContain('export default function TestCard');
    expect(code).toContain('useState');
    expect(code).toContain('import React');
  });

  test('generates React component without state', () => {
    const code = generateCode('react-component', { name: 'StaticBox', hasState: false, hasProps: false });
    expect(code).toContain('export default function StaticBox');
    expect(code).not.toContain('useState');
  });

  test('generates Express route for given resource', () => {
    const code = generateCode('express-route', { resource: 'product' });
    expect(code).toContain("require('../controllers/productController')");
    expect(code).toContain("router.get('/'");
    expect(code).toContain("router.post('/'");
    expect(code).toContain("router.put('/:id'");
    expect(code).toContain("router.delete('/:id'");
  });

  test('generates Express route with auth middleware', () => {
    const code = generateCode('express-route', { resource: 'order', auth: true });
    expect(code).toContain('authenticate');
    expect(code).toContain("require('../middleware/auth')");
  });

  test('generates CRUD controller', () => {
    const code = generateCode('crud-api', { resource: 'task' });
    expect(code).toContain('exports.getAll');
    expect(code).toContain('exports.getOne');
    expect(code).toContain('exports.create');
    expect(code).toContain('exports.update');
    expect(code).toContain('exports.remove');
    expect(code).toContain('tasks');
  });

  test('generates form with specified fields', () => {
    const code = generateCode('form', { fields: ['name', 'email', 'message'], action: 'contact' });
    expect(code).toContain('name');
    expect(code).toContain('email');
    expect(code).toContain('message');
    expect(code).toContain('handleSubmit');
    expect(code).toContain('useState');
  });

  test('generates navbar with brand', () => {
    const code = generateCode('navbar', { brand: 'MyBrand', links: ['Home', 'About'] });
    expect(code).toContain('MyBrand');
    expect(code).toContain('Home');
    expect(code).toContain('About');
  });

  test('generates auth login page', () => {
    const code = generateCode('auth-page', { type: 'login' });
    expect(code).toContain('Login');
    expect(code).toContain('email');
    expect(code).toContain('password');
    expect(code).toContain('handleSubmit');
  });

  test('generates auth register page', () => {
    const code = generateCode('auth-page', { type: 'register' });
    expect(code).toContain('Register');
    expect(code).toContain('confirmPassword');
  });

  test('generates data table component', () => {
    const code = generateCode('table', { columns: ['Name', 'Email', 'Status'] });
    expect(code).toContain('Name');
    expect(code).toContain('Email');
    expect(code).toContain('Status');
    expect(code).toContain('search');
    expect(code).toContain('page');
  });

  test('generates hero section', () => {
    const code = generateCode('hero-section', { headline: 'Ship Faster', subheadline: 'The dev tool' });
    expect(code).toContain('Ship Faster');
    expect(code).toContain('The dev tool');
  });

  test('generates API client', () => {
    const code = generateCode('api-client', { baseUrl: 'http://localhost:4000/api' });
    expect(code).toContain('http://localhost:4000/api');
    expect(code).toContain('export const api');
    expect(code).toContain('createResource');
  });

  test('generates custom hook', () => {
    const code = generateCode('custom-hook', { name: 'useProducts', resource: 'products' });
    expect(code).toContain('useProducts');
    expect(code).toContain('products');
    expect(code).toContain('useState');
    expect(code).toContain('useEffect');
  });

  test('throws on unknown type', () => {
    expect(() => generateCode('unknown-type', {})).toThrow();
  });
});

// ── Resume Generator Tests ──────────────────────────────────────────────
describe('Resume Generator', () => {
  const sampleData = {
    name: 'Jane Developer',
    title: 'Full Stack Engineer',
    summary: 'Experienced developer with a passion for clean code.',
    phone: '+1 555 0100',
    email: 'jane@example.com',
    address: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/jane',
    github: 'https://github.com/jane',
    skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
    experience: [
      { role: 'Senior Developer', company: 'TechCorp', period: 'Jan 2022 – Present', description: 'Led frontend architecture.' },
    ],
    education: [
      { degree: 'B.S. Computer Science', college: 'State University', year: '2021', percentage: '3.8 GPA' },
    ],
    projects: [
      { name: 'DevTool', tech: 'React + Node.js', location: 'github.com/jane/devtool', description: 'Productivity tool for developers.', link: 'https://github.com/jane/devtool' },
    ],
    theme: 'modern',
    layout: 'single',
  };

  test('generates HTML string for single column resume', () => {
    const html = generateResume(sampleData);
    expect(typeof html).toBe('string');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Jane Developer');
    expect(html).toContain('Full Stack Engineer');
  });

  test('includes all contact fields', () => {
    const html = generateResume(sampleData);
    expect(html).toContain('jane@example.com');
    expect(html).toContain('+1 555 0100');
    expect(html).toContain('San Francisco, CA');
    expect(html).toContain('LinkedIn');
    expect(html).toContain('GitHub');
  });

  test('includes skills', () => {
    const html = generateResume(sampleData);
    expect(html).toContain('JavaScript');
    expect(html).toContain('React');
    expect(html).toContain('Node.js');
  });

  test('includes experience section', () => {
    const html = generateResume(sampleData);
    expect(html).toContain('Senior Developer');
    expect(html).toContain('TechCorp');
    expect(html).toContain('Led frontend architecture');
  });

  test('includes education section', () => {
    const html = generateResume(sampleData);
    expect(html).toContain('B.S. Computer Science');
    expect(html).toContain('State University');
    expect(html).toContain('3.8 GPA');
  });

  test('includes projects section', () => {
    const html = generateResume(sampleData);
    expect(html).toContain('DevTool');
    expect(html).toContain('React + Node.js');
    expect(html).toContain('Productivity tool');
  });

  test('generates two-column layout', () => {
    const html = generateResume({ ...sampleData, layout: 'two-column' });
    expect(html).toContain('sidebar');
    expect(html).toContain('Jane Developer');
  });

  test('applies different themes', () => {
    const themes = ['modern', 'classic', 'minimal', 'dark', 'purple', 'green', 'ocean', 'sunset'];
    for (const theme of themes) {
      const html = generateResume({ ...sampleData, theme });
      expect(html).toContain('Jane Developer');
      expect(html.length).toBeGreaterThan(500);
    }
  });

  test('escapes HTML special characters', () => {
    const html = generateResume({ ...sampleData, name: '<script>alert("xss")</script>' });
    expect(html).not.toContain('<script>alert');
    expect(html).toContain('&lt;script&gt;');
  });

  test('handles empty optional sections gracefully', () => {
    const minimal = { name: 'Min User', title: 'Dev', theme: 'modern', layout: 'single' };
    const html = generateResume(minimal);
    expect(html).toContain('Min User');
    expect(html).not.toContain('undefined');
    expect(html).not.toContain('[object Object]');
  });
});
