#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];

function fail(message) { failures.push(message); }
function warn(message) { warnings.push(message); }
function exists(relativePath) { return fs.existsSync(path.join(root, relativePath)); }
function read(relativePath) { return fs.readFileSync(path.join(root, relativePath), "utf8"); }
function readJson(relativePath) { return JSON.parse(read(relativePath)); }
function assertFile(relativePath) { if (!exists(relativePath)) fail(`Missing required file: ${relativePath}`); }

function walk(dir, ignored = new Set([".git", "node_modules", ".next", "out", "coverage"])) {
  const fullDir = path.join(root, dir);
  if (!fs.existsSync(fullDir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(fullDir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const relative = path.join(dir, entry.name);
    const full = path.join(root, relative);
    if (entry.isDirectory()) files.push(...walk(relative, ignored));
    else files.push(full);
  }
  return files;
}

const nodeMajor = Number(process.versions.node.split(".")[0]);
if (nodeMajor < 20) fail(`Node.js 20+ is required. Current version: ${process.version}`);

const requiredFiles = [
  "package.json", ".npmrc", ".env.example", ".gitignore", "next.config.mjs", "tsconfig.json", "README.md", "SECURITY.md", ".github/workflows/build.yml",
  "app/page.tsx", "app/login/page.tsx", "app/admin/page.tsx", "app/admin/users/page.tsx", "app/admin/stores/page.tsx", "app/admin/security/page.tsx", "app/dashboard/store-builder/page.tsx",
  "app/api/health/route.ts", "app/api/deployment/status/route.ts", "app/api/admin/stores/route.ts", "app/api/auth/login/route.ts", "app/api/auth/logout/route.ts", "app/api/auth/me/route.ts",
  "components/stores/StoreManagementClient.tsx", "lib/stores.ts", "scripts/verify-local.mjs", "scripts/preflight.mjs", "ONE_CLICK_WINDOWS_11.bat", "START_HERE_WINDOWS.bat", "docs/LOCAL_WINDOWS_11_SETUP.md"
];
for (const file of requiredFiles) assertFile(file);

if (exists("package.json")) {
  const pkg = readJson("package.json");
  const requiredScripts = ["dev", "build", "start", "typecheck", "check", "preflight", "verify:local"];
  for (const script of requiredScripts) if (!pkg.scripts?.[script]) fail(`Missing package script: ${script}`);
  const forbiddenDependencies = ["firebase", "firebase-admin", "firebase-tools", "@prisma/client", "prisma"];
  for (const dep of forbiddenDependencies) if (pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]) fail(`Remove local-only forbidden dependency: ${dep}`);
  if (!pkg.engines?.node) warn("package.json does not define engines.node.");
}

if (exists(".npmrc") && !read(".npmrc").includes("registry=https://registry.npmjs.org/")) fail(".npmrc must force the public npm registry.");

for (const file of ["render.yaml", "apphosting.yaml", "firebase.json", "firestore.rules", "firestore.indexes.json", ".firebaserc", ".firebaserc.example"]) {
  if (exists(file)) fail(`Cloud integration file must be removed: ${file}`);
}

if (exists(".env")) warn("Local .env exists. Confirm it is not committed.");

const forbiddenPatterns = ["packages.applied-caas-gateway", "applied-caas-gateway", "_authToken=", "firebase-admin", "firebase/app", "cloud.firestore", "onrender.com", "render.yaml"];
for (const file of walk(".")) {
  const relative = path.relative(root, file).replace(/\\/g, "/");
  if (relative === "scripts/preflight.mjs") continue;
  if (/\.(png|jpg|jpeg|webp|gif|ico|zip|pdf)$/i.test(relative)) continue;
  const content = fs.readFileSync(file, "utf8");
  for (const pattern of forbiddenPatterns) if (content.includes(pattern)) fail(`Forbidden pattern found in ${relative}: ${pattern}`);
}

console.log("SAR INDUSTRIES NETWORK — Windows Localhost Preflight Audit");
console.log("Node:", process.version);
console.log("Checked files:", requiredFiles.length);
console.log("Warnings:", warnings.length);
for (const message of warnings) console.log("WARN:", message);
if (failures.length > 0) {
  console.log("Failures:", failures.length);
  for (const message of failures) console.error("FAIL:", message);
  process.exit(1);
}
console.log("Windows localhost preflight audit passed.");
