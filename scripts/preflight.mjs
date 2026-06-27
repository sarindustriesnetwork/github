#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function assertFile(relativePath) {
  if (!exists(relativePath)) fail(`Missing required file: ${relativePath}`);
}

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
  "package.json",
  ".npmrc",
  ".env.example",
  ".gitignore",
  "next.config.mjs",
  "tsconfig.json",
  "apphosting.yaml",
  "firebase.json",
  "firestore.rules",
  "firestore.indexes.json",
  "README.md",
  "SECURITY.md",
  ".github/workflows/build.yml",
  "app/page.tsx",
  "app/login/page.tsx",
  "app/admin/page.tsx",
  "app/admin/users/page.tsx",
  "app/admin/stores/page.tsx",
  "app/admin/security/page.tsx",
  "app/dashboard/store-builder/page.tsx",
  "app/api/health/route.ts",
  "app/api/deployment/status/route.ts",
  "app/api/firebase/status/route.ts",
  "app/api/admin/stores/route.ts",
  "app/api/auth/login/route.ts",
  "app/api/auth/logout/route.ts",
  "app/api/auth/me/route.ts",
  "components/stores/StoreManagementClient.tsx",
  "lib/stores.ts",
  "lib/firebase/admin.ts",
  "lib/firebase/client.ts",
  "lib/firebase/stores.ts",
  "scripts/verify-firebase.mjs",
  "scripts/preflight.mjs",
  "scripts/sar_firebase_manager.py",
  "docs/FIREBASE_MIGRATION.md",
  "docs/STEP_2_5_FIREBASE_BACKEND.md"
];

for (const file of requiredFiles) assertFile(file);

if (exists("package.json")) {
  const pkg = readJson("package.json");
  const requiredScripts = ["dev", "build", "start", "typecheck", "check", "preflight", "verify:firebase", "firebase:emulators", "platform", "platform:all"];
  for (const script of requiredScripts) {
    if (!pkg.scripts?.[script]) fail(`Missing package script: ${script}`);
  }
  if (!pkg.dependencies?.firebase) fail("Missing Firebase web SDK dependency.");
  if (!pkg.dependencies?.["firebase-admin"]) fail("Missing Firebase Admin SDK dependency.");
  if (!pkg.devDependencies?.["firebase-tools"]) fail("Missing Firebase CLI dev dependency.");
  if (!pkg.engines?.node) warn("package.json does not define engines.node.");
}

if (exists(".npmrc")) {
  const npmrc = read(".npmrc");
  if (!npmrc.includes("registry=https://registry.npmjs.org/")) fail(".npmrc must force the public npm registry.");
}

if (exists("apphosting.yaml")) {
  const appHosting = read("apphosting.yaml");
  if (!appHosting.includes("runConfig:")) fail("apphosting.yaml must define Firebase App Hosting runConfig.");
  if (!appHosting.includes("maxInstances:")) fail("apphosting.yaml must define maxInstances.");
  if (!appHosting.includes("NEXT_PUBLIC_FIREBASE_ENABLED")) fail("apphosting.yaml must expose Firebase enabled flag.");
}

if (exists(".env")) warn("Local .env exists. Confirm it is not committed and does not contain production secrets.");

const scannedFiles = walk(".");
const forbiddenPatterns = [
  "packages.applied-caas-gateway",
  "applied-caas-gateway",
  "_authToken=",
  "DEFAULT_ADMIN_PASSWORD=Admin@",
  "DATABASE_URL=postgres://",
  "DATABASE_URL=postgresql://",
  "BEGIN PRIVATE KEY",
  "BEGIN RSA PRIVATE KEY",
  "render.yaml",
  "deploy-render",
  "verify-render",
  "RENDER_",
  "onrender.com"
];

for (const file of scannedFiles) {
  const relative = path.relative(root, file).replace(/\\/g, "/");
  if (/\.(png|jpg|jpeg|webp|gif|ico|zip|pdf)$/i.test(relative)) continue;
  const content = fs.readFileSync(file, "utf8");
  for (const pattern of forbiddenPatterns) {
    if (content.includes(pattern)) fail(`Forbidden pattern found in ${relative}: ${pattern}`);
  }
}

console.log("SAR INDUSTRIES NETWORK — Firebase Preflight Audit");
console.log("Node:", process.version);
console.log("Checked files:", requiredFiles.length);
console.log("Warnings:", warnings.length);
for (const message of warnings) console.log("WARN:", message);

if (failures.length > 0) {
  console.log("Failures:", failures.length);
  for (const message of failures) console.error("FAIL:", message);
  process.exit(1);
}

console.log("Firebase preflight audit passed.");
