// Rule-based summary generator — zero AI, fully deterministic
// Uses sentence templates + variable replacement + grammar rules

const SUMMARY_TEMPLATES = {
  fresher: [
    "{NAME} is a motivated and enthusiastic {TITLE} graduate with a strong foundation in {TOP_SKILLS}. Completed {EDUCATION} with {PERCENTAGE}. Actively seeking opportunities to apply theoretical knowledge and contribute meaningfully to real-world software development projects.",
    "A dedicated and ambitious {TITLE} fresher, {NAME} has built hands-on experience through academic projects involving {TOP_SKILLS}. Graduated from {COLLEGE} with a focus on practical problem-solving and collaborative development.",
    "{NAME} is an energetic entry-level developer with academic training in {TOP_SKILLS}. Completed {EDUCATION} and has developed {PROJECT_COUNT} personal projects, demonstrating a passion for building functional and well-structured software solutions.",
  ],
  junior: [
    "{NAME} is a results-driven {TITLE} with {EXP_YEARS} of professional experience specializing in {TOP_SKILLS}. Has contributed to {PROJECT_COUNT} projects across {COMPANIES}, delivering scalable and maintainable code. Passionate about clean architecture and continuous learning.",
    "Experienced {TITLE} with {EXP_YEARS} in the industry, {NAME} has hands-on expertise in {TOP_SKILLS}. Proven track record of delivering projects on time and collaborating effectively in agile team environments.",
    "{NAME} brings {EXP_YEARS} of hands-on development experience with a focus on {TOP_SKILLS}. Has worked with {COMPANIES} to build production-grade applications, and consistently delivers high-quality solutions aligned with business objectives.",
  ],
  senior: [
    "{NAME} is a seasoned {TITLE} with {EXP_YEARS} of comprehensive experience in {TOP_SKILLS}. Has led teams of developers, architected complex systems, and delivered enterprise-scale solutions at {COMPANIES}. Known for technical depth, mentorship, and strong cross-functional communication.",
    "With {EXP_YEARS} of industry experience, {NAME} is an accomplished {TITLE} and technical leader skilled in {TOP_SKILLS}. Has successfully driven projects from conception through deployment, fostering engineering best practices and team growth at {COMPANIES}.",
    "{NAME} is a strategic and hands-on {TITLE} with {EXP_YEARS} of experience building robust software systems. Expertise spans {TOP_SKILLS}, with a proven record of leading high-performing teams and delivering impact at {COMPANIES}.",
  ],
  freelance: [
    "{NAME} is a versatile freelance {TITLE} with expertise in {TOP_SKILLS}. Has independently delivered {PROJECT_COUNT} client projects, managing requirements, design, development, and deployment end-to-end. Committed to high-quality deliverables and client satisfaction.",
    "Independent {TITLE} {NAME} offers {EXP_YEARS} of freelancing experience across {TOP_SKILLS}. Adept at managing multiple client engagements simultaneously while maintaining strong attention to detail and meeting tight deadlines.",
  ],
};

const SKILLS_BULLETS = {
  frontend: [
    "Proficient in building responsive, pixel-perfect UIs using {SKILLS}",
    "Strong command of modern CSS frameworks including Tailwind CSS and Bootstrap",
    "Experience with state management libraries such as Redux, Zustand, and React Context",
    "Skilled in optimizing web performance through lazy loading, code splitting, and caching strategies",
  ],
  backend: [
    "Experienced in designing RESTful APIs and GraphQL endpoints using {SKILLS}",
    "Strong understanding of database design, query optimization, and ORM usage",
    "Proficient in implementing authentication, authorization, and security best practices",
    "Familiar with microservices architecture, message queues, and event-driven patterns",
  ],
  fullstack: [
    "Full-stack experience spanning {SKILLS} from database to UI",
    "Capable of architecting end-to-end systems including APIs, frontends, and deployment pipelines",
    "Experience with CI/CD workflows, containerization with Docker, and cloud deployments",
    "Skilled in both SQL and NoSQL databases with a strong understanding of data modeling",
  ],
  devops: [
    "Experienced in infrastructure as code using Terraform and Ansible",
    "Proficient with Docker, Kubernetes, and container orchestration",
    "Strong knowledge of CI/CD pipeline design using GitHub Actions, Jenkins, and CircleCI",
    "Familiar with AWS, GCP, and Azure cloud services and cost optimization strategies",
  ],
};

const EXPERIENCE_BULLETS = {
  generic: [
    "Developed and maintained {FEATURE} using {TECH}, improving system reliability by a measurable margin",
    "Collaborated with cross-functional teams to deliver {FEATURE} within sprint timelines",
    "Refactored legacy {FEATURE} to improve code maintainability and reduce technical debt",
    "Conducted code reviews and provided constructive feedback to junior team members",
    "Wrote comprehensive unit and integration tests achieving high code coverage",
    "Participated in daily standups, sprint planning, and retrospectives in an agile environment",
    "Documented technical specifications and contributed to the internal knowledge base",
  ],
  frontend: [
    "Built reusable component library used across {FEATURE}, reducing development time significantly",
    "Implemented responsive layouts and cross-browser compatibility for {FEATURE}",
    "Integrated third-party APIs and handled complex data visualization requirements",
    "Optimized Core Web Vitals scores leading to improved user experience and SEO metrics",
  ],
  backend: [
    "Designed and implemented RESTful APIs for {FEATURE} handling high request volumes",
    "Optimized database queries reducing average response time by a significant margin",
    "Implemented caching layers and background job processing for performance-critical workflows",
    "Ensured data integrity through transaction management and robust error handling",
  ],
};

const PROJECT_DESCRIPTIONS = {
  webapp: "{NAME} is a full-stack web application built with {TECH}. It features user authentication, a responsive dashboard, and real-time data updates.",
  api: "{NAME} is a RESTful API service developed in {TECH} providing CRUD operations, JWT authentication, and comprehensive API documentation.",
  mobile: "{NAME} is a cross-platform mobile application built with {TECH}, offering an intuitive user interface and offline capabilities.",
  portfolio: "{NAME} is a personal portfolio website showcasing projects, skills, and contact information, built with {TECH} and deployed on cloud infrastructure.",
  ecommerce: "{NAME} is an e-commerce platform developed with {TECH}, featuring product listings, cart management, secure checkout, and order tracking.",
  dashboard: "{NAME} is an analytics dashboard built with {TECH} that visualizes key metrics through interactive charts and filterable data tables.",
  tool: "{NAME} is a developer productivity tool created with {TECH} that automates repetitive tasks and integrates with popular development workflows.",
  game: "{NAME} is an interactive browser-based game developed with {TECH}, featuring smooth animations, score tracking, and progressive difficulty.",
};

function generateSummary(data) {
  const { name, title, skills = [], experience = [], education = [], projects = [], experienceLevel } = data;

  const level = experienceLevel || detectLevel(experience);
  const templates = SUMMARY_TEMPLATES[level] || SUMMARY_TEMPLATES.fresher;
  const template = templates[Math.floor(templates.length * 0.5)] || templates[0]; // deterministic pick

  const topSkills = skills.slice(0, 4).join(', ') || 'software development';
  const eduStr = education.length > 0
    ? `${education[0].degree || education[0].standard} from ${education[0].college || education[0].school}`
    : 'formal education in computer science';
  const college = education.length > 0 ? (education[0].college || education[0].school) : 'university';
  const percentage = education.length > 0 ? (education[0].percentage || '') : '';
  const expYears = calcExpYears(experience);
  const companies = experience.map(e => e.company).filter(Boolean).slice(0, 2).join(' and ') || 'various organizations';
  const projectCount = projects.length || 2;

  const summary = template
    .replace(/{NAME}/g, name || 'The candidate')
    .replace(/{TITLE}/g, title || 'Software Developer')
    .replace(/{TOP_SKILLS}/g, topSkills)
    .replace(/{EDUCATION}/g, eduStr)
    .replace(/{COLLEGE}/g, college)
    .replace(/{PERCENTAGE}/g, percentage ? `${percentage}%` : 'excellent scores')
    .replace(/{EXP_YEARS}/g, expYears)
    .replace(/{COMPANIES}/g, companies)
    .replace(/{PROJECT_COUNT}/g, String(projectCount));

  return { summary, level, expYears };
}

function generateSkillsBullets(skills, category = 'fullstack') {
  const bullets = SKILLS_BULLETS[category] || SKILLS_BULLETS.fullstack;
  const topSkills = skills.slice(0, 4).join(', ');
  return bullets.map(b => b.replace(/{SKILLS}/g, topSkills));
}

function generateExperienceBullets(role, tech, category = 'generic') {
  const pool = [...(EXPERIENCE_BULLETS.generic), ...(EXPERIENCE_BULLETS[category] || [])];
  // Pick 3-4 deterministic bullets
  return pool.slice(0, 4).map(b => b
    .replace(/{FEATURE}/g, role || 'core application features')
    .replace(/{TECH}/g, tech || 'modern technologies'));
}

function generateProjectDescription(projectName, tech, type = 'webapp') {
  const template = PROJECT_DESCRIPTIONS[type] || PROJECT_DESCRIPTIONS.webapp;
  return template.replace(/{NAME}/g, projectName).replace(/{TECH}/g, tech || 'modern web technologies');
}

function detectLevel(experience) {
  if (!experience || experience.length === 0) return 'fresher';
  const years = calcExpYears(experience);
  if (years < 1) return 'fresher';
  if (years < 3) return 'junior';
  if (years < 7) return 'junior';
  return 'senior';
}

function calcExpYears(experience) {
  if (!experience || experience.length === 0) return 0;
  let total = 0;
  for (const exp of experience) {
    if (exp.period) {
      const match = exp.period.match(/(\d+)\s*(?:year|yr)/i);
      if (match) { total += parseInt(match[1]); continue; }
    }
    if (exp.startYear && exp.endYear) {
      total += (parseInt(exp.endYear) || new Date().getFullYear()) - parseInt(exp.startYear);
    } else {
      total += 1;
    }
  }
  return total;
}

module.exports = { generateSummary, generateSkillsBullets, generateExperienceBullets, generateProjectDescription };
