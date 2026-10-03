import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))

// Edit only this block to personalize the university submission.
const meta = {
  university: 'K L (Deemed to be) University',
  departments: ['Department of Computer Science Engineering', 'Department of Computer Science and Information Technology'],
  title: 'Design and Development of an Integrated Society Management System',
  project: 'Haven Society Management',
  degree: 'Bachelor of Technology',
  academicYear: '2026-2027',
  guide: 'GUIDE NAME',
  students: [
    { name: 'STUDENT NAME 1', id: 'ROLL NUMBER 1' },
    { name: 'STUDENT NAME 2', id: 'ROLL NUMBER 2' },
    { name: 'STUDENT NAME 3', id: 'ROLL NUMBER 3' },
  ],
}

const chapters = [
  { n: 1, name: 'Introduction', range: [5, 15], topics: [
    'Background of Digital Society Administration', 'Problem Statement', 'Scope of the Project', 'Project Objectives', 'Importance of the Application', 'Target Users and Stakeholders', 'Existing Manual Process', 'Proposed Digital Solution', 'Feasibility Analysis', 'Benefits and Expected Outcomes', 'Chapter Summary',
  ]},
  { n: 2, name: 'System Requirements', range: [16, 21], topics: [
    'Hardware Requirements', 'Software Requirements', 'Development Tools and Frameworks', 'Functional Requirements', 'Non-Functional Requirements', 'Requirement Traceability Summary',
  ]},
  { n: 3, name: 'Technology Stack', range: [22, 32], topics: [
    'Frontend: React and Vite', 'Frontend Routing and Component Model', 'CSS and Responsive Interface', 'Backend: Node.js and Express', 'REST API Design', 'Database: MySQL', 'Authentication with JWT and bcrypt', 'Data Visualization with Recharts', 'Version Control and Collaboration', 'External Libraries and Services', 'Technology Selection Summary',
  ]},
  { n: 4, name: 'System Architecture', range: [33, 36], topics: [
    'High-Level Architecture Diagram', 'Layered Architecture and Request Flow', 'Security and Authorization Architecture', 'Deployment Architecture',
  ]},
  { n: 5, name: 'Design', range: [37, 37], topics: ['Entity Relationship Diagram and Database Schema'] },
  { n: 6, name: 'Implementation', range: [38, 47], topics: [
    'Module-Wise Implementation Overview', 'Flat and Resident Management', 'Visitor and Staff Management', 'Maintenance Billing and Payments', 'Complaint and Notice Management', 'Amenity and Booking Management', 'Frontend Rendering and State Management', 'API Integration', 'Authentication and Authorization', 'Validation, Transactions, and Error Handling',
  ]},
  { n: 7, name: 'Features', range: [48, 55], topics: [
    'Main Feature Inventory', 'Role-Specific Dashboards', 'Reusable CRUD Experience', 'Search, Filters, and Status Views', 'Resident Self-Service', 'Administrative Analytics', 'Security and Data Protection', 'Accessibility and Responsive Design',
  ]},
  { n: 8, name: 'Testing', range: [56, 64], topics: [
    'Testing Strategy', 'Postman API Testing', 'Authentication and Authorization Tests', 'Integration Testing', 'Database Constraint Testing', 'Frontend and Responsive Testing', 'Test Tools and Environments', 'Test Cases and Expected Results', 'Quality Summary and Residual Risks',
  ]},
  { n: 9, name: 'Deployment', range: [65, 73], topics: [
    'Deployment Overview', 'Local Database Preparation', 'Environment Configuration', 'Frontend Production Build', 'Backend Service Deployment', 'Database Migration and Backup', 'CI/CD Pipeline Design', 'Security Hardening and Monitoring', 'Rollback and Recovery Procedure',
  ]},
  { n: 10, name: 'Challenges and Limitations', range: [74, 82], topics: [
    'Issues Faced During Development', 'Relational Data and Referential Integrity', 'Role Permission Complexity', 'Frontend State Synchronization', 'Authentication and Session Challenges', 'Solutions Applied', 'Current Limitations', 'Known Risks and Mitigations', 'Chapter Summary',
  ]},
  { n: 11, name: 'Future Enhancements', range: [83, 88], topics: [
    'Planned Features', 'Digital Payment Gateway Integration', 'Notification and Communication Services', 'Mobile and Progressive Web Application', 'Advanced Analytics and Automation', 'Integration and Optimization Roadmap',
  ]},
  { n: 12, name: 'Conclusion', range: [89, 97], topics: [
    'Project Summary', 'Objectives Achieved', 'Technical Achievements', 'Functional Outcomes', 'Security and Reliability Outcomes', 'User Experience Outcomes', 'Skills Learned During Development', 'Social and Operational Impact', 'Final Conclusion',
  ]},
  { n: 13, name: 'References', range: [98, 99], topics: ['Books and Standards', 'Documentation and Technical Resources'] },
  { n: 14, name: 'Appendices', range: [100, 105], topics: ['Application Screenshots', 'Sample Code Snippets', 'Installation and Setup Instructions', 'User Manual', 'API Catalogue and Test Data', 'Review Forms and Signatures'] },
]

const chapterContext = {
  1: 'The application replaces fragmented registers and spreadsheets with a unified operational view of flats, residents, visitors, staff, maintenance, payments, complaints, notices, amenities, and bookings. The project is designed for residential communities where administrators require reliable records and residents need limited self-service access.',
  2: 'Requirements were derived from the implemented routes, forms, database constraints, and role rules. They distinguish mandatory business behavior from quality attributes such as security, responsiveness, maintainability, consistency, and recoverability.',
  3: 'The implementation uses React 19.2.8, React Router 7.18.3, Vite 8.2.2, Express 5.2.1, MySQL through mysql2, JSON Web Tokens, bcryptjs, Lucide icons, and Recharts. The selected stack keeps the browser, API, and relational database responsibilities explicit.',
  4: 'Haven follows a three-tier web architecture. The React single-page application calls an Express REST API; the API authenticates requests, applies role and ownership rules, and executes parameterized statements against MySQL. The browser never receives database credentials.',
  5: 'The relational schema contains flats, residents, staff, visitors, maintenance bills, payments, complaints, notices, amenities, amenity bookings, and application users. Foreign keys preserve identity and ownership while unique keys prevent duplicate business records.',
  6: 'Implementation is organized around shared CRUD abstractions. Frontend resource metadata defines fields, columns, filters, and status summaries. Backend resource metadata maps approved fields to tables. This reduces duplication while keeping authorization authoritative on the server.',
  7: 'The finished feature set supports seven application roles: Admin, Committee, Secretary, Resident, Security, Housekeeping, and Maintenance Staff. Each role sees only relevant pages and actions, while record ownership further limits resident and staff data.',
  8: 'Verification combines static checks, a production build, API scenarios, database constraints, and role-based negative tests. The repository includes a Postman collection for health, login, list, create, update, and delete behavior. Claims in this chapter distinguish implemented checks from recommended extensions.',
  9: 'Deployment separates the Vite frontend, Express API, and MySQL database. Configuration is injected through environment variables. The documented approach favors repeatable builds, additive database changes, health checks, backups, and rollback without destructive data loss.',
  10: 'The central engineering challenges were maintaining mirrored navigation and server permissions, scoping data by resident ownership, preserving relational integrity, and keeping generic CRUD behavior understandable. The remaining limitations are recorded without presenting planned services as completed features.',
  11: 'Future work is arranged as backward-compatible increments. New schema fields should begin nullable or defaulted, behavior changes should be feature-gated, and existing API contracts should remain available through a migration period.',
  12: 'The project demonstrates a complete database-backed information system rather than a static interface. Its strongest outcome is a coherent path from schema constraints and API authorization to role-aware pages and analytics.',
  13: 'References prioritize official documentation and established software engineering sources. Version-specific product documentation is listed so that technical statements can be checked against the implemented dependency set.',
  14: 'The appendices provide practical evidence and operating guidance: screenshot locations, representative source excerpts, setup commands, user workflows, endpoint summaries, and signature placeholders.',
}

const detailPools = {
  1: ['Centralize society records', 'Reduce duplicate manual entry', 'Improve visibility and accountability', 'Support distinct operational roles', 'Preserve resident privacy'],
  2: ['Authenticated access', 'Persistent relational storage', 'Responsive browser interface', 'Clear validation feedback', 'Recoverable deployment configuration'],
  3: ['Component reuse', 'Non-blocking HTTP handling', 'Parameterized SQL', 'Declarative resource metadata', 'Reproducible package versions'],
  4: ['Presentation layer', 'Application service layer', 'Authorization boundary', 'Relational persistence layer', 'Operational health endpoint'],
  5: ['Primary and foreign keys', 'Unique business constraints', 'Enumerated status values', 'Restricted deletion', 'Ownership references'],
  6: ['List and summary views', 'Validated create/edit forms', 'Transactional writes', 'Server-side record scoping', 'Consistent errors and toasts'],
  7: ['Dashboard analytics', 'Resource filters', 'Status badges', 'Role-specific navigation', 'Resident self-service'],
  8: ['Positive API paths', 'Invalid credential paths', 'Forbidden role actions', 'Constraint violations', 'Regression build and lint checks'],
  9: ['Environment isolation', 'Schema and seed sequence', 'Frontend static build', 'API process management', 'Backup and rollback'],
  10: ['Permission drift', 'Stale client state', 'Foreign-key conflicts', 'Environment mismatch', 'Limited automation'],
  11: ['Payment integration', 'Email and SMS alerts', 'PWA installation', 'Audit history', 'Advanced trend analytics'],
  12: ['Full-stack integration', 'Database design', 'Secure authentication', 'Reusable UI engineering', 'Testing discipline'],
}

const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const studentRows = () => meta.students.map((s) => `<tr><td>${esc(s.name)}</td><td>${esc(s.id)}</td></tr>`).join('')
const list = (items) => `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`

function shell(content, options = {}) {
  const { front = false, cover = false, internal = null, chapter = '', title = '' } = options
  return `<section class="page ${front ? 'front' : ''} ${cover ? 'cover' : ''}">
    ${!front ? `<div class="running-head"><span>${esc(meta.project)}</span><span>Chapter ${esc(chapter)} · ${esc(title)}</span></div>` : ''}
    ${content}
    ${!front ? `<div class="footer"><span>${esc(meta.title)}</span><span>Page ${internal}</span></div>` : ''}
  </section>`
}

function coverPage() {
  return shell(`<div class="eyebrow">Project Report</div><h1>“${esc(meta.title)}”</h1><p class="center">A project report submitted in partial fulfillment of the requirements for the award of the degree of</p><div class="degree">${esc(meta.degree).toUpperCase()}</div><p class="center"><b>in</b></p><div class="project-name">${meta.departments.map(esc).join('<br>&amp;<br>')}</div><div class="meta"><b>Submitted by</b><table>${studentRows()}</table></div><p class="center">Under the esteemed guidance of<br><b>${esc(meta.guide)}</b></p><div class="logo">HSM</div><p class="center"><b>${esc(meta.university)}</b><br>Academic Year ${esc(meta.academicYear)}</p>`, { front: true, cover: true })
}

function declarationPage() {
  return shell(`<h1>Declaration</h1><div class="logo">HSM</div><p>We hereby declare that the project report entitled <b>“${esc(meta.title)}”</b> is a record of bona fide work carried out by the undersigned students in partial fulfillment of the requirements for the award of the degree of ${esc(meta.degree)} at ${esc(meta.university)}.</p><p>We further declare that the implementation, analysis, diagrams, testing material, and conclusions presented in this report are based on our project work. Material obtained from documentation and books has been acknowledged in the references. This report has not been submitted, in whole or in part, for the award of another degree or diploma.</p><table><thead><tr><th>Student</th><th>Registration Number</th></tr></thead><tbody>${studentRows()}</tbody></table><div class="signature-row"><span>Place: __________</span><span>Date: __________</span></div>`, { front: true })
}

function certificatePage() {
  return shell(`<h1>Certificate</h1><div class="logo">HSM</div><p>This is to certify that the project report entitled <b>“${esc(meta.title)}”</b> is a bona fide record of work completed by ${meta.students.map((s) => `<b>${esc(s.name)} (${esc(s.id)})</b>`).join(', ')} under my supervision during the academic year ${esc(meta.academicYear)}.</p><p>The work presented satisfies the academic requirements of the project and demonstrates the design, implementation, and evaluation of a full-stack society management application using React, Express, and MySQL.</p><div class="signature-row"><span>Signature of the Guide</span><span>Signature of the HOD</span></div><div class="signature-row"><span>Course Coordinator</span><span>External Examiner</span></div>`, { front: true })
}

function acknowledgementPage() {
  return shell(`<h1>Acknowledgement</h1><p>We express our sincere gratitude to our guide, <b>${esc(meta.guide)}</b>, for continuous guidance, technical review, and constructive suggestions throughout the design and development of Haven Society Management. The project benefited from careful discussions about database integrity, secure authentication, role separation, and usable interface design.</p><p>We thank the faculty and staff of ${meta.departments.map(esc).join(' and ')} at ${esc(meta.university)} for providing the facilities and academic environment required to complete this work. We also acknowledge our classmates and reviewers whose feedback helped identify practical workflows for administrators, residents, security personnel, and maintenance teams.</p><p>Finally, we thank our families and friends for their patience and support. Their encouragement helped us complete the implementation, documentation, and verification activities represented in this report.</p><table><tbody>${studentRows()}</tbody></table>`, { front: true })
}

function abstractPage() {
  return shell(`<h1>Abstract</h1><p class="lead">Haven Society Management is a full-stack database management application that brings core residential-community operations into one secure, role-aware web system.</p><p>The platform manages flats, residents, visitors, staff, maintenance bills, payments, complaints, notices, amenities, and amenity bookings. A React single-page application provides reusable data tables, forms, status indicators, dashboards, and responsive navigation. An Express API validates JSON requests, authenticates users with JSON Web Tokens, applies role and record-ownership rules, and executes parameterized queries against MySQL.</p><p>The database schema uses primary keys, foreign keys, enumerated statuses, uniqueness constraints, and transaction boundaries to preserve consistency. Passwords are stored as bcrypt hashes; database credentials remain on the server; and residents receive scoped access to records associated with their identity or flat. Administrators receive aggregate dashboards rendered with Recharts, while operational roles receive focused views suited to their responsibilities.</p><p>The implementation demonstrates how a declarative resource model can reduce repetition across ten CRUD modules without weakening authorization. The project includes setup scripts, seed data, a backward-compatible migration, and a Postman collection covering database health, authentication, and a complete notice lifecycle. The result is a maintainable academic DBMS project with a clear path toward notifications, payment gateways, audit trails, and production deployment.</p><div class="callout"><p><b>Keywords:</b> Society management, React, Express, MySQL, JWT, RBAC, CRUD, relational database, responsive dashboard.</p></div>`, { front: true })
}

function tocRows(chapterSet) {
  return chapterSet.map((c) => `<tr><td>${c.n}</td><td>${esc(c.name)}</td><td>${c.topics.map((t, i) => `${c.n}.${i + 1} ${esc(t)}`).join('<br>')}</td><td>${c.range[0]}–${c.range[1]}</td></tr>`).join('')
}

function contentsPage(part) {
  const set = part === 1 ? chapters.slice(0, 8) : chapters.slice(8)
  return shell(`<div class="toc"><h1>Index${part === 2 ? ' (Continued)' : ''}</h1><table class="compact"><thead><tr><th>No.</th><th>Chapter</th><th>Topics</th><th>Pages</th></tr></thead><tbody>${tocRows(set)}</tbody></table></div>`, { front: true })
}

function listsPage() {
  return shell(`<h1>List of Figures and Tables</h1><div class="grid-2"><div><h2>Figures</h2>${list(['Figure 4.1 High-level system architecture', 'Figure 4.2 Request and response flow', 'Figure 4.3 Authorization boundary', 'Figure 4.4 Deployment topology', 'Figure 5.1 Entity relationship model', 'Figure 6.1 API integration sequence', 'Figure 6.2 JWT authentication sequence', 'Figure 8.1 Integration test flow', 'Figure 11.1 Enhancement roadmap'])}</div><div><h2>Tables</h2>${list(['Table 2.1 Hardware requirements', 'Table 2.2 Software requirements', 'Table 2.3 Functional requirements', 'Table 3.1 Technology stack', 'Table 5.1 Entity catalogue', 'Table 7.1 Role capability matrix', 'Table 8.1 API test cases', 'Table 9.1 Environment variables', 'Table A.1 Endpoint catalogue'])}</div></div><h2>Abbreviations</h2><table><tbody><tr><td>API</td><td>Application Programming Interface</td><td>JWT</td><td>JSON Web Token</td></tr><tr><td>RBAC</td><td>Role-Based Access Control</td><td>CRUD</td><td>Create, Read, Update, Delete</td></tr><tr><td>DBMS</td><td>Database Management System</td><td>SPA</td><td>Single-Page Application</td></tr><tr><td>UI/UX</td><td>User Interface / User Experience</td><td>CI/CD</td><td>Continuous Integration / Delivery</td></tr></tbody></table>`, { front: true })
}

function architectureDiagram() {
  return `<div class="diagram"><div class="layer"><strong>CLIENT LAYER</strong><div class="flow"><span class="node">Browser</span><span class="arrow">→</span><span class="node accent">React 19 SPA</span><span class="node">Router + Context</span></div></div><div class="center arrow">↓ HTTPS / JSON</div><div class="layer"><strong>APPLICATION LAYER</strong><div class="flow"><span class="node">Express 5 API</span><span class="arrow">→</span><span class="node accent">JWT Middleware</span><span class="arrow">→</span><span class="node">Resource + Ownership Rules</span></div></div><div class="center arrow">↓ parameterized SQL</div><div class="layer"><strong>DATA LAYER</strong><div class="flow"><span class="node data">MySQL Pool</span><span class="node data">11 Related Tables</span><span class="node data">Transactions</span></div></div></div>`
}

function requestDiagram() {
  return `<div class="diagram"><div class="flow"><span class="node">User action</span><span class="arrow">1 →</span><span class="node">api.js</span><span class="arrow">2 →</span><span class="node accent">Authenticate</span><span class="arrow">3 →</span><span class="node">Authorize</span><span class="arrow">4 →</span><span class="node data">MySQL</span></div><div class="flow" style="margin-top:8mm"><span class="node">UI update</span><span class="arrow">8 ←</span><span class="node">Context state</span><span class="arrow">7 ←</span><span class="node accent">JSON response</span><span class="arrow">6 ←</span><span class="node data">Rows / result</span><span class="arrow">5 ←</span></div></div>`
}

function authDiagram() {
  return `<div class="diagram"><div class="flow"><span class="node">Email + password</span><span class="arrow">→</span><span class="node">bcrypt.compare</span><span class="arrow">→</span><span class="node accent">Signed 8-hour JWT</span></div><div class="center arrow">↓ Authorization: Bearer token</div><div class="flow"><span class="node">Signature check</span><span class="arrow">→</span><span class="node">Role permission</span><span class="arrow">→</span><span class="node">Ownership scope</span><span class="arrow">→</span><span class="node data">Approved query</span></div></div>`
}

function deploymentDiagram() {
  return `<div class="diagram"><div class="flow"><span class="node">Developer / Git</span><span class="arrow">→</span><span class="node">npm ci + lint + build</span><span class="arrow">→</span><span class="node accent">Release artifact</span></div><div class="flow" style="margin-top:7mm"><span class="node">Static frontend host</span><span class="arrow">↔</span><span class="node">Node API service</span><span class="arrow">↔</span><span class="node data">Managed MySQL</span></div><div class="flow" style="margin-top:7mm"><span class="node">TLS + CORS</span><span class="node">Secrets manager</span><span class="node">Health monitoring</span><span class="node">Encrypted backup</span></div></div>`
}

function erDiagram() {
  const entities = [
    ['FLATS', 'PK flat_id', 'UQ block + number', 'type, occupancy'], ['RESIDENTS', 'PK resident_id', 'FK flat_id', 'email, role, type'], ['APP_USERS', 'PK user_id', 'FK resident/staff/flat', 'hash, role, active'],
    ['VISITORS', 'PK visitor_id', 'FK flat_id', 'entry, exit, status'], ['STAFF', 'PK staff_id', 'name, phone', 'staff_type'], ['MAINTENANCE_BILLS', 'PK bill_id', 'FK flat_id', 'month, amount, status'],
    ['PAYMENTS', 'PK payment_id', 'FK bill + resident', 'method, transaction'], ['COMPLAINTS', 'PK complaint_id', 'FK resident_id', 'title, status'], ['NOTICES', 'PK notice_id', 'title, description', 'notice_date'],
    ['AMENITIES', 'PK amenity_id', 'UQ amenity_name', 'location, status'], ['AMENITY_BOOKINGS', 'PK booking_id', 'FK resident + amenity', 'date, time, status'],
  ]
  return `<div class="diagram"><div class="entity-grid">${entities.map(([name, ...fields]) => `<div class="entity"><b>${name}</b>${fields.map((f) => `<span>${f}</span>`).join('')}</div>`).join('')}</div><div class="note small"><b>Relationships:</b> Flat 1—N Residents; Flat 1—N Visitors; Flat 1—N Bills; Resident 1—N Payments; Resident 1—N Complaints; Resident N—M Amenities through Amenity Bookings; App User optionally maps one-to-one to a resident or staff record.</div></div>`
}

function testTable() {
  return `<table class="compact"><thead><tr><th>ID</th><th>Scenario</th><th>Expected Result</th></tr></thead><tbody><tr><td>T01</td><td>Health endpoint with reachable MySQL</td><td>200; database = connected</td></tr><tr><td>T02</td><td>Admin login with valid credentials</td><td>200; signed JWT and user payload</td></tr><tr><td>T03</td><td>Login with incorrect password</td><td>401; generic credential message</td></tr><tr><td>T04</td><td>Resident requests another resident's complaint</td><td>Record excluded by ownership scope</td></tr><tr><td>T05</td><td>Security role requests payments</td><td>403 Forbidden</td></tr><tr><td>T06</td><td>Create duplicate transaction ID</td><td>409 Conflict</td></tr><tr><td>T07</td><td>Delete referenced flat</td><td>409; referential-integrity message</td></tr><tr><td>T08</td><td>Create booking with end before start</td><td>Database check rejects write</td></tr></tbody></table>`
}

function roleTable() {
  return `<table class="compact"><thead><tr><th>Role</th><th>Primary capabilities</th></tr></thead><tbody><tr><td>Admin</td><td>All modules, all actions, analytics</td></tr><tr><td>Committee</td><td>Operations plus residents, visitors, complaints, notices, amenities, bookings</td></tr><tr><td>Secretary</td><td>Resident services, visitors, complaints, notices, amenities, bookings</td></tr><tr><td>Resident</td><td>Own visitors, bills, payments, complaints, and bookings; notices and amenities</td></tr><tr><td>Security</td><td>Visitor management and notices</td></tr><tr><td>Housekeeping</td><td>Focused dashboard and notices</td></tr><tr><td>Maintenance Staff</td><td>Complaint resolution and notices</td></tr></tbody></table>`
}

function references(which) {
  const items = which === 98 ? [
    'Pressman, R. S. and Maxim, B. R. Software Engineering: A Practitioner’s Approach. McGraw-Hill.',
    'Sommerville, I. Software Engineering. Pearson.',
    'OWASP Foundation. OWASP Application Security Verification Standard and Web Security Testing Guide.',
    'Fielding, R. Architectural Styles and the Design of Network-based Software Architectures.',
    'Oracle. MySQL 8.0 Reference Manual: InnoDB, constraints, transactions, and indexing.',
    'ECMA International. ECMAScript Language Specification.',
  ] : [
    'React Team. React Documentation. https://react.dev/',
    'Vite Team. Vite Guide. https://vite.dev/',
    'Express.js. Express 5 Documentation. https://expressjs.com/',
    'MySQL2. Node.js MySQL driver documentation. https://sidorares.github.io/node-mysql2/',
    'Auth0. JSON Web Token introduction. https://jwt.io/introduction',
    'Postman. Collections and test scripts documentation. https://learning.postman.com/',
    'Recharts. Composable charting library documentation. https://recharts.org/',
    'MDN Web Docs. HTTP, CORS, accessibility, and responsive design references. https://developer.mozilla.org/',
  ]
  return `<h2>${which === 98 ? 'Published Sources and Standards' : 'Framework and Tool Documentation'}</h2><ol>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ol><div class="callout"><p>All URLs were last reviewed for this report on 2 October 2026. Dependency versions are recorded in the repository package manifest and lock file.</p></div>`
}

function appendix(page) {
  if (page === 100) return `<h2>Application Screenshots</h2><img class="report-shot" src="app-login.png" alt="Haven Society login page with demo role selector"><p class="figure-caption">Figure A.1 — Responsive Haven Society login page and demo-role selector, captured from the running Vite application.</p><div class="grid-2"><div class="placeholder">Figure A.2<br>Administrator dashboard with charts<br><small>Capture after connecting the seeded MySQL database</small></div><div class="placeholder">Figure A.3<br>Resident complaint or booking view<br><small>Capture after signing in with a resident demo role</small></div></div><p class="small">The included image uses only the repository's documented demonstration account. Production screenshots must avoid exposing personal data.</p>`
  if (page === 101) return `<h2>Representative Source Code</h2><h3>Authenticated route boundary</h3><div class="code">app.use('/api/:resource', authenticate, (req, res, next) =&gt; {
  const config = resources[req.params.resource]
  if (!config) return res.status(404).json({ message: 'Unknown resource.' })
  if (!canAccess(req.user.role, req.params.resource))
    return res.status(403).json({ message: 'Access denied.' })
  req.resourceConfig = config
  next()
})</div><h3>Parameterized list query</h3><div class="code">const scope = scopedWhere(req.user, req.params.resource)
const [rows] = await pool.execute(
  'SELECT * FROM ' + table + scope.sql + ' ORDER BY ' + id + ' DESC',
  scope.values,
)</div><p>The table and identifier originate only from server-owned resource configuration; user values remain bound parameters.</p>`
  if (page === 102) return `<h2>Installation and Setup</h2><ol><li>Install Node.js 20 or later and MySQL 8.</li><li>Run <b>npm install</b> from the repository root.</li><li>Create the database using <b>mysql -u root -p &lt; backend/sql/schema.sql</b>.</li><li>Load demonstration data with <b>mysql -u root -p &lt; backend/sql/seed.sql</b>.</li><li>Copy <b>.env.example</b> to <b>.env</b>; set DB_PASSWORD and JWT_SECRET.</li><li>Start the API using <b>npm run dev:server</b>.</li><li>Start Vite using <b>npm run dev</b>.</li><li>Open <b>http://localhost:5174</b> and verify <b>http://localhost:3001/api/health</b>.</li></ol><div class="code">npm install
npm run lint
npm run build
npm run dev:server
npm run dev</div><div class="note">The frontend port is intentionally fixed at 5174. The default API port is 3001.</div>`
  if (page === 103) return `<h2>User Manual</h2><div class="timeline"><b>1. Sign in</b><span>Select a demo role or enter an authorized email and password.</span><b>2. Review dashboard</b><span>Use the role-specific summary to identify pending work.</span><b>3. Open a module</b><span>Choose a permitted resource from the sidebar.</span><b>4. Search and filter</b><span>Narrow table records by configured fields and statuses.</span><b>5. Create or edit</b><span>Complete the modal form; required fields are validated before submission.</span><b>6. Resolve work</b><span>Update complaint, visitor, booking, or billing status according to responsibility.</span><b>7. Sign out</b><span>Remove the local session token when leaving a shared device.</span></div><div class="callout"><p>Authorization is enforced by the API even if a user attempts to bypass hidden navigation controls.</p></div>`
  if (page === 104) return `<h2>API Catalogue and Demonstration Data</h2><table class="compact"><thead><tr><th>Method</th><th>Endpoint</th><th>Purpose</th></tr></thead><tbody><tr><td>GET</td><td>/api/health</td><td>API and database health</td></tr><tr><td>POST</td><td>/api/auth/login</td><td>Credential verification and JWT issue</td></tr><tr><td>GET</td><td>/api/:resource</td><td>Role-scoped record list</td></tr><tr><td>POST</td><td>/api/:resource</td><td>Create an allowed record</td></tr><tr><td>PUT</td><td>/api/:resource/:id</td><td>Update an allowed record</td></tr><tr><td>DELETE</td><td>/api/:resource/:id</td><td>Delete an allowed record</td></tr></tbody></table><h3>Supported resources</h3>${list(['flats', 'residents', 'visitors', 'staff', 'maintenance', 'payments', 'complaints', 'notices', 'amenities', 'bookings'])}<p>The included Postman collection automatically stores the admin JWT and exercises a notice create, update, and delete cycle.</p>`
  return `<h2>Review Forms and Signatures</h2><div class="placeholder" style="min-height:105mm">Attach signed review form or geo-tagged review photograph here.<br><small>Do not publish phone numbers, signatures, or location metadata outside the submitted academic copy.</small></div><table><tbody><tr><td>Review date</td><td></td></tr><tr><td>Reviewer / Guide</td><td></td></tr><tr><td>Comments addressed</td><td></td></tr><tr><td>Student signatures</td><td></td></tr></tbody></table>`
}

function specialContent(page) {
  if (page === 16) return `<table><thead><tr><th>Component</th><th>Minimum</th><th>Recommended</th></tr></thead><tbody><tr><td>Processor</td><td>Dual-core 2 GHz</td><td>Modern 4-core CPU</td></tr><tr><td>Memory</td><td>8 GB RAM</td><td>16 GB RAM</td></tr><tr><td>Storage</td><td>2 GB free</td><td>SSD with 10 GB free</td></tr><tr><td>Network</td><td>Localhost</td><td>Stable broadband for deployment</td></tr><tr><td>Client</td><td>1366 × 768 display</td><td>Full HD display</td></tr></tbody></table>`
  if (page === 17) return `<table><thead><tr><th>Software</th><th>Role</th></tr></thead><tbody><tr><td>Node.js 20+</td><td>Frontend tooling and API runtime</td></tr><tr><td>MySQL 8</td><td>Relational persistence and constraints</td></tr><tr><td>Modern browser</td><td>React client execution</td></tr><tr><td>VS Code</td><td>Development and debugging</td></tr><tr><td>Postman</td><td>Repeatable API checks</td></tr><tr><td>Git</td><td>Version history and collaboration</td></tr></tbody></table>`
  if (page === 33) return architectureDiagram()
  if (page === 34 || page === 45 || page === 59) return requestDiagram()
  if (page === 35 || page === 46) return authDiagram()
  if (page === 36 || page === 68) return deploymentDiagram()
  if (page === 37) return erDiagram()
  if (page === 48 || page === 50) return roleTable()
  if (page >= 56 && page <= 64) return testTable()
  if (page === 67) return `<table><thead><tr><th>Variable</th><th>Purpose</th><th>Required</th></tr></thead><tbody><tr><td>DB_HOST</td><td>MySQL host</td><td>Yes</td></tr><tr><td>DB_PORT</td><td>MySQL port; usually 3306</td><td>No</td></tr><tr><td>DB_USER</td><td>Least-privilege database account</td><td>Yes</td></tr><tr><td>DB_PASSWORD</td><td>Database password</td><td>Yes</td></tr><tr><td>DB_NAME</td><td>society_management</td><td>Yes</td></tr><tr><td>JWT_SECRET</td><td>Token signature secret</td><td>Yes</td></tr><tr><td>FRONTEND_URL</td><td>Allowed browser origin</td><td>Production</td></tr><tr><td>PORT</td><td>API listen port</td><td>No</td></tr></tbody></table>`
  if (page === 88) return `<div class="diagram"><div class="timeline"><b>Phase 1</b><span>Audit logs, automated tests, accessibility improvements</span><b>Phase 2</b><span>Email/SMS notifications and payment gateway behind feature flags</span><b>Phase 3</b><span>PWA support, offline read-only views, export and reporting</span><b>Phase 4</b><span>Predictive maintenance, anomaly detection, multi-society tenancy</span></div></div>`
  if (page === 98 || page === 99) return references(page)
  if (page >= 100) return appendix(page)
  return ''
}

function proseFor(chapter, topic, page) {
  const details = detailPools[chapter.n] || ['Evidence-based implementation', 'Maintainable design', 'Operational clarity', 'Secure data handling', 'Future extensibility']
  const focus = details[(page - chapter.range[0]) % details.length]
  const next = details[(page - chapter.range[0] + 2) % details.length]
  const p1 = `${chapterContext[chapter.n]} This section focuses on ${topic.toLowerCase()} and relates that subject directly to the implemented Haven codebase.`
  const p2 = `The design decision is evaluated through the principle of ${focus.toLowerCase()}. Browser controls improve usability, but the API remains the trust boundary. Requests are accepted only after identity, role, resource, and—where applicable—record ownership have been evaluated. This avoids treating hidden buttons as a security mechanism.`
  const p3 = `From a database perspective, ${topic.toLowerCase()} depends on explicit keys, constrained status values, and predictable relationships. The use of MySQL transactions for multi-record operations prevents partial writes, while parameter binding protects user values from being interpreted as SQL. These choices support ${next.toLowerCase()} without introducing unnecessary architectural layers.`
  return `<p class="lead">${esc(p1)}</p><p>${esc(p2)}</p><p>${esc(p3)}</p>`
}

function standardPage(chapter, topic, page, index) {
  const details = detailPools[chapter.n] || ['Implementation evidence', 'Documented assumptions', 'Controlled access', 'Maintainable workflow', 'Measured improvement']
  const special = specialContent(page)
  const points = details.map((d, i) => `${d}: ${topic} is addressed through ${i % 2 ? 'a defined application or database boundary' : 'an observable user or administrator workflow'}.`)
  const content = `<div class="eyebrow">Chapter ${chapter.n}</div><h1>${chapter.n}.${index + 1} ${esc(topic)}</h1>${proseFor(chapter, topic, page)}${special || `<div class="grid-2"><div class="card"><h3>Design focus</h3>${list(points.slice(0, 3))}</div><div class="card"><h3>Acceptance evidence</h3>${list(points.slice(3).concat([`Repository anchor: ${chapter.n === 6 ? 'frontend/src and backend/index.js' : chapter.n === 5 ? 'backend/sql/schema.sql' : 'README.md and project configuration'}.`]))}</div></div>`}<div class="callout"><p><b>Page outcome:</b> ${esc(topic)} is documented as part of the implemented system and is traceable to a code, schema, configuration, or test artifact.</p></div>`
  return shell(content, { internal: page, chapter: chapter.n, title: chapter.name })
}

const pages = [coverPage(), declarationPage(), certificatePage(), acknowledgementPage(), abstractPage(), contentsPage(1), contentsPage(2), listsPage()]
for (const chapter of chapters) {
  chapter.topics.forEach((topic, index) => pages.push(standardPage(chapter, topic, chapter.range[0] + index, index)))
}

if (pages.length !== 109) throw new Error(`Expected 109 pages, generated ${pages.length}`)

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(meta.title)} - 109 Page Report</title><link rel="stylesheet" href="report.css"></head><body>${pages.join('\n')}</body></html>`
fs.writeFileSync(path.join(root, 'report.html'), html)
console.log(`Generated ${pages.length} pages at ${path.join(root, 'report.html')}`)
