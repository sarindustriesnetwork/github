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
  "render.yaml",
  "README.md",
  "SECURITY.md",
  ".github/workflows/build.yml",
  "app/page.tsx",
  "app/login/page.tsx",
  "app/admin/page.tsx",
  "app/admin/users/page.tsx",
  "app/admin/security/page.tsx",
  "app/dashboard/store-builder/page.tsx",
  "app/api/health/route.ts",
  "app/api/deployment/status/route.ts",
  "app/api/auth/login/route.ts",
  "app/api/auth/logout/route.ts",
  "app/api/auth/me/route.ts",
  "scripts/verify-render.mjs",
  "scripts/deploy-render.mjs"
];

for (const file of requiredFiles) assertFile(file);

if (exists("package.json")) {
  const pkg = readJson("package.json");
  const requiredScripts = ["dev", "build", "start", "typecheck", "check", "preflight", "deploy:render", "verify:render"];
  for (const script of requiredScripts) {
    if (!pkg.scripts?.[script]) fail(`Missing package script: ${script}`);
  }
  if (!pkg.engines?.node) warn("package.json does not define engines.node.");
}

if (exists(".npmrc")) {
  const npmrc = read(".npmrc");
  if (!npmrc.includes("registry=https://registry.npmjs.org/")) fail(".npmrc must force the public npm registry.");
}

if (exists("render.yaml")) {
  const renderYaml = read("render.yaml");
  if (!renderYaml.includes("type: web")) fail("render.yaml must configure a Render web service.");
  if (!renderYaml.includes("env: node")) fail("render.yaml must use Node runtime.");
  if (!renderYaml.includes("npm install --registry=https://registry.npmjs.org/ && npm run build")) fail("render.yaml buildCommand is not aligned with project setup.");
  if (!renderYaml.includes("npm run start")) fail("render.yaml startCommand must run npm run start.");
  if (!renderYaml.includes("sync: false")) fail("render.yaml must keep DEFAULT_ADMIN_PASSWORD as a secret prompt using sync:false.");
}

if (exists(".env")) warn("Local .env exists. Confirm it is not committed and does not contain production secrets.");

const scannedFiles = walk(".");
const forbiddenPatterns = [
  "packages.applied-caas-gateway",
  "applied-caas-gateway",
  "_authToken=",
  "DEFAULT_ADMIN_PASSWORD=Admin@",
  "DATABASE_URL=postgres://",
  "DATABASE_URL=postgresql://"
];

for (const file of scannedFiles) {
  const relative = path.relative(root, file).replace(/\\/g, "/");
  if (/\.(png|jpg|jpeg|webp|gif|ico|zip|pdf)$/i.test(relative)) continue;
  const content = fs.readFileSync(file, "utf8");
  for (const pattern of forbiddenPatterns) {
    if (content.includes(pattern)) fail(`Forbidden pattern found in ${relative}: ${pattern}`);
  }
}

console.log("SAR INDUSTRIES NETWORK — Preflight Audit");
console.log("Node:", process.version);
console.log("Checked files:", requiredFiles.length);
console.log("Warnings:", warnings.length);
for (const message of warnings) console.log("WARN:", message);

if (failures.length > 0) {
  console.log("Failures:", failures.length);
  for (const message of failures) console.error("FAIL:", message);
  process.exit(1);
}

console.log("Preflight audit passed.");
