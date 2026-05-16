#!/usr/bin/env node
// MD Dev Studio CLI
// Usage: mdstudio create <type> [name]

const readline = require('readline');
const path = require('path');
const fs = require('fs');

const COMMANDS = {
  create: require('./commands/create'),
  list: require('./commands/list'),
  help: showHelp,
  version: showVersion,
};

const args = process.argv.slice(2);
const cmd = args[0];
const subArgs = args.slice(1);

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

function c(color, text) { return `${COLORS[color]}${text}${COLORS.reset}`; }

function printBanner() {
  console.log('');
  console.log(c('magenta', '  ███╗   ███╗██████╗     ██████╗ ███████╗██╗   ██╗'));
  console.log(c('magenta', '  ████╗ ████║██╔══██╗    ██╔══██╗██╔════╝██║   ██║'));
  console.log(c('magenta', '  ██╔████╔██║██║  ██║    ██║  ██║█████╗  ██║   ██║'));
  console.log(c('magenta', '  ██║╚██╔╝██║██║  ██║    ██║  ██║██╔══╝  ╚██╗ ██╔╝'));
  console.log(c('magenta', '  ██║ ╚═╝ ██║██████╔╝    ██████╔╝███████╗ ╚████╔╝ '));
  console.log(c('magenta', '  ╚═╝     ╚═╝╚═════╝     ╚═════╝ ╚══════╝  ╚═══╝  '));
  console.log('');
  console.log(c('gray', '  STUDIO  ·  Offline  ·  AI-Free  ·  Developer Platform'));
  console.log('');
}

function showHelp() {
  printBanner();
  console.log(c('bright', '  Usage:'));
  console.log('');
  console.log(`  ${c('cyan', 'mdstudio')} ${c('green', 'create')} ${c('yellow', '<type>')} [name]   Create a new project`);
  console.log(`  ${c('cyan', 'mdstudio')} ${c('green', 'list')}                   List available project types`);
  console.log(`  ${c('cyan', 'mdstudio')} ${c('green', 'help')}                   Show this help`);
  console.log(`  ${c('cyan', 'mdstudio')} ${c('green', 'version')}                Show CLI version`);
  console.log('');
  console.log(c('bright', '  Project Types:'));
  console.log('');
  const types = [
    ['react-app',       'React + Vite + Tailwind starter'],
    ['nextjs-app',      'Next.js 14 with App Router'],
    ['express-api',     'Express REST API with CRUD'],
    ['portfolio',       'Personal portfolio website'],
    ['admin-dashboard', 'Admin dashboard with charts'],
    ['landing-page',    'Static HTML landing page'],
    ['blog',            'Blog with markdown posts'],
    ['docs-site',       'Documentation website'],
    ['resume-builder',  'Resume builder app'],
    ['tailwind-website','Tailwind CSS website'],
  ];
  types.forEach(([type, desc]) => {
    console.log(`  ${c('yellow', type.padEnd(22))} ${c('gray', desc)}`);
  });
  console.log('');
  console.log(c('bright', '  Examples:'));
  console.log('');
  console.log(`  ${c('gray', '$')} mdstudio create react-app my-app`);
  console.log(`  ${c('gray', '$')} mdstudio create portfolio`);
  console.log(`  ${c('gray', '$')} mdstudio create express-api task-api`);
  console.log('');
}

function showVersion() {
  const pkg = require('../package.json');
  console.log(`MD Dev Studio CLI v${pkg.version}`);
}

async function main() {
  if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
    return showHelp();
  }
  if (cmd === 'version' || cmd === '--version' || cmd === '-v') {
    return showVersion();
  }

  const handler = COMMANDS[cmd];
  if (!handler) {
    console.error(c('red', `\n  ✗ Unknown command: ${cmd}\n`));
    console.log(`  Run ${c('cyan', 'mdstudio help')} for usage.\n`);
    process.exit(1);
  }

  try {
    await handler(subArgs);
  } catch (err) {
    console.error(c('red', `\n  ✗ Error: ${err.message}\n`));
    process.exit(1);
  }
}

main();
