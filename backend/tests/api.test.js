// MD Dev Studio — API Integration Tests
// Run: cd backend && npm test

const request = require('supertest');
const app = require('../server');

describe('Health Check', () => {
  test('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.version).toBe('1.0.0');
    expect(res.body.platform).toBe('MD Dev Studio');
  });
});

describe('Summary API', () => {
  test('POST /api/generate/summary returns summary for fresher', async () => {
    const res = await request(app)
      .post('/api/generate/summary')
      .send({
        name: 'Test User',
        title: 'Developer',
        skills: ['React', 'JavaScript'],
        experience: [],
        education: [{ degree: 'B.Tech', college: 'TestU', year: '2024' }],
        projects: [],
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.summary).toBeTruthy();
    expect(res.body.summary.summary).toContain('Test User');
  });

  test('POST /api/generate/summary handles empty body', async () => {
    const res = await request(app)
      .post('/api/generate/summary')
      .send({});
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('Code Generator API', () => {
  test('POST /api/generate/code generates React component', async () => {
    const res = await request(app)
      .post('/api/generate/code')
      .send({ type: 'react-component', options: { name: 'ApiTestCard' } });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.code).toContain('ApiTestCard');
  });

  test('POST /api/generate/code generates CRUD API', async () => {
    const res = await request(app)
      .post('/api/generate/code')
      .send({ type: 'crud-api', options: { resource: 'post' } });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.code).toContain('exports.getAll');
  });

  test('POST /api/generate/code returns error for unknown type', async () => {
    const res = await request(app)
      .post('/api/generate/code')
      .send({ type: 'not-a-real-type', options: {} });
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

describe('Resume Generator API', () => {
  const sampleResume = {
    name: 'API Test User',
    title: 'QA Engineer',
    summary: 'Testing the resume API endpoint.',
    phone: '555-0000',
    email: 'api@test.com',
    skills: ['Jest', 'Supertest', 'Node.js'],
    experience: [],
    education: [{ degree: 'B.Sc', college: 'Test University', year: '2023' }],
    projects: [],
    theme: 'dark',
    layout: 'single',
  };

  test('POST /api/generate/resume returns HTML', async () => {
    const res = await request(app)
      .post('/api/generate/resume')
      .send(sampleResume);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.html).toContain('API Test User');
    expect(res.body.html).toContain('<!DOCTYPE html>');
  });

  test('POST /api/generate/resume works with all themes', async () => {
    const themes = ['modern', 'classic', 'minimal', 'dark'];
    for (const theme of themes) {
      const res = await request(app)
        .post('/api/generate/resume')
        .send({ ...sampleResume, theme });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    }
  });

  test('POST /api/generate/resume two-column layout', async () => {
    const res = await request(app)
      .post('/api/generate/resume')
      .send({ ...sampleResume, layout: 'two-column' });
    expect(res.status).toBe(200);
    expect(res.body.html).toContain('sidebar');
  });
});

describe('Templates API', () => {
  test('GET /api/templates returns array', async () => {
    const res = await request(app).get('/api/templates');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('Projects API', () => {
  test('GET /api/projects returns array', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
