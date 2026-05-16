const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const JSZip = require('jszip');
const { generateProject } = require('./generators/projectGenerator');
const { generateResume } = require('./generators/resumeGenerator');
const { generateCode } = require('./generators/codeGenerator');
const { generateSummary } = require('./generators/summaryGenerator');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

const PROJECTS_DIR = path.join(__dirname, '../projects');
const TEMPLATES_DIR = path.join(__dirname, '../templates');
fs.ensureDirSync(PROJECTS_DIR);

// ── Project Generation ──────────────────────────────────────────────────────
app.post('/api/generate/project', async (req, res) => {
  try {
    const { type, config } = req.body;
    const result = await generateProject(type, config, PROJECTS_DIR, TEMPLATES_DIR);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Project Download (ZIP) ──────────────────────────────────────────────────
app.get('/api/projects/:name/download', async (req, res) => {
  try {
    const projectPath = path.join(PROJECTS_DIR, req.params.name);
    if (!await fs.pathExists(projectPath)) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const zip = new JSZip();
    await addFolderToZip(zip, projectPath, '');
    const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${req.params.name}.zip"`);
    res.send(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function addFolderToZip(zip, folderPath, zipPath) {
  const items = await fs.readdir(folderPath);
  for (const item of items) {
    if (item === 'node_modules' || item === '.git') continue;
    const fullPath = path.join(folderPath, item);
    const zipItemPath = zipPath ? `${zipPath}/${item}` : item;
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory()) {
      await addFolderToZip(zip, fullPath, zipItemPath);
    } else {
      const content = await fs.readFile(fullPath);
      zip.file(zipItemPath, content);
    }
  }
}

// ── List Projects ───────────────────────────────────────────────────────────
app.get('/api/projects', async (req, res) => {
  try {
    const items = await fs.readdir(PROJECTS_DIR);
    const projects = [];
    for (const item of items) {
      const p = path.join(PROJECTS_DIR, item);
      const stat = await fs.stat(p);
      if (stat.isDirectory()) {
        let meta = {};
        const metaPath = path.join(p, 'project.json');
        if (await fs.pathExists(metaPath)) {
          meta = await fs.readJSON(metaPath);
        }
        projects.push({ name: item, created: stat.birthtime, ...meta });
      }
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Delete Project ──────────────────────────────────────────────────────────
app.delete('/api/projects/:name', async (req, res) => {
  try {
    await fs.remove(path.join(PROJECTS_DIR, req.params.name));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Templates ───────────────────────────────────────────────────────────────
app.get('/api/templates', async (req, res) => {
  try {
    const items = await fs.readdir(TEMPLATES_DIR);
    const templates = [];
    for (const item of items) {
      const cfgPath = path.join(TEMPLATES_DIR, item, 'config.json');
      if (await fs.pathExists(cfgPath)) {
        const cfg = await fs.readJSON(cfgPath);
        templates.push({ id: item, ...cfg });
      }
    }
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Resume ───────────────────────────────────────────────────────────────────
app.post('/api/generate/resume', async (req, res) => {
  try {
    const html = generateResume(req.body);
    res.json({ success: true, html });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Summary ──────────────────────────────────────────────────────────────────
app.post('/api/generate/summary', (req, res) => {
  try {
    const summary = generateSummary(req.body);
    res.json({ success: true, summary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Code Generator ───────────────────────────────────────────────────────────
app.post('/api/generate/code', (req, res) => {
  try {
    const { type, options } = req.body;
    const code = generateCode(type, options);
    res.json({ success: true, code });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── File Explorer ────────────────────────────────────────────────────────────
app.get('/api/files', async (req, res) => {
  const dir = req.query.path || PROJECTS_DIR;
  const safePath = path.resolve(dir);
  if (!safePath.startsWith(path.resolve(PROJECTS_DIR))) {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const items = await fs.readdir(safePath);
    const result = [];
    for (const item of items) {
      if (item === 'node_modules') continue;
      const full = path.join(safePath, item);
      const stat = await fs.stat(full);
      result.push({ name: item, path: full, isDir: stat.isDirectory(), size: stat.size, modified: stat.mtime });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/files/read', async (req, res) => {
  const filePath = req.query.path;
  const safePath = path.resolve(filePath);
  if (!safePath.startsWith(path.resolve(PROJECTS_DIR))) {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const content = await fs.readFile(safePath, 'utf8');
    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/files/write', async (req, res) => {
  const { path: filePath, content } = req.body;
  const safePath = path.resolve(filePath);
  if (!safePath.startsWith(path.resolve(PROJECTS_DIR))) {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    await fs.outputFile(safePath, content, 'utf8');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Health ───────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', platform: 'MD Dev Studio' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 MD Dev Studio Backend running at http://localhost:${PORT}`);
  console.log(`📁 Projects directory: ${PROJECTS_DIR}`);
  console.log(`📦 Templates directory: ${TEMPLATES_DIR}\n`);
});

module.exports = app;
