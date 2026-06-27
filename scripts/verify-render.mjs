#!/usr/bin/env node

const baseUrl = (process.argv[2] || process.env.RENDER_URL || "").replace(/\/$/, "");

if (!baseUrl) {
  console.error("Missing Render URL. Usage: npm run verify:render -- https://your-service.onrender.com");
  process.exit(1);
}

const checks = [
  { path: "/", expected: [200], label: "Landing page" },
  { path: "/api/health", expected: [200], label: "Health API" },
  { path: "/api/deployment/status", expected: [200], label: "Deployment status API" },
  { path: "/login", expected: [200], label: "Login page" },
  { path: "/admin", expected: [200, 307, 308], label: "Admin page" },
  { path: "/admin/users", expected: [200, 307, 308], label: "Users page" },
  { path: "/admin/security", expected: [200, 307, 308], label: "Security/RBAC page" },
  { path: "/dashboard/store-builder", expected: [200, 307, 308], label: "Store Builder page" }
];

const results = [];

for (const check of checks) {
  const url = `${baseUrl}${check.path}`;
  const started = Date.now();
  try {
    const response = await fetch(url, { redirect: "manual" });
    const durationMs = Date.now() - started;
    const pass = check.expected.includes(response.status);
    results.push({ ...check, url, status: response.status, durationMs, pass });
  } catch (error) {
    results.push({ ...check, url, status: "FETCH_ERROR", durationMs: Date.now() - started, pass: false, error: error.message });
  }
}

console.log("\nSAR INDUSTRIES NETWORK — Render Verification Report");
console.log("Target:", baseUrl);
console.log("Generated:", new Date().toISOString());
console.log("--------------------------------------------------");

for (const result of results) {
  const icon = result.pass ? "PASS" : "FAIL";
  console.log(`${icon} | ${result.label} | ${result.path} | status=${result.status} | ${result.durationMs}ms`);
  if (result.error) console.log(`     Error: ${result.error}`);
}

const failed = results.filter((item) => !item.pass);
console.log("--------------------------------------------------");
console.log(`Passed: ${results.length - failed.length}/${results.length}`);

if (failed.length > 0) {
  console.error("Render verification failed. Check failed routes above and review Render build/runtime logs.");
  process.exit(1);
}

console.log("Render verification passed.");
