#!/usr/bin/env node

const baseUrl = (process.argv[2] || process.env.LOCAL_APP_URL || "http://localhost:3000").replace(/\/$/, "");
const timeoutMs = Number(process.env.LOCAL_VERIFY_TIMEOUT_MS || 10000);

const checks = [
  { path: "/", expected: [200], label: "Landing page" },
  { path: "/api/health", expected: [200], label: "Health API", json: true },
  { path: "/api/deployment/status", expected: [200], label: "Local status API", json: true },
  { path: "/api/admin/stores", expected: [200], label: "Stores API", json: true },
  { path: "/login", expected: [200], label: "Login page" },
  { path: "/admin", expected: [200, 307, 308], label: "Admin page" },
  { path: "/admin/users", expected: [200, 307, 308], label: "Users page" },
  { path: "/admin/stores", expected: [200, 307, 308], label: "Stores page" },
  { path: "/admin/security", expected: [200, 307, 308], label: "Security page" },
  { path: "/dashboard/store-builder", expected: [200, 307, 308], label: "Store Builder page" }
];

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { redirect: "manual", signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

const results = [];
for (const check of checks) {
  const started = Date.now();
  const url = `${baseUrl}${check.path}`;
  try {
    const response = await fetchWithTimeout(url);
    const durationMs = Date.now() - started;
    const statusOk = check.expected.includes(response.status);
    let jsonOk = true;
    let note = "";

    if (check.json && statusOk) {
      const data = await response.json().catch(() => null);
      jsonOk = Boolean(data?.ok);
      if (!jsonOk) note = "JSON response missing ok:true";
      if (check.path === "/api/deployment/status" && data?.backend?.cloudIntegrations !== false) {
        jsonOk = false;
        note = "Status API did not confirm cloudIntegrations:false";
      }
    }

    results.push({ ...check, status: response.status, durationMs, pass: statusOk && jsonOk, note });
  } catch (error) {
    results.push({ ...check, status: "FETCH_ERROR", durationMs: Date.now() - started, pass: false, error: error instanceof Error ? error.message : String(error) });
  }
}

console.log("\nSAR INDUSTRIES NETWORK — Localhost Verification Report");
console.log("Target:", baseUrl);
console.log("Generated:", new Date().toISOString());
console.log("--------------------------------------------------");
for (const result of results) {
  console.log(`${result.pass ? "PASS" : "FAIL"} | ${result.label} | ${result.path} | status=${result.status} | ${result.durationMs}ms`);
  if (result.note) console.log(`     Note: ${result.note}`);
  if (result.error) console.log(`     Error: ${result.error}`);
}
console.log("--------------------------------------------------");
const failed = results.filter((item) => !item.pass);
console.log(`Passed: ${results.length - failed.length}/${results.length}`);
if (failed.length > 0) process.exit(1);
console.log("Localhost verification passed.");
